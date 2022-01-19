import mariadb from 'mariadb'
import { userList, lentInfo, cabinetList, cabinetInfo, lentCabinetInfo } from '../user'

const con = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: '42cabi_DB',
	dateStrings: true
});

//사용자 확인 - 사용자가 없는 경우, addUser, 있는 경우, getUser
export async function checkUser(accessToken: any) {
	let pool: mariadb.PoolConnection;
	let lentCabinet: lentCabinetInfo;
	const idx = userList.findIndex((user) => user.access === accessToken)
	if (idx === -1)
		return undefined;
	const content: string = `select * from user where user_id = ${userList[idx].user_id}`;
	try {
		pool = await con.getConnection();
		lentCabinet = await pool.query(content).then(async (res: any) => {
			console.log(res);
			if (!res.length) {
				addUser(idx);
				return ({
					lent_id: -1,
					lent_cabinet_id: -1,
					lent_user_id: -1,
					lent_time: '',
					expire_time: '',
					extension: false,
					cabinet_num: -1,
					location: '',
					floor: -1,
					section: '',
					activation: false
				});
			}
			else {
				lentCabinet = await getUser(userList[idx]);

			}
			return lentCabinet;
		})
	}
	catch (err) {
		console.log(err);
		throw err;
	}
	if (pool) pool.end();
	return lentCabinet;
}

//사용자가 없는 경우, user 값 생성
export async function addUser(idx: number) {
	let pool: mariadb.PoolConnection;
	console.log('addUser');
	const content: string = `insert into user value('${userList[idx].user_id}', '${userList[idx].intra_id}', ${userList[idx].auth}, '${userList[idx].email}', '${userList[idx].phone}')`;
	pool = await con.getConnection();
	await pool.query(content).then((res: any) => {
		console.log(res);
	}).catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
}
//본인 정보 및 렌트 정보 - 리턴 페이지
export async function getUser(user: any): Promise<lentCabinetInfo> {
	console.log('getUser')
	let pool: mariadb.PoolConnection;
	const content: string = `select * from lent l join cabinet c on l.lent_cabinet_id=c.cabinet_id where l.lent_user_id='${user.user_id}'`;
	let lentCabinet: lentCabinetInfo;
	pool = await con.getConnection();
	lentCabinet = await pool.query(content).then((res: any) => {
		if (res.length !== 0) { // lent page
			lentCabinet = ({
				lent_id: res[0].lent_id,
				lent_cabinet_id: res[0].lent_cabinet_id,
				lent_user_id: res[0].lent_user_id,
				lent_time: res[0].lent_time,
				expire_time: res[0].expire_time,
				extension: res[0].extension,
				cabinet_num: res[0].cabinet_num,
				location: res[0].location,
				floor: res[0].floor,
				section: res[0].section,
				activation: res[0].activation,
			})
		}
		else {
			lentCabinet = ({
				lent_id: -1,
				lent_cabinet_id: -1,
				lent_user_id: -1,
				lent_time: '',
				expire_time: '',
				extension: false,
				cabinet_num: -1,
				location: '',
				floor: -1,
				section: '',
				activation: false
			})
		}
		return (lentCabinet);
	}).catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
	return (lentCabinet);
}
//lent & user
export async function getLentUser() {
	let pool: mariadb.PoolConnection;
	const content = `select u.intra_id, l.* from user u right join lent l on l.lent_user_id=u.user_id`;
	console.log('getLentUser');
	let lentInfo: Array<lentInfo> = [];
	pool = await con.getConnection();
	await pool.query(content).then((res: any) => {
		console.log('res.length');
		console.log(res.length);
		for (let i = 0; i < res.length; i++) {
			lentInfo.push({
				lent_id: res[i].lent_id,
				lent_cabinet_id: res[i].lent_cabinet_id,
				lent_user_id: res[i].lent_user_id,
				lent_time: res[i].lent_time,
				expire_time: res[i].expire_time,
				extension: res[i].extension,
				intra_id: res[i].intra_id,
			});
		}
	}).catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
	return { lentInfo: lentInfo };
}
//lent 값 생성
export async function createLent(cabinet_id: number, user: any) {
	let pool: mariadb.PoolConnection;
	console.log('user');
	console.log(user);
	const content: string = `INSERT INTO lent (lent_cabinet_id, lent_user_id, lent_time, expire_time, extension) VALUES (${cabinet_id}, ${user.userid}, now(), ADDDATE(now(), 30), 0)`;
	pool = await con.getConnection();
	await pool.query(content).then((res: any) => {
		console.log(res);
	}).catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
}

//lent_log 값 생성 후 lent 값 삭제
export async function createLentLog(user: any) {
	let pool: mariadb.PoolConnection;
	console.log(user);
	const content: string = `select * from lent where lent_user_id=${user.userid}`;
	pool = await con.getConnection();
	await pool.query(content).then((res: any) => {
		if (res[0] === undefined)
			return;
		const lent_id = res[0].lent_id;
		const user_id = res[0].lent_user_id;
		const cabinet_id = res[0].lent_cabinet_id;
		const lent_time = res[0].lent_time;
		pool.query(`insert into lent_log (log_user_id, log_cabinet_id, lent_time, return_time) values (${user_id}, ${cabinet_id}, '${lent_time}', now())`);
		pool.query(`delete from lent where lent_cabinet_id=${cabinet_id}`)
	}).catch((err: any) => {
		console.log(err);
		throw err;
	});
	if (pool) pool.end();
}
