import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { Flashcard } from '@shared/types';
import { FlashcardEntity } from '../collections/entities/flashcard.schema';

@Injectable()
export class VocabularyService {
  constructor(@InjectModel(FlashcardEntity.name) private readonly flashcardModel: Model<FlashcardEntity>) {}

  async findByLesson(lessonId?: string): Promise<Flashcard[]> {
    const query = lessonId ? { lessonId } : {};
    const flashcards = await this.flashcardModel.find(query).lean();
    return flashcards.map((flashcard) => ({
      id: flashcard.id,
      collectionId: flashcard.collectionId,
      word: flashcard.word,
      meaning: flashcard.meaning,
      lessonId: flashcard.lessonId,
      note: flashcard.note,
      example:
        flashcard.example?.english && flashcard.example?.vietnamese
          ? {
              english: flashcard.example.english,
              vietnamese: flashcard.example.vietnamese,
            }
          : undefined,
    }));
  }
}
