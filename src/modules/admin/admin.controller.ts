import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor() {}

  // @Post('/provinces')
  // // HDV tạo
  // async genProvinces() {
  //   return this.genDataService.GenProvince();
  // }
}
