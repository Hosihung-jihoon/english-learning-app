import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import type { TargetContent } from '@shared/types';
import { AuthGuard } from '../../common/auth/auth.guard';
import { TargetsService } from './targets.service';

@Controller('targets')
@UseGuards(AuthGuard)
export class TargetsController {
  constructor(private readonly targetsService: TargetsService) {}

  @Get()
  findAll(): Promise<TargetContent[]> {
    return this.targetsService.findAll();
  }

  @Get(':type')
  findOne(@Param('type') type: string): Promise<TargetContent> {
    return this.targetsService.findOne(type);
  }
}
