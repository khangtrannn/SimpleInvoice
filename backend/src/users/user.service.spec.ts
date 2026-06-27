import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe(UsersService.name, () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<
    Pick<UsersRepository, 'findByEmail' | 'findById'>
  >;

  const mockUser = {
    id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
    email: 'reviewer@simpleinvoice.local',
    passwordHash: '$2b$12$hashed-password',
    fullname: 'SimpleInvoice Reviewer',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  } as UserEntity;

  beforeEach(async () => {
    usersRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepository,
        },
      ],
    }).compile();

    usersService = moduleRef.get(UsersService);
  });

  describe('findByEmail', () => {
    it('should normalize email and find user by email', async () => {
      // Arrange
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await usersService.findByEmail(
        '  Reviewer@SimpleInvoice.Local  ',
      );

      // Assert
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'reviewer@simpleinvoice.local',
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found by email', async () => {
      // Arrange
      usersRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await usersService.findByEmail('missing@example.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      // Arrange
      usersRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await usersService.findById(mockUser.id);

      // Assert
      expect(usersRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found by id', async () => {
      // Arrange
      usersRepository.findById.mockResolvedValue(null);

      // Act
      const result = await usersService.findById(
        '00000000-0000-0000-0000-000000000000',
      );

      // Assert
      expect(result).toBeNull();
    });
  });
});
