import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/current_user';
import { User } from '@prisma/client';
import { IsLoggedInGuard } from 'src/common/guard/is_logged_user.guard';
import { IsAdminGuard } from 'src/common/guard/is_admin.guard';
import { Cache } from 'src/common/redis/cashe.decorator';
import {
  CreateOrderDoc,
  DeleteOrderDoc,
  FindAllOrdersDoc,
  FindByUserOrderDoc,
  FindOneOrderDoc,
  UpdateOrderDoc,
} from 'src/common/swagger/OrderDoc/ordr.swagger.decorators';
import { DeleteDoc } from 'src/common/swagger/UserDoc/user.swagger.decorators';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  @UseGuards(IsLoggedInGuard)
  @CreateOrderDoc()
  create(@Body() body: CreateOrderDto, @CurrentUser() user: User) {
    return this.orderService.create(body, user);
  }

  @Get('/')
  @UseGuards(IsAdminGuard)
  @FindAllOrdersDoc()
  @Cache(3600)
  findAll() {
    return this.orderService.findAll();
  }

  @Get('/byuser')
  @UseGuards(IsLoggedInGuard)
  @FindByUserOrderDoc()
  @Cache(3600)
  findByUser(@CurrentUser() user: User) {
    return this.orderService.findByUser(user.id);
  }

  @Get('/:id')
  @UseGuards(IsAdminGuard)
  @FindOneOrderDoc()
  @Cache(3600)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch('/:id')
  @UseGuards(IsAdminGuard)
  @UpdateOrderDoc()
  update(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return this.orderService.update(+id, body);
  }

  @Delete('/:id')
  @UseGuards(IsAdminGuard)
  @DeleteOrderDoc()
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
