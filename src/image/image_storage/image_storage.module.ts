import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImageStorageService } from './Images_storage.service';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: './Images',
        }),
      }),
    }),
  ],
  providers: [ImageStorageService],
  exports: [ImageStorageService],
})
export class ImageStorageModule {}
