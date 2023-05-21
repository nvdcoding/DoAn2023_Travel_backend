import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/shares/response/response.interface';
import { AuthService } from './auth.service';
import { ActiveUserDto } from './dto/active-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendEmailRegisterDto } from './dto/resend-confirmation.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SendOtpForgotPasswordDto } from './dto/send-otp-forgot-password.dto';
import { ActorID } from 'src/shares/decorators/get-user-id.decorator';
import { RegisterTourguideDto } from './dto/register-tourguide.dto';
import { IsLoginGuard } from './guards/is-login.guard';
import { ActorRoleDecorator } from 'src/shares/decorators/get-role.decorator';
import { ActorRole } from 'src/shares/enum/auth.enum';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: RegisterDto): Promise<Response> {
    return this.authService.register(body);
  }

  @Post('/register-tourguide')
  async registerTourguide(
    @Body() body: RegisterTourguideDto,
  ): Promise<Response> {
    return this.authService.registerTourguide(body);
  }

  @Post('/resend-confirmation-email')
  async resendConfirmationEmail(
    body: ResendEmailRegisterDto,
  ): Promise<Response> {
    return this.authService.resendRegisterEmail(body);
  }

  @Put('/active-user/:token')
  async activeUser(
    @Param('token') token: string,
    @Body() body: ActiveUserDto,
  ): Promise<Response> {
    return this.authService.activeAccount(token, body.email);
  }

  @Post('/login')
  async login(@Body() body: LoginDto): Promise<Response> {
    return this.authService.userLogin(body);
  }

  @Post('/send-otp-forgot-password')
  async sendOtpForgotPassword(
    @Body() body: SendOtpForgotPasswordDto,
  ): Promise<Response> {
    return this.authService.sendOtpForgotPassword(body);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<Response> {
    return this.authService.forgotPassword(body);
  }

  @Post('/login-admin')
  async adminLogin(@Body() body: LoginDto): Promise<Response> {
    return this.authService.adminLogin(body);
  }

  @Post('/login-tourguide')
  async tourGuideLogin(@Body() body: LoginDto): Promise<Response> {
    return this.authService.tourGuideLogin(body);
  }

  @Get('/me')
  @UseGuards(IsLoginGuard)
  async getMe(
    @ActorID() userId: number,
    @ActorRoleDecorator() actorRole: ActorRole,
  ): Promise<Response> {
    return this.authService.getMe(userId, actorRole);
  }
}
