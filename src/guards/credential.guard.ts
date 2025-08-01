import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CREDENTIAL_KEY } from 'src/decorators';
import { RequestWithUser } from 'src/interfaces';

@Injectable()
export class CredentialGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredCredential = this.reflector.getAllAndOverride<string>(CREDENTIAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredCredential) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;

    if (!user || !user.credentials || !user.credentials.includes(requiredCredential)) {
      throw new ForbiddenException('Insufficient credential permissions');
    }

    return true;
  }
}
