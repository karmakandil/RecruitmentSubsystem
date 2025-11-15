import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Job, JobSchema } from './schemas/job.schema';
import { Candidate, CandidateSchema } from './schemas/candidate.schema';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { Interview, InterviewSchema } from './schemas/interview.schema';
import {
  InterviewFeedback,
  InterviewFeedbackSchema,
} from './schemas/interview-feedback.schema';
import { Offer, OfferSchema } from './schemas/offer.schema';
import {
  CommunicationLog,
  CommunicationLogSchema,
} from './schemas/communication-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: Candidate.name, schema: CandidateSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: Interview.name, schema: InterviewSchema },
      { name: InterviewFeedback.name, schema: InterviewFeedbackSchema },
      { name: Offer.name, schema: OfferSchema },
      { name: CommunicationLog.name, schema: CommunicationLogSchema },
    ]),
  ],
  // you can add controllers/providers later if needed
})
export class RecruitmentModule {}
