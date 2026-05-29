import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { TargetType } from '@shared/types';

export type TargetDocument = HydratedDocument<TargetEntity>;

@Schema({ collection: 'targets', timestamps: false })
export class TargetEntity {
  @Prop({ required: true, type: String, unique: true, enum: ['toeic', 'ielts'] })
  type!: TargetType;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  badge!: string;

  @Prop({ required: true })
  modules!: string;

  @Prop({ required: true })
  hours!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, type: [String], default: [] })
  courseIds!: string[];
}

export const TargetSchema = SchemaFactory.createForClass(TargetEntity);
