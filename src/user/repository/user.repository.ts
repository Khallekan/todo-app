import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: [{ email }],
    });
  }

  async findOneById(id: string) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
}
