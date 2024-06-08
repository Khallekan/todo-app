import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],

  providers: [UserRepository],

  exports: [TypeOrmModule, UserRepository],
})
export class UserModule {}
