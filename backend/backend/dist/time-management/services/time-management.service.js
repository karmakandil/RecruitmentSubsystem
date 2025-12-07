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
exports.TimeManagementService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const attendance_record_schema_1 = require("../models/attendance-record.schema");
const attendance_correction_request_schema_1 = require("../models/attendance-correction-request.schema");
const time_exception_schema_1 = require("../models/time-exception.schema");
const shift_assignment_schema_1 = require("../models/shift-assignment.schema");
const enums_1 = require("../models/enums");
let TimeManagementService = class TimeManagementService {
    constructor(attendanceRecordModel, correctionRequestModel, timeExceptionModel, shiftAssignmentModel) {
        this.attendanceRecordModel = attendanceRecordModel;
        this.correctionRequestModel = correctionRequestModel;
        this.timeExceptionModel = timeExceptionModel;
        this.shiftAssignmentModel = shiftAssignmentModel;
        this.auditLogs = [];
    }
    async clockInWithID(employeeId, currentUserId) {
        const now = new Date();
        const attendanceRecord = new this.attendanceRecordModel({
            employeeId,
            punches: [
                {
                    type: enums_1.PunchType.IN,
                    time: now,
                },
            ],
            totalWorkMinutes: 0,
            hasMissedPunch: false,
            finalisedForPayroll: false,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        const saved = await attendanceRecord.save();
        await this.logAttendanceChange(employeeId, 'CLOCK_IN', {
            attendanceRecordId: saved._id,
            source: 'ID_CARD',
            timestamp: now.toISOString(),
        }, currentUserId);
        return saved;
    }
    async clockOutWithID(employeeId, currentUserId) {
        const now = new Date();
        const attendanceRecords = await this.attendanceRecordModel
            .find({
            employeeId,
        })
            .sort({ createdAt: -1 })
            .exec();
        if (!attendanceRecords || attendanceRecords.length === 0) {
            throw new Error('No attendance record found. Please clock in first.');
        }
        let attendanceRecord = null;
        for (const record of attendanceRecords) {
            if (record.punches && record.punches.length > 0) {
                const lastPunch = record.punches[record.punches.length - 1];
                if (lastPunch.type === enums_1.PunchType.IN) {
                    attendanceRecord = record;
                    break;
                }
            }
        }
        if (!attendanceRecord) {
            throw new Error('No active clock-in found. Please clock in first.');
        }
        attendanceRecord.punches.push({
            type: enums_1.PunchType.OUT,
            time: now,
        });
        let totalMinutes = 0;
        for (let i = 0; i < attendanceRecord.punches.length; i += 2) {
            if (i + 1 < attendanceRecord.punches.length) {
                const inTime = attendanceRecord.punches[i].time.getTime();
                const outTime = attendanceRecord.punches[i + 1].time.getTime();
                totalMinutes += (outTime - inTime) / 60000;
            }
        }
        attendanceRecord.totalWorkMinutes = totalMinutes;
        attendanceRecord.updatedBy = currentUserId;
        const saved = await attendanceRecord.save();
        await this.logAttendanceChange(employeeId, 'CLOCK_OUT', {
            attendanceRecordId: saved._id,
            source: 'ID_CARD',
            totalWorkMinutes: totalMinutes,
            timestamp: now.toISOString(),
        }, currentUserId);
        return saved;
    }
    async clockInWithMetadata(employeeId, metadata, currentUserId) {
        const now = new Date();
        const attendanceRecord = new this.attendanceRecordModel({
            employeeId,
            punches: [
                {
                    type: enums_1.PunchType.IN,
                    time: now,
                },
            ],
            totalWorkMinutes: 0,
            hasMissedPunch: false,
            finalisedForPayroll: false,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        const saved = await attendanceRecord.save();
        await this.logAttendanceChange(employeeId, 'CLOCK_IN_WITH_METADATA', {
            attendanceRecordId: saved._id,
            source: metadata.source,
            deviceId: metadata.deviceId,
            terminalId: metadata.terminalId,
            location: metadata.location,
            gpsCoordinates: metadata.gpsCoordinates,
            ipAddress: metadata.ipAddress,
            timestamp: now.toISOString(),
        }, currentUserId);
        return {
            attendanceRecord: saved,
            metadata: {
                source: metadata.source,
                deviceId: metadata.deviceId,
                terminalId: metadata.terminalId,
                location: metadata.location,
                capturedAt: now,
            },
        };
    }
    async clockOutWithMetadata(employeeId, metadata, currentUserId) {
        const now = new Date();
        const attendanceRecords = await this.attendanceRecordModel
            .find({ employeeId })
            .sort({ createdAt: -1 })
            .exec();
        if (!attendanceRecords || attendanceRecords.length === 0) {
            throw new Error('No attendance record found. Please clock in first.');
        }
        let attendanceRecord = null;
        for (const record of attendanceRecords) {
            if (record.punches && record.punches.length > 0) {
                const lastPunch = record.punches[record.punches.length - 1];
                if (lastPunch.type === enums_1.PunchType.IN) {
                    attendanceRecord = record;
                    break;
                }
            }
        }
        if (!attendanceRecord) {
            throw new Error('No active clock-in found. Please clock in first.');
        }
        attendanceRecord.punches.push({
            type: enums_1.PunchType.OUT,
            time: now,
        });
        let totalMinutes = 0;
        for (let i = 0; i < attendanceRecord.punches.length; i += 2) {
            if (i + 1 < attendanceRecord.punches.length) {
                const inTime = attendanceRecord.punches[i].time.getTime();
                const outTime = attendanceRecord.punches[i + 1].time.getTime();
                totalMinutes += (outTime - inTime) / 60000;
            }
        }
        attendanceRecord.totalWorkMinutes = totalMinutes;
        attendanceRecord.updatedBy = currentUserId;
        const saved = await attendanceRecord.save();
        await this.logAttendanceChange(employeeId, 'CLOCK_OUT_WITH_METADATA', {
            attendanceRecordId: saved._id,
            source: metadata.source,
            deviceId: metadata.deviceId,
            terminalId: metadata.terminalId,
            location: metadata.location,
            gpsCoordinates: metadata.gpsCoordinates,
            ipAddress: metadata.ipAddress,
            totalWorkMinutes: totalMinutes,
            timestamp: now.toISOString(),
        }, currentUserId);
        return {
            attendanceRecord: saved,
            metadata: {
                source: metadata.source,
                deviceId: metadata.deviceId,
                terminalId: metadata.terminalId,
                location: metadata.location,
                capturedAt: now,
            },
            totalWorkMinutes: totalMinutes,
            totalWorkHours: Math.round((totalMinutes / 60) * 100) / 100,
        };
    }
    async validateClockInAgainstShift(employeeId, currentUserId) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const shiftAssignments = await this.shiftAssignmentModel
            .find({
            employeeId,
            status: 'APPROVED',
            startDate: { $lte: today },
            $or: [
                { endDate: { $gte: today } },
                { endDate: null },
            ],
        })
            .populate('shiftId')
            .exec();
        if (shiftAssignments.length === 0) {
            return {
                isValid: false,
                message: 'No active shift assignment found for today',
                allowClockIn: true,
                warning: 'Employee has no assigned shift for today',
            };
        }
        const assignment = shiftAssignments[0];
        const shift = assignment.shiftId;
        if (!shift) {
            return {
                isValid: false,
                message: 'Shift details not found',
                allowClockIn: true,
                warning: 'Shift information is missing',
            };
        }
        const shiftStartMinutes = this.timeStringToMinutes(shift.startTime);
        const shiftEndMinutes = this.timeStringToMinutes(shift.endTime);
        const currentMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
        const graceIn = shift.graceInMinutes || 0;
        const graceOut = shift.graceOutMinutes || 0;
        const isWithinStartWindow = currentMinutes >= (shiftStartMinutes - 30) &&
            currentMinutes <= (shiftStartMinutes + graceIn);
        const isLate = currentMinutes > (shiftStartMinutes + graceIn);
        return {
            isValid: true,
            shiftName: shift.name,
            shiftStart: shift.startTime,
            shiftEnd: shift.endTime,
            currentTime: `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`,
            isWithinStartWindow,
            isLate,
            lateByMinutes: isLate ? currentMinutes - shiftStartMinutes - graceIn : 0,
            graceInMinutes: graceIn,
            graceOutMinutes: graceOut,
            allowClockIn: true,
            message: isLate
                ? `Late clock-in. You are ${currentMinutes - shiftStartMinutes - graceIn} minutes late.`
                : 'Clock-in validated successfully',
        };
    }
    async getEmployeeAttendanceStatus(employeeId, currentUserId) {
        const now = new Date();
        const todayStart = this.convertDateToUTCStart(now);
        const todayEnd = this.convertDateToUTCEnd(now);
        const todayRecords = await this.attendanceRecordModel
            .find({
            employeeId,
            createdAt: { $gte: todayStart, $lte: todayEnd },
        })
            .sort({ createdAt: -1 })
            .exec();
        if (todayRecords.length === 0) {
            return {
                status: 'NOT_CLOCKED_IN',
                message: 'No attendance record for today',
                records: [],
            };
        }
        const latestRecord = todayRecords[0];
        const lastPunch = latestRecord.punches[latestRecord.punches.length - 1];
        const isClockedIn = lastPunch?.type === enums_1.PunchType.IN;
        let totalMinutesToday = 0;
        for (const record of todayRecords) {
            totalMinutesToday += record.totalWorkMinutes || 0;
        }
        if (isClockedIn && lastPunch) {
            const minutesSinceLastPunch = (now.getTime() - lastPunch.time.getTime()) / 60000;
            totalMinutesToday += minutesSinceLastPunch;
        }
        return {
            status: isClockedIn ? 'CLOCKED_IN' : 'CLOCKED_OUT',
            lastPunchTime: lastPunch?.time,
            lastPunchType: lastPunch?.type,
            totalMinutesToday: Math.round(totalMinutesToday),
            totalHoursToday: Math.round((totalMinutesToday / 60) * 100) / 100,
            recordCount: todayRecords.length,
            punchCount: todayRecords.reduce((sum, r) => sum + r.punches.length, 0),
            records: todayRecords.map(r => ({
                id: r._id,
                punches: r.punches,
                totalWorkMinutes: r.totalWorkMinutes,
                hasMissedPunch: r.hasMissedPunch,
            })),
        };
    }
    async createAttendanceRecord(createAttendanceRecordDto, currentUserId) {
        const newAttendanceRecord = new this.attendanceRecordModel({
            ...createAttendanceRecordDto,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newAttendanceRecord.save();
    }
    async updateAttendanceRecord(id, updateAttendanceRecordDto, currentUserId) {
        return this.attendanceRecordModel.findByIdAndUpdate(id, {
            ...updateAttendanceRecordDto,
            updatedBy: currentUserId,
        }, { new: true });
    }
    async submitAttendanceCorrectionRequest(submitCorrectionRequestDto, currentUserId) {
        const newCorrectionRequest = new this.correctionRequestModel({
            employeeId: submitCorrectionRequestDto.employeeId,
            attendanceRecord: submitCorrectionRequestDto.attendanceRecord,
            reason: submitCorrectionRequestDto.reason,
            status: submitCorrectionRequestDto.status || enums_1.CorrectionRequestStatus.SUBMITTED,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newCorrectionRequest.save();
    }
    async getAllCorrectionRequests(getAllCorrectionsDto, currentUserId) {
        const { status, employeeId } = getAllCorrectionsDto;
        const query = {};
        if (status) {
            query.status = status;
        }
        if (employeeId) {
            query.employeeId = employeeId;
        }
        return this.correctionRequestModel
            .find(query)
            .populate('attendanceRecord')
            .populate('employeeId')
            .exec();
    }
    async approveCorrectionRequest(approveCorrectionRequestDto, currentUserId) {
        const { correctionRequestId, reason } = approveCorrectionRequestDto;
        const correctionRequest = await this.correctionRequestModel
            .findByIdAndUpdate(correctionRequestId, {
            status: enums_1.CorrectionRequestStatus.APPROVED,
            ...(reason && { reason }),
            updatedBy: currentUserId,
        }, { new: true })
            .exec();
        if (!correctionRequest) {
            throw new Error('Correction request not found');
        }
        return correctionRequest;
    }
    async rejectCorrectionRequest(rejectCorrectionRequestDto, currentUserId) {
        const { correctionRequestId, reason } = rejectCorrectionRequestDto;
        const correctionRequest = await this.correctionRequestModel
            .findByIdAndUpdate(correctionRequestId, {
            status: enums_1.CorrectionRequestStatus.REJECTED,
            ...(reason && { reason }),
            updatedBy: currentUserId,
        }, { new: true })
            .exec();
        if (!correctionRequest) {
            throw new Error('Correction request not found');
        }
        return correctionRequest;
    }
    async getCorrectionRequestsByEmployee(params, currentUserId) {
        const { employeeId, status, startDate, endDate } = params;
        const query = { employeeId };
        if (status) {
            query.status = status;
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = startDate;
            if (endDate)
                query.createdAt.$lte = endDate;
        }
        const requests = await this.correctionRequestModel
            .find(query)
            .populate('attendanceRecord')
            .sort({ createdAt: -1 })
            .exec();
        const summary = {
            total: requests.length,
            submitted: requests.filter(r => r.status === enums_1.CorrectionRequestStatus.SUBMITTED).length,
            inReview: requests.filter(r => r.status === enums_1.CorrectionRequestStatus.IN_REVIEW).length,
            approved: requests.filter(r => r.status === enums_1.CorrectionRequestStatus.APPROVED).length,
            rejected: requests.filter(r => r.status === enums_1.CorrectionRequestStatus.REJECTED).length,
        };
        return {
            employeeId,
            summary,
            requests: requests.map(req => ({
                id: req._id,
                status: req.status,
                reason: req.reason,
                attendanceRecord: req.attendanceRecord,
                createdAt: req.createdAt,
            })),
        };
    }
    async getCorrectionRequestById(requestId, currentUserId) {
        const request = await this.correctionRequestModel
            .findById(requestId)
            .populate('attendanceRecord')
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .exec();
        if (!request) {
            return {
                success: false,
                message: 'Correction request not found',
            };
        }
        return {
            success: true,
            request: {
                id: request._id,
                employeeId: request.employeeId,
                status: request.status,
                reason: request.reason,
                attendanceRecord: request.attendanceRecord,
                createdAt: request.createdAt,
                updatedAt: request.updatedAt,
            },
        };
    }
    async escalateCorrectionRequest(params, currentUserId) {
        const { requestId, escalateTo, reason } = params;
        const request = await this.correctionRequestModel.findById(requestId).exec();
        if (!request) {
            return {
                success: false,
                message: 'Correction request not found',
            };
        }
        request.status = enums_1.CorrectionRequestStatus.ESCALATED;
        if (reason) {
            request.reason = `${request.reason || ''}\n\n[ESCALATED - ${new Date().toISOString()}]\nEscalated to: ${escalateTo}\nReason: ${reason}`;
        }
        request.updatedBy = currentUserId;
        await request.save();
        await this.logTimeManagementChange('CORRECTION_REQUEST_ESCALATED', {
            requestId,
            employeeId: request.employeeId,
            escalateTo,
            reason,
        }, currentUserId);
        return {
            success: true,
            message: `Correction request escalated to ${escalateTo}`,
            request: {
                id: requestId,
                status: request.status,
                escalatedTo: escalateTo,
                escalatedAt: new Date(),
            },
        };
    }
    async cancelCorrectionRequest(params, currentUserId) {
        const { requestId, reason } = params;
        const request = await this.correctionRequestModel.findById(requestId).exec();
        if (!request) {
            return {
                success: false,
                message: 'Correction request not found',
            };
        }
        if (request.status !== enums_1.CorrectionRequestStatus.SUBMITTED &&
            request.status !== enums_1.CorrectionRequestStatus.IN_REVIEW) {
            return {
                success: false,
                message: `Cannot cancel request with status: ${request.status}`,
            };
        }
        const previousStatus = request.status;
        request.status = enums_1.CorrectionRequestStatus.REJECTED;
        request.reason = `${request.reason || ''}\n\n[CANCELLED BY EMPLOYEE - ${new Date().toISOString()}]\nReason: ${reason || 'No reason provided'}`;
        request.updatedBy = currentUserId;
        await request.save();
        return {
            success: true,
            message: 'Correction request cancelled',
            request: {
                id: requestId,
                previousStatus,
                newStatus: 'CANCELLED',
                cancelledAt: new Date(),
            },
        };
    }
    async getPendingCorrectionRequestsForManager(params, currentUserId) {
        const { limit = 50 } = params;
        const pendingRequests = await this.correctionRequestModel
            .find({
            status: { $in: [enums_1.CorrectionRequestStatus.SUBMITTED, enums_1.CorrectionRequestStatus.IN_REVIEW, enums_1.CorrectionRequestStatus.ESCALATED] },
        })
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .populate('attendanceRecord')
            .sort({ createdAt: 1 })
            .limit(limit)
            .exec();
        const byStatus = {
            submitted: pendingRequests.filter(r => r.status === enums_1.CorrectionRequestStatus.SUBMITTED),
            inReview: pendingRequests.filter(r => r.status === enums_1.CorrectionRequestStatus.IN_REVIEW),
            escalated: pendingRequests.filter(r => r.status === enums_1.CorrectionRequestStatus.ESCALATED),
        };
        return {
            summary: {
                total: pendingRequests.length,
                submitted: byStatus.submitted.length,
                inReview: byStatus.inReview.length,
                escalated: byStatus.escalated.length,
            },
            requests: pendingRequests.map(req => ({
                id: req._id,
                employee: req.employeeId,
                status: req.status,
                reason: req.reason,
                attendanceRecord: req.attendanceRecord,
                createdAt: req.createdAt,
                waitingDays: Math.floor((Date.now() - new Date(req.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
            })),
            byStatus,
        };
    }
    async markCorrectionRequestInReview(requestId, currentUserId) {
        const request = await this.correctionRequestModel.findById(requestId).exec();
        if (!request) {
            return {
                success: false,
                message: 'Correction request not found',
            };
        }
        if (request.status !== enums_1.CorrectionRequestStatus.SUBMITTED) {
            return {
                success: false,
                message: `Cannot mark as in-review: current status is ${request.status}`,
            };
        }
        request.status = enums_1.CorrectionRequestStatus.IN_REVIEW;
        request.updatedBy = currentUserId;
        await request.save();
        return {
            success: true,
            message: 'Correction request marked as in-review',
            request: {
                id: requestId,
                status: request.status,
                reviewStartedAt: new Date(),
                reviewedBy: currentUserId,
            },
        };
    }
    async getCorrectionRequestStatistics(params, currentUserId) {
        const { startDate, endDate } = params;
        const query = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = startDate;
            if (endDate)
                query.createdAt.$lte = endDate;
        }
        const allRequests = await this.correctionRequestModel.find(query).exec();
        const totalRequests = allRequests.length;
        const byStatus = {
            submitted: allRequests.filter(r => r.status === enums_1.CorrectionRequestStatus.SUBMITTED).length,
            inReview: allRequests.filter(r => r.status === enums_1.CorrectionRequestStatus.IN_REVIEW).length,
            approved: allRequests.filter(r => r.status === enums_1.CorrectionRequestStatus.APPROVED).length,
            rejected: allRequests.filter(r => r.status === enums_1.CorrectionRequestStatus.REJECTED).length,
            escalated: allRequests.filter(r => r.status === enums_1.CorrectionRequestStatus.ESCALATED).length,
        };
        const decidedRequests = byStatus.approved + byStatus.rejected;
        const approvalRate = decidedRequests > 0
            ? Math.round((byStatus.approved / decidedRequests) * 100)
            : 0;
        const pendingRequests = byStatus.submitted + byStatus.inReview + byStatus.escalated;
        return {
            reportPeriod: {
                startDate: startDate || 'all time',
                endDate: endDate || 'now',
            },
            summary: {
                totalRequests,
                pendingRequests,
                decidedRequests,
                approvalRate: `${approvalRate}%`,
            },
            byStatus,
            recommendations: pendingRequests > 10
                ? ['High number of pending requests - consider reviewing backlog']
                : ['Request processing is on track'],
            generatedAt: new Date(),
        };
    }
    async createTimeException(createTimeExceptionDto, currentUserId) {
        const newTimeException = new this.timeExceptionModel({
            ...createTimeExceptionDto,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newTimeException.save();
    }
    async updateTimeException(id, updateTimeExceptionDto, currentUserId) {
        return this.timeExceptionModel.findByIdAndUpdate(id, {
            ...updateTimeExceptionDto,
            updatedBy: currentUserId,
        }, { new: true });
    }
    async getTimeExceptionsByEmployee(employeeId, getTimeExceptionsDto, currentUserId) {
        const { status } = getTimeExceptionsDto;
        const query = { employeeId };
        if (status) {
            query.status = status;
        }
        return this.timeExceptionModel.find(query).exec();
    }
    async approveTimeException(approveTimeExceptionDto, currentUserId) {
        const { timeExceptionId } = approveTimeExceptionDto;
        return this.timeExceptionModel.findByIdAndUpdate(timeExceptionId, {
            status: 'APPROVED',
            updatedBy: currentUserId,
        }, { new: true });
    }
    async rejectTimeException(rejectTimeExceptionDto, currentUserId) {
        const { timeExceptionId } = rejectTimeExceptionDto;
        return this.timeExceptionModel.findByIdAndUpdate(timeExceptionId, {
            status: 'REJECTED',
            updatedBy: currentUserId,
        }, { new: true });
    }
    async escalateTimeException(escalateTimeExceptionDto, currentUserId) {
        const { timeExceptionId } = escalateTimeExceptionDto;
        return this.timeExceptionModel.findByIdAndUpdate(timeExceptionId, {
            status: 'ESCALATED',
            updatedBy: currentUserId,
        }, { new: true });
    }
    async getAllTimeExceptions(filters, currentUserId) {
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.type) {
            query.type = filters.type;
        }
        if (filters.employeeId) {
            query.employeeId = filters.employeeId;
        }
        if (filters.assignedTo) {
            query.assignedTo = filters.assignedTo;
        }
        if (filters.startDate && filters.endDate) {
            query.createdAt = {
                $gte: this.convertDateToUTCStart(filters.startDate),
                $lte: this.convertDateToUTCEnd(filters.endDate),
            };
        }
        return this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .populate('attendanceRecordId')
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getTimeExceptionById(id, currentUserId) {
        const exception = await this.timeExceptionModel
            .findById(id)
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .populate('attendanceRecordId')
            .populate('assignedTo', 'firstName lastName email')
            .exec();
        if (!exception) {
            throw new Error('Time exception not found');
        }
        return exception;
    }
    async resolveTimeException(resolveTimeExceptionDto, currentUserId) {
        const { timeExceptionId, resolutionNotes } = resolveTimeExceptionDto;
        const exception = await this.timeExceptionModel.findById(timeExceptionId);
        if (!exception) {
            throw new Error('Time exception not found');
        }
        if (exception.status !== enums_1.TimeExceptionStatus.APPROVED) {
            throw new Error('Can only resolve exceptions that are APPROVED');
        }
        return this.timeExceptionModel.findByIdAndUpdate(timeExceptionId, {
            status: enums_1.TimeExceptionStatus.RESOLVED,
            reason: resolutionNotes || exception.reason,
            updatedBy: currentUserId,
        }, { new: true });
    }
    async reassignTimeException(reassignDto, currentUserId) {
        const { timeExceptionId, newAssigneeId, reason } = reassignDto;
        const exception = await this.timeExceptionModel.findById(timeExceptionId);
        if (!exception) {
            throw new Error('Time exception not found');
        }
        if (exception.status === enums_1.TimeExceptionStatus.RESOLVED ||
            exception.status === enums_1.TimeExceptionStatus.REJECTED) {
            throw new Error('Cannot reassign resolved or rejected exceptions');
        }
        const updated = await this.timeExceptionModel.findByIdAndUpdate(timeExceptionId, {
            assignedTo: newAssigneeId,
            status: enums_1.TimeExceptionStatus.PENDING,
            reason: reason || exception.reason,
            updatedBy: currentUserId,
        }, { new: true });
        await this.logTimeManagementChange('EXCEPTION_REASSIGNED', {
            timeExceptionId,
            previousAssignee: exception.assignedTo,
            newAssignee: newAssigneeId,
            reason,
        }, currentUserId);
        return updated;
    }
    async getTimeExceptionStatistics(filters, currentUserId) {
        const matchQuery = {};
        if (filters.employeeId) {
            matchQuery.employeeId = filters.employeeId;
        }
        if (filters.startDate && filters.endDate) {
            matchQuery.createdAt = {
                $gte: this.convertDateToUTCStart(filters.startDate),
                $lte: this.convertDateToUTCEnd(filters.endDate),
            };
        }
        const statusCounts = await this.timeExceptionModel.aggregate([
            { $match: matchQuery },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);
        const typeCounts = await this.timeExceptionModel.aggregate([
            { $match: matchQuery },
            { $group: { _id: '$type', count: { $sum: 1 } } },
        ]);
        const totalCount = await this.timeExceptionModel.countDocuments(matchQuery);
        const pendingCount = await this.timeExceptionModel.countDocuments({
            ...matchQuery,
            status: { $in: [enums_1.TimeExceptionStatus.OPEN, enums_1.TimeExceptionStatus.PENDING] },
        });
        const escalatedCount = await this.timeExceptionModel.countDocuments({
            ...matchQuery,
            status: enums_1.TimeExceptionStatus.ESCALATED,
        });
        return {
            total: totalCount,
            pending: pendingCount,
            escalated: escalatedCount,
            byStatus: statusCounts.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            byType: typeCounts.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
        };
    }
    async bulkApproveTimeExceptions(exceptionIds, currentUserId) {
        const results = {
            approved: [],
            failed: [],
        };
        for (const id of exceptionIds) {
            try {
                const exception = await this.timeExceptionModel.findById(id);
                if (!exception) {
                    results.failed.push({ id, reason: 'Not found' });
                    continue;
                }
                if (exception.status === enums_1.TimeExceptionStatus.APPROVED ||
                    exception.status === enums_1.TimeExceptionStatus.RESOLVED) {
                    results.failed.push({ id, reason: 'Already approved/resolved' });
                    continue;
                }
                await this.timeExceptionModel.findByIdAndUpdate(id, {
                    status: enums_1.TimeExceptionStatus.APPROVED,
                    updatedBy: currentUserId,
                });
                results.approved.push(id);
            }
            catch (error) {
                results.failed.push({ id, reason: 'Update failed' });
            }
        }
        await this.logTimeManagementChange('BULK_EXCEPTION_APPROVAL', { approvedCount: results.approved.length, failedCount: results.failed.length }, currentUserId);
        return results;
    }
    async bulkRejectTimeExceptions(rejectDto, currentUserId) {
        const { exceptionIds, reason } = rejectDto;
        const results = {
            rejected: [],
            failed: [],
        };
        for (const id of exceptionIds) {
            try {
                const exception = await this.timeExceptionModel.findById(id);
                if (!exception) {
                    results.failed.push({ id, reason: 'Not found' });
                    continue;
                }
                if (exception.status === enums_1.TimeExceptionStatus.REJECTED ||
                    exception.status === enums_1.TimeExceptionStatus.RESOLVED) {
                    results.failed.push({ id, reason: 'Already rejected/resolved' });
                    continue;
                }
                await this.timeExceptionModel.findByIdAndUpdate(id, {
                    status: enums_1.TimeExceptionStatus.REJECTED,
                    reason: reason,
                    updatedBy: currentUserId,
                });
                results.rejected.push(id);
            }
            catch (error) {
                results.failed.push({ id, reason: 'Update failed' });
            }
        }
        await this.logTimeManagementChange('BULK_EXCEPTION_REJECTION', { rejectedCount: results.rejected.length, failedCount: results.failed.length }, currentUserId);
        return results;
    }
    async autoCreateLatenessException(employeeId, attendanceRecordId, assignedTo, lateMinutes, currentUserId) {
        const exception = new this.timeExceptionModel({
            employeeId,
            type: enums_1.TimeExceptionType.LATE,
            attendanceRecordId,
            assignedTo,
            status: enums_1.TimeExceptionStatus.OPEN,
            reason: `Auto-generated: Employee was ${lateMinutes} minutes late`,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await exception.save();
        await this.logTimeManagementChange('AUTO_LATENESS_EXCEPTION_CREATED', { employeeId, attendanceRecordId, lateMinutes }, currentUserId);
        return exception;
    }
    async autoCreateEarlyLeaveException(employeeId, attendanceRecordId, assignedTo, earlyMinutes, currentUserId) {
        const exception = new this.timeExceptionModel({
            employeeId,
            type: enums_1.TimeExceptionType.EARLY_LEAVE,
            attendanceRecordId,
            assignedTo,
            status: enums_1.TimeExceptionStatus.OPEN,
            reason: `Auto-generated: Employee left ${earlyMinutes} minutes early`,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await exception.save();
        await this.logTimeManagementChange('AUTO_EARLY_LEAVE_EXCEPTION_CREATED', { employeeId, attendanceRecordId, earlyMinutes }, currentUserId);
        return exception;
    }
    async getPendingExceptionsForHandler(assignedTo, currentUserId) {
        return this.timeExceptionModel
            .find({
            assignedTo,
            status: { $in: [enums_1.TimeExceptionStatus.OPEN, enums_1.TimeExceptionStatus.PENDING] },
        })
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .populate('attendanceRecordId')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getEscalatedExceptions(currentUserId) {
        return this.timeExceptionModel
            .find({
            status: enums_1.TimeExceptionStatus.ESCALATED,
        })
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .populate('attendanceRecordId')
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async autoEscalateOverdueExceptions(params, currentUserId) {
        const { thresholdDays, excludeTypes = [] } = params;
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - thresholdDays);
        const query = {
            status: { $in: [enums_1.TimeExceptionStatus.OPEN, enums_1.TimeExceptionStatus.PENDING] },
            createdAt: { $lte: thresholdDate },
        };
        if (excludeTypes.length > 0) {
            query.type = { $nin: excludeTypes };
        }
        const overdueExceptions = await this.timeExceptionModel.find(query).exec();
        const escalatedIds = [];
        const failedIds = [];
        for (const exception of overdueExceptions) {
            try {
                exception.status = enums_1.TimeExceptionStatus.ESCALATED;
                exception.reason = `${exception.reason || ''}\n\n[AUTO-ESCALATED - ${new Date().toISOString()}]\nReason: Pending for more than ${thresholdDays} days`;
                exception.updatedBy = currentUserId;
                await exception.save();
                escalatedIds.push(String(exception._id));
            }
            catch {
                failedIds.push(String(exception._id));
            }
        }
        await this.logTimeManagementChange('AUTO_ESCALATION_BATCH', {
            thresholdDays,
            totalOverdue: overdueExceptions.length,
            escalatedCount: escalatedIds.length,
            failedCount: failedIds.length,
        }, currentUserId);
        return {
            thresholdDays,
            thresholdDate,
            summary: {
                totalOverdue: overdueExceptions.length,
                escalated: escalatedIds.length,
                failed: failedIds.length,
            },
            escalatedIds,
            failedIds,
            executedAt: new Date(),
        };
    }
    async getOverdueExceptions(params, currentUserId) {
        const { thresholdDays, status = [enums_1.TimeExceptionStatus.OPEN, enums_1.TimeExceptionStatus.PENDING] } = params;
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - thresholdDays);
        const overdueExceptions = await this.timeExceptionModel
            .find({
            status: { $in: status },
            createdAt: { $lte: thresholdDate },
        })
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .populate('attendanceRecordId')
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: 1 })
            .exec();
        return {
            thresholdDays,
            thresholdDate,
            totalOverdue: overdueExceptions.length,
            exceptions: overdueExceptions.map(exc => ({
                id: exc._id,
                employeeId: exc.employeeId,
                type: exc.type,
                status: exc.status,
                assignedTo: exc.assignedTo,
                reason: exc.reason,
                createdAt: exc.createdAt,
                daysPending: Math.floor((Date.now() - new Date(exc.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
            })),
        };
    }
    async getApprovalWorkflowConfig(currentUserId) {
        return {
            escalationThresholds: {
                autoEscalateAfterDays: 3,
                warningAfterDays: 2,
                criticalAfterDays: 5,
            },
            payrollCutoff: {
                escalateBeforeDays: 2,
            },
            workflowStages: [
                { status: 'OPEN', description: 'New request, awaiting assignment', nextAction: 'Assign to handler' },
                { status: 'PENDING', description: 'Assigned, awaiting review', nextAction: 'Review and approve/reject' },
                { status: 'APPROVED', description: 'Request approved', nextAction: 'Resolve to complete' },
                { status: 'REJECTED', description: 'Request rejected', nextAction: 'No further action' },
                { status: 'ESCALATED', description: 'Escalated for urgent review', nextAction: 'Immediate HR review' },
                { status: 'RESOLVED', description: 'Completed', nextAction: 'Closed' },
            ],
            notificationSettings: {
                notifyOnAssignment: true,
                notifyOnStatusChange: true,
                notifyOnEscalation: true,
                reminderBeforeDeadlineDays: 1,
            },
        };
    }
    async getApprovalWorkflowDashboard(params, currentUserId) {
        const config = await this.getApprovalWorkflowConfig(currentUserId);
        const openCount = await this.timeExceptionModel.countDocuments({ status: enums_1.TimeExceptionStatus.OPEN });
        const pendingCount = await this.timeExceptionModel.countDocuments({ status: enums_1.TimeExceptionStatus.PENDING });
        const escalatedCount = await this.timeExceptionModel.countDocuments({ status: enums_1.TimeExceptionStatus.ESCALATED });
        const approvedTodayCount = await this.timeExceptionModel.countDocuments({
            status: enums_1.TimeExceptionStatus.APPROVED,
            updatedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        });
        const rejectedTodayCount = await this.timeExceptionModel.countDocuments({
            status: enums_1.TimeExceptionStatus.REJECTED,
            updatedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        });
        const warningDate = new Date();
        warningDate.setDate(warningDate.getDate() - config.escalationThresholds.warningAfterDays);
        const warningCount = await this.timeExceptionModel.countDocuments({
            status: { $in: [enums_1.TimeExceptionStatus.OPEN, enums_1.TimeExceptionStatus.PENDING] },
            createdAt: { $lte: warningDate },
        });
        const criticalDate = new Date();
        criticalDate.setDate(criticalDate.getDate() - config.escalationThresholds.criticalAfterDays);
        const criticalCount = await this.timeExceptionModel.countDocuments({
            status: { $in: [enums_1.TimeExceptionStatus.OPEN, enums_1.TimeExceptionStatus.PENDING] },
            createdAt: { $lte: criticalDate },
        });
        let myPendingCount = 0;
        if (params.managerId) {
            myPendingCount = await this.timeExceptionModel.countDocuments({
                assignedTo: params.managerId,
                status: { $in: [enums_1.TimeExceptionStatus.OPEN, enums_1.TimeExceptionStatus.PENDING] },
            });
        }
        return {
            dashboard: {
                totalPending: openCount + pendingCount,
                open: openCount,
                pending: pendingCount,
                escalated: escalatedCount,
                approvedToday: approvedTodayCount,
                rejectedToday: rejectedTodayCount,
                myPending: myPendingCount,
            },
            alerts: {
                warning: warningCount,
                critical: criticalCount,
                requiresImmediate: escalatedCount,
            },
            config: config.escalationThresholds,
            generatedAt: new Date(),
        };
    }
    async setExceptionDeadline(params, currentUserId) {
        const { exceptionId, deadlineDate, notifyBeforeDays = 1 } = params;
        const exception = await this.timeExceptionModel.findById(exceptionId).exec();
        if (!exception) {
            return {
                success: false,
                message: 'Time exception not found',
            };
        }
        exception.reason = `${exception.reason || ''}\n\n[DEADLINE SET - ${new Date().toISOString()}]\nReview deadline: ${deadlineDate.toISOString()}\nNotify ${notifyBeforeDays} day(s) before`;
        exception.updatedBy = currentUserId;
        await exception.save();
        return {
            success: true,
            message: 'Deadline set successfully',
            exception: {
                id: exceptionId,
                deadline: deadlineDate,
                notifyBeforeDays,
            },
        };
    }
    async getRequestsApproachingDeadline(params, currentUserId) {
        const { withinDays, payrollCutoffDate } = params;
        const pendingExceptions = await this.timeExceptionModel
            .find({
            status: { $in: [enums_1.TimeExceptionStatus.OPEN, enums_1.TimeExceptionStatus.PENDING] },
        })
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .populate('assignedTo', 'firstName lastName email')
            .exec();
        const now = new Date();
        const targetDate = payrollCutoffDate || new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000);
        const approaching = pendingExceptions.map(exc => {
            const createdAt = new Date(exc.createdAt);
            const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
            const daysUntilPayroll = payrollCutoffDate
                ? Math.floor((payrollCutoffDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                : null;
            return {
                id: exc._id,
                employee: exc.employeeId,
                type: exc.type,
                status: exc.status,
                assignedTo: exc.assignedTo,
                ageInDays,
                daysUntilPayroll,
                urgency: ageInDays >= 5 ? 'CRITICAL' : ageInDays >= 3 ? 'HIGH' : ageInDays >= 2 ? 'MEDIUM' : 'LOW',
            };
        });
        approaching.sort((a, b) => {
            const urgencyOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        });
        return {
            withinDays,
            payrollCutoffDate,
            totalPending: approaching.length,
            byUrgency: {
                critical: approaching.filter(r => r.urgency === 'CRITICAL').length,
                high: approaching.filter(r => r.urgency === 'HIGH').length,
                medium: approaching.filter(r => r.urgency === 'MEDIUM').length,
                low: approaching.filter(r => r.urgency === 'LOW').length,
            },
            requests: approaching,
        };
    }
    async requestOvertimeApproval(overtimeRequest, currentUserId) {
        const { employeeId, attendanceRecordId, requestedMinutes, reason, assignedTo } = overtimeRequest;
        const existingRequest = await this.timeExceptionModel.findOne({
            employeeId,
            attendanceRecordId,
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
            status: { $in: [enums_1.TimeExceptionStatus.OPEN, enums_1.TimeExceptionStatus.PENDING] },
        });
        if (existingRequest) {
            throw new Error('An overtime request already exists for this attendance record');
        }
        const overtimeException = new this.timeExceptionModel({
            employeeId,
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
            attendanceRecordId,
            assignedTo,
            status: enums_1.TimeExceptionStatus.PENDING,
            reason: `Overtime Request: ${requestedMinutes} minutes. Reason: ${reason}`,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await overtimeException.save();
        await this.logTimeManagementChange('OVERTIME_REQUEST_CREATED', { employeeId, attendanceRecordId, requestedMinutes, reason }, currentUserId);
        return overtimeException;
    }
    async calculateOvertimeFromAttendance(attendanceRecordId, standardWorkMinutes = 480, currentUserId) {
        const attendanceRecord = await this.attendanceRecordModel.findById(attendanceRecordId);
        if (!attendanceRecord) {
            throw new Error('Attendance record not found');
        }
        const totalWorkMinutes = attendanceRecord.totalWorkMinutes || 0;
        const overtimeMinutes = Math.max(0, totalWorkMinutes - standardWorkMinutes);
        const isOvertime = overtimeMinutes > 0;
        return {
            attendanceRecordId,
            employeeId: attendanceRecord.employeeId,
            totalWorkMinutes,
            standardWorkMinutes,
            overtimeMinutes,
            overtimeHours: Math.round((overtimeMinutes / 60) * 100) / 100,
            isOvertime,
            requiresApproval: isOvertime,
        };
    }
    async getEmployeeOvertimeSummary(employeeId, startDate, endDate, currentUserId) {
        const startDateUTC = this.convertDateToUTCStart(startDate);
        const endDateUTC = this.convertDateToUTCEnd(endDate);
        const overtimeExceptions = await this.timeExceptionModel
            .find({
            employeeId,
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
            createdAt: { $gte: startDateUTC, $lte: endDateUTC },
        })
            .populate('attendanceRecordId')
            .exec();
        const approved = overtimeExceptions.filter(e => e.status === enums_1.TimeExceptionStatus.APPROVED);
        const pending = overtimeExceptions.filter(e => e.status === enums_1.TimeExceptionStatus.OPEN || e.status === enums_1.TimeExceptionStatus.PENDING);
        const rejected = overtimeExceptions.filter(e => e.status === enums_1.TimeExceptionStatus.REJECTED);
        let totalApprovedMinutes = 0;
        for (const exception of approved) {
            const record = exception.attendanceRecordId;
            if (record && record.totalWorkMinutes) {
                const overtime = Math.max(0, record.totalWorkMinutes - 480);
                totalApprovedMinutes += overtime;
            }
        }
        return {
            employeeId,
            period: { startDate, endDate },
            summary: {
                totalRequests: overtimeExceptions.length,
                approvedRequests: approved.length,
                pendingRequests: pending.length,
                rejectedRequests: rejected.length,
                totalApprovedOvertimeMinutes: totalApprovedMinutes,
                totalApprovedOvertimeHours: Math.round((totalApprovedMinutes / 60) * 100) / 100,
            },
            requests: overtimeExceptions,
        };
    }
    async getPendingOvertimeRequests(filters, currentUserId) {
        const query = {
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
            status: { $in: [enums_1.TimeExceptionStatus.OPEN, enums_1.TimeExceptionStatus.PENDING] },
        };
        if (filters.assignedTo) {
            query.assignedTo = filters.assignedTo;
        }
        return this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .populate('attendanceRecordId')
            .populate('assignedTo', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async approveOvertimeRequest(overtimeRequestId, approvalNotes, currentUserId) {
        const overtimeRequest = await this.timeExceptionModel.findById(overtimeRequestId);
        if (!overtimeRequest) {
            throw new Error('Overtime request not found');
        }
        if (overtimeRequest.type !== enums_1.TimeExceptionType.OVERTIME_REQUEST) {
            throw new Error('This is not an overtime request');
        }
        if (overtimeRequest.status === enums_1.TimeExceptionStatus.APPROVED) {
            throw new Error('Overtime request is already approved');
        }
        const updatedReason = approvalNotes
            ? `${overtimeRequest.reason} | Approved: ${approvalNotes}`
            : overtimeRequest.reason;
        const updated = await this.timeExceptionModel.findByIdAndUpdate(overtimeRequestId, {
            status: enums_1.TimeExceptionStatus.APPROVED,
            reason: updatedReason,
            updatedBy: currentUserId,
        }, { new: true });
        await this.logTimeManagementChange('OVERTIME_REQUEST_APPROVED', { overtimeRequestId, approvalNotes }, currentUserId);
        return updated;
    }
    async rejectOvertimeRequest(overtimeRequestId, rejectionReason, currentUserId) {
        const overtimeRequest = await this.timeExceptionModel.findById(overtimeRequestId);
        if (!overtimeRequest) {
            throw new Error('Overtime request not found');
        }
        if (overtimeRequest.type !== enums_1.TimeExceptionType.OVERTIME_REQUEST) {
            throw new Error('This is not an overtime request');
        }
        if (overtimeRequest.status === enums_1.TimeExceptionStatus.REJECTED) {
            throw new Error('Overtime request is already rejected');
        }
        const updatedReason = `${overtimeRequest.reason} | Rejected: ${rejectionReason}`;
        const updated = await this.timeExceptionModel.findByIdAndUpdate(overtimeRequestId, {
            status: enums_1.TimeExceptionStatus.REJECTED,
            reason: updatedReason,
            updatedBy: currentUserId,
        }, { new: true });
        await this.logTimeManagementChange('OVERTIME_REQUEST_REJECTED', { overtimeRequestId, rejectionReason }, currentUserId);
        return updated;
    }
    async autoDetectAndCreateOvertimeException(attendanceRecordId, standardWorkMinutes = 480, assignedTo, currentUserId) {
        const calculation = await this.calculateOvertimeFromAttendance(attendanceRecordId, standardWorkMinutes, currentUserId);
        if (!calculation.isOvertime) {
            return { created: false, reason: 'No overtime detected', calculation };
        }
        const existing = await this.timeExceptionModel.findOne({
            attendanceRecordId,
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
        });
        if (existing) {
            return { created: false, reason: 'Overtime request already exists', existingId: existing._id };
        }
        const overtimeException = await this.requestOvertimeApproval({
            employeeId: calculation.employeeId.toString(),
            attendanceRecordId,
            requestedMinutes: calculation.overtimeMinutes,
            reason: `Auto-detected: ${calculation.overtimeMinutes} minutes (${calculation.overtimeHours} hours) overtime`,
            assignedTo,
        }, currentUserId);
        return {
            created: true,
            overtimeException,
            calculation,
        };
    }
    async getOvertimeStatistics(filters, currentUserId) {
        const query = {
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
        };
        if (filters.startDate && filters.endDate) {
            query.createdAt = {
                $gte: this.convertDateToUTCStart(filters.startDate),
                $lte: this.convertDateToUTCEnd(filters.endDate),
            };
        }
        const allOvertimeRequests = await this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'firstName lastName departmentId')
            .populate('attendanceRecordId')
            .exec();
        const byStatus = {
            approved: 0,
            pending: 0,
            rejected: 0,
            escalated: 0,
        };
        let totalApprovedMinutes = 0;
        const employeeOvertime = {};
        for (const request of allOvertimeRequests) {
            if (request.status === enums_1.TimeExceptionStatus.APPROVED) {
                byStatus.approved++;
                const record = request.attendanceRecordId;
                if (record && record.totalWorkMinutes) {
                    const overtime = Math.max(0, record.totalWorkMinutes - 480);
                    totalApprovedMinutes += overtime;
                    const empId = request.employeeId?.toString() || 'unknown';
                    const emp = request.employeeId;
                    const empName = emp ? `${emp.firstName || ''} ${emp.lastName || ''}`.trim() : 'Unknown';
                    if (!employeeOvertime[empId]) {
                        employeeOvertime[empId] = { name: empName, minutes: 0, count: 0 };
                    }
                    employeeOvertime[empId].minutes += overtime;
                    employeeOvertime[empId].count++;
                }
            }
            else if (request.status === enums_1.TimeExceptionStatus.PENDING || request.status === enums_1.TimeExceptionStatus.OPEN) {
                byStatus.pending++;
            }
            else if (request.status === enums_1.TimeExceptionStatus.REJECTED) {
                byStatus.rejected++;
            }
            else if (request.status === enums_1.TimeExceptionStatus.ESCALATED) {
                byStatus.escalated++;
            }
        }
        const topOvertimeEmployees = Object.entries(employeeOvertime)
            .map(([id, data]) => ({ employeeId: id, ...data, hours: Math.round((data.minutes / 60) * 100) / 100 }))
            .sort((a, b) => b.minutes - a.minutes)
            .slice(0, 10);
        return {
            period: { startDate: filters.startDate, endDate: filters.endDate },
            summary: {
                totalRequests: allOvertimeRequests.length,
                ...byStatus,
                totalApprovedOvertimeMinutes: totalApprovedMinutes,
                totalApprovedOvertimeHours: Math.round((totalApprovedMinutes / 60) * 100) / 100,
            },
            topOvertimeEmployees,
        };
    }
    async bulkProcessOvertimeRequests(action, requestIds, notes, currentUserId) {
        const results = {
            processed: [],
            failed: [],
        };
        for (const id of requestIds) {
            try {
                if (action === 'approve') {
                    await this.approveOvertimeRequest(id, notes, currentUserId);
                }
                else {
                    await this.rejectOvertimeRequest(id, notes, currentUserId);
                }
                results.processed.push(id);
            }
            catch (error) {
                results.failed.push({ id, reason: error.message || 'Processing failed' });
            }
        }
        await this.logTimeManagementChange(`BULK_OVERTIME_${action.toUpperCase()}`, { processedCount: results.processed.length, failedCount: results.failed.length }, currentUserId);
        return results;
    }
    async recordPunchWithMetadata(recordPunchWithMetadataDto, currentUserId) {
        const punchesWithDates = recordPunchWithMetadataDto.punches.map((punch) => ({
            type: punch.type,
            time: punch.time instanceof Date ? punch.time : new Date(punch.time),
        }));
        const attendanceRecord = new this.attendanceRecordModel({
            employeeId: recordPunchWithMetadataDto.employeeId,
            punches: punchesWithDates,
            totalWorkMinutes: this.calculateWorkMinutesFromPunches(punchesWithDates),
            hasMissedPunch: recordPunchWithMetadataDto.punches.length % 2 !== 0,
            finalisedForPayroll: false,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        await attendanceRecord.save();
        await this.logAttendanceChange(recordPunchWithMetadataDto.employeeId, 'PUNCH_RECORDED', {
            attendanceRecordId: attendanceRecord._id,
            deviceId: recordPunchWithMetadataDto.deviceId,
            location: recordPunchWithMetadataDto.location,
            source: recordPunchWithMetadataDto.source ?? 'manual',
        }, currentUserId);
        return attendanceRecord;
    }
    async recordPunchFromDevice(recordPunchWithMetadataDto, currentUserId) {
        return this.recordPunchWithMetadata({
            ...recordPunchWithMetadataDto,
            source: recordPunchWithMetadataDto.source ?? 'device',
        }, currentUserId);
    }
    async enforcePunchPolicy(enforcePunchPolicyDto, currentUserId) {
        if (enforcePunchPolicyDto.policy === 'FIRST_LAST' &&
            enforcePunchPolicyDto.punches.length > 2) {
            throw new Error('First/Last policy allows only two punches per period.');
        }
        const alternatingTypes = enforcePunchPolicyDto.punches.every((punch, index, arr) => {
            if (index === 0) {
                return true;
            }
            return arr[index - 1].type !== punch.type;
        });
        if (!alternatingTypes) {
            throw new Error('Punch sequence must alternate between IN and OUT.');
        }
        return { valid: true, policy: enforcePunchPolicyDto.policy };
    }
    async applyAttendanceRounding(applyAttendanceRoundingDto, currentUserId) {
        const attendanceRecord = await this.attendanceRecordModel.findById(applyAttendanceRoundingDto.attendanceRecordId);
        if (!attendanceRecord) {
            throw new Error('Attendance record not found');
        }
        const roundedMinutes = this.roundMinutes(attendanceRecord.totalWorkMinutes, applyAttendanceRoundingDto.intervalMinutes, applyAttendanceRoundingDto.strategy);
        attendanceRecord.totalWorkMinutes = roundedMinutes;
        attendanceRecord.updatedBy = currentUserId;
        await attendanceRecord.save();
        await this.logAttendanceChange(attendanceRecord.employeeId.toString(), 'ATTENDANCE_ROUNDED', {
            strategy: applyAttendanceRoundingDto.strategy,
            interval: applyAttendanceRoundingDto.intervalMinutes,
        }, currentUserId);
        return attendanceRecord;
    }
    async enforceShiftPunchPolicy(enforceShiftPunchPolicyDto, currentUserId) {
        const startMinutes = this.timeStringToMinutes(enforceShiftPunchPolicyDto.shiftStart);
        const endMinutes = this.timeStringToMinutes(enforceShiftPunchPolicyDto.shiftEnd);
        const allowEarly = enforceShiftPunchPolicyDto.allowEarlyMinutes ?? 0;
        const allowLate = enforceShiftPunchPolicyDto.allowLateMinutes ?? 0;
        enforceShiftPunchPolicyDto.punches.forEach((punch) => {
            const punchTime = punch.time instanceof Date ? punch.time : new Date(punch.time);
            const punchMinutes = this.dateToMinutesUTC(punchTime);
            if (punchMinutes < startMinutes - allowEarly) {
                throw new Error('Punch occurs before the allowed start window.');
            }
            if (punchMinutes > endMinutes + allowLate) {
                throw new Error('Punch occurs after the allowed end window.');
            }
        });
        return { valid: true };
    }
    async monitorRepeatedLateness(monitorRepeatedLatenessDto, currentUserId) {
        const latenessCount = await this.timeExceptionModel.countDocuments({
            employeeId: monitorRepeatedLatenessDto.employeeId,
            type: enums_1.TimeExceptionType.LATE,
        });
        const exceeded = latenessCount >= monitorRepeatedLatenessDto.threshold;
        if (exceeded) {
            await this.triggerLatenessDisciplinary({
                employeeId: monitorRepeatedLatenessDto.employeeId,
                action: 'AUTO_ESCALATION',
            }, currentUserId);
        }
        return {
            employeeId: monitorRepeatedLatenessDto.employeeId,
            count: latenessCount,
            threshold: monitorRepeatedLatenessDto.threshold,
            exceeded,
        };
    }
    async triggerLatenessDisciplinary(triggerLatenessDisciplinaryDto, currentUserId) {
        await this.logTimeManagementChange('LATENESS_DISCIPLINARY', {
            employeeId: triggerLatenessDisciplinaryDto.employeeId,
            action: triggerLatenessDisciplinaryDto.action ?? 'MANUAL_TRIGGER',
        }, currentUserId);
        return { message: 'Disciplinary action logged.' };
    }
    async getEmployeeLatenessHistory(params, currentUserId) {
        const { employeeId, startDate, endDate, limit = 50 } = params;
        const query = {
            employeeId,
            type: enums_1.TimeExceptionType.LATE,
        };
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = startDate;
            if (endDate)
                query.createdAt.$lte = endDate;
        }
        const latenessRecords = await this.timeExceptionModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
        const totalOccurrences = latenessRecords.length;
        const totalLatenessMinutes = latenessRecords.reduce((sum, record) => {
            return sum + (record.durationMinutes || 0);
        }, 0);
        return {
            employeeId,
            dateRange: {
                startDate: startDate || 'all time',
                endDate: endDate || 'now',
            },
            summary: {
                totalOccurrences,
                totalLatenessMinutes,
                averageLatenessMinutes: totalOccurrences > 0
                    ? Math.round(totalLatenessMinutes / totalOccurrences)
                    : 0,
            },
            records: latenessRecords.map(record => ({
                id: record._id,
                date: record.createdAt,
                status: record.status,
                reason: record.reason,
            })),
        };
    }
    async flagEmployeeForRepeatedLateness(params, currentUserId) {
        const { employeeId, occurrenceCount, periodDays, severity, notes } = params;
        const disciplinaryFlag = new this.timeExceptionModel({
            employeeId,
            type: 'DISCIPLINARY_FLAG',
            status: 'PENDING',
            reason: notes || `Repeated lateness: ${occurrenceCount} occurrences in ${periodDays} days. Severity: ${severity}`,
            attendanceRecordId: employeeId,
            assignedTo: currentUserId,
        });
        await disciplinaryFlag.save();
        await this.logTimeManagementChange('LATENESS_FLAG_CREATED', {
            employeeId,
            occurrenceCount,
            periodDays,
            severity,
            flagId: disciplinaryFlag._id,
        }, currentUserId);
        return {
            success: true,
            message: 'Employee flagged for repeated lateness',
            flag: {
                id: disciplinaryFlag._id,
                employeeId,
                severity,
                occurrenceCount,
                periodDays,
                createdAt: new Date(),
                createdBy: currentUserId,
            },
            nextSteps: this.getDisciplinaryNextSteps(severity),
        };
    }
    getDisciplinaryNextSteps(severity) {
        switch (severity) {
            case 'WARNING':
                return [
                    'Issue verbal warning to employee',
                    'Document conversation in HR system',
                    'Set reminder for 30-day review',
                ];
            case 'WRITTEN_WARNING':
                return [
                    'Prepare written warning letter',
                    'Schedule meeting with employee and manager',
                    'Have employee sign acknowledgment',
                    'Set reminder for 60-day review',
                ];
            case 'FINAL_WARNING':
                return [
                    'Prepare final warning documentation',
                    'Involve HR representative in meeting',
                    'Discuss Performance Improvement Plan (PIP)',
                    'Set clear expectations and timeline',
                ];
            case 'SUSPENSION':
                return [
                    'Prepare suspension notice',
                    'Calculate suspension duration per policy',
                    'Notify payroll for salary adjustment',
                    'Schedule return-to-work meeting',
                ];
            default:
                return ['Review case with HR manager'];
        }
    }
    async getLatenesDisciplinaryFlags(params, currentUserId) {
        const query = {
            type: 'DISCIPLINARY_FLAG',
        };
        if (params.status) {
            query.status = params.status;
        }
        if (params.startDate || params.endDate) {
            query.createdAt = {};
            if (params.startDate)
                query.createdAt.$gte = params.startDate;
            if (params.endDate)
                query.createdAt.$lte = params.endDate;
        }
        const flags = await this.timeExceptionModel
            .find(query)
            .sort({ createdAt: -1 })
            .exec();
        const filteredFlags = params.severity
            ? flags.filter(flag => flag.reason?.includes(`Severity: ${params.severity}`))
            : flags;
        return {
            totalFlags: filteredFlags.length,
            filters: params,
            flags: filteredFlags.map(flag => ({
                id: flag._id,
                employeeId: flag.employeeId,
                status: flag.status,
                reason: flag.reason,
                createdAt: flag.createdAt,
            })),
        };
    }
    async analyzeLatenessPatterns(params, currentUserId) {
        const { employeeId, periodDays = 90 } = params;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodDays);
        const latenessRecords = await this.timeExceptionModel
            .find({
            employeeId,
            type: enums_1.TimeExceptionType.LATE,
            createdAt: { $gte: startDate },
        })
            .exec();
        const dayOfWeekAnalysis = {
            Sunday: 0,
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
        };
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        latenessRecords.forEach(record => {
            const date = new Date(record.createdAt);
            const dayName = dayNames[date.getDay()];
            dayOfWeekAnalysis[dayName]++;
        });
        const mostFrequentDay = Object.entries(dayOfWeekAnalysis)
            .sort((a, b) => b[1] - a[1])[0];
        const weeksAnalyzed = Math.ceil(periodDays / 7);
        const averagePerWeek = latenessRecords.length / weeksAnalyzed;
        const halfwayPoint = new Date();
        halfwayPoint.setDate(halfwayPoint.getDate() - periodDays / 2);
        const firstHalf = latenessRecords.filter(r => new Date(r.createdAt) < halfwayPoint).length;
        const secondHalf = latenessRecords.filter(r => new Date(r.createdAt) >= halfwayPoint).length;
        let trend = 'STABLE';
        if (secondHalf > firstHalf * 1.5)
            trend = 'INCREASING';
        else if (secondHalf < firstHalf * 0.5)
            trend = 'DECREASING';
        return {
            employeeId,
            analysisePeriod: {
                days: periodDays,
                startDate,
                endDate: new Date(),
            },
            summary: {
                totalOccurrences: latenessRecords.length,
                averagePerWeek: Math.round(averagePerWeek * 10) / 10,
                trend,
            },
            dayOfWeekAnalysis,
            patterns: {
                mostFrequentDay: mostFrequentDay[0],
                mostFrequentDayCount: mostFrequentDay[1],
                hasWeekendLateness: dayOfWeekAnalysis.Saturday > 0 || dayOfWeekAnalysis.Sunday > 0,
                hasStartOfWeekPattern: dayOfWeekAnalysis.Monday > (latenessRecords.length * 0.3),
                hasEndOfWeekPattern: dayOfWeekAnalysis.Friday > (latenessRecords.length * 0.3),
            },
            recommendation: this.getLatenessPatternRecommendation(trend, averagePerWeek, mostFrequentDay[0]),
        };
    }
    getLatenessPatternRecommendation(trend, avgPerWeek, mostFrequentDay) {
        if (trend === 'INCREASING' && avgPerWeek > 2) {
            return 'Urgent: Schedule immediate meeting with employee and HR. Consider Performance Improvement Plan.';
        }
        if (trend === 'INCREASING') {
            return 'Schedule follow-up meeting to discuss lateness pattern and identify root causes.';
        }
        if (mostFrequentDay === 'Monday') {
            return 'Consider discussing work-life balance; Monday pattern may indicate weekend recovery issues.';
        }
        if (mostFrequentDay === 'Friday') {
            return 'Friday lateness may indicate early weekend mindset; discuss expectations.';
        }
        if (avgPerWeek < 0.5) {
            return 'Lateness is minimal. Continue monitoring but no immediate action required.';
        }
        return 'Continue monitoring and provide regular feedback to employee.';
    }
    async getLatenessTrendReport(params, currentUserId) {
        const { startDate, endDate, groupBy = 'week' } = params;
        const query = {
            type: enums_1.TimeExceptionType.LATE,
            createdAt: { $gte: startDate, $lte: endDate },
        };
        const latenessRecords = await this.timeExceptionModel
            .find(query)
            .sort({ createdAt: 1 })
            .exec();
        const groupedData = {};
        latenessRecords.forEach(record => {
            const date = new Date(record.createdAt);
            let key;
            if (groupBy === 'day') {
                key = date.toISOString().split('T')[0];
            }
            else if (groupBy === 'week') {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = `Week of ${weekStart.toISOString().split('T')[0]}`;
            }
            else {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            if (!groupedData[key]) {
                groupedData[key] = { count: 0, employees: new Set() };
            }
            groupedData[key].count++;
            groupedData[key].employees.add(String(record.employeeId));
        });
        const trendData = Object.entries(groupedData).map(([period, data]) => ({
            period,
            occurrences: data.count,
            uniqueEmployees: data.employees.size,
        }));
        const totalOccurrences = latenessRecords.length;
        const uniqueEmployees = new Set(latenessRecords.map(r => String(r.employeeId))).size;
        return {
            reportPeriod: { startDate, endDate },
            groupBy,
            summary: {
                totalOccurrences,
                uniqueEmployeesAffected: uniqueEmployees,
                averagePerPeriod: Math.round((totalOccurrences / trendData.length) * 10) / 10 || 0,
            },
            trends: trendData,
            generatedAt: new Date(),
            generatedBy: currentUserId,
        };
    }
    async resolveDisciplinaryFlag(params, currentUserId) {
        const { flagId, resolution, resolutionNotes } = params;
        const flag = await this.timeExceptionModel.findById(flagId).exec();
        if (!flag) {
            return {
                success: false,
                message: 'Disciplinary flag not found',
            };
        }
        const previousStatus = flag.status;
        flag.status = resolution;
        flag.reason = `${flag.reason || ''}\n\n[RESOLUTION - ${new Date().toISOString()}]\nStatus: ${resolution}\nNotes: ${resolutionNotes}\nResolved by: ${currentUserId}`;
        flag.updatedBy = currentUserId;
        await flag.save();
        await this.logTimeManagementChange('LATENESS_FLAG_RESOLVED', {
            flagId,
            employeeId: flag.employeeId,
            previousStatus,
            newStatus: resolution,
            resolutionNotes,
        }, currentUserId);
        return {
            success: true,
            message: `Disciplinary flag ${resolution.toLowerCase()}`,
            flag: {
                id: flagId,
                employeeId: flag.employeeId,
                previousStatus,
                newStatus: resolution,
                resolvedAt: new Date(),
                resolvedBy: currentUserId,
            },
        };
    }
    async getRepeatedLatenessOffenders(params, currentUserId) {
        const { threshold, periodDays, includeResolved = false } = params;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodDays);
        const latenessRecords = await this.timeExceptionModel
            .find({
            type: enums_1.TimeExceptionType.LATE,
            createdAt: { $gte: startDate },
        })
            .exec();
        const employeeCounts = {};
        latenessRecords.forEach(record => {
            const empId = String(record.employeeId);
            if (!employeeCounts[empId]) {
                employeeCounts[empId] = { count: 0, records: [] };
            }
            employeeCounts[empId].count++;
            employeeCounts[empId].records.push({
                id: record._id,
                date: record.createdAt,
                status: record.status,
            });
        });
        const offenders = Object.entries(employeeCounts)
            .filter(([, data]) => data.count >= threshold)
            .map(([employeeId, data]) => ({
            employeeId,
            occurrenceCount: data.count,
            exceedsThresholdBy: data.count - threshold,
            recentRecords: data.records.slice(0, 5),
            severity: this.calculateLatenesSeverity(data.count, threshold),
        }))
            .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
        return {
            analysePeriod: {
                startDate,
                endDate: new Date(),
                days: periodDays,
            },
            threshold,
            summary: {
                totalOffenders: offenders.length,
                totalOccurrences: offenders.reduce((sum, o) => sum + o.occurrenceCount, 0),
            },
            offenders,
            generatedAt: new Date(),
        };
    }
    calculateLatenesSeverity(count, threshold) {
        const ratio = count / threshold;
        if (ratio >= 3)
            return 'CRITICAL';
        if (ratio >= 2)
            return 'HIGH';
        if (ratio >= 1.5)
            return 'MEDIUM';
        return 'LOW';
    }
    async scheduleTimeDataBackup(currentUserId) {
        await this.logTimeManagementChange('BACKUP', { action: 'SCHEDULED' }, currentUserId);
        return { message: 'Time management backup scheduled.' };
    }
    async checkExpiringShiftAssignments(daysBeforeExpiry = 7, currentUserId) {
        const now = new Date();
        const expiryDate = new Date(now);
        expiryDate.setUTCDate(expiryDate.getUTCDate() + daysBeforeExpiry);
        const expiryDateUTC = this.convertDateToUTCEnd(expiryDate);
        const nowUTC = this.convertDateToUTCStart(now);
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
        const expiring = expiringAssignments.map((assignment) => {
            const endDate = assignment.endDate ? new Date(assignment.endDate) : null;
            const daysRemaining = endDate
                ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                : 0;
            return {
                assignmentId: assignment._id?.toString() || '',
                employeeId: assignment.employeeId?._id?.toString() || '',
                employeeName: assignment.employeeId
                    ? `${assignment.employeeId.firstName || ''} ${assignment.employeeId.lastName || ''}`.trim()
                    : 'Unknown',
                employeeEmail: assignment.employeeId?.email || '',
                employeeNumber: assignment.employeeId?.employeeNumber || '',
                shiftId: assignment.shiftId?._id?.toString() || '',
                shiftName: assignment.shiftId?.name || 'Unknown Shift',
                shiftTimes: assignment.shiftId
                    ? `${assignment.shiftId.startTime} - ${assignment.shiftId.endTime}`
                    : '',
                departmentId: assignment.departmentId?._id?.toString() || '',
                departmentName: assignment.departmentId?.name || '',
                positionId: assignment.positionId?._id?.toString() || '',
                positionName: assignment.positionId?.name || '',
                startDate: assignment.startDate,
                endDate: assignment.endDate,
                daysRemaining,
                status: assignment.status,
                urgency: daysRemaining <= 3 ? 'HIGH' : daysRemaining <= 5 ? 'MEDIUM' : 'LOW',
            };
        });
        expiring.sort((a, b) => a.daysRemaining - b.daysRemaining);
        await this.logTimeManagementChange('SHIFT_EXPIRY_SCAN', {
            count: expiring.length,
            daysBeforeExpiry,
            urgentCount: expiring.filter(e => e.urgency === 'HIGH').length,
        }, currentUserId);
        return {
            count: expiring.length,
            daysBeforeExpiry,
            summary: {
                highUrgency: expiring.filter(e => e.urgency === 'HIGH').length,
                mediumUrgency: expiring.filter(e => e.urgency === 'MEDIUM').length,
                lowUrgency: expiring.filter(e => e.urgency === 'LOW').length,
            },
            assignments: expiring,
        };
    }
    async getExpiredUnprocessedAssignments(currentUserId) {
        const now = new Date();
        const nowUTC = this.convertDateToUTCStart(now);
        const expiredAssignments = await this.shiftAssignmentModel
            .find({
            endDate: { $lt: nowUTC },
            status: 'APPROVED',
        })
            .populate('employeeId', 'firstName lastName email employeeNumber')
            .populate('shiftId', 'name')
            .exec();
        const expired = expiredAssignments.map((assignment) => {
            const endDate = assignment.endDate ? new Date(assignment.endDate) : null;
            const daysOverdue = endDate
                ? Math.ceil((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))
                : 0;
            return {
                assignmentId: assignment._id?.toString() || '',
                employeeId: assignment.employeeId?._id?.toString() || '',
                employeeName: assignment.employeeId
                    ? `${assignment.employeeId.firstName || ''} ${assignment.employeeId.lastName || ''}`.trim()
                    : 'Unknown',
                shiftName: assignment.shiftId?.name || 'Unknown Shift',
                endDate: assignment.endDate,
                daysOverdue,
            };
        });
        await this.logTimeManagementChange('EXPIRED_UNPROCESSED_SCAN', { count: expired.length }, currentUserId);
        return {
            count: expired.length,
            assignments: expired,
        };
    }
    async detectMissedPunches(currentUserId) {
        const now = new Date();
        const todayUTC = this.convertDateToUTCStart(now);
        const tomorrowUTC = new Date(todayUTC);
        tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1);
        const attendanceRecords = await this.attendanceRecordModel
            .find({
            createdAt: { $gte: todayUTC, $lt: tomorrowUTC },
        })
            .exec();
        const missedPunchRecords = [];
        for (const record of attendanceRecords) {
            if (record.punches.length === 0 || record.punches.length % 2 !== 0) {
                record.hasMissedPunch = true;
                record.updatedBy = currentUserId;
                await record.save();
                missedPunchRecords.push(record);
            }
        }
        return { count: missedPunchRecords.length, records: missedPunchRecords };
    }
    async escalateUnresolvedRequestsBeforePayroll(payrollCutOffDate, currentUserId) {
        const now = new Date();
        if (now >= payrollCutOffDate) {
            const pendingCorrections = await this.correctionRequestModel
                .find({
                status: { $in: ['SUBMITTED', 'IN_REVIEW'] },
            })
                .exec();
            const pendingExceptions = await this.timeExceptionModel
                .find({
                status: { $in: ['PENDING', 'OPEN'] },
            })
                .exec();
            const escalated = [];
            for (const correction of pendingCorrections) {
                await this.correctionRequestModel.findByIdAndUpdate(correction._id, {
                    status: enums_1.CorrectionRequestStatus.ESCALATED,
                    updatedBy: currentUserId,
                });
                escalated.push({ type: 'CORRECTION_REQUEST', id: correction._id });
            }
            for (const exception of pendingExceptions) {
                await this.timeExceptionModel.findByIdAndUpdate(exception._id, {
                    status: 'ESCALATED',
                    updatedBy: currentUserId,
                });
                escalated.push({ type: 'TIME_EXCEPTION', id: exception._id });
            }
            return { count: escalated.length, escalated };
        }
        return { count: 0, escalated: [] };
    }
    async generateOvertimeReport(generateOvertimeReportDto, currentUserId) {
        const { employeeId, startDate, endDate } = generateOvertimeReportDto;
        const query = {
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
        };
        if (employeeId) {
            query.employeeId = employeeId;
        }
        if (startDate && endDate) {
            const startDateUTC = this.convertDateToUTCStart(startDate);
            const endDateUTC = this.convertDateToUTCEnd(endDate);
            query.createdAt = { $gte: startDateUTC, $lte: endDateUTC };
        }
        const overtimeExceptions = await this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'name email')
            .populate('attendanceRecordId')
            .exec();
        const totalOvertimeMinutes = overtimeExceptions.reduce((total, exception) => {
            const record = exception.attendanceRecordId;
            if (record && record.totalWorkMinutes) {
                const standardMinutes = 480;
                const overtime = Math.max(0, record.totalWorkMinutes - standardMinutes);
                return total + overtime;
            }
            return total;
        }, 0);
        await this.logTimeManagementChange('OVERTIME_REPORT_GENERATED', {
            employeeId,
            startDate,
            endDate,
            count: overtimeExceptions.length,
            totalOvertimeMinutes,
        }, currentUserId);
        return {
            employeeId,
            startDate,
            endDate,
            records: overtimeExceptions,
            summary: {
                totalRecords: overtimeExceptions.length,
                totalOvertimeMinutes,
                totalOvertimeHours: Math.round((totalOvertimeMinutes / 60) * 100) / 100,
            },
        };
    }
    async generateLatenessReport(generateLatenessReportDto, currentUserId) {
        const { employeeId, startDate, endDate } = generateLatenessReportDto;
        const query = {
            type: enums_1.TimeExceptionType.LATE,
        };
        if (employeeId) {
            query.employeeId = employeeId;
        }
        if (startDate && endDate) {
            const startDateUTC = this.convertDateToUTCStart(startDate);
            const endDateUTC = this.convertDateToUTCEnd(endDate);
            query.createdAt = { $gte: startDateUTC, $lte: endDateUTC };
        }
        const latenessExceptions = await this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'name email')
            .populate('attendanceRecordId')
            .exec();
        await this.logTimeManagementChange('LATENESS_REPORT_GENERATED', {
            employeeId,
            startDate,
            endDate,
            count: latenessExceptions.length,
        }, currentUserId);
        return {
            employeeId,
            startDate,
            endDate,
            records: latenessExceptions,
            summary: {
                totalRecords: latenessExceptions.length,
                employees: [
                    ...new Set(latenessExceptions.map((e) => e.employeeId?._id?.toString())),
                ].length,
            },
        };
    }
    async generateExceptionReport(generateExceptionReportDto, currentUserId) {
        const { employeeId, startDate, endDate } = generateExceptionReportDto;
        const query = {};
        if (employeeId) {
            query.employeeId = employeeId;
        }
        if (startDate && endDate) {
            const startDateUTC = this.convertDateToUTCStart(startDate);
            const endDateUTC = this.convertDateToUTCEnd(endDate);
            query.createdAt = { $gte: startDateUTC, $lte: endDateUTC };
        }
        const exceptions = await this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'name email')
            .populate('attendanceRecordId')
            .exec();
        const byType = {};
        exceptions.forEach((exception) => {
            const type = exception.type;
            if (!byType[type]) {
                byType[type] = [];
            }
            byType[type].push(exception);
        });
        await this.logTimeManagementChange('EXCEPTION_REPORT_GENERATED', {
            employeeId,
            startDate,
            endDate,
            count: exceptions.length,
        }, currentUserId);
        return {
            employeeId,
            startDate,
            endDate,
            records: exceptions,
            summary: {
                totalRecords: exceptions.length,
                byType: Object.keys(byType).map((type) => ({
                    type,
                    count: byType[type].length,
                })),
            },
        };
    }
    async exportReport(exportReportDto, currentUserId) {
        let reportData;
        if (exportReportDto.reportType === 'overtime') {
            reportData = await this.generateOvertimeReport({
                employeeId: exportReportDto.employeeId,
                startDate: exportReportDto.startDate,
                endDate: exportReportDto.endDate,
            }, currentUserId);
        }
        else if (exportReportDto.reportType === 'lateness') {
            reportData = await this.generateLatenessReport({
                employeeId: exportReportDto.employeeId,
                startDate: exportReportDto.startDate,
                endDate: exportReportDto.endDate,
            }, currentUserId);
        }
        else if (exportReportDto.reportType === 'exception') {
            reportData = await this.generateExceptionReport({
                employeeId: exportReportDto.employeeId,
                startDate: exportReportDto.startDate,
                endDate: exportReportDto.endDate,
            }, currentUserId);
        }
        else {
            throw new Error('Invalid report type');
        }
        let formattedData;
        if (exportReportDto.format === 'csv') {
            formattedData = this.formatAsCSV(reportData);
        }
        else if (exportReportDto.format === 'text') {
            formattedData = this.formatAsText(reportData);
        }
        else {
            formattedData = JSON.stringify(reportData, null, 2);
        }
        await this.logTimeManagementChange('REPORT_EXPORTED', {
            reportType: exportReportDto.reportType,
            format: exportReportDto.format,
            employeeId: exportReportDto.employeeId,
        }, currentUserId);
        return {
            format: exportReportDto.format,
            data: formattedData,
            reportType: exportReportDto.reportType,
            generatedAt: new Date(),
        };
    }
    async logTimeManagementChange(entity, changeSet, actorId) {
        this.auditLogs.push({
            entity,
            changeSet,
            actorId,
            timestamp: new Date(),
        });
    }
    async logAttendanceChange(employeeId, action, payload, actorId) {
        await this.logTimeManagementChange('ATTENDANCE', { employeeId, action, ...payload }, actorId);
    }
    calculateWorkMinutesFromPunches(punches) {
        let totalMinutes = 0;
        for (let i = 0; i < punches.length; i += 2) {
            const inPunch = punches[i];
            const outPunch = punches[i + 1];
            if (inPunch && outPunch) {
                totalMinutes +=
                    (outPunch.time.getTime() - inPunch.time.getTime()) / 60000;
            }
        }
        return totalMinutes;
    }
    roundMinutes(value, interval, strategy) {
        if (interval <= 0) {
            return value;
        }
        if (strategy === 'NEAREST') {
            return Math.round(value / interval) * interval;
        }
        if (strategy === 'CEILING') {
            return Math.ceil(value / interval) * interval;
        }
        return Math.floor(value / interval) * interval;
    }
    timeStringToMinutes(time) {
        const [hours, minutes] = time
            .split(':')
            .map((value) => parseInt(value, 10));
        return hours * 60 + minutes;
    }
    dateToMinutes(date) {
        return date.getHours() * 60 + date.getMinutes();
    }
    dateToMinutesUTC(date) {
        return date.getUTCHours() * 60 + date.getUTCMinutes();
    }
    convertDateToUTCStart(date) {
        const dateObj = date instanceof Date ? date : new Date(date);
        return new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), 0, 0, 0, 0));
    }
    convertDateToUTCEnd(date) {
        const dateObj = date instanceof Date ? date : new Date(date);
        return new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), 23, 59, 59, 999));
    }
    formatAsCSV(data) {
        const lines = [];
        if (data.summary) {
            lines.push('Summary');
            Object.keys(data.summary).forEach((key) => {
                lines.push(`${key},${data.summary[key]}`);
            });
            lines.push('');
        }
        if (data.records && data.records.length > 0) {
            lines.push('Records');
            const firstRecord = data.records[0];
            const headers = Object.keys(firstRecord).join(',');
            lines.push(headers);
            data.records.forEach((record) => {
                const values = Object.values(record).map((v) => {
                    if (v && typeof v === 'object') {
                        return JSON.stringify(v);
                    }
                    return v || '';
                });
                lines.push(values.join(','));
            });
        }
        return lines.join('\n');
    }
    formatAsText(data) {
        const lines = [];
        lines.push(`Report Type: ${data.reportType || 'N/A'}`);
        lines.push(`Generated: ${new Date().toISOString()}`);
        if (data.startDate)
            lines.push(`Start Date: ${data.startDate}`);
        if (data.endDate)
            lines.push(`End Date: ${data.endDate}`);
        lines.push('');
        if (data.summary) {
            lines.push('Summary:');
            Object.keys(data.summary).forEach((key) => {
                lines.push(`  ${key}: ${data.summary[key]}`);
            });
            lines.push('');
        }
        if (data.records && data.records.length > 0) {
            lines.push(`Records (${data.records.length}):`);
            data.records.forEach((record, index) => {
                lines.push(`  Record ${index + 1}:`);
                Object.keys(record).forEach((key) => {
                    const value = record[key];
                    if (value && typeof value === 'object') {
                        lines.push(`    ${key}: ${JSON.stringify(value)}`);
                    }
                    else {
                        lines.push(`    ${key}: ${value || 'N/A'}`);
                    }
                });
                lines.push('');
            });
        }
        return lines.join('\n');
    }
    async generateAttendanceSummaryReport(params, currentUserId) {
        const { startDate, endDate, employeeId, departmentId, groupBy = 'day' } = params;
        const query = {
            date: { $gte: startDate, $lte: endDate },
        };
        if (employeeId) {
            query.employeeId = employeeId;
        }
        const attendanceRecords = await this.attendanceRecordModel
            .find(query)
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .sort({ date: 1 })
            .exec();
        const filteredRecords = departmentId
            ? attendanceRecords.filter((r) => r.employeeId?.departmentId?.toString() === departmentId)
            : attendanceRecords;
        const totalRecords = filteredRecords.length;
        const totalWorkMinutes = filteredRecords.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0);
        const avgWorkMinutes = totalRecords > 0 ? Math.round(totalWorkMinutes / totalRecords) : 0;
        const onTimeCount = filteredRecords.filter((r) => !r.isLate && r.clockIn).length;
        const lateCount = filteredRecords.filter((r) => r.isLate).length;
        const absentCount = filteredRecords.filter((r) => !r.clockIn).length;
        const earlyLeaveCount = filteredRecords.filter((r) => r.earlyLeave).length;
        const groupedData = this.groupAttendanceData(filteredRecords, groupBy);
        await this.logTimeManagementChange('ATTENDANCE_SUMMARY_REPORT_GENERATED', {
            startDate,
            endDate,
            employeeId,
            departmentId,
            groupBy,
            totalRecords,
        }, currentUserId);
        return {
            reportType: 'ATTENDANCE_SUMMARY',
            reportPeriod: { startDate, endDate },
            filters: { employeeId, departmentId, groupBy },
            summary: {
                totalRecords,
                totalWorkMinutes,
                totalWorkHours: Math.round((totalWorkMinutes / 60) * 100) / 100,
                avgWorkMinutesPerDay: avgWorkMinutes,
                avgWorkHoursPerDay: Math.round((avgWorkMinutes / 60) * 100) / 100,
                attendanceRate: totalRecords > 0
                    ? `${Math.round(((onTimeCount + lateCount) / totalRecords) * 100)}%`
                    : '0%',
            },
            breakdown: {
                onTime: onTimeCount,
                late: lateCount,
                absent: absentCount,
                earlyLeave: earlyLeaveCount,
            },
            groupedData,
            generatedAt: new Date(),
        };
    }
    groupAttendanceData(records, groupBy) {
        const groups = {};
        records.forEach((record) => {
            const date = new Date(record.date);
            let key;
            if (groupBy === 'day') {
                key = date.toISOString().split('T')[0];
            }
            else if (groupBy === 'week') {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = `Week of ${weekStart.toISOString().split('T')[0]}`;
            }
            else {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            if (!groups[key]) {
                groups[key] = { count: 0, totalMinutes: 0, lateCount: 0 };
            }
            groups[key].count += 1;
            groups[key].totalMinutes += record.totalWorkMinutes || 0;
            if (record.isLate)
                groups[key].lateCount += 1;
        });
        return Object.entries(groups).map(([period, data]) => ({
            period,
            recordCount: data.count,
            totalWorkMinutes: data.totalMinutes,
            avgWorkMinutes: data.count > 0 ? Math.round(data.totalMinutes / data.count) : 0,
            lateCount: data.lateCount,
            lateRate: data.count > 0 ? `${Math.round((data.lateCount / data.count) * 100)}%` : '0%',
        }));
    }
    async generateOvertimeCostAnalysis(params, currentUserId) {
        const { startDate, endDate, employeeId, departmentId, hourlyRate = 50, overtimeMultiplier = 1.5 } = params;
        const query = {
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
            createdAt: { $gte: startDate, $lte: endDate },
        };
        if (employeeId) {
            query.employeeId = employeeId;
        }
        const overtimeRecords = await this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .populate('attendanceRecordId')
            .exec();
        const filteredRecords = departmentId
            ? overtimeRecords.filter((r) => r.employeeId?.departmentId?.toString() === departmentId)
            : overtimeRecords;
        let totalOvertimeMinutes = 0;
        let approvedOvertimeMinutes = 0;
        const employeeOvertimeMap = {};
        filteredRecords.forEach((record) => {
            const attendanceRecord = record.attendanceRecordId;
            const overtimeMinutes = attendanceRecord?.totalWorkMinutes
                ? Math.max(0, attendanceRecord.totalWorkMinutes - 480)
                : 0;
            totalOvertimeMinutes += overtimeMinutes;
            if (record.status === enums_1.TimeExceptionStatus.APPROVED) {
                approvedOvertimeMinutes += overtimeMinutes;
            }
            const empId = record.employeeId?._id?.toString() || 'unknown';
            const empName = record.employeeId
                ? `${record.employeeId.firstName} ${record.employeeId.lastName}`
                : 'Unknown';
            if (!employeeOvertimeMap[empId]) {
                employeeOvertimeMap[empId] = { name: empName, minutes: 0, approved: 0 };
            }
            employeeOvertimeMap[empId].minutes += overtimeMinutes;
            if (record.status === enums_1.TimeExceptionStatus.APPROVED) {
                employeeOvertimeMap[empId].approved += overtimeMinutes;
            }
        });
        const totalOvertimeHours = totalOvertimeMinutes / 60;
        const approvedOvertimeHours = approvedOvertimeMinutes / 60;
        const estimatedCost = approvedOvertimeHours * hourlyRate * overtimeMultiplier;
        const topOvertimeEmployees = Object.entries(employeeOvertimeMap)
            .map(([id, data]) => ({
            employeeId: id,
            name: data.name,
            totalOvertimeMinutes: data.minutes,
            totalOvertimeHours: Math.round((data.minutes / 60) * 100) / 100,
            approvedMinutes: data.approved,
            estimatedCost: Math.round((data.approved / 60) * hourlyRate * overtimeMultiplier * 100) / 100,
        }))
            .sort((a, b) => b.totalOvertimeMinutes - a.totalOvertimeMinutes)
            .slice(0, 10);
        await this.logTimeManagementChange('OVERTIME_COST_ANALYSIS_GENERATED', {
            startDate,
            endDate,
            employeeId,
            departmentId,
            totalOvertimeMinutes,
            estimatedCost,
        }, currentUserId);
        return {
            reportType: 'OVERTIME_COST_ANALYSIS',
            reportPeriod: { startDate, endDate },
            filters: { employeeId, departmentId },
            rateConfig: { hourlyRate, overtimeMultiplier },
            summary: {
                totalOvertimeRequests: filteredRecords.length,
                approvedRequests: filteredRecords.filter(r => r.status === enums_1.TimeExceptionStatus.APPROVED).length,
                pendingRequests: filteredRecords.filter(r => r.status === enums_1.TimeExceptionStatus.OPEN || r.status === enums_1.TimeExceptionStatus.PENDING).length,
                totalOvertimeHours: Math.round(totalOvertimeHours * 100) / 100,
                approvedOvertimeHours: Math.round(approvedOvertimeHours * 100) / 100,
                estimatedCost: Math.round(estimatedCost * 100) / 100,
                currency: 'USD',
            },
            topOvertimeEmployees,
            generatedAt: new Date(),
        };
    }
    async generatePayrollReadyReport(params, currentUserId) {
        const { startDate, endDate, employeeIds, departmentId, includeExceptions = true, includePenalties = true, } = params;
        const attendanceQuery = {
            date: { $gte: startDate, $lte: endDate },
        };
        if (employeeIds && employeeIds.length > 0) {
            attendanceQuery.employeeId = { $in: employeeIds };
        }
        const attendanceRecords = await this.attendanceRecordModel
            .find(attendanceQuery)
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId basicSalary')
            .sort({ employeeId: 1, date: 1 })
            .exec();
        const filteredRecords = departmentId
            ? attendanceRecords.filter((r) => r.employeeId?.departmentId?.toString() === departmentId)
            : attendanceRecords;
        let exceptions = [];
        if (includeExceptions) {
            const exceptionQuery = {
                createdAt: { $gte: startDate, $lte: endDate },
                status: enums_1.TimeExceptionStatus.APPROVED,
            };
            if (employeeIds && employeeIds.length > 0) {
                exceptionQuery.employeeId = { $in: employeeIds };
            }
            exceptions = await this.timeExceptionModel
                .find(exceptionQuery)
                .populate('employeeId', 'firstName lastName employeeNumber')
                .exec();
        }
        const employeePayrollData = {};
        filteredRecords.forEach((record) => {
            const empId = record.employeeId?._id?.toString() || 'unknown';
            if (!employeePayrollData[empId]) {
                employeePayrollData[empId] = {
                    employee: record.employeeId,
                    workDays: 0,
                    totalWorkMinutes: 0,
                    regularMinutes: 0,
                    overtimeMinutes: 0,
                    lateDays: 0,
                    totalLateMinutes: 0,
                    earlyLeaveDays: 0,
                    absenceDays: 0,
                    exceptionsApproved: 0,
                    deductions: 0,
                };
            }
            const data = employeePayrollData[empId];
            const workMinutes = record.totalWorkMinutes || 0;
            const standardMinutes = 480;
            if (record.clockIn) {
                data.workDays += 1;
                data.totalWorkMinutes += workMinutes;
                data.regularMinutes += Math.min(workMinutes, standardMinutes);
                data.overtimeMinutes += Math.max(0, workMinutes - standardMinutes);
            }
            else {
                data.absenceDays += 1;
            }
            if (record.isLate) {
                data.lateDays += 1;
                data.totalLateMinutes += record.lateMinutes || 0;
            }
            if (record.earlyLeave) {
                data.earlyLeaveDays += 1;
            }
        });
        if (includeExceptions) {
            exceptions.forEach((exc) => {
                const empId = exc.employeeId?._id?.toString();
                if (empId && employeePayrollData[empId]) {
                    employeePayrollData[empId].exceptionsApproved += 1;
                }
            });
        }
        const payrollSummaries = Object.entries(employeePayrollData).map(([empId, data]) => ({
            employeeId: empId,
            employeeNumber: data.employee?.employeeNumber || 'N/A',
            employeeName: data.employee
                ? `${data.employee.firstName} ${data.employee.lastName}`
                : 'Unknown',
            email: data.employee?.email || 'N/A',
            attendance: {
                workDays: data.workDays,
                absenceDays: data.absenceDays,
                lateDays: data.lateDays,
                earlyLeaveDays: data.earlyLeaveDays,
            },
            hours: {
                totalWorkHours: Math.round((data.totalWorkMinutes / 60) * 100) / 100,
                regularHours: Math.round((data.regularMinutes / 60) * 100) / 100,
                overtimeHours: Math.round((data.overtimeMinutes / 60) * 100) / 100,
                lateHours: Math.round((data.totalLateMinutes / 60) * 100) / 100,
            },
            exceptions: {
                approvedCount: data.exceptionsApproved,
            },
            payrollReady: true,
        }));
        await this.logTimeManagementChange('PAYROLL_READY_REPORT_GENERATED', {
            startDate,
            endDate,
            employeeCount: payrollSummaries.length,
            totalWorkDays: payrollSummaries.reduce((sum, p) => sum + p.attendance.workDays, 0),
        }, currentUserId);
        return {
            reportType: 'PAYROLL_READY',
            reportPeriod: { startDate, endDate },
            filters: { employeeIds, departmentId, includeExceptions, includePenalties },
            meta: {
                employeeCount: payrollSummaries.length,
                totalRecords: filteredRecords.length,
                exceptionsIncluded: exceptions.length,
            },
            employees: payrollSummaries,
            generatedAt: new Date(),
            generatedBy: currentUserId,
        };
    }
    async generateDisciplinarySummaryReport(params, currentUserId) {
        const { startDate, endDate, departmentId, severityFilter } = params;
        const latenessQuery = {
            type: enums_1.TimeExceptionType.LATE,
            createdAt: { $gte: startDate, $lte: endDate },
        };
        const latenessExceptions = await this.timeExceptionModel
            .find(latenessQuery)
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .exec();
        const filteredExceptions = departmentId
            ? latenessExceptions.filter((e) => e.employeeId?.departmentId?.toString() === departmentId)
            : latenessExceptions;
        const employeeOffenses = {};
        filteredExceptions.forEach((exc) => {
            const empId = exc.employeeId?._id?.toString() || 'unknown';
            if (!employeeOffenses[empId]) {
                employeeOffenses[empId] = {
                    employee: exc.employeeId,
                    totalLateness: 0,
                    escalated: 0,
                    warnings: 0,
                };
            }
            employeeOffenses[empId].totalLateness += 1;
            if (exc.status === enums_1.TimeExceptionStatus.ESCALATED) {
                employeeOffenses[empId].escalated += 1;
            }
            if (exc.reason?.toLowerCase().includes('warning')) {
                employeeOffenses[empId].warnings += 1;
            }
        });
        const disciplinaryThreshold = 5;
        const employeesRequiringAction = Object.entries(employeeOffenses)
            .filter(([, data]) => data.totalLateness >= disciplinaryThreshold)
            .map(([empId, data]) => ({
            employeeId: empId,
            employeeName: data.employee
                ? `${data.employee.firstName} ${data.employee.lastName}`
                : 'Unknown',
            employeeNumber: data.employee?.employeeNumber || 'N/A',
            totalOffenses: data.totalLateness,
            escalatedCount: data.escalated,
            warningCount: data.warnings,
            recommendedAction: data.totalLateness >= 10
                ? 'FINAL_WARNING'
                : data.totalLateness >= 7
                    ? 'WRITTEN_WARNING'
                    : 'VERBAL_WARNING',
        }))
            .sort((a, b) => b.totalOffenses - a.totalOffenses);
        const totalEmployeesWithIssues = Object.keys(employeeOffenses).length;
        const totalLatenessIncidents = filteredExceptions.length;
        const totalEscalations = filteredExceptions.filter(e => e.status === enums_1.TimeExceptionStatus.ESCALATED).length;
        await this.logTimeManagementChange('DISCIPLINARY_SUMMARY_REPORT_GENERATED', {
            startDate,
            endDate,
            departmentId,
            totalEmployeesWithIssues,
            employeesRequiringAction: employeesRequiringAction.length,
        }, currentUserId);
        return {
            reportType: 'DISCIPLINARY_SUMMARY',
            reportPeriod: { startDate, endDate },
            filters: { departmentId, severityFilter },
            summary: {
                totalEmployeesWithIssues,
                totalLatenessIncidents,
                totalEscalations,
                employeesRequiringAction: employeesRequiringAction.length,
                escalationRate: totalLatenessIncidents > 0
                    ? `${Math.round((totalEscalations / totalLatenessIncidents) * 100)}%`
                    : '0%',
            },
            thresholds: {
                disciplinaryThreshold,
                verbalWarningAt: 5,
                writtenWarningAt: 7,
                finalWarningAt: 10,
            },
            employeesRequiringAction,
            generatedAt: new Date(),
        };
    }
    async getTimeManagementAnalyticsDashboard(params, currentUserId) {
        const { startDate, endDate, departmentId } = params;
        const attendanceQuery = {
            date: { $gte: startDate, $lte: endDate },
        };
        const attendanceRecords = await this.attendanceRecordModel
            .find(attendanceQuery)
            .populate('employeeId', 'departmentId')
            .exec();
        const filteredAttendance = departmentId
            ? attendanceRecords.filter((r) => r.employeeId?.departmentId?.toString() === departmentId)
            : attendanceRecords;
        const exceptionQuery = {
            createdAt: { $gte: startDate, $lte: endDate },
        };
        const exceptions = await this.timeExceptionModel.find(exceptionQuery).exec();
        const filteredExceptions = departmentId
            ? exceptions.filter((e) => {
                return true;
            })
            : exceptions;
        const totalAttendance = filteredAttendance.length;
        const presentCount = filteredAttendance.filter((r) => r.clockIn).length;
        const lateCount = filteredAttendance.filter((r) => r.isLate).length;
        const absentCount = totalAttendance - presentCount;
        const exceptionsByType = {};
        filteredExceptions.forEach((exc) => {
            const type = exc.type;
            exceptionsByType[type] = (exceptionsByType[type] || 0) + 1;
        });
        const exceptionsByStatus = {};
        filteredExceptions.forEach((exc) => {
            const status = exc.status;
            exceptionsByStatus[status] = (exceptionsByStatus[status] || 0) + 1;
        });
        const totalWorkMinutes = filteredAttendance.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0);
        const totalOvertimeMinutes = filteredAttendance.reduce((sum, r) => {
            const work = r.totalWorkMinutes || 0;
            return sum + Math.max(0, work - 480);
        }, 0);
        return {
            reportType: 'ANALYTICS_DASHBOARD',
            reportPeriod: { startDate, endDate },
            filters: { departmentId },
            attendance: {
                total: totalAttendance,
                present: presentCount,
                absent: absentCount,
                late: lateCount,
                attendanceRate: totalAttendance > 0
                    ? `${Math.round((presentCount / totalAttendance) * 100)}%`
                    : '0%',
                punctualityRate: presentCount > 0
                    ? `${Math.round(((presentCount - lateCount) / presentCount) * 100)}%`
                    : '0%',
            },
            workHours: {
                totalHours: Math.round((totalWorkMinutes / 60) * 100) / 100,
                regularHours: Math.round(((totalWorkMinutes - totalOvertimeMinutes) / 60) * 100) / 100,
                overtimeHours: Math.round((totalOvertimeMinutes / 60) * 100) / 100,
                avgHoursPerDay: totalAttendance > 0
                    ? Math.round((totalWorkMinutes / totalAttendance / 60) * 100) / 100
                    : 0,
            },
            exceptions: {
                total: filteredExceptions.length,
                byType: Object.entries(exceptionsByType).map(([type, count]) => ({ type, count })),
                byStatus: Object.entries(exceptionsByStatus).map(([status, count]) => ({ status, count })),
                pendingCount: (exceptionsByStatus['OPEN'] || 0) + (exceptionsByStatus['PENDING'] || 0),
                escalatedCount: exceptionsByStatus['ESCALATED'] || 0,
            },
            trends: {
                attendanceTrend: presentCount / totalAttendance > 0.9 ? 'POSITIVE' : 'NEEDS_ATTENTION',
                latenessTrend: lateCount / presentCount < 0.1 ? 'POSITIVE' : 'NEEDS_ATTENTION',
                overtimeTrend: totalOvertimeMinutes / totalWorkMinutes < 0.1 ? 'NORMAL' : 'HIGH',
            },
            generatedAt: new Date(),
        };
    }
    async getLatenessLogs(params, currentUserId) {
        const { startDate, endDate, employeeId, departmentId, includeResolved = true, sortBy = 'date', sortOrder = 'desc', } = params;
        const query = {
            type: enums_1.TimeExceptionType.LATE,
            createdAt: { $gte: startDate, $lte: endDate },
        };
        if (employeeId) {
            query.employeeId = employeeId;
        }
        if (!includeResolved) {
            query.status = { $nin: [enums_1.TimeExceptionStatus.RESOLVED, enums_1.TimeExceptionStatus.REJECTED] };
        }
        const latenessRecords = await this.timeExceptionModel
            .find(query)
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .populate('attendanceRecordId')
            .populate('assignedTo', 'firstName lastName')
            .exec();
        const filteredRecords = departmentId
            ? latenessRecords.filter((r) => r.employeeId?.departmentId?.toString() === departmentId)
            : latenessRecords;
        const logEntries = filteredRecords.map((record) => {
            const attendance = record.attendanceRecordId;
            return {
                logId: record._id,
                date: record.createdAt,
                employee: record.employeeId ? {
                    id: record.employeeId._id,
                    name: `${record.employeeId.firstName} ${record.employeeId.lastName}`,
                    employeeNumber: record.employeeId.employeeNumber,
                    email: record.employeeId.email,
                } : null,
                lateness: {
                    scheduledStart: attendance?.scheduledStartTime || null,
                    actualStart: attendance?.clockIn || null,
                    lateMinutes: attendance?.lateMinutes || 0,
                    lateHours: Math.round((attendance?.lateMinutes || 0) / 60 * 100) / 100,
                },
                status: record.status,
                reason: record.reason,
                assignedTo: record.assignedTo ? {
                    id: record.assignedTo._id,
                    name: `${record.assignedTo.firstName} ${record.assignedTo.lastName}`,
                } : null,
                penalty: {
                    hasPenalty: attendance?.penaltyAmount > 0,
                    amount: attendance?.penaltyAmount || 0,
                    type: attendance?.penaltyType || null,
                },
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
            };
        });
        logEntries.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            }
            else if (sortBy === 'employee') {
                comparison = (a.employee?.name || '').localeCompare(b.employee?.name || '');
            }
            else if (sortBy === 'duration') {
                comparison = a.lateness.lateMinutes - b.lateness.lateMinutes;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });
        const totalLateMinutes = logEntries.reduce((sum, e) => sum + e.lateness.lateMinutes, 0);
        const uniqueEmployees = [...new Set(logEntries.map(e => e.employee?.id?.toString()))].length;
        const avgLateMinutes = logEntries.length > 0
            ? Math.round(totalLateMinutes / logEntries.length)
            : 0;
        const statusBreakdown = {};
        logEntries.forEach(e => {
            statusBreakdown[e.status] = (statusBreakdown[e.status] || 0) + 1;
        });
        const withPenalty = logEntries.filter(e => e.penalty.hasPenalty);
        const totalPenaltyAmount = withPenalty.reduce((sum, e) => sum + e.penalty.amount, 0);
        await this.logTimeManagementChange('LATENESS_LOGS_ACCESSED', {
            startDate,
            endDate,
            employeeId,
            departmentId,
            totalRecords: logEntries.length,
        }, currentUserId);
        return {
            reportType: 'LATENESS_LOGS',
            reportPeriod: { startDate, endDate },
            filters: { employeeId, departmentId, includeResolved, sortBy, sortOrder },
            summary: {
                totalIncidents: logEntries.length,
                uniqueEmployees,
                totalLateMinutes,
                totalLateHours: Math.round(totalLateMinutes / 60 * 100) / 100,
                avgLateMinutes,
                statusBreakdown: Object.entries(statusBreakdown).map(([status, count]) => ({ status, count })),
                penaltyStats: {
                    incidentsWithPenalty: withPenalty.length,
                    totalPenaltyAmount: Math.round(totalPenaltyAmount * 100) / 100,
                },
            },
            logs: logEntries,
            generatedAt: new Date(),
            accessedBy: currentUserId,
        };
    }
    async generateOvertimeAndExceptionComplianceReport(params, currentUserId) {
        const { startDate, endDate, employeeId, departmentId, includeAllExceptionTypes = true, } = params;
        const overtimeQuery = {
            type: enums_1.TimeExceptionType.OVERTIME_REQUEST,
            createdAt: { $gte: startDate, $lte: endDate },
        };
        if (employeeId) {
            overtimeQuery.employeeId = employeeId;
        }
        const overtimeRecords = await this.timeExceptionModel
            .find(overtimeQuery)
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .populate('attendanceRecordId')
            .exec();
        let otherExceptions = [];
        if (includeAllExceptionTypes) {
            const exceptionQuery = {
                type: { $ne: enums_1.TimeExceptionType.OVERTIME_REQUEST },
                createdAt: { $gte: startDate, $lte: endDate },
            };
            if (employeeId) {
                exceptionQuery.employeeId = employeeId;
            }
            otherExceptions = await this.timeExceptionModel
                .find(exceptionQuery)
                .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
                .exec();
        }
        const filteredOvertime = departmentId
            ? overtimeRecords.filter((r) => r.employeeId?.departmentId?.toString() === departmentId)
            : overtimeRecords;
        const filteredExceptions = departmentId
            ? otherExceptions.filter((r) => r.employeeId?.departmentId?.toString() === departmentId)
            : otherExceptions;
        const overtimeSummary = {
            totalRequests: filteredOvertime.length,
            approved: filteredOvertime.filter(r => r.status === enums_1.TimeExceptionStatus.APPROVED).length,
            pending: filteredOvertime.filter(r => r.status === enums_1.TimeExceptionStatus.OPEN || r.status === enums_1.TimeExceptionStatus.PENDING).length,
            rejected: filteredOvertime.filter(r => r.status === enums_1.TimeExceptionStatus.REJECTED).length,
            totalOvertimeMinutes: 0,
            approvedOvertimeMinutes: 0,
        };
        filteredOvertime.forEach((record) => {
            const attendance = record.attendanceRecordId;
            const overtimeMinutes = attendance?.totalWorkMinutes
                ? Math.max(0, attendance.totalWorkMinutes - 480)
                : 0;
            overtimeSummary.totalOvertimeMinutes += overtimeMinutes;
            if (record.status === enums_1.TimeExceptionStatus.APPROVED) {
                overtimeSummary.approvedOvertimeMinutes += overtimeMinutes;
            }
        });
        const exceptionsByType = {};
        filteredExceptions.forEach((exc) => {
            const type = exc.type;
            if (!exceptionsByType[type]) {
                exceptionsByType[type] = { count: 0, approved: 0, pending: 0 };
            }
            exceptionsByType[type].count += 1;
            if (exc.status === enums_1.TimeExceptionStatus.APPROVED) {
                exceptionsByType[type].approved += 1;
            }
            if (exc.status === enums_1.TimeExceptionStatus.OPEN || exc.status === enums_1.TimeExceptionStatus.PENDING) {
                exceptionsByType[type].pending += 1;
            }
        });
        const complianceIndicators = {
            overtimeApprovalRate: overtimeSummary.totalRequests > 0
                ? Math.round((overtimeSummary.approved / overtimeSummary.totalRequests) * 100)
                : 0,
            pendingRequiresAction: overtimeSummary.pending > 0 ||
                Object.values(exceptionsByType).some(e => e.pending > 0),
            avgOvertimeHoursPerRequest: overtimeSummary.totalRequests > 0
                ? Math.round((overtimeSummary.totalOvertimeMinutes / overtimeSummary.totalRequests / 60) * 100) / 100
                : 0,
            complianceStatus: overtimeSummary.pending === 0 ? 'COMPLIANT' : 'PENDING_REVIEW',
        };
        const employeeOvertimeMap = {};
        filteredOvertime.forEach((record) => {
            const empId = record.employeeId?._id?.toString() || 'unknown';
            const empName = record.employeeId
                ? `${record.employeeId.firstName} ${record.employeeId.lastName}`
                : 'Unknown';
            const attendance = record.attendanceRecordId;
            const overtimeMinutes = attendance?.totalWorkMinutes
                ? Math.max(0, attendance.totalWorkMinutes - 480)
                : 0;
            if (!employeeOvertimeMap[empId]) {
                employeeOvertimeMap[empId] = { name: empName, minutes: 0 };
            }
            employeeOvertimeMap[empId].minutes += overtimeMinutes;
        });
        const topOvertimeEmployees = Object.entries(employeeOvertimeMap)
            .map(([id, data]) => ({
            employeeId: id,
            name: data.name,
            totalOvertimeHours: Math.round((data.minutes / 60) * 100) / 100,
        }))
            .sort((a, b) => b.totalOvertimeHours - a.totalOvertimeHours)
            .slice(0, 10);
        await this.logTimeManagementChange('OVERTIME_EXCEPTION_COMPLIANCE_REPORT_GENERATED', {
            startDate,
            endDate,
            employeeId,
            departmentId,
            overtimeCount: overtimeSummary.totalRequests,
            exceptionCount: filteredExceptions.length,
        }, currentUserId);
        return {
            reportType: 'OVERTIME_AND_EXCEPTION_COMPLIANCE',
            reportPeriod: { startDate, endDate },
            filters: { employeeId, departmentId, includeAllExceptionTypes },
            overtime: {
                summary: {
                    ...overtimeSummary,
                    totalOvertimeHours: Math.round((overtimeSummary.totalOvertimeMinutes / 60) * 100) / 100,
                    approvedOvertimeHours: Math.round((overtimeSummary.approvedOvertimeMinutes / 60) * 100) / 100,
                },
                topEmployees: topOvertimeEmployees,
            },
            exceptions: {
                totalCount: filteredExceptions.length,
                byType: Object.entries(exceptionsByType).map(([type, data]) => ({
                    type,
                    ...data,
                })),
            },
            compliance: complianceIndicators,
            payrollReadiness: {
                isReady: complianceIndicators.complianceStatus === 'COMPLIANT',
                pendingItems: overtimeSummary.pending +
                    Object.values(exceptionsByType).reduce((sum, e) => sum + e.pending, 0),
                message: complianceIndicators.complianceStatus === 'COMPLIANT'
                    ? 'All overtime and exception requests have been processed. Ready for payroll.'
                    : 'Pending requests require review before payroll processing.',
            },
            generatedAt: new Date(),
            generatedBy: currentUserId,
        };
    }
    async getEmployeeAttendanceHistory(params, currentUserId) {
        const { employeeId, startDate, endDate, includeExceptions = true, includeOvertime = true, } = params;
        const attendanceRecords = await this.attendanceRecordModel
            .find({
            employeeId,
            date: { $gte: startDate, $lte: endDate },
        })
            .populate('employeeId', 'firstName lastName email employeeNumber departmentId')
            .sort({ date: 1 })
            .exec();
        let exceptions = [];
        if (includeExceptions) {
            exceptions = await this.timeExceptionModel
                .find({
                employeeId,
                createdAt: { $gte: startDate, $lte: endDate },
            })
                .exec();
        }
        const firstRecord = attendanceRecords[0];
        const employeeData = firstRecord?.employeeId;
        const dailyRecords = attendanceRecords.map((record) => {
            const dayExceptions = exceptions.filter((exc) => {
                const excDate = new Date(exc.createdAt);
                const recDate = new Date(record.date);
                return excDate.toDateString() === recDate.toDateString();
            });
            const overtimeMinutes = record.totalWorkMinutes
                ? Math.max(0, record.totalWorkMinutes - 480)
                : 0;
            return {
                date: record.date,
                clockIn: record.clockIn,
                clockOut: record.clockOut,
                totalWorkMinutes: record.totalWorkMinutes || 0,
                totalWorkHours: Math.round((record.totalWorkMinutes || 0) / 60 * 100) / 100,
                regularHours: Math.min((record.totalWorkMinutes || 0), 480) / 60,
                overtime: {
                    hasOvertime: overtimeMinutes > 0,
                    minutes: overtimeMinutes,
                    hours: Math.round((overtimeMinutes / 60) * 100) / 100,
                },
                status: {
                    isPresent: !!record.clockIn,
                    isLate: record.isLate || false,
                    lateMinutes: record.lateMinutes || 0,
                    earlyLeave: record.earlyLeave || false,
                },
                exceptions: dayExceptions.map((exc) => ({
                    id: exc._id,
                    type: exc.type,
                    status: exc.status,
                    reason: exc.reason,
                })),
                penalties: {
                    hasPenalty: (record.penaltyAmount || 0) > 0,
                    amount: record.penaltyAmount || 0,
                },
            };
        });
        const summary = {
            totalDays: dailyRecords.length,
            presentDays: dailyRecords.filter(r => r.status.isPresent).length,
            absentDays: dailyRecords.filter(r => !r.status.isPresent).length,
            lateDays: dailyRecords.filter(r => r.status.isLate).length,
            earlyLeaveDays: dailyRecords.filter(r => r.status.earlyLeave).length,
            totalWorkHours: Math.round(dailyRecords.reduce((sum, r) => sum + r.totalWorkHours, 0) * 100) / 100,
            totalOvertimeHours: Math.round(dailyRecords.reduce((sum, r) => sum + r.overtime.hours, 0) * 100) / 100,
            totalLateMinutes: dailyRecords.reduce((sum, r) => sum + r.status.lateMinutes, 0),
            totalExceptions: exceptions.length,
            totalPenalties: Math.round(dailyRecords.reduce((sum, r) => sum + r.penalties.amount, 0) * 100) / 100,
        };
        const attendanceRate = summary.totalDays > 0
            ? Math.round((summary.presentDays / summary.totalDays) * 100)
            : 0;
        const punctualityRate = summary.presentDays > 0
            ? Math.round(((summary.presentDays - summary.lateDays) / summary.presentDays) * 100)
            : 0;
        await this.logTimeManagementChange('EMPLOYEE_ATTENDANCE_HISTORY_ACCESSED', {
            employeeId,
            startDate,
            endDate,
            totalRecords: dailyRecords.length,
        }, currentUserId);
        return {
            reportType: 'EMPLOYEE_ATTENDANCE_HISTORY',
            reportPeriod: { startDate, endDate },
            employee: employeeData ? {
                id: employeeData._id || employeeId,
                name: employeeData.firstName && employeeData.lastName
                    ? `${employeeData.firstName} ${employeeData.lastName}`
                    : 'Unknown',
                employeeNumber: employeeData.employeeNumber || 'N/A',
                email: employeeData.email || 'N/A',
            } : {
                id: employeeId,
                name: 'Unknown',
                employeeNumber: 'N/A',
                email: 'N/A',
            },
            summary: {
                ...summary,
                attendanceRate: `${attendanceRate}%`,
                punctualityRate: `${punctualityRate}%`,
                avgWorkHoursPerDay: summary.presentDays > 0
                    ? Math.round((summary.totalWorkHours / summary.presentDays) * 100) / 100
                    : 0,
            },
            records: dailyRecords,
            generatedAt: new Date(),
            accessedBy: currentUserId,
        };
    }
    async exportOvertimeExceptionReport(params, currentUserId) {
        const { startDate, endDate, employeeId, departmentId, format } = params;
        const reportData = await this.generateOvertimeAndExceptionComplianceReport({ startDate, endDate, employeeId, departmentId, includeAllExceptionTypes: true }, currentUserId);
        let formattedData;
        if (format === 'csv') {
            formattedData = this.formatOvertimeExceptionAsCSV(reportData);
        }
        else if (format === 'text') {
            formattedData = this.formatOvertimeExceptionAsText(reportData);
        }
        else {
            formattedData = JSON.stringify(reportData, null, 2);
        }
        await this.logTimeManagementChange('OVERTIME_EXCEPTION_REPORT_EXPORTED', {
            startDate,
            endDate,
            employeeId,
            departmentId,
            format,
        }, currentUserId);
        return {
            exportType: 'OVERTIME_AND_EXCEPTION_REPORT',
            format,
            data: formattedData,
            reportPeriod: { startDate, endDate },
            generatedAt: new Date(),
            exportedBy: currentUserId,
        };
    }
    formatOvertimeExceptionAsCSV(data) {
        const lines = [];
        lines.push('OVERTIME AND EXCEPTION COMPLIANCE REPORT');
        lines.push(`Report Period,${data.reportPeriod.startDate},${data.reportPeriod.endDate}`);
        lines.push('');
        lines.push('OVERTIME SUMMARY');
        lines.push('Metric,Value');
        lines.push(`Total Requests,${data.overtime.summary.totalRequests}`);
        lines.push(`Approved,${data.overtime.summary.approved}`);
        lines.push(`Pending,${data.overtime.summary.pending}`);
        lines.push(`Rejected,${data.overtime.summary.rejected}`);
        lines.push(`Total Overtime Hours,${data.overtime.summary.totalOvertimeHours}`);
        lines.push(`Approved Overtime Hours,${data.overtime.summary.approvedOvertimeHours}`);
        lines.push('');
        lines.push('TOP OVERTIME EMPLOYEES');
        lines.push('Employee ID,Name,Overtime Hours');
        data.overtime.topEmployees.forEach((emp) => {
            lines.push(`${emp.employeeId},${emp.name},${emp.totalOvertimeHours}`);
        });
        lines.push('');
        lines.push('EXCEPTION SUMMARY BY TYPE');
        lines.push('Type,Count,Approved,Pending');
        data.exceptions.byType.forEach((exc) => {
            lines.push(`${exc.type},${exc.count},${exc.approved},${exc.pending}`);
        });
        lines.push('');
        lines.push('COMPLIANCE STATUS');
        lines.push(`Status,${data.compliance.complianceStatus}`);
        lines.push(`Payroll Ready,${data.payrollReadiness.isReady ? 'YES' : 'NO'}`);
        lines.push(`Pending Items,${data.payrollReadiness.pendingItems}`);
        return lines.join('\n');
    }
    formatOvertimeExceptionAsText(data) {
        const lines = [];
        lines.push('='.repeat(60));
        lines.push('OVERTIME AND EXCEPTION COMPLIANCE REPORT');
        lines.push('='.repeat(60));
        lines.push(`Report Period: ${data.reportPeriod.startDate} to ${data.reportPeriod.endDate}`);
        lines.push(`Generated: ${data.generatedAt}`);
        lines.push('');
        lines.push('-'.repeat(40));
        lines.push('OVERTIME SUMMARY');
        lines.push('-'.repeat(40));
        lines.push(`  Total Requests: ${data.overtime.summary.totalRequests}`);
        lines.push(`  Approved: ${data.overtime.summary.approved}`);
        lines.push(`  Pending: ${data.overtime.summary.pending}`);
        lines.push(`  Rejected: ${data.overtime.summary.rejected}`);
        lines.push(`  Total Overtime Hours: ${data.overtime.summary.totalOvertimeHours}`);
        lines.push(`  Approved Overtime Hours: ${data.overtime.summary.approvedOvertimeHours}`);
        lines.push('');
        lines.push('-'.repeat(40));
        lines.push('TOP OVERTIME EMPLOYEES');
        lines.push('-'.repeat(40));
        data.overtime.topEmployees.forEach((emp, idx) => {
            lines.push(`  ${idx + 1}. ${emp.name}: ${emp.totalOvertimeHours} hours`);
        });
        lines.push('');
        lines.push('-'.repeat(40));
        lines.push('EXCEPTION SUMMARY');
        lines.push('-'.repeat(40));
        lines.push(`  Total Exceptions: ${data.exceptions.totalCount}`);
        data.exceptions.byType.forEach((exc) => {
            lines.push(`  ${exc.type}: ${exc.count} (Approved: ${exc.approved}, Pending: ${exc.pending})`);
        });
        lines.push('');
        lines.push('-'.repeat(40));
        lines.push('COMPLIANCE STATUS');
        lines.push('-'.repeat(40));
        lines.push(`  Status: ${data.compliance.complianceStatus}`);
        lines.push(`  Overtime Approval Rate: ${data.compliance.overtimeApprovalRate}%`);
        lines.push(`  Payroll Ready: ${data.payrollReadiness.isReady ? 'YES' : 'NO'}`);
        lines.push(`  Pending Items: ${data.payrollReadiness.pendingItems}`);
        lines.push(`  Message: ${data.payrollReadiness.message}`);
        lines.push('');
        lines.push('='.repeat(60));
        return lines.join('\n');
    }
};
exports.TimeManagementService = TimeManagementService;
exports.TimeManagementService = TimeManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attendance_record_schema_1.AttendanceRecord.name)),
    __param(1, (0, mongoose_1.InjectModel)(attendance_correction_request_schema_1.AttendanceCorrectionRequest.name)),
    __param(2, (0, mongoose_1.InjectModel)(time_exception_schema_1.TimeException.name)),
    __param(3, (0, mongoose_1.InjectModel)(shift_assignment_schema_1.ShiftAssignment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TimeManagementService);
//# sourceMappingURL=time-management.service.js.map