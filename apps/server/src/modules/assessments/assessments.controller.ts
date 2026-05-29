import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { Assessment, AssessmentResult } from '@shared/types';
import { AuthGuard } from '../../common/auth/auth.guard';
import { AssessmentsService } from './assessments.service';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

@Controller('assessments')
@UseGuards(AuthGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get(':targetType')
  findByTarget(@Param('targetType') targetType: string): Promise<Assessment> {
    return this.assessmentsService.findByTarget(targetType);
  }

  @Post('submit')
  submit(@Body() dto: SubmitAssessmentDto): Promise<AssessmentResult> {
    return this.assessmentsService.submit(dto);
  }
}
