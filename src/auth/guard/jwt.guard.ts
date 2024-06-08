import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';

export class AccessJwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<User = unknown>(err: unknown, user: User, info: unknown): User {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token expired.');
    }

    if (err instanceof UnauthorizedException) {
      throw new UnauthorizedException(err.message);
    }

    if (info instanceof JsonWebTokenError || !user) {
      throw new UnauthorizedException('Token missing or invalid');
    }

    return user;
  }
}
