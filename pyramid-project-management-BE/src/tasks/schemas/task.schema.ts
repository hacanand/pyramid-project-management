import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Member, MemberSchema } from '../../members/schemas/member.schema';

export type TaskDocument = Task & Document;

@Schema()
export class Comment {
  @Prop({ type: MemberSchema, required: true })
  author: Member;

  @Prop({ required: true })
  timestamp: string;

  @Prop({ required: true })
  body: string;
}

@Schema()
export class SubTask {
  @Prop({ required: true })
  title: string;

  @Prop()
  priority: string;

  @Prop()
  dueDate: string;

  @Prop([String])
  memberIds: string[];
}

@Schema()
export class Update {
  @Prop({ type: MemberSchema, required: true })
  author: Member;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  timestamp: string;
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  priority: string;

  @Prop()
  status: string;

  @Prop()
  projectId: string;

  @Prop()
  reporterId: string;

  @Prop()
  dueDate: string;

  @Prop([String])
  memberIds: string[];

  @Prop([String])
  labels: string[];

  @Prop({ type: [SchemaFactory.createForClass(Comment)], default: [] })
  comments: Comment[];

  @Prop({ type: [SchemaFactory.createForClass(SubTask)], default: [] })
  subtasks: SubTask[];

  @Prop({ type: [SchemaFactory.createForClass(Update)], default: [] })
  updates: Update[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
