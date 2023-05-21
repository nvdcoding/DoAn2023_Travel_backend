import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
export class ResendEmailRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
