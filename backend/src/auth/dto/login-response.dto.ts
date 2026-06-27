import { ApiProperty } from '@nestjs/swagger';

import { AuthUserResponseDto } from './auth-user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    type: String,
    example: 'Bearer',
  })
  tokenType!: 'Bearer';

  @ApiProperty({
    type: Number,
    example: 3600,
    description: 'Access token lifetime in seconds',
  })
  expiresIn!: number;

  @ApiProperty({
    type: AuthUserResponseDto,
  })
  user!: AuthUserResponseDto;
}
