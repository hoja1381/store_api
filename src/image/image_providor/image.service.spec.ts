import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './images.service';
import { DatabaseRepo } from '../../common/database/database.service';
import { ImageStorageService } from '../image_storage/Images_storage.service';

describe('ImageController', () => {
  let service: ImageService;
  let imageStorageService = {
    save: jest.fn().mockImplementation(({ path }) => path),
    delete: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        DatabaseRepo,
        { provide: ImageStorageService, useValue: imageStorageService },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  let data = { path: 'test-uuid' };
  let image;

  it('( save )-should save and return image data', async () => {
    image = await service.save(data as Express.Multer.File, 1, false);

    expect(image.href).toBe(data.path);
    expect(image.isCover).toBe(false);
    expect(image.productId).toBe(1);
  });

  it('( delete )-should delete the image and delete its reference in db', async () => {
    const deletedImage = await service.delete(image.href);

    expect(deletedImage.href).toBe(image.href);
    expect(deletedImage.id).toBe(image.id);
    expect(deletedImage.isCover).toBe(image.isCover);
    expect(deletedImage.productId).toBe(image.productId);
  });
});
