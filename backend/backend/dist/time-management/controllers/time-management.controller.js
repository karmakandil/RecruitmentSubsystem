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
exports.TimeManagementController = void 0;
const common_1 = require("@nestjs/common");
const time_management_service_1 = require("../services/time-management.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const employee_profile_enums_1 = require("../../employee-profile/enums/employee-profile.enums");
const attendance_dtos_1 = require("../DTOs/attendance.dtos");
const time_permission_dtos_1 = require("../DTOs/time-permission.dtos");
const reporting_dtos_1 = require("../DTOs/reporting.dtos");
let TimeManagementController = class TimeManagementController {
    constructor(timeManagementService) {
        this.timeManagementService = timeManagementService;
    }
    async clockInWithID(employeeId, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.clockInWithID(employeeId, user.userId);
    }
    async clockOutWithID(employeeId, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.clockOutWithID(employeeId, user.userId);
    }
    async clockInWithMetadata(employeeId, body, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.clockInWithMetadata(employeeId, body, user.userId);
    }
    async clockOutWithMetadata(employeeId, body, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.clockOutWithMetadata(employeeId, body, user.userId);
    }
    async validateClockInAgainstShift(employeeId, user) {
        return this.timeManagementService.validateClockInAgainstShift(employeeId, user.userId);
    }
    async getEmployeeAttendanceStatus(employeeId, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            !user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD) &&
            user.userId !== employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.getEmployeeAttendanceStatus(employeeId, user.userId);
    }
    async createAttendanceRecord(createAttendanceRecordDto, user) {
        return this.timeManagementService.createAttendanceRecord(createAttendanceRecordDto, user.userId);
    }
    async updateAttendanceRecord(id, updateAttendanceRecordDto, user) {
        return this.timeManagementService.updateAttendanceRecord(id, updateAttendanceRecordDto, user.userId);
    }
    async submitAttendanceCorrectionRequest(submitCorrectionRequestDto, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== submitCorrectionRequestDto.employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.submitAttendanceCorrectionRequest(submitCorrectionRequestDto, user.userId);
    }
    async recordPunchWithMetadata(recordPunchWithMetadataDto, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== recordPunchWithMetadataDto.employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.recordPunchWithMetadata(recordPunchWithMetadataDto, user.userId);
    }
    async recordPunchFromDevice(recordPunchWithMetadataDto, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== recordPunchWithMetadataDto.employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.recordPunchFromDevice(recordPunchWithMetadataDto, user.userId);
    }
    async enforcePunchPolicy(enforcePunchPolicyDto, user) {
        return this.timeManagementService.enforcePunchPolicy(enforcePunchPolicyDto, user.userId);
    }
    async applyAttendanceRounding(applyAttendanceRoundingDto, user) {
        return this.timeManagementService.applyAttendanceRounding(applyAttendanceRoundingDto, user.userId);
    }
    async enforceShiftPunchPolicy(enforceShiftPunchPolicyDto, user) {
        return this.timeManagementService.enforceShiftPunchPolicy(enforceShiftPunchPolicyDto, user.userId);
    }
    async submitCorrectionRequest(body, user) {
        return this.timeManagementService.submitAttendanceCorrectionRequest({
            employeeId: body.employeeId,
            attendanceRecord: body.attendanceRecord,
            reason: body.reason,
        }, user.userId);
    }
    async getCorrectionRequestsByEmployee(employeeId, status, startDate, endDate, user) {
        return this.timeManagementService.getCorrectionRequestsByEmployee({
            employeeId,
            status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        }, user.userId);
    }
    async getCorrectionRequestById(requestId, user) {
        return this.timeManagementService.getCorrectionRequestById(requestId, user.userId);
    }
    async getAllCorrectionRequests(status, employeeId, user) {
        return this.timeManagementService.getAllCorrectionRequests({ status, employeeId }, user.userId);
    }
    async getPendingCorrectionRequestsForManager(managerId, departmentId, limit, user) {
        return this.timeManagementService.getPendingCorrectionRequestsForManager({
            managerId,
            departmentId,
            limit: limit ? Number(limit) : undefined,
        }, user.userId);
    }
    async markCorrectionRequestInReview(requestId, user) {
        return this.timeManagementService.markCorrectionRequestInReview(requestId, user.userId);
    }
    async approveCorrectionRequest(requestId, body, user) {
        return this.timeManagementService.approveCorrectionRequest({
            correctionRequestId: requestId,
            reason: body.reason,
        }, user.userId);
    }
    async rejectCorrectionRequest(requestId, body, user) {
        return this.timeManagementService.rejectCorrectionRequest({
            correctionRequestId: requestId,
            reason: body.reason,
        }, user.userId);
    }
    async escalateCorrectionRequest(requestId, body, user) {
        return this.timeManagementService.escalateCorrectionRequest({
            requestId,
            escalateTo: body.escalateTo,
            reason: body.reason,
        }, user.userId);
    }
    async cancelCorrectionRequest(requestId, body, user) {
        return this.timeManagementService.cancelCorrectionRequest({
            requestId,
            reason: body.reason,
        }, user.userId);
    }
    async getCorrectionRequestStatistics(startDate, endDate, departmentId, user) {
        return this.timeManagementService.getCorrectionRequestStatistics({
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            departmentId,
        }, user.userId);
    }
    async createTimeException(createTimeExceptionDto, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== createTimeExceptionDto.employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.createTimeException(createTimeExceptionDto, user.userId);
    }
    async updateTimeException(id, updateTimeExceptionDto, user) {
        return this.timeManagementService.updateTimeException(id, updateTimeExceptionDto, user.userId);
    }
    async getTimeExceptionsByEmployee(id, getTimeExceptionsByEmployeeDto, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== id) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.getTimeExceptionsByEmployee(id, getTimeExceptionsByEmployeeDto, user.userId);
    }
    async approveTimeException(approveTimeExceptionDto, user) {
        return this.timeManagementService.approveTimeException(approveTimeExceptionDto, user.userId);
    }
    async rejectTimeException(rejectTimeExceptionDto, user) {
        return this.timeManagementService.rejectTimeException(rejectTimeExceptionDto, user.userId);
    }
    async escalateTimeException(escalateTimeExceptionDto, user) {
        return this.timeManagementService.escalateTimeException(escalateTimeExceptionDto, user.userId);
    }
    async getAllTimeExceptions(status, type, employeeId, assignedTo, startDate, endDate, user) {
        return this.timeManagementService.getAllTimeExceptions({
            status,
            type,
            employeeId,
            assignedTo,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        }, user.userId);
    }
    async getTimeExceptionById(id, user) {
        return this.timeManagementService.getTimeExceptionById(id, user.userId);
    }
    async resolveTimeException(body, user) {
        return this.timeManagementService.resolveTimeException(body, user.userId);
    }
    async reassignTimeException(body, user) {
        return this.timeManagementService.reassignTimeException(body, user.userId);
    }
    async getTimeExceptionStatistics(employeeId, startDate, endDate, user) {
        return this.timeManagementService.getTimeExceptionStatistics({
            employeeId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        }, user.userId);
    }
    async bulkApproveTimeExceptions(body, user) {
        return this.timeManagementService.bulkApproveTimeExceptions(body.exceptionIds, user.userId);
    }
    async bulkRejectTimeExceptions(body, user) {
        return this.timeManagementService.bulkRejectTimeExceptions(body, user.userId);
    }
    async getPendingExceptionsForHandler(user) {
        return this.timeManagementService.getPendingExceptionsForHandler(user.userId, user.userId);
    }
    async getEscalatedExceptions(user) {
        return this.timeManagementService.getEscalatedExceptions(user.userId);
    }
    async autoEscalateOverdueExceptions(body, user) {
        return this.timeManagementService.autoEscalateOverdueExceptions({
            thresholdDays: body.thresholdDays,
            excludeTypes: body.excludeTypes,
        }, user.userId);
    }
    async getOverdueExceptions(thresholdDays, status, user) {
        return this.timeManagementService.getOverdueExceptions({
            thresholdDays: Number(thresholdDays),
            status: status ? status.split(',') : undefined,
        }, user.userId);
    }
    async getApprovalWorkflowConfig(user) {
        return this.timeManagementService.getApprovalWorkflowConfig(user.userId);
    }
    async getApprovalWorkflowDashboard(managerId, departmentId, user) {
        return this.timeManagementService.getApprovalWorkflowDashboard({
            managerId,
            departmentId,
        }, user.userId);
    }
    async setExceptionDeadline(body, user) {
        return this.timeManagementService.setExceptionDeadline({
            exceptionId: body.exceptionId,
            deadlineDate: new Date(body.deadlineDate),
            notifyBeforeDays: body.notifyBeforeDays,
        }, user.userId);
    }
    async getRequestsApproachingDeadline(withinDays, payrollCutoffDate, user) {
        return this.timeManagementService.getRequestsApproachingDeadline({
            withinDays: Number(withinDays),
            payrollCutoffDate: payrollCutoffDate ? new Date(payrollCutoffDate) : undefined,
        }, user.userId);
    }
    async autoCreateLatenessException(body, user) {
        return this.timeManagementService.autoCreateLatenessException(body.employeeId, body.attendanceRecordId, body.assignedTo, body.lateMinutes, user.userId);
    }
    async autoCreateEarlyLeaveException(body, user) {
        return this.timeManagementService.autoCreateEarlyLeaveException(body.employeeId, body.attendanceRecordId, body.assignedTo, body.earlyMinutes, user.userId);
    }
    async checkExpiringShiftAssignments(body, user) {
        return this.timeManagementService.checkExpiringShiftAssignments(body.daysBeforeExpiry || 7, user.userId);
    }
    async getExpiredUnprocessedAssignments(user) {
        return this.timeManagementService.getExpiredUnprocessedAssignments(user.userId);
    }
    async detectMissedPunches(user) {
        return this.timeManagementService.detectMissedPunches(user.userId);
    }
    async escalateUnresolvedRequestsBeforePayroll(body, user) {
        return this.timeManagementService.escalateUnresolvedRequestsBeforePayroll(new Date(body.payrollCutOffDate), user.userId);
    }
    async monitorRepeatedLateness(monitorRepeatedLatenessDto, user) {
        return this.timeManagementService.monitorRepeatedLateness(monitorRepeatedLatenessDto, user.userId);
    }
    async triggerLatenessDisciplinary(triggerLatenessDisciplinaryDto, user) {
        return this.timeManagementService.triggerLatenessDisciplinary(triggerLatenessDisciplinaryDto, user.userId);
    }
    async getEmployeeLatenessHistory(employeeId, startDate, endDate, limit, user) {
        return this.timeManagementService.getEmployeeLatenessHistory({
            employeeId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? Number(limit) : undefined,
        }, user.userId);
    }
    async flagEmployeeForRepeatedLateness(body, user) {
        return this.timeManagementService.flagEmployeeForRepeatedLateness({
            employeeId: body.employeeId,
            occurrenceCount: body.occurrenceCount,
            periodDays: body.periodDays,
            severity: body.severity,
            notes: body.notes,
        }, user.userId);
    }
    async getLatenesDisciplinaryFlags(status, severity, startDate, endDate, user) {
        return this.timeManagementService.getLatenesDisciplinaryFlags({
            status,
            severity,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        }, user.userId);
    }
    async analyzeLatenessPatterns(employeeId, periodDays, user) {
        return this.timeManagementService.analyzeLatenessPatterns({
            employeeId,
            periodDays: periodDays ? Number(periodDays) : undefined,
        }, user.userId);
    }
    async getLatenessTrendReport(body, user) {
        return this.timeManagementService.getLatenessTrendReport({
            departmentId: body.departmentId,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            groupBy: body.groupBy,
        }, user.userId);
    }
    async resolveDisciplinaryFlag(body, user) {
        return this.timeManagementService.resolveDisciplinaryFlag({
            flagId: body.flagId,
            resolution: body.resolution,
            resolutionNotes: body.resolutionNotes,
        }, user.userId);
    }
    async getRepeatedLatenessOffenders(threshold, periodDays, includeResolved, user) {
        return this.timeManagementService.getRepeatedLatenessOffenders({
            threshold: Number(threshold),
            periodDays: Number(periodDays),
            includeResolved: includeResolved === true,
        }, user.userId);
    }
    async scheduleTimeDataBackup(user) {
        return this.timeManagementService.scheduleTimeDataBackup(user.userId);
    }
    async requestOvertimeApproval(body, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== body.employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.requestOvertimeApproval(body, user.userId);
    }
    async calculateOvertimeFromAttendance(attendanceRecordId, body, user) {
        return this.timeManagementService.calculateOvertimeFromAttendance(attendanceRecordId, body.standardWorkMinutes || 480, user.userId);
    }
    async getEmployeeOvertimeSummary(employeeId, startDate, endDate, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            !user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD) &&
            user.userId !== employeeId) {
            throw new Error('Access denied');
        }
        return this.timeManagementService.getEmployeeOvertimeSummary(employeeId, new Date(startDate), new Date(endDate), user.userId);
    }
    async getPendingOvertimeRequests(departmentId, assignedTo, user) {
        return this.timeManagementService.getPendingOvertimeRequests({ departmentId, assignedTo }, user.userId);
    }
    async approveOvertimeRequest(id, body, user) {
        return this.timeManagementService.approveOvertimeRequest(id, body.approvalNotes, user.userId);
    }
    async rejectOvertimeRequest(id, body, user) {
        return this.timeManagementService.rejectOvertimeRequest(id, body.rejectionReason, user.userId);
    }
    async autoDetectAndCreateOvertimeException(attendanceRecordId, body, user) {
        return this.timeManagementService.autoDetectAndCreateOvertimeException(attendanceRecordId, body.standardWorkMinutes || 480, body.assignedTo, user.userId);
    }
    async getOvertimeStatistics(startDate, endDate, departmentId, user) {
        return this.timeManagementService.getOvertimeStatistics({
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            departmentId,
        }, user.userId);
    }
    async bulkProcessOvertimeRequests(body, user) {
        return this.timeManagementService.bulkProcessOvertimeRequests(body.action, body.requestIds, body.notes, user.userId);
    }
    async generateOvertimeReport(generateOvertimeReportDto, user) {
        return this.timeManagementService.generateOvertimeReport(generateOvertimeReportDto, user.userId);
    }
    async generateLatenessReport(generateLatenessReportDto, user) {
        return this.timeManagementService.generateLatenessReport(generateLatenessReportDto, user.userId);
    }
    async generateExceptionReport(generateExceptionReportDto, user) {
        return this.timeManagementService.generateExceptionReport(generateExceptionReportDto, user.userId);
    }
    async exportReport(exportReportDto, user) {
        return this.timeManagementService.exportReport(exportReportDto, user.userId);
    }
    async generateAttendanceSummaryReport(body, user) {
        return this.timeManagementService.generateAttendanceSummaryReport({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            employeeId: body.employeeId,
            departmentId: body.departmentId,
            groupBy: body.groupBy,
        }, user.userId);
    }
    async generateOvertimeCostAnalysis(body, user) {
        return this.timeManagementService.generateOvertimeCostAnalysis({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            employeeId: body.employeeId,
            departmentId: body.departmentId,
            hourlyRate: body.hourlyRate,
            overtimeMultiplier: body.overtimeMultiplier,
        }, user.userId);
    }
    async generatePayrollReadyReport(body, user) {
        return this.timeManagementService.generatePayrollReadyReport({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            employeeIds: body.employeeIds,
            departmentId: body.departmentId,
            includeExceptions: body.includeExceptions,
            includePenalties: body.includePenalties,
        }, user.userId);
    }
    async generateDisciplinarySummaryReport(body, user) {
        return this.timeManagementService.generateDisciplinarySummaryReport({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            departmentId: body.departmentId,
            severityFilter: body.severityFilter,
        }, user.userId);
    }
    async getTimeManagementAnalyticsDashboard(body, user) {
        return this.timeManagementService.getTimeManagementAnalyticsDashboard({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            departmentId: body.departmentId,
        }, user.userId);
    }
    async getLatenessLogs(body, user) {
        return this.timeManagementService.getLatenessLogs({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            employeeId: body.employeeId,
            departmentId: body.departmentId,
            includeResolved: body.includeResolved,
            sortBy: body.sortBy,
            sortOrder: body.sortOrder,
        }, user.userId);
    }
    async generateOvertimeAndExceptionComplianceReport(body, user) {
        return this.timeManagementService.generateOvertimeAndExceptionComplianceReport({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            employeeId: body.employeeId,
            departmentId: body.departmentId,
            includeAllExceptionTypes: body.includeAllExceptionTypes,
        }, user.userId);
    }
    async getEmployeeAttendanceHistory(body, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            !user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD) &&
            !user.roles.includes(employee_profile_enums_1.SystemRole.HR_MANAGER) &&
            !user.roles.includes(employee_profile_enums_1.SystemRole.HR_ADMIN) &&
            user.userId !== body.employeeId) {
            throw new Error('Access denied: You can only view your own attendance history');
        }
        return this.timeManagementService.getEmployeeAttendanceHistory({
            employeeId: body.employeeId,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            includeExceptions: body.includeExceptions,
            includeOvertime: body.includeOvertime,
        }, user.userId);
    }
    async exportOvertimeExceptionReport(body, user) {
        return this.timeManagementService.exportOvertimeExceptionReport({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            employeeId: body.employeeId,
            departmentId: body.departmentId,
            format: body.format,
        }, user.userId);
    }
};
exports.TimeManagementController = TimeManagementController;
__decorate([
    (0, common_1.Post)('clock-in/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_EMPLOYEE),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "clockInWithID", null);
__decorate([
    (0, common_1.Post)('clock-out/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_EMPLOYEE),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "clockOutWithID", null);
__decorate([
    (0, common_1.Post)('clock-in/:employeeId/metadata'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "clockInWithMetadata", null);
__decorate([
    (0, common_1.Post)('clock-out/:employeeId/metadata'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "clockOutWithMetadata", null);
__decorate([
    (0, common_1.Post)('clock-in/:employeeId/validate'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "validateClockInAgainstShift", null);
__decorate([
    (0, common_1.Get)('attendance/status/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getEmployeeAttendanceStatus", null);
__decorate([
    (0, common_1.Post)('attendance'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dtos_1.CreateAttendanceRecordDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "createAttendanceRecord", null);
__decorate([
    (0, common_1.Put)('attendance/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_dtos_1.UpdateAttendanceRecordDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "updateAttendanceRecord", null);
__decorate([
    (0, common_1.Post)('attendance/correction'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dtos_1.SubmitCorrectionRequestDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "submitAttendanceCorrectionRequest", null);
__decorate([
    (0, common_1.Post)('attendance/punch/metadata'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [time_permission_dtos_1.RecordPunchWithMetadataDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "recordPunchWithMetadata", null);
__decorate([
    (0, common_1.Post)('attendance/punch/device'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_EMPLOYEE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [time_permission_dtos_1.RecordPunchWithMetadataDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "recordPunchFromDevice", null);
__decorate([
    (0, common_1.Post)('attendance/enforce-punch-policy'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [time_permission_dtos_1.EnforcePunchPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "enforcePunchPolicy", null);
__decorate([
    (0, common_1.Post)('attendance/rounding'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [time_permission_dtos_1.ApplyAttendanceRoundingDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "applyAttendanceRounding", null);
__decorate([
    (0, common_1.Post)('attendance/enforce-shift-policy'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [time_permission_dtos_1.EnforceShiftPunchPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "enforceShiftPunchPolicy", null);
__decorate([
    (0, common_1.Post)('correction-request'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "submitCorrectionRequest", null);
__decorate([
    (0, common_1.Get)('correction-request/employee/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getCorrectionRequestsByEmployee", null);
__decorate([
    (0, common_1.Get)('correction-request/:requestId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getCorrectionRequestById", null);
__decorate([
    (0, common_1.Get)('correction-request'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('employeeId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getAllCorrectionRequests", null);
__decorate([
    (0, common_1.Get)('correction-request/pending/manager'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('managerId')),
    __param(1, (0, common_1.Query)('departmentId')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getPendingCorrectionRequestsForManager", null);
__decorate([
    (0, common_1.Post)('correction-request/:requestId/in-review'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "markCorrectionRequestInReview", null);
__decorate([
    (0, common_1.Post)('correction-request/:requestId/approve'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "approveCorrectionRequest", null);
__decorate([
    (0, common_1.Post)('correction-request/:requestId/reject'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "rejectCorrectionRequest", null);
__decorate([
    (0, common_1.Post)('correction-request/:requestId/escalate'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "escalateCorrectionRequest", null);
__decorate([
    (0, common_1.Post)('correction-request/:requestId/cancel'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "cancelCorrectionRequest", null);
__decorate([
    (0, common_1.Get)('correction-request/statistics'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('departmentId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getCorrectionRequestStatistics", null);
__decorate([
    (0, common_1.Post)('time-exception'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dtos_1.CreateTimeExceptionDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "createTimeException", null);
__decorate([
    (0, common_1.Put)('time-exception/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_dtos_1.UpdateTimeExceptionDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "updateTimeException", null);
__decorate([
    (0, common_1.Get)('time-exception/employee/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_dtos_1.GetTimeExceptionsByEmployeeDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getTimeExceptionsByEmployee", null);
__decorate([
    (0, common_1.Post)('time-exception/approve'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dtos_1.ApproveTimeExceptionDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "approveTimeException", null);
__decorate([
    (0, common_1.Post)('time-exception/reject'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dtos_1.RejectTimeExceptionDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "rejectTimeException", null);
__decorate([
    (0, common_1.Post)('time-exception/escalate'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dtos_1.EscalateTimeExceptionDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "escalateTimeException", null);
__decorate([
    (0, common_1.Get)('time-exceptions'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('employeeId')),
    __param(3, (0, common_1.Query)('assignedTo')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getAllTimeExceptions", null);
__decorate([
    (0, common_1.Get)('time-exception/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getTimeExceptionById", null);
__decorate([
    (0, common_1.Post)('time-exception/resolve'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "resolveTimeException", null);
__decorate([
    (0, common_1.Post)('time-exception/reassign'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "reassignTimeException", null);
__decorate([
    (0, common_1.Get)('time-exceptions/statistics'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('employeeId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getTimeExceptionStatistics", null);
__decorate([
    (0, common_1.Post)('time-exceptions/bulk-approve'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "bulkApproveTimeExceptions", null);
__decorate([
    (0, common_1.Post)('time-exceptions/bulk-reject'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "bulkRejectTimeExceptions", null);
__decorate([
    (0, common_1.Get)('time-exceptions/my-pending'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getPendingExceptionsForHandler", null);
__decorate([
    (0, common_1.Get)('time-exceptions/escalated'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getEscalatedExceptions", null);
__decorate([
    (0, common_1.Post)('time-exceptions/auto-escalate-overdue'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "autoEscalateOverdueExceptions", null);
__decorate([
    (0, common_1.Get)('time-exceptions/overdue'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Query)('thresholdDays')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getOverdueExceptions", null);
__decorate([
    (0, common_1.Get)('time-exceptions/workflow-config'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getApprovalWorkflowConfig", null);
__decorate([
    (0, common_1.Get)('time-exceptions/workflow-dashboard'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Query)('managerId')),
    __param(1, (0, common_1.Query)('departmentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getApprovalWorkflowDashboard", null);
__decorate([
    (0, common_1.Post)('time-exception/set-deadline'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "setExceptionDeadline", null);
__decorate([
    (0, common_1.Get)('time-exceptions/approaching-deadline'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Query)('withinDays')),
    __param(1, (0, common_1.Query)('payrollCutoffDate')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getRequestsApproachingDeadline", null);
__decorate([
    (0, common_1.Post)('time-exception/auto-lateness'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "autoCreateLatenessException", null);
__decorate([
    (0, common_1.Post)('time-exception/auto-early-leave'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "autoCreateEarlyLeaveException", null);
__decorate([
    (0, common_1.Post)('automation/check-expiring-shifts'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "checkExpiringShiftAssignments", null);
__decorate([
    (0, common_1.Get)('automation/expired-unprocessed'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getExpiredUnprocessedAssignments", null);
__decorate([
    (0, common_1.Post)('automation/detect-missed-punches'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "detectMissedPunches", null);
__decorate([
    (0, common_1.Post)('automation/escalate-before-payroll'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "escalateUnresolvedRequestsBeforePayroll", null);
__decorate([
    (0, common_1.Post)('automation/monitor-lateness'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [time_permission_dtos_1.MonitorRepeatedLatenessDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "monitorRepeatedLateness", null);
__decorate([
    (0, common_1.Post)('automation/trigger-lateness'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [time_permission_dtos_1.TriggerLatenessDisciplinaryDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "triggerLatenessDisciplinary", null);
__decorate([
    (0, common_1.Get)('lateness/history/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getEmployeeLatenessHistory", null);
__decorate([
    (0, common_1.Post)('lateness/flag'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "flagEmployeeForRepeatedLateness", null);
__decorate([
    (0, common_1.Get)('lateness/flags'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('severity')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getLatenesDisciplinaryFlags", null);
__decorate([
    (0, common_1.Get)('lateness/patterns/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('periodDays')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "analyzeLatenessPatterns", null);
__decorate([
    (0, common_1.Post)('lateness/trend-report'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getLatenessTrendReport", null);
__decorate([
    (0, common_1.Post)('lateness/flag/resolve'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "resolveDisciplinaryFlag", null);
__decorate([
    (0, common_1.Get)('lateness/offenders'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('threshold')),
    __param(1, (0, common_1.Query)('periodDays')),
    __param(2, (0, common_1.Query)('includeResolved')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Boolean, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getRepeatedLatenessOffenders", null);
__decorate([
    (0, common_1.Post)('automation/schedule-backup'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "scheduleTimeDataBackup", null);
__decorate([
    (0, common_1.Post)('overtime/request'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "requestOvertimeApproval", null);
__decorate([
    (0, common_1.Post)('overtime/calculate/:attendanceRecordId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('attendanceRecordId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "calculateOvertimeFromAttendance", null);
__decorate([
    (0, common_1.Get)('overtime/summary/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getEmployeeOvertimeSummary", null);
__decorate([
    (0, common_1.Get)('overtime/pending'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('departmentId')),
    __param(1, (0, common_1.Query)('assignedTo')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getPendingOvertimeRequests", null);
__decorate([
    (0, common_1.Post)('overtime/approve/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "approveOvertimeRequest", null);
__decorate([
    (0, common_1.Post)('overtime/reject/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "rejectOvertimeRequest", null);
__decorate([
    (0, common_1.Post)('overtime/auto-detect/:attendanceRecordId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('attendanceRecordId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "autoDetectAndCreateOvertimeException", null);
__decorate([
    (0, common_1.Get)('overtime/statistics'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('departmentId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getOvertimeStatistics", null);
__decorate([
    (0, common_1.Post)('overtime/bulk-process'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "bulkProcessOvertimeRequests", null);
__decorate([
    (0, common_1.Post)('reports/overtime'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reporting_dtos_1.GenerateOvertimeReportDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "generateOvertimeReport", null);
__decorate([
    (0, common_1.Post)('reports/lateness'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reporting_dtos_1.GenerateLatenessReportDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "generateLatenessReport", null);
__decorate([
    (0, common_1.Post)('reports/exception'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reporting_dtos_1.GenerateExceptionReportDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "generateExceptionReport", null);
__decorate([
    (0, common_1.Post)('reports/export'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reporting_dtos_1.ExportReportDto, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Post)('reports/attendance-summary'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "generateAttendanceSummaryReport", null);
__decorate([
    (0, common_1.Post)('reports/overtime-cost-analysis'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "generateOvertimeCostAnalysis", null);
__decorate([
    (0, common_1.Post)('reports/payroll-ready'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "generatePayrollReadyReport", null);
__decorate([
    (0, common_1.Post)('reports/disciplinary-summary'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "generateDisciplinarySummaryReport", null);
__decorate([
    (0, common_1.Post)('reports/analytics-dashboard'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getTimeManagementAnalyticsDashboard", null);
__decorate([
    (0, common_1.Post)('reports/lateness-logs'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getLatenessLogs", null);
__decorate([
    (0, common_1.Post)('reports/overtime-exception-compliance'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "generateOvertimeAndExceptionComplianceReport", null);
__decorate([
    (0, common_1.Post)('reports/employee-attendance-history'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getEmployeeAttendanceHistory", null);
__decorate([
    (0, common_1.Post)('reports/overtime-exception-export'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "exportOvertimeExceptionReport", null);
exports.TimeManagementController = TimeManagementController = __decorate([
    (0, common_1.Controller)('time-management'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [time_management_service_1.TimeManagementService])
], TimeManagementController);
//# sourceMappingURL=time-management.controller.js.map