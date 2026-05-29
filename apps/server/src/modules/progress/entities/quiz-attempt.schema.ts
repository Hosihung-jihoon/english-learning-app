import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type QuizAttemptDocument = HydratedDocument<QuizAttemptEntity>;

@Schema({ collection: 'quiz_attempts', timestamps: true })
export class QuizAttemptEntity {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  lessonId!: string;

  @Prop({ required: true })
  lessonTitle!: string;

  @Prop({ required: true })
  score!: number;

  @Prop({ required: true })
  total!: number;

  @Prop(
    raw([
      {
        questionId: { type: String, required: true },
        selectedAnswer: { type: String, required: true },
      },
    ]),
  )
  answers!: Array<{ questionId: string; selectedAnswer: string }>;

  @Prop(
    raw([
      {
        id: { type: String, required: true },
        lessonId: { type: String, required: true },
        lessonTitle: { type: String, required: true },
        questionId: { type: String, required: true },
        prompt: { type: String, required: true },
        selectedAnswer: { type: String, required: true },
        correctAnswer: { type: String, required: true },
        explanation: { type: String, required: true },
      },
    ]),
  )
  mistakes!: Array<{
    id: string;
    lessonId: string;
    lessonTitle: string;
    questionId: string;
    prompt: string;
    selectedAnswer: string;
    correctAnswer: string;
    explanation: string;
  }>;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttemptEntity);
