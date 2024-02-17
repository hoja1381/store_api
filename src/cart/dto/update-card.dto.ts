import { PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-card.dto';
import { IsNumber } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  productId: number;
  @IsNumber()
  productQty: number;
}
