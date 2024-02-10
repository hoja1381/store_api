import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseRepo } from 'src/database/database.service';
import { ImageStorageService } from '../image_storage/Images_storage.service';

@Injectable()
export class ImageService {
  constructor(
    private databaseRepo: DatabaseRepo,
    private imagesStorageService: ImageStorageService,
  ) {}

  async save(image: Express.Multer.File, productId: number, isCover: boolean) {
    // check the Cover to be singular
    const isCoverCheck = await this.databaseRepo.image.findFirst({
      where: { isCover: true, productId: productId },
    });

    if (isCoverCheck && isCover)
      throw new BadRequestException(
        'you cant upload more than one cover for each product.',
      );

    //save the images
    const savedImagePath = await this.imagesStorageService.save(image);
    if (!savedImagePath)
      throw new BadRequestException(" couldn't save the image");

    // check the product id to ref a real product in db
    const productRef = await this.databaseRepo.product.findUnique({
      where: { id: productId },
    });
    if (!productRef) {
      await this.imagesStorageService.delete(savedImagePath);
      throw new NotFoundException('productId is not correct.');
    }

    // create the image in db and return it
    return await this.databaseRepo.image.create({
      data: { href: savedImagePath, isCover, productId },
    });
  }

  async delete(imagePath: string) {
    const imageInDb = await this.databaseRepo.image.findFirst({
      where: { href: imagePath },
    });
    if (!imageInDb)
      throw new NotFoundException('the image is already has been deleted');

    const isDeleted = await this.imagesStorageService.delete(imagePath);
    if (!isDeleted) throw new BadGatewayException('couldnt delete the image!');

    return await this.databaseRepo.image.delete({
      where: { id: imageInDb.id },
    });
  }
}
