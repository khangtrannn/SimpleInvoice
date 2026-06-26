import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({
    example: 'ad1e0902-1928-4345-b513-60c86c94fc91',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    example: 'reviewer@simpleinvoice.local',
  })
  email!: string;

  @ApiProperty({
    example: 'SimpleInvoice Reviewer',
  })
  fullname!: string;
}