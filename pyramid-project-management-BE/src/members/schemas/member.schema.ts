import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member {
  @Prop({ required: true })
  name: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  role: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
