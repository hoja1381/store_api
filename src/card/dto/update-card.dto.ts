import { PartialType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';
import { IsNumber } from 'class-validator';

export class UpdateCardDto {
  @IsNumber()
  productId: number;
  @IsNumber()
  productQty: number;
}
