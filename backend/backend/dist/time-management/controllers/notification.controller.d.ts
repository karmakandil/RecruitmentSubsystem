import { NotificationService } from '../services/notification.service';
import { SendNotificationDto, SyncAttendanceWithPayrollDto, SyncLeaveWithPayrollDto, SynchronizeAttendanceAndPayrollDto } from '../dtos/notification-and-sync.dtos';
export declare class NotificationAndSyncController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(sendNotificationDto: SendNotificationDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getNotificationLogsByEmployee(employeeId: string, user: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    syncAttendanceWithPayroll(syncAttendanceWithPayrollDto: SyncAttendanceWithPayrollDto, user: any): Promise<{
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
    syncLeaveWithPayroll(syncLeaveWithPayrollDto: SyncLeaveWithPayrollDto, user: any): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        message: string;
        attendanceContext: {
            note: string;
        };
    }>;
    synchronizeAttendanceAndPayroll(synchronizeAttendanceAndPayrollDto: SynchronizeAttendanceAndPayrollDto, user: any): Promise<{
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
    getAttendanceDataForSync(employeeId: string, startDate?: string, endDate?: string, user?: any): Promise<{
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
    getOvertimeDataForSync(employeeId: string, startDate?: string, endDate?: string, user?: any): Promise<{
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
    runDailyPayrollSync(body: {
        syncDate: Date;
    }, user: any): Promise<{
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
    getPendingPayrollSyncData(startDate?: string, endDate?: string, departmentId?: string, user?: any): Promise<{
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
    finalizeRecordsForPayroll(body: {
        recordIds: string[];
    }, user: any): Promise<{
        success: boolean;
        recordsFinalized: number;
        recordIds: string[];
        finalizedAt: Date;
    }>;
    validateDataForPayrollSync(body: {
        startDate: Date;
        endDate: Date;
    }, user: any): Promise<{
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
    getExceptionDataForPayrollSync(startDate?: string, endDate?: string, employeeId?: string, user?: any): Promise<{
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
    getPayrollSyncHistory(startDate?: string, endDate?: string, limit?: string, user?: any): Promise<{
        count: number;
        syncHistory: {
            operation: string;
            details: Record<string, unknown>;
            performedBy: string;
            timestamp: Date;
        }[];
    }>;
    getComprehensivePayrollData(body: {
        startDate: Date;
        endDate: Date;
        departmentId?: string;
    }, user: any): Promise<{
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
    sendShiftExpiryNotification(body: {
        recipientId: string;
        shiftAssignmentId: string;
        employeeId: string;
        endDate: Date;
        daysRemaining: number;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    sendBulkShiftExpiryNotifications(body: {
        hrAdminIds: string[];
        expiringAssignments: Array<{
            assignmentId: string;
            employeeId: string;
            employeeName?: string;
            shiftName?: string;
            endDate: Date;
            daysRemaining: number;
        }>;
    }, user: any): Promise<{
        notificationsSent: number;
        notifications: any[];
    }>;
    getShiftExpiryNotifications(hrAdminId: string, user: any): Promise<{
        count: number;
        notifications: (import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    sendShiftRenewalConfirmation(body: {
        recipientId: string;
        shiftAssignmentId: string;
        newEndDate: Date;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    sendShiftArchiveNotification(body: {
        recipientId: string;
        shiftAssignmentId: string;
        employeeId: string;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllShiftNotifications(hrAdminId: string, user: any): Promise<{
        totalCount: number;
        grouped: {
            expiryAlerts: (import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            renewalConfirmations: (import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            archiveNotifications: (import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
        };
        all: (import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    sendMissedPunchAlertToEmployee(body: {
        employeeId: string;
        attendanceRecordId: string;
        missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT';
        date: Date;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    sendMissedPunchAlertToManager(body: {
        managerId: string;
        employeeId: string;
        employeeName: string;
        attendanceRecordId: string;
        missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT';
        date: Date;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    sendBulkMissedPunchAlerts(body: {
        alerts: Array<{
            employeeId: string;
            managerId?: string;
            employeeName?: string;
            attendanceRecordId: string;
            missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT';
            date: Date;
        }>;
    }, user: any): Promise<{
        alertsProcessed: number;
        notificationsSent: number;
        notifications: any[];
    }>;
    getMissedPunchNotificationsByEmployee(employeeId: string, user: any): Promise<{
        count: number;
        notifications: (import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getMissedPunchNotificationsByManager(managerId: string, user: any): Promise<{
        count: number;
        notifications: (import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getAllMissedPunchNotifications(startDate?: string, endDate?: string, user?: any): Promise<{
        total: number;
        employeeAlerts: {
            count: number;
            notifications: (import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
        };
        managerAlerts: {
            count: number;
            notifications: (import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
        };
    }>;
    flagMissedPunchWithNotification(body: {
        attendanceRecordId: string;
        employeeId: string;
        managerId: string;
        employeeName: string;
        missedPunchType: 'CLOCK_IN' | 'CLOCK_OUT';
    }, user: any): Promise<{
        attendanceRecord: import("mongoose").Document<unknown, {}, import("../models/attendance-record.schema").AttendanceRecord, {}, {}> & import("../models/attendance-record.schema").AttendanceRecord & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        timeException: import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        notifications: {
            employee: import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
            manager: import("mongoose").Document<unknown, {}, import("../models/notification-log.schema").NotificationLog, {}, {}> & import("../models/notification-log.schema").NotificationLog & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            };
        };
    }>;
    getMissedPunchStatistics(employeeId?: string, startDate?: string, endDate?: string, user?: any): Promise<{
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
    linkVacationToAttendanceSchedule(body: {
        employeeId: string;
        vacationPackageId: string;
        startDate: Date;
        endDate: Date;
        vacationType: string;
        autoReflect?: boolean;
    }, user: any): Promise<{
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
    getEmployeeVacationAttendanceStatus(employeeId: string, startDate: string, endDate: string, user: any): Promise<{
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
    validateVacationAgainstShiftSchedule(body: {
        employeeId: string;
        vacationStartDate: Date;
        vacationEndDate: Date;
        shiftAssignmentId?: string;
    }, user: any): Promise<{
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
    calculateLeaveDeductionsFromAttendance(body: {
        employeeId: string;
        startDate: Date;
        endDate: Date;
        leaveType?: string;
    }, user: any): Promise<{
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
    getDepartmentVacationAttendanceSummary(body: {
        departmentId?: string;
        startDate: Date;
        endDate: Date;
    }, user: any): Promise<{
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
    getPayrollCutoffConfig(user: any): Promise<{
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
    getPendingRequestsBeforePayrollCutoff(body: {
        payrollCutoffDate?: Date;
        departmentId?: string;
    }, user: any): Promise<{
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
    autoEscalateBeforePayrollCutoff(body: {
        payrollCutoffDate?: Date;
        escalationDaysBefore?: number;
        notifyManagers?: boolean;
    }, user: any): Promise<{
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
    checkPayrollReadinessStatus(body: {
        payrollCutoffDate?: Date;
        departmentId?: string;
    }, user: any): Promise<{
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
    getEscalationHistory(body: {
        startDate?: Date;
        endDate?: Date;
        type?: 'PAYROLL' | 'THRESHOLD' | 'MANUAL' | 'ALL';
    }, user: any): Promise<{
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
    sendPayrollCutoffReminders(body: {
        payrollCutoffDate?: Date;
        reminderDaysBefore?: number;
    }, user: any): Promise<{
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
    getCrossModuleSyncStatus(startDate?: string, endDate?: string, user?: any): Promise<{
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
    syncWithLeavesModule(body: {
        employeeId?: string;
        startDate: Date;
        endDate: Date;
    }, user: any): Promise<{
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
    syncWithBenefitsModule(body: {
        employeeId?: string;
        startDate: Date;
        endDate: Date;
    }, user: any): Promise<{
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
    runFullCrossModuleSync(body: {
        syncDate: Date;
        modules: ('payroll' | 'leaves' | 'benefits')[];
    }, user: any): Promise<{
        syncDate: Date;
        modulesRequested: ("payroll" | "leaves" | "benefits")[];
        overallStatus: string;
        results: Record<string, any>;
        failedModules: string[];
        executedAt: Date;
        executedBy: string;
    }>;
    checkCrossModuleDataConsistency(body: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
    }, user: any): Promise<{
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
    getDataForDownstreamModules(body: {
        startDate: Date;
        endDate: Date;
        departmentId?: string;
        modules: ('payroll' | 'leaves' | 'benefits')[];
    }, user: any): Promise<{
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
}
