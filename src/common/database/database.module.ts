import { Global, Module } from '@nestjs/common';
import { DatabaseRepo } from './database.service';

@Global()
@Module({
  providers: [DatabaseRepo],
  exports: [DatabaseRepo],
})
export class DatabaseModule {}
