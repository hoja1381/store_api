import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class loginDto {
  @ApiProperty({ example: 'hoja@g.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'the password should be between 8 to 20 characters',
    example: 'hj123456hj',
  })
  @IsString()
  @Length(8, 20)
  password: string;
}
