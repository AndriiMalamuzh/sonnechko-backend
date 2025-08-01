import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../guards/role.guard';

export const ROLE_KEY = 'role';
export const Role = (role: string) =>
  applyDecorators(SetMetadata(ROLE_KEY, role), UseGuards(RoleGuard));
