import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ChangeStatus } from 'src/shares/enum/user.enum';

export class AdminChangeStatusUserDto {
  @ApiProperty()
  @IsEnum(ChangeStatus)
  @IsNotEmpty()
  status: ChangeStatus;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
