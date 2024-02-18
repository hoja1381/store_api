import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { CustomLoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private logger: CustomLoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //get the request
    const request = context.switchToHttp().getRequest();

    // log incoming req in format (date-method-origin-path)
    this.logger.log(
      `${request.method}\t${request.headers.origin}${request.path}`,
      'server-logs',
    );

    return next.handle();
  }
}
