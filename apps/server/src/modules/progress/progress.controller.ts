import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { MistakeReviewItem, ProgressSnapshot, UserProfile, UserProgressRecord } from '@shared/types';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { AuthGuard } from '../../common/auth/auth.guard';
import { MarkLessonAccessDto } from './dto/mark-lesson-access.dto';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(AuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  getSnapshot(@CurrentUser() user: UserProfile): Promise<ProgressSnapshot> {
    return this.progressService.getSnapshot(user.id);
  }

  @Get('review-mistakes')
  getReviewMistakes(@CurrentUser() user: UserProfile): Promise<MistakeReviewItem[]> {
    return this.progressService.getReviewMistakes(user.id);
  }

  @Post('lesson-access')
  markLessonAccess(@CurrentUser() user: UserProfile, @Body() dto: MarkLessonAccessDto): Promise<UserProgressRecord> {
    return this.progressService.markLessonAccess(user.id, dto.courseId, dto.lessonId);
  }
}
