import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { MistakeReviewItem, ProgressSnapshot, UserProgressRecord } from '@shared/types';
import { UserProgressEntity } from './entities/user-progress.schema';
import { QuizAttemptEntity } from './entities/quiz-attempt.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(UserProgressEntity.name) private readonly progressModel: Model<UserProgressEntity>,
    @InjectModel(QuizAttemptEntity.name) private readonly quizAttemptModel: Model<QuizAttemptEntity>,
  ) {}

  async markLessonAccess(userId: string, courseId: string, lessonId: string) {
    const existing = await this.progressModel.findOne({ userId, courseId, lessonId });
    if (existing) {
      existing.lastAccessedAt = new Date();
      if (existing.status === 'not_started') {
        existing.status = 'in_progress';
      }
      await existing.save();
      return this.toRecord(existing.toObject());
    }

    const created = await this.progressModel.create({
      userId,
      courseId,
      lessonId,
      status: 'in_progress',
      lastAccessedAt: new Date(),
      xpEarned: 0,
    });

    return this.toRecord(created.toObject());
  }

  async completeLesson(params: {
    userId: string;
    courseId: string;
    lessonId: string;
    score: number;
    totalQuestions: number;
    xpEarned: number;
  }) {
    const existing = await this.progressModel.findOne({
      userId: params.userId,
      courseId: params.courseId,
      lessonId: params.lessonId,
    });

    if (existing) {
      existing.status = 'completed';
      existing.lastAccessedAt = new Date();
      existing.completedAt = new Date();
      existing.score = params.score;
      existing.totalQuestions = params.totalQuestions;
      existing.xpEarned = Math.max(existing.xpEarned, params.xpEarned);
      await existing.save();
      return this.toRecord(existing.toObject());
    }

    const created = await this.progressModel.create({
      ...params,
      status: 'completed',
      lastAccessedAt: new Date(),
      completedAt: new Date(),
    });

    return this.toRecord(created.toObject());
  }

  async saveQuizAttempt(payload: {
    userId: string;
    lessonId: string;
    lessonTitle: string;
    score: number;
    total: number;
    answers: Array<{ questionId: string; selectedAnswer: string }>;
    mistakes: MistakeReviewItem[];
  }) {
    return this.quizAttemptModel.create(payload);
  }

  async getSnapshot(userId: string): Promise<ProgressSnapshot> {
    const records = await this.progressModel.find({ userId }).sort({ lastAccessedAt: -1 }).lean();
    const totalXp = records.reduce((sum, record) => sum + (record.xpEarned ?? 0), 0);
    const lessonsCompleted = records.filter((record) => record.status === 'completed').length;
    const coursesStarted = new Set(records.map((record) => record.courseId)).size;

    return {
      streakDays: Math.min(7, Math.max(1, lessonsCompleted || records.length ? 1 + Math.floor(totalXp / 20) : 0)),
      coursesStarted,
      lessonsCompleted,
      totalXp,
      records: records.map((record) => this.toRecord(record)),
    };
  }

  async getReviewMistakes(userId: string): Promise<MistakeReviewItem[]> {
    const attempts = await this.quizAttemptModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return attempts.flatMap((attempt) => attempt.mistakes ?? []);
  }

  private toRecord(record: UserProgressEntity & { _id?: { toString(): string } }) {
    return {
      id: record._id?.toString() ?? `${record.userId}-${record.lessonId}`,
      userId: record.userId,
      courseId: record.courseId,
      lessonId: record.lessonId,
      status: record.status,
      lastAccessedAt: record.lastAccessedAt.toISOString(),
      completedAt: record.completedAt?.toISOString(),
      score: record.score,
      totalQuestions: record.totalQuestions,
      xpEarned: record.xpEarned ?? 0,
    } satisfies UserProgressRecord;
  }
}
