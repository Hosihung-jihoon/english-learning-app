import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseSeedService } from './database-seed.service';
import { TargetEntity, TargetSchema } from '../targets/entities/target.schema';
import { CourseEntity, CourseSchema } from '../courses/entities/course.schema';
import { LessonEntity, LessonSchema } from '../lessons/entities/lesson.schema';
import { CollectionEntity, CollectionSchema } from '../collections/entities/collection.schema';
import { FlashcardEntity, FlashcardSchema } from '../collections/entities/flashcard.schema';
import { AssessmentEntity, AssessmentSchema } from '../assessments/entities/assessment.schema';
import { CertificateEntity, CertificateSchema } from '../certificates/entities/certificate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TargetEntity.name, schema: TargetSchema },
      { name: CourseEntity.name, schema: CourseSchema },
      { name: LessonEntity.name, schema: LessonSchema },
      { name: CollectionEntity.name, schema: CollectionSchema },
      { name: FlashcardEntity.name, schema: FlashcardSchema },
      { name: AssessmentEntity.name, schema: AssessmentSchema },
      { name: CertificateEntity.name, schema: CertificateSchema },
    ]),
  ],
  providers: [DatabaseSeedService],
})
export class DatabaseSeedModule {}
