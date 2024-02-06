import {
  BadGatewayException,
  Body,
  Controller,
  Delete,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './images.service';

class createImageDto {
  product_id: number;
  isCover: boolean;
}

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async addImageToProduct(
    @Body() body: createImageDto,
    @UploadedFile(new ParseFilePipe()) image: Express.Multer.File,
  ) {
    return await this.imageService.save(image, body.product_id, body.isCover);
  }

  @Delete('/:href')
  async deleteImageFromProduct(@Query('href') imagePath: string) {
    const result = await this.imageService.delete(imagePath);
    if (!result) throw new BadGatewayException('couldnt delete image.');

    return result;
  }
}
