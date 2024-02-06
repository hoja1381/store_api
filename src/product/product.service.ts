import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseRepo } from 'src/database/database.service';
import { ImageService } from 'src/image/image_providor/images.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private databaseRepo: DatabaseRepo) {}

  async create(data: Prisma.ProductCreateInput) {
    if (Object.keys(data).length <= 0)
      throw new BadRequestException('data must be provided.');

    return await this.databaseRepo.product.create({ data: data });
  }

  async findAll() {
    return await this.databaseRepo.product.findMany({
      include: { images: true },
    });
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException('id must be provided');

    return await this.databaseRepo.product.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    if (Object.keys(data).length <= 0)
      throw new BadRequestException('data must be provided.');

    if (!id) throw new BadRequestException('id must be provided');

    return await this.databaseRepo.product.update({ where: { id }, data });
  }

  async remove(id: number) {
    if (!id) throw new BadRequestException('id must be provided');

    return await this.databaseRepo.product.delete({ where: { id } });
  }
}
