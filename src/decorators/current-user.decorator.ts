import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'src/interfaces';

interface RequestWithUser extends Request {
  user: {
    [key: string]: string;
  };
}

export const CurrentUser = createParamDecorator(
  (key: keyof JwtPayload, ctx: ExecutionContext): JwtPayload | Partial<JwtPayload> | string => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return key ? request.user[key] : request.user;
  }
);
