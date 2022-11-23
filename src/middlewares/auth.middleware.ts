import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NestMiddleware,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { catchError, lastValueFrom, retry } from 'rxjs';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(AuthenticationMiddleware.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const { data } = await lastValueFrom(
      this.httpService
        .get('http://localhost:3001/auth/verify', {
          headers: {
            Authorization: ExtractJwt.fromAuthHeaderAsBearerToken().call(
              null,
              req,
            ),
            'X-Correlation-Id': req.headers['x-correlation-id'],
          },
        })
        .pipe(
          catchError((err: AxiosError) => {
            // Forward existing Correlation Id, if exist any
            res.setHeader(
              'x-correlation-id',
              err.response.headers['x-correlation-id'] || undefined,
            );

            throw new UnauthorizedException(
              'You are not authorize to access this resource',
            );
          }),
          retry(2),
        ),
    );

    req.user = data;

    next();
  }
}
