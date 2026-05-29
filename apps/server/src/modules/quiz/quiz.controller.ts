import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import type { QuizQuestion, QuizSubmissionResult, UserProfile } from '@shared/types';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { AuthGuard } from '../../common/auth/auth.guard';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizService } from './quiz.service';

@Controller('quiz')
@UseGuards(AuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  findByLesson(@Query('lessonId') lessonId: string): Promise<QuizQuestion[]> {
    return this.quizService.findByLesson(lessonId);
  }

  @Post('submit')
  submit(@CurrentUser() user: UserProfile, @Body() dto: SubmitQuizDto): Promise<QuizSubmissionResult> {
    return this.quizService.submit(user.id, dto);
  }
}
