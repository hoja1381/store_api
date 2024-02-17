import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export function _convert_bigint_tostring(input: any) {
  if (Array.isArray(input)) {
    return input.map((item) => _convert_bigint_tostring(item));
  } else if (typeof input === 'object' && input !== null) {
    const result: any = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        result[key] = _convert_bigint_tostring(input[key]);
      }
    }
    return result;
  } else if (typeof input === 'bigint') {
    return input.toString();
  }
  return input;
}

export class TransformBigint implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((response) => {
        const res = { response };
        const transformedRes = _convert_bigint_tostring(res);
        return transformedRes.response;
      }),
    );
  }
}
