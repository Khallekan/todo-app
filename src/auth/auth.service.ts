import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { validationSchema } from 'src/configuration';
import { ArgonType, IMPORTS_KEY } from 'src/imports/types';
import { JwtPayloadType } from 'src/types/jwt-token.type';
import { User } from 'src/user/entities';
import { z } from 'zod';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<
      z.infer<typeof validationSchema>
    >,
    private readonly jwt: JwtService,
    @Inject(IMPORTS_KEY.ARGON) private readonly argonService: ArgonType,
  ) {}

  async signTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: JwtPayloadType = {
      id: user.id,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
    });

    return { access_token, refresh_token };
  }

  async comparePasswordHashes(hash: string, plain: string) {
    return await this.argonService.verify(hash, plain, {
      secret: Buffer.from(
        this.configService.get('ARGON_PASSWORD_SECRET') as Buffer,
      ),
    });
  }
}
