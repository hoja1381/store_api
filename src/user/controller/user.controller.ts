import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  BadRequestException,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IsAdminGuard } from '../../guard/is_admin.guard';
import { IsLoggedInGuard } from '../../guard/is_logged_user.guard';
import { CurrentUser } from '../../decorator/current_user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getMe')
  @HttpCode(200)
  async getMe(@CurrentUser() user) {
    if (!user) throw new UnauthorizedException('ypu are not logged in');

    return user;
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(IsAdminGuard)
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    if (typeof +skip != 'number' || typeof +take != 'number')
      throw new BadRequestException('query params must be numbers.');

    return this.userService.findAll(+skip || 0, +take || 10);
  }

  @Get('/:id')
  @HttpCode(200)
  @UseGuards(IsAdminGuard)
  findOne(@Param('id') id: string) {
    if (typeof +id != 'number')
      throw new BadRequestException('id params must be numbers.');

    return this.userService.findOne(+id);
  }

  @Patch('/:id')
  @HttpCode(200)
  @UseGuards(IsLoggedInGuard)
  update(@CurrentUser() user, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(IsAdminGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
