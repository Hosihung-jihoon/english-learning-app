import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import type { CourseContent, UserProfile } from '@shared/types';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CoursesService } from './courses.service';

@Controller('courses')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@CurrentUser() user: UserProfile): Promise<CourseContent[]> {
    return this.coursesService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserProfile): Promise<CourseContent> {
    return this.coursesService.findOne(id, user.id);
  }
}
