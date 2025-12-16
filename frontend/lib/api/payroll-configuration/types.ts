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

export interface InsuranceBracket extends BaseConfiguration {
  name: string; // Insurance bracket name (e.g., social, health insurance)
  minSalary: number; // Minimum salary for bracket
  maxSalary: number; // Maximum salary for bracket
  employeeRate: number; // Employee contribution rate (%)
  employerRate: number; // Employer contribution rate (%)
  amount?: number; // Fixed insurance amount (optional)
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

export interface BaseConfiguration {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  comments?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface PayrollPolicy extends BaseConfiguration {
  policyType: 'attendance' | 'overtime' | 'bonus' | 'deduction' | 'other';
  effectiveDate: string;
  rules: Record<string, any>;
  department?: string;
  location?: string;
}

export interface PayGrade extends BaseConfiguration {
  minSalary: number;
  maxSalary: number;
  currency: string;
  jobGrade: string;
  jobBand: string;
  benefits?: string[];
  isActive: boolean;
}

export interface PayType extends BaseConfiguration {
  type: 'hourly' | 'salary' | 'commission' | 'contract';
  calculationMethod: string;
  isTaxable: boolean;
  isOvertimeEligible: boolean;
  overtimeRate?: number;
  minHours?: number;
  maxHours?: number;
}

export interface Allowance extends BaseConfiguration {
  allowanceType: 'housing' | 'transportation' | 'meal' | 'education' | 'medical' | 'other';
  amount: number;
  currency: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  eligibilityCriteria?: string;
  taxable: boolean;
  effectiveDate?: string;
  expirationDate?: string;
}

export interface TaxRule extends BaseConfiguration {
  rate: number; // Tax rate in percentage
  effectiveDate?: string;
  exemptions?: string[]; // List of exemptions
  thresholds?: {
    minAmount?: number;
    maxAmount?: number;
  };
  isProgressive?: boolean; // Whether this is a progressive tax rate
}

export interface SigningBonus extends BaseConfiguration {
  positionName: string; // Position name eligible for signing bonus (e.g., Junior TA, Mid TA, Senior TA)
  amount: number; // Signing bonus amount
}

export interface TerminationBenefit extends BaseConfiguration {
  amount: number; // Termination/resignation benefit amount
  terms?: string; // Terms and conditions for the benefit
}