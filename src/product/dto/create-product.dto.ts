import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty({
    example: 'product 1',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'product description',
  })
  description: string;

  @IsNumber()
  @ApiProperty({
    example: 100000,
  })
  price: number;
}
