import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { CourseContent } from '@shared/types';
import { CourseEntity } from './entities/course.schema';
import { UserProgressEntity } from '../progress/entities/user-progress.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(CourseEntity.name) private readonly courseModel: Model<CourseEntity>,
    @InjectModel(UserProgressEntity.name) private readonly progressModel: Model<UserProgressEntity>,
  ) {}

  async findAll(userId: string): Promise<CourseContent[]> {
    const courses = await this.courseModel.find().lean();
    return Promise.all(courses.map((course) => this.decorateProgress(course, userId)));
  }

  async findOne(id: string, userId: string): Promise<CourseContent> {
    const course = await this.courseModel.findOne({ id }).lean();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.decorateProgress(course, userId);
  }

  private async decorateProgress(course: CourseContent, userId: string) {
    const completedLessons = await this.progressModel.countDocuments({
      userId,
      courseId: course.id,
      status: 'completed',
    });
    const progressPercent = course.lessonIds.length
      ? Math.round((completedLessons / course.lessonIds.length) * 100)
      : 0;

    return {
      ...course,
      progressPercent,
    } satisfies CourseContent;
  }
}
