import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { LoginDto } from 'src/modules/auth/dto';
import { TokensService } from 'src/modules/tokens/tokens.service';
import { CreateUserDto } from 'src/modules/users/dto';
import { UsersService } from 'src/modules/users/users.service';
import { IToken } from 'src/schemas/token.schema';
import { IUserAgent } from 'src/schemas/user-agent.schema';
import { IUser, userPublicFields } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly jwtService: JwtService
  ) {}

  async register(
    body: CreateUserDto,
    agent: IUserAgent
  ): Promise<{ user: IUser; accessToken: string; refreshToken: IToken }> {
    const user = await this.usersService.save(body);
    return this.generateTokens(user, agent);
  }

  async login(
    body: LoginDto,
    agent: IUserAgent
  ): Promise<{ user: IUser; accessToken: string; refreshToken: IToken }> {
    const user = await this.usersService.findByEmail(body.email, {
      ...userPublicFields,
      password: 1,
    });
    if (!user || !compareSync(body.password, user.password)) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    const userWithoutPassword = await this.usersService.findById(
      user._id.toString(),
      userPublicFields
    );
    return this.generateTokens(userWithoutPassword, agent);
  }

  async refreshTokens(
    refreshToken: string,
    agent: IUserAgent
  ): Promise<{ user: IUser; accessToken: string; refreshToken: IToken }> {
    const token = await this.tokensService.findByToken(refreshToken);
    await this.tokensService.deleteToken(refreshToken);
    if (token.exp < Date.now()) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findById(token.user.toString(), userPublicFields);
    return this.generateTokens(user, agent);
  }

  private async generateTokens(
    user: IUser,
    agent: IUserAgent
  ): Promise<{ user: IUser; accessToken: string; refreshToken: IToken }> {
    const refreshToken = await this.tokensService.createRefreshToken(user, agent);
    return {
      user,
      accessToken: this.generateAccessToken(user),
      refreshToken,
    };
  }

  private generateAccessToken(user: IUser): string {
    return this.jwtService.sign({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  }
}
