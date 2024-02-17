import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as Redis from 'ioredis';
import { _convert_bigint_tostring } from 'src/common/interceptor/transform_bigint.interceptor';
const config = new ConfigService();

@Injectable()
export class RedisService {
  private readonly client: Redis.Redis;

  constructor() {
    this.client = new Redis.Redis({
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
    });
  }
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(
        key,
        JSON.stringify(_convert_bigint_tostring(value)),
        'EX',
        ttl,
      );
    } else {
      await this.client.set(
        key,
        JSON.stringify(_convert_bigint_tostring(value)),
      );
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
