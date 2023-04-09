import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, isObservable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';
import { httpErrors } from 'src/shares/exceptions';
import { Connection } from 'typeorm';

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly connection: Connection,
    private readonly userService: UserService,
    private jtwSv: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;
    if (!headers?.authorization) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const token = headers.authorization.split(' ');
    if (token.length < 2 || token[0] != 'Bearer') {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const userJwt = await this.jtwSv.verify(token[1]);
    const user = await this.userService.getUserById(
      userJwt.id,
    );
    if (!user) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const result = super.canActivate(context);
    if (isObservable(result)) {
      return firstValueFrom(result);
    } else {
      return result;
    }
  }
}
