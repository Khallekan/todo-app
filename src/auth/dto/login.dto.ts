import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password field cannot be empty' })
  @IsString({ message: 'Password field must be a string' })
  password: string;
}
