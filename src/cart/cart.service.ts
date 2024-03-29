import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-card.dto';
import { DatabaseRepo } from '../common/database/database.service';
import { ProductService } from '../product/product.service';
import { UpdateCartDto } from './dto/update-card.dto';

@Injectable()
export class CartService {
  constructor(
    private databaseRepo: DatabaseRepo,
    private productService: ProductService,
  ) {}

  async findByUser(user_id: number) {
    const carts = await this.databaseRepo.cart.findMany({
      where: { user_id },
      include: {
        products: {
          select: { productId: true, product: true, productQty: true },
        },
        User: {
          select: { id: true, fullName: true, email: true, address: true },
        },
      },
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
      include: {
        products: {
          select: { productId: true, product: true, productQty: true },
        },
        User: {
          select: { id: true, fullName: true, email: true, address: true },
        },
      },
    });

    if (!cart) throw new NotFoundException(`cart not found with this id=${id}`);

    return cart;
  }

  async create(data: CreateCartDto, user_id: number) {
    if (!data || !user_id)
      throw new BadRequestException('product IDs and userId must be provided.');

    const productIds = new Set<number>();
    for (const product of data.products) {
      if (productIds.has(product.productId)) {
        throw new BadRequestException('Duplicate product IDs are not allowed.');
      }
      productIds.add(product.productId);
    }
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

    return await this.findOne(cart.id);
  }

  async addProductToCart(id: number, data: UpdateCartDto) {
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

    return await this.findOne(id);
  }

  async deleteProductFromCart(id: number, data: UpdateCartDto) {
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

    return await this.findOne(id);
  }

  async remove(id: number) {
    if (!id) throw new BadRequestException('id must be provided');

    const cart = await this.findOne(id);

    for (const obj of cart.products) {
      await this.databaseRepo.cartToProduct.delete({
        where: {
          cartId_productId: { cartId: id, productId: obj.productId },
        },
      });
    }

    return await this.databaseRepo.cart.delete({
      where: { id },
      include: {
        products: {
          select: { productId: true, product: true, productQty: true },
        },
        User: {
          select: { id: true, fullName: true, email: true, address: true },
        },
      },
    });
  }
}
