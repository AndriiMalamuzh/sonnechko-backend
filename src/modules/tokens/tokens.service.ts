import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { IToken, Token } from 'src/schemas/token.schema';
import { IUserAgent } from 'src/schemas/user-agent.schema';
import { IUser } from 'src/schemas/user.schema';
import { v4 } from 'uuid';

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<IToken>) {}

  async createRefreshToken(user: IUser, agent: IUserAgent): Promise<IToken> {
    const expirationDays = parseInt(process.env.REFRESH_TOKEN_EXP || '30');
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    const token = await this.tokenModel.findOne({ user: user._id, user_agent: agent });
    if (token) {
      token.token = v4();
      token.exp = expirationDate.getTime();
      return await token.save();
    } else {
      return await this.tokenModel.create({
        token: v4(),
        exp: expirationDate.getTime(),
        user: user._id,
        user_agent: agent,
      });
    }
  }

  async findByToken(token: string): Promise<IToken> {
    const foundToken = await this.tokenModel.findOne({ token });
    if (!foundToken) {
      throw new UnauthorizedException();
    }
    return foundToken;
  }

  async deleteToken(token: string): Promise<DeleteResult> {
    const deletedToken = await this.tokenModel.deleteOne({ token });
    if (!deletedToken) {
      throw new UnauthorizedException();
    }
    return deletedToken;
  }
}
