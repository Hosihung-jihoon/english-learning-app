import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  defaultAssessments,
  defaultCollections,
  defaultCourses,
  defaultFlashcards,
  defaultLessons,
  defaultTargets,
} from '@shared/seed/default-content';
import { AssessmentEntity } from '../assessments/entities/assessment.schema';
import { CertificateEntity } from '../certificates/entities/certificate.schema';
import { CollectionEntity } from '../collections/entities/collection.schema';
import { FlashcardEntity } from '../collections/entities/flashcard.schema';
import { CourseEntity } from '../courses/entities/course.schema';
import { LessonEntity } from '../lessons/entities/lesson.schema';
import { TargetEntity } from '../targets/entities/target.schema';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(
    @InjectModel(TargetEntity.name) private readonly targetModel: Model<TargetEntity>,
    @InjectModel(CourseEntity.name) private readonly courseModel: Model<CourseEntity>,
    @InjectModel(LessonEntity.name) private readonly lessonModel: Model<LessonEntity>,
    @InjectModel(CollectionEntity.name) private readonly collectionModel: Model<CollectionEntity>,
    @InjectModel(FlashcardEntity.name) private readonly flashcardModel: Model<FlashcardEntity>,
    @InjectModel(AssessmentEntity.name) private readonly assessmentModel: Model<AssessmentEntity>,
    @InjectModel(CertificateEntity.name) private readonly certificateModel: Model<CertificateEntity>,
  ) {}

  async onModuleInit() {
    const [targetCount, courseCount, lessonCount, collectionCount, flashcardCount, assessmentCount, certificateCount] =
      await Promise.all([
        this.targetModel.countDocuments(),
        this.courseModel.countDocuments(),
        this.lessonModel.countDocuments(),
        this.collectionModel.countDocuments(),
        this.flashcardModel.countDocuments(),
        this.assessmentModel.countDocuments(),
        this.certificateModel.countDocuments(),
      ]);

    if (!targetCount) {
      await this.targetModel.insertMany(defaultTargets);
    }
    if (!courseCount) {
      await this.courseModel.insertMany(defaultCourses);
    }
    if (!lessonCount) {
      await this.lessonModel.insertMany(defaultLessons);
    }
    if (!collectionCount) {
      await this.collectionModel.insertMany(defaultCollections);
    }
    if (!flashcardCount) {
      await this.flashcardModel.insertMany(defaultFlashcards);
    }
    if (!assessmentCount) {
      await this.assessmentModel.insertMany(defaultAssessments);
    }
    if (!certificateCount) {
      await this.certificateModel.insertMany([
        {
          id: 'certificate-toeic',
          title: 'Chứng nhận hoàn thành TOEIC',
          subtitle: 'Unlock your certificate of completion',
          targetType: 'toeic',
        },
        {
          id: 'certificate-ielts',
          title: 'Chứng nhận hoàn thành IELTS',
          subtitle: 'Unlock your certificate of completion',
          targetType: 'ielts',
        },
      ]);
    }
  }
}
