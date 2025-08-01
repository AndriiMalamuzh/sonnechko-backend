import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { options } from 'src/modules/auth/config';
import { TokensModule } from 'src/modules/tokens/tokens.module';
import { UsersModule } from 'src/modules/users/users.module';
import { STRATEGIES } from 'src/strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES],
  imports: [PassportModule, JwtModule.registerAsync(options()), UsersModule, TokensModule],
})
export class AuthModule {}
