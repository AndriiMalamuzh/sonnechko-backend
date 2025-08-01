import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RoleGuard } from 'src/guards';

export const ROLE_KEY = 'role';
export const Role = (role: string) =>
  applyDecorators(SetMetadata(ROLE_KEY, role), UseGuards(JwtAuthGuard, RoleGuard));
