import { IsArray, IsNumber } from 'class-validator';

export class CreateCardDto {
  @IsArray()
  products: {
    productId: number;
    productQty: number;
  }[];
}
