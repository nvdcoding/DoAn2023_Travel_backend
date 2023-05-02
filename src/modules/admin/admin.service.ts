import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { authConfig } from 'src/configs/auth.config';
import { Admin } from 'src/models/entities/admin.entity';
import { AdminRepository } from 'src/models/repositories/admin.repository';
import { AdminRole, AdminStatus } from 'src/shares/enum/admin.enum';
import { httpErrors } from 'src/shares/exceptions';
import { httpResponse } from 'src/shares/response';
import { Response } from 'src/shares/response/response.interface';
import { In } from 'typeorm';
import { CreateAdminDto } from './dtos/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { emailConfig } from 'src/configs/email.config';
import { MailService } from '../mail/mail.service';
import { siteConfig } from 'src/configs/site.config';
import { ActiveAdminDto } from './dtos/active-admin.dto';
import { GetListAdminDto } from './dtos/get-list-admin.dto';
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto';
import { AdminUpdateMod } from './dtos/change-mod-status.dto';
import { PermissionRepository } from 'src/models/repositories/permission.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly permissionRepository: PermissionRepository,
  ) {}

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

  async createAccount(body: CreateAdminDto): Promise<Response> {
    const { username, email, role } = body;
    const admin = await this.adminRepository.findOne({
      where: [{ username }, { email }],
    });
    if (admin) {
      throw new HttpException(httpErrors.ADMIN_EXIST, HttpStatus.BAD_REQUEST);
    }
    const payload = {
      email,
      role,
      username,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const [cacheData, permissions] = await Promise.all([
      this.cacheManager.set(`create-admin-${email}`, token, {
        ttl: emailConfig.registerTTL,
      }),
      this.permissionRepository.find({ where: { level: In([1, 4]) } }),
    ]);
    await Promise.all([
      this.mailService.sendCreateAdmin({
        email: email,
        username: username,
        url: `${siteConfig.url}/active-tai-khoan/${token}`,
      }),
      this.adminRepository.insert({
        ...body,
        status: AdminStatus.INACTIVE,
        role,
        permission:
          role === AdminRole.ADMIN
            ? permissions.filter((e) => e.level === 1)[0]
            : permissions.filter((e) => e.level === 4)[0],
      }),
    ]);
    return httpResponse.CREATE_ADMIN_SUCCESS;
  }

  async activeAccount(body: ActiveAdminDto): Promise<Response> {
    const { username, email, token, password } = body;
    const [checkToken, user] = await Promise.all([
      this.cacheManager.get(`create-admin-${email}`),
      this.adminRepository.findOne({
        where: {
          email,
          username,
        },
      }),
    ]);

    if (!checkToken) {
      throw new HttpException(
        httpErrors.REGISTER_TOKEN_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (token != checkToken) {
      throw new HttpException(
        httpErrors.REGISTER_TOKEN_NOT_MATCH,
        HttpStatus.BAD_REQUEST,
      );
    }
    const passwordHash = await bcrypt.hash(password, +authConfig.salt);

    await Promise.all([
      this.adminRepository.update(
        { email: email },
        { status: AdminStatus.ACTIVE, password: passwordHash },
      ),
      this.cacheManager.del(`create-admin-${email}`),
    ]);
    return httpResponse.ACTIVE_ADMIN_SUCCESS;
  }

  async getListAdmin(options: GetListAdminDto): Promise<Response> {
    const { keyword, limit, page } = options;
    const admins = await this.adminRepository.getAdmins(keyword, page, limit);
    return {
      ...httpResponse.GET_ADMIN_SUCCESS,
      returnValue: BasePaginationResponseDto.convertToPaginationWithTotalPages(
        admins,
        options.page || 1,
        options.limit || 10,
      ),
    };
  }

  async updateMod(body: AdminUpdateMod): Promise<Response> {
    const { modId, status, level } = body;
    const [mod, permission] = await Promise.all([
      this.adminRepository.findOne({
        where: {
          id: modId,
          role: AdminRole.MOD,
        },
      }),
      this.permissionRepository.findOne({
        where: { level },
      }),
    ]);
    if (!mod) {
      throw new HttpException(httpErrors.ADMIN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.adminRepository.update(
      {
        id: modId,
        role: AdminRole.MOD,
      },
      {
        status,
        permission,
      },
    );
    return httpResponse.CHANGE_STATUS_MOD_SUCCESS;
  }

  async deleteModAccount(modId: number): Promise<Response> {
    const mod = await this.adminRepository.findOne({
      where: {
        id: modId,
        role: AdminRole.MOD,
      },
    });
    if (!mod) {
      throw new HttpException(httpErrors.ADMIN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.adminRepository.delete(modId);
    return httpResponse.DELETE_MOD_SUCCESS;
  }
}
