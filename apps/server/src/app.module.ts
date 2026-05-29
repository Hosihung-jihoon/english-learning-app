import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TargetsModule } from './modules/targets/targets.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { ProgressModule } from './modules/progress/progress.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { DatabaseSeedModule } from './modules/database-seed/database-seed.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    // Load .env globally (isGlobal = true → không cần import lại ở module con)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Kết nối MongoDB Atlas qua Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),

    CloudinaryModule,
    ProgressModule,
    CertificatesModule,
    UsersModule,
    AuthModule,
    TargetsModule,
    CoursesModule,
    LessonsModule,
    VocabularyModule,
    QuizModule,
    CollectionsModule,
    AssessmentsModule,
    ProfileModule,
    DatabaseSeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
