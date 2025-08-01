import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type IUser = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({ required: true, uniqueItems: true, type: String })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ required: true, type: String })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ default: 'user', enum: ['user', 'admin'] })
  @Prop({ default: 'user' })
  role: 'user' | 'admin';

  @ApiProperty({ default: [], type: [String] })
  @Prop({ default: [] })
  credentials: string[];

  @ApiProperty({ default: 'current_timestamp', required: false })
  @Prop({ index: true, default: Date.now })
  date_created?: number;

  @ApiProperty({ default: 'current_timestamp', required: false })
  @Prop({ default: Date.now })
  date_updated?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const userPublicFields = {
  email: 1,
  role: 1,
  credentials: 1,
  date_created: 1,
  date_updated: 1,
};
