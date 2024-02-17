import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisService } from './rdis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  static register(): DynamicModule {
    return {
      module: RedisModule,
      providers: [RedisService],
      exports: [RedisService],
    };
  }
}
