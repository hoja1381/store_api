import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { UserModule } from './user/user.module';
import { VerifyUser } from './common/middleware/verify_cookie';
import { ProductModule } from './product/product.module';
import { ImageStorageModule } from './image/image_storage/image_storage.module';
import { ImageController } from './image/image_providor/image.controller';
import { ImageModule } from './image/image_providor/image.module';
import { CardModule } from './card/card.module';
import { OrderModule } from './order/order.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule,
    DatabaseModule,
    UserModule,
    ProductModule,
    ImageStorageModule,
    ImageModule,
    CardModule,
    OrderModule,
  ],
  controllers: [ImageController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyUser).forRoutes('*');
  }
}
