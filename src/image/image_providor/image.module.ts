import { Module } from '@nestjs/common';
import { ImageStorageModule } from '../image_storage/image_storage.module';
import { ImageStorageService } from '../image_storage/Images_storage.service';
import { ImageService } from './images.service';
import { ImageController } from './image.controller';

@Module({
  imports: [ImageStorageModule],
  controllers: [ImageController],
  providers: [ImageStorageService, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
