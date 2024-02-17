import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-card.dto';
import { UpdateCartDto } from './dto/update-card.dto';
import { CurrentUser } from '../common/decorator/current_user';
import { User } from '@prisma/client';
import { IsLoggedInGuard } from 'src/common/guard/is_logged_user.guard';
import { ApiTags } from '@nestjs/swagger';
import {
  AddProductToCartDoc,
  CreateCartDoc,
  FindCartByUser,
  FindOneCartDoc,
  RemoveCartDoc,
  RemoveProductFromCartDoc,
} from '../common/swagger/CartDoc/cart.swagger.decoorators';

@Controller('cart')
@ApiTags('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/')
  @UseGuards(IsLoggedInGuard)
  @CreateCartDoc()
  async create(
    @Body() createCardDto: CreateCartDto,
    @CurrentUser() user: User,
  ) {
    return await this.cartService.create(createCardDto, user?.id);
  }

  @Get('/')
  @UseGuards(IsLoggedInGuard)
  @FindCartByUser()
  async findByUser(@CurrentUser() user: User) {
    return await this.cartService.findByUser(user.id);
  }

  @Get('/:id')
  @UseGuards(IsLoggedInGuard)
  @FindOneCartDoc()
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const cart = await this.cartService.findOne(+id);

    if (user.id !== cart.user_id)
      throw new ForbiddenException('you cant access that cart.');

    return cart;
  }

  @Patch('/addproduct/:id')
  @UseGuards(IsLoggedInGuard)
  @AddProductToCartDoc()
  async addProductToCart(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCartDto,
  ) {
    await this.findOne(id, user);

    return await this.cartService.addProductToCart(+id, updateCardDto);
  }

  @Patch('/removeproduct/:id')
  @UseGuards(IsLoggedInGuard)
  @RemoveProductFromCartDoc()
  async removeProductFromCart(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCartDto,
  ) {
    await this.findOne(id, user);

    return await this.cartService.deleteProductFromCart(+id, updateCardDto);
  }

  @Delete(':id')
  @UseGuards(IsLoggedInGuard)
  @RemoveCartDoc()
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.findOne(id, user);

    return await this.cartService.remove(+id);
  }
}
