import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TimeManagementService } from './time-management.service';
import { NotificationService } from './notification.service';

/**
 * Sync Scheduler Service
 * 
 * Handles automatic daily synchronization of time management data
 * BR-TM-22: All time management data must sync daily with payroll, benefits, and leave modules
 * 
 * Runs daily at 2:00 AM to sync previous day's data
 */
@Injectable()
export class SyncSchedulerService {
  private readonly logger = new Logger(SyncSchedulerService.name);

  constructor(
    private readonly timeManagementService: TimeManagementService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Daily sync job - runs at 2:00 AM every day
   * Syncs attendance, overtime, and penalty data with payroll and leave systems
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailySync() {
    try {
      this.logger.log('[SCHEDULED TASK] Starting daily time management data sync...');
      
      // Sync previous day's data
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const syncResult = await this.timeManagementService.syncTimeManagementData(
        {
          syncDate: yesterday,
          modules: ['payroll', 'leaves', 'benefits'],
        },
        'system', // System-initiated sync
      );

      this.logger.log(
        `[SCHEDULED TASK] Daily sync completed. Overall status: ${syncResult.overallStatus}. ` +
        `Payroll: ${syncResult.results?.payroll?.status || 'N/A'}, ` +
        `Leaves: ${syncResult.results?.leaves?.status || 'N/A'}, ` +
        `Benefits: ${syncResult.results?.benefits?.status || 'N/A'}`,
      );

      // Log any failures
      if (syncResult.results?.payroll?.status === 'FAILED') {
        this.logger.error(
          `[SCHEDULED TASK] Payroll sync failed: ${syncResult.results.payroll.error}`,
        );
      }
      if (syncResult.results?.leaves?.status === 'FAILED') {
        this.logger.error(
          `[SCHEDULED TASK] Leaves sync failed: ${syncResult.results.leaves.error}`,
        );
      }
      if (syncResult.results?.benefits?.status === 'FAILED') {
        this.logger.error(
          `[SCHEDULED TASK] Benefits sync failed: ${syncResult.results.benefits.error}`,
        );
      }

      // BR-TM-20 / Payroll Cut-off: auto-escalate pending items when approaching cut-off
      try {
        const escalationResult =
          await this.notificationService.autoEscalateBeforePayrollCutoff(
            {},
            'system',
          );
        this.logger.log(
          `[SCHEDULED TASK] Payroll cut-off auto-escalation result: ${escalationResult?.success ? 'success' : 'skipped'} (${escalationResult?.message || 'no message'})`,
        );
      } catch (escalationError: any) {
        this.logger.error(
          `[SCHEDULED TASK] Payroll cut-off auto-escalation failed: ${escalationError?.message || escalationError}`,
          escalationError?.stack,
        );
      }

      // BR-TM-20: Auto-escalate overdue exceptions after deadline (default: 3 days)
      try {
        const overdueEscalationResult =
          await this.timeManagementService.autoEscalateOverdueExceptions(
            {
              thresholdDays: 3, // Auto-escalate requests pending for more than 3 days
              excludeTypes: [], // Escalate all types
            },
            'system',
          );
        this.logger.log(
          `[SCHEDULED TASK] Overdue exceptions auto-escalation: ${overdueEscalationResult.summary.escalated} escalated, ${overdueEscalationResult.summary.failed} failed`,
        );
      } catch (overdueError: any) {
        this.logger.error(
          `[SCHEDULED TASK] Overdue exceptions auto-escalation failed: ${overdueError?.message || overdueError}`,
          overdueError?.stack,
        );
      }
    } catch (error: any) {
      this.logger.error(
        `[SCHEDULED TASK] Daily sync failed: ${error.message}`,
        error.stack,
      );
    }
  }
}

