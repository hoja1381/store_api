import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../logger/logger.service';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: CustomLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      this.logger.error(
        `${exception.getStatus()} - err: ${exception.name} - message: ${exception.message}`,
        'err-logs',
      );

      return res.status(status).json({
        data: exception.getResponse(),
        date: new Date().toISOString(),
        path: req.path,
      });
    }

    this.logger.warn(`${req.path} =>  ${exception}`, 'err-logs');

    res.status(500).json({
      statusCode: 500,
      date: new Date().toLocaleDateString(),
      massage: 'Internal server err',
      data: exception.massage,
      path: req.path,
    });
  }
}
