import { ApiProperty } from '@nestjs/swagger';

export class BlockedUserInfoDto {
  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  intra_id: string; // 42 로그인 ID

  @ApiProperty({
    description: '캐비닛 위치',
    example: '1f-100',
  })
  location: string;

  @ApiProperty({
    description: '연체일 수',
    example: '100',
  })
  overdueDays: number;

}
