import { PolicyConfigService } from '../services/policy-config.service';
import { CreateOvertimeRuleDto, UpdateOvertimeRuleDto, CreateLatenessRuleDto, UpdateLatenessRuleDto, CreateHolidayDto, UpdateHolidayDto, GetHolidaysDto, GetPoliciesDto, CheckHolidayDto, ValidateAttendanceHolidayDto } from '../DTOs/policy-config.dtos';
export declare class PolicyConfigController {
    private readonly policyConfigService;
    constructor(policyConfigService: PolicyConfigService);
    createOvertimeRule(createOvertimeRuleDto: CreateOvertimeRuleDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/overtime-rule.schema").OvertimeRule, {}, {}> & import("../models/overtime-rule.schema").OvertimeRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getOvertimeRules(getPoliciesDto: GetPoliciesDto, user: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/overtime-rule.schema").OvertimeRule, {}, {}> & import("../models/overtime-rule.schema").OvertimeRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getOvertimeRuleById(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/overtime-rule.schema").OvertimeRule, {}, {}> & import("../models/overtime-rule.schema").OvertimeRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateOvertimeRule(id: string, updateOvertimeRuleDto: UpdateOvertimeRuleDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/overtime-rule.schema").OvertimeRule, {}, {}> & import("../models/overtime-rule.schema").OvertimeRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteOvertimeRule(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/overtime-rule.schema").OvertimeRule, {}, {}> & import("../models/overtime-rule.schema").OvertimeRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getApplicableOvertimeRules(date: string, user: any): Promise<{
        date: Date;
        isHoliday: boolean;
        holidayName: string;
        isWeekend: boolean;
        dayOfWeek: string;
        applicableRules: (import("mongoose").Document<unknown, {}, import("../models/overtime-rule.schema").OvertimeRule, {}, {}> & import("../models/overtime-rule.schema").OvertimeRule & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        recommendation: string;
    }>;
    calculateOvertimeForAttendance(body: {
        attendanceRecordId: string;
        totalWorkMinutes: number;
        standardWorkMinutes?: number;
        date: string;
    }, user: any): Promise<{
        attendanceRecordId: string;
        date: Date;
        standardWorkMinutes: number;
        actualWorkMinutes: number;
        overtime: {
            minutes: number;
            hours: number;
            type: string;
            multiplier: number;
            compensationMinutes: number;
        };
        shortTime: {
            minutes: number;
            hours: number;
            hasShortTime: boolean;
        };
        applicableRules: {
            isHoliday: boolean;
            isWeekend: boolean;
            dayOfWeek: string;
        };
    }>;
    getShortTimeConfig(user: any): Promise<{
        standardWorkMinutes: number;
        minimumWorkMinutes: number;
        shortTimeThresholdMinutes: number;
        deductionPerMinute: number;
        policies: {
            allowHalfDay: boolean;
            allowQuarterDay: boolean;
            requiresApproval: boolean;
            deductFromLeave: boolean;
            deductFromSalary: boolean;
        };
    }>;
    calculateShortTimeForAttendance(body: {
        attendanceRecordId: string;
        totalWorkMinutes: number;
        standardWorkMinutes?: number;
        date: string;
    }, user: any): Promise<{
        attendanceRecordId: string;
        date: Date;
        standardWorkMinutes: number;
        actualWorkMinutes: number;
        shortTime: {
            minutes: number;
            hours: number;
            applyShortTime: boolean;
            belowThreshold: boolean;
        };
        workType: string;
        config: {
            standardWorkMinutes: number;
            minimumWorkMinutes: number;
            shortTimeThresholdMinutes: number;
            deductionPerMinute: number;
            policies: {
                allowHalfDay: boolean;
                allowQuarterDay: boolean;
                requiresApproval: boolean;
                deductFromLeave: boolean;
                deductFromSalary: boolean;
            };
        };
        recommendation: string;
    }>;
    validateOvertimePreApproval(body: {
        employeeId: string;
        date: string;
        expectedOvertimeMinutes: number;
    }, user: any): Promise<{
        employeeId: string;
        date: Date;
        expectedOvertimeMinutes: number;
        expectedOvertimeHours: number;
        preApprovalRequired: boolean;
        reason: string;
        dateInfo: {
            isHoliday: boolean;
            isWeekend: boolean;
            dayOfWeek: string;
        };
    }>;
    getOvertimeLimitsConfig(user: any): Promise<{
        daily: {
            maxOvertimeMinutes: number;
            maxOvertimeHours: number;
            softLimitMinutes: number;
        };
        weekly: {
            maxOvertimeMinutes: number;
            maxOvertimeHours: number;
            softLimitMinutes: number;
        };
        monthly: {
            maxOvertimeMinutes: number;
            maxOvertimeHours: number;
            softLimitMinutes: number;
        };
        policies: {
            enforceHardLimits: boolean;
            requireApprovalAboveSoftLimit: boolean;
            carryOverAllowed: boolean;
        };
    }>;
    checkOvertimeLimits(body: {
        employeeId: string;
        currentOvertimeMinutes: number;
        period: 'daily' | 'weekly' | 'monthly';
        additionalOvertimeMinutes?: number;
    }, user: any): Promise<{
        employeeId: string;
        period: "daily" | "weekly" | "monthly";
        limits: {
            maxOvertimeMinutes: number;
            maxOvertimeHours: number;
            softLimitMinutes: number;
        } | {
            maxOvertimeMinutes: number;
            maxOvertimeHours: number;
            softLimitMinutes: number;
        } | {
            maxOvertimeMinutes: number;
            maxOvertimeHours: number;
            softLimitMinutes: number;
        };
        current: {
            minutes: number;
            hours: number;
        };
        projected: {
            minutes: number;
            hours: number;
        };
        remaining: {
            toSoftLimit: number;
            toHardLimit: number;
        };
        status: {
            withinSoftLimit: boolean;
            withinHardLimit: boolean;
            requiresApproval: boolean;
            blocked: boolean;
        };
        recommendation: string;
    }>;
    getOvertimeShortTimePolicySummary(user: any): Promise<{
        generatedAt: Date;
        overtime: {
            rules: (import("mongoose").Document<unknown, {}, import("../models/overtime-rule.schema").OvertimeRule, {}, {}> & import("../models/overtime-rule.schema").OvertimeRule & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            limits: {
                daily: {
                    maxOvertimeMinutes: number;
                    maxOvertimeHours: number;
                    softLimitMinutes: number;
                };
                weekly: {
                    maxOvertimeMinutes: number;
                    maxOvertimeHours: number;
                    softLimitMinutes: number;
                };
                monthly: {
                    maxOvertimeMinutes: number;
                    maxOvertimeHours: number;
                    softLimitMinutes: number;
                };
                policies: {
                    enforceHardLimits: boolean;
                    requireApprovalAboveSoftLimit: boolean;
                    carryOverAllowed: boolean;
                };
            };
            multipliers: {
                regular: number;
                weekend: number;
                holiday: number;
            };
            preApprovalThresholdMinutes: number;
        };
        shortTime: {
            standardWorkMinutes: number;
            minimumWorkMinutes: number;
            shortTimeThresholdMinutes: number;
            deductionPerMinute: number;
            policies: {
                allowHalfDay: boolean;
                allowQuarterDay: boolean;
                requiresApproval: boolean;
                deductFromLeave: boolean;
                deductFromSalary: boolean;
            };
        };
        weekendDays: string[];
        standardWorkMinutes: number;
        standardWorkHours: number;
    }>;
    createLatenessRule(createLatenessRuleDto: CreateLatenessRuleDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/lateness-rule.schema").LatenessRule, {}, {}> & import("../models/lateness-rule.schema").LatenessRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getLatenessRules(getPoliciesDto: GetPoliciesDto, user: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/lateness-rule.schema").LatenessRule, {}, {}> & import("../models/lateness-rule.schema").LatenessRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getLatenessRuleById(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/lateness-rule.schema").LatenessRule, {}, {}> & import("../models/lateness-rule.schema").LatenessRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateLatenessRule(id: string, updateLatenessRuleDto: UpdateLatenessRuleDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/lateness-rule.schema").LatenessRule, {}, {}> & import("../models/lateness-rule.schema").LatenessRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteLatenessRule(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/lateness-rule.schema").LatenessRule, {}, {}> & import("../models/lateness-rule.schema").LatenessRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getLatenessThresholdsConfig(user: any): Promise<{
        gracePeriodMinutes: number;
        thresholds: {
            minor: {
                minMinutes: number;
                maxMinutes: number;
                description: string;
                action: string;
                deductionMultiplier: number;
            };
            moderate: {
                minMinutes: number;
                maxMinutes: number;
                description: string;
                action: string;
                deductionMultiplier: number;
            };
            significant: {
                minMinutes: number;
                maxMinutes: number;
                description: string;
                action: string;
                deductionMultiplier: number;
            };
            severe: {
                minMinutes: number;
                maxMinutes: any;
                description: string;
                action: string;
                deductionMultiplier: number;
            };
        };
        escalationPolicy: {
            escalateAfterMinutes: number;
            escalateAfterOccurrences: number;
            escalationPeriodDays: number;
            notifyManager: boolean;
            notifyHR: boolean;
        };
        deductionPolicy: {
            deductFromSalary: boolean;
            deductFromLeave: boolean;
            maxDeductionPerDay: number;
            currency: string;
        };
    }>;
    calculateLatenessForAttendance(body: {
        attendanceRecordId: string;
        scheduledStartMinutes: number;
        actualArrivalMinutes: number;
        gracePeriodMinutes?: number;
    }, user: any): Promise<{
        attendanceRecordId: string;
        scheduledStartMinutes: number;
        actualArrivalMinutes: number;
        gracePeriodMinutes: number;
        lateness: {
            rawMinutes: number;
            effectiveMinutes: number;
            withinGracePeriod: boolean;
        };
        category: string;
        action: string;
        deduction: {
            perMinuteRate: number;
            multiplier: number;
            baseAmount: number;
            totalAmount: number;
        };
        requiresEscalation: boolean;
        recommendation: string;
    }>;
    checkLatenessEscalation(body: {
        employeeId: string;
        currentLatenessMinutes: number;
        periodDays?: number;
    }, user: any): Promise<{
        employeeId: string;
        currentLatenessMinutes: number;
        thresholds: {
            timeThreshold: number;
            occurrenceThreshold: number;
            periodDays: number;
        };
        status: {
            exceedsTimeThreshold: boolean;
            requiresEscalation: boolean;
            escalationLevel: string;
        };
        notifications: {
            notifyManager: boolean;
            notifyHR: boolean;
        };
        recommendation: string;
    }>;
    applyLatenessDeduction(body: {
        employeeId: string;
        attendanceRecordId: string;
        latenessMinutes: number;
        latenessRuleId?: string;
    }, user: any): Promise<{
        success: boolean;
        message: string;
        deductionApplied: boolean;
        latenessDetails?: undefined;
        employeeId?: undefined;
        attendanceRecordId?: undefined;
        deduction?: undefined;
        appliedAt?: undefined;
        appliedBy?: undefined;
    } | {
        success: boolean;
        message: string;
        deductionApplied: boolean;
        latenessDetails: {
            rawMinutes: number;
            gracePeriod: any;
            effectiveMinutes: number;
        };
        employeeId?: undefined;
        attendanceRecordId?: undefined;
        deduction?: undefined;
        appliedAt?: undefined;
        appliedBy?: undefined;
    } | {
        success: boolean;
        message: string;
        deductionApplied: boolean;
        employeeId: string;
        attendanceRecordId: string;
        latenessDetails: {
            rawMinutes: number;
            gracePeriod: any;
            effectiveMinutes: number;
        };
        deduction: {
            ruleId: any;
            ruleName: any;
            ratePerMinute: any;
            amount: number;
        };
        appliedAt: Date;
        appliedBy: string;
    }>;
    getLatenesPenaltySummary(user: any): Promise<{
        generatedAt: Date;
        activeRules: {
            id: any;
            name: string;
            description: string;
            gracePeriodMinutes: number;
            deductionPerMinute: number;
        }[];
        thresholds: {
            minor: {
                minMinutes: number;
                maxMinutes: number;
                description: string;
                action: string;
                deductionMultiplier: number;
            };
            moderate: {
                minMinutes: number;
                maxMinutes: number;
                description: string;
                action: string;
                deductionMultiplier: number;
            };
            significant: {
                minMinutes: number;
                maxMinutes: number;
                description: string;
                action: string;
                deductionMultiplier: number;
            };
            severe: {
                minMinutes: number;
                maxMinutes: any;
                description: string;
                action: string;
                deductionMultiplier: number;
            };
        };
        escalationPolicy: {
            escalateAfterMinutes: number;
            escalateAfterOccurrences: number;
            escalationPeriodDays: number;
            notifyManager: boolean;
            notifyHR: boolean;
        };
        deductionPolicy: {
            deductFromSalary: boolean;
            deductFromLeave: boolean;
            maxDeductionPerDay: number;
            currency: string;
        };
        summary: {
            totalActiveRules: number;
            defaultGracePeriod: number;
            escalationThresholdMinutes: number;
            escalationOccurrences: number;
        };
    }>;
    calculateEarlyLeavePenalty(body: {
        attendanceRecordId: string;
        scheduledEndMinutes: number;
        actualDepartureMinutes: number;
        gracePeriodMinutes?: number;
    }, user: any): Promise<{
        attendanceRecordId: string;
        scheduledEndMinutes: number;
        actualDepartureMinutes: number;
        gracePeriodMinutes: number;
        earlyLeave: {
            rawMinutes: number;
            effectiveMinutes: number;
            withinGracePeriod: boolean;
        };
        category: string;
        action: string;
        deduction: {
            perMinuteRate: number;
            multiplier: number;
            baseAmount: number;
            totalAmount: number;
        };
        requiresEscalation: boolean;
        recommendation: string;
    }>;
    createHoliday(createHolidayDto: CreateHolidayDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/holiday.schema").Holiday, {}, {}> & import("../models/holiday.schema").Holiday & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getHolidays(getHolidaysDto: GetHolidaysDto, user: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/holiday.schema").Holiday, {}, {}> & import("../models/holiday.schema").Holiday & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getUpcomingHolidays(days?: number, user?: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/holiday.schema").Holiday, {}, {}> & import("../models/holiday.schema").Holiday & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getHolidayById(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/holiday.schema").Holiday, {}, {}> & import("../models/holiday.schema").Holiday & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateHoliday(id: string, updateHolidayDto: UpdateHolidayDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/holiday.schema").Holiday, {}, {}> & import("../models/holiday.schema").Holiday & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteHoliday(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/holiday.schema").Holiday, {}, {}> & import("../models/holiday.schema").Holiday & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    configureWeeklyRestDays(body: {
        restDays: number[];
        effectiveFrom?: Date;
        effectiveTo?: Date;
        departmentId?: string;
    }, user: any): Promise<{
        success: boolean;
        message: string;
        configuration?: undefined;
        penaltySuppression?: undefined;
        configuredAt?: undefined;
        configuredBy?: undefined;
    } | {
        success: boolean;
        configuration: {
            restDays: number[];
            restDayNames: string[];
            effectiveFrom: Date;
            effectiveTo: Date;
            departmentId: string;
            scope: string;
        };
        penaltySuppression: {
            enabled: boolean;
            message: string;
        };
        configuredAt: Date;
        configuredBy: string;
        message?: undefined;
    }>;
    checkRestDay(body: {
        date: Date;
        restDays?: number[];
    }, user: any): Promise<{
        date: Date;
        dayOfWeek: number;
        dayName: string;
        isRestDay: boolean;
        configuredRestDays: string[];
        penaltySuppression: boolean;
        message: string;
    }>;
    bulkCreateHolidays(body: {
        holidays: Array<{
            name: string;
            type: string;
            startDate: Date;
            endDate?: Date;
        }>;
        year?: number;
    }, user: any): Promise<{
        success: boolean;
        year: number;
        summary: {
            total: number;
            created: number;
            failed: number;
        };
        createdHolidays: any[];
        failedHolidays: any[];
        createdAt: Date;
        createdBy: string;
    }>;
    getHolidayCalendar(year?: number, month?: number, includeRestDays?: string, user?: any): Promise<{
        period: {
            year: number;
            month: string | number;
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalHolidays: number;
            nationalHolidays: number;
            organizationalHolidays: number;
            restDaysCount: number;
        };
        holidays: Record<string, any[]>;
        restDays: {
            configuredDays: string[];
            count: number;
            sample: any[];
        };
        generatedAt: Date;
    }>;
    checkPenaltySuppression(body: {
        employeeId: string;
        date: Date;
        restDays?: number[];
    }, user: any): Promise<{
        employeeId: string;
        date: Date;
        dayName: string;
        checks: {
            isHoliday: boolean;
            holidayName: string;
            holidayType: import("../models/enums").HolidayType;
            isRestDay: boolean;
        };
        penaltySuppression: {
            suppress: boolean;
            reason: string;
        };
        recommendation: string;
        checkedAt: Date;
    }>;
    linkHolidaysToShift(body: {
        shiftId: string;
        holidayIds: string[];
        action: 'NO_WORK' | 'OPTIONAL' | 'OVERTIME_ELIGIBLE';
    }, user: any): Promise<{
        success: boolean;
        message: string;
        shiftId?: undefined;
        action?: undefined;
        actionDescription?: undefined;
        linkedHolidays?: undefined;
        holidayCount?: undefined;
        linkedAt?: undefined;
        linkedBy?: undefined;
    } | {
        success: boolean;
        shiftId: string;
        action: "NO_WORK" | "OPTIONAL" | "OVERTIME_ELIGIBLE";
        actionDescription: string;
        linkedHolidays: {
            holidayId: any;
            name: string;
            startDate: Date;
            type: import("../models/enums").HolidayType;
        }[];
        holidayCount: number;
        linkedAt: Date;
        linkedBy: string;
        message?: undefined;
    }>;
    getEmployeeHolidaySchedule(employeeId: string, startDate: string, endDate: string, user: any): Promise<{
        employeeId: string;
        period: {
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalDays: number;
            workingDays: number;
            nonWorkingDays: number;
            holidays: number;
            restDays: number;
        };
        configuredRestDays: string[];
        nonWorkingDays: any[];
        generatedAt: Date;
    }>;
    checkHoliday(checkHolidayDto: CheckHolidayDto, user: any): Promise<{
        isHoliday: boolean;
        holiday: import("mongoose").Document<unknown, {}, import("../models/holiday.schema").Holiday, {}, {}> & import("../models/holiday.schema").Holiday & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    validateAttendanceHoliday(validateAttendanceHolidayDto: ValidateAttendanceHolidayDto, user: any): Promise<{
        employeeId: string;
        date: Date;
        isHoliday: boolean;
        holidayName: string;
        holidayType: import("../models/enums").HolidayType;
        penaltySuppressed: boolean;
        message: string;
    }>;
}
