import { Model } from 'mongoose';
import { AttendanceRecord } from '../models/attendance-record.schema';
import { AttendanceCorrectionRequest } from '../models/attendance-correction-request.schema';
import { TimeException } from '../models/time-exception.schema';
import { ShiftAssignment } from '../models/shift-assignment.schema';
import { TimeExceptionStatus, TimeExceptionType, PunchType, CorrectionRequestStatus } from '../models/enums';
import { ApplyAttendanceRoundingDto, EnforcePunchPolicyDto, EnforceShiftPunchPolicyDto, MonitorRepeatedLatenessDto, RecordPunchWithMetadataDto, TriggerLatenessDisciplinaryDto } from '../DTOs/time-permission.dtos';
import { GenerateOvertimeReportDto, GenerateLatenessReportDto, GenerateExceptionReportDto, ExportReportDto } from '../DTOs/reporting.dtos';
export declare class TimeManagementService {
    private attendanceRecordModel;
    private correctionRequestModel;
    private timeExceptionModel;
    private shiftAssignmentModel;
    private readonly auditLogs;
    constructor(attendanceRecordModel: Model<AttendanceRecord>, correctionRequestModel: Model<AttendanceCorrectionRequest>, timeExceptionModel: Model<TimeException>, shiftAssignmentModel: Model<ShiftAssignment>);
    clockInWithID(employeeId: string, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, AttendanceRecord, {}, {}> & AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    clockOutWithID(employeeId: string, currentUserId: string): Promise<any>;
    clockInWithMetadata(employeeId: string, metadata: {
        source: 'BIOMETRIC' | 'WEB' | 'MOBILE' | 'MANUAL';
        deviceId?: string;
        terminalId?: string;
        location?: string;
        gpsCoordinates?: {
            lat: number;
            lng: number;
        };
        ipAddress?: string;
    }, currentUserId: string): Promise<{
        attendanceRecord: import("mongoose").Document<unknown, {}, AttendanceRecord, {}, {}> & AttendanceRecord & {
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
    clockOutWithMetadata(employeeId: string, metadata: {
        source: 'BIOMETRIC' | 'WEB' | 'MOBILE' | 'MANUAL';
        deviceId?: string;
        terminalId?: string;
        location?: string;
        gpsCoordinates?: {
            lat: number;
            lng: number;
        };
        ipAddress?: string;
    }, currentUserId: string): Promise<{
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
    validateClockInAgainstShift(employeeId: string, currentUserId: string): Promise<{
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
    getEmployeeAttendanceStatus(employeeId: string, currentUserId: string): Promise<{
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
        lastPunchType: PunchType;
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
    createAttendanceRecord(createAttendanceRecordDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, AttendanceRecord, {}, {}> & AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateAttendanceRecord(id: string, updateAttendanceRecordDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, AttendanceRecord, {}, {}> & AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    submitAttendanceCorrectionRequest(submitCorrectionRequestDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, AttendanceCorrectionRequest, {}, {}> & AttendanceCorrectionRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllCorrectionRequests(getAllCorrectionsDto: any, currentUserId: string): Promise<(import("mongoose").Document<unknown, {}, AttendanceCorrectionRequest, {}, {}> & AttendanceCorrectionRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    approveCorrectionRequest(approveCorrectionRequestDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, AttendanceCorrectionRequest, {}, {}> & AttendanceCorrectionRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectCorrectionRequest(rejectCorrectionRequestDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, AttendanceCorrectionRequest, {}, {}> & AttendanceCorrectionRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getCorrectionRequestsByEmployee(params: {
        employeeId: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
    }, currentUserId: string): Promise<{
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
            status: CorrectionRequestStatus;
            reason: string;
            attendanceRecord: AttendanceRecord;
            createdAt: any;
        }[];
    }>;
    getCorrectionRequestById(requestId: string, currentUserId: string): Promise<{
        success: boolean;
        message: string;
        request?: undefined;
    } | {
        success: boolean;
        request: {
            id: any;
            employeeId: import("mongoose").Types.ObjectId;
            status: CorrectionRequestStatus;
            reason: string;
            attendanceRecord: AttendanceRecord;
            createdAt: any;
            updatedAt: any;
        };
        message?: undefined;
    }>;
    escalateCorrectionRequest(params: {
        requestId: string;
        escalateTo: 'LINE_MANAGER' | 'HR_ADMIN' | 'HR_MANAGER';
        reason?: string;
    }, currentUserId: string): Promise<{
        success: boolean;
        message: string;
        request?: undefined;
    } | {
        success: boolean;
        message: string;
        request: {
            id: string;
            status: CorrectionRequestStatus.ESCALATED;
            escalatedTo: "HR_MANAGER" | "HR_ADMIN" | "LINE_MANAGER";
            escalatedAt: Date;
        };
    }>;
    cancelCorrectionRequest(params: {
        requestId: string;
        reason?: string;
    }, currentUserId: string): Promise<{
        success: boolean;
        message: string;
        request?: undefined;
    } | {
        success: boolean;
        message: string;
        request: {
            id: string;
            previousStatus: CorrectionRequestStatus.SUBMITTED | CorrectionRequestStatus.IN_REVIEW;
            newStatus: string;
            cancelledAt: Date;
        };
    }>;
    getPendingCorrectionRequestsForManager(params: {
        managerId?: string;
        departmentId?: string;
        limit?: number;
    }, currentUserId: string): Promise<{
        summary: {
            total: number;
            submitted: number;
            inReview: number;
            escalated: number;
        };
        requests: {
            id: any;
            employee: import("mongoose").Types.ObjectId;
            status: CorrectionRequestStatus;
            reason: string;
            attendanceRecord: AttendanceRecord;
            createdAt: any;
            waitingDays: number;
        }[];
        byStatus: {
            submitted: (import("mongoose").Document<unknown, {}, AttendanceCorrectionRequest, {}, {}> & AttendanceCorrectionRequest & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            inReview: (import("mongoose").Document<unknown, {}, AttendanceCorrectionRequest, {}, {}> & AttendanceCorrectionRequest & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            escalated: (import("mongoose").Document<unknown, {}, AttendanceCorrectionRequest, {}, {}> & AttendanceCorrectionRequest & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
        };
    }>;
    markCorrectionRequestInReview(requestId: string, currentUserId: string): Promise<{
        success: boolean;
        message: string;
        request?: undefined;
    } | {
        success: boolean;
        message: string;
        request: {
            id: string;
            status: CorrectionRequestStatus.IN_REVIEW;
            reviewStartedAt: Date;
            reviewedBy: string;
        };
    }>;
    getCorrectionRequestStatistics(params: {
        startDate?: Date;
        endDate?: Date;
        departmentId?: string;
    }, currentUserId: string): Promise<{
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
    createTimeException(createTimeExceptionDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateTimeException(id: string, updateTimeExceptionDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getTimeExceptionsByEmployee(employeeId: string, getTimeExceptionsDto: any, currentUserId: string): Promise<(import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    approveTimeException(approveTimeExceptionDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectTimeException(rejectTimeExceptionDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    escalateTimeException(escalateTimeExceptionDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllTimeExceptions(filters: {
        status?: string;
        type?: string;
        employeeId?: string;
        assignedTo?: string;
        startDate?: Date;
        endDate?: Date;
    }, currentUserId: string): Promise<(import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getTimeExceptionById(id: string, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    resolveTimeException(resolveTimeExceptionDto: {
        timeExceptionId: string;
        resolutionNotes?: string;
    }, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    reassignTimeException(reassignDto: {
        timeExceptionId: string;
        newAssigneeId: string;
        reason?: string;
    }, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getTimeExceptionStatistics(filters: {
        employeeId?: string;
        startDate?: Date;
        endDate?: Date;
    }, currentUserId: string): Promise<{
        total: number;
        pending: number;
        escalated: number;
        byStatus: any;
        byType: any;
    }>;
    bulkApproveTimeExceptions(exceptionIds: string[], currentUserId: string): Promise<{
        approved: string[];
        failed: {
            id: string;
            reason: string;
        }[];
    }>;
    bulkRejectTimeExceptions(rejectDto: {
        exceptionIds: string[];
        reason: string;
    }, currentUserId: string): Promise<{
        rejected: string[];
        failed: {
            id: string;
            reason: string;
        }[];
    }>;
    autoCreateLatenessException(employeeId: string, attendanceRecordId: string, assignedTo: string, lateMinutes: number, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    autoCreateEarlyLeaveException(employeeId: string, attendanceRecordId: string, assignedTo: string, earlyMinutes: number, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getPendingExceptionsForHandler(assignedTo: string, currentUserId: string): Promise<(import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getEscalatedExceptions(currentUserId: string): Promise<(import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    autoEscalateOverdueExceptions(params: {
        thresholdDays: number;
        excludeTypes?: string[];
    }, currentUserId: string): Promise<{
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
    getOverdueExceptions(params: {
        thresholdDays: number;
        status?: string[];
    }, currentUserId: string): Promise<{
        thresholdDays: number;
        thresholdDate: Date;
        totalOverdue: number;
        exceptions: {
            id: any;
            employeeId: import("mongoose").Types.ObjectId;
            type: TimeExceptionType;
            status: TimeExceptionStatus;
            assignedTo: import("mongoose").Types.ObjectId;
            reason: string;
            createdAt: any;
            daysPending: number;
        }[];
    }>;
    getApprovalWorkflowConfig(currentUserId: string): Promise<{
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
    getApprovalWorkflowDashboard(params: {
        managerId?: string;
        departmentId?: string;
    }, currentUserId: string): Promise<{
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
    setExceptionDeadline(params: {
        exceptionId: string;
        deadlineDate: Date;
        notifyBeforeDays?: number;
    }, currentUserId: string): Promise<{
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
    getRequestsApproachingDeadline(params: {
        withinDays: number;
        payrollCutoffDate?: Date;
    }, currentUserId: string): Promise<{
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
            type: TimeExceptionType;
            status: TimeExceptionStatus;
            assignedTo: import("mongoose").Types.ObjectId;
            ageInDays: number;
            daysUntilPayroll: number;
            urgency: string;
        }[];
    }>;
    requestOvertimeApproval(overtimeRequest: {
        employeeId: string;
        attendanceRecordId: string;
        requestedMinutes: number;
        reason: string;
        assignedTo: string;
    }, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    calculateOvertimeFromAttendance(attendanceRecordId: string, standardWorkMinutes: number, currentUserId: string): Promise<{
        attendanceRecordId: string;
        employeeId: import("mongoose").Types.ObjectId;
        totalWorkMinutes: number;
        standardWorkMinutes: number;
        overtimeMinutes: number;
        overtimeHours: number;
        isOvertime: boolean;
        requiresApproval: boolean;
    }>;
    getEmployeeOvertimeSummary(employeeId: string, startDate: Date, endDate: Date, currentUserId: string): Promise<{
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
        requests: (import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getPendingOvertimeRequests(filters: {
        departmentId?: string;
        assignedTo?: string;
    }, currentUserId: string): Promise<(import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    approveOvertimeRequest(overtimeRequestId: string, approvalNotes: string | undefined, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectOvertimeRequest(overtimeRequestId: string, rejectionReason: string, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    autoDetectAndCreateOvertimeException(attendanceRecordId: string, standardWorkMinutes: number, assignedTo: string, currentUserId: string): Promise<{
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
        overtimeException: import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
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
    getOvertimeStatistics(filters: {
        startDate?: Date;
        endDate?: Date;
        departmentId?: string;
    }, currentUserId: string): Promise<{
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
    bulkProcessOvertimeRequests(action: 'approve' | 'reject', requestIds: string[], notes: string, currentUserId: string): Promise<{
        processed: string[];
        failed: {
            id: string;
            reason: string;
        }[];
    }>;
    recordPunchWithMetadata(recordPunchWithMetadataDto: RecordPunchWithMetadataDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, AttendanceRecord, {}, {}> & AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    recordPunchFromDevice(recordPunchWithMetadataDto: RecordPunchWithMetadataDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, AttendanceRecord, {}, {}> & AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    enforcePunchPolicy(enforcePunchPolicyDto: EnforcePunchPolicyDto, currentUserId: string): Promise<{
        valid: boolean;
        policy: "MULTIPLE" | "FIRST_LAST";
    }>;
    applyAttendanceRounding(applyAttendanceRoundingDto: ApplyAttendanceRoundingDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, AttendanceRecord, {}, {}> & AttendanceRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    enforceShiftPunchPolicy(enforceShiftPunchPolicyDto: EnforceShiftPunchPolicyDto, currentUserId: string): Promise<{
        valid: boolean;
    }>;
    monitorRepeatedLateness(monitorRepeatedLatenessDto: MonitorRepeatedLatenessDto, currentUserId: string): Promise<{
        employeeId: string;
        count: number;
        threshold: number;
        exceeded: boolean;
    }>;
    triggerLatenessDisciplinary(triggerLatenessDisciplinaryDto: TriggerLatenessDisciplinaryDto, currentUserId: string): Promise<{
        message: string;
    }>;
    getEmployeeLatenessHistory(params: {
        employeeId: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }, currentUserId: string): Promise<{
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
            status: TimeExceptionStatus;
            reason: string;
        }[];
    }>;
    flagEmployeeForRepeatedLateness(params: {
        employeeId: string;
        occurrenceCount: number;
        periodDays: number;
        severity: 'WARNING' | 'WRITTEN_WARNING' | 'FINAL_WARNING' | 'SUSPENSION';
        notes?: string;
    }, currentUserId: string): Promise<{
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
    private getDisciplinaryNextSteps;
    getLatenesDisciplinaryFlags(params: {
        status?: 'PENDING' | 'RESOLVED' | 'ESCALATED';
        severity?: string;
        startDate?: Date;
        endDate?: Date;
    }, currentUserId: string): Promise<{
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
            status: TimeExceptionStatus;
            reason: string;
            createdAt: any;
        }[];
    }>;
    analyzeLatenessPatterns(params: {
        employeeId: string;
        periodDays?: number;
    }, currentUserId: string): Promise<{
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
    private getLatenessPatternRecommendation;
    getLatenessTrendReport(params: {
        departmentId?: string;
        startDate: Date;
        endDate: Date;
        groupBy?: 'day' | 'week' | 'month';
    }, currentUserId: string): Promise<{
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
    resolveDisciplinaryFlag(params: {
        flagId: string;
        resolution: 'RESOLVED' | 'ESCALATED' | 'DISMISSED';
        resolutionNotes: string;
    }, currentUserId: string): Promise<{
        success: boolean;
        message: string;
        flag?: undefined;
    } | {
        success: boolean;
        message: string;
        flag: {
            id: string;
            employeeId: import("mongoose").Types.ObjectId;
            previousStatus: TimeExceptionStatus;
            newStatus: "ESCALATED" | "RESOLVED" | "DISMISSED";
            resolvedAt: Date;
            resolvedBy: string;
        };
    }>;
    getRepeatedLatenessOffenders(params: {
        threshold: number;
        periodDays: number;
        includeResolved?: boolean;
    }, currentUserId: string): Promise<{
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
    private calculateLatenesSeverity;
    scheduleTimeDataBackup(currentUserId: string): Promise<{
        message: string;
    }>;
    checkExpiringShiftAssignments(daysBeforeExpiry: number, currentUserId: string): Promise<{
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
    getExpiredUnprocessedAssignments(currentUserId: string): Promise<{
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
    detectMissedPunches(currentUserId: string): Promise<{
        count: number;
        records: any[];
    }>;
    escalateUnresolvedRequestsBeforePayroll(payrollCutOffDate: Date, currentUserId: string): Promise<{
        count: number;
        escalated: {
            type: string;
            id: any;
        }[];
    }>;
    generateOvertimeReport(generateOvertimeReportDto: GenerateOvertimeReportDto, currentUserId: string): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        records: (import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
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
    generateLatenessReport(generateLatenessReportDto: GenerateLatenessReportDto, currentUserId: string): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        records: (import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        summary: {
            totalRecords: number;
            employees: number;
        };
    }>;
    generateExceptionReport(generateExceptionReportDto: GenerateExceptionReportDto, currentUserId: string): Promise<{
        employeeId: string;
        startDate: Date;
        endDate: Date;
        records: (import("mongoose").Document<unknown, {}, TimeException, {}, {}> & TimeException & {
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
    exportReport(exportReportDto: ExportReportDto, currentUserId: string): Promise<{
        format: "text" | "excel" | "csv";
        data: string;
        reportType: "overtime" | "lateness" | "exception";
        generatedAt: Date;
    }>;
    private logTimeManagementChange;
    private logAttendanceChange;
    private calculateWorkMinutesFromPunches;
    private roundMinutes;
    private timeStringToMinutes;
    private dateToMinutes;
    private dateToMinutesUTC;
    private convertDateToUTCStart;
    private convertDateToUTCEnd;
    private formatAsCSV;
    private formatAsText;
    generateAttendanceSummaryReport(params: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
        departmentId?: string;
        groupBy?: 'day' | 'week' | 'month';
    }, currentUserId: string): Promise<{
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
    private groupAttendanceData;
    generateOvertimeCostAnalysis(params: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
        departmentId?: string;
        hourlyRate?: number;
        overtimeMultiplier?: number;
    }, currentUserId: string): Promise<{
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
    generatePayrollReadyReport(params: {
        startDate: Date;
        endDate: Date;
        employeeIds?: string[];
        departmentId?: string;
        includeExceptions?: boolean;
        includePenalties?: boolean;
    }, currentUserId: string): Promise<{
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
    generateDisciplinarySummaryReport(params: {
        startDate: Date;
        endDate: Date;
        departmentId?: string;
        severityFilter?: string[];
    }, currentUserId: string): Promise<{
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
    getTimeManagementAnalyticsDashboard(params: {
        startDate: Date;
        endDate: Date;
        departmentId?: string;
    }, currentUserId: string): Promise<{
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
    getLatenessLogs(params: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
        departmentId?: string;
        includeResolved?: boolean;
        sortBy?: 'date' | 'employee' | 'duration';
        sortOrder?: 'asc' | 'desc';
    }, currentUserId: string): Promise<{
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
    generateOvertimeAndExceptionComplianceReport(params: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
        departmentId?: string;
        includeAllExceptionTypes?: boolean;
    }, currentUserId: string): Promise<{
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
    getEmployeeAttendanceHistory(params: {
        employeeId: string;
        startDate: Date;
        endDate: Date;
        includeExceptions?: boolean;
        includeOvertime?: boolean;
    }, currentUserId: string): Promise<{
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
    exportOvertimeExceptionReport(params: {
        startDate: Date;
        endDate: Date;
        employeeId?: string;
        departmentId?: string;
        format: 'excel' | 'csv' | 'text';
    }, currentUserId: string): Promise<{
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
    private formatOvertimeExceptionAsCSV;
    private formatOvertimeExceptionAsText;
}
