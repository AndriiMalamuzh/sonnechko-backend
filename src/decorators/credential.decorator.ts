import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { CredentialGuard } from '../guards/credential.guard';

export const CREDENTIAL_KEY = 'credential';
export const Credential = (credential: string) =>
  applyDecorators(SetMetadata(CREDENTIAL_KEY, credential), UseGuards(CredentialGuard));
