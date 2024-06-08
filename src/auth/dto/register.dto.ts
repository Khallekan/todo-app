import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

import { EmailNotRegistered } from '../decorator/check-email-registered.decorator';

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

export class RegisterDto {
  @EmailNotRegistered({ message: 'User with email - $value - already exists' })
  @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
  @IsEmail(undefined, { message: 'Please provide a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long and contain a number, a lowercase letter and an uppercase letter',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
