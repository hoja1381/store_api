import {
  BadGatewayException,
  Body,
  Controller,
  Delete,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './images.service';

class createImageDto {
  productId: number;
  isCover: boolean;
}

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async addImageToProduct(
    @Body() body: any,
    @UploadedFile(new ParseFilePipe()) image: Express.Multer.File,
  ) {
    return await this.imageService.save(
      image,
      +body.productId,
      body.isCover == 'true',
    );
  }

  @Delete('/:href')
  async deleteImageFromProduct(@Param('href') href: string) {
    return await this.imageService.delete(href);
  }
}
