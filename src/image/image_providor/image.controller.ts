import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './images.service';
import { ApiTags } from '@nestjs/swagger';
import {
  AddImageToProductDoc,
  DeleteImageFromProductDoc,
} from 'src/common/swagger/ImageDoc/image.swagger.decorator';
import { IsAdminGuard } from 'src/common/guard/is_admin.guard';
import { IsLoggedInGuard } from 'src/common/guard/is_logged_user.guard';

class createImageDto {
  productId: number;
  isCover: boolean;
}

@Controller('image')
@UseGuards(IsLoggedInGuard, IsAdminGuard)
@ApiTags('images')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('/')
  @AddImageToProductDoc()
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
  @DeleteImageFromProductDoc()
  async deleteImageFromProduct(@Param('href') href: string) {
    return await this.imageService.delete(href);
  }
}
