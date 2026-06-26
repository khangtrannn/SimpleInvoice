import { UserEntity } from '../../users/entities/user.entity';
import { toAuthUserResponse } from './auth-user-response.mapper';

describe(toAuthUserResponse.name, () => {
  it('should map UserEntity to AuthUserResponseDto without exposing passwordHash', () => {
    // Arrange
    const user = {
      id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
      email: 'reviewer@simpleinvoice.local',
      passwordHash: '$2b$12$hashed-password',
      fullname: 'SimpleInvoice Reviewer',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    } as UserEntity;

    // Act
    const result = toAuthUserResponse(user);

    // Assert
    expect(result).toEqual({
      id: user.id,
      email: user.email,
      fullname: user.fullname,
    });
    expect(result).not.toHaveProperty('passwordHash');
  });
});