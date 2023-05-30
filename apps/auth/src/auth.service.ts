import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CreateUserRequest } from './users/dto/create-user.request';
import { User } from './users/schemas/user.schema';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: CreateUserRequest) {}

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  private newRefreshAndAccessToken(
    user: User,
  ) /* : Promise<{ accessToken: string; refreshToken: string }> */ {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const EXPIRES_ACCESS_TOKEN = `${this.configService.get('JWT_EXPIRATION')}s`;
    const EXPIRES_REFRESH_TOKEN = `${this.configService.get(
      'JWT_REFRESH_EXPIRATION',
    )}s`;

    const accessToken = this.jwtService.sign(
      { tokenPayload },
      { expiresIn: EXPIRES_ACCESS_TOKEN },
    );

    const refreshToken = this.jwtService.sign(
      { tokenPayload },
      {
        expiresIn: EXPIRES_REFRESH_TOKEN,
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
