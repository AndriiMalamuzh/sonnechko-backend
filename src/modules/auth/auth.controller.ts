import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Cookie, UserAgent } from 'src/decorators';
import { SignResponseInterface } from 'src/interfaces';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginDto } from 'src/modules/auth/dto';
import { TokensService } from 'src/modules/tokens/tokens.service';
import { CreateUserDto } from 'src/modules/users/dto';
import { IToken } from 'src/schemas/token.schema';
import { IUserAgent } from 'src/schemas/user-agent.schema';
import { IUser } from 'src/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
    private readonly configService: ConfigService
  ) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Return created user and access token',
    type: SignResponseInterface,
  })
  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res() res: Response,
    @UserAgent() agent: IUserAgent
  ): Promise<void> {
    const result = await this.authService.register(dto, agent);
    if (!result) {
      throw new Error('Something went wrong');
    }
    this.setRefreshTokenToCookies(result, res);
  }

  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Return user and access token',
    type: SignResponseInterface,
  })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @UserAgent() agent: IUserAgent
  ): Promise<void> {
    const result = await this.authService.login(dto, agent);
    if (!result) {
      throw new Error('Something went wrong');
    }
    this.setRefreshTokenToCookies(result, res);
  }

  @Get('logout')
  async logout(@Cookie('refreshToken') refreshToken: string, @Res() res: Response): Promise<void> {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }
    await this.tokensService.deleteToken(refreshToken);
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });
    res.sendStatus(HttpStatus.OK);
  }

  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: 200,
    description: 'Return user and access token',
    type: SignResponseInterface,
  })
  @Get('refresh-tokens')
  async refreshTokens(
    @Cookie('refreshToken') refreshToken: string,
    @Res() res: Response,
    @UserAgent() agent: IUserAgent
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const result = await this.authService.refreshTokens(refreshToken, agent);
    if (!result) {
      throw new Error('Something went wrong');
    }
    this.setRefreshTokenToCookies(result, res);
  }

  private setRefreshTokenToCookies(
    result: { user: IUser; accessToken: string; refreshToken: IToken },
    res: Response
  ): void {
    if (!result.refreshToken?.token) {
      throw new UnauthorizedException();
    }
    res.cookie('refreshToken', result.refreshToken?.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(result?.refreshToken?.exp),
      secure: this.configService.get('NODE_ENV') !== 'dev',
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ user: result.user, accessToken: result.accessToken });
  }
}
