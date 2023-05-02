import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionRepository } from 'src/models/repositories/permission.repository';
import { GenDataService } from './gen-data.service';
import { GenDataController } from './gen-date.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionRepository])],
  providers: [GenDataService],
  controllers: [GenDataController],
  exports: [],
})
export class GenDataModule {}
