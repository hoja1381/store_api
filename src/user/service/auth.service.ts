import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(data: Prisma.UserCreateInput) {
    const duplicatedUser = await this.userService.findByEmail(data.email);
    if (duplicatedUser) {
      throw new BadRequestException('the email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 8);
    data.password = hashedPassword;

    const savedUser = await this.userService.create(data);
    const { password, ...others } = savedUser;

    return others;
  }

  async login(email: string, inputPassword: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('email or password is wrong!');

    const result = await bcrypt.compare(inputPassword, user.password);

    if (!result) throw new BadRequestException('email or password is wrong!');

    const { password, ...others } = user;
    return others;
  }
}
