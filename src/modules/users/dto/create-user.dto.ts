import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    required: true,
    uniqueItems: true,
    type: String,
  })
  email: string;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
  })
  password: string;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
  })
  first_name: string;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
  })
  last_name: string;
}
