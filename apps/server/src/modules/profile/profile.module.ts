import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UsersModule } from '../users/users.module';
import { ProgressModule } from '../progress/progress.module';
import { CertificatesModule } from '../certificates/certificates.module';

@Module({
  imports: [UsersModule, ProgressModule, CertificatesModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
