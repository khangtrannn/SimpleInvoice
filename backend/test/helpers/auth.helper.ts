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

export function authedRequest(app: INestApplication<App>, token: string) {
  const server = app.getHttpServer();
  const auth = `Bearer ${token}`;
  return {
    get: (url: string) => request(server).get(url).set('Authorization', auth),
    post: (url: string) => request(server).post(url).set('Authorization', auth),
    put: (url: string) => request(server).put(url).set('Authorization', auth),
    patch: (url: string) =>
      request(server).patch(url).set('Authorization', auth),
    delete: (url: string) =>
      request(server).delete(url).set('Authorization', auth),
  };
}
