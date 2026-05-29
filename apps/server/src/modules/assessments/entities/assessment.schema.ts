import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { TargetType } from '@shared/types';

export type AssessmentDocument = HydratedDocument<AssessmentEntity>;

@Schema({ collection: 'assessments', timestamps: false })
export class AssessmentEntity {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, type: String, enum: ['toeic', 'ielts'] })
  targetType!: TargetType;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  recommendedCourseId!: string;

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
  questions!: Array<{
    id: string;
    instruction: string;
    prompt: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

export const AssessmentSchema = SchemaFactory.createForClass(AssessmentEntity);
