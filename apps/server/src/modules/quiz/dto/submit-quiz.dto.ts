import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuizAnswerDto {
  @IsString()
  questionId!: string;

  @IsString()
  selectedAnswer!: string;
}

export class SubmitQuizDto {
  @IsString()
  lessonId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers!: QuizAnswerDto[];
}
