import { TimeManagementService } from '../services/time-management.service';
import { CreateAttendanceRecordDto, UpdateAttendanceRecordDto, SubmitCorrectionRequestDto, CreateTimeExceptionDto, UpdateTimeExceptionDto, GetTimeExceptionsByEmployeeDto, ApproveTimeExceptionDto, RejectTimeExceptionDto, EscalateTimeExceptionDto } from '../DTOs/attendance.dtos';
import { ApplyAttendanceRoundingDto, EnforcePunchPolicyDto, EnforceShiftPunchPolicyDto, MonitorRepeatedLatenessDto, RecordPunchWithMetadataDto, TriggerLatenessDisciplinaryDto } from '../DTOs/time-permission.dtos';
import { GenerateOvertimeReportDto, GenerateLatenessReportDto, GenerateExceptionReportDto, ExportReportDto } from '../DTOs/reporting.dtos';
export declare class TimeManagementController {
    private readonly timeManagementService;
    constructor(timeManagementService: TimeManagementService);
    clockInWithID(employeeId: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/attendance-record.schema").AttendanceRecord, {}, {}> & import("../models/attendance-record.schema").AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    clockOutWithID(employeeId: string, user: any): Promise<any>;
    clockInWithMetadata(employeeId: string, body: {
        source: 'BIOMETRIC' | 'WEB' | 'MOBILE' | 'MANUAL';
        deviceId?: string;
        terminalId?: string;
        location?: string;
        gpsCoordinates?: {
            lat: number;
            lng: number;
        };
        ipAddress?: string;
    }, user: any): Promise<{
        attendanceRecord: import("mongoose").Document<unknown, {}, import("../models/attendance-record.schema").AttendanceRecord, {}, {}> & import("../models/attendance-record.schema").AttendanceRecord & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        metadata: {
            source: "BIOMETRIC" | "WEB" | "MOBILE" | "MANUAL";
            deviceId: string;
            terminalId: string;
            location: string;
            capturedAt: Date;
        };
    }>;
    clockOutWithMetadata(employeeId: string, body: {
        source: 'BIOMETRIC' | 'WEB' | 'MOBILE' | 'MANUAL';
        deviceId?: string;
        terminalId?: string;
        location?: string;
        gpsCoordinates?: {
            lat: number;
            lng: number;
        };
        ipAddress?: string;
    }, user: any): Promise<{
        attendanceRecord: any;
        metadata: {
            source: "BIOMETRIC" | "WEB" | "MOBILE" | "MANUAL";
            deviceId: string;
            terminalId: string;
            location: string;
            capturedAt: Date;
        };
        totalWorkMinutes: number;
        totalWorkHours: number;
    }>;
    validateClockInAgainstShift(employeeId: string, user: any): Promise<{
        isValid: boolean;
        message: string;
        allowClockIn: boolean;
        warning: string;
        shiftName?: undefined;
        shiftStart?: undefined;
        shiftEnd?: undefined;
        currentTime?: undefined;
        isWithinStartWindow?: undefined;
        isLate?: undefined;
        lateByMinutes?: undefined;
        graceInMinutes?: undefined;
        graceOutMinutes?: undefined;
    } | {
        isValid: boolean;
        shiftName: any;
        shiftStart: any;
        shiftEnd: any;
        currentTime: string;
        isWithinStartWindow: boolean;
        isLate: boolean;
        lateByMinutes: number;
        graceInMinutes: any;
        graceOutMinutes: any;
        allowClockIn: boolean;
        message: string;
        warning?: undefined;
    }>;
    getEmployeeAttendanceStatus(employeeId: string, user: any): Promise<{
        status: string;
        message: string;
        records: any[];
        lastPunchTime?: undefined;
        lastPunchType?: undefined;
        totalMinutesToday?: undefined;
        totalHoursToday?: undefined;
        recordCount?: undefined;
        punchCount?: undefined;
    } | {
        status: string;
        lastPunchTime: Date;
        lastPunchType: import("../models/enums").PunchType;
        totalMinutesToday: number;
        totalHoursToday: number;
        recordCount: number;
        punchCount: number;
        records: {
            id: import("mongoose").Types.ObjectId;
            punches: import("../models/attendance-record.schema").Punch[];
            totalWorkMinutes: number;
            hasMissedPunch: boolean;
        }[];
        message?: undefined;
    }>;
    createAttendanceRecord(createAttendanceRecordDto: CreateAttendanceRecordDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/attendance-record.schema").AttendanceRecord, {}, {}> & import("../models/attendance-record.schema").AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateAttendanceRecord(id: string, updateAttendanceRecordDto: UpdateAttendanceRecordDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/attendance-record.schema").AttendanceRecord, {}, {}> & import("../models/attendance-record.schema").AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    submitAttendanceCorrectionRequest(submitCorrectionRequestDto: SubmitCorrectionRequestDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest, {}, {}> & import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    recordPunchWithMetadata(recordPunchWithMetadataDto: RecordPunchWithMetadataDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/attendance-record.schema").AttendanceRecord, {}, {}> & import("../models/attendance-record.schema").AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    recordPunchFromDevice(recordPunchWithMetadataDto: RecordPunchWithMetadataDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/attendance-record.schema").AttendanceRecord, {}, {}> & import("../models/attendance-record.schema").AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    enforcePunchPolicy(enforcePunchPolicyDto: EnforcePunchPolicyDto, user: any): Promise<{
        valid: boolean;
        policy: "MULTIPLE" | "FIRST_LAST";
    }>;
    applyAttendanceRounding(applyAttendanceRoundingDto: ApplyAttendanceRoundingDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/attendance-record.schema").AttendanceRecord, {}, {}> & import("../models/attendance-record.schema").AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    enforceShiftPunchPolicy(enforceShiftPunchPolicyDto: EnforceShiftPunchPolicyDto, user: any): Promise<{
        valid: boolean;
    }>;
    submitCorrectionRequest(body: {
        employeeId: string;
        attendanceRecord: string;
        reason: string;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest, {}, {}> & import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getCorrectionRequestsByEmployee(employeeId: string, status?: string, startDate?: string, endDate?: string, user?: any): Promise<{
        employeeId: string;
        summary: {
            total: number;
            submitted: number;
            inReview: number;
            approved: number;
            rejected: number;
        };
        requests: {
            id: any;
            status: import("../models/enums").CorrectionRequestStatus;
            reason: string;
            attendanceRecord: import("../models/attendance-record.schema").AttendanceRecord;
            createdAt: any;
        }[];
    }>;
    getCorrectionRequestById(requestId: string, user: any): Promise<{
        success: boolean;
        message: string;
        request?: undefined;
    } | {
        success: boolean;
        request: {
            id: any;
            employeeId: import("mongoose").Types.ObjectId;
            status: import("../models/enums").CorrectionRequestStatus;
            reason: string;
            attendanceRecord: import("../models/attendance-record.schema").AttendanceRecord;
            createdAt: any;
            updatedAt: any;
        };
        message?: undefined;
    }>;
    getAllCorrectionRequests(status?: string, employeeId?: string, user?: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest, {}, {}> & import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getPendingCorrectionRequestsForManager(managerId?: string, departmentId?: string, limit?: number, user?: any): Promise<{
        summary: {
            total: number;
            submitted: number;
            inReview: number;
            escalated: number;
        };
        requests: {
            id: any;
            employee: import("mongoose").Types.ObjectId;
            status: import("../models/enums").CorrectionRequestStatus;
            reason: string;
            attendanceRecord: import("../models/attendance-record.schema").AttendanceRecord;
            createdAt: any;
            waitingDays: number;
        }[];
        byStatus: {
            submitted: (import("mongoose").Document<unknown, {}, import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest, {}, {}> & import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            inReview: (import("mongoose").Document<unknown, {}, import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest, {}, {}> & import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            escalated: (import("mongoose").Document<unknown, {}, import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest, {}, {}> & import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
        };
    }>;
    markCorrectionRequestInReview(requestId: string, user: any): Promise<{
        success: boolean;
        message: string;
        request?: undefined;
    } | {
        success: boolean;
        message: string;
        request: {
            id: string;
            status: import("../models/enums").CorrectionRequestStatus.IN_REVIEW;
            reviewStartedAt: Date;
            reviewedBy: string;
        };
    }>;
    approveCorrectionRequest(requestId: string, body: {
        reason?: string;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest, {}, {}> & import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectCorrectionRequest(requestId: string, body: {
        reason: string;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest, {}, {}> & import("../models/attendance-correction-request.schema").AttendanceCorrectionRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    escalateCorrectionRequest(requestId: string, body: {
        escalateTo: 'LINE_MANAGER' | 'HR_ADMIN' | 'HR_MANAGER';
        reason?: string;
    }, user: any): Promise<{
        success: boolean;
        message: string;
        request?: undefined;
    } | {
        success: boolean;
        message: string;
        request: {
            id: string;
            status: import("../models/enums").CorrectionRequestStatus.ESCALATED;
            escalatedTo: "HR_MANAGER" | "HR_ADMIN" | "LINE_MANAGER";
            escalatedAt: Date;
        };
    }>;
    cancelCorrectionRequest(requestId: string, body: {
        reason?: string;
    }, user: any): Promise<{
        success: boolean;
        message: string;
        request?: undefined;
    } | {
        success: boolean;
        message: string;
        request: {
            id: string;
            previousStatus: import("../models/enums").CorrectionRequestStatus.SUBMITTED | import("../models/enums").CorrectionRequestStatus.IN_REVIEW;
            newStatus: string;
            cancelledAt: Date;
        };
    }>;
    getCorrectionRequestStatistics(startDate?: string, endDate?: string, departmentId?: string, user?: any): Promise<{
        reportPeriod: {
            startDate: string | Date;
            endDate: string | Date;
        };
        summary: {
            totalRequests: number;
            pendingRequests: number;
            decidedRequests: number;
            approvalRate: string;
        };
        byStatus: {
            submitted: number;
            inReview: number;
            approved: number;
            rejected: number;
            escalated: number;
        };
        recommendations: string[];
        generatedAt: Date;
    }>;
    createTimeException(createTimeExceptionDto: CreateTimeExceptionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateTimeException(id: string, updateTimeExceptionDto: UpdateTimeExceptionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getTimeExceptionsByEmployee(id: string, getTimeExceptionsByEmployeeDto: GetTimeExceptionsByEmployeeDto, user: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    approveTimeException(approveTimeExceptionDto: ApproveTimeExceptionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectTimeException(rejectTimeExceptionDto: RejectTimeExceptionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    escalateTimeException(escalateTimeExceptionDto: EscalateTimeExceptionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllTimeExceptions(status?: string, type?: string, employeeId?: string, assignedTo?: string, startDate?: string, endDate?: string, user?: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getTimeExceptionById(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    resolveTimeException(body: {
        timeExceptionId: string;
        resolutionNotes?: string;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    reassignTimeException(body: {
        timeExceptionId: string;
        newAssigneeId: string;
        reason?: string;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getTimeExceptionStatistics(employeeId?: string, startDate?: string, endDate?: string, user?: any): Promise<{
        total: number;
        pending: number;
        escalated: number;
        byStatus: any;
        byType: any;
    }>;
    bulkApproveTimeExceptions(body: {
        exceptionIds: string[];
    }, user: any): Promise<{
        approved: string[];
        failed: {
            id: string;
            reason: string;
        }[];
    }>;
    bulkRejectTimeExceptions(body: {
        exceptionIds: string[];
        reason: string;
    }, user: any): Promise<{
        rejected: string[];
        failed: {
            id: string;
            reason: string;
        }[];
    }>;
    getPendingExceptionsForHandler(user: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getEscalatedExceptions(user: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    autoEscalateOverdueExceptions(body: {
        thresholdDays: number;
        excludeTypes?: string[];
    }, user: any): Promise<{
        thresholdDays: number;
        thresholdDate: Date;
        summary: {
            totalOverdue: number;
            escalated: number;
            failed: number;
        };
        escalatedIds: string[];
        failedIds: string[];
        executedAt: Date;
    }>;
    getOverdueExceptions(thresholdDays: number, status?: string, user?: any): Promise<{
        thresholdDays: number;
        thresholdDate: Date;
        totalOverdue: number;
        exceptions: {
            id: any;
            employeeId: import("mongoose").Types.ObjectId;
            type: import("../models/enums").TimeExceptionType;
            status: import("../models/enums").TimeExceptionStatus;
            assignedTo: import("mongoose").Types.ObjectId;
            reason: string;
            createdAt: any;
            daysPending: number;
        }[];
    }>;
    getApprovalWorkflowConfig(user: any): Promise<{
        escalationThresholds: {
            autoEscalateAfterDays: number;
            warningAfterDays: number;
            criticalAfterDays: number;
        };
        payrollCutoff: {
            escalateBeforeDays: number;
        };
        workflowStages: {
            status: string;
            description: string;
            nextAction: string;
        }[];
        notificationSettings: {
            notifyOnAssignment: boolean;
            notifyOnStatusChange: boolean;
            notifyOnEscalation: boolean;
            reminderBeforeDeadlineDays: number;
        };
    }>;
    getApprovalWorkflowDashboard(managerId?: string, departmentId?: string, user?: any): Promise<{
        dashboard: {
            totalPending: number;
            open: number;
            pending: number;
            escalated: number;
            approvedToday: number;
            rejectedToday: number;
            myPending: number;
        };
        alerts: {
            warning: number;
            critical: number;
            requiresImmediate: number;
        };
        config: {
            autoEscalateAfterDays: number;
            warningAfterDays: number;
            criticalAfterDays: number;
        };
        generatedAt: Date;
    }>;
    setExceptionDeadline(body: {
        exceptionId: string;
        deadlineDate: Date;
        notifyBeforeDays?: number;
    }, user: any): Promise<{
        success: boolean;
        message: string;
        exception?: undefined;
    } | {
        success: boolean;
        message: string;
        exception: {
            id: string;
            deadline: Date;
            notifyBeforeDays: number;
        };
    }>;
    getRequestsApproachingDeadline(withinDays: number, payrollCutoffDate?: string, user?: any): Promise<{
        withinDays: number;
        payrollCutoffDate: Date;
        totalPending: number;
        byUrgency: {
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
        requests: {
            id: any;
            employee: import("mongoose").Types.ObjectId;
            type: import("../models/enums").TimeExceptionType;
            status: import("../models/enums").TimeExceptionStatus;
            assignedTo: import("mongoose").Types.ObjectId;
            ageInDays: number;
            daysUntilPayroll: number;
            urgency: string;
        }[];
    }>;
    autoCreateLatenessException(body: {
        employeeId: string;
        attendanceRecordId: string;
        assignedTo: string;
        lateMinutes: number;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    autoCreateEarlyLeaveException(body: {
        employeeId: string;
        attendanceRecordId: string;
        assignedTo: string;
        earlyMinutes: number;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    checkExpiringShiftAssignments(body: {
        daysBeforeExpiry?: number;
    }, user: any): Promise<{
        count: number;
        daysBeforeExpiry: number;
        summary: {
            highUrgency: number;
            mediumUrgency: number;
            lowUrgency: number;
        };
        assignments: {
            assignmentId: any;
            employeeId: any;
            employeeName: string;
            employeeEmail: any;
            employeeNumber: any;
            shiftId: any;
            shiftName: any;
            shiftTimes: string;
            departmentId: any;
            departmentName: any;
            positionId: any;
            positionName: any;
            startDate: any;
            endDate: any;
            daysRemaining: number;
            status: any;
            urgency: string;
        }[];
    }>;
    getExpiredUnprocessedAssignments(user: any): Promise<{
        count: number;
        assignments: {
            assignmentId: any;
            employeeId: any;
            employeeName: string;
            shiftName: any;
            endDate: any;
            daysOverdue: number;
        }[];
    }>;
    detectMissedPunches(user: any): Promise<{
        count: number;
        records: any[];
    }>;
    escalateUnresolvedRequestsBeforePayroll(body: {
        payrollCutOffDate: Date;
    }, user: any): Promise<{
        count: number;
        escalated: {
            type: string;
            id: any;
        }[];
    }>;
    monitorRepeatedLateness(monitorRepeatedLatenessDto: MonitorRepeatedLatenessDto, user: any): Promise<{
        employeeId: string;
        count: number;
        threshold: number;
        exceeded: boolean;
    }>;
    triggerLatenessDisciplinary(triggerLatenessDisciplinaryDto: TriggerLatenessDisciplinaryDto, user: any): Promise<{
        message: string;
    }>;
    getEmployeeLatenessHistory(employeeId: string, startDate?: string, endDate?: string, limit?: number, user?: any): Promise<{
        employeeId: string;
        dateRange: {
            startDate: string | Date;
            endDate: string | Date;
        };
        summary: {
            totalOccurrences: number;
            totalLatenessMinutes: number;
            averageLatenessMinutes: number;
        };
        records: {
            id: any;
            date: any;
            status: import("../models/enums").TimeExceptionStatus;
            reason: string;
        }[];
    }>;
    flagEmployeeForRepeatedLateness(body: {
        employeeId: string;
        occurrenceCount: number;
        periodDays: number;
        severity: 'WARNING' | 'WRITTEN_WARNING' | 'FINAL_WARNING' | 'SUSPENSION';
        notes?: string;
    }, user: any): Promise<{
        success: boolean;
        message: string;
        flag: {
            id: any;
            employeeId: string;
            severity: "WARNING" | "WRITTEN_WARNING" | "FINAL_WARNING" | "SUSPENSION";
            occurrenceCount: number;
            periodDays: number;
            createdAt: Date;
            createdBy: string;
        };
        nextSteps: string[];
    }>;
    getLatenesDisciplinaryFlags(status?: 'PENDING' | 'RESOLVED' | 'ESCALATED', severity?: string, startDate?: string, endDate?: string, user?: any): Promise<{
        totalFlags: number;
        filters: {
            status?: "PENDING" | "RESOLVED" | "ESCALATED";
            severity?: string;
            startDate?: Date;
            endDate?: Date;
        };
        flags: {
            id: any;
            employeeId: import("mongoose").Types.ObjectId;
            status: import("../models/enums").TimeExceptionStatus;
            reason: string;
            createdAt: any;
        }[];
    }>;
    analyzeLatenessPatterns(employeeId: string, periodDays?: number, user?: any): Promise<{
        employeeId: string;
        analysisePeriod: {
            days: number;
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalOccurrences: number;
            averagePerWeek: number;
            trend: string;
        };
        dayOfWeekAnalysis: Record<string, number>;
        patterns: {
            mostFrequentDay: string;
            mostFrequentDayCount: number;
            hasWeekendLateness: boolean;
            hasStartOfWeekPattern: boolean;
            hasEndOfWeekPattern: boolean;
        };
        recommendation: string;
    }>;
    getLatenessTrendReport(body: {
        departmentId?: string;
        startDate: string;
        endDate: string;
        groupBy?: 'day' | 'week' | 'month';
    }, user: any): Promise<{
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        groupBy: "day" | "week" | "month";
        summary: {
            totalOccurrences: number;
            uniqueEmployeesAffected: number;
            averagePerPeriod: number;
        };
        trends: {
            period: string;
            occurrences: number;
            uniqueEmployees: number;
        }[];
        generatedAt: Date;
        generatedBy: string;
    }>;
    resolveDisciplinaryFlag(body: {
        flagId: string;
        resolution: 'RESOLVED' | 'ESCALATED' | 'DISMISSED';
        resolutionNotes: string;
    }, user: any): Promise<{
        success: boolean;
        message: string;
        flag?: undefined;
    } | {
        success: boolean;
        message: string;
        flag: {
            id: string;
            employeeId: import("mongoose").Types.ObjectId;
            previousStatus: import("../models/enums").TimeExceptionStatus;
            newStatus: "ESCALATED" | "RESOLVED" | "DISMISSED";
            resolvedAt: Date;
            resolvedBy: string;
        };
    }>;
    getRepeatedLatenessOffenders(threshold: number, periodDays: number, includeResolved?: boolean, user?: any): Promise<{
        analysePeriod: {
            startDate: Date;
            endDate: Date;
            days: number;
        };
        threshold: number;
        summary: {
            totalOffenders: number;
            totalOccurrences: number;
        };
        offenders: {
            employeeId: string;
            occurrenceCount: number;
            exceedsThresholdBy: number;
            recentRecords: any[];
            severity: string;
        }[];
        generatedAt: Date;
    }>;
    scheduleTimeDataBackup(user: any): Promise<{
        message: string;
    }>;
    requestOvertimeApproval(body: {
        employeeId: string;
        attendanceRecordId: string;
        requestedMinutes: number;
        reason: string;
        assignedTo: string;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    calculateOvertimeFromAttendance(attendanceRecordId: string, body: {
        standardWorkMinutes?: number;
    }, user: any): Promise<{
        attendanceRecordId: string;
        employeeId: import("mongoose").Types.ObjectId;
        totalWorkMinutes: number;
        standardWorkMinutes: number;
        overtimeMinutes: number;
        overtimeHours: number;
        isOvertime: boolean;
        requiresApproval: boolean;
    }>;
    getEmployeeOvertimeSummary(employeeId: string, startDate: string, endDate: string, user: any): Promise<{
        employeeId: string;
        period: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalRequests: number;
            approvedRequests: number;
            pendingRequests: number;
            rejectedRequests: number;
            totalApprovedOvertimeMinutes: number;
            totalApprovedOvertimeHours: number;
        };
        requests: (import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getPendingOvertimeRequests(departmentId?: string, assignedTo?: string, user?: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    approveOvertimeRequest(id: string, body: {
        approvalNotes?: string;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectOvertimeRequest(id: string, body: {
        rejectionReason: string;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    autoDetectAndCreateOvertimeException(attendanceRecordId: string, body: {
        standardWorkMinutes?: number;
        assignedTo: string;
    }, user: any): Promise<{
        created: boolean;
        reason: string;
        calculation: {
            attendanceRecordId: string;
            employeeId: import("mongoose").Types.ObjectId;
            totalWorkMinutes: number;
            standardWorkMinutes: number;
            overtimeMinutes: number;
            overtimeHours: number;
            isOvertime: boolean;
            requiresApproval: boolean;
        };
        existingId?: undefined;
        overtimeException?: undefined;
    } | {
        created: boolean;
        reason: string;
        existingId: import("mongoose").Types.ObjectId;
        calculation?: undefined;
        overtimeException?: undefined;
    } | {
        created: boolean;
        overtimeException: import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        calculation: {
            attendanceRecordId: string;
            employeeId: import("mongoose").Types.ObjectId;
            totalWorkMinutes: number;
            standardWorkMinutes: number;
            overtimeMinutes: number;
            overtimeHours: number;
            isOvertime: boolean;
            requiresApproval: boolean;
        };
        reason?: undefined;
        existingId?: undefined;
    }>;
    getOvertimeStatistics(startDate?: string, endDate?: string, departmentId?: string, user?: any): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalApprovedOvertimeMinutes: number;
            totalApprovedOvertimeHours: number;
            approved: number;
            pending: number;
            rejected: number;
            escalated: number;
            totalRequests: number;
        };
        topOvertimeEmployees: {
            hours: number;
            name: string;
            minutes: number;
            count: number;
            employeeId: string;
        }[];
    }>;
    bulkProcessOvertimeRequests(body: {
        action: 'approve' | 'reject';
        requestIds: string[];
        notes: string;
    }, user: any): Promise<{
        processed: string[];
        failed: {
            id: string;
            reason: string;
        }[];
    }>;
    generateOvertimeReport(generateOvertimeReportDto: GenerateOvertimeReportDto, user: any): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        records: (import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        summary: {
            totalRecords: number;
            totalOvertimeMinutes: number;
            totalOvertimeHours: number;
        };
    }>;
    generateLatenessReport(generateLatenessReportDto: GenerateLatenessReportDto, user: any): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        records: (import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        summary: {
            totalRecords: number;
            employees: number;
        };
    }>;
    generateExceptionReport(generateExceptionReportDto: GenerateExceptionReportDto, user: any): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        records: (import("mongoose").Document<unknown, {}, import("../models/time-exception.schema").TimeException, {}, {}> & import("../models/time-exception.schema").TimeException & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        summary: {
            totalRecords: number;
            byType: {
                type: string;
                count: number;
            }[];
        };
    }>;
    exportReport(exportReportDto: ExportReportDto, user: any): Promise<{
        format: "text" | "excel" | "csv";
        data: string;
        reportType: "overtime" | "lateness" | "exception";
        generatedAt: Date;
    }>;
    generateAttendanceSummaryReport(body: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
        departmentId?: string;
        groupBy?: 'day' | 'week' | 'month';
    }, user: any): Promise<{
        reportType: string;
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        filters: {
            employeeId: string;
            departmentId: string;
            groupBy: "day" | "week" | "month";
        };
        summary: {
            totalRecords: number;
            totalWorkMinutes: number;
            totalWorkHours: number;
            avgWorkMinutesPerDay: number;
            avgWorkHoursPerDay: number;
            attendanceRate: string;
        };
        breakdown: {
            onTime: number;
            late: number;
            absent: number;
            earlyLeave: number;
        };
        groupedData: {
            period: string;
            recordCount: number;
            totalWorkMinutes: number;
            avgWorkMinutes: number;
            lateCount: number;
            lateRate: string;
        }[];
        generatedAt: Date;
    }>;
    generateOvertimeCostAnalysis(body: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
        departmentId?: string;
        hourlyRate?: number;
        overtimeMultiplier?: number;
    }, user: any): Promise<{
        reportType: string;
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        filters: {
            employeeId: string;
            departmentId: string;
        };
        rateConfig: {
            hourlyRate: number;
            overtimeMultiplier: number;
        };
        summary: {
            totalOvertimeRequests: number;
            approvedRequests: number;
            pendingRequests: number;
            totalOvertimeHours: number;
            approvedOvertimeHours: number;
            estimatedCost: number;
            currency: string;
        };
        topOvertimeEmployees: {
            employeeId: string;
            name: string;
            totalOvertimeMinutes: number;
            totalOvertimeHours: number;
            approvedMinutes: number;
            estimatedCost: number;
        }[];
        generatedAt: Date;
    }>;
    generatePayrollReadyReport(body: {
        startDate: Date;
        endDate: Date;
        employeeIds?: string[];
        departmentId?: string;
        includeExceptions?: boolean;
        includePenalties?: boolean;
    }, user: any): Promise<{
        reportType: string;
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        filters: {
            employeeIds: string[];
            departmentId: string;
            includeExceptions: boolean;
            includePenalties: boolean;
        };
        meta: {
            employeeCount: number;
            totalRecords: number;
            exceptionsIncluded: number;
        };
        employees: {
            employeeId: string;
            employeeNumber: any;
            employeeName: string;
            email: any;
            attendance: {
                workDays: number;
                absenceDays: number;
                lateDays: number;
                earlyLeaveDays: number;
            };
            hours: {
                totalWorkHours: number;
                regularHours: number;
                overtimeHours: number;
                lateHours: number;
            };
            exceptions: {
                approvedCount: number;
            };
            payrollReady: boolean;
        }[];
        generatedAt: Date;
        generatedBy: string;
    }>;
    generateDisciplinarySummaryReport(body: {
        startDate: Date;
        endDate: Date;
        departmentId?: string;
        severityFilter?: string[];
    }, user: any): Promise<{
        reportType: string;
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        filters: {
            departmentId: string;
            severityFilter: string[];
        };
        summary: {
            totalEmployeesWithIssues: number;
            totalLatenessIncidents: number;
            totalEscalations: number;
            employeesRequiringAction: number;
            escalationRate: string;
        };
        thresholds: {
            disciplinaryThreshold: number;
            verbalWarningAt: number;
            writtenWarningAt: number;
            finalWarningAt: number;
        };
        employeesRequiringAction: {
            employeeId: string;
            employeeName: string;
            employeeNumber: any;
            totalOffenses: number;
            escalatedCount: number;
            warningCount: number;
            recommendedAction: string;
        }[];
        generatedAt: Date;
    }>;
    getTimeManagementAnalyticsDashboard(body: {
        startDate: Date;
        endDate: Date;
        departmentId?: string;
    }, user: any): Promise<{
        reportType: string;
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        filters: {
            departmentId: string;
        };
        attendance: {
            total: number;
            present: number;
            absent: number;
            late: number;
            attendanceRate: string;
            punctualityRate: string;
        };
        workHours: {
            totalHours: number;
            regularHours: number;
            overtimeHours: number;
            avgHoursPerDay: number;
        };
        exceptions: {
            total: number;
            byType: {
                type: string;
                count: number;
            }[];
            byStatus: {
                status: string;
                count: number;
            }[];
            pendingCount: number;
            escalatedCount: number;
        };
        trends: {
            attendanceTrend: string;
            latenessTrend: string;
            overtimeTrend: string;
        };
        generatedAt: Date;
    }>;
    getLatenessLogs(body: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
        departmentId?: string;
        includeResolved?: boolean;
        sortBy?: 'date' | 'employee' | 'duration';
        sortOrder?: 'asc' | 'desc';
    }, user: any): Promise<{
        reportType: string;
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        filters: {
            employeeId: string;
            departmentId: string;
            includeResolved: boolean;
            sortBy: "date" | "employee" | "duration";
            sortOrder: "asc" | "desc";
        };
        summary: {
            totalIncidents: number;
            uniqueEmployees: number;
            totalLateMinutes: number;
            totalLateHours: number;
            avgLateMinutes: number;
            statusBreakdown: {
                status: string;
                count: number;
            }[];
            penaltyStats: {
                incidentsWithPenalty: number;
                totalPenaltyAmount: number;
            };
        };
        logs: {
            logId: any;
            date: any;
            employee: {
                id: any;
                name: string;
                employeeNumber: any;
                email: any;
            };
            lateness: {
                scheduledStart: any;
                actualStart: any;
                lateMinutes: any;
                lateHours: number;
            };
            status: any;
            reason: any;
            assignedTo: {
                id: any;
                name: string;
            };
            penalty: {
                hasPenalty: boolean;
                amount: any;
                type: any;
            };
            createdAt: any;
            updatedAt: any;
        }[];
        generatedAt: Date;
        accessedBy: string;
    }>;
    generateOvertimeAndExceptionComplianceReport(body: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
        departmentId?: string;
        includeAllExceptionTypes?: boolean;
    }, user: any): Promise<{
        reportType: string;
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        filters: {
            employeeId: string;
            departmentId: string;
            includeAllExceptionTypes: boolean;
        };
        overtime: {
            summary: {
                totalOvertimeHours: number;
                approvedOvertimeHours: number;
                totalRequests: number;
                approved: number;
                pending: number;
                rejected: number;
                totalOvertimeMinutes: number;
                approvedOvertimeMinutes: number;
            };
            topEmployees: {
                employeeId: string;
                name: string;
                totalOvertimeHours: number;
            }[];
        };
        exceptions: {
            totalCount: number;
            byType: {
                count: number;
                approved: number;
                pending: number;
                type: string;
            }[];
        };
        compliance: {
            overtimeApprovalRate: number;
            pendingRequiresAction: boolean;
            avgOvertimeHoursPerRequest: number;
            complianceStatus: string;
        };
        payrollReadiness: {
            isReady: boolean;
            pendingItems: number;
            message: string;
        };
        generatedAt: Date;
        generatedBy: string;
    }>;
    getEmployeeAttendanceHistory(body: {
        employeeId: string;
        startDate: Date;
        endDate: Date;
        includeExceptions?: boolean;
        includeOvertime?: boolean;
    }, user: any): Promise<{
        reportType: string;
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        employee: {
            id: any;
            name: string;
            employeeNumber: any;
            email: any;
        };
        summary: {
            attendanceRate: string;
            punctualityRate: string;
            avgWorkHoursPerDay: number;
            totalDays: number;
            presentDays: number;
            absentDays: number;
            lateDays: number;
            earlyLeaveDays: number;
            totalWorkHours: number;
            totalOvertimeHours: number;
            totalLateMinutes: number;
            totalExceptions: number;
            totalPenalties: number;
        };
        records: {
            date: any;
            clockIn: any;
            clockOut: any;
            totalWorkMinutes: any;
            totalWorkHours: number;
            regularHours: number;
            overtime: {
                hasOvertime: boolean;
                minutes: number;
                hours: number;
            };
            status: {
                isPresent: boolean;
                isLate: any;
                lateMinutes: any;
                earlyLeave: any;
            };
            exceptions: {
                id: any;
                type: any;
                status: any;
                reason: any;
            }[];
            penalties: {
                hasPenalty: boolean;
                amount: any;
            };
        }[];
        generatedAt: Date;
        accessedBy: string;
    }>;
    exportOvertimeExceptionReport(body: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
        departmentId?: string;
        format: 'excel' | 'csv' | 'text';
    }, user: any): Promise<{
        exportType: string;
        format: "text" | "excel" | "csv";
        data: string;
        reportPeriod: {
            startDate: Date;
            endDate: Date;
        };
        generatedAt: Date;
        exportedBy: string;
    }>;
}
