import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type IToken = HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, type: Date })
  exp: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserAgent', required: true })
  user_agent: Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

// Add TTL index to automatically remove expired tokens from the database
TokenSchema.index({ exp: 1 }, { expireAfterSeconds: 0 });
