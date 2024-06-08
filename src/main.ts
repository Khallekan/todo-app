import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { z } from 'zod';

import { AppModule } from './app.module';
import { validationSchema } from './configuration/configuration.validation';
import { exceptionFactory } from './exception-factory';
import { AllExceptionsFilter } from './exception-filter';
import { ResponseInterceptor } from './response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory,
    }),
  );

  app.setGlobalPrefix('/api/v1');

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const port = app
    .get(ConfigService<z.infer<typeof validationSchema>>)
    .get<number>('PORT');

  await app.listen(port as number, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${port}`);
  });
}
bootstrap();
