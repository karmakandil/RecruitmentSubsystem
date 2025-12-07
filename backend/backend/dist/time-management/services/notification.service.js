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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_log_schema_1 = require("../models/notification-log.schema");
const attendance_record_schema_1 = require("../models/attendance-record.schema");
const time_exception_schema_1 = require("../models/time-exception.schema");
const enums_1 = require("../models/enums");
let NotificationService = class NotificationService {
    constructor(notificationLogModel, attendanceRecordModel, timeExceptionModel) {
        this.notificationLogModel = notificationLogModel;
        this.attendanceRecordModel = attendanceRecordModel;
        this.timeExceptionModel = timeExceptionModel;
        this.auditLogs = [];
    }
    async sendNotification(sendNotificationDto, currentUserId) {
        const notification = new this.notificationLogModel({
            to: sendNotificationDto.to,
            type: sendNotificationDto.type,
            message: sendNotificationDto.message ?? '',
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await notification.save();
        await this.logTimeManagementChange('NOTIFICATION_SENT', {
            to: sendNotificationDto.to,
            type: sendNotificationDto.type,
        }, currentUserId);
        return notification;
    }
    async getNotificationLogsByEmployee(getNotificationLogsByEmployeeDto, currentUserId) {
        return this.notificationLogModel
            .find({ to: getNotificationLogsByEmployeeDto.employeeId })
            .exec();
    }
    async syncAttendanceWithPayroll(syncAttendanceWithPayrollDto, currentUserId) {
        const { employeeId, startDate, endDate } = syncAttendanceWithPayrollDto;
        const query = { employeeId };
        if (startDate && endDate) {
            const startDateUTC = this.convertDateToUTCStart(startDate);
            const endDateUTC = this.convertDateToUTCEnd(endDate);
            query.createdAt = { $gte: startDateUTC, $lte: endDateUTC };
        }
        const attendance = await this.attendanceRecordModel
            .find(query)
            .populate('employeeId', 'name email employeeId')
            .exec();
        await this.logTimeManagementChange('PAYROLL_SYNC_ATTENDANCE', {
            employeeId,
            records: attendance.length,
            startDate,
            endDate,
        }, currentUserId);
        return {
            employeeId,
            startDate,
            endDate,
            records: attendance.map((record) => ({
                attendanceRecordId: record._id,
                employeeId: record.employeeId?._id || record.employeeId,
                date: record.createdAt || record.date,
                punches: record.punches,
                totalWorkMinutes: record.totalWorkMinutes,
                totalWorkHours: Math.round((record.totalWorkMinutes / 60) * 100) / 100,
                hasMissedPunch: record.hasMissedPunch,
                finalisedForPayroll: record.finalisedForPayroll,
            })),
            summary: {
                totalRecords: attendance.length,
                totalWorkMinutes: attendance.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0),
                totalWorkHours: Math.round((attendance.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0) /
                    60) *
                    100) / 100,
            },
        };
    }
    async syncLeaveWithPayroll(syncLeaveWithPayrollDto, currentUserId) {
        const { employeeId, startDate, endDate } = syncLeaveWithPayrollDto;
        await this.logTimeManagementChange('PAYROLL_SYNC_LEAVE', {
            employeeId,
            startDate,
            endDate,
        }, currentUserId);
        return {
            employeeId,
            startDate,
            endDate,
            message: 'Leave data should be retrieved from Leaves subsystem. This endpoint provides attendance context only.',
            attendanceContext: {
                note: 'Use attendance records to validate leave periods',
            },
        };
    }
    async synchronizeAttendanceAndPayroll(synchronizeAttendanceAndPayrollDto, currentUserId) {
        const { employeeId, startDate, endDate } = synchronizeAttendanceAndPayrollDto;
        const query = { employeeId };
        if (startDate && endDate) {
            const startDateUTC = this.convertDateToUTCStart(startDate);
            const endDateUTC = this.convertDateToUTCEnd(endDate);
            query.createdAt = { $gte: startDateUTC, $lte: endDateUTC };
        }
        const attendance = await this.attendanceRecordModel
            .find(query)
            .populate('employeeId', 'name email employeeId')
            .exec();
        await this.logTimeManagementChange('PAYROLL_SYNC_FULL', {
            employeeId,
            attendanceCount: attendance.length,
            startDate,
            endDate,
        }, currentUserId);
        return {
            employeeId,
            startDate,
            endDate,
            attendance: {
                records: attendance.map((record) => ({
                    attendanceRecordId: record._id,
                    employeeId: record.employeeId?._id || record.employeeId,
                    date: record.createdAt || record.date,
                    punches: record.punches,
                    totalWorkMinutes: record.totalWorkMinutes,
                    totalWorkHours: Math.round((record.totalWorkMinutes / 60) * 100) / 100,
                    hasMissedPunch: record.hasMissedPunch,
                    finalisedForPayroll: record.finalisedForPayroll,
                })),
                summary: {
                    totalRecords: attendance.length,
                    totalWorkMinutes: attendance.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0),
                    totalWorkHours: Math.round((attendance.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0) /
                        60) *
                        100) / 100,
                },
            },
            leave: {
                message: 'Leave data should be retrieved from Leaves subsystem',
                note: 'Use Leaves API to get leave records for this employee',
            },
        };
    }
    async getAttendanceDataForSync(employeeId, startDate, endDate, currentUserId) {
        const query = { employeeId };
        if (startDate && endDate) {
            const startDateUTC = this.convertDateToUTCStart(startDate);
            const endDateUTC = this.convertDateToUTCEnd(endDate);
            query.createdAt = { $gte: startDateUTC, $lte: endDateUTC };
        }
        const attendance = await this.attendanceRecordModel
            .find(query)
            .populate('employeeId', 'name email employeeId')
            .exec();
        return {
            employeeId,
            startDate,
            endDate,
            records: attendance.map((record) => ({
                attendanceRecordId: record._id,
                employeeId: record.employeeId?._id || record.employeeId,
                date: record.createdAt || record.date,
                punches: record.punches,
                totalWorkMinutes: record.totalWorkMinutes,
                totalWorkHours: Math.round((record.totalWorkMinutes / 60) * 100) / 100,
                hasMissedPunch: record.hasMissedPunch,
                finalisedForPayroll: record.finalisedForPayroll,
            })),
            summary: {
                totalRecords: attendance.length,
                totalWorkMinutes: attendance.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0),
                totalWorkHours: Math.round((attendance.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0) /
                    60) *
                    100) / 100,
            },
        };
    }
    async getOvertimeDataForSync(employeeId, startDate, endDate, currentUserId) {
        const query = {
            employeeId,
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
        };
        if (startDate && endDate) {
            const startDateUTC = this.convertDateToUTCStart(startDate);
            const endDateUTC = this.convertDateToUTCEnd(endDate);
            query.createdAt = { $gte: startDateUTC, $lte: endDateUTC };
        }
        const overtimeExceptions = await this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'name email employeeId')
            .populate('attendanceRecordId')
            .exec();
        const overtimeData = overtimeExceptions.map((exception) => {
            const record = exception.attendanceRecordId;
            const standardMinutes = 480;
            const overtimeMinutes = record && record.totalWorkMinutes
                ? Math.max(0, record.totalWorkMinutes - standardMinutes)
                : 0;
            return {
                exceptionId: exception._id,
                employeeId: exception.employeeId?._id || exception.employeeId,
                attendanceRecordId: exception.attendanceRecordId?._id || exception.attendanceRecordId,
                date: exception.createdAt || record?.createdAt,
                overtimeMinutes,
                overtimeHours: Math.round((overtimeMinutes / 60) * 100) / 100,
                status: exception.status,
                reason: exception.reason,
            };
        });
        return {
            employeeId,
            startDate,
            endDate,
            records: overtimeData,
            summary: {
                totalRecords: overtimeData.length,
                totalOvertimeMinutes: overtimeData.reduce((sum, r) => sum + r.overtimeMinutes, 0),
                totalOvertimeHours: Math.round((overtimeData.reduce((sum, r) => sum + r.overtimeMinutes, 0) / 60) *
                    100) / 100,
            },
        };
    }
    async runDailyPayrollSync(syncDate, currentUserId) {
        const startOfDay = this.convertDateToUTCStart(syncDate);
        const endOfDay = this.convertDateToUTCEnd(syncDate);
        const unfinalizedRecords = await this.attendanceRecordModel
            .find({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            finalisedForPayroll: { $ne: true },
        })
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .exec();
        const overtimeExceptions = await this.timeExceptionModel
            .find({
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
            status: 'APPROVED',
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        })
            .populate('employeeId', 'firstName lastName email')
            .populate('attendanceRecordId')
            .exec();
        const otherExceptions = await this.timeExceptionModel
            .find({
            type: { $ne: enums_1.TimeExceptionType.OVERTIME_REQUEST },
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        })
            .populate('employeeId', 'firstName lastName email')
            .exec();
        await this.logTimeManagementChange('DAILY_PAYROLL_SYNC_RUN', {
            syncDate,
            attendanceRecords: unfinalizedRecords.length,
            overtimeExceptions: overtimeExceptions.length,
            otherExceptions: otherExceptions.length,
        }, currentUserId);
        return {
            syncDate,
            syncedAt: new Date(),
            attendance: {
                count: unfinalizedRecords.length,
                records: unfinalizedRecords.map((r) => ({
                    recordId: r._id,
                    employeeId: r.employeeId?._id || r.employeeId,
                    employeeName: r.employeeId ? `${r.employeeId.firstName || ''} ${r.employeeId.lastName || ''}`.trim() : 'Unknown',
                    date: r.createdAt,
                    totalWorkMinutes: r.totalWorkMinutes,
                    totalWorkHours: Math.round((r.totalWorkMinutes / 60) * 100) / 100,
                    hasMissedPunch: r.hasMissedPunch,
                    finalisedForPayroll: r.finalisedForPayroll,
                })),
            },
            overtime: {
                count: overtimeExceptions.length,
                records: overtimeExceptions.map((e) => ({
                    exceptionId: e._id,
                    employeeId: e.employeeId?._id || e.employeeId,
                    status: e.status,
                    attendanceRecordId: e.attendanceRecordId?._id || e.attendanceRecordId,
                })),
            },
            exceptions: {
                count: otherExceptions.length,
                byType: this.groupExceptionsByType(otherExceptions),
            },
            summary: {
                totalAttendanceMinutes: unfinalizedRecords.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0),
                totalAttendanceHours: Math.round((unfinalizedRecords.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0) / 60) * 100) / 100,
                employeesWithMissedPunches: unfinalizedRecords.filter((r) => r.hasMissedPunch).length,
            },
        };
    }
    groupExceptionsByType(exceptions) {
        const grouped = {};
        exceptions.forEach((e) => {
            const type = e.type || 'UNKNOWN';
            if (!grouped[type])
                grouped[type] = [];
            grouped[type].push({
                exceptionId: e._id,
                employeeId: e.employeeId?._id || e.employeeId,
                status: e.status,
            });
        });
        return grouped;
    }
    async getPendingPayrollSyncData(filters, currentUserId) {
        const query = {
            finalisedForPayroll: { $ne: true },
        };
        if (filters.startDate && filters.endDate) {
            query.createdAt = {
                $gte: this.convertDateToUTCStart(filters.startDate),
                $lte: this.convertDateToUTCEnd(filters.endDate),
            };
        }
        const pendingRecords = await this.attendanceRecordModel
            .find(query)
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .sort({ createdAt: -1 })
            .exec();
        let filteredRecords = pendingRecords;
        if (filters.departmentId) {
            filteredRecords = pendingRecords.filter((r) => r.employeeId?.departmentId?.toString() === filters.departmentId);
        }
        return {
            filters,
            count: filteredRecords.length,
            records: filteredRecords.map((r) => ({
                recordId: r._id,
                employeeId: r.employeeId?._id || r.employeeId,
                employeeName: r.employeeId ? `${r.employeeId.firstName || ''} ${r.employeeId.lastName || ''}`.trim() : 'Unknown',
                date: r.createdAt,
                totalWorkMinutes: r.totalWorkMinutes,
                totalWorkHours: Math.round((r.totalWorkMinutes / 60) * 100) / 100,
                hasMissedPunch: r.hasMissedPunch,
                punchCount: r.punches?.length || 0,
            })),
            summary: {
                totalMinutes: filteredRecords.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0),
                totalHours: Math.round((filteredRecords.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0) / 60) * 100) / 100,
                recordsWithMissedPunches: filteredRecords.filter((r) => r.hasMissedPunch).length,
            },
        };
    }
    async finalizeRecordsForPayroll(recordIds, currentUserId) {
        const updateResult = await this.attendanceRecordModel.updateMany({ _id: { $in: recordIds } }, {
            finalisedForPayroll: true,
            updatedBy: currentUserId,
        });
        await this.logTimeManagementChange('RECORDS_FINALIZED_FOR_PAYROLL', {
            recordIds,
            modifiedCount: updateResult.modifiedCount,
        }, currentUserId);
        return {
            success: true,
            recordsFinalized: updateResult.modifiedCount,
            recordIds,
            finalizedAt: new Date(),
        };
    }
    async validateDataForPayrollSync(filters, currentUserId) {
        const startDateUTC = this.convertDateToUTCStart(filters.startDate);
        const endDateUTC = this.convertDateToUTCEnd(filters.endDate);
        const allRecords = await this.attendanceRecordModel
            .find({
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        })
            .populate('employeeId', 'firstName lastName email')
            .exec();
        const recordsWithMissedPunches = allRecords.filter((r) => r.hasMissedPunch);
        const recordsWithZeroMinutes = allRecords.filter((r) => !r.totalWorkMinutes || r.totalWorkMinutes === 0);
        const recordsWithOddPunches = allRecords.filter((r) => r.punches && r.punches.length % 2 !== 0);
        const pendingExceptions = await this.timeExceptionModel
            .find({
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
            status: { $in: ['OPEN', 'PENDING'] },
        })
            .populate('employeeId', 'firstName lastName email')
            .exec();
        const pendingCorrections = await this.attendanceRecordModel.db
            .collection('attendancecorrectionrequests')
            .find({
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
            status: { $in: ['SUBMITTED', 'IN_REVIEW'] },
        })
            .toArray();
        const validationIssues = [];
        if (recordsWithMissedPunches.length > 0) {
            validationIssues.push({
                type: 'MISSED_PUNCHES',
                severity: 'WARNING',
                count: recordsWithMissedPunches.length,
                message: `${recordsWithMissedPunches.length} record(s) have missed punches`,
                recordIds: recordsWithMissedPunches.map((r) => r._id),
            });
        }
        if (recordsWithZeroMinutes.length > 0) {
            validationIssues.push({
                type: 'ZERO_WORK_MINUTES',
                severity: 'WARNING',
                count: recordsWithZeroMinutes.length,
                message: `${recordsWithZeroMinutes.length} record(s) have zero work minutes`,
                recordIds: recordsWithZeroMinutes.map((r) => r._id),
            });
        }
        if (pendingExceptions.length > 0) {
            validationIssues.push({
                type: 'PENDING_EXCEPTIONS',
                severity: 'ERROR',
                count: pendingExceptions.length,
                message: `${pendingExceptions.length} unresolved exception(s) need attention before sync`,
                exceptionIds: pendingExceptions.map((e) => e._id),
            });
        }
        if (pendingCorrections.length > 0) {
            validationIssues.push({
                type: 'PENDING_CORRECTIONS',
                severity: 'ERROR',
                count: pendingCorrections.length,
                message: `${pendingCorrections.length} pending correction request(s) need resolution`,
                correctionIds: pendingCorrections.map((c) => c._id),
            });
        }
        const isValid = validationIssues.filter(i => i.severity === 'ERROR').length === 0;
        await this.logTimeManagementChange('PAYROLL_SYNC_VALIDATION', {
            startDate: filters.startDate,
            endDate: filters.endDate,
            isValid,
            issuesCount: validationIssues.length,
        }, currentUserId);
        return {
            startDate: filters.startDate,
            endDate: filters.endDate,
            isValid,
            validatedAt: new Date(),
            totalRecords: allRecords.length,
            issues: validationIssues,
            summary: {
                errorCount: validationIssues.filter(i => i.severity === 'ERROR').length,
                warningCount: validationIssues.filter(i => i.severity === 'WARNING').length,
                canProceedWithSync: isValid,
            },
        };
    }
    async getExceptionDataForPayrollSync(filters, currentUserId) {
        const query = {};
        if (filters.employeeId) {
            query.employeeId = filters.employeeId;
        }
        if (filters.startDate && filters.endDate) {
            query.createdAt = {
                $gte: this.convertDateToUTCStart(filters.startDate),
                $lte: this.convertDateToUTCEnd(filters.endDate),
            };
        }
        const exceptions = await this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .populate('attendanceRecordId')
            .sort({ createdAt: -1 })
            .exec();
        const byType = {};
        exceptions.forEach((e) => {
            const type = e.type || 'UNKNOWN';
            if (!byType[type])
                byType[type] = [];
            byType[type].push({
                exceptionId: e._id,
                employeeId: e.employeeId?._id || e.employeeId,
                employeeName: e.employeeId ? `${e.employeeId.firstName || ''} ${e.employeeId.lastName || ''}`.trim() : 'Unknown',
                type: e.type,
                status: e.status,
                reason: e.reason,
                date: e.createdAt,
                attendanceRecordId: e.attendanceRecordId?._id || e.attendanceRecordId,
            });
        });
        const byStatus = {
            OPEN: 0,
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
            ESCALATED: 0,
            RESOLVED: 0,
        };
        exceptions.forEach((e) => {
            const status = e.status || 'OPEN';
            if (byStatus.hasOwnProperty(status)) {
                byStatus[status]++;
            }
        });
        return {
            filters,
            totalCount: exceptions.length,
            byType: Object.entries(byType).map(([type, records]) => ({
                type,
                count: records.length,
                records,
            })),
            byStatus,
            payrollRelevant: {
                approvedOvertime: (byType['OVERTIME_REQUEST'] || []).filter((e) => e.status === 'APPROVED'),
                latenessRecords: byType['LATE'] || [],
                earlyLeaveRecords: byType['EARLY_LEAVE'] || [],
            },
        };
    }
    async getPayrollSyncHistory(filters, currentUserId) {
        const syncLogs = this.auditLogs.filter(log => log.entity.includes('PAYROLL_SYNC') ||
            log.entity.includes('RECORDS_FINALIZED') ||
            log.entity.includes('DAILY_PAYROLL_SYNC'));
        let filteredLogs = syncLogs;
        if (filters.startDate && filters.endDate) {
            const start = this.convertDateToUTCStart(filters.startDate);
            const end = this.convertDateToUTCEnd(filters.endDate);
            filteredLogs = syncLogs.filter(log => log.timestamp >= start && log.timestamp <= end);
        }
        const sortedLogs = filteredLogs
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, filters.limit || 50);
        return {
            count: sortedLogs.length,
            syncHistory: sortedLogs.map(log => ({
                operation: log.entity,
                details: log.changeSet,
                performedBy: log.actorId,
                timestamp: log.timestamp,
            })),
        };
    }
    async getComprehensivePayrollData(filters, currentUserId) {
        const startDateUTC = this.convertDateToUTCStart(filters.startDate);
        const endDateUTC = this.convertDateToUTCEnd(filters.endDate);
        const attendanceQuery = {
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        };
        const attendanceRecords = await this.attendanceRecordModel
            .find(attendanceQuery)
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .exec();
        let filteredAttendance = attendanceRecords;
        if (filters.departmentId) {
            filteredAttendance = attendanceRecords.filter((r) => r.employeeId?.departmentId?.toString() === filters.departmentId);
        }
        const overtimeExceptions = await this.timeExceptionModel
            .find({
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
            status: 'APPROVED',
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        })
            .populate('employeeId', 'firstName lastName departmentId')
            .populate('attendanceRecordId')
            .exec();
        const latenessExceptions = await this.timeExceptionModel
            .find({
            type: 'LATE',
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        })
            .populate('employeeId', 'firstName lastName departmentId')
            .exec();
        const employeeSummaries = {};
        filteredAttendance.forEach((r) => {
            const empId = r.employeeId?._id?.toString() || r.employeeId?.toString() || 'unknown';
            if (!employeeSummaries[empId]) {
                employeeSummaries[empId] = {
                    employeeId: empId,
                    employeeName: r.employeeId ? `${r.employeeId.firstName || ''} ${r.employeeId.lastName || ''}`.trim() : 'Unknown',
                    totalWorkMinutes: 0,
                    totalWorkHours: 0,
                    daysWorked: 0,
                    missedPunches: 0,
                    overtimeMinutes: 0,
                    latenessCount: 0,
                };
            }
            employeeSummaries[empId].totalWorkMinutes += r.totalWorkMinutes || 0;
            employeeSummaries[empId].daysWorked++;
            if (r.hasMissedPunch)
                employeeSummaries[empId].missedPunches++;
        });
        overtimeExceptions.forEach((e) => {
            const empId = e.employeeId?._id?.toString() || e.employeeId?.toString();
            if (empId && employeeSummaries[empId]) {
                const record = e.attendanceRecordId;
                const overtimeMinutes = record?.totalWorkMinutes ? Math.max(0, record.totalWorkMinutes - 480) : 0;
                employeeSummaries[empId].overtimeMinutes += overtimeMinutes;
            }
        });
        latenessExceptions.forEach((e) => {
            const empId = e.employeeId?._id?.toString() || e.employeeId?.toString();
            if (empId && employeeSummaries[empId]) {
                employeeSummaries[empId].latenessCount++;
            }
        });
        Object.values(employeeSummaries).forEach((summary) => {
            summary.totalWorkHours = Math.round((summary.totalWorkMinutes / 60) * 100) / 100;
            summary.overtimeHours = Math.round((summary.overtimeMinutes / 60) * 100) / 100;
        });
        await this.logTimeManagementChange('COMPREHENSIVE_PAYROLL_DATA_RETRIEVED', {
            startDate: filters.startDate,
            endDate: filters.endDate,
            departmentId: filters.departmentId,
            employeeCount: Object.keys(employeeSummaries).length,
            attendanceRecords: filteredAttendance.length,
        }, currentUserId);
        return {
            period: {
                startDate: filters.startDate,
                endDate: filters.endDate,
            },
            departmentId: filters.departmentId || 'ALL',
            generatedAt: new Date(),
            employeeSummaries: Object.values(employeeSummaries),
            totals: {
                totalEmployees: Object.keys(employeeSummaries).length,
                totalWorkMinutes: Object.values(employeeSummaries).reduce((sum, e) => sum + e.totalWorkMinutes, 0),
                totalWorkHours: Math.round((Object.values(employeeSummaries).reduce((sum, e) => sum + e.totalWorkMinutes, 0) / 60) * 100) / 100,
                totalOvertimeMinutes: Object.values(employeeSummaries).reduce((sum, e) => sum + e.overtimeMinutes, 0),
                totalOvertimeHours: Math.round((Object.values(employeeSummaries).reduce((sum, e) => sum + e.overtimeMinutes, 0) / 60) * 100) / 100,
                totalLatenessCount: Object.values(employeeSummaries).reduce((sum, e) => sum + e.latenessCount, 0),
                totalMissedPunches: Object.values(employeeSummaries).reduce((sum, e) => sum + e.missedPunches, 0),
            },
        };
    }
    async sendShiftExpiryNotification(recipientId, shiftAssignmentId, employeeId, endDate, daysRemaining, currentUserId) {
        const message = `Shift assignment ${shiftAssignmentId} for employee ${employeeId} is expiring in ${daysRemaining} days (${endDate.toISOString().split('T')[0]}). Please renew or reassign.`;
        const notification = new this.notificationLogModel({
            to: recipientId,
            type: 'SHIFT_EXPIRY_ALERT',
            message,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await notification.save();
        await this.logTimeManagementChange('SHIFT_EXPIRY_NOTIFICATION_SENT', {
            recipientId,
            shiftAssignmentId,
            employeeId,
            endDate,
            daysRemaining,
        }, currentUserId);
        return notification;
    }
    async sendBulkShiftExpiryNotifications(hrAdminIds, expiringAssignments, currentUserId) {
        const notifications = [];
        for (const hrAdminId of hrAdminIds) {
            const message = `${expiringAssignments.length} shift assignment(s) expiring soon:\n` +
                expiringAssignments
                    .map(a => `- ${a.employeeName || a.employeeId}: ${a.shiftName || 'Shift'} expires in ${a.daysRemaining} days`)
                    .join('\n');
            const notification = new this.notificationLogModel({
                to: hrAdminId,
                type: 'SHIFT_EXPIRY_BULK_ALERT',
                message,
                createdBy: currentUserId,
                updatedBy: currentUserId,
            });
            await notification.save();
            notifications.push(notification);
        }
        await this.logTimeManagementChange('SHIFT_EXPIRY_BULK_NOTIFICATIONS_SENT', {
            hrAdminCount: hrAdminIds.length,
            expiringCount: expiringAssignments.length,
            assignmentIds: expiringAssignments.map(a => a.assignmentId),
        }, currentUserId);
        return {
            notificationsSent: notifications.length,
            notifications,
        };
    }
    async getShiftExpiryNotifications(hrAdminId, currentUserId) {
        const notifications = await this.notificationLogModel
            .find({
            to: hrAdminId,
            type: { $in: ['SHIFT_EXPIRY_ALERT', 'SHIFT_EXPIRY_BULK_ALERT'] },
        })
            .sort({ createdAt: -1 })
            .exec();
        return {
            count: notifications.length,
            notifications,
        };
    }
    async sendShiftRenewalConfirmation(recipientId, shiftAssignmentId, newEndDate, currentUserId) {
        const message = `Shift assignment ${shiftAssignmentId} has been renewed. New end date: ${newEndDate.toISOString().split('T')[0]}.`;
        const notification = new this.notificationLogModel({
            to: recipientId,
            type: 'SHIFT_RENEWAL_CONFIRMATION',
            message,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await notification.save();
        await this.logTimeManagementChange('SHIFT_RENEWAL_NOTIFICATION_SENT', {
            recipientId,
            shiftAssignmentId,
            newEndDate,
        }, currentUserId);
        return notification;
    }
    async sendShiftArchiveNotification(recipientId, shiftAssignmentId, employeeId, currentUserId) {
        const message = `Shift assignment ${shiftAssignmentId} for employee ${employeeId} has been archived/expired. Consider creating a new assignment if needed.`;
        const notification = new this.notificationLogModel({
            to: recipientId,
            type: 'SHIFT_ARCHIVE_NOTIFICATION',
            message,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await notification.save();
        await this.logTimeManagementChange('SHIFT_ARCHIVE_NOTIFICATION_SENT', {
            recipientId,
            shiftAssignmentId,
            employeeId,
        }, currentUserId);
        return notification;
    }
    async getAllShiftNotifications(hrAdminId, currentUserId) {
        const notifications = await this.notificationLogModel
            .find({
            to: hrAdminId,
            type: {
                $in: [
                    'SHIFT_EXPIRY_ALERT',
                    'SHIFT_EXPIRY_BULK_ALERT',
                    'SHIFT_RENEWAL_CONFIRMATION',
                    'SHIFT_ARCHIVE_NOTIFICATION',
                ],
            },
        })
            .sort({ createdAt: -1 })
            .exec();
        const grouped = {
            expiryAlerts: notifications.filter(n => n.type === 'SHIFT_EXPIRY_ALERT' || n.type === 'SHIFT_EXPIRY_BULK_ALERT'),
            renewalConfirmations: notifications.filter(n => n.type === 'SHIFT_RENEWAL_CONFIRMATION'),
            archiveNotifications: notifications.filter(n => n.type === 'SHIFT_ARCHIVE_NOTIFICATION'),
        };
        return {
            totalCount: notifications.length,
            grouped,
            all: notifications,
        };
    }
    async sendMissedPunchAlertToEmployee(employeeId, attendanceRecordId, missedPunchType, date, currentUserId) {
        const message = `Missed ${missedPunchType === 'CLOCK_IN' ? 'clock-in' : 'clock-out'} detected on ${date.toISOString().split('T')[0]}. Please submit a correction request.`;
        const notification = new this.notificationLogModel({
            to: employeeId,
            type: 'MISSED_PUNCH_EMPLOYEE_ALERT',
            message,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await notification.save();
        await this.logTimeManagementChange('MISSED_PUNCH_EMPLOYEE_ALERT_SENT', {
            employeeId,
            attendanceRecordId,
            missedPunchType,
            date,
        }, currentUserId);
        return notification;
    }
    async sendMissedPunchAlertToManager(managerId, employeeId, employeeName, attendanceRecordId, missedPunchType, date, currentUserId) {
        const message = `Employee ${employeeName} (${employeeId}) has a missed ${missedPunchType === 'CLOCK_IN' ? 'clock-in' : 'clock-out'} on ${date.toISOString().split('T')[0]}. Pending correction review.`;
        const notification = new this.notificationLogModel({
            to: managerId,
            type: 'MISSED_PUNCH_MANAGER_ALERT',
            message,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await notification.save();
        await this.logTimeManagementChange('MISSED_PUNCH_MANAGER_ALERT_SENT', {
            managerId,
            employeeId,
            employeeName,
            attendanceRecordId,
            missedPunchType,
            date,
        }, currentUserId);
        return notification;
    }
    async sendBulkMissedPunchAlerts(alerts, currentUserId) {
        const notifications = [];
        for (const alert of alerts) {
            const employeeNotification = await this.sendMissedPunchAlertToEmployee(alert.employeeId, alert.attendanceRecordId, alert.missedPunchType, alert.date, currentUserId);
            notifications.push({ type: 'employee', notification: employeeNotification });
            if (alert.managerId) {
                const managerNotification = await this.sendMissedPunchAlertToManager(alert.managerId, alert.employeeId, alert.employeeName || 'Unknown Employee', alert.attendanceRecordId, alert.missedPunchType, alert.date, currentUserId);
                notifications.push({ type: 'manager', notification: managerNotification });
            }
        }
        await this.logTimeManagementChange('BULK_MISSED_PUNCH_ALERTS_SENT', {
            alertCount: alerts.length,
            notificationsSent: notifications.length,
        }, currentUserId);
        return {
            alertsProcessed: alerts.length,
            notificationsSent: notifications.length,
            notifications,
        };
    }
    async getMissedPunchNotificationsByEmployee(employeeId, currentUserId) {
        const notifications = await this.notificationLogModel
            .find({
            to: employeeId,
            type: 'MISSED_PUNCH_EMPLOYEE_ALERT',
        })
            .sort({ createdAt: -1 })
            .exec();
        return {
            count: notifications.length,
            notifications,
        };
    }
    async getMissedPunchNotificationsByManager(managerId, currentUserId) {
        const notifications = await this.notificationLogModel
            .find({
            to: managerId,
            type: 'MISSED_PUNCH_MANAGER_ALERT',
        })
            .sort({ createdAt: -1 })
            .exec();
        return {
            count: notifications.length,
            notifications,
        };
    }
    async getAllMissedPunchNotifications(filters, currentUserId) {
        const query = {
            type: { $in: ['MISSED_PUNCH_EMPLOYEE_ALERT', 'MISSED_PUNCH_MANAGER_ALERT'] },
        };
        if (filters.startDate && filters.endDate) {
            query.createdAt = {
                $gte: this.convertDateToUTCStart(filters.startDate),
                $lte: this.convertDateToUTCEnd(filters.endDate),
            };
        }
        const notifications = await this.notificationLogModel
            .find(query)
            .sort({ createdAt: -1 })
            .exec();
        const employeeAlerts = notifications.filter(n => n.type === 'MISSED_PUNCH_EMPLOYEE_ALERT');
        const managerAlerts = notifications.filter(n => n.type === 'MISSED_PUNCH_MANAGER_ALERT');
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
    async flagMissedPunchWithNotification(attendanceRecordId, employeeId, managerId, employeeName, missedPunchType, currentUserId) {
        const attendanceRecord = await this.attendanceRecordModel.findByIdAndUpdate(attendanceRecordId, {
            hasMissedPunch: true,
            updatedBy: currentUserId,
        }, { new: true });
        if (!attendanceRecord) {
            throw new Error('Attendance record not found');
        }
        const timeException = new this.timeExceptionModel({
            employeeId,
            type: enums_1.TimeExceptionType.MISSED_PUNCH,
            attendanceRecordId,
            assignedTo: managerId,
            status: 'OPEN',
            reason: `Auto-detected missed ${missedPunchType === 'CLOCK_IN' ? 'clock-in' : 'clock-out'}`,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await timeException.save();
        const recordDate = attendanceRecord.createdAt || new Date();
        const employeeNotification = await this.sendMissedPunchAlertToEmployee(employeeId, attendanceRecordId, missedPunchType, recordDate, currentUserId);
        const managerNotification = await this.sendMissedPunchAlertToManager(managerId, employeeId, employeeName, attendanceRecordId, missedPunchType, recordDate, currentUserId);
        await this.logTimeManagementChange('MISSED_PUNCH_FLAGGED_WITH_NOTIFICATION', {
            attendanceRecordId,
            employeeId,
            managerId,
            missedPunchType,
            timeExceptionId: timeException._id,
        }, currentUserId);
        return {
            attendanceRecord,
            timeException,
            notifications: {
                employee: employeeNotification,
                manager: managerNotification,
            },
        };
    }
    async getMissedPunchStatistics(filters, currentUserId) {
        const query = { hasMissedPunch: true };
        if (filters.employeeId) {
            query.employeeId = filters.employeeId;
        }
        if (filters.startDate && filters.endDate) {
            query.createdAt = {
                $gte: this.convertDateToUTCStart(filters.startDate),
                $lte: this.convertDateToUTCEnd(filters.endDate),
            };
        }
        const missedPunchRecords = await this.attendanceRecordModel
            .find(query)
            .populate('employeeId', 'firstName lastName email')
            .exec();
        const byEmployee = {};
        missedPunchRecords.forEach((record) => {
            const empId = record.employeeId?._id?.toString() || record.employeeId?.toString() || 'unknown';
            if (!byEmployee[empId]) {
                byEmployee[empId] = { count: 0, records: [] };
            }
            byEmployee[empId].count++;
            byEmployee[empId].records.push({
                recordId: record._id,
                date: record.createdAt,
                punchCount: record.punches?.length || 0,
            });
        });
        const exceptionQuery = {
            type: enums_1.TimeExceptionType.MISSED_PUNCH,
        };
        if (filters.startDate && filters.endDate) {
            exceptionQuery.createdAt = {
                $gte: this.convertDateToUTCStart(filters.startDate),
                $lte: this.convertDateToUTCEnd(filters.endDate),
            };
        }
        const missedPunchExceptions = await this.timeExceptionModel
            .find(exceptionQuery)
            .exec();
        const exceptionsByStatus = {
            open: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            escalated: 0,
            resolved: 0,
        };
        missedPunchExceptions.forEach((exc) => {
            const status = exc.status?.toLowerCase() || 'open';
            if (exceptionsByStatus.hasOwnProperty(status)) {
                exceptionsByStatus[status]++;
            }
        });
        return {
            period: { startDate: filters.startDate, endDate: filters.endDate },
            summary: {
                totalMissedPunchRecords: missedPunchRecords.length,
                totalExceptions: missedPunchExceptions.length,
                uniqueEmployees: Object.keys(byEmployee).length,
            },
            exceptionsByStatus,
            byEmployee: Object.entries(byEmployee).map(([empId, data]) => ({
                employeeId: empId,
                ...data,
            })),
        };
    }
    convertDateToUTCStart(date) {
        const dateObj = date instanceof Date ? date : new Date(date);
        return new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), 0, 0, 0, 0));
    }
    convertDateToUTCEnd(date) {
        const dateObj = date instanceof Date ? date : new Date(date);
        return new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), 23, 59, 59, 999));
    }
    async linkVacationToAttendanceSchedule(params, currentUserId) {
        const { employeeId, vacationPackageId, startDate, endDate, vacationType, autoReflect = true } = params;
        await this.logTimeManagementChange('VACATION_ATTENDANCE_LINKED', {
            employeeId,
            vacationPackageId,
            startDate,
            endDate,
            vacationType,
            autoReflect,
        }, currentUserId);
        const attendanceRecords = await this.attendanceRecordModel
            .find({
            employeeId,
            date: { $gte: startDate, $lte: endDate },
        })
            .exec();
        const affectedDays = attendanceRecords.length;
        const workingDaysInRange = this.calculateWorkingDays(startDate, endDate);
        return {
            success: true,
            linkage: {
                employeeId,
                vacationPackageId,
                vacationType,
                period: { startDate, endDate },
                autoReflect,
            },
            attendanceImpact: {
                affectedAttendanceRecords: affectedDays,
                workingDaysInRange,
                message: autoReflect
                    ? 'Vacation will be automatically reflected in attendance records'
                    : 'Manual attendance adjustments required',
            },
            linkedAt: new Date(),
            linkedBy: currentUserId,
        };
    }
    async getEmployeeVacationAttendanceStatus(params, currentUserId) {
        const { employeeId, startDate, endDate } = params;
        const attendanceRecords = await this.attendanceRecordModel
            .find({
            employeeId,
            date: { $gte: startDate, $lte: endDate },
        })
            .sort({ date: 1 })
            .exec();
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const recordedDays = attendanceRecords.length;
        const presentDays = attendanceRecords.filter((r) => r.clockIn).length;
        const absentDays = recordedDays - presentDays;
        const potentialVacationDays = attendanceRecords.filter((r) => !r.clockIn);
        return {
            employeeId,
            period: { startDate, endDate },
            summary: {
                totalDays,
                recordedDays,
                presentDays,
                absentDays,
                attendanceRate: recordedDays > 0 ? `${Math.round((presentDays / recordedDays) * 100)}%` : 'N/A',
            },
            potentialVacationDays: potentialVacationDays.map((r) => ({
                date: r.date,
                status: 'ABSENT',
                note: 'May be covered by vacation package',
            })),
            recommendation: absentDays > 0
                ? 'Review absent days against vacation entitlements'
                : 'All days accounted for in attendance',
            generatedAt: new Date(),
        };
    }
    async validateVacationAgainstShiftSchedule(params, currentUserId) {
        const { employeeId, vacationStartDate, vacationEndDate } = params;
        const existingRecords = await this.attendanceRecordModel
            .find({
            employeeId,
            date: { $gte: vacationStartDate, $lte: vacationEndDate },
            clockIn: { $ne: null },
        })
            .exec();
        const hasConflicts = existingRecords.length > 0;
        const conflictDates = existingRecords.map((r) => r.date);
        const workingDays = this.calculateWorkingDays(vacationStartDate, vacationEndDate);
        return {
            valid: !hasConflicts,
            employeeId,
            vacationPeriod: {
                startDate: vacationStartDate,
                endDate: vacationEndDate,
                totalDays: Math.ceil((vacationEndDate.getTime() - vacationStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
                workingDays,
            },
            conflicts: hasConflicts ? {
                count: existingRecords.length,
                dates: conflictDates,
                message: 'Employee has attendance records (worked) during requested vacation period',
            } : null,
            recommendation: hasConflicts
                ? 'Review attendance records before approving vacation'
                : 'No conflicts found - vacation can be approved',
            validatedAt: new Date(),
        };
    }
    async calculateLeaveDeductionsFromAttendance(params, currentUserId) {
        const { employeeId, startDate, endDate, leaveType = 'ANNUAL' } = params;
        const attendanceRecords = await this.attendanceRecordModel
            .find({
            employeeId,
            date: { $gte: startDate, $lte: endDate },
        })
            .exec();
        const absentDays = attendanceRecords.filter((r) => !r.clockIn);
        const workingDaysInPeriod = this.calculateWorkingDays(startDate, endDate);
        const deductionDays = absentDays.length;
        const halfDays = attendanceRecords.filter((r) => {
            const workMinutes = r.totalWorkMinutes || 0;
            return workMinutes > 0 && workMinutes < 240;
        }).length;
        await this.logTimeManagementChange('LEAVE_DEDUCTION_CALCULATED', {
            employeeId,
            startDate,
            endDate,
            deductionDays,
            halfDays,
            leaveType,
        }, currentUserId);
        return {
            employeeId,
            period: { startDate, endDate },
            leaveType,
            deduction: {
                fullDays: deductionDays,
                halfDays,
                totalDeduction: deductionDays + (halfDays * 0.5),
                unit: 'days',
            },
            breakdown: {
                workingDaysInPeriod,
                daysPresent: attendanceRecords.filter((r) => r.clockIn).length,
                daysAbsent: deductionDays,
                partialDays: halfDays,
            },
            syncStatus: {
                readyForPayroll: true,
                readyForLeaveModule: true,
                note: 'Deduction calculated - sync with Leaves module for entitlement update',
            },
            calculatedAt: new Date(),
        };
    }
    async getDepartmentVacationAttendanceSummary(params, currentUserId) {
        const { startDate, endDate } = params;
        const attendanceRecords = await this.attendanceRecordModel
            .find({
            date: { $gte: startDate, $lte: endDate },
        })
            .populate('employeeId', 'firstName lastName employeeNumber departmentId')
            .exec();
        const employeeStats = {};
        attendanceRecords.forEach((record) => {
            const empId = record.employeeId?._id?.toString() || 'unknown';
            if (!employeeStats[empId]) {
                employeeStats[empId] = {
                    employee: record.employeeId,
                    presentDays: 0,
                    absentDays: 0,
                    totalWorkMinutes: 0,
                };
            }
            if (record.clockIn) {
                employeeStats[empId].presentDays += 1;
                employeeStats[empId].totalWorkMinutes += record.totalWorkMinutes || 0;
            }
            else {
                employeeStats[empId].absentDays += 1;
            }
        });
        const employeeSummaries = Object.entries(employeeStats).map(([empId, stats]) => ({
            employeeId: empId,
            employeeName: stats.employee
                ? `${stats.employee.firstName} ${stats.employee.lastName}`
                : 'Unknown',
            employeeNumber: stats.employee?.employeeNumber || 'N/A',
            presentDays: stats.presentDays,
            absentDays: stats.absentDays,
            potentialVacationDays: stats.absentDays,
            totalWorkHours: Math.round((stats.totalWorkMinutes / 60) * 100) / 100,
        }));
        employeeSummaries.sort((a, b) => b.absentDays - a.absentDays);
        return {
            reportType: 'VACATION_ATTENDANCE_SUMMARY',
            period: { startDate, endDate },
            summary: {
                totalEmployees: employeeSummaries.length,
                totalPresentDays: employeeSummaries.reduce((sum, e) => sum + e.presentDays, 0),
                totalAbsentDays: employeeSummaries.reduce((sum, e) => sum + e.absentDays, 0),
                avgAbsentDaysPerEmployee: employeeSummaries.length > 0
                    ? Math.round((employeeSummaries.reduce((sum, e) => sum + e.absentDays, 0) / employeeSummaries.length) * 100) / 100
                    : 0,
            },
            employees: employeeSummaries,
            note: 'Absent days may be covered by vacation packages - cross-reference with Leaves module',
            generatedAt: new Date(),
        };
    }
    async getPayrollCutoffConfig(currentUserId) {
        return {
            cutoffSchedule: {
                dayOfMonth: 25,
                escalationDaysBefore: 3,
                warningDaysBefore: 5,
                reminderDaysBefore: 7,
            },
            escalationRules: {
                autoEscalateUnreviewedCorrections: true,
                autoEscalateUnreviewedExceptions: true,
                autoEscalateOvertimeRequests: true,
                notifyHROnEscalation: true,
                notifyManagerOnEscalation: true,
                blockPayrollIfPending: false,
            },
            notifications: {
                sendReminderEmails: true,
                sendEscalationAlerts: true,
                dailyDigestEnabled: true,
            },
            currentMonth: {
                cutoffDate: this.getNextPayrollCutoffDate(25),
                daysUntilCutoff: this.getDaysUntilCutoff(25),
                status: this.getDaysUntilCutoff(25) <= 3 ? 'CRITICAL' : this.getDaysUntilCutoff(25) <= 5 ? 'WARNING' : 'NORMAL',
            },
        };
    }
    async getPendingRequestsBeforePayrollCutoff(params, currentUserId) {
        const cutoffDate = params.payrollCutoffDate || this.getNextPayrollCutoffDate(25);
        const now = new Date();
        const daysUntilCutoff = Math.ceil((cutoffDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const pendingExceptions = await this.timeExceptionModel
            .find({
            status: { $in: ['OPEN', 'PENDING'] },
        })
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .populate('assignedTo', 'firstName lastName email')
            .exec();
        const categorized = {
            critical: [],
            high: [],
            medium: [],
        };
        pendingExceptions.forEach((exc) => {
            const createdAt = new Date(exc.createdAt);
            const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
            const item = {
                id: exc._id,
                type: exc.type,
                status: exc.status,
                employee: exc.employeeId ? {
                    id: exc.employeeId._id,
                    name: `${exc.employeeId.firstName} ${exc.employeeId.lastName}`,
                    employeeNumber: exc.employeeId.employeeNumber,
                } : null,
                assignedTo: exc.assignedTo ? {
                    id: exc.assignedTo._id,
                    name: `${exc.assignedTo.firstName} ${exc.assignedTo.lastName}`,
                } : null,
                ageInDays,
                createdAt: exc.createdAt,
            };
            if (daysUntilCutoff <= 2 || ageInDays >= 5) {
                categorized.critical.push(item);
            }
            else if (daysUntilCutoff <= 5 || ageInDays >= 3) {
                categorized.high.push(item);
            }
            else {
                categorized.medium.push(item);
            }
        });
        await this.logTimeManagementChange('PAYROLL_CUTOFF_PENDING_CHECK', {
            cutoffDate,
            daysUntilCutoff,
            totalPending: pendingExceptions.length,
            critical: categorized.critical.length,
        }, currentUserId);
        return {
            payrollCutoff: {
                date: cutoffDate,
                daysRemaining: daysUntilCutoff,
                status: daysUntilCutoff <= 2 ? 'CRITICAL' : daysUntilCutoff <= 5 ? 'WARNING' : 'NORMAL',
            },
            summary: {
                totalPending: pendingExceptions.length,
                critical: categorized.critical.length,
                high: categorized.high.length,
                medium: categorized.medium.length,
            },
            pendingByUrgency: categorized,
            recommendation: categorized.critical.length > 0
                ? 'IMMEDIATE ACTION REQUIRED: Critical items must be reviewed before payroll cutoff'
                : categorized.high.length > 0
                    ? 'HIGH PRIORITY: Review high-priority items within 1-2 days'
                    : 'ON TRACK: All pending items can be processed before cutoff',
            generatedAt: new Date(),
        };
    }
    async autoEscalateBeforePayrollCutoff(params, currentUserId) {
        const { payrollCutoffDate = this.getNextPayrollCutoffDate(25), escalationDaysBefore = 3, notifyManagers = true, } = params;
        const now = new Date();
        const daysUntilCutoff = Math.ceil((payrollCutoffDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilCutoff > escalationDaysBefore) {
            return {
                success: false,
                message: `Not within escalation window. ${daysUntilCutoff} days until cutoff, escalation starts ${escalationDaysBefore} days before.`,
                payrollCutoff: payrollCutoffDate,
                daysUntilCutoff,
                escalationDaysBefore,
                escalated: [],
            };
        }
        const pendingExceptions = await this.timeExceptionModel
            .find({
            status: { $in: ['OPEN', 'PENDING'] },
        })
            .exec();
        const escalatedItems = [];
        const failedItems = [];
        for (const exception of pendingExceptions) {
            try {
                await this.timeExceptionModel.findByIdAndUpdate(exception._id, {
                    status: 'ESCALATED',
                    reason: `${exception.reason || ''}\n\n[AUTO-ESCALATED - PAYROLL CUTOFF]\nEscalated on: ${now.toISOString()}\nPayroll cutoff: ${payrollCutoffDate.toISOString()}\nDays until cutoff: ${daysUntilCutoff}`,
                    updatedBy: currentUserId,
                });
                escalatedItems.push({
                    id: exception._id,
                    type: exception.type,
                    previousStatus: exception.status,
                });
            }
            catch {
                failedItems.push({ id: exception._id, error: 'Failed to escalate' });
            }
        }
        if (notifyManagers && escalatedItems.length > 0) {
            await this.sendNotification({
                to: 'HR_MANAGERS',
                type: 'PAYROLL_ESCALATION_ALERT',
                message: `${escalatedItems.length} time management requests have been auto-escalated due to approaching payroll cutoff (${payrollCutoffDate.toDateString()}). Immediate review required.`,
            }, currentUserId);
        }
        await this.logTimeManagementChange('PAYROLL_AUTO_ESCALATION', {
            payrollCutoffDate,
            daysUntilCutoff,
            escalatedCount: escalatedItems.length,
            failedCount: failedItems.length,
        }, currentUserId);
        return {
            success: true,
            payrollCutoff: {
                date: payrollCutoffDate,
                daysRemaining: daysUntilCutoff,
            },
            escalation: {
                totalEscalated: escalatedItems.length,
                totalFailed: failedItems.length,
                items: escalatedItems,
                failed: failedItems.length > 0 ? failedItems : undefined,
            },
            notificationSent: notifyManagers && escalatedItems.length > 0,
            executedAt: new Date(),
            executedBy: currentUserId,
        };
    }
    async checkPayrollReadinessStatus(params, currentUserId) {
        const cutoffDate = params.payrollCutoffDate || this.getNextPayrollCutoffDate(25);
        const now = new Date();
        const daysUntilCutoff = Math.ceil((cutoffDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const pendingExceptionsCount = await this.timeExceptionModel.countDocuments({
            status: { $in: ['OPEN', 'PENDING'] },
        });
        const escalatedCount = await this.timeExceptionModel.countDocuments({
            status: 'ESCALATED',
        });
        const approvedCount = await this.timeExceptionModel.countDocuments({
            status: 'APPROVED',
        });
        const resolvedCount = await this.timeExceptionModel.countDocuments({
            status: 'RESOLVED',
        });
        const isReady = pendingExceptionsCount === 0 && escalatedCount === 0;
        const hasBlockers = pendingExceptionsCount > 0;
        const hasWarnings = escalatedCount > 0;
        let readinessStatus;
        if (isReady) {
            readinessStatus = 'READY';
        }
        else if (daysUntilCutoff <= 1 && hasBlockers) {
            readinessStatus = 'CRITICAL';
        }
        else if (hasBlockers) {
            readinessStatus = 'BLOCKED';
        }
        else {
            readinessStatus = 'WARNING';
        }
        return {
            payrollCutoff: {
                date: cutoffDate,
                daysRemaining: daysUntilCutoff,
            },
            readiness: {
                status: readinessStatus,
                isReady,
                hasBlockers,
                hasWarnings,
                message: isReady
                    ? 'All time management requests have been processed. Payroll can proceed.'
                    : hasBlockers
                        ? `${pendingExceptionsCount} pending request(s) must be reviewed before payroll.`
                        : `${escalatedCount} escalated request(s) require attention but payroll can proceed with caution.`,
            },
            counts: {
                pending: pendingExceptionsCount,
                escalated: escalatedCount,
                approved: approvedCount,
                resolved: resolvedCount,
            },
            recommendations: this.getPayrollReadinessRecommendations(pendingExceptionsCount, escalatedCount, daysUntilCutoff),
            checkedAt: new Date(),
        };
    }
    async getEscalationHistory(params, currentUserId) {
        const { startDate, endDate, type = 'ALL' } = params;
        const query = {
            status: 'ESCALATED',
        };
        if (startDate && endDate) {
            query.updatedAt = { $gte: startDate, $lte: endDate };
        }
        const escalatedItems = await this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'firstName lastName employeeNumber')
            .populate('assignedTo', 'firstName lastName')
            .sort({ updatedAt: -1 })
            .limit(100)
            .exec();
        const categorized = {
            payroll: [],
            threshold: [],
            manual: [],
        };
        escalatedItems.forEach((item) => {
            const entry = {
                id: item._id,
                type: item.type,
                employee: item.employeeId ? `${item.employeeId.firstName} ${item.employeeId.lastName}` : 'Unknown',
                assignedTo: item.assignedTo ? `${item.assignedTo.firstName} ${item.assignedTo.lastName}` : 'Unassigned',
                escalatedAt: item.updatedAt,
                reason: item.reason,
            };
            if (item.reason?.includes('PAYROLL CUTOFF')) {
                categorized.payroll.push(entry);
            }
            else if (item.reason?.includes('AUTO-ESCALATED') && item.reason?.includes('days')) {
                categorized.threshold.push(entry);
            }
            else {
                categorized.manual.push(entry);
            }
        });
        const filteredItems = type === 'ALL'
            ? escalatedItems
            : type === 'PAYROLL'
                ? categorized.payroll
                : type === 'THRESHOLD'
                    ? categorized.threshold
                    : categorized.manual;
        return {
            period: {
                startDate: startDate || 'ALL',
                endDate: endDate || 'NOW',
            },
            filter: type,
            summary: {
                total: escalatedItems.length,
                byPayrollCutoff: categorized.payroll.length,
                byThreshold: categorized.threshold.length,
                manual: categorized.manual.length,
            },
            items: filteredItems.slice(0, 50),
            generatedAt: new Date(),
        };
    }
    async sendPayrollCutoffReminders(params, currentUserId) {
        const { payrollCutoffDate = this.getNextPayrollCutoffDate(25), reminderDaysBefore = 5, } = params;
        const now = new Date();
        const daysUntilCutoff = Math.ceil((payrollCutoffDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilCutoff > reminderDaysBefore) {
            return {
                success: false,
                message: `Not within reminder window. ${daysUntilCutoff} days until cutoff, reminders start ${reminderDaysBefore} days before.`,
                remindersSent: 0,
            };
        }
        const pendingExceptions = await this.timeExceptionModel
            .find({
            status: { $in: ['OPEN', 'PENDING'] },
            assignedTo: { $exists: true },
        })
            .populate('assignedTo', 'firstName lastName email')
            .exec();
        const byAssignee = {};
        pendingExceptions.forEach((exc) => {
            const assigneeId = exc.assignedTo?._id?.toString() || 'unassigned';
            if (!byAssignee[assigneeId]) {
                byAssignee[assigneeId] = {
                    assignee: exc.assignedTo,
                    items: [],
                };
            }
            byAssignee[assigneeId].items.push(exc);
        });
        const remindersSent = [];
        for (const [assigneeId, data] of Object.entries(byAssignee)) {
            if (data.assignee && data.items.length > 0) {
                const notification = await this.sendNotification({
                    to: assigneeId,
                    type: 'PAYROLL_CUTOFF_REMINDER',
                    message: `Reminder: You have ${data.items.length} pending time management request(s) that need review before payroll cutoff on ${payrollCutoffDate.toDateString()}. Only ${daysUntilCutoff} day(s) remaining.`,
                }, currentUserId);
                remindersSent.push({
                    assigneeId,
                    assigneeName: `${data.assignee.firstName} ${data.assignee.lastName}`,
                    pendingCount: data.items.length,
                    notificationId: notification._id,
                });
            }
        }
        await this.logTimeManagementChange('PAYROLL_CUTOFF_REMINDERS_SENT', {
            payrollCutoffDate,
            daysUntilCutoff,
            reminderCount: remindersSent.length,
        }, currentUserId);
        return {
            success: true,
            payrollCutoff: {
                date: payrollCutoffDate,
                daysRemaining: daysUntilCutoff,
            },
            remindersSent: remindersSent.length,
            reminders: remindersSent,
            sentAt: new Date(),
        };
    }
    calculateWorkingDays(startDate, endDate) {
        let count = 0;
        const current = new Date(startDate);
        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        return count;
    }
    getNextPayrollCutoffDate(dayOfMonth) {
        const now = new Date();
        const cutoff = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
        if (now > cutoff) {
            cutoff.setMonth(cutoff.getMonth() + 1);
        }
        return cutoff;
    }
    getDaysUntilCutoff(dayOfMonth) {
        const cutoff = this.getNextPayrollCutoffDate(dayOfMonth);
        const now = new Date();
        return Math.ceil((cutoff.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
    getPayrollReadinessRecommendations(pendingCount, escalatedCount, daysUntilCutoff) {
        const recommendations = [];
        if (pendingCount === 0 && escalatedCount === 0) {
            recommendations.push('All items processed - payroll can proceed');
            return recommendations;
        }
        if (pendingCount > 0) {
            if (daysUntilCutoff <= 1) {
                recommendations.push(`URGENT: ${pendingCount} pending items require immediate review`);
                recommendations.push('Consider auto-escalation to expedite processing');
            }
            else if (daysUntilCutoff <= 3) {
                recommendations.push(`Review ${pendingCount} pending items within the next ${daysUntilCutoff - 1} days`);
                recommendations.push('Send reminders to assigned reviewers');
            }
            else {
                recommendations.push(`${pendingCount} pending items should be processed before cutoff`);
            }
        }
        if (escalatedCount > 0) {
            recommendations.push(`${escalatedCount} escalated items need HR/management attention`);
            if (daysUntilCutoff <= 2) {
                recommendations.push('Prioritize escalated items for resolution');
            }
        }
        return recommendations;
    }
    async getCrossModuleSyncStatus(params, currentUserId) {
        const now = new Date();
        const startDate = params.startDate || new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = params.endDate || now;
        const startDateUTC = this.convertDateToUTCStart(startDate);
        const endDateUTC = this.convertDateToUTCEnd(endDate);
        const allAttendance = await this.attendanceRecordModel
            .find({
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        })
            .exec();
        const finalizedCount = allAttendance.filter((r) => r.finalisedForPayroll).length;
        const pendingCount = allAttendance.length - finalizedCount;
        const allExceptions = await this.timeExceptionModel
            .find({
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        })
            .exec();
        const approvedExceptions = allExceptions.filter(e => e.status === 'APPROVED').length;
        const pendingExceptions = allExceptions.filter(e => e.status === enums_1.TimeExceptionStatus.OPEN || e.status === enums_1.TimeExceptionStatus.PENDING).length;
        const recentSyncs = this.auditLogs
            .filter(log => log.entity.includes('SYNC') &&
            log.timestamp >= startDateUTC &&
            log.timestamp <= endDateUTC)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);
        const syncHealth = {
            attendanceSyncRate: allAttendance.length > 0
                ? Math.round((finalizedCount / allAttendance.length) * 100)
                : 100,
            exceptionProcessingRate: allExceptions.length > 0
                ? Math.round((approvedExceptions / allExceptions.length) * 100)
                : 100,
            overallHealth: 'GOOD',
        };
        if (syncHealth.attendanceSyncRate < 50 || syncHealth.exceptionProcessingRate < 50) {
            syncHealth.overallHealth = 'CRITICAL';
        }
        else if (syncHealth.attendanceSyncRate < 80 || syncHealth.exceptionProcessingRate < 80) {
            syncHealth.overallHealth = 'WARNING';
        }
        await this.logTimeManagementChange('CROSS_MODULE_SYNC_STATUS_CHECKED', {
            startDate,
            endDate,
            attendanceCount: allAttendance.length,
            exceptionCount: allExceptions.length,
            overallHealth: syncHealth.overallHealth,
        }, currentUserId);
        return {
            period: { startDate, endDate },
            modules: {
                timeManagement: {
                    status: 'ACTIVE',
                    lastSync: recentSyncs[0]?.timestamp || null,
                },
                payroll: {
                    status: 'READY_TO_SYNC',
                    pendingRecords: pendingCount,
                    finalizedRecords: finalizedCount,
                },
                leaves: {
                    status: 'INTEGRATION_AVAILABLE',
                    note: 'Time Management provides attendance context for leave validation',
                },
                benefits: {
                    status: 'INTEGRATION_AVAILABLE',
                    note: 'Overtime and attendance data available for benefits calculations',
                },
            },
            attendance: {
                total: allAttendance.length,
                finalized: finalizedCount,
                pending: pendingCount,
                syncRate: `${syncHealth.attendanceSyncRate}%`,
            },
            exceptions: {
                total: allExceptions.length,
                approved: approvedExceptions,
                pending: pendingExceptions,
                processingRate: `${syncHealth.exceptionProcessingRate}%`,
            },
            health: syncHealth,
            recentSyncOperations: recentSyncs.map(s => ({
                operation: s.entity,
                timestamp: s.timestamp,
                performedBy: s.actorId,
            })),
            generatedAt: new Date(),
        };
    }
    async syncWithLeavesModule(params, currentUserId) {
        const { employeeId, startDate, endDate } = params;
        const startDateUTC = this.convertDateToUTCStart(startDate);
        const endDateUTC = this.convertDateToUTCEnd(endDate);
        const query = {
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        };
        if (employeeId) {
            query.employeeId = employeeId;
        }
        const attendanceRecords = await this.attendanceRecordModel
            .find(query)
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .exec();
        const attendanceDates = new Set(attendanceRecords.map((r) => new Date(r.createdAt || r.date).toISOString().split('T')[0]));
        const uniqueEmployees = [...new Set(attendanceRecords.map((r) => r.employeeId?._id?.toString() || r.employeeId?.toString()))];
        const leaveContextData = {
            attendanceByEmployee: {},
        };
        attendanceRecords.forEach((record) => {
            const empId = record.employeeId?._id?.toString() || record.employeeId?.toString() || 'unknown';
            if (!leaveContextData.attendanceByEmployee[empId]) {
                leaveContextData.attendanceByEmployee[empId] = {
                    employeeId: empId,
                    employeeName: record.employeeId
                        ? `${record.employeeId.firstName || ''} ${record.employeeId.lastName || ''}`.trim()
                        : 'Unknown',
                    daysPresent: 0,
                    totalWorkHours: 0,
                    attendanceDates: [],
                };
            }
            leaveContextData.attendanceByEmployee[empId].daysPresent++;
            leaveContextData.attendanceByEmployee[empId].totalWorkHours +=
                Math.round((record.totalWorkMinutes || 0) / 60 * 100) / 100;
            leaveContextData.attendanceByEmployee[empId].attendanceDates.push(new Date(record.createdAt || record.date).toISOString().split('T')[0]);
        });
        await this.logTimeManagementChange('LEAVES_MODULE_SYNC', {
            employeeId,
            startDate,
            endDate,
            recordCount: attendanceRecords.length,
            employeeCount: uniqueEmployees.length,
        }, currentUserId);
        return {
            syncType: 'TIME_MANAGEMENT_TO_LEAVES',
            period: { startDate, endDate },
            summary: {
                totalAttendanceRecords: attendanceRecords.length,
                uniqueEmployees: uniqueEmployees.length,
                attendanceDaysRecorded: attendanceDates.size,
            },
            leaveContext: {
                description: 'Attendance data for leave validation and deduction calculations',
                employeeData: Object.values(leaveContextData.attendanceByEmployee),
            },
            integrationNotes: [
                'Use attendanceDates to validate against requested leave dates',
                'Absent days (not in attendanceDates) may indicate leave or unauthorized absence',
                'totalWorkHours can be used for partial day leave calculations',
            ],
            syncedAt: new Date(),
            syncedBy: currentUserId,
        };
    }
    async syncWithBenefitsModule(params, currentUserId) {
        const { employeeId, startDate, endDate } = params;
        const startDateUTC = this.convertDateToUTCStart(startDate);
        const endDateUTC = this.convertDateToUTCEnd(endDate);
        const attendanceQuery = {
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        };
        if (employeeId) {
            attendanceQuery.employeeId = employeeId;
        }
        const attendanceRecords = await this.attendanceRecordModel
            .find(attendanceQuery)
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .exec();
        const overtimeQuery = {
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
            status: 'APPROVED',
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        };
        if (employeeId) {
            overtimeQuery.employeeId = employeeId;
        }
        const overtimeRecords = await this.timeExceptionModel
            .find(overtimeQuery)
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .populate('attendanceRecordId')
            .exec();
        const benefitsData = {};
        attendanceRecords.forEach((record) => {
            const empId = record.employeeId?._id?.toString() || record.employeeId?.toString() || 'unknown';
            if (!benefitsData[empId]) {
                benefitsData[empId] = {
                    employeeId: empId,
                    employeeName: record.employeeId
                        ? `${record.employeeId.firstName || ''} ${record.employeeId.lastName || ''}`.trim()
                        : 'Unknown',
                    totalWorkMinutes: 0,
                    totalWorkHours: 0,
                    daysWorked: 0,
                    overtimeMinutes: 0,
                    overtimeHours: 0,
                };
            }
            benefitsData[empId].totalWorkMinutes += record.totalWorkMinutes || 0;
            benefitsData[empId].daysWorked++;
        });
        overtimeRecords.forEach((ot) => {
            const empId = ot.employeeId?._id?.toString() || ot.employeeId?.toString();
            if (empId && benefitsData[empId]) {
                const attendance = ot.attendanceRecordId;
                const overtimeMinutes = attendance?.totalWorkMinutes
                    ? Math.max(0, attendance.totalWorkMinutes - 480)
                    : 0;
                benefitsData[empId].overtimeMinutes += overtimeMinutes;
            }
        });
        Object.values(benefitsData).forEach((data) => {
            data.totalWorkHours = Math.round((data.totalWorkMinutes / 60) * 100) / 100;
            data.overtimeHours = Math.round((data.overtimeMinutes / 60) * 100) / 100;
        });
        await this.logTimeManagementChange('BENEFITS_MODULE_SYNC', {
            employeeId,
            startDate,
            endDate,
            attendanceCount: attendanceRecords.length,
            overtimeCount: overtimeRecords.length,
        }, currentUserId);
        return {
            syncType: 'TIME_MANAGEMENT_TO_BENEFITS',
            period: { startDate, endDate },
            summary: {
                totalAttendanceRecords: attendanceRecords.length,
                approvedOvertimeRecords: overtimeRecords.length,
                uniqueEmployees: Object.keys(benefitsData).length,
            },
            benefitsData: {
                description: 'Work hours and overtime data for benefits calculations',
                employees: Object.values(benefitsData),
            },
            calculations: {
                totalWorkHoursAllEmployees: Math.round(Object.values(benefitsData).reduce((sum, e) => sum + e.totalWorkMinutes, 0) / 60 * 100) / 100,
                totalOvertimeHoursAllEmployees: Math.round(Object.values(benefitsData).reduce((sum, e) => sum + e.overtimeMinutes, 0) / 60 * 100) / 100,
            },
            integrationNotes: [
                'Use totalWorkHours for attendance-based benefits eligibility',
                'Use overtimeHours for overtime compensation calculations',
                'daysWorked can be used for per-diem benefit calculations',
            ],
            syncedAt: new Date(),
            syncedBy: currentUserId,
        };
    }
    async runFullCrossModuleSync(params, currentUserId) {
        const { syncDate, modules } = params;
        const syncResults = {};
        const startOfDay = this.convertDateToUTCStart(syncDate);
        const endOfDay = this.convertDateToUTCEnd(syncDate);
        if (modules.includes('payroll')) {
            try {
                const payrollSync = await this.runDailyPayrollSync(syncDate, currentUserId);
                syncResults.payroll = {
                    status: 'SUCCESS',
                    data: payrollSync,
                };
            }
            catch (error) {
                syncResults.payroll = {
                    status: 'FAILED',
                    error: error.message,
                };
            }
        }
        if (modules.includes('leaves')) {
            try {
                const leavesSync = await this.syncWithLeavesModule({ startDate: startOfDay, endDate: endOfDay }, currentUserId);
                syncResults.leaves = {
                    status: 'SUCCESS',
                    data: leavesSync,
                };
            }
            catch (error) {
                syncResults.leaves = {
                    status: 'FAILED',
                    error: error.message,
                };
            }
        }
        if (modules.includes('benefits')) {
            try {
                const benefitsSync = await this.syncWithBenefitsModule({ startDate: startOfDay, endDate: endOfDay }, currentUserId);
                syncResults.benefits = {
                    status: 'SUCCESS',
                    data: benefitsSync,
                };
            }
            catch (error) {
                syncResults.benefits = {
                    status: 'FAILED',
                    error: error.message,
                };
            }
        }
        const failedModules = Object.entries(syncResults)
            .filter(([, result]) => result.status === 'FAILED')
            .map(([module]) => module);
        const overallStatus = failedModules.length === 0
            ? 'SUCCESS'
            : failedModules.length === modules.length
                ? 'FAILED'
                : 'PARTIAL';
        await this.logTimeManagementChange('FULL_CROSS_MODULE_SYNC', {
            syncDate,
            modules,
            overallStatus,
            failedModules,
        }, currentUserId);
        return {
            syncDate,
            modulesRequested: modules,
            overallStatus,
            results: syncResults,
            failedModules: failedModules.length > 0 ? failedModules : undefined,
            executedAt: new Date(),
            executedBy: currentUserId,
        };
    }
    async checkCrossModuleDataConsistency(params, currentUserId) {
        const { startDate, endDate, employeeId } = params;
        const startDateUTC = this.convertDateToUTCStart(startDate);
        const endDateUTC = this.convertDateToUTCEnd(endDate);
        const query = {
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        };
        if (employeeId) {
            query.employeeId = employeeId;
        }
        const attendanceRecords = await this.attendanceRecordModel.find(query).exec();
        const timeExceptions = await this.timeExceptionModel.find(query).exec();
        const inconsistencies = [];
        const noClockInPresent = attendanceRecords.filter((r) => !r.clockIn && r.totalWorkMinutes > 0);
        if (noClockInPresent.length > 0) {
            inconsistencies.push({
                type: 'NO_CLOCKIN_BUT_HAS_WORK_MINUTES',
                severity: 'WARNING',
                count: noClockInPresent.length,
                description: 'Records with work minutes but no clock-in time',
                recordIds: noClockInPresent.map((r) => r._id),
            });
        }
        const overtimeExceptions = timeExceptions.filter(e => e.type === enums_1.TimeExceptionType.OVERTIME_REQUEST);
        const orphanOvertime = overtimeExceptions.filter((e) => !e.attendanceRecordId);
        if (orphanOvertime.length > 0) {
            inconsistencies.push({
                type: 'ORPHAN_OVERTIME_EXCEPTIONS',
                severity: 'ERROR',
                count: orphanOvertime.length,
                description: 'Overtime exceptions not linked to attendance records',
                exceptionIds: orphanOvertime.map((e) => e._id),
            });
        }
        const finalizedRecordIds = attendanceRecords
            .filter((r) => r.finalisedForPayroll)
            .map((r) => r._id.toString());
        const exceptionsForFinalized = timeExceptions.filter((e) => finalizedRecordIds.includes(e.attendanceRecordId?.toString()) &&
            (e.status === enums_1.TimeExceptionStatus.OPEN || e.status === enums_1.TimeExceptionStatus.PENDING));
        if (exceptionsForFinalized.length > 0) {
            inconsistencies.push({
                type: 'FINALIZED_WITH_PENDING_EXCEPTIONS',
                severity: 'ERROR',
                count: exceptionsForFinalized.length,
                description: 'Finalized attendance records have pending exceptions',
                exceptionIds: exceptionsForFinalized.map((e) => e._id),
            });
        }
        const employeeDateMap = {};
        attendanceRecords.forEach((r) => {
            const key = `${r.employeeId?.toString()}_${new Date(r.createdAt || r.date).toDateString()}`;
            if (!employeeDateMap[key])
                employeeDateMap[key] = [];
            employeeDateMap[key].push(r);
        });
        const duplicates = Object.entries(employeeDateMap)
            .filter(([, records]) => records.length > 1);
        if (duplicates.length > 0) {
            inconsistencies.push({
                type: 'DUPLICATE_ATTENDANCE_RECORDS',
                severity: 'WARNING',
                count: duplicates.length,
                description: 'Multiple attendance records for same employee on same date',
                details: duplicates.map(([key, records]) => ({
                    employeeDate: key,
                    recordCount: records.length,
                    recordIds: records.map((r) => r._id),
                })),
            });
        }
        const isConsistent = inconsistencies.filter(i => i.severity === 'ERROR').length === 0;
        await this.logTimeManagementChange('CROSS_MODULE_CONSISTENCY_CHECK', {
            startDate,
            endDate,
            employeeId,
            isConsistent,
            inconsistencyCount: inconsistencies.length,
        }, currentUserId);
        return {
            period: { startDate, endDate },
            employeeFilter: employeeId || 'ALL',
            isConsistent,
            summary: {
                attendanceRecordsChecked: attendanceRecords.length,
                exceptionsChecked: timeExceptions.length,
                errorCount: inconsistencies.filter(i => i.severity === 'ERROR').length,
                warningCount: inconsistencies.filter(i => i.severity === 'WARNING').length,
            },
            inconsistencies,
            recommendations: isConsistent
                ? ['Data is consistent across modules']
                : this.getConsistencyRecommendations(inconsistencies),
            checkedAt: new Date(),
            checkedBy: currentUserId,
        };
    }
    async getDataForDownstreamModules(params, currentUserId) {
        const { startDate, endDate, departmentId, modules } = params;
        const startDateUTC = this.convertDateToUTCStart(startDate);
        const endDateUTC = this.convertDateToUTCEnd(endDate);
        const attendanceQuery = {
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        };
        const attendanceRecords = await this.attendanceRecordModel
            .find(attendanceQuery)
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .exec();
        const filteredAttendance = departmentId
            ? attendanceRecords.filter((r) => r.employeeId?.departmentId?.toString() === departmentId)
            : attendanceRecords;
        const exceptions = await this.timeExceptionModel
            .find({
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        })
            .populate('employeeId', 'firstName lastName employeeNumber departmentId')
            .exec();
        const filteredExceptions = departmentId
            ? exceptions.filter((e) => e.employeeId?.departmentId?.toString() === departmentId)
            : exceptions;
        const dataPackages = {};
        if (modules.includes('payroll')) {
            dataPackages.payroll = this.buildPayrollDataPackage(filteredAttendance, filteredExceptions);
        }
        if (modules.includes('leaves')) {
            dataPackages.leaves = this.buildLeavesDataPackage(filteredAttendance);
        }
        if (modules.includes('benefits')) {
            dataPackages.benefits = this.buildBenefitsDataPackage(filteredAttendance, filteredExceptions);
        }
        await this.logTimeManagementChange('DOWNSTREAM_DATA_PACKAGE_GENERATED', {
            startDate,
            endDate,
            departmentId,
            modules,
            attendanceCount: filteredAttendance.length,
            exceptionCount: filteredExceptions.length,
        }, currentUserId);
        return {
            period: { startDate, endDate },
            departmentFilter: departmentId || 'ALL',
            modulesIncluded: modules,
            baseDataSummary: {
                attendanceRecords: filteredAttendance.length,
                exceptions: filteredExceptions.length,
                uniqueEmployees: [...new Set(filteredAttendance.map((r) => r.employeeId?._id?.toString()))].length,
            },
            dataPackages,
            generatedAt: new Date(),
            generatedBy: currentUserId,
        };
    }
    buildPayrollDataPackage(attendance, exceptions) {
        const employeeData = {};
        attendance.forEach((record) => {
            const empId = record.employeeId?._id?.toString() || 'unknown';
            if (!employeeData[empId]) {
                employeeData[empId] = {
                    employeeId: empId,
                    employeeNumber: record.employeeId?.employeeNumber || 'N/A',
                    employeeName: record.employeeId
                        ? `${record.employeeId.firstName || ''} ${record.employeeId.lastName || ''}`.trim()
                        : 'Unknown',
                    totalWorkMinutes: 0,
                    regularMinutes: 0,
                    overtimeMinutes: 0,
                    daysWorked: 0,
                    lateDays: 0,
                    missedPunches: 0,
                };
            }
            const workMinutes = record.totalWorkMinutes || 0;
            employeeData[empId].totalWorkMinutes += workMinutes;
            employeeData[empId].regularMinutes += Math.min(workMinutes, 480);
            employeeData[empId].overtimeMinutes += Math.max(0, workMinutes - 480);
            employeeData[empId].daysWorked++;
            if (record.isLate)
                employeeData[empId].lateDays++;
            if (record.hasMissedPunch)
                employeeData[empId].missedPunches++;
        });
        Object.values(employeeData).forEach((data) => {
            data.totalWorkHours = Math.round((data.totalWorkMinutes / 60) * 100) / 100;
            data.regularHours = Math.round((data.regularMinutes / 60) * 100) / 100;
            data.overtimeHours = Math.round((data.overtimeMinutes / 60) * 100) / 100;
        });
        return {
            description: 'Payroll-ready attendance and overtime data',
            employees: Object.values(employeeData),
            totals: {
                totalEmployees: Object.keys(employeeData).length,
                totalWorkHours: Math.round(Object.values(employeeData).reduce((sum, e) => sum + e.totalWorkMinutes, 0) / 60 * 100) / 100,
                totalOvertimeHours: Math.round(Object.values(employeeData).reduce((sum, e) => sum + e.overtimeMinutes, 0) / 60 * 100) / 100,
            },
        };
    }
    buildLeavesDataPackage(attendance) {
        const employeeData = {};
        attendance.forEach((record) => {
            const empId = record.employeeId?._id?.toString() || 'unknown';
            if (!employeeData[empId]) {
                employeeData[empId] = {
                    employeeId: empId,
                    employeeName: record.employeeId
                        ? `${record.employeeId.firstName || ''} ${record.employeeId.lastName || ''}`.trim()
                        : 'Unknown',
                    presentDates: [],
                    daysPresent: 0,
                };
            }
            const dateStr = new Date(record.createdAt || record.date).toISOString().split('T')[0];
            if (!employeeData[empId].presentDates.includes(dateStr)) {
                employeeData[empId].presentDates.push(dateStr);
                employeeData[empId].daysPresent++;
            }
        });
        return {
            description: 'Attendance data for leave validation',
            employees: Object.values(employeeData),
            usage: 'Cross-reference presentDates against leave requests to validate absences',
        };
    }
    buildBenefitsDataPackage(attendance, exceptions) {
        const employeeData = {};
        attendance.forEach((record) => {
            const empId = record.employeeId?._id?.toString() || 'unknown';
            if (!employeeData[empId]) {
                employeeData[empId] = {
                    employeeId: empId,
                    employeeName: record.employeeId
                        ? `${record.employeeId.firstName || ''} ${record.employeeId.lastName || ''}`.trim()
                        : 'Unknown',
                    totalWorkHours: 0,
                    overtimeHours: 0,
                    daysWorked: 0,
                    perfectAttendanceDays: 0,
                };
            }
            const workMinutes = record.totalWorkMinutes || 0;
            employeeData[empId].totalWorkHours += Math.round((workMinutes / 60) * 100) / 100;
            employeeData[empId].overtimeHours += Math.round((Math.max(0, workMinutes - 480) / 60) * 100) / 100;
            employeeData[empId].daysWorked++;
            if (!record.isLate && !record.earlyLeave && !record.hasMissedPunch) {
                employeeData[empId].perfectAttendanceDays++;
            }
        });
        return {
            description: 'Attendance and overtime data for benefits calculations',
            employees: Object.values(employeeData),
            eligibilityCriteria: {
                overtimeBonusEligible: Object.values(employeeData).filter((e) => e.overtimeHours > 0),
                perfectAttendanceBonus: Object.values(employeeData).filter((e) => e.daysWorked > 0 && e.perfectAttendanceDays === e.daysWorked),
            },
        };
    }
    getConsistencyRecommendations(inconsistencies) {
        const recommendations = [];
        inconsistencies.forEach(inc => {
            switch (inc.type) {
                case 'NO_CLOCKIN_BUT_HAS_WORK_MINUTES':
                    recommendations.push('Review attendance records with work minutes but no clock-in time');
                    break;
                case 'ORPHAN_OVERTIME_EXCEPTIONS':
                    recommendations.push('Link overtime exceptions to corresponding attendance records');
                    break;
                case 'FINALIZED_WITH_PENDING_EXCEPTIONS':
                    recommendations.push('Resolve pending exceptions before keeping records finalized, or un-finalize records');
                    break;
                case 'DUPLICATE_ATTENDANCE_RECORDS':
                    recommendations.push('Merge or remove duplicate attendance records for same employee/date');
                    break;
            }
        });
        return recommendations;
    }
    async logTimeManagementChange(entity, changeSet, actorId) {
        this.auditLogs.push({
            entity,
            changeSet,
            actorId,
            timestamp: new Date(),
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_log_schema_1.NotificationLog.name)),
    __param(1, (0, mongoose_1.InjectModel)(attendance_record_schema_1.AttendanceRecord.name)),
    __param(2, (0, mongoose_1.InjectModel)(time_exception_schema_1.TimeException.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], NotificationService);
//# sourceMappingURL=notification.service.js.map