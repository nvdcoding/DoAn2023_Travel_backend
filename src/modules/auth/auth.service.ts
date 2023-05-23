import {
  Body,
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from 'src/models/repositories/user.repository';
import { httpErrors } from 'src/shares/exceptions';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'src/shares/response/response.interface';
import { httpResponse } from 'src/shares/response';
import { emailConfig } from 'src/configs/email.config';
import { MailService } from '../mail/mail.service';
import { UserStatus } from 'src/shares/enum/user.enum';
import * as bcrypt from 'bcrypt';
import { authConfig } from 'src/configs/auth.config';
import { ResendEmailRegisterDto } from './dto/resend-confirmation.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtAdminPayload,
  IJwtPayload,
  IJwtTourguidePayload,
} from './interfaces/payload.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SendOtpForgotPasswordDto } from './dto/send-otp-forgot-password.dto';
import { AdminRepository } from 'src/models/repositories/admin.repository';
import { AdminRole, AdminStatus } from 'src/shares/enum/admin.enum';
import { RegisterTourguideDto } from './dto/register-tourguide.dto';
import { TourGuideRepository } from 'src/models/repositories/tourguide.repository';
import { ProvinceRepository } from 'src/models/repositories/province.repository';
import { In, Not } from 'typeorm';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { ActorRole } from 'src/shares/enum/auth.enum';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  static DEFAULT_7DAY_MS = 7 * 24 * 60 * 60 * 1000;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminRepository: AdminRepository,
    private readonly tourGuideRepository: TourGuideRepository,
    private readonly provinceRepository: ProvinceRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  private genToken(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async register(body: RegisterDto): Promise<Response> {
    const { email, username, password } = body;
    const [token, user, tourguide] = await Promise.all([
      this.cacheManager.get(`register-${email}`),
      this.userRepository.findOne({
        where: {
          email,
          username,
        },
      }),
      this.tourGuideRepository.findOne({
        where: email,
      }),
    ]);
    if (
      user &&
      [UserStatus.ACTIVE, UserStatus.LOCKED].includes(user.verifyStatus)
    ) {
      throw new HttpException(httpErrors.USER_EXIST, HttpStatus.BAD_REQUEST);
    }
    if (tourguide) {
      throw new HttpException(httpErrors.USER_EXIST, HttpStatus.BAD_REQUEST);
    }
    if (token) {
      throw new HttpException(
        httpErrors.WAIT_TO_RESEND,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newToken = this.genToken();
    const passwordHash = await bcrypt.hash(password, +authConfig.salt);
    if (!user) {
      await this.userRepository.insert({
        ...body,
        verifyStatus: UserStatus.INACTIVE,
        password: passwordHash,
      });
    }
    await Promise.all([
      this.cacheManager.set(`register-${email}`, newToken, {
        ttl: emailConfig.registerTTL,
      }),
      this.mailService.sendRegisterMail({
        email: body.email,
        username: body.username,
        token: `${newToken}`,
      }),
    ]);
    return httpResponse.REGISTER_SEND_MAIL;
  }

  async registerTourguide(body: RegisterTourguideDto): Promise<Response> {
    const { name, username, email, password, phone, dob, gender, provinces } =
      body;
    const [provincesDb, tourguide, user] = await Promise.all([
      this.provinceRepository.find({
        where: {
          id: In(provinces),
        },
      }),
      this.tourGuideRepository.findOne({
        where: [
          { username, verifyStatus: Not(TourguideStatus.REJECT) },
          { email, verifyStatus: Not(TourguideStatus.REJECT) },
        ],
      }),
      this.userRepository.findOne({
        where: {
          email,
        },
      }),
    ]);

    if (tourguide) {
      throw new HttpException(httpErrors.TOUR_GUIDE_EXIST, HttpStatus.FOUND);
    }

    if (user) {
      throw new HttpException(httpErrors.TOUR_GUIDE_EXIST, HttpStatus.FOUND);
    }
    if (provincesDb.length < provinces.length) {
      throw new HttpException(
        httpErrors.PROVINCE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const passwordHash = await bcrypt.hash(password, +authConfig.salt);
    await this.tourGuideRepository.save({
      name,
      username,
      email,
      password: passwordHash,
      phone,
      dob,
      gender,
      provinces: provincesDb,
      interviewDate: null,
    });
    return httpResponse.REGISTER_SUCCESS;
  }

  async resendRegisterEmail(body: ResendEmailRegisterDto): Promise<Response> {
    const { email } = body;
    const [token, user] = await Promise.all([
      this.cacheManager.get(`register-${email}`),
      this.userRepository.findOne({
        where: {
          email: body.email,
          verifyStatus: UserStatus.INACTIVE,
        },
      }),
    ]);

    if (token) {
      throw new HttpException(
        httpErrors.WAIT_TO_RESEND,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const newToken = this.genToken();
    await this.cacheManager.set(`register-${email}`, newToken, {
      ttl: emailConfig.registerTTL,
    });
    await this.mailService.sendRegisterMail({
      email: body.email,
      username: user.username,
      token: `${newToken}`,
    });
    return httpResponse.REGISTER_SEND_MAIL;
  }

  async activeAccount(token: string, email: string): Promise<Response> {
    const [checkToken, user] = await Promise.all([
      this.cacheManager.get(`register-${email}`),
      this.userRepository.findOne({
        where: {
          email,
          verifyStatus: UserStatus.INACTIVE,
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
    await Promise.all([
      this.userRepository.update(
        { email: email },
        { verifyStatus: UserStatus.ACTIVE },
      ),
      this.cacheManager.del(`register-${email}`),
    ]);
    return httpResponse.REGISTER_SUCCESS;
  }

  async userLogin(body: LoginDto) {
    const { email, password } = body;

    const userExisted = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'verifyStatus', 'password'],
    });

    if (!userExisted)
      throw new HttpException(
        httpErrors.USER_LOGIN_FAIL,
        HttpStatus.BAD_REQUEST,
      );

    if (
      [UserStatus.INACTIVE, UserStatus.LOCKED].includes(
        userExisted.verifyStatus,
      )
    )
      throw new HttpException(
        httpErrors.USER_NOT_ACTIVE,
        HttpStatus.BAD_REQUEST,
      );

    const comparePassword = await bcrypt.compare(
      password,
      userExisted.password,
    );

    if (!comparePassword)
      throw new HttpException(
        httpErrors.USER_LOGIN_FAIL,
        HttpStatus.BAD_REQUEST,
      );

    const { refreshJwt } = authConfig;
    const payload = {
      id: userExisted.id,
      email,
      verifyStatus: userExisted.verifyStatus,
      role: ActorRole.USER,
    } as IJwtPayload;

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshJwt,
      expiresIn: '7d',
    });
    return {
      ...httpResponse.LOGIN_SUCCESS,
      returnValue: {
        accessToken,
        refreshToken,
        ...payload,
      },
    };
  }

  async tourGuideLogin(@Body() body: LoginDto): Promise<Response> {
    const { email, password } = body;
    const tourguideExisted = await this.tourGuideRepository.findOne({
      where: { email, verifyStatus: TourguideStatus.ACTIVE },
    });

    if (!tourguideExisted)
      throw new HttpException(
        httpErrors.USER_LOGIN_FAIL,
        HttpStatus.BAD_REQUEST,
      );

    const comparePassword = await bcrypt.compare(
      password,
      tourguideExisted.password,
    );

    if (!comparePassword)
      throw new HttpException(
        httpErrors.USER_LOGIN_FAIL,
        HttpStatus.BAD_REQUEST,
      );

    const { refreshJwt } = authConfig;
    const payload = {
      id: tourguideExisted.id,
      email,
      status: tourguideExisted.verifyStatus,
      role: ActorRole.TOURGUIDE,
      username: tourguideExisted.username,
    } as IJwtTourguidePayload;

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshJwt,
      expiresIn: '7d',
    });
    return {
      ...httpResponse.LOGIN_SUCCESS,
      returnValue: {
        accessToken,
        refreshToken,
        ...payload,
      },
    };
  }

  async adminLogin(body: LoginDto): Promise<Response> {
    const { email, password } = body;

    const adminExisted = await this.adminRepository.findOne({
      where: { email },
    });

    if (!adminExisted)
      throw new HttpException(
        httpErrors.USER_LOGIN_FAIL,
        HttpStatus.BAD_REQUEST,
      );

    if (adminExisted.status === AdminStatus.INACTIVE)
      throw new HttpException(
        httpErrors.USER_NOT_ACTIVE,
        HttpStatus.BAD_REQUEST,
      );

    const comparePassword = await bcrypt.compare(
      password,
      adminExisted.password,
    );

    if (!comparePassword)
      throw new HttpException(
        httpErrors.USER_LOGIN_FAIL,
        HttpStatus.BAD_REQUEST,
      );

    const { refreshJwt } = authConfig;
    const payload = {
      id: adminExisted.id,
      email,
      status: adminExisted.status,
      role:
        adminExisted.role === AdminRole.ADMIN ? ActorRole.ADMIN : ActorRole.MOD,
      username: adminExisted.username,
    } as IJwtAdminPayload;

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshJwt,
      expiresIn: '7d',
    });
    return {
      ...httpResponse.LOGIN_SUCCESS,
      returnValue: {
        accessToken,
        refreshToken,
        ...payload,
      },
    };
  }

  async sendOtpForgotPasswordToMail(email: string) {
    const newToken = this.genToken();
    const userExisted = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'verifyStatus', 'password'],
    });
    await Promise.all([
      this.cacheManager.set(`forgotPassword-${email}`, newToken, {
        ttl: emailConfig.registerTTL,
      }),
      this.mailService.sendForgotPasswordMail({
        email: email,
        username: userExisted.username,
        token: `${newToken}`,
      }),
    ]);
    return httpResponse.REGISTER_SEND_MAIL;
  }

  async sendOtpForgotPassword(body: SendOtpForgotPasswordDto) {
    const { email } = body;
    const userExisted = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'verifyStatus', 'password'],
    });

    if (!userExisted) {
      throw new HttpException(
        httpErrors.USER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      [UserStatus.INACTIVE, UserStatus.LOCKED].includes(
        userExisted.verifyStatus,
      )
    ) {
      throw new HttpException(
        httpErrors.USER_NOT_ACTIVE,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.sendOtpForgotPasswordToMail(email);
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const { email, password, otp } = body;
    const [checkOTP, user] = await Promise.all([
      this.cacheManager.get(`forgotPassword-${email}`),
      this.userRepository.findOne({
        where: {
          email,
          verifyStatus: UserStatus.ACTIVE,
        },
      }),
    ]);
    // validate
    if (!checkOTP || otp != checkOTP) {
      throw new HttpException(
        httpErrors.FORGOT_PASSWORD_OTP_NOT_MATCH,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const comparePassword = await bcrypt.compare(user.password, password);
    if (comparePassword) {
      throw new HttpException(
        httpErrors.FORGOT_PASSWORD_DIFFERENCE_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }
    // update data
    const passwordHash = await bcrypt.hash(password, +authConfig.salt);
    await Promise.all([
      this.userRepository.update({ email: email }, { password: passwordHash }),
      this.cacheManager.del(`forgotPassword-${email}`),
    ]);
    return httpResponse.FORGOT_PASSWORD_SUCCESS;
  }

  async getMe(id: number, actorRole: ActorRole) {
    let me;
    switch (actorRole) {
      case ActorRole.USER:
        me = await this.userRepository.findOne({
          where: {
            id,
            verifyStatus: UserStatus.ACTIVE,
          },
          relations: [
            'userVouchers',
            'userFavorites',
            'orders',
            'transactions',
            'userVouchers.voucher',
          ],
        });
        break;
      case ActorRole.ADMIN:
        me = await this.adminRepository.findOne({
          where: { id, status: AdminStatus.ACTIVE },
        });
        break;
      case ActorRole.TOURGUIDE:
        me = await this.tourGuideRepository.findOne({
          where: {
            id,
            verifyStatus: TourguideStatus.ACTIVE,
          },
          relations: ['provinces'],
        });
        break;
      default:
        break;
    }
    if (!me) {
      if (actorRole === ActorRole.ADMIN) {
        throw new HttpException(
          httpErrors.ADMIN_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      } else if (actorRole === ActorRole.TOURGUIDE) {
        throw new HttpException(
          httpErrors.TOUR_GUIDE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          httpErrors.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
    }
    return {
      ...httpResponse.GET_ME_SUCCESS,
      returnValue: { ...me, role: actorRole },
    };
  }
}
