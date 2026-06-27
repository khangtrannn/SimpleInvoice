import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';

import { REVIEWER_USER } from '../src/database/seed/seed.constants';
import { createTestApp } from './helpers/app.helper';
import { getAuthToken } from './helpers/auth.helper';
import { seedTestUser } from './helpers/user.helper';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeAll(async () => {
    ({ app, dataSource } = await createTestApp());
    await seedTestUser(
      dataSource,
      REVIEWER_USER.email,
      REVIEWER_USER.password,
      REVIEWER_USER.fullname,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should return 201 with a JWT response when credentials are valid', async () => {
      // Arrange
      const credentials = {
        email: REVIEWER_USER.email,
        password: REVIEWER_USER.password,
      };

      // Act
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(credentials);

      // Assert
      expect(res.status).toBe(201);
      expect(typeof res.body.accessToken).toBe('string');
      expect(res.body.tokenType).toBe('Bearer');
      expect(typeof res.body.expiresIn).toBe('number');
      expect(res.body.user).toMatchObject({
        id: expect.any(String),
        email: REVIEWER_USER.email,
        fullname: REVIEWER_USER.fullname,
      });
    });

    it('should return 401 when the password is wrong', async () => {
      // Act
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: REVIEWER_USER.email, password: 'WrongPassword!' });

      // Assert
      expect(res.status).toBe(401);
    });

    it('should return 401 when the email is not registered', async () => {
      // Act
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nobody@example.com', password: REVIEWER_USER.password });

      // Assert
      expect(res.status).toBe(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return 200 with the current user when the token is valid', async () => {
      // Arrange
      const token = await getAuthToken(
        app,
        REVIEWER_USER.email,
        REVIEWER_USER.password,
      );

      // Act
      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        email: REVIEWER_USER.email,
        fullname: REVIEWER_USER.fullname,
      });
    });

    it('should return 401 when no token is provided', async () => {
      // Act
      const res = await request(app.getHttpServer()).get('/auth/me');

      // Assert
      expect(res.status).toBe(401);
    });

    it('should return 401 when the token is malformed', async () => {
      // Act
      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer this.is.not.valid');

      // Assert
      expect(res.status).toBe(401);
    });
  });
});
