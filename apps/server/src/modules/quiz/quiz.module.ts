import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { LessonEntity, LessonSchema } from '../lessons/entities/lesson.schema';
import { ProgressModule } from '../progress/progress.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LessonEntity.name, schema: LessonSchema }]),
    ProgressModule,
    UsersModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
