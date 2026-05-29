import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type FlashcardDocument = HydratedDocument<FlashcardEntity>;

@Schema({ collection: 'flashcards', timestamps: false })
export class FlashcardEntity {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  collectionId!: string;

  @Prop({ required: true })
  word!: string;

  @Prop({ required: true })
  meaning!: string;

  @Prop(
    raw({
      english: { type: String, required: false },
      vietnamese: { type: String, required: false },
    }),
  )
  example?: { english?: string; vietnamese?: string };

  @Prop()
  note?: string;

  @Prop()
  lessonId?: string;
}

export const FlashcardSchema = SchemaFactory.createForClass(FlashcardEntity);
