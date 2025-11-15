import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InterviewDocument = Interview & Document;

@Schema({ timestamps: true })
export class Interview {
  @Prop({ type: Types.ObjectId, ref: 'Application', required: true })
  applicationId: Types.ObjectId;

  @Prop()
  stageName: string; // e.g. Technical Interview, HR Interview

  @Prop({ type: [String], default: [] })
  panelMemberIds: string[]; // employee IDs

  @Prop()
  scheduledStart: Date;

  @Prop()
  scheduledEnd: Date;

  @Prop({ default: 'Online' })
  mode: string; // Online, Onsite, Phone

  @Prop()
  location?: string;

  @Prop()
  meetingLink?: string;

  @Prop({ default: 'Scheduled' })
  status: string; // Scheduled, Completed, Cancelled, NoShow

  @Prop()
  calendarEventId?: string; // external calendar event id
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
