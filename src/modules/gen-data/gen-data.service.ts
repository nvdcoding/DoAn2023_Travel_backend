import { HttpException, Injectable } from '@nestjs/common';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { provinceData } from 'src/shares/data/province';
@Injectable()
export class GenDataService {
  constructor(private readonly provinceRepository: ProvinceRepository) {}

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
        slug: this.vietnameseToSlug(name)
      });
    });
  }
}
