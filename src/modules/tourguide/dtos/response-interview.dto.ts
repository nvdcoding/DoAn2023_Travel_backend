import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ActionResponseRegisterTourguide } from 'src/shares/enum/tourguide.enum';

export class ResponseInterviewTourguideDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tourGuideId: number;

  @ApiProperty()
  @IsEnum(ActionResponseRegisterTourguide)
  @IsNotEmpty()
  action: ActionResponseRegisterTourguide;
}
