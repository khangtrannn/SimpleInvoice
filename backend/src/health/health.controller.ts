import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({
    description: 'Backend health check',
    schema: {
      example: {
        status: 'ok',
        service: 'simple-invoice-backend',
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      service: 'simple-invoice-backend',
    };
  }
}