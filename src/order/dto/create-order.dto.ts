import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'the card id that is confirmed to be an order.',
    example: 21,
  })
  @IsNumber()
  cart_id: number;

  @ApiProperty({
    description: 'the percentage of the discount.',
    example: 20,
  })
  @IsNumber()
  @IsOptional()
  discount: number;
}
