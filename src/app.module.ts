import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './user/user.module';
import { VerifyUser } from './common/middleware/verify_cookie';
import { ProductModule } from './product/product.module';
import { ImageStorageModule } from './image/image_storage/image_storage.module';
import { ImageController } from './image/image_providor/image.controller';
import { ImageModule } from './image/image_providor/image.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { RedisModule } from './common/redis/redis.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './common/interceptor/logger.interceptor';
import { GlobalExceptionFilter } from './common/filter/global_exception.filter';
import { CustomLoggerService } from './common/logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule,
    DatabaseModule,
    UserModule,
    ProductModule,
    ImageStorageModule,
    ImageModule,
    CartModule,
    OrderModule,
  ],
  controllers: [ImageController],
  providers: [
    CustomLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyUser).forRoutes('*');
  }
}
