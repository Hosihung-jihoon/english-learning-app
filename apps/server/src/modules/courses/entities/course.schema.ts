import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { TargetType } from '@shared/types';

export type CourseDocument = HydratedDocument<CourseEntity>;

@Schema({ collection: 'courses', timestamps: false })
export class CourseEntity {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, type: String, enum: ['toeic', 'ielts'] })
  targetType!: TargetType;

  @Prop({ required: true })
  unitLabel!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, default: 0 })
  progressPercent!: number;

  @Prop({ required: true })
  duration!: string;

  @Prop({ required: true, type: [String], default: [] })
  lessonIds!: string[];

  @Prop()
  lockedAssessmentTitle?: string;
}

export const CourseSchema = SchemaFactory.createForClass(CourseEntity);
