import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseRepo } from '../../common/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly repo: DatabaseRepo) {}

  async create(data: Prisma.UserCreateInput) {
    return await this.repo.user.create({ data });
  }

  async findAll(skip?: number, take?: number) {
    const users = await this.repo.user.findMany({
      skip,
      take,
    });
    if (!users) return null;

    let filteredUsers = [];
    for (const user of users) {
      const { password, ...other } = user;
      filteredUsers.push(other);
    }

    return filteredUsers;
  }

  async findOne(id: number) {
    const user = await this.repo.user.findUnique({ where: { id } });
    if (!user) return null;

    const { password, ...other } = user;

    return other;
  }

  async findByEmail(email: string) {
    return await this.repo.user.findUnique({ where: { email } });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    const user = await this.repo.user.update({ where: { id }, data: data });
    if (!user) throw new NotFoundException('user not found with id.');

    const { password, ...other } = user;

    return other;
  }

  async remove(id: number) {
    const user = await this.repo.user.findUnique({ where: { id } });
    if (!user) return null;

    const deletedUser = await this.repo.user.delete({ where: { id } });
    const { password, ...other } = deletedUser;

    return other;
  }
}
