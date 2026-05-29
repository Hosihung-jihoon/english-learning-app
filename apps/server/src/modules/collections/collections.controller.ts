import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { CollectionSummary, Flashcard } from '@shared/types';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';

@Controller('collections')
@UseGuards(AuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll(): Promise<CollectionSummary[]> {
    return this.collectionsService.findAll();
  }

  @Post()
  createCollection(@Body() dto: CreateCollectionDto): Promise<CollectionSummary> {
    return this.collectionsService.createCollection(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CollectionSummary> {
    return this.collectionsService.findOne(id);
  }

  @Get(':id/flashcards')
  getFlashcards(@Param('id') id: string): Promise<Flashcard[]> {
    return this.collectionsService.getFlashcards(id);
  }

  @Post(':id/flashcards')
  createFlashcard(@Param('id') id: string, @Body() dto: CreateFlashcardDto): Promise<Flashcard> {
    return this.collectionsService.createFlashcard(id, dto);
  }
}
