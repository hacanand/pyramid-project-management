import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  title: string;

  @Prop({ required: true, unique: true })
  username: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
