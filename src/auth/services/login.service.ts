import { BadRequestException, Injectable } from '@nestjs/common';
import { GlobalResponseType } from 'src/types/response.type';
import { UserRepository } from 'src/user/repository/user.repository';

import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly userRepostiory: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async login({ email, password }: LoginDto): GlobalResponseType {
    const user = await this.userRepostiory.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid: boolean =
      await this.authService.comparePasswordHashes(user.password, password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const tokens = await this.authService.signTokens(user);

    return {
      message: 'User logged in successfully',
      data: {
        ...tokens,
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }
}
