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

  // =============================================================================
  // RECRUITMENT MODULE NOTIFICATIONS - INTERVIEW FLOW
  // =============================================================================
  // Notifications for interview scheduling and management
  //
  // Flow: Interview scheduled → Panel notified → Candidate notified
  //       If cancelled/rescheduled → All parties notified
  
  /** 
   * INTERVIEW_PANEL_INVITATION
   * Sent to: Panel members (employees assigned to interview)
   * When: HR schedules an interview and assigns panel members
   * Contains: Candidate name, position, date/time, method, video link
   */
  INTERVIEW_PANEL_INVITATION = 'INTERVIEW_PANEL_INVITATION',
  
  /**
   * INTERVIEW_SCHEDULED
   * Sent to: Candidate
   * When: HR schedules an interview for the candidate
   * Contains: Position, date/time, method, video link, stage
   */
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  
  /**
   * INTERVIEW_CANCELLED
   * Sent to: Panel members
   * When: HR cancels a scheduled interview
   * Contains: Candidate name, position, original date
   */
  INTERVIEW_CANCELLED = 'INTERVIEW_CANCELLED',
  
  /**
   * INTERVIEW_RESCHEDULED
   * Sent to: Panel members
   * When: HR changes the interview date/time
   * Contains: Candidate name, position, old date, new date
   */
  INTERVIEW_RESCHEDULED = 'INTERVIEW_RESCHEDULED',

  // =============================================================================
  // RECRUITMENT MODULE NOTIFICATIONS - HIRING DECISION FLOW
  // =============================================================================
  // Notifications for the hiring/rejection workflow
  //
  // Flow: 
  //   1. HR Employee submits interview feedback (score + comments)
  //   2. Interview status → 'completed' when all panel members submit feedback
  //   3. Application appears in HR Manager's "Job Offers & Approvals"
  //   4. HR Manager accepts (creates offer) or rejects
  //   5. If hired: HR Employees notified + Candidate notified
  //   6. If rejected: HR Employees notified + Candidate notified
  
  /**
   * CANDIDATE_HIRED
   * Sent to: All HR Employees
   * When: HR Manager approves offer (finalizeOffer with APPROVED)
   *       OR application status changes to HIRED
   * Contains: Candidate name, position, application ID
   * Purpose: HR Employee can track in "Candidate Tracking" and prepare onboarding
   */
  CANDIDATE_HIRED = 'CANDIDATE_HIRED',
  
  /**
   * CANDIDATE_REJECTED
   * Sent to: All HR Employees
   * When: HR Manager rejects application/offer (finalizeOffer with REJECTED)
   *       OR application status changes to REJECTED
   * Contains: Candidate name, position, application ID, rejection reason
   * Purpose: HR Employee can track in "Candidate Tracking"
   */
  CANDIDATE_REJECTED = 'CANDIDATE_REJECTED',
  
  /**
   * CANDIDATE_OFFER_CREATED
   * Sent to: All HR Employees (future use)
   * When: HR Manager creates an offer for a candidate
   * Contains: Candidate name, position, offer details
   */
  CANDIDATE_OFFER_CREATED = 'CANDIDATE_OFFER_CREATED',

  /**
   * OFFER_RECEIVED
   * Sent to: Candidate
   * When: HR Manager creates and sends an offer to the candidate
   * Contains: Position title, salary, deadline, offer details
   * Purpose: Notify candidate to review and respond to the offer
   */
  OFFER_RECEIVED = 'OFFER_RECEIVED',

  /**
   * OFFER_RESPONSE_ACCEPTED
   * Sent to: HR Manager and HR Employees
   * When: Candidate accepts the job offer
   * Contains: Candidate name, position, offer details
   * Purpose: HR Manager can now finalize the offer and hire the candidate
   */
  OFFER_RESPONSE_ACCEPTED = 'OFFER_RESPONSE_ACCEPTED',

  /**
   * OFFER_RESPONSE_REJECTED
   * Sent to: HR Manager and HR Employees
   * When: Candidate rejects the job offer
   * Contains: Candidate name, position
   * Purpose: HR Manager can decide next steps (other candidates, close position, etc.)
   */
  OFFER_RESPONSE_REJECTED = 'OFFER_RESPONSE_REJECTED',

  // =============================================================================
  // RECRUITMENT MODULE NOTIFICATIONS - CANDIDATE NOTIFICATIONS
  // =============================================================================
  // In-app notifications sent to candidates about their application
  //
  // Note: These are IN ADDITION to email notifications sent via sendNotification()
  
  /**
   * APPLICATION_ACCEPTED
   * Sent to: Candidate
   * When: Candidate is hired (offer approved and accepted)
   * Contains: Position title, application ID
   * Message: "Congratulations! You have been HIRED!"
   */
  APPLICATION_ACCEPTED = 'APPLICATION_ACCEPTED',
  
  /**
   * APPLICATION_REJECTED
   * Sent to: Candidate
   * When: Application is rejected by HR Manager
   * Contains: Position title, application ID, rejection reason (if provided)
   * Message: Professional rejection with feedback if available
   */
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
}