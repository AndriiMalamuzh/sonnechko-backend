import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type IToken = HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  exp: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserAgent', required: true })
  user_agent: Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
