import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { UserService } from '../user/service/user.service';

@Injectable()
export class VerifyUser implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, res: any, next: NextFunction) {
    const id = req.session.user.id;

    if (!id) {
      return next();
    }

    const user = await this.userService.findOne(id);

    req.user = user;

    next();
  }
}
