import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { ProgressStatus } from '@shared/types';

export type UserProgressDocument = HydratedDocument<UserProgressEntity>;

@Schema({ collection: 'user_progress', timestamps: false })
export class UserProgressEntity {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  courseId!: string;

  @Prop({ required: true })
  lessonId!: string;

  @Prop({ required: true, type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' })
  status!: ProgressStatus;

  @Prop({ required: true })
  lastAccessedAt!: Date;

  @Prop()
  completedAt?: Date;

  @Prop()
  score?: number;

  @Prop()
  totalQuestions?: number;

  @Prop({ required: true, default: 0 })
  xpEarned!: number;
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgressEntity);
