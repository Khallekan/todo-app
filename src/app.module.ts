import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config, validate, validationSchema } from './configuration';
import { ImportsModule } from './imports/imports.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { TaskModule } from './task/task.module';
import { TypeOrmConfigService } from './typeorm/typeorm.providers';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      cache: true,
      validate,
      validationSchema,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),

    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),

    AuthModule,

    UserModule,

    TaskModule,

    ImportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
