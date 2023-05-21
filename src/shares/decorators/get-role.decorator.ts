import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import jwtDecode from 'jwt-decode';
import { httpErrors } from 'src/shares/exceptions';

export const ActorRoleDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization;
      const payload: any = jwtDecode(token);
      return payload.role;
    } catch (e) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.BAD_REQUEST);
    }
  },
);
