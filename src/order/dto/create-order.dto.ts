import { IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  cart_id: number;

  @IsNumber()
  @IsOptional()
  discount: number;
}
