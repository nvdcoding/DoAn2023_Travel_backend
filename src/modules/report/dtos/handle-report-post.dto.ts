import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { HandleReportPostAction } from 'src/shares/enum/report.enum';

export class HandleReportPostDto {
  @ApiProperty({ required: false })
  @IsEnum(HandleReportPostAction)
  @IsNotEmpty()
  action: HandleReportPostAction;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsNotEmpty()
  reportId: number;
}
