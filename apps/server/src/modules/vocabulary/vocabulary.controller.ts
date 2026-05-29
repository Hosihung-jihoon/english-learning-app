import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { Flashcard } from '@shared/types';
import { AuthGuard } from '../../common/auth/auth.guard';
import { VocabularyService } from './vocabulary.service';

@Controller('vocabulary')
@UseGuards(AuthGuard)
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get()
  findByLesson(@Query('lessonId') lessonId?: string): Promise<Flashcard[]> {
    return this.vocabularyService.findByLesson(lessonId);
  }
}
