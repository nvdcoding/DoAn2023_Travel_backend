import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { GetTourOptions } from 'src/shares/enum/order.enum';

export class GetOrdersDto {
  @ApiProperty()
  @IsEnum(GetTourOptions)
  @IsNotEmpty()
  type: GetTourOptions;
}
