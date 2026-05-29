import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { LessonContentType } from '@shared/types';

export type LessonDocument = HydratedDocument<LessonEntity>;

@Schema({ collection: 'lessons', timestamps: false })
export class LessonEntity {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  courseId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  label!: string;

  @Prop({ required: true })
  questionCount!: number;

  @Prop({ required: true })
  duration!: string;

  @Prop({ required: true, type: String, enum: ['vocabulary', 'grammar', 'sentence-pattern'] })
  contentType!: LessonContentType;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, type: [String], default: [] })
  theory!: string[];

  @Prop(
    raw({
      english: { type: String, required: true },
      vietnamese: { type: String, required: true },
    }),
  )
  example!: { english: string; vietnamese: string };

  @Prop({ required: true, type: [String], default: [] })
  guidance!: string[];

  @Prop(
    raw([
      {
        id: { type: String, required: true },
        instruction: { type: String, required: true },
        prompt: { type: String, required: true },
        options: { type: [String], required: true, default: [] },
        correctAnswer: { type: String, required: true },
        explanation: { type: String, required: true },
      },
    ]),
  )
  quiz!: Array<{
    id: string;
    instruction: string;
    prompt: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

export const LessonSchema = SchemaFactory.createForClass(LessonEntity);
