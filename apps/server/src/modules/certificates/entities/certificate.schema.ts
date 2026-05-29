import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { TargetType } from '@shared/types';

export type CertificateDocument = HydratedDocument<CertificateEntity>;

@Schema({ collection: 'certificates', timestamps: false })
export class CertificateEntity {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  subtitle!: string;

  @Prop({ required: true, type: String, enum: ['toeic', 'ielts'] })
  targetType!: TargetType;
}

export const CertificateSchema = SchemaFactory.createForClass(CertificateEntity);
