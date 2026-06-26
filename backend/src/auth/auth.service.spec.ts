import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe(AuthService.name, () => {
  let authService: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, 'findByEmail'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;
  let configService: jest.Mocked<Pick<ConfigService, 'getOrThrow'>>;
  const bcryptCompare = bcrypt.compare as unknown as jest.MockedFunction<
    (data: string | Buffer, encrypted: string) => Promise<boolean>
  >;

  const mockUser = {
    id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
    email: 'reviewer@simpleinvoice.local',
    passwordHash: '$2b$12$hashed-password',
    fullname: 'SimpleInvoice Reviewer',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  } as UserEntity;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    configService = {
      getOrThrow: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should return an access token and safe user profile when credentials are valid', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('signed-access-token');
      configService.getOrThrow.mockReturnValue(3600);
      bcryptCompare.mockResolvedValue(true);

      const loginRequest = {
        email: 'reviewer@simpleinvoice.local',
        password: 'Password123!',
      };

      // Act
      const result = await authService.login(loginRequest);

      // Assert
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginRequest.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginRequest.password,
        mockUser.passwordHash,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(configService.getOrThrow).toHaveBeenCalledWith('auth.jwtExpiresIn');

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

    it('should use configured auth.jwtExpiresIn', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('signed-access-token');
      configService.getOrThrow.mockReturnValue(900);
      bcryptCompare.mockResolvedValue(true);

      // Act
      const result = await authService.login({
        email: 'reviewer@simpleinvoice.local',
        password: 'Password123!',
      });

      // Assert
      expect(result.expiresIn).toBe(900);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(null);

      // Act
      const act = authService.login({
        email: 'unknown@simpleinvoice.local',
        password: 'Password123!',
      });

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(mockUser);
      bcryptCompare.mockResolvedValue(false);

      // Act
      const act = authService.login({
        email: 'reviewer@simpleinvoice.local',
        password: 'wrong-password',
      });

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

});
