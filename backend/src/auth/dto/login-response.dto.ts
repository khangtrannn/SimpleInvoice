import { ApiProperty } from '@nestjs/swagger';

import { AuthUserResponseDto } from './auth-user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    example: 'Bearer',
  })
  tokenType!: 'Bearer';

  @ApiProperty({
    example: 3600,
    description: 'Access token lifetime in seconds',
  })
  expiresIn!: number;

  @ApiProperty({
    type: AuthUserResponseDto,
  })
  user!: AuthUserResponseDto;
}