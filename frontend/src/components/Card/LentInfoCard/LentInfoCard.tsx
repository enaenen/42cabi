import styled from "styled-components";
import Card from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentDeatilStyled,
  ContentInfoStyled,
} from "@/components/Card/CardStyles";
import { MyCabinetInfo } from "@/components/Card/LentInfoCard/LentInfoCard.container";
import {
  cabinetIconSrcMap,
  cabinetLabelColorMap,
  cabinetStatusColorMap,
} from "@/assets/data/maps";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { formatDate, getRemainingTime } from "@/utils/dateUtils";

const LentInfoCard = ({
  cabinetInfo,
  bannedAt,
}: {
  cabinetInfo: MyCabinetInfo;
  bannedAt: boolean;
}) => {
  const calculateFontSize = (userCount: number): string => {
    const baseSize = 1;
    const decrement = 0.2;
    const minSize = 0.6;
    const calculatedSize = Math.max(
      baseSize - (userCount - 1) * decrement,
      minSize
    );
    return `${calculatedSize}rem`;
  };
  return (
    <Card
      title={"대여정보"}
      gridArea={"lentInfo"}
      width={"350px"}
      height={"366px"}
    >
      <>
        <CabinetInfoWrapper>
          <CabinetRectangleStyled
            status={cabinetInfo.status as CabinetStatus}
            banned={!!bannedAt}
          >
            {cabinetInfo.visibleNum !== 0
              ? cabinetInfo.visibleNum
              : !!bannedAt
              ? "!"
              : "-"}
          </CabinetRectangleStyled>
          <CabinetInfoDetailStyled>
            <CabinetInfoTextStyled
              fontSize="1rem"
              fontColor="var(--gray-color)"
            >
              {cabinetInfo.floor !== 0
                ? cabinetInfo.floor + "층 - " + cabinetInfo.section
                : ""}
            </CabinetInfoTextStyled>
            {cabinetInfo?.isLented && (
              <CabinetUserListWrapper>
                <CabinetIconStyled
                  title={cabinetInfo.lentType}
                  cabinetType={cabinetInfo.lentType}
                />
                <CabinetInfoTextStyled
                  fontSize={calculateFontSize(cabinetInfo.userCount)}
                  fontColor="black"
                >
                  {cabinetInfo.userNameList}
                </CabinetInfoTextStyled>
              </CabinetUserListWrapper>
            )}
          </CabinetInfoDetailStyled>
        </CabinetInfoWrapper>
        <CardContentWrapper>
          <CardContentStyled>
            <ContentInfoStyled>사용 기간</ContentInfoStyled>
            <ContentDeatilStyled>
              {cabinetInfo?.isLented
                ? `${
                    cabinetInfo.lentType === "PRIVATE"
                      ? parseInt(import.meta.env.VITE_PRIVATE_LENT_PERIOD)
                      : parseInt(import.meta.env.VITE_SHARE_LENT_PERIOD)
                  }일`
                : "-"}
            </ContentDeatilStyled>
          </CardContentStyled>
          <CardContentStyled>
            <ContentInfoStyled>남은 기간</ContentInfoStyled>
            <ContentDeatilStyled>
              {cabinetInfo?.expireDate
                ? getRemainingTime(cabinetInfo?.expireDate) + "일"
                : "-"}
            </ContentDeatilStyled>
          </CardContentStyled>
          <CardContentStyled>
            <ContentInfoStyled>종료 일자</ContentInfoStyled>
            <ContentDeatilStyled>
              {cabinetInfo?.expireDate
                ? formatDate(new Date(cabinetInfo?.expireDate), ".")
                : "-"}
            </ContentDeatilStyled>
          </CardContentStyled>
        </CardContentWrapper>
        <CardContentWrapper>
          <CardContentStyled>
            <ContentInfoStyled>이전 대여자</ContentInfoStyled>
            <ContentDeatilStyled>
              {cabinetInfo?.previousUserName || "-"}
            </ContentDeatilStyled>
          </CardContentStyled>
        </CardContentWrapper>
      </>
    </Card>
  );
};

const CabinetInfoWrapper = styled.div`
  display: flex;
  width: 85%;
  margin: 10px 0 15px 0;
  align-items: center;
`;

const CabinetRectangleStyled = styled.div<{
  status: CabinetStatus;
  banned?: boolean;
}>`
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 10px;
  margin-right: 20px;
  background-color: ${(props) =>
    props.banned
      ? "var(--expired)"
      : props.status === "FULL"
      ? "var(--mine)"
      : cabinetStatusColorMap[props.status]};
  color: ${(props) =>
    props.banned
      ? "var(--white)"
      : props.status && props.status !== "PENDING"
      ? cabinetLabelColorMap[props.status]
      : "var(--black)"};
  font-size: 2rem;
  text-align: center;
`;

const CabinetInfoDetailStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CabinetInfoTextStyled = styled.div<{
  fontSize: string;
  fontColor: string;
}>`
  font-size: ${(props) => props.fontSize};
  font-weight: 400;
  line-height: 28px;
  color: ${(props) => props.fontColor};
  text-align: center;
  white-space: pre-line;
`;

const CabinetUserListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CabinetIconStyled = styled.div<{ cabinetType: CabinetType }>`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  background-image: url(${(props) => cabinetIconSrcMap[props.cabinetType]});
  background-size: contain;
  background-repeat: no-repeat;
`;

export default LentInfoCard;
