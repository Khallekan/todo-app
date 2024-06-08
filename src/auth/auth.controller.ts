import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GlobalResponseType } from 'src/types/response.type';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerDto: RegisterDto): GlobalResponseType {
    return this.registerService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto): GlobalResponseType {
    return this.loginService.login(loginDto);
  }
}
