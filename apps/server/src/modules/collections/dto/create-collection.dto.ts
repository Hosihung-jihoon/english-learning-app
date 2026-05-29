import { IsIn, IsOptional, IsString } from 'class-validator';
import type { CollectionFilter } from '@shared/types';

export class CreateCollectionDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['vocabulary', 'sentence-pattern', 'grammar', 'listening-speaking'])
  filter!: CollectionFilter;
}
