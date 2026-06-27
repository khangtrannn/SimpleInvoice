import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AccessTokenService } from './services/access-token.service';
import { verifyPassword } from './utils/password.util';

jest.mock('./utils/password.util', () => ({
  verifyPassword: jest.fn(),
}));

const mockedVerifyPassword = verifyPassword as jest.MockedFunction<
  typeof verifyPassword
>;

describe(AuthService.name, () => {
  let authService: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, 'findByEmail'>>;
  let accessTokenService: jest.Mocked<Pick<AccessTokenService, 'issueForUser'>>;

  const mockUser: UserEntity = {
    id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
    email: 'reviewer@simpleinvoice.local',
    passwordHash: '$2b$12$hashed-password',
    fullname: 'SimpleInvoice Reviewer',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };

    accessTokenService = {
      issueForUser: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: AccessTokenService,
          useValue: accessTokenService,
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return login response when credentials are valid', async () => {
      // Arrange
      const loginRequest = {
        email: 'reviewer@simpleinvoice.local',
        password: 'Password123!',
      };

      usersService.findByEmail.mockResolvedValue(mockUser);
      mockedVerifyPassword.mockResolvedValue(true);
      accessTokenService.issueForUser.mockResolvedValue({
        accessToken: 'signed-access-token',
        expiresIn: 3600,
      });

      // Act
      const result = await authService.login(loginRequest);

      // Assert
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginRequest.email);
      expect(mockedVerifyPassword).toHaveBeenCalledWith(
        loginRequest.password,
        mockUser.passwordHash,
      );
      expect(accessTokenService.issueForUser).toHaveBeenCalledWith(mockUser);

      expect(result).toEqual({
        accessToken: 'signed-access-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          fullname: mockUser.fullname,
        },
      });
      expect(result).not.toHaveProperty('user.passwordHash');
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      const loginRequest = {
        email: 'missing@simpleinvoice.local',
        password: 'Password123!',
      };

      usersService.findByEmail.mockResolvedValue(null);

      // Act
      const act = authService.login(loginRequest);

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      expect(mockedVerifyPassword).not.toHaveBeenCalled();
      expect(accessTokenService.issueForUser).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const loginRequest = {
        email: 'reviewer@simpleinvoice.local',
        password: 'wrong-password',
      };

      usersService.findByEmail.mockResolvedValue(mockUser);
      mockedVerifyPassword.mockResolvedValue(false);

      // Act
      const act = authService.login(loginRequest);

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      expect(accessTokenService.issueForUser).not.toHaveBeenCalled();
    });
  });
});
