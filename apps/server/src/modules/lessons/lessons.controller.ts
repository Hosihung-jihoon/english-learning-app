import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import type { LessonContent } from '@shared/types';
import { AuthGuard } from '../../common/auth/auth.guard';
import { LessonsService } from './lessons.service';

@Controller('lessons')
@UseGuards(AuthGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll(@Query('courseId') courseId?: string): Promise<LessonContent[]> {
    return this.lessonsService.findAll(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<LessonContent> {
    return this.lessonsService.findOne(id);
  }
}
