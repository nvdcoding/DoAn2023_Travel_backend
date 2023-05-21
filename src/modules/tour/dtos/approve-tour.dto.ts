import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { AdminApproveAction } from 'src/shares/enum/tour.enum';

export class ApproveTourDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tourId: number;

  @ApiProperty()
  @IsEnum(AdminApproveAction)
  @IsNotEmpty()
  action: AdminApproveAction;
}
