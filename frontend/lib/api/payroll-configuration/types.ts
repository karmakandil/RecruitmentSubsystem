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