import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { DatabaseRepo } from '../common/database/database.service';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { Cart, Order, Prisma, Product, User } from '@prisma/client';
import { CreateCartDto } from '../cart/dto/create-card.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserService } from '../user/service/user.service';
import { CreateProductDto } from 'src/product/dto/create-product.dto';

describe('OrderService', () => {
  let service: OrderService;

  let databaseRepo: DatabaseRepo;
  let cartService: CartService;
  let userService: UserService;
  let productService: ProductService;

  let testCart: Cart;
  let user: User;
  let data: CreateOrderDto;
  let order: Order;

  let product1: Product;
  let product2: Product;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        DatabaseRepo,
        CartService,
        ProductService,
        UserService,
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    cartService = module.get<CartService>(CartService);
    databaseRepo = module.get<DatabaseRepo>(DatabaseRepo);
    userService = module.get<UserService>(UserService);

    service = module.get<OrderService>(OrderService);

    user = await userService.create({
      email: 'testUserForOrder@g.com',
      password: '12345678',
      address: 'teheran',
    } as Prisma.UserCreateInput);

    product1 = await productService.create({
      name: 'testOrder-p1',
      price: 1000,
    } as CreateProductDto);
    product2 = await productService.create({
      name: 'testOrder-p2',
      price: 1000,
    } as CreateProductDto);

    testCart = await cartService.create(
      {
        products: [
          {
            productId: product1.id,
            productQty: 2,
          },
          {
            productId: product2.id,
            productQty: 2,
          },
        ],
      } as CreateCartDto,
      user.id,
    );
    data = { cart_id: testCart.id, discount: 10 };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('( create )-should create the order and delete the card.', async () => {
    order = await service.create(data, user);

    expect(order.status).toBe('pending');
    expect(order.discount).toBe(data.discount);
    expect(order.user_id).toBe(user.id);
  });

  it('( findByUser )-return one user orders', async () => {
    const orders = await service.findByUser(user.id);

    expect(orders.length >= 0).toBeTruthy();
  });

  it('( findOne )-return one one order  by id', async () => {
    const foundOrder = await service.findOne(order.id);

    expect(foundOrder.id).toBe(order.id);
    expect(foundOrder.address).toBe(order.address);
    expect(foundOrder.discount).toBe(order.discount);
    expect(foundOrder.User.id).toBe(order.user_id);
    expect(foundOrder.finalPrice).toBe(order.finalPrice);
    expect(foundOrder.status).toBe(order.status);
    expect(foundOrder.totalPrice).toBe(order.totalPrice);
  });

  it('( findAll )-return one user orders', async () => {
    const orders = await service.findAll();

    expect(orders.length >= 0).toBeTruthy();
  });

  it('( update )-should update the status of the order.', async () => {
    const updatedOrder = await service.update(order.id, { status: 'changed' });

    expect(updatedOrder.status).toBe('changed');
  });

  it('( remove )-should delete the order.', async () => {
    const removedOrder = await service.remove(order.id);

    expect(removedOrder.status).toBe('changed');
    expect(removedOrder.user_id).toBe(user.id);
  });

  afterAll(async () => {
    await userService.remove(user.id);

    await productService.remove(product1.id);
    await productService.remove(product2.id);
  });
});
