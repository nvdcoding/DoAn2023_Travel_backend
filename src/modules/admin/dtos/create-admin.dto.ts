import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Matches,
  IsEnum,
} from 'class-validator';
import { AdminRole } from 'src/shares/enum/admin.enum';

export class CreateAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(AdminRole)
  role: AdminRole;
}
