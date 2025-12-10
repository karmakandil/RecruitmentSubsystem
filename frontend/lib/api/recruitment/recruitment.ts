import api from "../client";
import {
  JobRequisition,
  Application,
  CreateApplicationDto,
  Interview,
  SubmitInterviewFeedbackDto,
  Offer,
  RespondToOfferDto,
  Onboarding,
  JobTemplate,
  SubmitResignationDto,
  TerminationRequest,
  UpdateClearanceItemStatusDto,
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
  // CLEARANCE (Department Head)
  // ============================================
  
  // ✅ Accessible: DEPARTMENT_HEAD (explicitly allowed)
  updateClearanceItemStatus: async (
    checklistId: string,
    data: UpdateClearanceItemStatusDto
  ): Promise<any> => {
    return await api.patch(`/recruitment/offboarding/clearance/${checklistId}/item`, data);
  },
};

