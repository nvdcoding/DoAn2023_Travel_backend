import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor() {}

  // @Post('/provinces')
  // // HDV tạo
  // async genProvinces() {
  //   return this.genDataService.GenProvince();
  // }
}
