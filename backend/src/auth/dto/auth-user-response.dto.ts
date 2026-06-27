import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({
    type: String,
    example: 'ad1e0902-1928-4345-b513-60c86c94fc91',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    type: String,
    example: 'reviewer@simpleinvoice.local',
  })
  email!: string;

  @ApiProperty({
    type: String,
    example: 'SimpleInvoice Reviewer',
  })
  fullname!: string;
}
