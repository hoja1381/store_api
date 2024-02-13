import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseRepo } from '../common/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private databaseRepo: DatabaseRepo) {}

  async create(data: CreateProductDto) {
    if (Object.keys(data).length <= 0)
      throw new BadRequestException('data must be provided.');

    const duplicateProduct = await this.databaseRepo.product.findUnique({
      where: { name: data.name },
    });

    if (duplicateProduct)
      throw new BadRequestException(
        `there is existing product whit this name=${data.name}`,
      );

    return await this.databaseRepo.product.create({ data: data });
  }

  async findAll(skip?: number, take?: number) {
    const count = await this.databaseRepo.product.count();
    const products = await this.databaseRepo.product.findMany({
      include: { images: true },
      skip: skip || 0,
      take: take || 10,
    });

    if (products.length <= 0)
      throw new NotFoundException('there is no product to show.');

    return { products, count };
  }

  async findOne(id: number, withImages: boolean) {
    if (!id) throw new BadRequestException('id must be provided');

    const product = await this.databaseRepo.product.findUnique({
      where: { id },
      include: { images: withImages },
    });

    if (!product)
      throw new NotFoundException(`product not found with this Id= ${id}`);

    return product;
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    if (Object.keys(data).length <= 0)
      throw new BadRequestException('data must be provided.');

    if (!id) throw new BadRequestException('id must be provided');

    try {
      return await this.databaseRepo.product.update({
        where: { id },
        data,
      });
    } catch (err) {
      throw new NotFoundException(`product not found with this id=${id}`);
    }
  }

  async remove(id: number) {
    if (!id) throw new BadRequestException('id must be provided');
    try {
      return await this.databaseRepo.product.delete({ where: { id } });
    } catch (err) {
      throw new NotFoundException(`product not found with this id=${id}`);
    }
  }
}
