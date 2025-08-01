import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { CredentialGuard, JwtAuthGuard } from 'src/guards';

export const CREDENTIAL_KEY = 'credential';
export const Credential = (credential: string) =>
  applyDecorators(
    SetMetadata(CREDENTIAL_KEY, credential),
    UseGuards(JwtAuthGuard, CredentialGuard)
  );
