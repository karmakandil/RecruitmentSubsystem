import { Model } from 'mongoose';
import { NotificationLog } from '../models/notification-log.schema';
import { AttendanceRecord } from '../models/attendance-record.schema';
import { TimeException } from '../models/time-exception.schema';
import { SendNotificationDto, GetNotificationLogsByEmployeeDto, SyncAttendanceWithPayrollDto, SyncLeaveWithPayrollDto, SynchronizeAttendanceAndPayrollDto } from '../dtos/notification-and-sync.dtos';
export declare class NotificationService {
    private notificationLogModel;
    private attendanceRecordModel;
    private timeExceptionModel;
    private readonly auditLogs;
    constructor(notificationLogModel: Model<NotificationLog>, attendanceRecordModel: Model<AttendanceRecord>, timeExceptionModel: Model<TimeException>);
    sendNotification(sendNotificationDto: SendNotificationDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getNotificationLogsByEmployee(getNotificationLogsByEmployeeDto: GetNotificationLogsByEmployeeDto, currentUserId: string): Promise<(import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    syncAttendanceWithPayroll(syncAttendanceWithPayrollDto: SyncAttendanceWithPayrollDto, currentUserId: string): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        records: {
            attendanceRecordId: any;
            employeeId: any;
            date: any;
            punches: any;
            totalWorkMinutes: any;
            totalWorkHours: number;
            hasMissedPunch: any;
            finalisedForPayroll: any;
        }[];
        summary: {
            totalRecords: number;
            totalWorkMinutes: number;
            totalWorkHours: number;
        };
    }>;
    syncLeaveWithPayroll(syncLeaveWithPayrollDto: SyncLeaveWithPayrollDto, currentUserId: string): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        message: string;
        attendanceContext: {
            note: string;
        };
    }>;
    synchronizeAttendanceAndPayroll(synchronizeAttendanceAndPayrollDto: SynchronizeAttendanceAndPayrollDto, currentUserId: string): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        attendance: {
            records: {
                attendanceRecordId: any;
                employeeId: any;
                date: any;
                punches: any;
                totalWorkMinutes: any;
                totalWorkHours: number;
                hasMissedPunch: any;
                finalisedForPayroll: any;
            }[];
            summary: {
                totalRecords: number;
                totalWorkMinutes: number;
                totalWorkHours: number;
            };
        };
        leave: {
            message: string;
            note: string;
        };
    }>;
    getAttendanceDataForSync(employeeId: string, startDate?: Date, endDate?: Date, currentUserId?: string): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        records: {
            attendanceRecordId: any;
            employeeId: any;
            date: any;
            punches: any;
            totalWorkMinutes: any;
            totalWorkHours: number;
            hasMissedPunch: any;
            finalisedForPayroll: any;
        }[];
        summary: {
            totalRecords: number;
            totalWorkMinutes: number;
            totalWorkHours: number;
        };
    }>;
    getOvertimeDataForSync(employeeId: string, startDate?: Date, endDate?: Date, currentUserId?: string): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        records: {
            exceptionId: any;
            employeeId: any;
            attendanceRecordId: any;
            date: any;
            overtimeMinutes: number;
            overtimeHours: number;
            status: any;
            reason: any;
        }[];
        summary: {
            totalRecords: number;
            totalOvertimeMinutes: number;
            totalOvertimeHours: number;
        };
    }>;
    runDailyPayrollSync(syncDate: Date, currentUserId: string): Promise<{
        syncDate: Date;
        syncedAt: Date;
        attendance: {
            count: number;
            records: {
                recordId: any;
                employeeId: any;
                employeeName: string;
                date: any;
                totalWorkMinutes: any;
                totalWorkHours: number;
                hasMissedPunch: any;
                finalisedForPayroll: any;
            }[];
        };
        overtime: {
            count: number;
            records: {
                exceptionId: any;
                employeeId: any;
                status: any;
                attendanceRecordId: any;
            }[];
        };
        exceptions: {
            count: number;
            byType: Record<string, any[]>;
        };
        summary: {
            totalAttendanceMinutes: number;
            totalAttendanceHours: number;
            employeesWithMissedPunches: number;
        };
    }>;
    private groupExceptionsByType;
    getPendingPayrollSyncData(filters: {
        startDate?: Date;
        endDate?: Date;
        departmentId?: string;
    }, currentUserId: string): Promise<{
        filters: {
            startDate?: Date;
            endDate?: Date;
            departmentId?: string;
        };
        count: number;
        records: {
            recordId: any;
            employeeId: any;
            employeeName: string;
            date: any;
            totalWorkMinutes: any;
            totalWorkHours: number;
            hasMissedPunch: any;
            punchCount: any;
        }[];
        summary: {
            totalMinutes: number;
            totalHours: number;
            recordsWithMissedPunches: number;
        };
    }>;
    finalizeRecordsForPayroll(recordIds: string[], currentUserId: string): Promise<{
        success: boolean;
        recordsFinalized: number;
        recordIds: string[];
        finalizedAt: Date;
    }>;
    validateDataForPayrollSync(filters: {
        startDate: Date;
        endDate: Date;
    }, currentUserId: string): Promise<{
        startDate: Date;
        endDate: Date;
        isValid: boolean;
        validatedAt: Date;
        totalRecords: number;
        issues: any[];
        summary: {
            errorCount: number;
            warningCount: number;
            canProceedWithSync: boolean;
        };
    }>;
    getExceptionDataForPayrollSync(filters: {
        startDate?: Date;
        endDate?: Date;
        employeeId?: string;
    }, currentUserId: string): Promise<{
        filters: {
            startDate?: Date;
            endDate?: Date;
            employeeId?: string;
        };
        totalCount: number;
        byType: {
            type: string;
            count: number;
            records: any[];
        }[];
        byStatus: Record<string, number>;
        payrollRelevant: {
            approvedOvertime: any[];
            latenessRecords: any[];
            earlyLeaveRecords: any[];
        };
    }>;
    getPayrollSyncHistory(filters: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }, currentUserId: string): Promise<{
        count: number;
        syncHistory: {
            operation: string;
            details: Record<string, unknown>;
            performedBy: string;
            timestamp: Date;
        }[];
    }>;
    getComprehensivePayrollData(filters: {
        startDate: Date;
        endDate: Date;
        departmentId?: string;
    }, currentUserId: string): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        departmentId: string;
        generatedAt: Date;
        employeeSummaries: any[];
        totals: {
            totalEmployees: number;
            totalWorkMinutes: any;
            totalWorkHours: number;
            totalOvertimeMinutes: any;
            totalOvertimeHours: number;
            totalLatenessCount: any;
            totalMissedPunches: any;
        };
    }>;
    sendShiftExpiryNotification(recipientId: string, shiftAssignmentId: string, employeeId: string, endDate: Date, daysRemaining: number, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    sendBulkShiftExpiryNotifications(hrAdminIds: string[], expiringAssignments: Array<{
        assignmentId: string;
        employeeId: string;
        employeeName?: string;
        shiftName?: string;
        endDate: Date;
        daysRemaining: number;
    }>, currentUserId: string): Promise<{
        notificationsSent: number;
        notifications: any[];
    }>;
    getShiftExpiryNotifications(hrAdminId: string, currentUserId: string): Promise<{
        count: number;
        notifications: (import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    sendShiftRenewalConfirmation(recipientId: string, shiftAssignmentId: string, newEndDate: Date, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    sendShiftArchiveNotification(recipientId: string, shiftAssignmentId: string, employeeId: string, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllShiftNotifications(hrAdminId: string, currentUserId: string): Promise<{
        totalCount: number;
        grouped: {
            expiryAlerts: (import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            renewalConfirmations: (import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            archiveNotifications: (import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
        };
        all: (import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    sendMissedPunchAlertToEmployee(employeeId: string, attendanceRecordId: string, missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT', date: Date, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    sendMissedPunchAlertToManager(managerId: string, employeeId: string, employeeName: string, attendanceRecordId: string, missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT', date: Date, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    sendBulkMissedPunchAlerts(alerts: Array<{
        employeeId: string;
        managerId?: string;
        employeeName?: string;
        attendanceRecordId: string;
        missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT';
        date: Date;
    }>, currentUserId: string): Promise<{
        alertsProcessed: number;
        notificationsSent: number;
        notifications: any[];
    }>;
    getMissedPunchNotificationsByEmployee(employeeId: string, currentUserId: string): Promise<{
        count: number;
        notifications: (import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getMissedPunchNotificationsByManager(managerId: string, currentUserId: string): Promise<{
        count: number;
        notifications: (import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getAllMissedPunchNotifications(filters: {
        startDate?: Date;
        endDate?: Date;
    }, currentUserId: string): Promise<{
        total: number;
        employeeAlerts: {
            count: number;
            notifications: (import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
        };
        managerAlerts: {
            count: number;
            notifications: (import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
        };
    }>;
    flagMissedPunchWithNotification(attendanceRecordId: string, employeeId: string, managerId: string, employeeName: string, missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT', currentUserId: string): Promise<{
        attendanceRecord: import("mongoose").Document<unknown, {}, AttendanceRecord, {}, {}> & AttendanceRecord & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        timeException: import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        notifications: {
            employee: import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
            manager: import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        };
    }>;
    getMissedPunchStatistics(filters: {
        employeeId?: string;
        startDate?: Date;
        endDate?: Date;
    }, currentUserId: string): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalMissedPunchRecords: number;
            totalExceptions: number;
            uniqueEmployees: number;
        };
        exceptionsByStatus: {
            open: number;
            pending: number;
            approved: number;
            rejected: number;
            escalated: number;
            resolved: number;
        };
        byEmployee: {
            count: number;
            records: any[];
            employeeId: string;
        }[];
    }>;
    private convertDateToUTCStart;
    private convertDateToUTCEnd;
    linkVacationToAttendanceSchedule(params: {
        employeeId: string;
        vacationPackageId: string;
        startDate: Date;
        endDate: Date;
        vacationType: string;
        autoReflect?: boolean;
    }, currentUserId: string): Promise<{
        success: boolean;
        linkage: {
            employeeId: string;
            vacationPackageId: string;
            vacationType: string;
            period: {
                startDate: Date;
                endDate: Date;
            };
            autoReflect: boolean;
        };
        attendanceImpact: {
            affectedAttendanceRecords: number;
            workingDaysInRange: number;
            message: string;
        };
        linkedAt: Date;
        linkedBy: string;
    }>;
    getEmployeeVacationAttendanceStatus(params: {
        employeeId: string;
        startDate: Date;
        endDate: Date;
    }, currentUserId: string): Promise<{
        employeeId: string;
        period: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalDays: number;
            recordedDays: number;
            presentDays: number;
            absentDays: number;
            attendanceRate: string;
        };
        potentialVacationDays: {
            date: any;
            status: string;
            note: string;
        }[];
        recommendation: string;
        generatedAt: Date;
    }>;
    validateVacationAgainstShiftSchedule(params: {
        employeeId: string;
        vacationStartDate: Date;
        vacationEndDate: Date;
        shiftAssignmentId?: string;
    }, currentUserId: string): Promise<{
        valid: boolean;
        employeeId: string;
        vacationPeriod: {
            startDate: Date;
            endDate: Date;
            totalDays: number;
            workingDays: number;
        };
        conflicts: {
            count: number;
            dates: any[];
            message: string;
        };
        recommendation: string;
        validatedAt: Date;
    }>;
    calculateLeaveDeductionsFromAttendance(params: {
        employeeId: string;
        startDate: Date;
        endDate: Date;
        leaveType?: string;
    }, currentUserId: string): Promise<{
        employeeId: string;
        period: {
            startDate: Date;
            endDate: Date;
        };
        leaveType: string;
        deduction: {
            fullDays: number;
            halfDays: number;
            totalDeduction: number;
            unit: string;
        };
        breakdown: {
            workingDaysInPeriod: number;
            daysPresent: number;
            daysAbsent: number;
            partialDays: number;
        };
        syncStatus: {
            readyForPayroll: boolean;
            readyForLeaveModule: boolean;
            note: string;
        };
        calculatedAt: Date;
    }>;
    getDepartmentVacationAttendanceSummary(params: {
        departmentId?: string;
        startDate: Date;
        endDate: Date;
    }, currentUserId: string): Promise<{
        reportType: string;
        period: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalEmployees: number;
            totalPresentDays: number;
            totalAbsentDays: number;
            avgAbsentDaysPerEmployee: number;
        };
        employees: {
            employeeId: string;
            employeeName: string;
            employeeNumber: any;
            presentDays: number;
            absentDays: number;
            potentialVacationDays: number;
            totalWorkHours: number;
        }[];
        note: string;
        generatedAt: Date;
    }>;
    getPayrollCutoffConfig(currentUserId: string): Promise<{
        cutoffSchedule: {
            dayOfMonth: number;
            escalationDaysBefore: number;
            warningDaysBefore: number;
            reminderDaysBefore: number;
        };
        escalationRules: {
            autoEscalateUnreviewedCorrections: boolean;
            autoEscalateUnreviewedExceptions: boolean;
            autoEscalateOvertimeRequests: boolean;
            notifyHROnEscalation: boolean;
            notifyManagerOnEscalation: boolean;
            blockPayrollIfPending: boolean;
        };
        notifications: {
            sendReminderEmails: boolean;
            sendEscalationAlerts: boolean;
            dailyDigestEnabled: boolean;
        };
        currentMonth: {
            cutoffDate: Date;
            daysUntilCutoff: number;
            status: string;
        };
    }>;
    getPendingRequestsBeforePayrollCutoff(params: {
        payrollCutoffDate?: Date;
        departmentId?: string;
    }, currentUserId: string): Promise<{
        payrollCutoff: {
            date: Date;
            daysRemaining: number;
            status: string;
        };
        summary: {
            totalPending: number;
            critical: number;
            high: number;
            medium: number;
        };
        pendingByUrgency: {
            critical: any[];
            high: any[];
            medium: any[];
        };
        recommendation: string;
        generatedAt: Date;
    }>;
    autoEscalateBeforePayrollCutoff(params: {
        payrollCutoffDate?: Date;
        escalationDaysBefore?: number;
        notifyManagers?: boolean;
    }, currentUserId: string): Promise<{
        success: boolean;
        message: string;
        payrollCutoff: Date;
        daysUntilCutoff: number;
        escalationDaysBefore: number;
        escalated: any[];
        escalation?: undefined;
        notificationSent?: undefined;
        executedAt?: undefined;
        executedBy?: undefined;
    } | {
        success: boolean;
        payrollCutoff: {
            date: Date;
            daysRemaining: number;
        };
        escalation: {
            totalEscalated: number;
            totalFailed: number;
            items: any[];
            failed: any[];
        };
        notificationSent: boolean;
        executedAt: Date;
        executedBy: string;
        message?: undefined;
        daysUntilCutoff?: undefined;
        escalationDaysBefore?: undefined;
        escalated?: undefined;
    }>;
    checkPayrollReadinessStatus(params: {
        payrollCutoffDate?: Date;
        departmentId?: string;
    }, currentUserId: string): Promise<{
        payrollCutoff: {
            date: Date;
            daysRemaining: number;
        };
        readiness: {
            status: "CRITICAL" | "WARNING" | "READY" | "BLOCKED";
            isReady: boolean;
            hasBlockers: boolean;
            hasWarnings: boolean;
            message: string;
        };
        counts: {
            pending: number;
            escalated: number;
            approved: number;
            resolved: number;
        };
        recommendations: string[];
        checkedAt: Date;
    }>;
    getEscalationHistory(params: {
        startDate?: Date;
        endDate?: Date;
        type?: 'PAYROLL' | 'THRESHOLD' | 'MANUAL' | 'ALL';
    }, currentUserId: string): Promise<{
        period: {
            startDate: string | Date;
            endDate: string | Date;
        };
        filter: "MANUAL" | "ALL" | "PAYROLL" | "THRESHOLD";
        summary: {
            total: number;
            byPayrollCutoff: number;
            byThreshold: number;
            manual: number;
        };
        items: any[];
        generatedAt: Date;
    }>;
    sendPayrollCutoffReminders(params: {
        payrollCutoffDate?: Date;
        reminderDaysBefore?: number;
    }, currentUserId: string): Promise<{
        success: boolean;
        message: string;
        remindersSent: number;
        payrollCutoff?: undefined;
        reminders?: undefined;
        sentAt?: undefined;
    } | {
        success: boolean;
        payrollCutoff: {
            date: Date;
            daysRemaining: number;
        };
        remindersSent: number;
        reminders: any[];
        sentAt: Date;
        message?: undefined;
    }>;
    private calculateWorkingDays;
    private getNextPayrollCutoffDate;
    private getDaysUntilCutoff;
    private getPayrollReadinessRecommendations;
    getCrossModuleSyncStatus(params: {
        startDate?: Date;
        endDate?: Date;
    }, currentUserId: string): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        modules: {
            timeManagement: {
                status: string;
                lastSync: Date;
            };
            payroll: {
                status: string;
                pendingRecords: number;
                finalizedRecords: number;
            };
            leaves: {
                status: string;
                note: string;
            };
            benefits: {
                status: string;
                note: string;
            };
        };
        attendance: {
            total: number;
            finalized: number;
            pending: number;
            syncRate: string;
        };
        exceptions: {
            total: number;
            approved: number;
            pending: number;
            processingRate: string;
        };
        health: {
            attendanceSyncRate: number;
            exceptionProcessingRate: number;
            overallHealth: "GOOD" | "WARNING" | "CRITICAL";
        };
        recentSyncOperations: {
            operation: string;
            timestamp: Date;
            performedBy: string;
        }[];
        generatedAt: Date;
    }>;
    syncWithLeavesModule(params: {
        employeeId?: string;
        startDate: Date;
        endDate: Date;
    }, currentUserId: string): Promise<{
        syncType: string;
        period: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalAttendanceRecords: number;
            uniqueEmployees: number;
            attendanceDaysRecorded: number;
        };
        leaveContext: {
            description: string;
            employeeData: any[];
        };
        integrationNotes: string[];
        syncedAt: Date;
        syncedBy: string;
    }>;
    syncWithBenefitsModule(params: {
        employeeId?: string;
        startDate: Date;
        endDate: Date;
    }, currentUserId: string): Promise<{
        syncType: string;
        period: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalAttendanceRecords: number;
            approvedOvertimeRecords: number;
            uniqueEmployees: number;
        };
        benefitsData: {
            description: string;
            employees: any[];
        };
        calculations: {
            totalWorkHoursAllEmployees: number;
            totalOvertimeHoursAllEmployees: number;
        };
        integrationNotes: string[];
        syncedAt: Date;
        syncedBy: string;
    }>;
    runFullCrossModuleSync(params: {
        syncDate: Date;
        modules: ('payroll' | 'leaves' | 'benefits')[];
    }, currentUserId: string): Promise<{
        syncDate: Date;
        modulesRequested: ("payroll" | "leaves" | "benefits")[];
        overallStatus: string;
        results: Record<string, any>;
        failedModules: string[];
        executedAt: Date;
        executedBy: string;
    }>;
    checkCrossModuleDataConsistency(params: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
    }, currentUserId: string): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        employeeFilter: string;
        isConsistent: boolean;
        summary: {
            attendanceRecordsChecked: number;
            exceptionsChecked: number;
            errorCount: number;
            warningCount: number;
        };
        inconsistencies: any[];
        recommendations: string[];
        checkedAt: Date;
        checkedBy: string;
    }>;
    getDataForDownstreamModules(params: {
        startDate: Date;
        endDate: Date;
        departmentId?: string;
        modules: ('payroll' | 'leaves' | 'benefits')[];
    }, currentUserId: string): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        departmentFilter: string;
        modulesIncluded: ("payroll" | "leaves" | "benefits")[];
        baseDataSummary: {
            attendanceRecords: number;
            exceptions: number;
            uniqueEmployees: number;
        };
        dataPackages: Record<string, any>;
        generatedAt: Date;
        generatedBy: string;
    }>;
    private buildPayrollDataPackage;
    private buildLeavesDataPackage;
    private buildBenefitsDataPackage;
    private getConsistencyRecommendations;
    private logTimeManagementChange;
}
