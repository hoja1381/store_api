import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseRepo } from '../common/database/database.service';
import { CartService } from '../cart/cart.service';
import { User } from '@prisma/client';
import { Cache } from '../common/redis/cashe.decorator';

@Injectable()
export class OrderService {
  constructor(
    private databaseRepo: DatabaseRepo,
    private cartService: CartService,
  ) {}

  async create(data: CreateOrderDto, user: User) {
    if (!data) throw new BadRequestException('body data should be provided.');

    const cart = await this.cartService.findOne(data.cart_id);
    if (!cart)
      throw new NotFoundException(
        `cart not found with this id=${data.cart_id}`,
      );

    if (user.id !== cart.user_id)
      throw new ForbiddenException('you cant access that card!!');

    const finalPrice =
      Number(cart.totalPrice) -
      Number(cart.totalPrice) * ((data.discount || 0) / 100);

    const productIDs = cart.products.map((product) => {
      return { id: product.productId };
    });

    const newOrder = await this.databaseRepo.order.create({
      data: {
        totalPrice: cart.totalPrice,
        finalPrice,
        product: { connect: productIDs },
        User: { connect: { id: user.id } },
        discount: data.discount,
        address: cart.User.address,
      },
      include: {
        User: {
          select: { id: true, email: true },
        },
        product: true,
      },
    });

    await this.cartService.remove(cart.id);

    return newOrder;
  }

  async findByUser(user_id: number) {
    if (!user_id) throw new BadRequestException('user id should be provided.');

    const orders = await this.databaseRepo.order.findMany({
      where: { user_id },
      include: {
        User: {
          select: { id: true, email: true },
        },
        product: true,
      },
    });

    if (orders.length <= 0)
      throw new NotFoundException(
        `orders notfound for user with id=${user_id}`,
      );

    return orders;
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException('order id should be provided.');

    const order = await this.databaseRepo.order.findUnique({
      where: { id },
      include: {
        User: {
          select: { id: true, email: true },
        },
        product: true,
      },
    });

    if (!order) throw new NotFoundException(`order notfound  with id=${id}`);

    return order;
  }

  async findAll() {
    const orders = await this.databaseRepo.order.findMany({
      include: {
        User: {
          select: { id: true, email: true },
        },
        product: true,
      },
    });

    if (orders.length <= 0)
      throw new NotFoundException(`there is no orders yet.`);

    return orders;
  }

  async update(id: number, data: UpdateOrderDto) {
    if (!id) throw new BadRequestException('order id should be provided.');

    //check exists
    await this.findOne(id);

    return await this.databaseRepo.order.update({
      where: { id },
      data: { status: data.status },
      include: {
        User: {
          select: { id: true, email: true },
        },
        product: true,
      },
    });
  }

  async remove(id: number) {
    if (!id) throw new BadRequestException('order id should be provided.');

    //check exists
    await this.findOne(id);

    return await this.databaseRepo.order.delete({
      where: { id },
      include: {
        User: {
          select: { id: true, email: true },
        },
        product: true,
      },
    });
  }
}
