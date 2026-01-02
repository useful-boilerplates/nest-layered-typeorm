import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { StrUtil } from '../utils/str.util';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const requestId = request.headers['x-request-id'] || StrUtil.generateUuid();

    request['requestId'] = requestId;

    response.setHeader('X-Request-ID', requestId);

    next();
  }
}
