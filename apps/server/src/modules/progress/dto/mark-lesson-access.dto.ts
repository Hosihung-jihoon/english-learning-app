import { IsString } from 'class-validator';

export class MarkLessonAccessDto {
  @IsString()
  courseId!: string;

  @IsString()
  lessonId!: string;
}
