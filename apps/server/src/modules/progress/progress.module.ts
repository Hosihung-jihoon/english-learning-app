import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { UserProgressEntity, UserProgressSchema } from './entities/user-progress.schema';
import { QuizAttemptEntity, QuizAttemptSchema } from './entities/quiz-attempt.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserProgressEntity.name, schema: UserProgressSchema },
      { name: QuizAttemptEntity.name, schema: QuizAttemptSchema },
    ]),
    UsersModule,
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService, MongooseModule],
})
export class ProgressModule {}
