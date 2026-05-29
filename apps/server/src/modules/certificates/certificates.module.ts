import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { CertificateEntity, CertificateSchema } from './entities/certificate.schema';
import { UserProgressEntity, UserProgressSchema } from '../progress/entities/user-progress.schema';
import { CourseEntity, CourseSchema } from '../courses/entities/course.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CertificateEntity.name, schema: CertificateSchema },
      { name: UserProgressEntity.name, schema: UserProgressSchema },
      { name: CourseEntity.name, schema: CourseSchema },
    ]),
    UsersModule,
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService, MongooseModule],
})
export class CertificatesModule {}
