import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { describe } from 'node:test';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: AuthService;

  let userService = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: UserService, useValue: userService }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const data = { email: 'fake@gmail.com', password: '1234' };

    it('should return an err if there is a user with that email.', async () => {
      userService.findByEmail.mockResolvedValue(data);
      try {
        await service.register(data);
        expect(true).toBe(false);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
