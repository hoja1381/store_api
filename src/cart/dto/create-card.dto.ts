import { IsArray } from 'class-validator';

export class CreateCartDto {
  @IsArray()
  products: {
    productId: number;
    productQty: number;
  }[];
}
