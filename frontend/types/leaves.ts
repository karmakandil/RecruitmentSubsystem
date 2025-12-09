// Leave Types
export interface LeaveType {
  _id: string;
  code: string;
  name: string;
  categoryId: string;
  description?: string;
  paid: boolean;
  deductible: boolean;
  requiresAttachment: boolean;
  attachmentType?: 'medical' | 'document' | 'other';
  minTenureMonths?: number;
  maxDurationDays?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeaveTypeDto {
  code: string;
  name: string;
  categoryId: string;
  description?: string;
  paid?: boolean;
  deductible?: boolean;
  requiresAttachment?: boolean;
  attachmentType?: 'medical' | 'document' | 'other';
}

export interface UpdateLeaveTypeDto {
  code?: string;
  name?: string;
  categoryId?: string;
  description?: string;
  paid?: boolean;
  deductible?: boolean;
  requiresAttachment?: boolean;
  attachmentType?: 'medical' | 'document' | 'other';
  minTenureMonths?: number;
  maxDurationDays?: number;
}

// Leave Categories
export interface LeaveCategory {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeaveCategoryDto {
  name: string;
  description?: string;
}

// Leave Policies
export interface LeavePolicy {
  _id: string;
  leaveTypeId: string;
  accrualMethod: 'monthly' | 'yearly' | 'per-term';
  monthlyRate: number;
  yearlyRate: number;
  carryForwardAllowed: boolean;
  maxCarryForward: number;
  expiryAfterMonths?: number;
  roundingRule: 'none' | 'round' | 'round_up' | 'round_down';
  minNoticeDays: number;
  maxConsecutiveDays?: number;
  eligibility?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeavePolicyDto {
  leaveTypeId: string;
  accrualMethod: 'monthly' | 'yearly' | 'per-term';
  monthlyRate: number;
  yearlyRate: number;
  roundingRule?: 'none' | 'round' | 'round_up' | 'round_down';
  maxCarryForward?: number;
  minNoticeDays: number;
  maxConsecutiveDays?: number;
  eligibility?: Record<string, any>;
}

export interface UpdateLeavePolicyDto {
  accrualMethod?: 'monthly' | 'yearly' | 'per-term';
  monthlyRate?: number;
  yearlyRate?: number;
  roundingRule?: 'none' | 'round' | 'round_up' | 'round_down';
  maxCarryForward?: number;
  minNoticeDays?: number;
  maxConsecutiveDays?: number;
  eligibility?: Record<string, any>;
}

// Leave Entitlements
export interface LeaveEntitlement {
  _id: string;
  employeeId: string;
  leaveTypeId: string;
  yearlyEntitlement: number;
  accruedActual: number;
  accruedRounded: number;
  carryForward: number;
  taken: number;
  pending: number;
  remaining: number;
  lastAccrualDate?: string;
  nextResetDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeaveEntitlementDto {
  employeeId: string;
  leaveTypeId: string;
  yearlyEntitlement: number;
  accruedActual: number;
  accruedRounded: number;
  carryForward: number;
  taken: number;
  pending: number;
  remaining: number;
  lastAccrualDate?: string;
  nextResetDate?: string;
}

export interface UpdateLeaveEntitlementDto {
  yearlyEntitlement?: number;
  accruedActual?: number;
  accruedRounded?: number;
  carryForward?: number;
  taken?: number;
  pending?: number;
  remaining?: number;
  lastAccrualDate?: string;
  nextResetDate?: string;
}

// Leave Adjustments
export interface LeaveAdjustment {
  _id: string;
  employeeId: string;
  leaveTypeId: string;
  adjustmentType: 'add' | 'deduct' | 'encashment';
  amount: number;
  reason: string;
  hrUserId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeaveAdjustmentDto {
  employeeId: string;
  leaveTypeId: string;
  adjustmentType: 'add' | 'deduct' | 'encashment';
  amount: number;
  reason: string;
  hrUserId: string;
}

// Calendar
export interface BlockedPeriod {
  from: string;
  to: string;
  reason?: string;
}

export interface Holiday {
  name: string;
  date: string;
  description?: string;
}

export interface Calendar {
  _id: string;
  year: number;
  holidays: string[] | Holiday[];
  blockedPeriods: BlockedPeriod[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCalendarDto {
  year: number;
  holidays?: Holiday[];
  blockedPeriods?: BlockedPeriod[];
}

