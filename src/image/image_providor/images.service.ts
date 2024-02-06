import {
  BadGatewayException,
  BadRequestException,
  Injectable,
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
    const savedImagePath = await this.imagesStorageService.save(image);
    if (!savedImagePath)
      throw new BadRequestException(" couldn't save the image");

    const dbImage = await this.databaseRepo.image.create({
      data: { href: savedImagePath, isCover, productId },
    });

    return dbImage;
  }

  async delete(imagePath: string) {
    const isDeleted = await this.imagesStorageService.delete(imagePath);
    if (!isDeleted) throw new BadGatewayException('couldnt delete the image!');

    const imageInDb = await this.databaseRepo.image.findFirst({
      where: { href: imagePath },
    });

    return await this.databaseRepo.image.delete({
      where: { id: imageInDb.id },
    });
  }
}
