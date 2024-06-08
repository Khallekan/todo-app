import { Injectable } from '@nestjs/common';
import { GlobalResponseType } from 'src/types/response.type';
import { UserRepository } from 'src/user/repository/user.repository';

import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class RegisterService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(registerDto: RegisterDto): GlobalResponseType {
    const user = this.userRepository.create(registerDto);

    await user.save();

    return {
      message: 'User created successfully',
      data: null,
    };
  }
}
