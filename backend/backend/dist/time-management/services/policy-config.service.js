"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyConfigService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const overtime_rule_schema_1 = require("../models/overtime-rule.schema");
const lateness_rule_schema_1 = require("../models/lateness-rule.schema");
const holiday_schema_1 = require("../models/holiday.schema");
let PolicyConfigService = class PolicyConfigService {
    constructor(overtimeRuleModel, latenessRuleModel, holidayModel) {
        this.overtimeRuleModel = overtimeRuleModel;
        this.latenessRuleModel = latenessRuleModel;
        this.holidayModel = holidayModel;
    }
    async createOvertimeRule(createOvertimeRuleDto, currentUserId) {
        const newOvertimeRule = new this.overtimeRuleModel({
            ...createOvertimeRuleDto,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newOvertimeRule.save();
    }
    async getOvertimeRules(getPoliciesDto, currentUserId) {
        const query = {};
        if (getPoliciesDto.active !== undefined) {
            query.active = getPoliciesDto.active;
        }
        if (getPoliciesDto.approved !== undefined) {
            query.approved = getPoliciesDto.approved;
        }
        return this.overtimeRuleModel.find(query).exec();
    }
    async getOvertimeRuleById(id, currentUserId) {
        return this.overtimeRuleModel.findById(id).exec();
    }
    async updateOvertimeRule(id, updateOvertimeRuleDto, currentUserId) {
        return this.overtimeRuleModel
            .findByIdAndUpdate(id, {
            ...updateOvertimeRuleDto,
            updatedBy: currentUserId,
        }, { new: true })
            .exec();
    }
    async deleteOvertimeRule(id, currentUserId) {
        return this.overtimeRuleModel.findByIdAndDelete(id).exec();
    }
    async getApplicableOvertimeRules(date, currentUserId) {
        const holidayCheck = await this.checkHoliday({ date }, currentUserId);
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const allRules = await this.overtimeRuleModel
            .find({ active: true, approved: true })
            .exec();
        return {
            date,
            isHoliday: holidayCheck.isHoliday,
            holidayName: holidayCheck.holiday?.name || null,
            isWeekend,
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
            applicableRules: allRules,
            recommendation: holidayCheck.isHoliday
                ? 'Apply HOLIDAY overtime multiplier'
                : isWeekend
                    ? 'Apply WEEKEND overtime multiplier'
                    : 'Apply REGULAR overtime multiplier',
        };
    }
    async calculateOvertimeForAttendance(params, currentUserId) {
        const { totalWorkMinutes, standardWorkMinutes = 480, date } = params;
        const applicableRules = await this.getApplicableOvertimeRules(date, currentUserId);
        const overtimeMinutes = Math.max(0, totalWorkMinutes - standardWorkMinutes);
        const overtimeHours = Math.round((overtimeMinutes / 60) * 100) / 100;
        const shortTimeMinutes = Math.max(0, standardWorkMinutes - totalWorkMinutes);
        const shortTimeHours = Math.round((shortTimeMinutes / 60) * 100) / 100;
        let overtimeType = 'REGULAR';
        let multiplier = 1.5;
        if (applicableRules.isHoliday) {
            overtimeType = 'HOLIDAY';
            multiplier = 2.5;
        }
        else if (applicableRules.isWeekend) {
            overtimeType = 'WEEKEND';
            multiplier = 2.0;
        }
        return {
            attendanceRecordId: params.attendanceRecordId,
            date,
            standardWorkMinutes,
            actualWorkMinutes: totalWorkMinutes,
            overtime: {
                minutes: overtimeMinutes,
                hours: overtimeHours,
                type: overtimeType,
                multiplier,
                compensationMinutes: Math.round(overtimeMinutes * multiplier),
            },
            shortTime: {
                minutes: shortTimeMinutes,
                hours: shortTimeHours,
                hasShortTime: shortTimeMinutes > 0,
            },
            applicableRules: {
                isHoliday: applicableRules.isHoliday,
                isWeekend: applicableRules.isWeekend,
                dayOfWeek: applicableRules.dayOfWeek,
            },
        };
    }
    async getShortTimeConfig(currentUserId) {
        return {
            standardWorkMinutes: 480,
            minimumWorkMinutes: 240,
            shortTimeThresholdMinutes: 30,
            deductionPerMinute: 0,
            policies: {
                allowHalfDay: true,
                allowQuarterDay: false,
                requiresApproval: true,
                deductFromLeave: false,
                deductFromSalary: true,
            },
        };
    }
    async calculateShortTimeForAttendance(params, currentUserId) {
        const config = await this.getShortTimeConfig(currentUserId);
        const { totalWorkMinutes, standardWorkMinutes = config.standardWorkMinutes, date } = params;
        const shortTimeMinutes = Math.max(0, standardWorkMinutes - totalWorkMinutes);
        const shortTimeHours = Math.round((shortTimeMinutes / 60) * 100) / 100;
        const applyShortTime = shortTimeMinutes >= config.shortTimeThresholdMinutes;
        let workType = 'FULL_DAY';
        if (totalWorkMinutes < config.minimumWorkMinutes) {
            workType = 'LESS_THAN_HALF_DAY';
        }
        else if (totalWorkMinutes < standardWorkMinutes) {
            workType = 'HALF_DAY';
        }
        return {
            attendanceRecordId: params.attendanceRecordId,
            date,
            standardWorkMinutes,
            actualWorkMinutes: totalWorkMinutes,
            shortTime: {
                minutes: shortTimeMinutes,
                hours: shortTimeHours,
                applyShortTime,
                belowThreshold: shortTimeMinutes < config.shortTimeThresholdMinutes,
            },
            workType,
            config,
            recommendation: applyShortTime
                ? 'Apply short-time deduction or require leave request'
                : 'Short-time below threshold, no deduction required',
        };
    }
    async validateOvertimePreApproval(params, currentUserId) {
        const { employeeId, date, expectedOvertimeMinutes } = params;
        const applicableRules = await this.getApplicableOvertimeRules(date, currentUserId);
        const preApprovalThresholdMinutes = 60;
        const requiresPreApproval = expectedOvertimeMinutes > preApprovalThresholdMinutes;
        const requiresDueToDateType = applicableRules.isHoliday || applicableRules.isWeekend;
        return {
            employeeId,
            date,
            expectedOvertimeMinutes,
            expectedOvertimeHours: Math.round((expectedOvertimeMinutes / 60) * 100) / 100,
            preApprovalRequired: requiresPreApproval || requiresDueToDateType,
            reason: requiresDueToDateType
                ? `Pre-approval required for ${applicableRules.isHoliday ? 'holiday' : 'weekend'} work`
                : requiresPreApproval
                    ? `Pre-approval required for overtime exceeding ${preApprovalThresholdMinutes} minutes`
                    : 'Pre-approval not required',
            dateInfo: {
                isHoliday: applicableRules.isHoliday,
                isWeekend: applicableRules.isWeekend,
                dayOfWeek: applicableRules.dayOfWeek,
            },
        };
    }
    async getOvertimeLimitsConfig(currentUserId) {
        return {
            daily: {
                maxOvertimeMinutes: 180,
                maxOvertimeHours: 3,
                softLimitMinutes: 120,
            },
            weekly: {
                maxOvertimeMinutes: 720,
                maxOvertimeHours: 12,
                softLimitMinutes: 600,
            },
            monthly: {
                maxOvertimeMinutes: 2880,
                maxOvertimeHours: 48,
                softLimitMinutes: 2400,
            },
            policies: {
                enforceHardLimits: true,
                requireApprovalAboveSoftLimit: true,
                carryOverAllowed: false,
            },
        };
    }
    async checkOvertimeLimits(params, currentUserId) {
        const config = await this.getOvertimeLimitsConfig(currentUserId);
        const periodConfig = config[params.period];
        const currentMinutes = params.currentOvertimeMinutes;
        const additionalMinutes = params.additionalOvertimeMinutes || 0;
        const projectedMinutes = currentMinutes + additionalMinutes;
        const withinSoftLimit = projectedMinutes <= periodConfig.softLimitMinutes;
        const withinHardLimit = projectedMinutes <= periodConfig.maxOvertimeMinutes;
        return {
            employeeId: params.employeeId,
            period: params.period,
            limits: periodConfig,
            current: {
                minutes: currentMinutes,
                hours: Math.round((currentMinutes / 60) * 100) / 100,
            },
            projected: {
                minutes: projectedMinutes,
                hours: Math.round((projectedMinutes / 60) * 100) / 100,
            },
            remaining: {
                toSoftLimit: Math.max(0, periodConfig.softLimitMinutes - projectedMinutes),
                toHardLimit: Math.max(0, periodConfig.maxOvertimeMinutes - projectedMinutes),
            },
            status: {
                withinSoftLimit,
                withinHardLimit,
                requiresApproval: !withinSoftLimit && config.policies.requireApprovalAboveSoftLimit,
                blocked: !withinHardLimit && config.policies.enforceHardLimits,
            },
            recommendation: !withinHardLimit
                ? 'BLOCKED: Overtime exceeds hard limit'
                : !withinSoftLimit
                    ? 'WARNING: Overtime exceeds soft limit, requires approval'
                    : 'OK: Within overtime limits',
        };
    }
    async getOvertimeShortTimePolicySummary(currentUserId) {
        const overtimeRules = await this.overtimeRuleModel.find({ active: true }).exec();
        const limits = await this.getOvertimeLimitsConfig(currentUserId);
        const shortTimeConfig = await this.getShortTimeConfig(currentUserId);
        return {
            generatedAt: new Date(),
            overtime: {
                rules: overtimeRules,
                limits,
                multipliers: {
                    regular: 1.5,
                    weekend: 2.0,
                    holiday: 2.5,
                },
                preApprovalThresholdMinutes: 60,
            },
            shortTime: shortTimeConfig,
            weekendDays: ['Saturday', 'Sunday'],
            standardWorkMinutes: 480,
            standardWorkHours: 8,
        };
    }
    async createLatenessRule(createLatenessRuleDto, currentUserId) {
        const newLatenessRule = new this.latenessRuleModel({
            ...createLatenessRuleDto,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newLatenessRule.save();
    }
    async getLatenessRules(getPoliciesDto, currentUserId) {
        const query = {};
        if (getPoliciesDto.active !== undefined) {
            query.active = getPoliciesDto.active;
        }
        return this.latenessRuleModel.find(query).exec();
    }
    async getLatenessRuleById(id, currentUserId) {
        return this.latenessRuleModel.findById(id).exec();
    }
    async updateLatenessRule(id, updateLatenessRuleDto, currentUserId) {
        return this.latenessRuleModel
            .findByIdAndUpdate(id, {
            ...updateLatenessRuleDto,
            updatedBy: currentUserId,
        }, { new: true })
            .exec();
    }
    async deleteLatenessRule(id, currentUserId) {
        return this.latenessRuleModel.findByIdAndDelete(id).exec();
    }
    async getLatenessThresholdsConfig(currentUserId) {
        return {
            gracePeriodMinutes: 15,
            thresholds: {
                minor: {
                    minMinutes: 1,
                    maxMinutes: 15,
                    description: 'Minor lateness (within grace period)',
                    action: 'NO_ACTION',
                    deductionMultiplier: 0,
                },
                moderate: {
                    minMinutes: 16,
                    maxMinutes: 30,
                    description: 'Moderate lateness',
                    action: 'WARNING',
                    deductionMultiplier: 1.0,
                },
                significant: {
                    minMinutes: 31,
                    maxMinutes: 60,
                    description: 'Significant lateness',
                    action: 'DEDUCTION',
                    deductionMultiplier: 1.5,
                },
                severe: {
                    minMinutes: 61,
                    maxMinutes: null,
                    description: 'Severe lateness (requires escalation)',
                    action: 'ESCALATION',
                    deductionMultiplier: 2.0,
                },
            },
            escalationPolicy: {
                escalateAfterMinutes: 60,
                escalateAfterOccurrences: 3,
                escalationPeriodDays: 30,
                notifyManager: true,
                notifyHR: true,
            },
            deductionPolicy: {
                deductFromSalary: true,
                deductFromLeave: false,
                maxDeductionPerDay: 480,
                currency: 'USD',
            },
        };
    }
    async calculateLatenessForAttendance(params, currentUserId) {
        const { scheduledStartMinutes, actualArrivalMinutes } = params;
        const latenessRules = await this.latenessRuleModel.find({ active: true }).exec();
        const thresholdsConfig = await this.getLatenessThresholdsConfig(currentUserId);
        const gracePeriod = params.gracePeriodMinutes ??
            (latenessRules.length > 0 ? latenessRules[0].gracePeriodMinutes : thresholdsConfig.gracePeriodMinutes);
        const rawLatenessMinutes = Math.max(0, actualArrivalMinutes - scheduledStartMinutes);
        const effectiveLatenessMinutes = Math.max(0, rawLatenessMinutes - gracePeriod);
        let category = 'ON_TIME';
        let action = 'NO_ACTION';
        let deductionMultiplier = 0;
        if (rawLatenessMinutes <= 0) {
            category = 'EARLY';
            action = 'NO_ACTION';
        }
        else if (rawLatenessMinutes <= gracePeriod) {
            category = 'WITHIN_GRACE';
            action = 'NO_ACTION';
        }
        else if (rawLatenessMinutes <= 30) {
            category = 'MODERATE';
            action = 'WARNING';
            deductionMultiplier = 1.0;
        }
        else if (rawLatenessMinutes <= 60) {
            category = 'SIGNIFICANT';
            action = 'DEDUCTION';
            deductionMultiplier = 1.5;
        }
        else {
            category = 'SEVERE';
            action = 'ESCALATION';
            deductionMultiplier = 2.0;
        }
        const deductionPerMinute = latenessRules.length > 0 ? latenessRules[0].deductionForEachMinute : 0;
        const baseDeduction = effectiveLatenessMinutes * deductionPerMinute;
        const totalDeduction = baseDeduction * deductionMultiplier;
        return {
            attendanceRecordId: params.attendanceRecordId,
            scheduledStartMinutes,
            actualArrivalMinutes,
            gracePeriodMinutes: gracePeriod,
            lateness: {
                rawMinutes: rawLatenessMinutes,
                effectiveMinutes: effectiveLatenessMinutes,
                withinGracePeriod: rawLatenessMinutes <= gracePeriod,
            },
            category,
            action,
            deduction: {
                perMinuteRate: deductionPerMinute,
                multiplier: deductionMultiplier,
                baseAmount: Math.round(baseDeduction * 100) / 100,
                totalAmount: Math.round(totalDeduction * 100) / 100,
            },
            requiresEscalation: action === 'ESCALATION',
            recommendation: this.getLatenessRecommendation(category, rawLatenessMinutes),
        };
    }
    getLatenessRecommendation(category, minutes) {
        switch (category) {
            case 'EARLY':
                return 'Employee arrived early - no action required';
            case 'ON_TIME':
            case 'WITHIN_GRACE':
                return 'Within acceptable time - no action required';
            case 'MODERATE':
                return 'Issue verbal warning and log incident';
            case 'SIGNIFICANT':
                return 'Apply salary deduction and issue written warning';
            case 'SEVERE':
                return `Escalate to HR/Manager - ${minutes} minutes late requires review`;
            default:
                return 'Review lateness manually';
        }
    }
    async checkLatenessEscalation(params, currentUserId) {
        const config = await this.getLatenessThresholdsConfig(currentUserId);
        const { currentLatenessMinutes, periodDays = 30 } = params;
        const exceedsTimeThreshold = currentLatenessMinutes > config.escalationPolicy.escalateAfterMinutes;
        return {
            employeeId: params.employeeId,
            currentLatenessMinutes,
            thresholds: {
                timeThreshold: config.escalationPolicy.escalateAfterMinutes,
                occurrenceThreshold: config.escalationPolicy.escalateAfterOccurrences,
                periodDays: config.escalationPolicy.escalationPeriodDays,
            },
            status: {
                exceedsTimeThreshold,
                requiresEscalation: exceedsTimeThreshold,
                escalationLevel: exceedsTimeThreshold ? 'HR_REVIEW' : 'NONE',
            },
            notifications: {
                notifyManager: exceedsTimeThreshold && config.escalationPolicy.notifyManager,
                notifyHR: exceedsTimeThreshold && config.escalationPolicy.notifyHR,
            },
            recommendation: exceedsTimeThreshold
                ? 'Escalate to HR for disciplinary review'
                : 'Log incident and monitor',
        };
    }
    async applyLatenessDeduction(params, currentUserId) {
        const { employeeId, attendanceRecordId, latenessMinutes, latenessRuleId } = params;
        let latenessRule;
        if (latenessRuleId) {
            latenessRule = await this.latenessRuleModel.findById(latenessRuleId).exec();
        }
        else {
            const rules = await this.latenessRuleModel.find({ active: true }).exec();
            latenessRule = rules[0];
        }
        if (!latenessRule) {
            return {
                success: false,
                message: 'No active lateness rule found',
                deductionApplied: false,
            };
        }
        const effectiveLatenessMinutes = Math.max(0, latenessMinutes - latenessRule.gracePeriodMinutes);
        if (effectiveLatenessMinutes <= 0) {
            return {
                success: true,
                message: 'Within grace period - no deduction applied',
                deductionApplied: false,
                latenessDetails: {
                    rawMinutes: latenessMinutes,
                    gracePeriod: latenessRule.gracePeriodMinutes,
                    effectiveMinutes: 0,
                },
            };
        }
        const deductionAmount = effectiveLatenessMinutes * latenessRule.deductionForEachMinute;
        return {
            success: true,
            message: 'Deduction calculated successfully',
            deductionApplied: true,
            employeeId,
            attendanceRecordId,
            latenessDetails: {
                rawMinutes: latenessMinutes,
                gracePeriod: latenessRule.gracePeriodMinutes,
                effectiveMinutes: effectiveLatenessMinutes,
            },
            deduction: {
                ruleId: latenessRule._id,
                ruleName: latenessRule.name,
                ratePerMinute: latenessRule.deductionForEachMinute,
                amount: Math.round(deductionAmount * 100) / 100,
            },
            appliedAt: new Date(),
            appliedBy: currentUserId,
        };
    }
    async getLatenesPenaltySummary(currentUserId) {
        const latenessRules = await this.latenessRuleModel.find({ active: true }).exec();
        const thresholdsConfig = await this.getLatenessThresholdsConfig(currentUserId);
        return {
            generatedAt: new Date(),
            activeRules: latenessRules.map(rule => ({
                id: rule._id,
                name: rule.name,
                description: rule.description,
                gracePeriodMinutes: rule.gracePeriodMinutes,
                deductionPerMinute: rule.deductionForEachMinute,
            })),
            thresholds: thresholdsConfig.thresholds,
            escalationPolicy: thresholdsConfig.escalationPolicy,
            deductionPolicy: thresholdsConfig.deductionPolicy,
            summary: {
                totalActiveRules: latenessRules.length,
                defaultGracePeriod: thresholdsConfig.gracePeriodMinutes,
                escalationThresholdMinutes: thresholdsConfig.escalationPolicy.escalateAfterMinutes,
                escalationOccurrences: thresholdsConfig.escalationPolicy.escalateAfterOccurrences,
            },
        };
    }
    async calculateEarlyLeavePenalty(params, currentUserId) {
        const { scheduledEndMinutes, actualDepartureMinutes } = params;
        const latenessRules = await this.latenessRuleModel.find({ active: true }).exec();
        const thresholdsConfig = await this.getLatenessThresholdsConfig(currentUserId);
        const gracePeriod = params.gracePeriodMinutes ??
            (latenessRules.length > 0 ? latenessRules[0].gracePeriodMinutes : thresholdsConfig.gracePeriodMinutes);
        const rawEarlyMinutes = Math.max(0, scheduledEndMinutes - actualDepartureMinutes);
        const effectiveEarlyMinutes = Math.max(0, rawEarlyMinutes - gracePeriod);
        let category = 'NORMAL';
        let action = 'NO_ACTION';
        let deductionMultiplier = 0;
        if (rawEarlyMinutes <= 0) {
            category = 'OVERTIME';
            action = 'NO_ACTION';
        }
        else if (rawEarlyMinutes <= gracePeriod) {
            category = 'WITHIN_GRACE';
            action = 'NO_ACTION';
        }
        else if (rawEarlyMinutes <= 30) {
            category = 'MODERATE';
            action = 'WARNING';
            deductionMultiplier = 1.0;
        }
        else if (rawEarlyMinutes <= 60) {
            category = 'SIGNIFICANT';
            action = 'DEDUCTION';
            deductionMultiplier = 1.5;
        }
        else {
            category = 'SEVERE';
            action = 'ESCALATION';
            deductionMultiplier = 2.0;
        }
        const deductionPerMinute = latenessRules.length > 0 ? latenessRules[0].deductionForEachMinute : 0;
        const baseDeduction = effectiveEarlyMinutes * deductionPerMinute;
        const totalDeduction = baseDeduction * deductionMultiplier;
        return {
            attendanceRecordId: params.attendanceRecordId,
            scheduledEndMinutes,
            actualDepartureMinutes,
            gracePeriodMinutes: gracePeriod,
            earlyLeave: {
                rawMinutes: rawEarlyMinutes,
                effectiveMinutes: effectiveEarlyMinutes,
                withinGracePeriod: rawEarlyMinutes <= gracePeriod,
            },
            category,
            action,
            deduction: {
                perMinuteRate: deductionPerMinute,
                multiplier: deductionMultiplier,
                baseAmount: Math.round(baseDeduction * 100) / 100,
                totalAmount: Math.round(totalDeduction * 100) / 100,
            },
            requiresEscalation: action === 'ESCALATION',
            recommendation: rawEarlyMinutes <= 0
                ? 'Employee worked overtime'
                : rawEarlyMinutes <= gracePeriod
                    ? 'Within acceptable range'
                    : `Early departure by ${rawEarlyMinutes} minutes - apply appropriate action`,
        };
    }
    async createHoliday(createHolidayDto, currentUserId) {
        const newHoliday = new this.holidayModel({
            ...createHolidayDto,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newHoliday.save();
    }
    async getHolidays(getHolidaysDto, currentUserId) {
        const query = {};
        if (getHolidaysDto.type) {
            query.type = getHolidaysDto.type;
        }
        if (getHolidaysDto.active !== undefined) {
            query.active = getHolidaysDto.active;
        }
        if (getHolidaysDto.startDate && getHolidaysDto.endDate) {
            query.$or = [
                {
                    startDate: {
                        $gte: getHolidaysDto.startDate,
                        $lte: getHolidaysDto.endDate,
                    },
                },
                {
                    endDate: {
                        $gte: getHolidaysDto.startDate,
                        $lte: getHolidaysDto.endDate,
                    },
                },
                {
                    $and: [
                        { startDate: { $lte: getHolidaysDto.startDate } },
                        { endDate: { $gte: getHolidaysDto.endDate } },
                    ],
                },
            ];
        }
        return this.holidayModel.find(query).sort({ startDate: 1 }).exec();
    }
    async getHolidayById(id, currentUserId) {
        return this.holidayModel.findById(id).exec();
    }
    async updateHoliday(id, updateHolidayDto, currentUserId) {
        return this.holidayModel
            .findByIdAndUpdate(id, {
            ...updateHolidayDto,
            updatedBy: currentUserId,
        }, { new: true })
            .exec();
    }
    async deleteHoliday(id, currentUserId) {
        return this.holidayModel.findByIdAndDelete(id).exec();
    }
    async configureWeeklyRestDays(params, currentUserId) {
        const { restDays, effectiveFrom, effectiveTo, departmentId } = params;
        const validDays = restDays.filter(d => d >= 0 && d <= 6);
        if (validDays.length === 0) {
            return {
                success: false,
                message: 'Invalid rest days provided. Use 0-6 (Sunday-Saturday)',
            };
        }
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const restDayNames = validDays.map(d => dayNames[d]);
        return {
            success: true,
            configuration: {
                restDays: validDays,
                restDayNames,
                effectiveFrom: effectiveFrom || new Date(),
                effectiveTo: effectiveTo || null,
                departmentId: departmentId || 'ALL',
                scope: departmentId ? 'DEPARTMENT' : 'ORGANIZATION',
            },
            penaltySuppression: {
                enabled: true,
                message: `Attendance penalties will be suppressed on ${restDayNames.join(', ')}`,
            },
            configuredAt: new Date(),
            configuredBy: currentUserId,
        };
    }
    async checkRestDay(params, currentUserId) {
        const { date, restDays = [5, 6] } = params;
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const isRestDay = restDays.includes(dayOfWeek);
        return {
            date,
            dayOfWeek,
            dayName: dayNames[dayOfWeek],
            isRestDay,
            configuredRestDays: restDays.map(d => dayNames[d]),
            penaltySuppression: isRestDay,
            message: isRestDay
                ? `${dayNames[dayOfWeek]} is a configured rest day - penalties suppressed`
                : `${dayNames[dayOfWeek]} is a working day`,
        };
    }
    async bulkCreateHolidays(params, currentUserId) {
        const { holidays, year = new Date().getFullYear() } = params;
        const createdHolidays = [];
        const failedHolidays = [];
        for (const holiday of holidays) {
            try {
                const newHoliday = new this.holidayModel({
                    name: holiday.name,
                    type: holiday.type,
                    startDate: new Date(holiday.startDate),
                    endDate: holiday.endDate ? new Date(holiday.endDate) : undefined,
                    active: true,
                    createdBy: currentUserId,
                    updatedBy: currentUserId,
                });
                const saved = await newHoliday.save();
                createdHolidays.push({
                    id: saved._id,
                    name: saved.name,
                    startDate: saved.startDate,
                });
            }
            catch (error) {
                failedHolidays.push({
                    name: holiday.name,
                    error: 'Failed to create holiday',
                });
            }
        }
        return {
            success: failedHolidays.length === 0,
            year,
            summary: {
                total: holidays.length,
                created: createdHolidays.length,
                failed: failedHolidays.length,
            },
            createdHolidays,
            failedHolidays: failedHolidays.length > 0 ? failedHolidays : undefined,
            createdAt: new Date(),
            createdBy: currentUserId,
        };
    }
    async getHolidayCalendar(params, currentUserId) {
        const { year = new Date().getFullYear(), month, includeRestDays = true, restDays = [5, 6] } = params;
        let startDate;
        let endDate;
        if (month !== undefined) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0);
        }
        else {
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31);
        }
        const holidays = await this.holidayModel
            .find({
            active: true,
            startDate: { $lte: endDate },
            $or: [
                { endDate: { $gte: startDate } },
                { endDate: { $exists: false }, startDate: { $gte: startDate } },
            ],
        })
            .sort({ startDate: 1 })
            .exec();
        const byType = {
            NATIONAL: [],
            ORGANIZATIONAL: [],
            WEEKLY_REST: [],
        };
        holidays.forEach(h => {
            const type = h.type || 'ORGANIZATIONAL';
            if (!byType[type])
                byType[type] = [];
            byType[type].push({
                id: h._id,
                name: h.name,
                startDate: h.startDate,
                endDate: h.endDate,
                type: h.type,
            });
        });
        let restDaysInPeriod = [];
        if (includeRestDays) {
            const current = new Date(startDate);
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            while (current <= endDate) {
                if (restDays.includes(current.getDay())) {
                    restDaysInPeriod.push({
                        date: new Date(current),
                        dayName: dayNames[current.getDay()],
                    });
                }
                current.setDate(current.getDate() + 1);
            }
        }
        return {
            period: {
                year,
                month: month || 'ALL',
                startDate,
                endDate,
            },
            summary: {
                totalHolidays: holidays.length,
                nationalHolidays: byType.NATIONAL.length,
                organizationalHolidays: byType.ORGANIZATIONAL.length,
                restDaysCount: restDaysInPeriod.length,
            },
            holidays: byType,
            restDays: includeRestDays ? {
                configuredDays: restDays.map(d => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]),
                count: restDaysInPeriod.length,
                sample: restDaysInPeriod.length > 10
                    ? [...restDaysInPeriod.slice(0, 5), { note: `...${restDaysInPeriod.length - 10} more...` }, ...restDaysInPeriod.slice(-5)]
                    : restDaysInPeriod,
            } : undefined,
            generatedAt: new Date(),
        };
    }
    async checkPenaltySuppression(params, currentUserId) {
        const { employeeId, date, restDays = [5, 6] } = params;
        const holidayCheck = await this.checkHoliday({ date }, currentUserId);
        const restDayCheck = await this.checkRestDay({ date, restDays }, currentUserId);
        const shouldSuppressPenalty = holidayCheck.isHoliday || restDayCheck.isRestDay;
        let suppressionReason = '';
        if (holidayCheck.isHoliday && restDayCheck.isRestDay) {
            suppressionReason = `${holidayCheck.holiday?.name || 'Holiday'} (also a rest day)`;
        }
        else if (holidayCheck.isHoliday) {
            suppressionReason = holidayCheck.holiday?.name || 'Holiday';
        }
        else if (restDayCheck.isRestDay) {
            suppressionReason = `Rest day (${restDayCheck.dayName})`;
        }
        return {
            employeeId,
            date,
            dayName: restDayCheck.dayName,
            checks: {
                isHoliday: holidayCheck.isHoliday,
                holidayName: holidayCheck.holiday?.name || null,
                holidayType: holidayCheck.holiday?.type || null,
                isRestDay: restDayCheck.isRestDay,
            },
            penaltySuppression: {
                suppress: shouldSuppressPenalty,
                reason: suppressionReason || 'Working day - no suppression',
            },
            recommendation: shouldSuppressPenalty
                ? 'No attendance penalties should be applied'
                : 'Standard attendance rules apply',
            checkedAt: new Date(),
        };
    }
    async linkHolidaysToShift(params, currentUserId) {
        const { shiftId, holidayIds, action } = params;
        const holidays = await this.holidayModel
            .find({ _id: { $in: holidayIds }, active: true })
            .exec();
        if (holidays.length === 0) {
            return {
                success: false,
                message: 'No valid holidays found',
            };
        }
        const linkedHolidays = holidays.map(h => ({
            holidayId: h._id,
            name: h.name,
            startDate: h.startDate,
            type: h.type,
        }));
        return {
            success: true,
            shiftId,
            action,
            actionDescription: action === 'NO_WORK'
                ? 'Employees are not expected to work'
                : action === 'OPTIONAL'
                    ? 'Work is optional with no penalty for absence'
                    : 'Work is overtime-eligible with premium rates',
            linkedHolidays,
            holidayCount: linkedHolidays.length,
            linkedAt: new Date(),
            linkedBy: currentUserId,
        };
    }
    async getEmployeeHolidaySchedule(params, currentUserId) {
        const { employeeId, startDate, endDate, restDays = [5, 6] } = params;
        const holidays = await this.holidayModel
            .find({
            active: true,
            startDate: { $lte: endDate },
            $or: [
                { endDate: { $gte: startDate } },
                { endDate: { $exists: false }, startDate: { $gte: startDate } },
            ],
        })
            .sort({ startDate: 1 })
            .exec();
        const nonWorkingDays = [];
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        holidays.forEach(h => {
            const hStart = new Date(h.startDate);
            const hEnd = h.endDate ? new Date(h.endDate) : new Date(h.startDate);
            const current = new Date(hStart);
            while (current <= hEnd) {
                if (current >= startDate && current <= endDate) {
                    nonWorkingDays.push({
                        date: new Date(current),
                        type: 'HOLIDAY',
                        name: h.name || 'Holiday',
                        holidayType: h.type,
                    });
                }
                current.setDate(current.getDate() + 1);
            }
        });
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            if (restDays.includes(currentDate.getDay())) {
                const isHoliday = nonWorkingDays.some(d => d.type === 'HOLIDAY' && d.date.toDateString() === currentDate.toDateString());
                if (!isHoliday) {
                    nonWorkingDays.push({
                        date: new Date(currentDate),
                        type: 'REST_DAY',
                        name: dayNames[currentDate.getDay()],
                    });
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        nonWorkingDays.sort((a, b) => a.date.getTime() - b.date.getTime());
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const workingDays = totalDays - nonWorkingDays.length;
        return {
            employeeId,
            period: { startDate, endDate },
            summary: {
                totalDays,
                workingDays,
                nonWorkingDays: nonWorkingDays.length,
                holidays: nonWorkingDays.filter(d => d.type === 'HOLIDAY').length,
                restDays: nonWorkingDays.filter(d => d.type === 'REST_DAY').length,
            },
            configuredRestDays: restDays.map(d => dayNames[d]),
            nonWorkingDays,
            generatedAt: new Date(),
        };
    }
    async checkHoliday(checkHolidayDto, currentUserId) {
        const date = new Date(checkHolidayDto.date);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const holiday = await this.holidayModel
            .findOne({
            active: true,
            $or: [
                {
                    startDate: { $gte: date, $lt: nextDay },
                    endDate: { $exists: false },
                },
                {
                    startDate: { $lte: date },
                    endDate: { $gte: date },
                },
                {
                    startDate: { $gte: date, $lt: nextDay },
                    endDate: { $gte: date, $lt: nextDay },
                },
            ],
        })
            .exec();
        return {
            isHoliday: !!holiday,
            holiday: holiday || null,
        };
    }
    async validateAttendanceHoliday(validateAttendanceHolidayDto, currentUserId) {
        const { employeeId, date, suppressPenalty } = validateAttendanceHolidayDto;
        const holidayCheck = await this.checkHoliday({ date }, currentUserId);
        if (holidayCheck.isHoliday && suppressPenalty) {
            return {
                employeeId,
                date,
                isHoliday: true,
                holidayName: holidayCheck.holiday?.name || 'Holiday',
                holidayType: holidayCheck.holiday?.type,
                penaltySuppressed: true,
                message: 'Attendance penalty suppressed due to holiday',
            };
        }
        return {
            employeeId,
            date,
            isHoliday: holidayCheck.isHoliday,
            holidayName: holidayCheck.holiday?.name || null,
            holidayType: holidayCheck.holiday?.type || null,
            penaltySuppressed: false,
            message: holidayCheck.isHoliday
                ? 'Date is a holiday but penalty suppression not requested'
                : 'Date is not a holiday',
        };
    }
    async getUpcomingHolidays(days = 30, currentUserId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + days);
        return this.holidayModel
            .find({
            active: true,
            startDate: { $gte: today, $lte: futureDate },
        })
            .sort({ startDate: 1 })
            .exec();
    }
};
exports.PolicyConfigService = PolicyConfigService;
exports.PolicyConfigService = PolicyConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(overtime_rule_schema_1.OvertimeRule.name)),
    __param(1, (0, mongoose_1.InjectModel)(lateness_rule_schema_1.LatenessRule.name)),
    __param(2, (0, mongoose_1.InjectModel)(holiday_schema_1.Holiday.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PolicyConfigService);
//# sourceMappingURL=policy-config.service.js.map