import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { trimLowercaseString } from '../../common/transforms/string.transforms';

export class LoginRequestDto {
  @ApiProperty({
    example: 'reviewer@simpleinvoice.local',
  })
  @Transform(({ value }) => trimLowercaseString(value))
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    format: 'password',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password!: string;
}
