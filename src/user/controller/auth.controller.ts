import { Body, Controller, HttpCode, Post, Session } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { loginDto } from '../dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: loginDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);

    session.user = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return user;
  }

  @Post('/register')
  @HttpCode(201)
  async register(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register(body);

    session.user = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return user;
  }

  @Post('/logout')
  @HttpCode(200)
  async logout(@Session() session: any) {
    session.user = null;
  }
}
