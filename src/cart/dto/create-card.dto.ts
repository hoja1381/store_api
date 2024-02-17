import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    example: [{ productId: 1, productQty: 2 }],
  })
  @IsArray()
  products: {
    productId: number;
    productQty: number;
  }[];
}
