import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { TourGuideService } from 'src/modules/tourguide/tour-guide.service';
import { httpErrors } from 'src/shares/exceptions';
import { Connection } from 'typeorm';

@Injectable()
export class TourGuideAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly connection: Connection,
    private readonly tourGuideService: TourGuideService,
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
      const tourGuideJwt = await this.jtwSv.verify(token[1]);
      const tourGuide =
        await this.tourGuideService.getTourguideByIdUsernameEmail(
          tourGuideJwt.id,
          tourGuideJwt.username,
          tourGuideJwt.email,
        );
      if (!tourGuide) {
        throw new HttpException(
          httpErrors.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED,
        );
      }
      return tourGuideJwt;
    } catch (error) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
  }
}
