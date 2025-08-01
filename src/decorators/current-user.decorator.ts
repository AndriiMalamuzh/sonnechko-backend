import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, RequestWithUser } from 'src/interfaces';

export const CurrentUser = createParamDecorator(
  (
    key: keyof JwtPayload,
    ctx: ExecutionContext
  ): JwtPayload | Partial<JwtPayload> | string | string[] => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return key ? request.user[key] : request.user;
  }
);
