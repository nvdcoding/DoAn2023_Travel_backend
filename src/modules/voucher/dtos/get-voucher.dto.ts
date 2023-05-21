import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto';
import { DiscountType } from 'src/shares/enum/voucher.enum';

export class GetVoucherDto extends BasePaginationRequestDto {
  @ApiProperty({ required: false })
  @IsEnum(DiscountType)
  @IsOptional()
  discountType: DiscountType;
}
