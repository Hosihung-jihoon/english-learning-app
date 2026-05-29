import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { CollectionFilter } from '@shared/types';

export type CollectionDocument = HydratedDocument<CollectionEntity>;

@Schema({ collection: 'collections', timestamps: false })
export class CollectionEntity {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  subtitle!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, type: String, enum: ['vocabulary', 'sentence-pattern', 'grammar', 'listening-speaking'] })
  filter!: CollectionFilter;

  @Prop({ required: true })
  flashcardCount!: number;

  @Prop({ required: true })
  accentColor!: string;

  @Prop({ required: true })
  softColor!: string;

  @Prop({ required: true, type: [String], default: [] })
  colors!: [string, string];

  @Prop({ required: true })
  icon!: string;

  @Prop({ required: true })
  previewWord!: string;

  @Prop({ required: true })
  previewMeaning!: string;

  @Prop()
  relatedLessonId?: string;
}

export const CollectionSchema = SchemaFactory.createForClass(CollectionEntity);
