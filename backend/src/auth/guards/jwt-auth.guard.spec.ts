import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
import { JwtAuthGuard } from './jwt-auth.guard';

describe(JwtAuthGuard.name, () => {
  let guard: JwtAuthGuard;
  let jwtService: jest.Mocked<Pick<JwtService, 'verifyAsync'>>;
  let usersService: jest.Mocked<Pick<UsersService, 'findById'>>;

  const mockUser = {
    id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
    email: 'reviewer@simpleinvoice.local',
    passwordHash: '$2b$12$hashed-password',
    fullname: 'SimpleInvoice Reviewer',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  } as UserEntity;

  function createExecutionContext(
    request: Partial<AuthenticatedRequest>,
  ): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  }

  beforeEach(async () => {
    jwtService = {
      verifyAsync: jest.fn(),
    };

    usersService = {
      findById: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    guard = moduleRef.get(JwtAuthGuard);
  });

  describe('canActivate', () => {
    it('should allow request and attach authenticated user when token is valid', async () => {
      // Arrange
      const request = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      } as Partial<AuthenticatedRequest>;

      jwtService.verifyAsync.mockResolvedValue({
        sub: mockUser.id,
        email: mockUser.email,
      });

      usersService.findById.mockResolvedValue(mockUser);

      const context = createExecutionContext(request);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
      expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
      expect(request.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        fullname: mockUser.fullname,
      });
    });

    it('should throw UnauthorizedException when authorization header is missing', async () => {
      // Arrange
      const request = {
        headers: {},
      } as Partial<AuthenticatedRequest>;

      const context = createExecutionContext(request);

      // Act
      const act = guard.canActivate(context);

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
      expect(usersService.findById).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when authorization scheme is not Bearer', async () => {
      // Arrange
      const request = {
        headers: {
          authorization: 'Basic invalid-token',
        },
      } as Partial<AuthenticatedRequest>;

      const context = createExecutionContext(request);

      // Act
      const act = guard.canActivate(context);

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
      expect(usersService.findById).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token verification fails', async () => {
      // Arrange
      const request = {
        headers: {
          authorization: 'Bearer expired-token',
        },
      } as Partial<AuthenticatedRequest>;

      jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      const context = createExecutionContext(request);

      // Act
      const act = guard.canActivate(context);

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('expired-token');
      expect(usersService.findById).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token payload has no subject', async () => {
      // Arrange
      const request = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      } as Partial<AuthenticatedRequest>;

      jwtService.verifyAsync.mockResolvedValue({
        email: 'reviewer@simpleinvoice.local',
      });

      const context = createExecutionContext(request);

      // Act
      const act = guard.canActivate(context);

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      expect(usersService.findById).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token user no longer exists', async () => {
      // Arrange
      const request = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      } as Partial<AuthenticatedRequest>;

      jwtService.verifyAsync.mockResolvedValue({
        sub: mockUser.id,
        email: mockUser.email,
      });

      usersService.findById.mockResolvedValue(null);

      const context = createExecutionContext(request);

      // Act
      const act = guard.canActivate(context);

      // Assert
      await expect(act).rejects.toThrow(UnauthorizedException);
      expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
    });
  });
});