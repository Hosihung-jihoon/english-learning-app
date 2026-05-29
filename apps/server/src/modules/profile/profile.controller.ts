import { Controller, Get, UseGuards } from '@nestjs/common';
import type { ProfileSummary, UserProfile } from '@shared/types';
import { defaultAchievements } from '@shared/seed/default-content';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { CertificatesService } from '../certificates/certificates.service';
import { ProgressService } from '../progress/progress.service';

@Controller('users')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(
    private readonly progressService: ProgressService,
    private readonly certificatesService: CertificatesService,
  ) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: UserProfile): Promise<ProfileSummary> {
    const progress = await this.progressService.getSnapshot(user.id);
    const certificates = await this.certificatesService.getForUser(user.id);
    const totalXp = progress.totalXp;

    return {
      user: {
        ...user,
        scoreLabel: `${Math.max(0, 7 + totalXp / 100).toFixed(1)} Điểm`,
      },
      progress,
      metrics: [
        { name: 'Phát âm', value: Math.min(95, 55 + progress.lessonsCompleted * 7), color: '#4facfe' },
        { name: 'Trôi chảy', value: Math.min(92, 45 + progress.totalXp / 10), color: '#f5576c' },
        { name: 'Nghe', value: Math.min(96, 50 + progress.coursesStarted * 10), color: '#00bd50' },
        { name: 'Đọc', value: Math.min(94, 48 + progress.lessonsCompleted * 8), color: '#ffa100' },
        { name: 'Ngữ điệu', value: Math.min(90, 44 + progress.streakDays * 8), color: '#7e7bec' },
      ],
      achievements: defaultAchievements.map((achievement, index) => ({
        ...achievement,
        unlocked: progress.totalXp >= (index + 1) * 10,
      })),
      certificates,
    };
  }
}
