import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { CollectionEntity, CollectionSchema } from './entities/collection.schema';
import { FlashcardEntity, FlashcardSchema } from './entities/flashcard.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectionEntity.name, schema: CollectionSchema },
      { name: FlashcardEntity.name, schema: FlashcardSchema },
    ]),
    UsersModule,
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService, MongooseModule],
})
export class CollectionsModule {}
