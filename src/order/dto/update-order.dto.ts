import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'the new status',
    example: 'sending...',
  })
  @IsString()
  status: string;
}
