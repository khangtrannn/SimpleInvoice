import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

type MockRepository<T extends object = object> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe(UsersService.name, () => {
  let usersService: UsersService;
  let usersRepository: MockRepository<UserEntity>;

  const mockUser = {
    id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
    email: 'reviewer@simpleinvoice.local',
    passwordHash: '$2b$12$hashed-password',
    fullname: 'SimpleInvoice Reviewer',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  } as UserEntity;

  beforeEach(async () => {
    usersRepository = {
      findOne: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: usersRepository,
        },
      ],
    }).compile();

    usersService = moduleRef.get(UsersService);
  });

  describe('findByEmail', () => {
    it('should normalize email and find user by email', async () => {
      // Arrange
      usersRepository.findOne?.mockResolvedValue(mockUser);

      // Act
      const result = await usersService.findByEmail(
        '  Reviewer@SimpleInvoice.Local  ',
      );

      // Assert
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: {
          email: 'reviewer@simpleinvoice.local',
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found by email', async () => {
      // Arrange
      usersRepository.findOne?.mockResolvedValue(null);

      // Act
      const result = await usersService.findByEmail('missing@example.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      // Arrange
      usersRepository.findOne?.mockResolvedValue(mockUser);

      // Act
      const result = await usersService.findById(mockUser.id);

      // Assert
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockUser.id,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found by id', async () => {
      // Arrange
      usersRepository.findOne?.mockResolvedValue(null);

      // Act
      const result = await usersService.findById(
        '00000000-0000-0000-0000-000000000000',
      );

      // Assert
      expect(result).toBeNull();
    });
  });
});