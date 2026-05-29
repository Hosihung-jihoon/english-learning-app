import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { CollectionSummary, Flashcard } from '@shared/types';
import { CollectionEntity } from './entities/collection.schema';
import { FlashcardEntity } from './entities/flashcard.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(CollectionEntity.name) private readonly collectionModel: Model<CollectionEntity>,
    @InjectModel(FlashcardEntity.name) private readonly flashcardModel: Model<FlashcardEntity>,
  ) {}

  async findAll(): Promise<CollectionSummary[]> {
    const collections = await this.collectionModel.find().lean();
    return Promise.all(collections.map((collection) => this.decorateCollection(collection)));
  }

  async findOne(id: string): Promise<CollectionSummary> {
    const collection = await this.collectionModel.findOne({ id }).lean();
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return this.decorateCollection(collection);
  }

  async getFlashcards(collectionId: string): Promise<Flashcard[]> {
    await this.ensureCollection(collectionId);
    const flashcards = await this.flashcardModel.find({ collectionId }).lean();
    return flashcards.map((flashcard) => this.toFlashcard(flashcard));
  }

  async createCollection(dto: CreateCollectionDto): Promise<CollectionSummary> {
    const slug = dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const collection = await this.collectionModel.create({
      id: slug || `collection-${Date.now()}`,
      title: dto.title,
      subtitle: '0 flashcard',
      description: dto.description || 'Bộ thẻ do bạn tạo.',
      filter: dto.filter,
      flashcardCount: 0,
      accentColor: '#55ba5d',
      softColor: '#e8f9eb',
      colors: ['#55ba5d', '#27ae60'],
      icon: 'folder-open-outline',
      previewWord: 'New',
      previewMeaning: 'Mới',
    });

    return this.decorateCollection(collection.toObject());
  }

  async createFlashcard(collectionId: string, dto: CreateFlashcardDto): Promise<Flashcard> {
    const collection = await this.ensureCollection(collectionId);
    const flashcard = await this.flashcardModel.create({
      id: `${collectionId}-${Date.now()}`,
      collectionId,
      word: dto.word,
      meaning: dto.meaning,
      note: dto.note,
      lessonId: dto.lessonId,
      example:
        dto.exampleEnglish || dto.exampleVietnamese
          ? {
              english: dto.exampleEnglish,
              vietnamese: dto.exampleVietnamese,
            }
          : undefined,
    });

    const nextCount = (await this.flashcardModel.countDocuments({ collectionId })) || 0;
    await this.collectionModel.updateOne(
      { id: collectionId },
      {
        flashcardCount: nextCount,
        subtitle: `${nextCount} flashcard`,
        previewWord: dto.word,
        previewMeaning: dto.meaning,
      },
    );

    return this.toFlashcard(flashcard.toObject());
  }

  private async ensureCollection(collectionId: string) {
    const collection = await this.collectionModel.findOne({ id: collectionId });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
  }

  private async decorateCollection(collection: CollectionSummary) {
    const flashcardCount = await this.flashcardModel.countDocuments({ collectionId: collection.id });
    return {
      ...collection,
      flashcardCount,
      subtitle: `${flashcardCount} flashcard`,
    } satisfies CollectionSummary;
  }

  private toFlashcard(flashcard: FlashcardEntity) {
    return {
      id: flashcard.id,
      collectionId: flashcard.collectionId,
      word: flashcard.word,
      meaning: flashcard.meaning,
      note: flashcard.note,
      lessonId: flashcard.lessonId,
      example:
        flashcard.example?.english && flashcard.example?.vietnamese
          ? {
              english: flashcard.example.english,
              vietnamese: flashcard.example.vietnamese,
            }
          : undefined,
    } satisfies Flashcard;
  }
}
