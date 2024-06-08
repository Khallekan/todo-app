import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { validationSchema } from 'src/configuration';
import { JwtPayloadType } from 'src/types/jwt-token.type';
import { UserRepository } from 'src/user/repository/user.repository';
import { z } from 'zod';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService<z.infer<typeof validationSchema>>,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate({ id }: JwtPayloadType) {
    if (!id) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
