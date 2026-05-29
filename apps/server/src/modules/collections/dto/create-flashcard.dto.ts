import { IsOptional, IsString } from 'class-validator';

export class CreateFlashcardDto {
  @IsString()
  word!: string;

  @IsString()
  meaning!: string;

  @IsOptional()
  @IsString()
  exampleEnglish?: string;

  @IsOptional()
  @IsString()
  exampleVietnamese?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  lessonId?: string;
}
