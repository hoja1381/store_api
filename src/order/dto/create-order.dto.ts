import { IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  card_id: number;

  @IsNumber()
  @IsOptional()
  discount: number;
}
