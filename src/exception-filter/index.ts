import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const response: { status: number; message: string; data: null } = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unhandled Exception',
      data: null,
    };

    if (exception instanceof HttpException) {
      response.status = exception.getStatus();
      response.message = exception.message;

      return httpAdapter.reply(ctx.getResponse(), response, response.status);
    }
  }
}
