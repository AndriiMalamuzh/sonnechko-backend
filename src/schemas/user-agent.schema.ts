import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IUserAgent = HydratedDocument<UserAgent>;

@Schema()
export class UserAgent {
  @Prop({ required: true })
  agent: string;

  @Prop({ required: false })
  browser: string;

  @Prop({ required: false })
  os: string;

  @Prop({ required: false })
  device: string;
}

export const UserAgentSchema = SchemaFactory.createForClass(UserAgent);
