import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApplicationStage } from '../enums/application-stage.enum';

@Schema({ timestamps: true })
export class HiringProcessTemplate {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    type: [
      {
        stage: { type: String, enum: ApplicationStage, required: true },
        name: { type: String, required: true },
        order: { type: Number, required: true },
        progressPercentage: { type: Number, required: true, min: 0, max: 100 },
      },
    ],
    required: true,
  })
  stages: Array<{
    stage: ApplicationStage;
    name: string;
    order: number;
    progressPercentage: number;
  }>;

  @Prop({ default: true })
  isActive: boolean;
}

export type HiringProcessTemplateDocument =
  HydratedDocument<HiringProcessTemplate>;
export const HiringProcessTemplateSchema =
  SchemaFactory.createForClass(HiringProcessTemplate);

