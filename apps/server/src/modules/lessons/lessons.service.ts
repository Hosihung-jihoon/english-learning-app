import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { LessonContent } from '@shared/types';
import { LessonEntity } from './entities/lesson.schema';

@Injectable()
export class LessonsService {
  constructor(@InjectModel(LessonEntity.name) private readonly lessonModel: Model<LessonEntity>) {}

  async findAll(courseId?: string): Promise<LessonContent[]> {
    const query = courseId ? { courseId } : {};
    return this.lessonModel.find(query).lean();
  }

  async findOne(id: string): Promise<LessonContent> {
    const lesson = await this.lessonModel.findOne({ id }).lean();
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }
}
