import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { DatabaseRepo } from '../common/database/database.service';
import { IsNumber } from 'class-validator';
import exp from 'constants';

describe('ProductService', () => {
  let service: ProductService;
  let databaseRepo: DatabaseRepo;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, DatabaseRepo],
    }).compile();

    databaseRepo = module.get<DatabaseRepo>(DatabaseRepo);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Product', () => {
    const data = { name: 'p-Test', description: 'test product', price: 10000 };
    const newData = {
      name: 'p-U-Test',
      description: 'updated test product',
      price: 20000,
    };

    let id: number;

    it('( create )-should returned the created product.', async () => {
      const product = await service.create(data);
      id = product.id;

      expect(product.description).toBe(data.description);
      expect(product.name).toBe(data.name);
      expect(product.price).toBe(BigInt(data.price));
      expect(typeof product.id).toBe('number');
    });

    it('( findAll )-should return an array of products.', async () => {
      const products = await service.findAll();

      expect(typeof products.count).toBe('number');
      expect(products.products.length >= 0).toBeTruthy();
    });
    it('( findOne )-should return the product with the given id', async () => {
      const product = await service.findOne(id, false);

      expect(product.description).toBe(data.description);
      expect(product.name).toBe(data.name);
      expect(product.price).toBe(BigInt(data.price));
    });
    it('( update )-should update the product with the given id', async () => {
      const updatedProduct = await service.update(id, newData);

      expect(updatedProduct.name).toBe(newData.name);
      expect(updatedProduct.description).toBe(newData.description);
      expect(updatedProduct.price).toBe(BigInt(newData.price));
    });
    it('( remove )-should remove the product with the given Id.', async () => {
      const deletedProduct = await service.remove(id);

      expect(deletedProduct.name).toBe(newData.name);
      expect(deletedProduct.description).toBe(newData.description);
      expect(deletedProduct.price).toBe(BigInt(newData.price));
    });
  });
});
