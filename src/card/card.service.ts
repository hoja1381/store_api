import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { DatabaseRepo } from 'src/database/database.service';
import { ProductService } from 'src/product/product.service';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    private databaseRepo: DatabaseRepo,
    private productService: ProductService,
  ) {}

  async create(data: CreateCardDto, user_id: number) {
    if (!data || !user_id)
      throw new BadRequestException('product IDs and userId must be provided.');

    const products = data.products?.map((product) => {
      return product;
    });

    let totalPrice = 0n;
    for (const obj of products) {
      const product = await this.productService.findOne(obj.productId, false);
      totalPrice += product.price * BigInt(obj.productQty);
    }

    const cart = await this.databaseRepo.cart.create({
      data: {
        User: { connect: { id: user_id } },
        totalPrice,
      },
    });

    const createData = data.products?.map((product) => {
      return { cartId: cart.id, ...product };
    });

    await this.databaseRepo.cartToProduct.createMany({
      data: createData,
    });

    return await this.databaseRepo.cart.findUnique({
      where: { id: cart.id },
      include: { products: true },
    });
  }

  async findByUser(user_id: number) {
    const carts = await this.databaseRepo.cart.findMany({
      where: { user_id },
      include: { products: true, User: true },
    });

    if (carts.length <= 0)
      throw new NotFoundException(
        `there is no cart for this user by id=${user_id}`,
      );

    return carts;
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException('id must be provided');

    const cart = await this.databaseRepo.cart.findUnique({
      where: { id },
      include: { products: true, User: true },
    });

    if (!cart) throw new NotFoundException(`cart not found with this id=${id}`);

    return cart;
  }

  async addProductToCart(id: number, data: UpdateCardDto) {
    const card = await this.findOne(id);
    const pivot = await this.databaseRepo.cartToProduct.findUnique({
      where: {
        cartId_productId: { cartId: card.id, productId: data.productId },
      },
    });

    card.totalPrice +=
      (await this.productService.findOne(data.productId, false)).price *
      BigInt(data.productQty);

    await this.databaseRepo.cart.update({
      where: { id },
      data: { totalPrice: card.totalPrice },
    });

    if (pivot) {
      await this.databaseRepo.cartToProduct.update({
        where: { cartId_productId: { cartId: id, productId: data.productId } },
        data: { productQty: pivot.productQty + data.productQty },
      });
    } else {
      await this.databaseRepo.cartToProduct.create({
        data: {
          productId: data.productId,
          cartId: id,
          productQty: data.productQty,
        },
      });
    }

    return await this.databaseRepo.cart.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  async deleteProductFromCart(id: number, data: UpdateCardDto) {
    const card = await this.findOne(id);
    const pivot = await this.databaseRepo.cartToProduct.findUnique({
      where: {
        cartId_productId: { cartId: card.id, productId: data.productId },
      },
    });

    if (data.productQty > pivot?.productQty || !pivot)
      throw new BadRequestException(
        'you cant delete more than the number exists in the cart',
      );

    card.totalPrice -=
      (await this.productService.findOne(data.productId, false)).price *
      BigInt(data.productQty);

    await this.databaseRepo.cart.update({
      where: { id },
      data: { totalPrice: card.totalPrice },
    });

    if (pivot.productQty - data.productQty > 0) {
      await this.databaseRepo.cartToProduct.update({
        where: { cartId_productId: { cartId: id, productId: data.productId } },
        data: { productQty: pivot.productQty - data.productQty },
      });
    } else if (pivot.productQty - data.productQty == 0) {
      await this.databaseRepo.cartToProduct.delete({
        where: { cartId_productId: { cartId: id, productId: data.productId } },
      });
    }

    return await this.databaseRepo.cart.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  async remove(id: number) {
    if (!id) throw new BadRequestException('id must be provided');

    const cart = await this.findOne(id);

    for (const obj of cart.products) {
      await this.databaseRepo.cartToProduct.delete({
        where: {
          cartId_productId: { cartId: obj.cartId, productId: obj.productId },
        },
      });
    }

    return await this.databaseRepo.cart.delete({
      where: { id },
    });
  }
}
