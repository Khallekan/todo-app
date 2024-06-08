import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  IsEmailNotRegistered,
  IsEmailRegistered,
} from './decorator/check-email-registered.decorator';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';
import { AccessJwtStrategy } from './strategy';

@Global()
@Module({
  imports: [PassportModule.register({}), JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [
    // Decorators
    IsEmailNotRegistered,
    IsEmailRegistered,

    // Services
    RegisterService,
    LoginService,
    AuthService,

    // Auth Strategy
    AccessJwtStrategy,
  ],
})
export class AuthModule {}
