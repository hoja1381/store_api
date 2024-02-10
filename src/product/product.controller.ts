import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IsAdminGuard } from 'src/common/guard/is_admin.guard';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/')
  @UseGuards(IsAdminGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get('/')
  @HttpCode(200)
  findAll(@Query('skip') skip: string, @Query('take') take: string) {
    return this.productService.findAll(+skip, +take);
  }

  @Get('/:id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id, true);
  }

  @Patch('/:id')
  @HttpCode(200)
  @UseGuards(IsAdminGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(IsAdminGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
