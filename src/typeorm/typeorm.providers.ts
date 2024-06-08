import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { EnviromentsEnum, validationSchema } from 'src/configuration';
import { z } from 'zod';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private config: ConfigService<z.infer<typeof validationSchema>>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('POSTGRES_PORT'),
      database: this.config.get<string>('DATABASE_NAME'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('POSTGRES_PASSWORD'),
      logger: 'advanced-console',
      logging: true,
      synchronize:
        this.config.get<string>('NODE_ENV') === EnviromentsEnum.Development ||
        this.config.get<string>('NODE_ENV') === EnviromentsEnum.Test, // never use TRUE in production!

      retryAttempts: 1,
      autoLoadEntities: true,
      migrations: ['src/migration/*.ts'],
      migrationsTableName: 'migrations',
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
    };
  }
}
