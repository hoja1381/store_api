import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'it should be between 3 to 20 characters',
    example: 'hossein jahandide',
    nullable: true,
  })
  @IsString()
  @Length(3, 20)
  @IsOptional()
  fullName: string;

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

  @ApiProperty({ example: 'iran-tehran', nullable: true })
  @IsString()
  @IsOptional()
  address: string;
}
