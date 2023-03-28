import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ActiveUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
