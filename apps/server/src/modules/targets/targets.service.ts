import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { TargetContent } from '@shared/types';
import { TargetEntity } from './entities/target.schema';

@Injectable()
export class TargetsService {
  constructor(@InjectModel(TargetEntity.name) private readonly targetModel: Model<TargetEntity>) {}

  async findAll(): Promise<TargetContent[]> {
    return this.targetModel.find().lean();
  }

  async findOne(type: string): Promise<TargetContent> {
    const target = await this.targetModel.findOne({ type }).lean();
    if (!target) {
      throw new NotFoundException('Target not found');
    }

    return target;
  }
}
