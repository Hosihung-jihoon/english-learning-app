import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { Certificate } from '@shared/types';
import { CertificateEntity } from './entities/certificate.schema';
import { UserProgressEntity } from '../progress/entities/user-progress.schema';
import { CourseEntity } from '../courses/entities/course.schema';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(CertificateEntity.name) private readonly certificateModel: Model<CertificateEntity>,
    @InjectModel(UserProgressEntity.name) private readonly progressModel: Model<UserProgressEntity>,
    @InjectModel(CourseEntity.name) private readonly courseModel: Model<CourseEntity>,
  ) {}

  async getForUser(userId: string): Promise<Certificate[]> {
    const [templates, progressRecords, courses] = await Promise.all([
      this.certificateModel.find().lean(),
      this.progressModel.find({ userId, status: 'completed' }).lean(),
      this.courseModel.find().lean(),
    ]);

    return templates.map((template) => {
      const courseIds = courses.filter((course) => course.targetType === template.targetType).map((course) => course.id);
      const hasCompletedTarget = progressRecords.some((record) => courseIds.includes(record.courseId));

      return {
        ...template,
        unlocked: hasCompletedTarget,
      } satisfies Certificate;
    });
  }
}
