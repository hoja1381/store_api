import { _convert_bigint_tostring } from '../../common/interceptor/transform_bigint.interceptor';
import { RedisService } from './rdis.service';
const cacheService = new RedisService();

export const Cache =
  (ttl: number) =>
  <T extends (...args: any[]) => any>(
    target: any,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void => {
    const func = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = generateCacheKey(target, func.name, args);
      let cachedResult = await cacheService.get(cacheKey);

      if (cachedResult) {
        return JSON.parse(_convert_bigint_tostring(cachedResult));
      }
      const result = await func.apply(this, args);

      if (result !== null && !(Array.isArray(result) && result.length === 0)) {
        await cacheService.set(cacheKey, result, ttl);
      }

      return result;
    } as T;
  };

function generateCacheKey(
  target: any,
  methodName: string,
  args: any[],
): string {
  const serializedArgs = JSON.stringify(_convert_bigint_tostring(args));
  return `${target.constructor.name}:${methodName}:${serializedArgs}`;
}
