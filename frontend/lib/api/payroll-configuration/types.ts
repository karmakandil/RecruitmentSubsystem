export type ConfigStatus = 'draft' | 'approved' | 'rejected';

export interface CompanySettings {
  _id?: string;
  payDate: string; // ISO date string
  timeZone: string;
  currency: string; // Should be 'EGP'
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompanySettingsDto {
  payDate: string;
  timeZone: string;
  currency: string;
}

export interface UpdateCompanySettingsDto {
  payDate?: string;
  timeZone?: string;
  currency?: string;
}

export interface PendingApproval {
  _id: string;
  type: string; // 'policies' | 'pay-grades' | 'allowances' | etc.
  data: any;
  status: ConfigStatus;
  createdBy?: string;
  createdAt?: string;
}

export interface ApprovalDto {
  comment?: string;
}

export interface RejectionDto {
  comment?: string;
}

export interface InsuranceBracket {
  _id: string;
  minSalary: number;
  maxSalary: number;
  employeeContribution: number;
  employerContribution: number;
  status: ConfigStatus;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConfigurationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  payGrades?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  allowances?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  payTypes?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  taxRules?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  insuranceBrackets?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  signingBonuses?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  terminationBenefits?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  payrollPolicies?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  success?: boolean;
  error?: string;
}

