import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from '../../users/entities/user.entity';
import { AccessTokenService } from './access-token.service';

describe(AccessTokenService.name, () => {
  let accessTokenService: AccessTokenService;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;
  let configService: jest.Mocked<Pick<ConfigService, 'getOrThrow'>>;

  const mockUser: UserEntity = {
    id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
    email: 'reviewer@simpleinvoice.local',
    passwordHash: '$2b$12$hashed-password',
    fullname: 'SimpleInvoice Reviewer',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    jwtService = {
      signAsync: jest.fn(),
    };

    configService = {
      getOrThrow: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenService,
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

    accessTokenService = moduleRef.get(AccessTokenService);
  });

  describe('issueForUser', () => {
    it('should sign JWT payload and return issued access token', async () => {
      // Arrange
      jwtService.signAsync.mockResolvedValue('signed-access-token');
      configService.getOrThrow.mockReturnValue(3600);

      // Act
      const result = await accessTokenService.issueForUser(mockUser);

      // Assert
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(configService.getOrThrow).toHaveBeenCalledWith(
        'auth.jwtExpiresIn',
      );
      expect(result).toEqual({
        accessToken: 'signed-access-token',
        expiresIn: 3600,
      });
    });
  });
});
