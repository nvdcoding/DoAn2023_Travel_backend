import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ActionResponseRegisterTourguide } from 'src/shares/enum/tourguide.enum';

export class ResponseRegisterTourguideDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tourGuideId: number;

  @ApiProperty()
  @IsEnum(ActionResponseRegisterTourguide)
  @IsNotEmpty()
  action: ActionResponseRegisterTourguide;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  interviewDate: Date;
}
