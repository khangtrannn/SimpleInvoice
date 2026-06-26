import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import type { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.validateCredentials(loginRequestDto);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const expiresIn =
      this.configService.getOrThrow<number>('auth.jwtExpiresIn');

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user: this.toAuthUserResponse(user),
    };
  }

  private toAuthUserResponse(user: UserEntity): AuthUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
    };
  }

  private async validateCredentials(
    loginRequestDto: LoginRequestDto,
  ): Promise<UserEntity> {
    const user = await this.usersService.findByEmail(loginRequestDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequestDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }
}
