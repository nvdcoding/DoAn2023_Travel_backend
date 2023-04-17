import { HttpException, Injectable } from '@nestjs/common';
import { Admin } from 'src/models/entities/admin.entity';
import { AdminRepository } from 'src/models/repositories/admin.repository';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { provinceData } from 'src/shares/data/province';
import { AdminRole } from 'src/shares/enum/admin.enum';
import { In } from 'typeorm';
@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getAdminByIdAndUsername(id: number, username: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: {
        id,
        username,
        role: AdminRole.ADMIN,
      },
    });
    return admin;
  }

  async getAdminOrModByIdAndUsername(
    id: number,
    username: string,
  ): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: {
        id,
        username,
        role: In([AdminRole.ADMIN, AdminRole.MOD]),
      },
    });
    return admin;
  }
}
