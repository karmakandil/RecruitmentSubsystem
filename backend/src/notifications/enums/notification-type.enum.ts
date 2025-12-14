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

  /**
   * NEW_APPLICATION_RECEIVED
   * Sent to: All HR Employees and HR Managers
   * When: A candidate submits a new job application
   * Contains: Candidate name, position title, application ID
   * Purpose: Notify HR team about new applications in the pipeline for review
   */
  NEW_APPLICATION_RECEIVED = 'NEW_APPLICATION_RECEIVED',

  // =============================================================================
  // ONBOARDING → PAYROLL INTEGRATION NOTIFICATIONS (ONB-018, ONB-019)
  // =============================================================================
  // Notifications sent to Payroll team when new hires are ready for payroll
  //
  // Flow:
  //   1. Employee profile created from contract → Onboarding triggered
  //   2. triggerPayrollInitiation() called → Payroll team notified
  //   3. processSigningBonus() called → Payroll team notified of pending bonus
  //   4. Payroll team reviews and includes in next payroll run

  /**
   * NEW_HIRE_PAYROLL_READY
   * Sent to: Payroll Specialist, Payroll Manager
   * When: New employee profile is created and ready for payroll inclusion (ONB-018)
   * Contains: Employee name, position, gross salary, start date, signing bonus (if any)
   * Purpose: Notify payroll team that a new hire will be included in next payroll run
   */
  NEW_HIRE_PAYROLL_READY = 'NEW_HIRE_PAYROLL_READY',

  /**
   * SIGNING_BONUS_PENDING_REVIEW
   * Sent to: Payroll Specialist, Payroll Manager
   * When: A signing bonus record is created for a new hire (ONB-019)
   * Contains: Employee name, position, bonus amount, payment date
   * Purpose: Notify payroll team to review and approve the signing bonus
   */
  SIGNING_BONUS_PENDING_REVIEW = 'SIGNING_BONUS_PENDING_REVIEW',

  /**
   * ONBOARDING_PAYROLL_TASK_COMPLETED
   * Sent to: HR Manager, HR Employee
   * When: Payroll initiation task is completed in onboarding
   * Contains: Employee name, confirmation of payroll readiness
   * Purpose: Confirm to HR that payroll setup is complete for the new hire
   */
  ONBOARDING_PAYROLL_TASK_COMPLETED = 'ONBOARDING_PAYROLL_TASK_COMPLETED',

  // =============================================================================
  // ONBOARDING NOTIFICATIONS (ONB-004, ONB-005)
  // =============================================================================
  // Notifications for the onboarding workflow

  /**
   * ONBOARDING_WELCOME
   * Sent to: New Hire
   * When: Onboarding is created for the new employee
   * Contains: Welcome message, task summary, next steps
   * Purpose: Welcome the new hire and inform them about onboarding tasks
   */
  ONBOARDING_WELCOME = 'ONBOARDING_WELCOME',

  /**
   * ONBOARDING_TASK_REMINDER
   * Sent to: New Hire, Assigned Department
   * When: Task is overdue or approaching deadline
   * Contains: Task name, deadline, status
   * Purpose: Remind about pending onboarding tasks
   */
  ONBOARDING_TASK_REMINDER = 'ONBOARDING_TASK_REMINDER',

  /**
   * ONBOARDING_COMPLETED
   * Sent to: New Hire, HR Manager
   * When: All onboarding tasks are completed
   * Contains: Completion confirmation, next steps
   * Purpose: Confirm successful onboarding completion
   */
  ONBOARDING_COMPLETED = 'ONBOARDING_COMPLETED',

  /**
   * ONBOARDING_DOCUMENT_UPLOADED
   * Sent to: HR Manager, HR Employee
   * When: New hire uploads a compliance document (ONB-007)
   * Contains: Document type, employee name, verification status
   * Purpose: Notify HR to review uploaded documents
   */
  ONBOARDING_DOCUMENT_UPLOADED = 'ONBOARDING_DOCUMENT_UPLOADED',

  /**
   * ONBOARDING_ACCESS_PROVISIONED
   * Sent to: New Hire, IT Department
   * When: System access is provisioned (ONB-009, ONB-013)
   * Contains: Access type, provisioned systems
   * Purpose: Confirm access has been granted
   */
  ONBOARDING_ACCESS_PROVISIONED = 'ONBOARDING_ACCESS_PROVISIONED',

  /**
   * ONBOARDING_EQUIPMENT_RESERVED
   * Sent to: New Hire, Admin Department
   * When: Equipment/workspace is reserved (ONB-012)
   * Contains: Equipment list, workspace details
   * Purpose: Confirm resources are ready for Day 1
   */
  ONBOARDING_EQUIPMENT_RESERVED = 'ONBOARDING_EQUIPMENT_RESERVED',

  // =============================================================================
  // OFFBOARDING NOTIFICATIONS (OFF-001 to OFF-019)
  // =============================================================================
  // Notifications for the offboarding/separation workflow

  /**
   * RESIGNATION_SUBMITTED (OFF-018)
   * Sent to: HR Manager, Line Manager
   * When: Employee submits a resignation request
   * Contains: Employee name, reason, requested last day
   * Purpose: Notify HR and manager to review the resignation
   */
  RESIGNATION_SUBMITTED = 'RESIGNATION_SUBMITTED',

  /**
   * RESIGNATION_STATUS_UPDATED (OFF-019)
   * Sent to: Employee
   * When: Resignation request status changes (approved/rejected)
   * Contains: Status, next steps, effective date
   * Purpose: Keep employee informed about their resignation status
   */
  RESIGNATION_STATUS_UPDATED = 'RESIGNATION_STATUS_UPDATED',

  /**
   * TERMINATION_INITIATED (OFF-001)
   * Sent to: HR Manager, Department Head
   * When: HR initiates termination based on performance
   * Contains: Employee name, reason, performance score
   * Purpose: Notify relevant parties about termination initiation
   */
  TERMINATION_INITIATED = 'TERMINATION_INITIATED',

  /**
   * TERMINATION_APPROVED (OFF-001)
   * Sent to: Employee, HR Manager, IT Department
   * When: Termination request is approved
   * Contains: Employee name, effective date, next steps
   * Purpose: Trigger offboarding process and access revocation
   */
  TERMINATION_APPROVED = 'TERMINATION_APPROVED',

  /**
   * CLEARANCE_CHECKLIST_CREATED (OFF-006)
   * Sent to: All departments (IT, Finance, Facilities, HR, Admin)
   * When: Offboarding checklist is created for an employee
   * Contains: Employee name, termination date, checklist items
   * Purpose: Notify departments to begin clearance sign-off
   */
  CLEARANCE_CHECKLIST_CREATED = 'CLEARANCE_CHECKLIST_CREATED',

  /**
   * CLEARANCE_SIGN_OFF_NEEDED (OFF-010)
   * Sent to: Department Head
   * When: Their department needs to sign off on clearance
   * Contains: Employee name, department items to clear
   * Purpose: Remind department to complete their clearance items
   */
  CLEARANCE_SIGN_OFF_NEEDED = 'CLEARANCE_SIGN_OFF_NEEDED',

  /**
   * CLEARANCE_ITEM_UPDATED (OFF-010)
   * Sent to: HR Manager
   * When: A department updates their clearance status
   * Contains: Employee name, department, new status
   * Purpose: Track clearance progress
   */
  CLEARANCE_ITEM_UPDATED = 'CLEARANCE_ITEM_UPDATED',

  /**
   * CLEARANCE_ALL_APPROVED (OFF-010)
   * Sent to: HR Manager, Employee
   * When: All departments have approved clearance
   * Contains: Employee name, completion date
   * Purpose: Trigger final settlement process
   */
  CLEARANCE_ALL_APPROVED = 'CLEARANCE_ALL_APPROVED',

  /**
   * ACCESS_REVOKED (OFF-007)
   * Sent to: IT Department, HR Manager, Employee
   * When: System access is revoked for terminated employee
   * Contains: Employee name, systems revoked, effective date
   * Purpose: Confirm security measures are in place
   */
  ACCESS_REVOKED = 'ACCESS_REVOKED',

  /**
   * FINAL_SETTLEMENT_TRIGGERED (OFF-013)
   * Sent to: Payroll Team, HR Manager
   * When: Final settlement calculation is triggered
   * Contains: Employee name, leave balance, deductions, final amount
   * Purpose: Process final pay and benefits termination
   */
  FINAL_SETTLEMENT_TRIGGERED = 'FINAL_SETTLEMENT_TRIGGERED',

  /**
   * FINAL_SETTLEMENT_COMPLETED (OFF-013)
   * Sent to: Employee, HR Manager
   * When: Final settlement is processed
   * Contains: Final amount, payment date, settlement details
   * Purpose: Confirm offboarding is complete
   */
  FINAL_SETTLEMENT_COMPLETED = 'FINAL_SETTLEMENT_COMPLETED',
}