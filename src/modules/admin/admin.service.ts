import { HttpException, Injectable } from '@nestjs/common';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { provinceData } from 'src/shares/data/province';
@Injectable()
export class AdminService {
  constructor(private readonly provinceRepository: ProvinceRepository) {}
}
