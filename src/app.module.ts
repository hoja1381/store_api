import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { VerifyUser } from './middleware/verify_cookie';
import { ProductModule } from './product/product.module';
import { ImageStorageModule } from './image/image_storage/image_storage.module';
import { ImageController } from './image/image_providor/image.controller';
import { ImageModule } from './image/image_providor/image.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UserModule,
    ProductModule,
    ImageStorageModule,
    ImageModule,
    CardModule,
  ],
  controllers: [ImageController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyUser).forRoutes('*');
  }
}
