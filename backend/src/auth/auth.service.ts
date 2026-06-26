import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { toAuthUserResponse } from './mappers/auth-user-response.mapper';
import { AccessTokenService } from './services/access-token.service';
import { verifyPassword } from './utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginRequestDto.email);

    if (!user) {
      throw this.invalidCredentialsError();
    }

    const isPasswordValid = await verifyPassword(
      loginRequestDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw this.invalidCredentialsError();
    }

    const issuedToken = await this.accessTokenService.issueForUser(user);

    return {
      accessToken: issuedToken.accessToken,
      tokenType: 'Bearer',
      expiresIn: issuedToken.expiresIn,
      user: toAuthUserResponse(user),
    };
  }

  private invalidCredentialsError(): UnauthorizedException {
    return new UnauthorizedException('Invalid email or password');
  }
}