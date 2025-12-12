export enum NotificationType {
  // Leave Module Notifications
  LEAVE_APPROVED = 'leave_approved',
  LEAVE_REJECTED = 'leave_rejected',
  LEAVE_CREATED = 'leave_created',
  LEAVE_MODIFIED = 'leave_modified',
  LEAVE_FINALIZED = 'leave_finalized',
  LEAVE_RETURNED_FOR_CORRECTION = 'leave_returned_for_correction',

  // Time Management Module Notifications
  SHIFT_EXPIRY = 'shift_expiry',
  SHIFT_EXPIRY_ALERT = 'SHIFT_EXPIRY_ALERT',
  SHIFT_EXPIRY_BULK_ALERT = 'SHIFT_EXPIRY_BULK_ALERT',
  SHIFT_RENEWAL_CONFIRMATION = 'SHIFT_RENEWAL_CONFIRMATION',
  SHIFT_ARCHIVE_NOTIFICATION = 'SHIFT_ARCHIVE_NOTIFICATION',
  MISSED_PUNCH = 'missed_punch',
  MISSED_PUNCH_EMPLOYEE_ALERT = 'MISSED_PUNCH_EMPLOYEE_ALERT',
  MISSED_PUNCH_MANAGER_ALERT = 'MISSED_PUNCH_MANAGER_ALERT',

  // Payroll Tracking Module Notifications
  DISPUTE_APPROVED_FOR_FINANCE = 'dispute_approved_for_finance',
  CLAIM_APPROVED_FOR_FINANCE = 'claim_approved_for_finance',
  DISPUTE_APPROVED = 'dispute_approved',
  CLAIM_APPROVED = 'claim_approved',
  DISPUTE_REJECTED = 'dispute_rejected',
  CLAIM_REJECTED = 'claim_rejected',
}

export interface Notification {
  _id: string;
  to: string;
  type: NotificationType | string; // Allow both enum values and string types from time-management
  message: string;
  isRead?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  source?: 'unified' | 'time-management'; // Track which module created it
}

export interface CreateNotificationDto {
  to: string;
  type: NotificationType;
  message: string;
}

export interface GetNotificationsResponse {
  data: Notification[];
  total: number;
  unread: number;
}

export interface NotificationFilter {
  type?: NotificationType;
  startDate?: Date;
  endDate?: Date;
  unreadOnly?: boolean;
}

