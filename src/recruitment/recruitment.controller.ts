import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
} from '@nestjs/common';

import { RecruitmentService } from './recruitment.service';

import {
  CreateJobRequisitionDto,
} from './dto/job-requisition.dto';

import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

import {
  ScheduleInterviewDto,
  UpdateInterviewStatusDto,
} from './dto/interview.dto';

import {
  CreateOfferDto,
  RespondToOfferDto,
  FinalizeOfferDto,
} from './dto/offer.dto';

@Controller('recruitment')
export class RecruitmentController {
  constructor(private readonly service: RecruitmentService) {}

  // ------------------------------------------
  // JOB REQUISITION
  // ------------------------------------------

  @Post('job')
  createJob(@Body() dto: CreateJobRequisitionDto) {
    return this.service.createJobRequisition(dto);
  }

  @Get('job')
  getJobs() {
    return this.service.getAllJobRequisitions();
  }

  // ------------------------------------------
  // APPLICATIONS
  // ------------------------------------------
  @Post('application')
  apply(@Body() dto: CreateApplicationDto) {
    return this.service.apply(dto);
  }

  @Patch('application/:id/status')
  updateAppStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.service.updateApplicationStatus(id, dto);
  }

  // ------------------------------------------
  // INTERVIEWS
  // ------------------------------------------
  @Post('interview')
  scheduleInterview(@Body() dto: ScheduleInterviewDto) {
    return this.service.scheduleInterview(dto);
  }

  @Patch('interview/:id/status')
  updateInterviewStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInterviewStatusDto,
  ) {
    return this.service.updateInterviewStatus(id, dto);
  }

  // ------------------------------------------
  // OFFERS
  // ------------------------------------------
  @Post('offer')
  createOffer(@Body() dto: CreateOfferDto) {
    return this.service.createOffer(dto);
  }

  @Patch('offer/:id/respond')
  respond(
    @Param('id') id: string,
    @Body() dto: RespondToOfferDto,
  ) {
    return this.service.respondToOffer(id, dto);
  }

  @Patch('offer/:id/finalize')
  finalize(
    @Param('id') id: string,
    @Body() dto: FinalizeOfferDto,
  ) {
    return this.service.finalizeOffer(id, dto);
  }
}
