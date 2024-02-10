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
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CurrentUser } from 'src/decorator/current_user';
import { User } from '@prisma/client';
import { IsLoggedInGuard } from 'src/guard/is_logged_user.guard';

@Controller('cart')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('/')
  @UseGuards(IsLoggedInGuard)
  async create(
    @Body() createCardDto: CreateCardDto,
    @CurrentUser() user: User,
  ) {
    return await this.cardService.create(createCardDto, user?.id);
  }

  @Get('/')
  @UseGuards(IsLoggedInGuard)
  async findByUser(@CurrentUser() user: User) {
    return await this.cardService.findByUser(user.id);
  }

  @Get('/:id')
  @UseGuards(IsLoggedInGuard)
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const cart = await this.cardService.findOne(+id);

    if (user.id !== cart.user_id)
      throw new ForbiddenException('you cant access that cart.');

    return cart;
  }

  @Patch('/addproduct/:id')
  @UseGuards(IsLoggedInGuard)
  async addProductToCart(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    await this.findOne(id, user);

    return await this.cardService.addProductToCart(+id, updateCardDto);
  }

  @Patch('/removeproduct/:id')
  @UseGuards(IsLoggedInGuard)
  async removeProductFromCart(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    await this.findOne(id, user);

    return await this.cardService.deleteProductFromCart(+id, updateCardDto);
  }

  @Delete(':id')
  @UseGuards(IsLoggedInGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.findOne(id, user);

    return await this.cardService.remove(+id);
  }
}
