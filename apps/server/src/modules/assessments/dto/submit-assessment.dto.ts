import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AssessmentAnswerDto {
  @IsString()
  questionId!: string;

  @IsString()
  selectedAnswer!: string;
}

export class SubmitAssessmentDto {
  @IsString()
  assessmentId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssessmentAnswerDto)
  answers!: AssessmentAnswerDto[];
}
