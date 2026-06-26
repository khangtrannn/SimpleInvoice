import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '../../users/entities/user.entity';
import type { JwtPayload } from '../types/jwt-payload.type';

export type IssuedAccessToken = {
  accessToken: string;
  expiresIn: number;
};

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async issueForUser(user: UserEntity): Promise<IssuedAccessToken> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      expiresIn: this.getExpiresInSeconds(),
    };
  }

  private getExpiresInSeconds(): number {
    return this.configService.getOrThrow<number>('auth.jwtExpiresIn');
  }
}