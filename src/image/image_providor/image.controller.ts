import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './images.service';
import { ApiTags } from '@nestjs/swagger';

class createImageDto {
  productId: number;
  isCover: boolean;
}

@Controller('image')
@ApiTags('images')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async addImageToProduct(
    @Body() body: any,
    @UploadedFile(new ParseFilePipe()) image: Express.Multer.File,
  ) {
    if (!+body.productId) throw new BadRequestException('id must be a number');

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
