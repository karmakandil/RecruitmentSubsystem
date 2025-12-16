/**
 * NotificationType Enum
 * 
 * Defines all notification types used across the HR system.
 * Each type corresponds to a specific event that triggers a notification.
 * 
 * Notifications are stored in the NotificationLog collection and displayed
 * in the user's notification bell/center in the frontend.
 */
export enum NotificationType {
  // =============================================================================
  // LEAVE MODULE NOTIFICATIONS
  // =============================================================================
  // Sent to employees and managers regarding leave requests
  
  LEAVE_APPROVED = 'leave_approved',           // Employee: Your leave was approved
  LEAVE_REJECTED = 'leave_rejected',           // Employee: Your leave was rejected
  LEAVE_CREATED = 'leave_created',             // Manager: New leave request to review
  LEAVE_MODIFIED = 'leave_modified',           // Employee: Your leave was modified
  LEAVE_FINALIZED = 'leave_finalized',         // All parties: Leave request finalized
  LEAVE_RETURNED_FOR_CORRECTION = 'leave_returned_for_correction', // Employee: Fix and resubmit

  // =============================================================================
  // TIME MANAGEMENT MODULE NOTIFICATIONS
  // =============================================================================
  // Sent to employees, managers, and HR regarding attendance and shifts
  
  SHIFT_EXPIRY = 'shift_expiry',                       // HR Admin: Shift assignment expiring soon
  SHIFT_EXPIRY_ALERT = 'SHIFT_EXPIRY_ALERT',           // HR Admin: Single shift expiry alert
  SHIFT_EXPIRY_BULK_ALERT = 'SHIFT_EXPIRY_BULK_ALERT', // HR Admin: Multiple shifts expiring
  SHIFT_RENEWAL_CONFIRMATION = 'SHIFT_RENEWAL_CONFIRMATION',   // HR Admin: Shift renewed
  SHIFT_ARCHIVE_NOTIFICATION = 'SHIFT_ARCHIVE_NOTIFICATION',   // HR Admin: Shift archived
  MISSED_PUNCH = 'missed_punch',                       // Legacy: Missed punch notification
  MISSED_PUNCH_EMPLOYEE_ALERT = 'MISSED_PUNCH_EMPLOYEE_ALERT', // Employee: You missed a punch
  MISSED_PUNCH_MANAGER_ALERT = 'MISSED_PUNCH_MANAGER_ALERT',   // Manager: Employee missed punch

  // ===== RECRUITMENT SUBSYSTEM =====
  // Interview, hiring, and application notifications
  INTERVIEW_PANEL_INVITATION = 'INTERVIEW_PANEL_INVITATION',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INTERVIEW_CANCELLED = 'INTERVIEW_CANCELLED',
  INTERVIEW_RESCHEDULED = 'INTERVIEW_RESCHEDULED',
  INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
  FEEDBACK_READY_FOR_REVIEW = 'FEEDBACK_READY_FOR_REVIEW',
  CANDIDATE_HIRED = 'CANDIDATE_HIRED',
  CANDIDATE_REJECTED = 'CANDIDATE_REJECTED',
  CANDIDATE_OFFER_CREATED = 'CANDIDATE_OFFER_CREATED',
  OFFER_RECEIVED = 'OFFER_RECEIVED',
  OFFER_RESPONSE_ACCEPTED = 'OFFER_RESPONSE_ACCEPTED',
  OFFER_RESPONSE_REJECTED = 'OFFER_RESPONSE_REJECTED',
  APPLICATION_ACCEPTED = 'APPLICATION_ACCEPTED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  NEW_APPLICATION_RECEIVED = 'NEW_APPLICATION_RECEIVED',

  // =============================================================================
  // ONBOARDING → PAYROLL INTEGRATION NOTIFICATIONS (ONB-018, ONB-019)
  // =============================================================================
  // Notifications sent to Payroll team when new hires are ready for payroll
  NEW_HIRE_PAYROLL_READY = 'NEW_HIRE_PAYROLL_READY',
  SIGNING_BONUS_PENDING_REVIEW = 'SIGNING_BONUS_PENDING_REVIEW',
  ONBOARDING_PAYROLL_TASK_COMPLETED = 'ONBOARDING_PAYROLL_TASK_COMPLETED',

  // =============================================================================
  // ONBOARDING NOTIFICATIONS (ONB-004, ONB-005)
  // =============================================================================
  // Notifications for the onboarding workflow
  ONBOARDING_WELCOME = 'ONBOARDING_WELCOME',
  ONBOARDING_TASK_REMINDER = 'ONBOARDING_TASK_REMINDER',
  ONBOARDING_COMPLETED = 'ONBOARDING_COMPLETED',
  ONBOARDING_DOCUMENT_UPLOADED = 'ONBOARDING_DOCUMENT_UPLOADED',
  ONBOARDING_ACCESS_PROVISIONED = 'ONBOARDING_ACCESS_PROVISIONED',
  ONBOARDING_EQUIPMENT_RESERVED = 'ONBOARDING_EQUIPMENT_RESERVED',

  // =============================================================================
  // OFFBOARDING NOTIFICATIONS (OFF-001 to OFF-019)
  // =============================================================================
  // Notifications for the offboarding/separation workflow
  RESIGNATION_SUBMITTED = 'RESIGNATION_SUBMITTED',
  RESIGNATION_STATUS_UPDATED = 'RESIGNATION_STATUS_UPDATED',
  TERMINATION_INITIATED = 'TERMINATION_INITIATED',
  TERMINATION_APPROVED = 'TERMINATION_APPROVED',
  CLEARANCE_CHECKLIST_CREATED = 'CLEARANCE_CHECKLIST_CREATED',
  CLEARANCE_SIGN_OFF_NEEDED = 'CLEARANCE_SIGN_OFF_NEEDED',
  CLEARANCE_ITEM_UPDATED = 'CLEARANCE_ITEM_UPDATED',
  CLEARANCE_ALL_APPROVED = 'CLEARANCE_ALL_APPROVED',
  ACCESS_REVOKED = 'ACCESS_REVOKED',
  FINAL_SETTLEMENT_TRIGGERED = 'FINAL_SETTLEMENT_TRIGGERED',
  FINAL_SETTLEMENT_COMPLETED = 'FINAL_SETTLEMENT_COMPLETED',
}