import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { AdminStatus } from 'src/shares/enum/admin.enum';
import { ChangeStatus } from 'src/shares/enum/user.enum';

export class AdminChangeStatusModDto {
  @ApiProperty()
  @IsEnum(AdminStatus)
  @IsNotEmpty()
  status: AdminStatus;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  modId: number;
}
