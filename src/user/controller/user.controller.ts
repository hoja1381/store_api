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
import { IsAdminGuard } from '../../common/guard/is_admin.guard';
import { IsLoggedInGuard } from '../../common/guard/is_logged_user.guard';
import { CurrentUser } from '../../common/decorator/current_user';
import { ApiTags } from '@nestjs/swagger';
import {
  DeleteDoc,
  FindAllDoc,
  FindOneDoc,
  GetMeDoc,
  UpdateDoc,
} from '../../common/swagger/UserDoc/user.swagger.decorators';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getMe')
  @HttpCode(200)
  @GetMeDoc()
  async getMe(@CurrentUser() user) {
    if (!user) throw new UnauthorizedException('you are not logged in');

    return user;
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(IsAdminGuard)
  @FindAllDoc()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    if (typeof +skip != 'number' || typeof +take != 'number')
      throw new BadRequestException('query params must be numbers.');

    return this.userService.findAll(+skip || 0, +take || 10);
  }

  @Get('/:id')
  @HttpCode(200)
  @UseGuards(IsAdminGuard)
  @FindOneDoc()
  findOne(@Param('id') id: string) {
    if (typeof +id != 'number')
      throw new BadRequestException('id params must be numbers.');

    return this.userService.findOne(+id);
  }

  @Patch('/')
  @HttpCode(200)
  @UseGuards(IsLoggedInGuard)
  @UpdateDoc()
  update(@CurrentUser() user, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(IsAdminGuard)
  @DeleteDoc()
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
