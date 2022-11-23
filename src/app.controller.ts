import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    status: 200,
    description: 'A wonderful Hello World! messsage',
    type: 'string',
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('error')
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'InternalServerError example REST API',
    type: InternalServerErrorException,
    schema: {
      status: 500,
      message: 'Something went wrong',
      error: 'InternalServerError',
    } as any,
  })
  throwError(@Req() req: Request): InternalServerErrorException {
    return this.appService.throwError(req);
  }
}
