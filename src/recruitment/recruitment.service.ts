import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JobRequisition } from './models/job-requisition.schema';
import { Application } from './models/application.schema';
import { Interview } from './models/interview.schema';
import { Offer } from './models/offer.schema';

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

// Nodemailer import for compatibility with TypeScript
import * as nodemailer from 'nodemailer';

@Injectable()
export class RecruitmentService {
  constructor(
    @InjectModel(JobRequisition.name)
    private jobModel: Model<JobRequisition>,
    
    @InjectModel(Application.name)
    private applicationModel: Model<Application>,

    @InjectModel(Interview.name)
    private interviewModel: Model<Interview>,

    @InjectModel(Offer.name)
    private offerModel: Model<Offer>,

    // Inject the JobTemplate model
    @InjectModel('JobTemplate') private jobTemplateModel: Model<any>, 
  ) {}

  // -----------------------------------------------
  // Utility function to calculate job requisition progress
  // ------------------------------------------------
  calculateProgress(status: string): number {
    // Accept both human-friendly and enum-style values (case-insensitive)
    const s = (status || '').toString().toLowerCase();
    const mapping: Record<string, number> = {
      'screening': 20,
      'shortlisting': 40,
      'department_interview': 50,
      'hr_interview': 60,
      'interview': 60,
      'offer': 80,
      'hired': 100,
      'submitted': 10,
      'in_process': 40,
    };

    return mapping[s] ?? 0;
  }

  // ---------------------------------------------------
  // JOB REQUISITIONS
  // ---------------------------------------------------
  async createJobRequisition(dto: CreateJobRequisitionDto) {
    // Generate a unique requisition ID
    const requisitionId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create job requisition with all DTO fields and required fields
    const jobRequisition = new this.jobModel({
      requisitionId,
      templateId: dto.templateId,
      openings: dto.openings,
      location: dto.location,
      hiringManagerId: dto.hiringManagerId || null,
      publishStatus: 'draft', // Default to draft status
    });

    return jobRequisition.save();
  }

  // JobTemplate CRUD -------------------------------------------------
  async createJobTemplate(dto: any) {
    const tpl = new this.jobTemplateModel({
      title: dto.title,
      department: dto.department,
      qualifications: dto.qualifications || [],
      skills: dto.skills || [],
      description: dto.description || '',
    });
    return tpl.save();
  }

  async getAllJobTemplates() {
    return this.jobTemplateModel.find();
  }

  async getJobTemplateById(id: string) {
    return this.jobTemplateModel.findById(id);
  }

  async updateJobTemplate(id: string, dto: any) {
    return this.jobTemplateModel.findByIdAndUpdate(id, dto, { new: true });
  }

  // Publish/Preview --------------------------------------------------
  async publishJobRequisition(id: string) {
    const update = { publishStatus: 'published', postingDate: new Date() } as any;
    const updated = await this.jobModel.findByIdAndUpdate(id, update, { new: true });
    if (!updated) throw new Error('Job Requisition not found');
    return updated;
  }

  async previewJobRequisition(id: string) {
    return this.jobModel.findById(id).populate('templateId');
  }

  async getAllJobRequisitions() {
    return this.jobModel.find();
  }

  async getJobRequisitionById(id: string) {
    return this.jobModel.findById(id);
  }

  async updateJobRequisitionStatus(id: string, newStatus: string) {
    // Use a single atomic update to avoid accessing document properties
    const update: any = { status: newStatus, progress: this.calculateProgress(newStatus) };
    const updated = await this.jobModel.findByIdAndUpdate(id, update, { new: true });

    if (!updated) {
      throw new Error('Job Requisition not found');
    }

    return updated;
  }

  // ---------------------------------------------------
  // APPLICATIONS
  // ---------------------------------------------------
  async apply(dto: CreateApplicationDto) {
    const application = new this.applicationModel({
      candidateId: dto.candidateId,
      requisitionId: dto.requisitionId,
      assignedHr: dto.assignedHr || undefined,
      currentStage: 'screening', // Default to screening
      status: 'submitted', // Default to submitted
    });
    return application.save();
  }

  async getAllApplications() {
    return this.applicationModel.find();
  }

  async updateApplicationStatus(id: string, dto: UpdateApplicationStatusDto) {
    const application = await this.applicationModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true }
    );

    if (!application) {
      throw new Error('Application not found');
    }

    // Update related job requisition progress if possible
    try {
      const reqId = (application as any).requisitionId;
      if (reqId) {
        const progress = this.calculateProgress((application as any).currentStage || dto.status as any);
        await this.jobModel.findByIdAndUpdate(reqId, { progress });
      }
    } catch (e) {
      // swallow – non-critical
    }

    return application;
  }

  // ---------------------------------------------------
  // INTERVIEWS
  // ---------------------------------------------------
  async scheduleInterview(dto: ScheduleInterviewDto) {
    const interview = new this.interviewModel({
      applicationId: dto.applicationId,
      stage: dto.stage,
      scheduledDate: dto.scheduledDate,
      method: dto.method,
      panel: dto.panel || [],
      videoLink: dto.videoLink,
      status: 'scheduled', // Default to scheduled
    });
    const saved = await interview.save();

    // Update application currentStage and job progress
    try {
      await this.applicationModel.findByIdAndUpdate(dto.applicationId, { currentStage: dto.stage });
      const app = await this.applicationModel.findById(dto.applicationId);
      if (app?.requisitionId) {
        const progress = this.calculateProgress((app as any).currentStage || 'screening');
        await this.jobModel.findByIdAndUpdate((app as any).requisitionId, { progress });
      }
    } catch (e) {
      // non-critical
    }

    return saved;
  }

  async updateInterviewStatus(id: string, dto: UpdateInterviewStatusDto) {
    return this.interviewModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true }
    );
  }

  // ---------------------------------------------------
  // OFFERS
  // ---------------------------------------------------
  async createOffer(dto: CreateOfferDto) {
    const offer = new this.offerModel({
      applicationId: dto.applicationId,
      candidateId: dto.candidateId,
      grossSalary: dto.grossSalary,
      signingBonus: dto.signingBonus,
      benefits: dto.benefits,
      conditions: dto.conditions,
      insurances: dto.insurances,
      content: dto.content,
      role: dto.role,
      deadline: dto.deadline,
      applicantResponse: 'pending', // Default to pending
      finalStatus: 'pending', // Default to pending
    });
    return offer.save();
  }

  async respondToOffer(id: string, dto: RespondToOfferDto) {
    return this.offerModel.findByIdAndUpdate(
      id,
      { applicantResponse: dto.applicantResponse },
      { new: true }
    );
  }

  async finalizeOffer(id: string, dto: FinalizeOfferDto) {
    return this.offerModel.findByIdAndUpdate(
      id,
      { finalStatus: dto.finalStatus },
      { new: true }
    );
  }

  // ---------------------------------------------------
  // Email function to notify candidates
  // ---------------------------------------------------
  async sendEmail(recipient: string, subject: string, text: string) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',  // Your email credentials
        pass: 'your-email-password',   // Your email password
      },
    });

    await transporter.sendMail({
      from: '"HR System" <your-email@gmail.com>',
      to: recipient,
      subject: subject,
      text: text,
    });
  }
}
