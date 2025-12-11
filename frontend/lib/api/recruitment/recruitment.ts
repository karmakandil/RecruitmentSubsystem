import api from "../client";
import {
  JobRequisition,
  Application,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
  Interview,
  ScheduleInterviewDto,
  UpdateInterviewStatusDto,
  SubmitInterviewFeedbackDto,
  Offer,
  CreateOfferDto,
  RespondToOfferDto,
  FinalizeOfferDto,
  Onboarding,
  CreateOnboardingDto,
  UpdateOnboardingDto,
  UpdateOnboardingTaskDto,
  JobTemplate,
  SubmitResignationDto,
  TerminationRequest,
  // CHANGED - Added termination types
  TerminateEmployeeDto,
  UpdateClearanceItemStatusDto,
  CreateEmployeeFromContractDto,
} from "../../../types/recruitment";

export const recruitmentApi = {
  // ============================================
  // JOB REQUISITIONS
  // ============================================
  
  // ✅ Accessible: No role restriction (all authenticated users)
  getJobRequisitions: async (): Promise<JobRequisition[]> => {
    return await api.get("/recruitment/job");
  },

  // ✅ Accessible: No role restriction
  getJobRequisitionById: async (id: string): Promise<JobRequisition> => {
    return await api.get(`/recruitment/job/${id}`);
  },

  // ✅ Accessible: No role restriction
  previewJobRequisition: async (id: string): Promise<JobRequisition> => {
    return await api.get(`/recruitment/job/${id}/preview`);
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  createJobRequisition: async (data: any): Promise<JobRequisition> => {
    return await api.post("/recruitment/job", data);
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  updateJobRequisitionStatus: async (id: string, status: string): Promise<JobRequisition> => {
    return await api.patch(`/recruitment/job/${id}/status`, { status });
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  publishJobRequisition: async (id: string): Promise<JobRequisition> => {
    return await api.post(`/recruitment/job/${id}/publish`);
  },

  // ============================================
  // JOB TEMPLATES
  // ============================================
  
  // ✅ Accessible: No role restriction
  getJobTemplates: async (): Promise<JobTemplate[]> => {
    return await api.get("/recruitment/job-template");
  },

  // ✅ Accessible: No role restriction
  getJobTemplateById: async (id: string): Promise<JobTemplate> => {
    return await api.get(`/recruitment/job-template/${id}`);
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  createJobTemplate: async (data: any): Promise<JobTemplate> => {
    return await api.post("/recruitment/job-template", data);
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  updateJobTemplate: async (id: string, data: any): Promise<JobTemplate> => {
    return await api.put(`/recruitment/job-template/${id}`, data);
  },

  // ============================================
  // APPLICATIONS
  // ============================================
  
  // ✅ Accessible: JOB_CANDIDATE (explicitly allowed)
  createApplication: async (
    data: CreateApplicationDto
  ): Promise<Application> => {
    return await api.post("/recruitment/application", data);
  },

  // ✅ Accessible: No role restriction
  getApplications: async (
    requisitionId?: string,
    prioritizeReferrals: boolean = true
  ): Promise<Application[]> => {
    const params = new URLSearchParams();
    if (requisitionId) params.append("requisitionId", requisitionId);
    params.append("prioritizeReferrals", prioritizeReferrals.toString());
    return await api.get(`/recruitment/application?${params.toString()}`);
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  getRankedApplications: async (requisitionId: string): Promise<Application[]> => {
    return await api.get(`/recruitment/application/ranked/${requisitionId}`);
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  updateApplicationStatus: async (
    id: string,
    data: UpdateApplicationStatusDto
  ): Promise<Application> => {
    return await api.patch(`/recruitment/application/${id}/status`, data);
  },

  // ============================================
  // INTERVIEWS
  // ============================================
  
  // ✅ Accessible: No role restriction
  getInterviewFeedback: async (interviewId: string): Promise<any> => {
    return await api.get(`/recruitment/interview/${interviewId}/feedback`);
  },

  // ✅ Accessible: No role restriction
  getInterviewAverageScore: async (interviewId: string): Promise<number> => {
    return await api.get(`/recruitment/interview/${interviewId}/score`);
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, RECRUITER, SYSTEM_ADMIN
  scheduleInterview: async (data: ScheduleInterviewDto): Promise<Interview> => {
    return await api.post("/recruitment/interview", data);
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, RECRUITER, SYSTEM_ADMIN
  updateInterviewStatus: async (
    id: string,
    data: UpdateInterviewStatusDto
  ): Promise<Interview> => {
    return await api.patch(`/recruitment/interview/${id}/status`, data);
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, RECRUITER, SYSTEM_ADMIN
  submitInterviewFeedback: async (
    interviewId: string,
    data: SubmitInterviewFeedbackDto
  ): Promise<any> => {
    return await api.post(`/recruitment/interview/${interviewId}/feedback`, data);
  },

  // ✅ Accessible: No role restriction (to get interview by ID)
  getInterviewById: async (id: string): Promise<Interview> => {
    // Note: Backend doesn't have direct endpoint, but we can get feedback which includes interview data
    // For now, we'll need to get interviews through applications
    // This is a placeholder - actual implementation depends on backend
    return await api.get(`/recruitment/interview/${id}/feedback`).then((feedback) => {
      // Return interview structure from feedback
      return feedback as any;
    });
  },

  // ============================================
  // OFFERS
  // ============================================
  
  // ✅ Accessible: JOB_CANDIDATE (explicitly allowed)
  respondToOffer: async (
    id: string,
    data: RespondToOfferDto
  ): Promise<Offer> => {
    return await api.patch(`/recruitment/offer/${id}/respond`, data);
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  createOffer: async (data: CreateOfferDto): Promise<Offer> => {
    return await api.post("/recruitment/offer", data);
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  finalizeOffer: async (id: string, data: FinalizeOfferDto): Promise<Offer> => {
    return await api.patch(`/recruitment/offer/${id}/finalize`, data);
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  createEmployeeFromContract: async (
    offerId: string,
    data: CreateEmployeeFromContractDto
  ): Promise<any> => {
    return await api.post(`/recruitment/offer/${offerId}/create-employee`, data);
  },

  // ✅ Accessible: JOB_CANDIDATE (included in allowed roles)
  uploadContractDocument: async (
    offerId: string,
    file: File,
    documentType: string,
    nationalId?: string,
    documentDescription?: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    if (nationalId) formData.append("nationalId", nationalId);
    if (documentDescription)
      formData.append("documentDescription", documentDescription);
    return await api.post(`/recruitment/offer/${offerId}/upload-contract`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ✅ Accessible: JOB_CANDIDATE (included in allowed roles)
  uploadCandidateForm: async (
    offerId: string,
    file: File,
    documentType: string,
    nationalId?: string,
    documentDescription?: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    if (nationalId) formData.append("nationalId", nationalId);
    if (documentDescription)
      formData.append("documentDescription", documentDescription);
    return await api.post(`/recruitment/offer/${offerId}/upload-form`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ============================================
  // ONBOARDING
  // ============================================
  
  // ✅ Accessible: No role restriction (for new hires to view their own onboarding)
  getOnboardingById: async (id: string): Promise<Onboarding> => {
    return await api.get(`/recruitment/onboarding/${id}`);
  },

  // ✅ Accessible: No role restriction (for new hires to view their own onboarding)
  getOnboardingByEmployeeId: async (
    employeeId: string
  ): Promise<Onboarding> => {
    return await api.get(`/recruitment/onboarding/employee/${employeeId}`);
  },

  // ✅ Accessible: No role restriction (for new hires to upload documents)
  uploadTaskDocument: async (
    onboardingId: string,
    taskIndex: number,
    file: File,
    documentType: string,
    nationalId?: string,
    documentDescription?: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    if (nationalId) formData.append("nationalId", nationalId);
    if (documentDescription)
      formData.append("documentDescription", documentDescription);
    return await api.post(
      `/recruitment/onboarding/${onboardingId}/task/${taskIndex}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  // ✅ Accessible: No role restriction
  downloadDocument: async (documentId: string): Promise<Blob> => {
    return await api.get(`/recruitment/document/${documentId}/download`, {
      responseType: "blob",
    });
  },

  // ✅ Accessible: No role restriction
  getTaskDocument: async (
    onboardingId: string,
    taskIndex: number
  ): Promise<any> => {
    return await api.get(
      `/recruitment/onboarding/${onboardingId}/task/${taskIndex}/document`
    );
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  getAllOnboardings: async (): Promise<Onboarding[]> => {
    return await api.get("/recruitment/onboarding");
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  getOnboardingStats: async (): Promise<any> => {
    return await api.get("/recruitment/onboarding/stats");
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  createOnboarding: async (data: CreateOnboardingDto): Promise<Onboarding> => {
    return await api.post("/recruitment/onboarding", data);
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  updateOnboarding: async (
    id: string,
    data: UpdateOnboardingDto
  ): Promise<Onboarding> => {
    return await api.put(`/recruitment/onboarding/${id}`, data);
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  updateOnboardingTask: async (
    id: string,
    taskIndex: number,
    data: UpdateOnboardingTaskDto
  ): Promise<Onboarding> => {
    return await api.patch(`/recruitment/onboarding/${id}/task/${taskIndex}`, data);
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  addTaskToOnboarding: async (id: string, taskDto: any): Promise<Onboarding> => {
    return await api.post(`/recruitment/onboarding/${id}/task`, taskDto);
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  removeTaskFromOnboarding: async (id: string, taskIndex: number): Promise<void> => {
    return await api.delete(`/recruitment/onboarding/${id}/task/${taskIndex}`);
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  deleteOnboarding: async (id: string): Promise<void> => {
    return await api.delete(`/recruitment/onboarding/${id}`);
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  sendOnboardingReminders: async (): Promise<any> => {
    return await api.post("/recruitment/onboarding/send-reminders");
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  provisionSystemAccess: async (
    employeeId: string,
    taskIndex: number
  ): Promise<any> => {
    return await api.post(
      `/recruitment/onboarding/${employeeId}/provision-access/${taskIndex}`
    );
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  reserveEquipment: async (
    employeeId: string,
    equipmentType: string,
    equipmentDetails: any
  ): Promise<any> => {
    return await api.post(`/recruitment/onboarding/${employeeId}/reserve-equipment`, {
      equipmentType,
      equipmentDetails,
    });
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  scheduleAccessProvisioning: async (
    employeeId: string,
    startDate: string,
    endDate?: string
  ): Promise<any> => {
    return await api.post(`/recruitment/onboarding/${employeeId}/schedule-access`, {
      startDate,
      endDate,
    });
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  triggerPayrollInitiation: async (
    employeeId: string,
    contractSigningDate: string,
    grossSalary: number
  ): Promise<any> => {
    return await api.post(`/recruitment/onboarding/${employeeId}/trigger-payroll`, {
      contractSigningDate,
      grossSalary,
    });
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  processSigningBonus: async (
    employeeId: string,
    signingBonus: number,
    contractSigningDate: string
  ): Promise<any> => {
    return await api.post(`/recruitment/onboarding/${employeeId}/process-bonus`, {
      signingBonus,
      contractSigningDate,
    });
  },

  // ✅ Accessible: HR_MANAGER, SYSTEM_ADMIN
  cancelOnboarding: async (employeeId: string, reason: string): Promise<any> => {
    return await api.post(`/recruitment/onboarding/${employeeId}/cancel`, { reason });
  },

  // ============================================
  // CANDIDATE REFERRALS
  // ============================================
  
  // ✅ Accessible: No role restriction
  getCandidateReferrals: async (candidateId: string): Promise<any> => {
    return await api.get(`/recruitment/candidate/${candidateId}/referrals`);
  },

  // ✅ Accessible: No role restriction
  recordCandidateConsent: async (
    candidateId: string,
    consentGiven: boolean,
    consentType?: string,
    notes?: string
  ): Promise<any> => {
    return await api.post(`/recruitment/candidate/${candidateId}/consent`, {
      consentGiven,
      consentType,
      notes,
    });
  },

  // CHANGED - Added CV upload method for candidates (REC-003)
  // ✅ Accessible: JOB_CANDIDATE
  uploadCandidateCV: async (
    candidateId: string,
    file?: File,
    resumeUrl?: string
  ): Promise<any> => {
    if (file) {
      // File upload
      const formData = new FormData();
      formData.append("file", file);
      return await api.post(
        `/recruitment/candidate/${candidateId}/upload-cv`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else if (resumeUrl) {
      // Manual URL entry
      return await api.post(`/recruitment/candidate/${candidateId}/upload-cv`, {
        manualEntry: true,
        resumeUrl,
      });
    } else {
      throw new Error("Either file or resume URL is required");
    }
  },

  // ✅ Accessible: HR_EMPLOYEE, HR_MANAGER, SYSTEM_ADMIN
  tagCandidateAsReferral: async (
    candidateId: string,
    referringEmployeeId?: string,
    role?: string,
    level?: string
  ): Promise<any> => {
    return await api.post(`/recruitment/candidate/${candidateId}/referral`, {
      referringEmployeeId,
      role,
      level,
    });
  },

  // ============================================
  // OFFBOARDING (Resignation - Accessible to All Employees)
  // ============================================
  
  // ✅ Accessible: No role restriction (any authenticated employee)
  submitResignation: async (data: SubmitResignationDto): Promise<TerminationRequest> => {
    return await api.post("/recruitment/offboarding/resign", data);
  },

  // ✅ Accessible: No role restriction (any authenticated employee)
  getMyResignationRequests: async (): Promise<TerminationRequest[]> => {
    return await api.get("/recruitment/offboarding/my-resignation");
  },

  // ============================================
  // CLEARANCE (Department Head & HR Manager)
  // ============================================
  
  // ✅ Accessible: Multiple roles (Department Head, HR Manager, etc.)
  updateClearanceItemStatus: async (
    checklistId: string,
    data: UpdateClearanceItemStatusDto
  ): Promise<any> => {
    return await api.patch(`/recruitment/offboarding/clearance/${checklistId}/item`, data);
  },

  // CHANGED - Added: ✅ Accessible: HR_MANAGER (Create clearance checklist)
  createClearanceChecklist: async (terminationId: string): Promise<any> => {
    return await api.post("/recruitment/offboarding/clearance", { terminationId });
  },

  // CHANGED - Added: ✅ Accessible: HR_MANAGER (Get checklist by employee)
  getClearanceChecklistByEmployee: async (employeeId: string): Promise<any> => {
    return await api.get(`/recruitment/offboarding/clearance/employee/${employeeId}`);
  },

  // CHANGED - Added: ✅ Accessible: HR_MANAGER (Mark checklist complete)
  markClearanceChecklistComplete: async (checklistId: string): Promise<any> => {
    return await api.patch(`/recruitment/offboarding/clearance/${checklistId}/complete`);
  },

  // CHANGED - Added: ✅ Accessible: HR_MANAGER (Send clearance reminders)
  sendClearanceReminders: async (force?: boolean): Promise<any> => {
    return await api.post("/recruitment/offboarding/clearance/send-reminders", { force });
  },

  // ============================================
  // CHANGED - SYSTEM ACCESS MANAGEMENT (System Admin)
  // ============================================

  // CHANGED - Added: ✅ Accessible: SYSTEM_ADMIN (OFF-007: Revoke system access)
  revokeSystemAccess: async (
    employeeId: string,
    reason: string
  ): Promise<any> => {
    return await api.patch("/recruitment/offboarding/system-revoke", {
      employeeId,
      reason,
    });
  },

  // CHANGED - Added: Get all employees for access management
  getAllEmployees: async (): Promise<any[]> => {
    return await api.get("/employee-profile");
  },

  // CHANGED - Added: Get employee by ID for access management
  getEmployeeById: async (employeeId: string): Promise<any> => {
    return await api.get(`/employee-profile/${employeeId}`);
  },

  // ============================================
  // CHANGED - TERMINATION MANAGEMENT (HR Manager)
  // Implements OFF-001: HR Manager initiates termination based on performance
  // ============================================

  // CHANGED - Added: ✅ Accessible: HR_MANAGER (OFF-001: Terminate employee based on performance)
  terminateEmployee: async (data: TerminateEmployeeDto): Promise<any> => {
    return await api.post("/recruitment/offboarding/terminate", data);
  },

  // CHANGED - Added: ✅ Accessible: HR_MANAGER (Get termination request by ID)
  getTerminationRequest: async (id: string): Promise<TerminationRequest> => {
    return await api.get(`/recruitment/offboarding/termination/${id}`);
  },

  // CHANGED - Added: ✅ Accessible: HR_MANAGER (Update termination status)
  updateTerminationStatus: async (
    id: string,
    status: string,
    hrComments?: string
  ): Promise<TerminationRequest> => {
    return await api.patch(`/recruitment/offboarding/termination/${id}/status`, {
      status,
      hrComments,
    });
  },

  // CHANGED - Added: ✅ Accessible: HR_MANAGER (Get employee performance for termination review)
  getEmployeePerformance: async (employeeId: string): Promise<any> => {
    return await api.get(`/recruitment/offboarding/appraisal/${employeeId}`);
  },

  // CHANGED - Added: ✅ Accessible: HR_MANAGER (Trigger final settlement)
  triggerFinalSettlement: async (
    employeeId: string,
    terminationId: string
  ): Promise<any> => {
    return await api.post("/recruitment/offboarding/final-settlement", {
      employeeId,
      terminationId,
    });
  },
};

