# Recruitment Frontend Implementation Guide

## Overview
This guide provides step-by-step instructions to implement the recruitment subsystem frontend, following the pattern established by the leaves subsystem and aligned with the Business Requirements Specification (BRS).

## ⚠️ IMPORTANT: Role Implementation Status

### ✅ Roles Implemented in BOTH Backend AND Frontend
- **Candidate** (JOB_CANDIDATE) ✅ Backend ✅ Frontend
- **Employee** (DEPARTMENT_EMPLOYEE) ✅ Backend ✅ Frontend
- **Department Head** (DEPARTMENT_HEAD) ✅ Backend ✅ Frontend

### ❌ Roles NOT Implemented in Frontend (Skip All Features Requiring These)
- **HR_MANAGER** ❌ (Backend has it, Frontend doesn't - SKIP all HR_MANAGER endpoints)
- **HR_EMPLOYEE** ❌ (Backend has it, Frontend doesn't - SKIP all HR_EMPLOYEE endpoints)
- **HR_ADMIN** ❌ (Frontend has it, but Backend recruitment doesn't use it - SKIP)
- **RECRUITER** ❌ (Backend has it, Frontend doesn't - SKIP all RECRUITER endpoints)
- **SYSTEM_ADMIN** ❌ (Backend has it, Frontend doesn't - SKIP all SYSTEM_ADMIN endpoints)

### ⚠️ Implementation Rule
**ONLY implement features for roles that exist in BOTH backend AND frontend.**
- If a role exists in backend but NOT in frontend → **SKIP** all endpoints requiring that role
- If a role exists in frontend but NOT in backend → **SKIP** all endpoints (backend won't accept it)
- Only implement endpoints that:
  1. Have no role restrictions (accessible to all authenticated users)
  2. Explicitly allow JOB_CANDIDATE, DEPARTMENT_EMPLOYEE, or DEPARTMENT_HEAD

---

## Step 1: Create TypeScript Types/Interfaces

### File: `sw-project/frontend/types/recruitment.ts`

Create comprehensive types matching the backend DTOs and schemas:

```typescript
// Enums
export enum ApplicationStatus {
  SUBMITTED = 'submitted',
  IN_PROCESS = 'in_process',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected',
}

export enum ApplicationStage {
  SCREENING = 'screening',
  DEPARTMENT_INTERVIEW = 'department_interview',
  HR_INTERVIEW = 'hr_interview',
  OFFER = 'offer',
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum InterviewMethod {
  ONSITE = 'onsite',
  VIDEO = 'video',
  PHONE = 'phone',
}

export enum OfferResponseStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export enum OfferFinalStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export enum OnboardingTaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum DocumentType {
  CONTRACT = 'contract',
  ID = 'id',
  RESUME = 'resume',
  CERTIFICATE = 'certificate',
  OTHER = 'other',
}

// Main Types
export interface JobTemplate {
  _id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  qualifications: string[];
  experienceLevel: string;
  employmentType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobRequisition {
  _id: string;
  templateId: string;
  template?: JobTemplate;
  openings: number;
  location?: string;
  hiringManagerId?: string;
  status: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  _id: string;
  candidateId: string;
  candidate?: any; // Candidate profile
  requisitionId: string;
  requisition?: JobRequisition;
  assignedHr?: string;
  status: ApplicationStatus;
  stage?: ApplicationStage;
  createdAt?: string;
  updatedAt?: string;
}

export interface Interview {
  _id: string;
  applicationId: string;
  application?: Application;
  stage: ApplicationStage;
  scheduledDate: string;
  method?: InterviewMethod;
  panel?: string[];
  videoLink?: string;
  status: InterviewStatus;
  feedback?: InterviewFeedback[];
  averageScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface InterviewFeedback {
  interviewerId: string;
  interviewer?: any;
  score: number;
  comments?: string;
  submittedAt: string;
}

export interface Offer {
  _id: string;
  applicationId: string;
  application?: Application;
  candidateId: string;
  candidate?: any;
  grossSalary: number;
  signingBonus?: number;
  benefits?: string[];
  conditions?: string;
  insurances?: string;
  content?: string;
  role?: string;
  deadline: string;
  applicantResponse?: OfferResponseStatus;
  finalStatus?: OfferFinalStatus;
  contractDocumentId?: string;
  candidateFormDocumentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OnboardingTask {
  name: string;
  department: string;
  status: OnboardingTaskStatus;
  deadline?: string;
  documentId?: string;
  notes?: string;
}

export interface Onboarding {
  _id: string;
  employeeId: string;
  employee?: any;
  contractId?: string;
  tasks: OnboardingTask[];
  startDate?: string;
  completionDate?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  _id: string;
  documentType: DocumentType;
  fileName: string;
  filePath: string;
  uploadedBy: string;
  uploadedAt: string;
  nationalId?: string;
  documentDescription?: string;
}

// DTOs
export interface CreateJobRequisitionDto {
  templateId: string;
  openings: number;
  location?: string;
  hiringManagerId?: string;
}

export interface CreateApplicationDto {
  candidateId: string;
  requisitionId: string;
  assignedHr?: string;
  consentGiven: boolean;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
}

export interface ScheduleInterviewDto {
  applicationId: string;
  stage: ApplicationStage;
  scheduledDate: string;
  method?: InterviewMethod;
  panel?: string[];
  videoLink?: string;
}

export interface UpdateInterviewStatusDto {
  status: InterviewStatus;
}

export interface SubmitInterviewFeedbackDto {
  score: number;
  comments?: string;
}

export interface CreateOfferDto {
  applicationId: string;
  candidateId: string;
  grossSalary: number;
  signingBonus?: number;
  benefits?: string[];
  conditions?: string;
  insurances?: string;
  content?: string;
  role?: string;
  deadline: string;
}

export interface RespondToOfferDto {
  applicantResponse: OfferResponseStatus;
}

export interface FinalizeOfferDto {
  finalStatus: OfferFinalStatus;
}

export interface CreateOnboardingDto {
  employeeId: string;
  contractId?: string;
  tasks: OnboardingTask[];
}

export interface UpdateOnboardingDto {
  tasks?: OnboardingTask[];
  startDate?: string;
  completionDate?: string;
}

export interface UpdateOnboardingTaskDto {
  status?: OnboardingTaskStatus;
  notes?: string;
}
```

---

## Step 2: Create API Client Functions

### File: `sw-project/frontend/lib/api/recruitment/recruitment.ts`

**⚠️ IMPORTANT:** Only include API functions for endpoints accessible to implemented roles. Endpoints requiring HR_MANAGER/HR_EMPLOYEE/SYSTEM_ADMIN are marked with ⚠️ and should be skipped or noted for backend updates.

```typescript
import api from "../client";
import {
  JobRequisition,
  CreateJobRequisitionDto,
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

  // ⚠️ SKIP: Requires HR_MANAGER or SYSTEM_ADMIN
  // createJobRequisition: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_MANAGER or SYSTEM_ADMIN
  // updateJobRequisitionStatus: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // publishJobRequisition: async (...) => { ... }

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

  // ⚠️ SKIP: Requires HR_MANAGER or SYSTEM_ADMIN
  // createJobTemplate: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_MANAGER or SYSTEM_ADMIN
  // updateJobTemplate: async (...) => { ... }

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

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // getRankedApplications: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // updateApplicationStatus: async (...) => { ... }

  // ============================================
  // INTERVIEWS
  // ============================================
  
  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, RECRUITER, or SYSTEM_ADMIN
  // scheduleInterview: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, RECRUITER, or SYSTEM_ADMIN
  // updateInterviewStatus: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, RECRUITER, or SYSTEM_ADMIN
  // Note: Department Head should be able to submit feedback per BRS, but backend doesn't allow it yet
  // submitInterviewFeedback: async (...) => { ... }

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
  
  // ⚠️ SKIP: Requires HR_MANAGER or SYSTEM_ADMIN
  // createOffer: async (...) => { ... }

  // ✅ Accessible: JOB_CANDIDATE (explicitly allowed)
  respondToOffer: async (
    id: string,
    data: RespondToOfferDto
  ): Promise<Offer> => {
    return await api.patch(`/recruitment/offer/${id}/respond`, data);
  },

  // ⚠️ SKIP: Requires HR_MANAGER or SYSTEM_ADMIN
  // finalizeOffer: async (...) => { ... }

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

  // ⚠️ SKIP: Requires HR_MANAGER or SYSTEM_ADMIN
  // createEmployeeFromContract: async (...) => { ... }

  // ============================================
  // ONBOARDING
  // ============================================
  
  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // createOnboarding: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // getAllOnboardings: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // getOnboardingStats: async (...) => { ... }

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

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // updateOnboarding: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // updateOnboardingTask: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // addTaskToOnboarding: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // removeTaskFromOnboarding: async (...) => { ... }

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

  // ⚠️ SKIP: Requires HR_MANAGER or SYSTEM_ADMIN
  // deleteDocument: async (...) => { ... }

  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // sendOnboardingReminders: async (...) => { ... }

  // ⚠️ SKIP: All onboarding automation endpoints require HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // provisionSystemAccess, reserveEquipment, scheduleAccessProvisioning,
  // triggerPayrollInitiation, processSigningBonus, cancelOnboarding

  // ============================================
  // CANDIDATE REFERRALS
  // ============================================
  
  // ⚠️ SKIP: Requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
  // Note: BRS says employees can tag referrals, but backend requires HR_EMPLOYEE/HR_MANAGER
  // tagCandidateAsReferral: async (...) => { ... }

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
  submitResignation: async (data: {
    effectiveDate: string;
    reason: string;
  }): Promise<any> => {
    return await api.post("/recruitment/offboarding/resign", data);
  },

  // ✅ Accessible: No role restriction (any authenticated employee)
  getMyResignationRequests: async (): Promise<any[]> => {
    return await api.get("/recruitment/offboarding/my-resignation");
  },

  // ⚠️ SKIP: All other offboarding endpoints require HR_MANAGER or SYSTEM_ADMIN
  // terminateEmployee, createTerminationRequest, updateTerminationStatus,
  // createClearanceChecklist, updateClearanceItemStatus (except DEPARTMENT_HEAD),
  // markChecklistCompleted, getLatestAppraisal, revokeSystemAccess, triggerFinalSettlement

  // ============================================
  // CLEARANCE (Department Head)
  // ============================================
  
  // ✅ Accessible: DEPARTMENT_HEAD (explicitly allowed)
  updateClearanceItemStatus: async (
    checklistId: string,
    data: { itemIndex: number; status: string; notes?: string }
  ): Promise<any> => {
    return await api.patch(`/recruitment/offboarding/clearance/${checklistId}/item`, data);
  },
};
```

---

## Step 3: Create Shared Components

### File: `sw-project/frontend/components/recruitment/Modal.tsx`
Reuse the leaves Modal component pattern or create a recruitment-specific one.

### File: `sw-project/frontend/components/recruitment/Toast.tsx`
Reuse the leaves Toast component.

### File: `sw-project/frontend/components/recruitment/StatusBadge.tsx`
Create a component to display status badges with colors:

```typescript
"use client";

import { ApplicationStatus, InterviewStatus, OnboardingTaskStatus } from "@/types/recruitment";

interface StatusBadgeProps {
  status: string;
  type?: "application" | "interview" | "onboarding";
}

export function StatusBadge({ status, type = "application" }: StatusBadgeProps) {
  const getColor = () => {
    if (type === "application") {
      switch (status) {
        case ApplicationStatus.SUBMITTED:
          return "bg-blue-100 text-blue-800";
        case ApplicationStatus.IN_PROCESS:
          return "bg-yellow-100 text-yellow-800";
        case ApplicationStatus.OFFER:
          return "bg-purple-100 text-purple-800";
        case ApplicationStatus.HIRED:
          return "bg-green-100 text-green-800";
        case ApplicationStatus.REJECTED:
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
    // Add other types as needed
    return "bg-gray-100 text-gray-800";
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
      {status.replace("_", " ").toUpperCase()}
    </span>
  );
}
```

---

## Step 4: Create Pages for Each Role

### 4.1 Candidate Portal (JOB_CANDIDATE)

**BRS Requirements: REC-007, REC-017, REC-028, ONB-002, ONB-004, ONB-005, ONB-007**

#### File: `sw-project/frontend/app/candidate-portal/page.tsx`
Update the existing candidate portal to show:
- List of published job requisitions (REC-023)
- Ability to apply for jobs with consent checkbox (REC-007, REC-028)
- Track application status (REC-017)
- View interview schedules
- Respond to offers (REC-018)
- Upload signed contract and candidate forms (ONB-002)

#### File: `sw-project/frontend/app/candidate-portal/applications/page.tsx`
- List all applications with status
- View application details
- Track progress through stages

#### File: `sw-project/frontend/app/candidate-portal/interviews/page.tsx`
- View scheduled interviews
- See interview details (date, time, method, video link)

#### File: `sw-project/frontend/app/candidate-portal/offers/page.tsx`
- View offers
- Accept/reject offers (REC-018)
- Upload signed contract (ONB-002)
- Upload candidate required forms (ONB-002)

#### File: `sw-project/frontend/app/candidate-portal/onboarding/page.tsx`
- View onboarding steps in tracker (ONB-004)
- Receive reminders and notifications (ONB-005)
- Upload documents (ID, contracts, certifications) (ONB-007)

---

### 4.2 HR Admin Dashboard (HR_ADMIN)

**❌ SKIP ALL HR_ADMIN FEATURES**
- HR_ADMIN exists in frontend but NOT in backend recruitment endpoints
- Backend uses HR_MANAGER, HR_EMPLOYEE, SYSTEM_ADMIN, RECRUITER for recruitment
- **DO NOT implement any HR_ADMIN recruitment pages** - they will not work with backend
- Wait until backend adds HR_ADMIN support or frontend adds HR_MANAGER/HR_EMPLOYEE roles

---

### 4.3 Employee Dashboard (DEPARTMENT_EMPLOYEE)

**BRS Requirements: REC-030, OFF-018, OFF-019**

#### File: `sw-project/frontend/app/dashboard/recruitment/referrals/page.tsx`
- View candidates they referred (✅ Works)
- ⚠️ Tag candidates as referrals (REC-030 - Backend requires HR_EMPLOYEE/HR_MANAGER, but BRS says employees can do this)
- Track referral status (✅ Works)

#### File: `sw-project/frontend/app/dashboard/recruitment/resignation/page.tsx`
- Submit resignation request with reasoning (OFF-018 - ✅ Works)
- Track resignation request status (OFF-019 - ✅ Works)

---

### 4.4 Department Head Dashboard (DEPARTMENT_HEAD)

**BRS Requirements: REC-010, REC-011, REC-020, OFF-010**

#### File: `sw-project/frontend/app/dashboard/recruitment/department-interviews/page.tsx`
- View interviews for their department (✅ Works)
- ⚠️ Submit interview feedback (REC-011, REC-020 - Backend requires HR_EMPLOYEE/HR_MANAGER/RECRUITER, but BRS says Department Head should be able to)
- View interview schedules (✅ Works)
- View interview feedback from others (✅ Works)

#### File: `sw-project/frontend/app/dashboard/recruitment/clearance/page.tsx`
- View clearance checklists for their department (⚠️ May need backend update)
- Update clearance item status (OFF-010 - ✅ Works - explicitly allows DEPARTMENT_HEAD)
- Add notes (✅ Works)

---

## Step 5: Implementation Order

### Phase 1: Foundation
1. ✅ Create types file (`types/recruitment.ts`)
2. ✅ Create API client (`lib/api/recruitment/recruitment.ts`) - **Only include accessible endpoints**
3. ✅ Create shared components (Modal, Toast, StatusBadge)

### Phase 2: Candidate Portal
1. Update candidate portal main page
2. Create applications page
3. Create interviews page
4. Create offers page
5. Create onboarding page (for new hires)

### Phase 3: HR Admin Portal
**❌ SKIP - HR_ADMIN not supported in backend recruitment endpoints**
- Backend uses HR_MANAGER, HR_EMPLOYEE, SYSTEM_ADMIN, RECRUITER
- Frontend has HR_ADMIN but backend doesn't accept it for recruitment
- **DO NOT implement HR_ADMIN recruitment pages**

### Phase 4: Employee & Department Head
1. Create referrals page (Employee)
2. Create resignation page (Employee)
3. Create department interviews page (Department Head)
4. Create clearance page (Department Head)

---

## Step 6: Key BRS Features to Implement

### Phase 1: Recruitment (REC)

#### For Candidates:
- ✅ Browse published job requisitions (REC-023)
- ✅ Upload CV and apply for positions (REC-007)
- ✅ Give consent for data processing (REC-028)
- ✅ Receive updates about application status (REC-017)
- ✅ Respond to offers (REC-018)
- ✅ Upload signed contract and forms (ONB-002)

#### For HR Admin:
**❌ SKIP ALL - HR_ADMIN not supported in backend recruitment**
- Backend requires HR_MANAGER, HR_EMPLOYEE, SYSTEM_ADMIN, or RECRUITER
- Frontend has HR_ADMIN but backend doesn't accept it
- All HR Admin recruitment features are SKIPPED

#### For Employees:
- ⚠️ Tag candidates as referrals (REC-030 - Backend requires HR_EMPLOYEE/HR_MANAGER, but BRS says employees can)
- ✅ View referral status (Works)

### Phase 2: Onboarding (ONB)

#### For Candidates/New Hires:
- ✅ Upload signed contract (ONB-002)
- ✅ Upload candidate required forms (ONB-002)
- ✅ View onboarding steps in tracker (ONB-004)
- ✅ Receive reminders and notifications (ONB-005)
- ✅ Upload documents (ID, contracts, certifications) (ONB-007)

#### For HR Admin:
**❌ SKIP ALL - HR_ADMIN not supported in backend onboarding**
- Backend requires HR_EMPLOYEE, HR_MANAGER, or SYSTEM_ADMIN
- Frontend has HR_ADMIN but backend doesn't accept it
- All HR Admin onboarding features are SKIPPED

### Phase 3: Offboarding (OFF)

#### For Employees:
- ✅ Request resignation with reasoning (OFF-018)
- ✅ Track resignation request status (OFF-019)

#### For HR Admin:
**❌ SKIP ALL - HR_ADMIN not supported in backend offboarding**
- Backend requires HR_MANAGER or SYSTEM_ADMIN
- Frontend has HR_ADMIN but backend doesn't accept it
- All HR Admin offboarding features are SKIPPED

#### For Department Heads:
- ✅ Update clearance item status (OFF-010 - Works)

---

## Step 7: Important Notes

### Role-Based Access Control
- Use `useRequireAuth(SystemRole.ROLE_NAME)` hook to protect routes
- **⚠️ CRITICAL:** Backend uses HR_MANAGER but frontend uses HR_ADMIN
- Many endpoints will return 403 Forbidden for HR_ADMIN until backend is updated
- Handle 403 errors gracefully - show "Feature not available" or "Contact administrator"
- Some endpoints have no role restrictions and work for all authenticated users

### File Uploads
- Use FormData for file uploads
- Set Content-Type to "multipart/form-data"
- Handle file selection and validation
- Support document types: CONTRACT, ID, RESUME, CERTIFICATE, OTHER

### Date Handling
- Backend expects ISO 8601 date strings
- Use date pickers in forms
- Format dates for display

### Status Management
- Applications have status and stage
- Interviews have status
- Offers have applicantResponse and finalStatus
- Onboarding tasks have status

### Error Handling
- Use Toast component for success/error messages
- Handle API errors gracefully
- Show loading states
- **Handle 403 Forbidden errors** - show user-friendly message about role requirements

### Data Relationships
- Applications link to JobRequisitions and Candidates
- Interviews link to Applications
- Offers link to Applications and Candidates
- Onboarding links to Employees

### BRS Compliance
- All user stories and requirements from the BRS are mapped to specific features
- Each feature is tagged with its BRS requirement code
- **⚠️ Note:** Some BRS requirements cannot be fully implemented until backend supports HR_ADMIN or adds role support for Department Head in interview feedback

### Backend Integration Notes
- **Payroll Initiation (ONB-018):** Must trigger payroll execution service (REQ-PY-23)
- **Signing Bonus (ONB-019):** Must trigger payroll execution service to fill collection relating user to signing bonus (REQ-PY-27)
- **Final Settlement (OFF-013):** Must trigger benefits termination and final pay calculation in payroll execution module

---

## Step 8: Testing Checklist

### Recruitment Phase
- [ ] Candidate can browse and apply for jobs (REC-007, REC-028)
- [ ] Candidate receives status updates (REC-017)
- [ ] HR Admin can view job requisitions (view only)
- [ ] HR Admin can view applications (view only)
- [ ] HR Admin can view interviews (view only)
- [ ] Employee can submit resignation (OFF-018)
- [ ] Employee can track resignation status (OFF-019)
- [ ] Department Head can view department interviews
- [ ] Department Head can update clearance items (OFF-010)

### Onboarding Phase
- [ ] Candidate can upload signed contract (ONB-002)
- [ ] Candidate can upload required forms (ONB-002)
- [ ] New Hire can view onboarding tracker (ONB-004)
- [ ] New Hire receives reminders (ONB-005)
- [ ] New Hire can upload documents (ONB-007)

### Features Requiring Backend/Frontend Role Updates
- [ ] HR Admin features (Requires either: backend to add HR_ADMIN support OR frontend to add HR_MANAGER/HR_EMPLOYEE roles)
- [ ] Employee can tag referrals (Requires backend to add DEPARTMENT_EMPLOYEE to referral endpoint - BRS says employees can)
- [ ] Department Head can submit interview feedback (Requires backend to add DEPARTMENT_HEAD to interview feedback endpoint - BRS says they should)

---

## Step 9: Backend/Frontend Update Requirements

The following updates are needed for full functionality:

### Option 1: Backend Updates (Recommended)
1. **Add HR_ADMIN to recruitment endpoints** that currently require HR_MANAGER/HR_EMPLOYEE:
   - Job requisition creation/updates
   - Application status updates
   - Interview scheduling
   - Offer creation/finalization
   - Onboarding management
   - Job template management

### Option 2: Frontend Updates (Alternative)
1. **Add HR_MANAGER role to frontend** (if HR_ADMIN and HR_MANAGER should be separate)
2. **Add HR_EMPLOYEE role to frontend** (for HR staff who aren't managers)
3. **Add RECRUITER role to frontend** (for dedicated recruiters)
4. **Add SYSTEM_ADMIN role to frontend** (for system administrators)

### BRS Compliance Updates Needed
1. **Add DEPARTMENT_HEAD to interview feedback endpoint** (currently requires HR_EMPLOYEE/HR_MANAGER/RECRUITER) - BRS says Department Head should be able to submit feedback

2. **Add DEPARTMENT_EMPLOYEE to referral tagging endpoint** (currently requires HR_EMPLOYEE/HR_MANAGER) - BRS says employees can tag referrals

3. **Ensure payroll execution integration** for:
   - ONB-018: Payroll initiation trigger
   - ONB-019: Signing bonus processing
   - OFF-013: Final settlement trigger

---

## Next Steps

1. Start with Step 1: Create the types file
2. Then Step 2: Create the API client (only accessible endpoints)
3. Then Step 3: Create shared components
4. Then implement pages following Phase 2, 3, 4 order
5. **Mark features requiring backend updates** with "Coming Soon" or handle 403 errors gracefully
6. **Document backend update requirements** for future implementation

Good luck with the implementation!
