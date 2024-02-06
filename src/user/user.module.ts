import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
  exports: [UserService, AuthService],
})
export class UserModule {}
