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
import { ApiTags } from '@nestjs/swagger';
import {
  CreateProductDoc,
  DeleteProductDoc,
  FindAllProductsDoc,
  FindOneProductDoc,
  UpdateProductDoc,
} from 'src/common/swagger/productDoc/product.swagger.decprators';
import { Cache } from 'src/common/redis/cashe.decorator';
import { IsLoggedInGuard } from 'src/common/guard/is_logged_user.guard';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/')
  @UseGuards(IsLoggedInGuard, IsAdminGuard)
  @CreateProductDoc()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get('/')
  @HttpCode(200)
  @FindAllProductsDoc()
  @Cache(300)
  findAll(@Query('skip') skip: string, @Query('take') take: string) {
    return this.productService.findAll(+skip, +take);
  }

  @Get('/:id')
  @HttpCode(200)
  @FindOneProductDoc()
  @Cache(300)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id, true);
  }

  @Patch('/:id')
  @HttpCode(200)
  @UseGuards(IsLoggedInGuard, IsAdminGuard)
  @UpdateProductDoc()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(IsLoggedInGuard, IsAdminGuard)
  @DeleteProductDoc()
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
