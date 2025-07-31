import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Extend the Express Request interface to include cookies
interface RequestWithCookies extends Request {
  cookies: {
    [key: string]: string;
  };
}

export const Cookie = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithCookies>();
  return key && key in request.cookies ? request.cookies[key] : request.cookies;
});
