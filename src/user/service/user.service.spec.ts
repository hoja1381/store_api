import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseRepo } from '../../common/database/database.service';
import { describe } from 'node:test';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  let repo = {
    user: {
      create: jest.fn().mockImplementation((data) => Promise.resolve(data)),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: DatabaseRepo, useValue: repo }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('sgould create and return the created data.', async () => {
      const data = { email: 'email@gmail.com', password: '1234' };

      expect(await service.create(data)).toEqual({ data: data });
    });
  });

  describe('findAll', () => {
    it('should return null if there is no user found.', async () => {
      repo.user.findMany.mockResolvedValueOnce(null);

      expect(await service.findAll()).toBeNull;
    });

    it('the response should not have any password fields', async () => {
      repo.user.findMany.mockResolvedValueOnce([{ password: '1234' }]);
      const data = await service.findAll();

      data.forEach((element) => [expect(element?.password).toBeUndefined()]);
    });
  });

  describe('findOne', () => {
    it('should return null if user is not found.', async () => {
      repo.user.findUnique.mockResolvedValueOnce(null);
      expect(await service.findOne(1)).toBeNull();
    });

    it('should not return the password', async () => {
      repo.user.findUnique.mockResolvedValueOnce({ password: '1234' });
      const data = await service.findOne(1);

      expect(Object.keys(data).length).toBe(0);
    });
  });

  describe('findByEmail', () => {
    it('should return the user with the given email.', async () => {
      const email = 'fake@emial.com';
      repo.user.findUnique.mockResolvedValueOnce({ email });

      expect(await service.findByEmail(email)).toEqual({ email });
    });
  });

  describe('update', () => {
    it('should throw exception if user not found', async () => {
      try {
        await service.update(1, { email: 'fake@emial.com' });
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it('should not return the password', async () => {
      const data = { password: '1234' };
      repo.user.update.mockResolvedValueOnce(data);
      const result = await service.update(1, data);

      expect(Object.keys(result).length).toBe(0);
    });
  });

  describe('delete', () => {
    it('should throw exception if user not found', async () => {
      expect(await service.remove(1)).toBeNull();
    });

    it('should not return the password', async () => {
      const data = { password: '1234' };

      repo.user.delete.mockResolvedValueOnce(data);
      repo.user.findUnique.mockResolvedValueOnce(true);

      const result = await service.remove(1);

      expect(Object.keys(result).length).toBe(0);
    });
  });
});
