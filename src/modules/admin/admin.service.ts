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

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
    await this.cacheManager.set(`create-admin-${email}`, token, {
      ttl: emailConfig.registerTTL,
    });
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
}
