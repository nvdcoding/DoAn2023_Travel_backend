import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { authConfig } from 'src/configs/auth.config';
import { AdminRepository } from 'src/models/repositories/admin.repository';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { provinceData } from 'src/shares/data/province';
import { httpErrors } from 'src/shares/exceptions';
import { GenAdminDto } from './dtos/gen-admin.dto';
import * as bcrypt from 'bcrypt';
import { AdminRole, AdminStatus } from 'src/shares/enum/admin.enum';

@Injectable()
export class GenDataService {
  constructor(
    private readonly provinceRepository: ProvinceRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  private vietnameseToSlug = (str) => {
    str = str.trim().toLowerCase();
    str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
    str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
    str = str.replace(/[ìíịỉĩ]/g, 'i');
    str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
    str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
    str = str.replace(/[ỳýỵỷỹ]/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/[^\w\s]/g, '');
    str = str.replace(/\s+/g, '-');

    return str;
  };

  async GenProvince() {
    const data = await this.provinceRepository.findOne();
    if (data) {
      throw new HttpException('Data existed', 400);
    }
    const provincesData = provinceData.map(async (e) => {
      const name = e.name.replace('Tỉnh', '');
      await this.provinceRepository.insert({
        name,
        slug: this.vietnameseToSlug(name),
      });
    });
  }

  async genAdminAccount(@Body() body: GenAdminDto) {
    const { username, email, password } = body;
    const admin = await this.adminRepository.findOne({
      where: [{ username }, { email }],
    });
    if (admin) {
      throw new HttpException(httpErrors.ADMIN_EXIST, HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await bcrypt.hash(password, +authConfig.salt);
    await this.adminRepository.insert({
      ...body,
      password: passwordHash,
      status: AdminStatus.ACTIVE,
      role: AdminRole.ADMIN,
    });
  }
}
