import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { QuizQuestion, QuizSubmissionResult } from '@shared/types';
import { LessonEntity } from '../lessons/entities/lesson.schema';
import { ProgressService } from '../progress/progress.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(LessonEntity.name) private readonly lessonModel: Model<LessonEntity>,
    private readonly progressService: ProgressService,
  ) {}

  async findByLesson(lessonId: string): Promise<QuizQuestion[]> {
    const lesson = await this.lessonModel.findOne({ id: lessonId }).lean();
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson.quiz;
  }

  async submit(userId: string, dto: SubmitQuizDto): Promise<QuizSubmissionResult> {
    const lesson = await this.lessonModel.findOne({ id: dto.lessonId }).lean();
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const correctQuestionIds: string[] = [];
    const incorrectQuestionIds: string[] = [];
    const mistakes = lesson.quiz.flatMap((question) => {
      const answer = dto.answers.find((item) => item.questionId === question.id);
      if (answer?.selectedAnswer === question.correctAnswer) {
        correctQuestionIds.push(question.id);
        return [];
      }

      incorrectQuestionIds.push(question.id);
      return [
        {
          id: `${lesson.id}-${question.id}`,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          questionId: question.id,
          prompt: question.prompt,
          selectedAnswer: answer?.selectedAnswer ?? '',
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        },
      ];
    });

    const score = correctQuestionIds.length;
    const total = lesson.quiz.length;
    const xpEarned = score * 5;

    await this.progressService.saveQuizAttempt({
      userId,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      score,
      total,
      answers: dto.answers,
      mistakes,
    });

    await this.progressService.completeLesson({
      userId,
      courseId: lesson.courseId,
      lessonId: lesson.id,
      score,
      totalQuestions: total,
      xpEarned,
    });

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      score,
      total,
      xpEarned,
      correctQuestionIds,
      incorrectQuestionIds,
      mistakes,
    };
  }
}
