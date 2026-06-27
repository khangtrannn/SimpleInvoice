import * as bcrypt from 'bcrypt';

import { verifyPassword } from './password.util';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockedBcryptCompare = bcrypt.compare as unknown as jest.Mock<
  Promise<boolean>,
  [string, string]
>;

describe(verifyPassword.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate password verification to bcrypt.compare', async () => {
    // Arrange
    mockedBcryptCompare.mockResolvedValue(true);

    // Act
    const result = await verifyPassword('Password123!', '$2b$12$hash');

    // Assert
    expect(mockedBcryptCompare).toHaveBeenCalledWith(
      'Password123!',
      '$2b$12$hash',
    );
    expect(result).toBe(true);
  });
});
