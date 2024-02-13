import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { DatabaseRepo } from '../common/database/database.service';
import { ProductService } from '../product/product.service';
import { Cart } from '@prisma/client';

describe('CardService', () => {
  let service: CardService;
  let repo: DatabaseRepo;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardService, DatabaseRepo, ProductService],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    repo = module.get<DatabaseRepo>(DatabaseRepo);
    service = module.get<CardService>(CardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const testUserId = 1;
  const data = {
    products: [
      {
        productId: 1,
        productQty: 1,
      },
      {
        productId: 2,
        productQty: 1,
      },
    ],
  };

  let cartId: number;
  let cart;

  it('( create )-should return the created product.', async () => {
    cart = await service.create(data, testUserId);
    cartId = cart.id;

    expect(cart.user_id).toBe(testUserId);

    expect(cart.products[0].productId).toBe(data.products[0].productId);
    expect(cart.products[1].productId).toBe(data.products[1].productId);

    expect(cart.products[0].productQty).toBe(data.products[0].productQty);
    expect(cart.products[1].productQty).toBe(data.products[1].productQty);
  });

  it('( findByUser )-should return cards of one user', async () => {
    const userCarts = await service.findByUser(testUserId);

    expect(userCarts.length >= 0).toBeTruthy();
  });

  it('( findOne )-should return the cart by its id.', async () => {
    const foundCart = await service.findOne(cart.id);

    expect(foundCart).toEqual(cart);
  });

  it('( addProductToCart )-should add the product to the product list in the cart.', async () => {
    const addProduct = { productId: 3, productQty: 1 };
    const newCart = await service.addProductToCart(cart.id, addProduct);

    expect(newCart.products.length).toBe(+cart.products.length + 1);
  });

  it('( deleteProductFromCart )-should delete the product from the product list in the cart.', async () => {
    const deleteProduct = { productId: 3, productQty: 1 };

    const newCart = await service.deleteProductFromCart(cart.id, deleteProduct);

    expect(newCart.products.length).toBe(+cart.products.length);
  });

  it('( remove )-should delete the cart', async () => {
    const deleteCart = await service.remove(cart.id);

    expect(deleteCart.User).toStrictEqual(cart.User);
    expect(deleteCart.id).toBe(cart.id);
    expect(deleteCart.totalPrice.toString()).toBe(cart.totalPrice.toString());
  });
});
