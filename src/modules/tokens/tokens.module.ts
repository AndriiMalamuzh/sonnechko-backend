import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensService } from 'src/modules/tokens/tokens.service';
import { Token, TokenSchema } from 'src/schemas/token.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
