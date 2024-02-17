import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @ApiProperty({
    description: 'the product id you want to add to the cart',
    example: 1,
  })
  productId: number;

  @ApiProperty({
    description: 'the product quantity you want to add to the cart',
    example: 1,
  })
  @IsNumber()
  productQty: number;
}
