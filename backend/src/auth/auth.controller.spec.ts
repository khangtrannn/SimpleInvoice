import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthenticatedUser } from './types/authenticated-request.type';

describe(AuthController.name, () => {
  let authController: AuthController;
  let authService: jest.Mocked<Pick<AuthService, 'login'>>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    authController = moduleRef.get(AuthController);
  });

  describe('login', () => {
    it('should delegate login request to AuthService', async () => {
      // Arrange
      const loginRequest = {
        email: 'reviewer@simpleinvoice.local',
        password: 'Password123!',
      };

      const loginResponse: LoginResponseDto = {
        accessToken: 'signed-access-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
          email: 'reviewer@simpleinvoice.local',
          fullname: 'SimpleInvoice Reviewer',
        },
      };

      authService.login.mockResolvedValue(loginResponse);

      // Act
      const result = await authController.login(loginRequest);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(loginRequest);
      expect(result).toEqual(loginResponse);
    });
  });

  describe('getMe', () => {
    it('should return the authenticated user from request context', () => {
      // Arrange
      const currentUser: AuthenticatedUser = {
        id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
        email: 'reviewer@simpleinvoice.local',
        fullname: 'SimpleInvoice Reviewer',
      };

      // Act
      const result = authController.getMe(currentUser);

      // Assert
      expect(result).toEqual(currentUser);
    });
  });
});