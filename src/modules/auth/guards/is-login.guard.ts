import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from 'src/modules/admin/admin.service';
import { httpErrors } from 'src/shares/exceptions';
import { Connection } from 'typeorm';

@Injectable()
export class IsLoginGuard extends AuthGuard('jwt') {
  constructor(
    private readonly connection: Connection,
    private jtwSv: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;
    if (!headers?.authorization) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const token = headers.authorization.split(' ');
    if (token.length < 2 || token[0] != 'Bearer') {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    try {
      const jwt = await this.jtwSv.verify(token[1]);
      return jwt;
    } catch (error) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
  }
}
