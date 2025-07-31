import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
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
}
