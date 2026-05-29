import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { Assessment, AssessmentResult } from '@shared/types';
import { AssessmentEntity } from './entities/assessment.schema';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(@InjectModel(AssessmentEntity.name) private readonly assessmentModel: Model<AssessmentEntity>) {}

  async findByTarget(targetType: string): Promise<Assessment> {
    const assessment = await this.assessmentModel.findOne({ targetType }).lean();
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }
    return assessment;
  }

  async submit(dto: SubmitAssessmentDto): Promise<AssessmentResult> {
    const assessment = await this.assessmentModel.findOne({ id: dto.assessmentId }).lean();
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const correctCount = assessment.questions.reduce((count, question) => {
      const answer = dto.answers.find((item) => item.questionId === question.id);
      return count + (answer?.selectedAnswer === question.correctAnswer ? 1 : 0);
    }, 0);

    return {
      assessmentId: assessment.id,
      targetType: assessment.targetType,
      score: correctCount,
      total: assessment.questions.length,
      recommendedCourseId: assessment.recommendedCourseId,
    };
  }
}
