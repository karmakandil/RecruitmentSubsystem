import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateNotificationDto } from './dtos/notification.dto';
import { NotificationType } from './enums/notification-type.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('NotificationLog')
    private notificationLogModel: Model<any>,
    @InjectModel('ShiftAssignment')
    private shiftAssignmentModel: Model<any>,
    @InjectModel('EmployeeProfile')
    private employeeProfileModel: Model<any>,
  ) {}

  // ===== LEAVE MODULE NOTIFICATIONS =====

  /**
   * REQ: As an HR manager, I want the system to notify the employee, the employee's manager, 
   * and the attendance coordinator when a leave request is finalized so that everyone is informed.
   */
  async notifyLeaveRequestFinalized(
    leaveRequestId: string,
    employeeId: string,
    managerId: string,
    coordinatorId: string,
    leaveDetails: any,
  ) {
    const notifications = [];
    
    // Handle missing leaveDetails gracefully
    const details = leaveDetails || {
      employeeName: 'Employee',
      fromDate: '',
      toDate: '',
      status: 'APPROVED',
    };
    
    const message = `Leave request from ${details.employeeName} (${details.fromDate} to ${details.toDate}) has been finalized with status: ${details.status}`;

    // Notify Employee
    notifications.push(
      this.notificationLogModel.create({
        to: new Types.ObjectId(employeeId),
        type: NotificationType.LEAVE_FINALIZED,
        message: `Your leave request has been ${details.status}`,
      }),
    );

    // Notify Manager
    notifications.push(
      this.notificationLogModel.create({
        to: new Types.ObjectId(managerId),
        type: NotificationType.LEAVE_FINALIZED,
        message: message,
      }),
    );

    // Notify Attendance Coordinator
    notifications.push(
      this.notificationLogModel.create({
        to: new Types.ObjectId(coordinatorId),
        type: NotificationType.LEAVE_FINALIZED,
        message: message,
      }),
    );

    await Promise.all(notifications);
    return { success: true, notificationsCreated: 3 };
  }

  /**
   * REQ: As a direct manager, I want to receive notifications when a new leave request 
   * is assigned to me so that I can review it promptly.
   */
  async notifyLeaveRequestCreated(
    leaveRequestId: string,
    employeeId: string,
    managerId: string,
    leaveDetails: any,
  ) {
    // Handle missing leaveDetails gracefully
    const details = leaveDetails || {
      employeeName: 'Employee',
      fromDate: '',
      toDate: '',
    };

    const notification = await this.notificationLogModel.create({
      to: new Types.ObjectId(managerId),
      type: NotificationType.LEAVE_CREATED,
      message: `New leave request from ${details.employeeName} (${details.fromDate} to ${details.toDate}) awaiting your review`,
    });

    return notification;
  }

  /**
   * REQ: As an employee, I want to receive notifications when my leave request is approved, 
   * rejected, returned for correction, or modified so that I am always informed about the progress.
   */
  async notifyLeaveRequestStatusChanged(
    leaveRequestId: string,
    employeeId: string,
    status: 'APPROVED' | 'REJECTED' | 'RETURNED_FOR_CORRECTION' | 'MODIFIED',
  ) {
    const statusMessages = {
      APPROVED: 'Your leave request has been approved',
      REJECTED: 'Your leave request has been rejected',
      RETURNED_FOR_CORRECTION: 'Your leave request has been returned for correction',
      MODIFIED: 'Your leave request has been modified',
    };

    const notification = await this.notificationLogModel.create({
      to: new Types.ObjectId(employeeId),
      type: this.mapStatusToNotificationType(status),
      message: statusMessages[status],
    });

    return notification;
  }

  // ===== TIME MANAGEMENT MODULE NOTIFICATIONS =====

  /**
   * REQ: As an HR Admin, I want to be notified when a shift assignment is nearing expiry 
   * so that schedules can be renewed or reassigned.
   * Send shift expiry notification to HR Admin
   */
  async sendShiftExpiryNotification(
    recipientId: string,
    shiftAssignmentId: string,
    employeeId: string,
    endDate: Date,
    daysRemaining: number,
    currentUserId: string,
  ) {
    const message = `Shift assignment ${shiftAssignmentId} for employee ${employeeId} is expiring in ${daysRemaining} days (${endDate.toISOString().split('T')[0]}). Please renew or reassign.`;
    
    const notification = await this.notificationLogModel.create({
      to: new Types.ObjectId(recipientId),
      type: NotificationType.SHIFT_EXPIRY_ALERT,
      message,
    });
    
    return notification;
  }

  /**
   * Send bulk shift expiry notifications to HR Admins
   * Used when running batch expiry checks
   */
  async sendBulkShiftExpiryNotifications(
    hrAdminIds: string[],
    expiringAssignments: Array<{
      assignmentId: string;
      employeeId: string;
      employeeName?: string;
      shiftName?: string;
      endDate: Date;
      daysRemaining: number;
    }>,
    currentUserId: string,
  ) {
    const notifications: any[] = [];
    
    for (const hrAdminId of hrAdminIds) {
      // Create summary message for HR Admin
      const message = `${expiringAssignments.length} shift assignment(s) expiring soon:\n` +
        expiringAssignments
          .map(a => `- ${a.employeeName || a.employeeId}: ${a.shiftName || 'Shift'} expires in ${a.daysRemaining} days`)
          .join('\n');
      
      const notification = await this.notificationLogModel.create({
        to: new Types.ObjectId(hrAdminId),
        type: NotificationType.SHIFT_EXPIRY_BULK_ALERT,
        message,
      });
      
      notifications.push(notification);
    }
    
    return {
      notificationsSent: notifications.length,
      notifications,
    };
  }

  /**
   * Get shift expiry notifications for an HR Admin
   */
  async getShiftExpiryNotifications(hrAdminId: string) {
    const notifications = await this.notificationLogModel
      .find({
        to: new Types.ObjectId(hrAdminId),
        type: { $in: [NotificationType.SHIFT_EXPIRY_ALERT, NotificationType.SHIFT_EXPIRY_BULK_ALERT] },
      })
      .sort({ createdAt: -1 })
      .exec();
    
    return {
      count: notifications.length,
      notifications,
    };
  }

  /**
   * Send renewal confirmation notification
   * Sent when a shift assignment is successfully renewed
   */
  async sendShiftRenewalConfirmation(
    recipientId: string,
    shiftAssignmentId: string,
    newEndDate: Date,
    currentUserId: string,
  ) {
    const message = `Shift assignment ${shiftAssignmentId} has been renewed. New end date: ${newEndDate.toISOString().split('T')[0]}.`;
    
    const notification = await this.notificationLogModel.create({
      to: new Types.ObjectId(recipientId),
      type: NotificationType.SHIFT_RENEWAL_CONFIRMATION,
      message,
    });
    
    return notification;
  }

  /**
   * Send archive notification
   * Sent when a shift assignment is archived/expired
   */
  async sendShiftArchiveNotification(
    recipientId: string,
    shiftAssignmentId: string,
    employeeId: string,
    currentUserId: string,
  ) {
    const message = `Shift assignment ${shiftAssignmentId} for employee ${employeeId} has been archived/expired. Consider creating a new assignment if needed.`;
    
    const notification = await this.notificationLogModel.create({
      to: new Types.ObjectId(recipientId),
      type: NotificationType.SHIFT_ARCHIVE_NOTIFICATION,
      message,
    });
    
    return notification;
  }

  /**
   * Get all shift-related notifications (expiry, renewal, archive)
   */
  async getAllShiftNotifications(hrAdminId: string) {
    const notifications = await this.notificationLogModel
      .find({
        to: new Types.ObjectId(hrAdminId),
        type: {
          $in: [
            NotificationType.SHIFT_EXPIRY_ALERT,
            NotificationType.SHIFT_EXPIRY_BULK_ALERT,
            NotificationType.SHIFT_RENEWAL_CONFIRMATION,
            NotificationType.SHIFT_ARCHIVE_NOTIFICATION,
          ],
        },
      })
      .sort({ createdAt: -1 })
      .exec();
    
    // Group by type for better organization
    const grouped = {
      expiryAlerts: notifications.filter(n => 
        n.type === NotificationType.SHIFT_EXPIRY_ALERT || n.type === NotificationType.SHIFT_EXPIRY_BULK_ALERT
      ),
      renewalConfirmations: notifications.filter(n => 
        n.type === NotificationType.SHIFT_RENEWAL_CONFIRMATION
      ),
      archiveNotifications: notifications.filter(n => 
        n.type === NotificationType.SHIFT_ARCHIVE_NOTIFICATION
      ),
    };
    
    return {
      totalCount: notifications.length,
      grouped,
      all: notifications,
    };
  }

  /**
   * REQ: Missed punches/late sign-ins must be handled via auto-flagging, notifications, or payroll blocking.
   * Send missed punch alert to employee
   */
  async sendMissedPunchAlertToEmployee(
    employeeId: string,
    attendanceRecordId: string,
    missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT',
    date: Date,
    currentUserId: string,
  ) {
    const message = `Missed ${missedPunchType === 'CLOCK_IN' ? 'clock-in' : 'clock-out'} detected on ${date.toISOString().split('T')[0]}. Please submit a correction request.`;
    
    const notification = await this.notificationLogModel.create({
      to: new Types.ObjectId(employeeId),
      type: NotificationType.MISSED_PUNCH_EMPLOYEE_ALERT,
      message,
    });
    
    return notification;
  }

  /**
   * Send missed punch alert to manager/line manager
   */
  async sendMissedPunchAlertToManager(
    managerId: string,
    employeeId: string,
    employeeName: string,
    attendanceRecordId: string,
    missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT',
    date: Date,
    currentUserId: string,
  ) {
    const message = `Employee ${employeeName} (${employeeId}) has a missed ${missedPunchType === 'CLOCK_IN' ? 'clock-in' : 'clock-out'} on ${date.toISOString().split('T')[0]}. Pending correction review.`;
    
    const notification = await this.notificationLogModel.create({
      to: new Types.ObjectId(managerId),
      type: NotificationType.MISSED_PUNCH_MANAGER_ALERT,
      message,
    });
    
    return notification;
  }

  /**
   * Send bulk missed punch alerts
   */
  async sendBulkMissedPunchAlerts(
    alerts: Array<{
      employeeId: string;
      managerId?: string;
      employeeName?: string;
      attendanceRecordId: string;
      missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT';
      date: Date;
    }>,
    currentUserId: string,
  ) {
    const notifications: any[] = [];
    
    for (const alert of alerts) {
      // Send to employee
      const employeeNotification = await this.sendMissedPunchAlertToEmployee(
        alert.employeeId,
        alert.attendanceRecordId,
        alert.missedPunchType,
        alert.date,
        currentUserId,
      );
      notifications.push({ type: 'employee', notification: employeeNotification });
      
      // Send to manager if provided
      if (alert.managerId) {
        const managerNotification = await this.sendMissedPunchAlertToManager(
          alert.managerId,
          alert.employeeId,
          alert.employeeName || 'Unknown Employee',
          alert.attendanceRecordId,
          alert.missedPunchType,
          alert.date,
          currentUserId,
        );
        notifications.push({ type: 'manager', notification: managerNotification });
      }
    }
    
    return {
      alertsProcessed: alerts.length,
      notificationsSent: notifications.length,
      notifications,
    };
  }

  /**
   * Get missed punch notifications for an employee
   */
  async getMissedPunchNotificationsByEmployee(employeeId: string) {
    const notifications = await this.notificationLogModel
      .find({
        to: new Types.ObjectId(employeeId),
        type: NotificationType.MISSED_PUNCH_EMPLOYEE_ALERT,
      })
      .sort({ createdAt: -1 })
      .exec();
    
    return {
      count: notifications.length,
      notifications,
    };
  }

  /**
   * Get missed punch notifications for a manager
   */
  async getMissedPunchNotificationsByManager(managerId: string) {
    const notifications = await this.notificationLogModel
      .find({
        to: new Types.ObjectId(managerId),
        type: NotificationType.MISSED_PUNCH_MANAGER_ALERT,
      })
      .sort({ createdAt: -1 })
      .exec();
    
    return {
      count: notifications.length,
      notifications,
    };
  }

  /**
   * Get all missed punch notifications (for HR Admin)
   */
  async getAllMissedPunchNotifications(
    filters: { startDate?: Date; endDate?: Date },
  ) {
    const query: any = {
      type: { $in: [NotificationType.MISSED_PUNCH_EMPLOYEE_ALERT, NotificationType.MISSED_PUNCH_MANAGER_ALERT] },
    };
    
    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: filters.startDate,
        $lte: filters.endDate,
      };
    }
    
    const notifications = await this.notificationLogModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
    
    // Group by type
    const employeeAlerts = notifications.filter(n => n.type === NotificationType.MISSED_PUNCH_EMPLOYEE_ALERT);
    const managerAlerts = notifications.filter(n => n.type === NotificationType.MISSED_PUNCH_MANAGER_ALERT);
    
    return {
      total: notifications.length,
      employeeAlerts: {
        count: employeeAlerts.length,
        notifications: employeeAlerts,
      },
      managerAlerts: {
        count: managerAlerts.length,
        notifications: managerAlerts,
      },
    };
  }

  /**
   * Legacy method for backward compatibility
   * REQ: As an HR Admin, I want to be notified when a shift assignment is nearing expiry 
   * so that schedules can be renewed or reassigned.
   */
  async notifyShiftAssignmentExpiry(
    shiftAssignmentId: string,
    hrAdminId: string,
    employeeDetails: any,
    expiryDate: Date,
  ) {
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );

    return this.sendShiftExpiryNotification(
      hrAdminId,
      shiftAssignmentId,
      employeeDetails.employeeId || employeeDetails.id,
      expiryDate,
      daysUntilExpiry,
      hrAdminId, // Using hrAdminId as currentUserId for legacy calls
    );
  }

  /**
   * Legacy method for backward compatibility
   * REQ: Missed punches/late sign-ins must be handled via auto-flagging, notifications, or payroll blocking.
   */
  async notifyMissedPunch(
    employeeId: string,
    managerId: string,
    coordinatorId: string,
    attendanceDetails: any,
  ) {
    const date = attendanceDetails.date ? new Date(attendanceDetails.date) : new Date();
    const missedPunchType = attendanceDetails.missedPunchType || 'CLOCK_IN';
    
    const notifications = [];

    // Notify Employee
    notifications.push(
      this.sendMissedPunchAlertToEmployee(
        employeeId,
        attendanceDetails.attendanceRecordId || '',
        missedPunchType,
        date,
        coordinatorId,
      ),
    );

    // Notify Manager
    notifications.push(
      this.sendMissedPunchAlertToManager(
        managerId,
        employeeId,
        attendanceDetails.employeeName || 'Employee',
        attendanceDetails.attendanceRecordId || '',
        missedPunchType,
        date,
        coordinatorId,
      ),
    );

    await Promise.all(notifications);
    return { success: true, notificationsCreated: 2 };
  }

  // ===== COMMON NOTIFICATION METHODS =====

  /**
   * Get all notifications for a specific user
   * Fetches from both unified notifications and time-management shift expiry notifications
   * Both are stored in the same NotificationLog collection
   */
  async getUserNotifications(userId: string) {
    try {
      console.log('Fetching notifications for user:', userId);
      const userObjectId = new Types.ObjectId(userId);

      // Fetch ALL notifications for the user (both unified and shift expiry)
      // The same NotificationLog model is used by both modules
      const allNotifications = await this.notificationLogModel
        .find({ to: userObjectId })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      console.log(`Found ${allNotifications.length} notifications for user ${userId}`);

      // Ensure isRead field is always present (default to false if not set)
      const transformed = allNotifications.map((notif: any) => ({
        ...notif,
        isRead: notif.isRead ?? false,
        _id: notif._id?.toString() || notif._id,
        to: notif.to?.toString() || notif.to,
      }));

      return transformed;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string) {
    return this.notificationLogModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string) {
    return this.notificationLogModel.findByIdAndDelete(notificationId);
  }

  /**
   * TEST FUNCTION: Create a test notification for development
   * Remove before production
   */
  async createTestNotification(userId: string) {
    try {
      const testNotification = await this.notificationLogModel.create({
        to: new Types.ObjectId(userId),
        type: NotificationType.LEAVE_CREATED,
        message: 'This is a test notification. New leave request from John Doe (Dec 15-20) awaiting your review',
      });
      return testNotification;
    } catch (error) {
      console.error('Failed to create test notification:', error);
      throw error;
    }
  }

  /**
   * Scheduled task: Automatically create shift expiry notifications daily
   * Runs every day at 9:00 AM
   * This ensures HR admins are notified of shifts expiring within 7 days
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleShiftExpiryNotifications() {
    try {
      console.log('[SCHEDULED TASK] Running shift expiry notification check...');

      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setUTCDate(expiryDate.getUTCDate() + 7); // Default 7 days

      // Convert to UTC end of day for proper comparison
      const expiryDateUTC = new Date(expiryDate);
      expiryDateUTC.setUTCHours(23, 59, 59, 999);

      const nowUTC = new Date(now);
      nowUTC.setUTCHours(0, 0, 0, 0);

      // Get expiring shift assignments
      const expiringAssignments = await this.shiftAssignmentModel
        .find({
          endDate: { $lte: expiryDateUTC, $gte: nowUTC },
          status: 'APPROVED',
        })
        .populate('employeeId', 'firstName lastName email employeeNumber')
        .populate('shiftId', 'name startTime endTime')
        .populate('departmentId', 'name')
        .populate('positionId', 'name')
        .exec();

      if (!expiringAssignments || expiringAssignments.length === 0) {
        console.log('[SCHEDULED TASK] No expiring shift assignments found');
        return;
      }

      console.log(
        `[SCHEDULED TASK] Found ${expiringAssignments.length} expiring shift assignments`,
      );

      // Get all HR ADMIN users
      const hrAdmins = await this.employeeProfileModel
        .find({
          systemRole: { $in: ['HR_ADMIN', 'SYSTEM_ADMIN'] },
          active: true,
        })
        .select('_id firstName lastName')
        .exec();

      if (!hrAdmins || hrAdmins.length === 0) {
        console.log('[SCHEDULED TASK] No HR admins found to notify');
        return;
      }

      console.log(
        `[SCHEDULED TASK] Notifying ${hrAdmins.length} HR admins about expiring shifts`,
      );

      // Create notifications for each HR admin for each expiring assignment
      const hrAdminIds = hrAdmins.map((admin: any) => admin._id.toString());
      const notifications = [];

      for (const hrAdmin of hrAdmins) {
        for (const assignment of expiringAssignments) {
          const daysRemaining = Math.ceil(
            (new Date(assignment.endDate).getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24),
          );

          const employeeName =
            assignment.employeeId && assignment.employeeId.firstName
              ? `${assignment.employeeId.firstName} ${assignment.employeeId.lastName || ''}`.trim()
              : 'Unknown Employee';

          const shiftName =
            assignment.shiftId && assignment.shiftId.name
              ? assignment.shiftId.name
              : 'Unknown Shift';

          const notification = {
            recipientId: hrAdmin._id.toString(),
            type: NotificationType.SHIFT_EXPIRY_ALERT,
            message: `Shift assignment for ${employeeName} on shift "${shiftName}" expires in ${daysRemaining} days`,
            title: `Shift Expiry Alert - ${daysRemaining} days remaining`,
            data: {
              assignmentId: assignment._id.toString(),
              employeeId: assignment.employeeId?._id?.toString() || '',
              employeeName: employeeName,
              shiftName: shiftName,
              endDate: assignment.endDate?.toISOString() || '',
              daysRemaining: daysRemaining,
              urgency: daysRemaining <= 2 ? 'HIGH' : daysRemaining <= 4 ? 'MEDIUM' : 'LOW',
            },
            isRead: false,
            createdAt: new Date(),
          };

          notifications.push(notification);
        }
      }

      if (notifications.length > 0) {
        await this.notificationLogModel.insertMany(notifications);
        console.log(
          `[SCHEDULED TASK] Successfully created ${notifications.length} notifications`,
        );
      }
    } catch (error) {
      console.error('[SCHEDULED TASK] Error in shift expiry notification:', error);
      // Don't throw - let the scheduled task continue even if it fails
    }
  }

  /**
   * Helper method to map status to notification type
   */
  private mapStatusToNotificationType(
    status: string,
  ): string {
    const statusMap = {
      APPROVED: NotificationType.LEAVE_APPROVED,
      REJECTED: NotificationType.LEAVE_REJECTED,
      RETURNED_FOR_CORRECTION: NotificationType.LEAVE_RETURNED_FOR_CORRECTION,
      MODIFIED: NotificationType.LEAVE_MODIFIED,
    };
    return statusMap[status] || NotificationType.LEAVE_MODIFIED;
  }

  // ===== RECRUITMENT MODULE NOTIFICATIONS =====

  // =============================================================================
  // RECRUITMENT SUBSYSTEM - INTERVIEW NOTIFICATIONS
  // =============================================================================
  //
  // This section handles all notifications related to interviews in the
  // recruitment workflow. The interview notification flow is:
  //
  // 1. HR schedules interview with panel members
  // 2. ALL panel members receive in-app notification with interview details
  // 3. Candidate receives in-app notification about scheduled interview
  // 4. If interview is cancelled → All parties notified
  // 5. If interview is rescheduled → All parties notified with new date
  //
  // Notification Types Used:
  // - INTERVIEW_PANEL_INVITATION: Sent to panel members when assigned
  // - INTERVIEW_SCHEDULED: Sent to candidate when interview is scheduled
  // - INTERVIEW_CANCELLED: Sent to panel members when interview cancelled
  // - INTERVIEW_RESCHEDULED: Sent to panel members when date changes
  //
  // =============================================================================

  /**
   * RECRUITMENT SUBSYSTEM: Notify Panel Members about Interview Assignment
   * 
   * Purpose: Inform all panel members that they have been assigned to conduct
   * an interview. Each panel member receives full interview details.
   * 
   * Called by: scheduleInterview() in RecruitmentService
   * 
   * Flow:
   * HR schedules interview → scheduleInterview() → notifyInterviewPanelMembers()
   *                                                          ↓
   *                                              Each panel member gets notification
   *                                              with candidate name, position, date, etc.
   * 
   * @param panelMemberIds - Array of user IDs (ObjectId strings) for panel members
   * @param interviewDetails - Object containing:
   *   - interviewId: MongoDB ObjectId of the interview
   *   - candidateName: Full name of candidate to interview
   *   - positionTitle: Job title being interviewed for
   *   - scheduledDate: Date and time of interview
   *   - method: Interview method (video, onsite, phone)
   *   - videoLink: (optional) Video call link if method is video
   *   - stage: Interview stage (screening, department_interview, hr_interview)
   * @returns Object with success status and count of notifications created
   */
  async notifyInterviewPanelMembers(
    panelMemberIds: string[],
    interviewDetails: {
      interviewId: string;
      candidateName: string;
      positionTitle: string;
      scheduledDate: Date;
      method: string;
      videoLink?: string;
      stage: string;
    },
  ) {
    if (!panelMemberIds || panelMemberIds.length === 0) {
      console.log('[INTERVIEW_NOTIFICATION] No panel members to notify');
      return { success: true, notificationsCreated: 0 };
    }

    const notifications: any[] = [];
    const formattedDate = interviewDetails.scheduledDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const methodText = interviewDetails.method || 'TBD';
    const videoLinkText = interviewDetails.videoLink 
      ? `\nVideo Link: ${interviewDetails.videoLink}` 
      : '';

    for (const panelMemberId of panelMemberIds) {
      try {
        const message = `You have been assigned as an interview panel member.\n\n` +
          `📋 Interview Details:\n` +
          `• Candidate: ${interviewDetails.candidateName}\n` +
          `• Position: ${interviewDetails.positionTitle}\n` +
          `• Stage: ${interviewDetails.stage}\n` +
          `• Date & Time: ${formattedDate}\n` +
          `• Method: ${methodText}${videoLinkText}\n\n` +
          `Please review the candidate's profile and prepare for the interview.`;

        const notification = await this.notificationLogModel.create({
          to: new Types.ObjectId(panelMemberId),
          type: NotificationType.INTERVIEW_PANEL_INVITATION,
          message: message,
          data: {
            interviewId: interviewDetails.interviewId,
            candidateName: interviewDetails.candidateName,
            positionTitle: interviewDetails.positionTitle,
            scheduledDate: interviewDetails.scheduledDate.toISOString(),
            method: interviewDetails.method,
            videoLink: interviewDetails.videoLink,
            stage: interviewDetails.stage,
          },
          isRead: false,
        });

        notifications.push(notification);
        console.log(`[INTERVIEW_NOTIFICATION] Sent notification to panel member: ${panelMemberId}`);
      } catch (error) {
        console.error(`[INTERVIEW_NOTIFICATION] Failed to notify panel member ${panelMemberId}:`, error);
        // Continue with other notifications even if one fails
      }
    }

    console.log(`[INTERVIEW_NOTIFICATION] Successfully created ${notifications.length} notifications for panel members`);
    
    return {
      success: true,
      notificationsCreated: notifications.length,
      notifications,
    };
  }

  /**
   * RECRUITMENT SUBSYSTEM: Notify Panel Members about Interview Cancellation
   * 
   * Purpose: Inform all panel members when an interview they were assigned to
   * has been cancelled. Frees up their time and keeps them informed.
   * 
   * Called by: cancelInterview() or updateInterviewStatus() when status = 'cancelled'
   * 
   * Flow:
   * Interview cancelled → notifyInterviewCancelled()
   *                              ↓
   *                  All panel members notified
   *                  "Interview cancelled for [candidate]"
   * 
   * @param panelMemberIds - Array of user IDs (ObjectId strings) for panel members
   * @param interviewDetails - Object containing:
   *   - candidateName: Full name of candidate
   *   - positionTitle: Job title
   *   - originalDate: Originally scheduled date/time
   * @returns Object with success status and count of notifications created
   */
  async notifyInterviewCancelled(
    panelMemberIds: string[],
    interviewDetails: {
      candidateName: string;
      positionTitle: string;
      originalDate: Date;
    },
  ) {
    if (!panelMemberIds || panelMemberIds.length === 0) {
      return { success: true, notificationsCreated: 0 };
    }

    const notifications: any[] = [];
    const formattedDate = interviewDetails.originalDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    for (const panelMemberId of panelMemberIds) {
      try {
        const message = `An interview you were assigned to has been cancelled.\n\n` +
          `• Candidate: ${interviewDetails.candidateName}\n` +
          `• Position: ${interviewDetails.positionTitle}\n` +
          `• Originally Scheduled: ${formattedDate}`;

        const notification = await this.notificationLogModel.create({
          to: new Types.ObjectId(panelMemberId),
          type: NotificationType.INTERVIEW_CANCELLED,
          message: message,
          isRead: false,
        });

        notifications.push(notification);
      } catch (error) {
        console.error(`[INTERVIEW_NOTIFICATION] Failed to notify panel member ${panelMemberId} about cancellation:`, error);
      }
    }

    return {
      success: true,
      notificationsCreated: notifications.length,
    };
  }

  /**
   * RECRUITMENT SUBSYSTEM: Notify Panel Members about Interview Reschedule
   * 
   * Purpose: Inform all panel members when an interview has been rescheduled
   * to a new date/time. Shows both old and new dates for clarity.
   * 
   * Called by: rescheduleInterview() or when interview date is updated
   * 
   * Flow:
   * Interview rescheduled → notifyInterviewRescheduled()
   *                                    ↓
   *                        All panel members notified
   *                        "Interview moved from [old] to [new]"
   * 
   * @param panelMemberIds - Array of user IDs (ObjectId strings) for panel members
   * @param interviewDetails - Object containing:
   *   - interviewId: MongoDB ObjectId of the interview
   *   - candidateName: Full name of candidate
   *   - positionTitle: Job title
   *   - oldDate: Previous scheduled date/time
   *   - newDate: New scheduled date/time
   *   - method: Interview method
   *   - videoLink: (optional) Video call link
   * @returns Object with success status and count of notifications created
   */
  async notifyInterviewRescheduled(
    panelMemberIds: string[],
    interviewDetails: {
      interviewId: string;
      candidateName: string;
      positionTitle: string;
      oldDate: Date;
      newDate: Date;
      method: string;
      videoLink?: string;
    },
  ) {
    if (!panelMemberIds || panelMemberIds.length === 0) {
      return { success: true, notificationsCreated: 0 };
    }

    const notifications: any[] = [];
    const oldFormattedDate = interviewDetails.oldDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newFormattedDate = interviewDetails.newDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    for (const panelMemberId of panelMemberIds) {
      try {
        const message = `An interview you are assigned to has been rescheduled.\n\n` +
          `• Candidate: ${interviewDetails.candidateName}\n` +
          `• Position: ${interviewDetails.positionTitle}\n` +
          `• Previous Date: ${oldFormattedDate}\n` +
          `• New Date: ${newFormattedDate}\n` +
          `• Method: ${interviewDetails.method}` +
          (interviewDetails.videoLink ? `\n• Video Link: ${interviewDetails.videoLink}` : '');

        const notification = await this.notificationLogModel.create({
          to: new Types.ObjectId(panelMemberId),
          type: NotificationType.INTERVIEW_RESCHEDULED,
          message: message,
          data: {
            interviewId: interviewDetails.interviewId,
            candidateName: interviewDetails.candidateName,
            positionTitle: interviewDetails.positionTitle,
            oldDate: interviewDetails.oldDate.toISOString(),
            newDate: interviewDetails.newDate.toISOString(),
            method: interviewDetails.method,
            videoLink: interviewDetails.videoLink,
          },
          isRead: false,
        });

        notifications.push(notification);
      } catch (error) {
        console.error(`[INTERVIEW_NOTIFICATION] Failed to notify panel member ${panelMemberId} about reschedule:`, error);
      }
    }

    return {
      success: true,
      notificationsCreated: notifications.length,
    };
  }

  /**
   * RECRUITMENT SUBSYSTEM: Get Interview Notifications for User
   * 
   * Purpose: Retrieve all interview-related notifications for a specific user.
   * Used by the frontend to display interview notifications separately.
   * 
   * @param userId - MongoDB ObjectId string of the user
   * @returns Object with count and array of interview notifications
   */
  async getInterviewNotifications(userId: string) {
    const notifications = await this.notificationLogModel
      .find({
        to: new Types.ObjectId(userId),
        type: {
          $in: [
            NotificationType.INTERVIEW_PANEL_INVITATION,
            NotificationType.INTERVIEW_SCHEDULED,
            NotificationType.INTERVIEW_CANCELLED,
            NotificationType.INTERVIEW_RESCHEDULED,
          ],
        },
      })
      .sort({ createdAt: -1 })
      .exec();

    return {
      count: notifications.length,
      notifications,
    };
  }

  /**
   * RECRUITMENT SUBSYSTEM: Notify Candidate about Scheduled Interview
   * 
   * Purpose: Inform the candidate that their interview has been scheduled.
   * Provides all details they need to prepare and attend.
   * 
   * Called by: scheduleInterview() in RecruitmentService
   * 
   * Flow:
   * HR schedules interview → scheduleInterview() → notifyCandidateInterviewScheduled()
   *                                                            ↓
   *                                                Candidate sees notification
   *                                                "Your interview is scheduled!"
   * 
   * Note: An interview email is also sent separately via sendNotification()
   * 
   * @param candidateId - MongoDB ObjectId string of the candidate
   * @param interviewDetails - Object containing:
   *   - interviewId: MongoDB ObjectId of the interview
   *   - positionTitle: Job title being interviewed for
   *   - scheduledDate: Date and time of interview
   *   - method: Interview method (video, onsite, phone)
   *   - videoLink: (optional) Video call link
   *   - stage: Interview stage
   * @returns Object with success status and notification object
   */
  async notifyCandidateInterviewScheduled(
    candidateId: string,
    interviewDetails: {
      interviewId: string;
      positionTitle: string;
      scheduledDate: Date;
      method: string;
      videoLink?: string;
      stage: string;
    },
  ) {
    if (!candidateId) {
      console.log('[INTERVIEW_NOTIFICATION] No candidate ID provided');
      return { success: false, message: 'No candidate ID provided' };
    }

    try {
      const formattedDate = interviewDetails.scheduledDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const methodText = interviewDetails.method || 'TBD';
      const videoLinkText = interviewDetails.videoLink 
        ? `\n• Video Link: ${interviewDetails.videoLink}` 
        : '';

      const message = `🎉 Great news! Your interview has been scheduled.\n\n` +
        `📋 Interview Details:\n` +
        `• Position: ${interviewDetails.positionTitle}\n` +
        `• Stage: ${interviewDetails.stage}\n` +
        `• Date & Time: ${formattedDate}\n` +
        `• Method: ${methodText}${videoLinkText}\n\n` +
        `Please make sure to be available at the scheduled time. Good luck!`;

      const notification = await this.notificationLogModel.create({
        to: new Types.ObjectId(candidateId),
        type: NotificationType.INTERVIEW_SCHEDULED,
        message: message,
        data: {
          interviewId: interviewDetails.interviewId,
          positionTitle: interviewDetails.positionTitle,
          scheduledDate: interviewDetails.scheduledDate.toISOString(),
          method: interviewDetails.method,
          videoLink: interviewDetails.videoLink,
          stage: interviewDetails.stage,
        },
        isRead: false,
      });

      console.log(`[INTERVIEW_NOTIFICATION] Sent interview scheduled notification to candidate: ${candidateId}`);
      
      return {
        success: true,
        notification,
      };
    } catch (error) {
      console.error(`[INTERVIEW_NOTIFICATION] Failed to notify candidate ${candidateId}:`, error);
      return { success: false, error };
    }
  }

  // =============================================================================
  // RECRUITMENT SUBSYSTEM - HIRING DECISION NOTIFICATIONS
  // =============================================================================
  //
  // This section handles all notifications related to hiring decisions in the
  // recruitment workflow. The flow is as follows:
  //
  // 1. HR EMPLOYEE schedules interview and submits feedback (score + comments)
  // 2. When ALL panel members submit feedback → Interview status = 'completed'
  // 3. Application with completed interview appears in HR MANAGER's "Job Offers" page
  // 4. HR MANAGER reviews feedback and either:
  //    a) ACCEPTS → Creates offer → Candidate accepts → HR Manager finalizes → HIRED
  //    b) REJECTS → Application status = REJECTED
  // 5. Upon hiring/rejection:
  //    - All HR Employees receive in-app notification
  //    - Candidate receives in-app notification + email
  //    - HR Employee can track in "Candidate Tracking" page
  //
  // Notification Types Used:
  // - CANDIDATE_HIRED: Sent to HR Employees when candidate is hired
  // - CANDIDATE_REJECTED: Sent to HR Employees when candidate is rejected
  // - APPLICATION_ACCEPTED: Sent to candidate when hired
  // - APPLICATION_REJECTED: Sent to candidate when rejected
  //
  // =============================================================================

  /**
   * RECRUITMENT SUBSYSTEM: Notify HR Employees about Hiring
   * 
   * Purpose: Inform all HR Employees when a candidate has been successfully hired
   * so they can proceed with onboarding preparation.
   * 
   * Called by: 
   * - finalizeOffer() when offer is APPROVED and candidate ACCEPTED
   * - updateApplicationStatus() when status changes to HIRED
   * 
   * Flow:
   * HR Manager approves offer → finalizeOffer() → notifyHREmployeesCandidateHired()
   *                                                        ↓
   *                                            All HR Employees get notification
   *                                                        ↓
   *                                            HR Employee sees in "Candidate Tracking"
   * 
   * @param hrEmployeeIds - Array of HR Employee user IDs to notify
   * @param hiringDetails - Object containing:
   *   - candidateName: Full name of the hired candidate
   *   - candidateId: MongoDB ObjectId of the candidate
   *   - positionTitle: Job title the candidate was hired for
   *   - applicationId: MongoDB ObjectId of the application
   *   - offerId: (optional) MongoDB ObjectId of the offer
   * @returns Object with success status and count of notifications created
   */
  async notifyHREmployeesCandidateHired(
    hrEmployeeIds: string[],
    hiringDetails: {
      candidateName: string;
      candidateId: string;
      positionTitle: string;
      applicationId: string;
      offerId?: string;
    },
  ) {
    // Early return if no HR Employees to notify
    if (!hrEmployeeIds || hrEmployeeIds.length === 0) {
      console.log('[HIRING_NOTIFICATION] No HR Employees to notify about hiring');
      return { success: true, notificationsCreated: 0 };
    }

    const notifications: any[] = [];

    // Create notification for each HR Employee
    for (const hrEmployeeId of hrEmployeeIds) {
      try {
        // Build notification message with hiring details and next steps
        const message = `🎉 A candidate has been HIRED!\n\n` +
          `📋 Hiring Details:\n` +
          `• Candidate: ${hiringDetails.candidateName}\n` +
          `• Position: ${hiringDetails.positionTitle}\n\n` +
          `Next Steps:\n` +
          `• Send the acceptance letter to the candidate\n` +
          `• Prepare onboarding documents\n` +
          `• Track the candidate in "Candidate Tracking"`;

        // Create notification in database
        const notification = await this.notificationLogModel.create({
          to: new Types.ObjectId(hrEmployeeId),
          type: NotificationType.CANDIDATE_HIRED,
          message: message,
          // Store structured data for frontend use (e.g., linking to application)
          data: {
            candidateName: hiringDetails.candidateName,
            candidateId: hiringDetails.candidateId,
            positionTitle: hiringDetails.positionTitle,
            applicationId: hiringDetails.applicationId,
            offerId: hiringDetails.offerId,
            action: 'HIRED',
          },
          isRead: false,
        });

        notifications.push(notification);
        console.log(`[HIRING_NOTIFICATION] Sent HIRED notification to HR Employee: ${hrEmployeeId}`);
      } catch (error) {
        // Log error but continue with other notifications
        console.error(`[HIRING_NOTIFICATION] Failed to notify HR Employee ${hrEmployeeId}:`, error);
      }
    }

    return {
      success: true,
      notificationsCreated: notifications.length,
    };
  }

  /**
   * RECRUITMENT SUBSYSTEM: Notify HR Employees about Rejection
   * 
   * Purpose: Inform all HR Employees when a candidate has been rejected
   * so they can update their tracking and send rejection communication.
   * 
   * Called by:
   * - finalizeOffer() when offer is REJECTED
   * - updateApplicationStatus() when status changes to REJECTED
   * 
   * Flow:
   * HR Manager rejects application/offer → notifyHREmployeesCandidateRejected()
   *                                                  ↓
   *                                      All HR Employees get notification
   *                                                  ↓
   *                                      HR Employee sees in "Candidate Tracking"
   *                                      with status = REJECTED
   * 
   * @param hrEmployeeIds - Array of HR Employee user IDs to notify
   * @param rejectionDetails - Object containing:
   *   - candidateName: Full name of the rejected candidate
   *   - candidateId: MongoDB ObjectId of the candidate
   *   - positionTitle: Job title the candidate applied for
   *   - applicationId: MongoDB ObjectId of the application
   *   - rejectionReason: (optional) Reason provided by HR Manager
   * @returns Object with success status and count of notifications created
   */
  async notifyHREmployeesCandidateRejected(
    hrEmployeeIds: string[],
    rejectionDetails: {
      candidateName: string;
      candidateId: string;
      positionTitle: string;
      applicationId: string;
      rejectionReason?: string;
    },
  ) {
    // Early return if no HR Employees to notify
    if (!hrEmployeeIds || hrEmployeeIds.length === 0) {
      console.log('[HIRING_NOTIFICATION] No HR Employees to notify about rejection');
      return { success: true, notificationsCreated: 0 };
    }

    const notifications: any[] = [];

    // Create notification for each HR Employee
    for (const hrEmployeeId of hrEmployeeIds) {
      try {
        // Build notification message with rejection details
        const message = `❌ A candidate has been REJECTED.\n\n` +
          `📋 Details:\n` +
          `• Candidate: ${rejectionDetails.candidateName}\n` +
          `• Position: ${rejectionDetails.positionTitle}\n` +
          (rejectionDetails.rejectionReason ? `• Reason: ${rejectionDetails.rejectionReason}\n` : '') +
          `\nThe rejection notification has been sent to the candidate.`;

        // Create notification in database
        const notification = await this.notificationLogModel.create({
          to: new Types.ObjectId(hrEmployeeId),
          type: NotificationType.CANDIDATE_REJECTED,
          message: message,
          // Store structured data for frontend use
          data: {
            candidateName: rejectionDetails.candidateName,
            candidateId: rejectionDetails.candidateId,
            positionTitle: rejectionDetails.positionTitle,
            applicationId: rejectionDetails.applicationId,
            rejectionReason: rejectionDetails.rejectionReason,
            action: 'REJECTED',
          },
          isRead: false,
        });

        notifications.push(notification);
        console.log(`[HIRING_NOTIFICATION] Sent REJECTED notification to HR Employee: ${hrEmployeeId}`);
      } catch (error) {
        // Log error but continue with other notifications
        console.error(`[HIRING_NOTIFICATION] Failed to notify HR Employee ${hrEmployeeId}:`, error);
      }
    }

    return {
      success: true,
      notificationsCreated: notifications.length,
    };
  }

  /**
   * RECRUITMENT SUBSYSTEM: Notify Candidate about Acceptance (Hiring)
   * 
   * Purpose: Send an in-app notification to the candidate informing them
   * they have been hired. This is in addition to the email notification.
   * 
   * Called by:
   * - finalizeOffer() when offer is APPROVED and candidate ACCEPTED
   * - updateApplicationStatus() when status changes to HIRED
   * 
   * Flow:
   * HR Manager approves offer → notifyCandidateAccepted()
   *                                      ↓
   *                          Candidate sees notification in app
   *                          "Congratulations! You've been HIRED!"
   * 
   * Note: An acceptance EMAIL is also sent separately via sendNotification()
   * 
   * @param candidateId - MongoDB ObjectId of the candidate
   * @param acceptanceDetails - Object containing:
   *   - positionTitle: Job title the candidate was hired for
   *   - applicationId: MongoDB ObjectId of the application
   * @returns Object with success status and notification object
   */
  async notifyCandidateAccepted(
    candidateId: string,
    acceptanceDetails: {
      positionTitle: string;
      applicationId: string;
    },
  ) {
    // Validate candidate ID
    if (!candidateId) {
      return { success: false, message: 'No candidate ID provided' };
    }

    try {
      // Build congratulatory message
      const message = `🎉 Congratulations! You have been HIRED!\n\n` +
        `We are delighted to inform you that your application for ${acceptanceDetails.positionTitle} has been successful.\n\n` +
        `You will receive your official acceptance letter and onboarding details shortly.\n\n` +
        `Welcome to the team!`;

      // Create notification in database
      const notification = await this.notificationLogModel.create({
        to: new Types.ObjectId(candidateId),
        type: NotificationType.APPLICATION_ACCEPTED,
        message: message,
        // Store structured data for frontend use
        data: {
          positionTitle: acceptanceDetails.positionTitle,
          applicationId: acceptanceDetails.applicationId,
          action: 'ACCEPTED',
        },
        isRead: false,
      });

      console.log(`[HIRING_NOTIFICATION] Sent ACCEPTED notification to candidate: ${candidateId}`);
      
      return {
        success: true,
        notification,
      };
    } catch (error) {
      console.error(`[HIRING_NOTIFICATION] Failed to notify candidate ${candidateId}:`, error);
      return { success: false, error };
    }
  }

  /**
   * RECRUITMENT SUBSYSTEM: Notify Candidate about Rejection
   * 
   * Purpose: Send an in-app notification to the candidate informing them
   * their application has been rejected. This is in addition to the email.
   * 
   * Called by:
   * - finalizeOffer() when offer is REJECTED
   * - updateApplicationStatus() when status changes to REJECTED
   * 
   * Flow:
   * HR Manager rejects application → notifyCandidateRejected()
   *                                          ↓
   *                              Candidate sees notification in app
   *                              "Thank you for applying..."
   * 
   * Note: A rejection EMAIL is also sent separately via sendNotification()
   * 
   * @param candidateId - MongoDB ObjectId of the candidate
   * @param rejectionDetails - Object containing:
   *   - positionTitle: Job title the candidate applied for
   *   - applicationId: MongoDB ObjectId of the application
   *   - rejectionReason: (optional) Feedback from HR Manager
   * @returns Object with success status and notification object
   */
  async notifyCandidateRejected(
    candidateId: string,
    rejectionDetails: {
      positionTitle: string;
      applicationId: string;
      rejectionReason?: string;
    },
  ) {
    // Validate candidate ID
    if (!candidateId) {
      return { success: false, message: 'No candidate ID provided' };
    }

    try {
      // Build professional rejection message
      let message = `Thank you for your interest in the ${rejectionDetails.positionTitle} position.\n\n` +
        `After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\n`;
      
      // Include rejection reason/feedback if provided
      if (rejectionDetails.rejectionReason) {
        message += `Feedback: ${rejectionDetails.rejectionReason}\n\n`;
      }
      
      message += `We appreciate the time you invested in the application process and wish you the best in your job search.`;

      // Create notification in database
      const notification = await this.notificationLogModel.create({
        to: new Types.ObjectId(candidateId),
        type: NotificationType.APPLICATION_REJECTED,
        message: message,
        // Store structured data for frontend use
        data: {
          positionTitle: rejectionDetails.positionTitle,
          applicationId: rejectionDetails.applicationId,
          rejectionReason: rejectionDetails.rejectionReason,
          action: 'REJECTED',
        },
        isRead: false,
      });

      console.log(`[HIRING_NOTIFICATION] Sent REJECTED notification to candidate: ${candidateId}`);
      
      return {
        success: true,
        notification,
      };
    } catch (error) {
      console.error(`[HIRING_NOTIFICATION] Failed to notify candidate ${candidateId}:`, error);
      return { success: false, error };
    }
  }

  // =============================================================================
  // RECRUITMENT SUBSYSTEM - OFFER NOTIFICATIONS
  // =============================================================================
  //
  // This section handles notifications for the offer workflow:
  //
  // 1. HR Manager creates offer → Candidate notified (OFFER_RECEIVED)
  // 2. Candidate accepts offer → HR Manager/Employees notified (OFFER_RESPONSE_ACCEPTED)
  // 3. Candidate rejects offer → HR Manager/Employees notified (OFFER_RESPONSE_REJECTED)
  //
  // =============================================================================

  /**
   * RECRUITMENT SUBSYSTEM: Notify Candidate about New Offer
   * 
   * Purpose: Send in-app notification to candidate when HR Manager creates
   * and sends them a job offer. Candidate should review and respond.
   * 
   * Called by: createOffer() in RecruitmentService
   * 
   * Flow:
   * HR Manager fills offer form → createOffer() → notifyCandidateOfferReceived()
   *                                                        ↓
   *                                            Candidate sees notification
   *                                            "You have a new job offer!"
   *                                                        ↓
   *                                            Candidate goes to Offers page to respond
   * 
   * @param candidateId - MongoDB ObjectId string of the candidate
   * @param offerDetails - Object containing:
   *   - offerId: MongoDB ObjectId of the offer
   *   - positionTitle: Job title being offered
   *   - grossSalary: Salary amount
   *   - deadline: Response deadline date
   * @returns Object with success status and notification object
   */
  async notifyCandidateOfferReceived(
    candidateId: string,
    offerDetails: {
      offerId: string;
      positionTitle: string;
      grossSalary: number;
      deadline: Date;
    },
  ) {
    if (!candidateId) {
      console.log('[OFFER_NOTIFICATION] No candidate ID provided');
      return { success: false, message: 'No candidate ID provided' };
    }

    try {
      const formattedDeadline = offerDetails.deadline.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const formattedSalary = offerDetails.grossSalary.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      });

      const message = `🎉 Great news! You have received a job offer!\n\n` +
        `📋 Offer Details:\n` +
        `• Position: ${offerDetails.positionTitle}\n` +
        `• Salary: ${formattedSalary}\n` +
        `• Response Deadline: ${formattedDeadline}\n\n` +
        `Please review the full offer details and respond before the deadline.\n` +
        `Go to "Job Offers" in your dashboard to view and respond.`;

      const notification = await this.notificationLogModel.create({
        to: new Types.ObjectId(candidateId),
        type: NotificationType.OFFER_RECEIVED,
        message: message,
        data: {
          offerId: offerDetails.offerId,
          positionTitle: offerDetails.positionTitle,
          grossSalary: offerDetails.grossSalary,
          deadline: offerDetails.deadline.toISOString(),
          action: 'OFFER_RECEIVED',
        },
        isRead: false,
      });

      console.log(`[OFFER_NOTIFICATION] Sent OFFER_RECEIVED notification to candidate: ${candidateId}`);
      
      return {
        success: true,
        notification,
      };
    } catch (error) {
      console.error(`[OFFER_NOTIFICATION] Failed to notify candidate ${candidateId}:`, error);
      return { success: false, error };
    }
  }

  /**
   * RECRUITMENT SUBSYSTEM: Notify HR when Candidate Responds to Offer
   * 
   * Purpose: Send in-app notifications to HR Manager and HR Employees when
   * a candidate accepts or rejects their job offer.
   * 
   * Called by: respondToOffer() in RecruitmentService
   * 
   * Flow:
   * Candidate accepts/rejects → respondToOffer() → notifyHROfferResponse()
   *                                                        ↓
   *                                            HR Manager sees notification
   *                                            "Candidate has ACCEPTED/REJECTED the offer!"
   *                                                        ↓
   *                                            HR Manager can finalize (if accepted)
   * 
   * @param hrUserIds - Array of HR user IDs to notify (HR Manager + HR Employees)
   * @param responseDetails - Object containing:
   *   - candidateName: Full name of the candidate
   *   - candidateId: MongoDB ObjectId of the candidate
   *   - positionTitle: Job title
   *   - offerId: MongoDB ObjectId of the offer
   *   - applicationId: MongoDB ObjectId of the application
   *   - response: 'accepted' or 'rejected'
   * @returns Object with success status and count of notifications created
   */
  async notifyHROfferResponse(
    hrUserIds: string[],
    responseDetails: {
      candidateName: string;
      candidateId: string;
      positionTitle: string;
      offerId: string;
      applicationId: string;
      response: 'accepted' | 'rejected';
    },
  ) {
    if (!hrUserIds || hrUserIds.length === 0) {
      console.log('[OFFER_NOTIFICATION] No HR users to notify about offer response');
      return { success: true, notificationsCreated: 0 };
    }

    const notifications: any[] = [];
    const isAccepted = responseDetails.response === 'accepted';
    const notificationType = isAccepted 
      ? NotificationType.OFFER_RESPONSE_ACCEPTED 
      : NotificationType.OFFER_RESPONSE_REJECTED;

    for (const hrUserId of hrUserIds) {
      try {
        let message: string;
        
        if (isAccepted) {
          message = `✅ ${responseDetails.candidateName} has ACCEPTED the job offer!\n\n` +
            `📋 Details:\n` +
            `• Position: ${responseDetails.positionTitle}\n\n` +
            `Next Steps:\n` +
            `• Review and finalize the offer in "Job Offers & Approvals"\n` +
            `• Once finalized, the candidate will be marked as HIRED\n` +
            `• Prepare onboarding documentation`;
        } else {
          message = `❌ ${responseDetails.candidateName} has REJECTED the job offer.\n\n` +
            `📋 Details:\n` +
            `• Position: ${responseDetails.positionTitle}\n\n` +
            `The application status will be updated accordingly.\n` +
            `Consider other candidates for this position.`;
        }

        const notification = await this.notificationLogModel.create({
          to: new Types.ObjectId(hrUserId),
          type: notificationType,
          message: message,
          data: {
            candidateName: responseDetails.candidateName,
            candidateId: responseDetails.candidateId,
            positionTitle: responseDetails.positionTitle,
            offerId: responseDetails.offerId,
            applicationId: responseDetails.applicationId,
            response: responseDetails.response,
            action: isAccepted ? 'OFFER_ACCEPTED' : 'OFFER_REJECTED',
          },
          isRead: false,
        });

        notifications.push(notification);
        console.log(`[OFFER_NOTIFICATION] Sent ${responseDetails.response.toUpperCase()} notification to HR: ${hrUserId}`);
      } catch (error) {
        console.error(`[OFFER_NOTIFICATION] Failed to notify HR user ${hrUserId}:`, error);
      }
    }

    return {
      success: true,
      notificationsCreated: notifications.length,
    };
  }

  /**
   * RECRUITMENT SUBSYSTEM: Get HR Employee IDs for Notifications
   * 
   * Purpose: Helper method to fetch all active HR Employee user IDs
   * for sending bulk notifications about hiring decisions.
   * 
   * Note: This method is currently a placeholder. In the actual implementation,
   * HR Employee IDs are fetched directly in the calling methods (finalizeOffer,
   * updateApplicationStatus) using the EmployeeSystemRole model.
   * 
   * The actual query used is:
   * ```typescript
   * const hrEmployees = await this.employeeSystemRoleModel
   *   .find({
   *     roles: { $in: [SystemRole.HR_EMPLOYEE] },
   *     isActive: true,
   *   })
   *   .select('employeeProfileId')
   *   .lean()
   *   .exec();
   * ```
   * 
   * @returns Array of HR Employee user IDs (ObjectId strings)
   */
  async getHREmployeeIds(): Promise<string[]> {
    try {
      const hrEmployees = await this.employeeProfileModel
        .find({
          // Find employees who have HR_EMPLOYEE role
          // Note: The role is typically stored in a separate EmployeeSystemRole collection
          active: true,
        })
        .select('_id')
        .lean()
        .exec();

      // We need to cross-reference with the system role collection
      // For now, return empty and let the caller provide the IDs
      console.log('[HIRING_NOTIFICATION] getHREmployeeIds needs to be called with pre-fetched IDs');
      return [];
    } catch (error) {
      console.error('[HIRING_NOTIFICATION] Error fetching HR Employee IDs:', error);
      return [];
    }
  }
}