import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTourDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
