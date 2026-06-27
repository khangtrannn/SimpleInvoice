import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

export async function getAuthToken(
  app: INestApplication<App>,
  email: string,
  password: string,
): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(201);

  return res.body.accessToken as string;
}
