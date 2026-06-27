import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { HealthController } from './health/health.controller';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesService } from './invoices/invoices.service';
import { UsersService } from './users/users.service';

// Stub module — no database, no real services.
// NestJS only needs the DI graph to resolve; no methods are ever called.
@Module({
  controllers: [AuthController, InvoicesController, HealthController],
  providers: [
    { provide: APP_GUARD, useValue: { canActivate: () => true } },
    { provide: AuthService, useValue: {} },
    { provide: InvoicesService, useValue: {} },
    { provide: UsersService, useValue: {} },
    { provide: JwtAuthGuard, useValue: { canActivate: () => true } },
    { provide: HealthCheckService, useValue: {} },
    { provide: TypeOrmHealthIndicator, useValue: {} },
  ],
})
class SwaggerAppModule {}

async function generateSwagger() {
  const app = await NestFactory.create(SwaggerAppModule, { logger: false });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SimpleInvoice API')
    .setDescription('REST API for the SimpleInvoice project')
    .setVersion('1.0')
    .addServer('http://localhost:4000')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  const outputPath = resolve(process.cwd(), 'swagger.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log(`OpenAPI spec written to ${outputPath}`);

  await app.close();
}

generateSwagger().catch((err) => {
  console.error(err);
  process.exit(1);
});
