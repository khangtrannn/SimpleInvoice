import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ type: Number, example: 400 })
  statusCode!: number;

  @ApiProperty({
    type: String,
    example: 'Bad Request',
    description: 'Error message, or array of validation error strings',
  })
  message!: string | string[];

  @ApiPropertyOptional({ type: String, example: 'Bad Request' })
  error?: string;

  @ApiProperty({ type: String, example: '2026-06-27T10:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ type: String, example: '/auth/login' })
  path!: string;
}
