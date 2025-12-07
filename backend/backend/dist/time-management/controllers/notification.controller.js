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
exports.NotificationAndSyncController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("../services/notification.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const employee_profile_enums_1 = require("../../employee-profile/enums/employee-profile.enums");
const notification_and_sync_dtos_1 = require("../dtos/notification-and-sync.dtos");
let NotificationAndSyncController = class NotificationAndSyncController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async sendNotification(sendNotificationDto, user) {
        return this.notificationService.sendNotification(sendNotificationDto, user.userId);
    }
    async getNotificationLogsByEmployee(employeeId, user) {
        if (user.roles.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== employeeId) {
            throw new Error('Access denied');
        }
        return this.notificationService.getNotificationLogsByEmployee({
            employeeId,
        }, user.userId);
    }
    async syncAttendanceWithPayroll(syncAttendanceWithPayrollDto, user) {
        return this.notificationService.syncAttendanceWithPayroll(syncAttendanceWithPayrollDto, user.userId);
    }
    async syncLeaveWithPayroll(syncLeaveWithPayrollDto, user) {
        return this.notificationService.syncLeaveWithPayroll(syncLeaveWithPayrollDto, user.userId);
    }
    async synchronizeAttendanceAndPayroll(synchronizeAttendanceAndPayrollDto, user) {
        return this.notificationService.synchronizeAttendanceAndPayroll(synchronizeAttendanceAndPayrollDto, user.userId);
    }
    async getAttendanceDataForSync(employeeId, startDate, endDate, user) {
        return this.notificationService.getAttendanceDataForSync(employeeId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined, user.userId);
    }
    async getOvertimeDataForSync(employeeId, startDate, endDate, user) {
        return this.notificationService.getOvertimeDataForSync(employeeId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined, user.userId);
    }
    async runDailyPayrollSync(body, user) {
        return this.notificationService.runDailyPayrollSync(new Date(body.syncDate), user.userId);
    }
    async getPendingPayrollSyncData(startDate, endDate, departmentId, user) {
        const filters = {};
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (departmentId)
            filters.departmentId = departmentId;
        return this.notificationService.getPendingPayrollSyncData(filters, user.userId);
    }
    async finalizeRecordsForPayroll(body, user) {
        return this.notificationService.finalizeRecordsForPayroll(body.recordIds, user.userId);
    }
    async validateDataForPayrollSync(body, user) {
        return this.notificationService.validateDataForPayrollSync({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
        }, user.userId);
    }
    async getExceptionDataForPayrollSync(startDate, endDate, employeeId, user) {
        const filters = {};
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (employeeId)
            filters.employeeId = employeeId;
        return this.notificationService.getExceptionDataForPayrollSync(filters, user.userId);
    }
    async getPayrollSyncHistory(startDate, endDate, limit, user) {
        const filters = {};
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        if (limit)
            filters.limit = parseInt(limit, 10);
        return this.notificationService.getPayrollSyncHistory(filters, user.userId);
    }
    async getComprehensivePayrollData(body, user) {
        return this.notificationService.getComprehensivePayrollData({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            departmentId: body.departmentId,
        }, user.userId);
    }
    async sendShiftExpiryNotification(body, user) {
        return this.notificationService.sendShiftExpiryNotification(body.recipientId, body.shiftAssignmentId, body.employeeId, new Date(body.endDate), body.daysRemaining, user.userId);
    }
    async sendBulkShiftExpiryNotifications(body, user) {
        return this.notificationService.sendBulkShiftExpiryNotifications(body.hrAdminIds, body.expiringAssignments.map(a => ({
            ...a,
            endDate: new Date(a.endDate),
        })), user.userId);
    }
    async getShiftExpiryNotifications(hrAdminId, user) {
        return this.notificationService.getShiftExpiryNotifications(hrAdminId, user.userId);
    }
    async sendShiftRenewalConfirmation(body, user) {
        return this.notificationService.sendShiftRenewalConfirmation(body.recipientId, body.shiftAssignmentId, new Date(body.newEndDate), user.userId);
    }
    async sendShiftArchiveNotification(body, user) {
        return this.notificationService.sendShiftArchiveNotification(body.recipientId, body.shiftAssignmentId, body.employeeId, user.userId);
    }
    async getAllShiftNotifications(hrAdminId, user) {
        return this.notificationService.getAllShiftNotifications(hrAdminId, user.userId);
    }
    async sendMissedPunchAlertToEmployee(body, user) {
        return this.notificationService.sendMissedPunchAlertToEmployee(body.employeeId, body.attendanceRecordId, body.missedPunchType, new Date(body.date), user.userId);
    }
    async sendMissedPunchAlertToManager(body, user) {
        return this.notificationService.sendMissedPunchAlertToManager(body.managerId, body.employeeId, body.employeeName, body.attendanceRecordId, body.missedPunchType, new Date(body.date), user.userId);
    }
    async sendBulkMissedPunchAlerts(body, user) {
        const alerts = body.alerts.map(a => ({
            ...a,
            date: new Date(a.date),
        }));
        return this.notificationService.sendBulkMissedPunchAlerts(alerts, user.userId);
    }
    async getMissedPunchNotificationsByEmployee(employeeId, user) {
        if (user.roles?.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE) &&
            user.userId !== employeeId) {
            throw new Error('Access denied');
        }
        return this.notificationService.getMissedPunchNotificationsByEmployee(employeeId, user.userId);
    }
    async getMissedPunchNotificationsByManager(managerId, user) {
        if (user.roles?.includes(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD) &&
            user.userId !== managerId) {
            throw new Error('Access denied');
        }
        return this.notificationService.getMissedPunchNotificationsByManager(managerId, user.userId);
    }
    async getAllMissedPunchNotifications(startDate, endDate, user) {
        const filters = {};
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        return this.notificationService.getAllMissedPunchNotifications(filters, user.userId);
    }
    async flagMissedPunchWithNotification(body, user) {
        return this.notificationService.flagMissedPunchWithNotification(body.attendanceRecordId, body.employeeId, body.managerId, body.employeeName, body.missedPunchType, user.userId);
    }
    async getMissedPunchStatistics(employeeId, startDate, endDate, user) {
        const filters = {};
        if (employeeId)
            filters.employeeId = employeeId;
        if (startDate)
            filters.startDate = new Date(startDate);
        if (endDate)
            filters.endDate = new Date(endDate);
        return this.notificationService.getMissedPunchStatistics(filters, user.userId);
    }
    async linkVacationToAttendanceSchedule(body, user) {
        return this.notificationService.linkVacationToAttendanceSchedule({
            employeeId: body.employeeId,
            vacationPackageId: body.vacationPackageId,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            vacationType: body.vacationType,
            autoReflect: body.autoReflect,
        }, user.userId);
    }
    async getEmployeeVacationAttendanceStatus(employeeId, startDate, endDate, user) {
        return this.notificationService.getEmployeeVacationAttendanceStatus({
            employeeId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        }, user.userId);
    }
    async validateVacationAgainstShiftSchedule(body, user) {
        return this.notificationService.validateVacationAgainstShiftSchedule({
            employeeId: body.employeeId,
            vacationStartDate: new Date(body.vacationStartDate),
            vacationEndDate: new Date(body.vacationEndDate),
            shiftAssignmentId: body.shiftAssignmentId,
        }, user.userId);
    }
    async calculateLeaveDeductionsFromAttendance(body, user) {
        return this.notificationService.calculateLeaveDeductionsFromAttendance({
            employeeId: body.employeeId,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            leaveType: body.leaveType,
        }, user.userId);
    }
    async getDepartmentVacationAttendanceSummary(body, user) {
        return this.notificationService.getDepartmentVacationAttendanceSummary({
            departmentId: body.departmentId,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
        }, user.userId);
    }
    async getPayrollCutoffConfig(user) {
        return this.notificationService.getPayrollCutoffConfig(user.userId);
    }
    async getPendingRequestsBeforePayrollCutoff(body, user) {
        return this.notificationService.getPendingRequestsBeforePayrollCutoff({
            payrollCutoffDate: body.payrollCutoffDate ? new Date(body.payrollCutoffDate) : undefined,
            departmentId: body.departmentId,
        }, user.userId);
    }
    async autoEscalateBeforePayrollCutoff(body, user) {
        return this.notificationService.autoEscalateBeforePayrollCutoff({
            payrollCutoffDate: body.payrollCutoffDate ? new Date(body.payrollCutoffDate) : undefined,
            escalationDaysBefore: body.escalationDaysBefore,
            notifyManagers: body.notifyManagers,
        }, user.userId);
    }
    async checkPayrollReadinessStatus(body, user) {
        return this.notificationService.checkPayrollReadinessStatus({
            payrollCutoffDate: body.payrollCutoffDate ? new Date(body.payrollCutoffDate) : undefined,
            departmentId: body.departmentId,
        }, user.userId);
    }
    async getEscalationHistory(body, user) {
        return this.notificationService.getEscalationHistory({
            startDate: body.startDate ? new Date(body.startDate) : undefined,
            endDate: body.endDate ? new Date(body.endDate) : undefined,
            type: body.type,
        }, user.userId);
    }
    async sendPayrollCutoffReminders(body, user) {
        return this.notificationService.sendPayrollCutoffReminders({
            payrollCutoffDate: body.payrollCutoffDate ? new Date(body.payrollCutoffDate) : undefined,
            reminderDaysBefore: body.reminderDaysBefore,
        }, user.userId);
    }
    async getCrossModuleSyncStatus(startDate, endDate, user) {
        return this.notificationService.getCrossModuleSyncStatus({
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        }, user.userId);
    }
    async syncWithLeavesModule(body, user) {
        return this.notificationService.syncWithLeavesModule({
            employeeId: body.employeeId,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
        }, user.userId);
    }
    async syncWithBenefitsModule(body, user) {
        return this.notificationService.syncWithBenefitsModule({
            employeeId: body.employeeId,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
        }, user.userId);
    }
    async runFullCrossModuleSync(body, user) {
        return this.notificationService.runFullCrossModuleSync({
            syncDate: new Date(body.syncDate),
            modules: body.modules,
        }, user.userId);
    }
    async checkCrossModuleDataConsistency(body, user) {
        return this.notificationService.checkCrossModuleDataConsistency({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            employeeId: body.employeeId,
        }, user.userId);
    }
    async getDataForDownstreamModules(body, user) {
        return this.notificationService.getDataForDownstreamModules({
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            departmentId: body.departmentId,
            modules: body.modules,
        }, user.userId);
    }
};
exports.NotificationAndSyncController = NotificationAndSyncController;
__decorate([
    (0, common_1.Post)('notification'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_and_sync_dtos_1.SendNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Get)('notification/employee/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getNotificationLogsByEmployee", null);
__decorate([
    (0, common_1.Post)('sync/attendance'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_and_sync_dtos_1.SyncAttendanceWithPayrollDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "syncAttendanceWithPayroll", null);
__decorate([
    (0, common_1.Post)('sync/leave'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_and_sync_dtos_1.SyncLeaveWithPayrollDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "syncLeaveWithPayroll", null);
__decorate([
    (0, common_1.Post)('sync/attendance-leave'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_and_sync_dtos_1.SynchronizeAttendanceAndPayrollDto, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "synchronizeAttendanceAndPayroll", null);
__decorate([
    (0, common_1.Get)('sync/attendance/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getAttendanceDataForSync", null);
__decorate([
    (0, common_1.Get)('sync/overtime/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getOvertimeDataForSync", null);
__decorate([
    (0, common_1.Post)('sync/daily-batch'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "runDailyPayrollSync", null);
__decorate([
    (0, common_1.Get)('sync/pending'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('departmentId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getPendingPayrollSyncData", null);
__decorate([
    (0, common_1.Post)('sync/finalize'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "finalizeRecordsForPayroll", null);
__decorate([
    (0, common_1.Post)('sync/validate'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "validateDataForPayrollSync", null);
__decorate([
    (0, common_1.Get)('sync/exceptions'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('employeeId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getExceptionDataForPayrollSync", null);
__decorate([
    (0, common_1.Get)('sync/history'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getPayrollSyncHistory", null);
__decorate([
    (0, common_1.Post)('sync/comprehensive'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getComprehensivePayrollData", null);
__decorate([
    (0, common_1.Post)('shift-expiry/notify'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "sendShiftExpiryNotification", null);
__decorate([
    (0, common_1.Post)('shift-expiry/notify-bulk'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "sendBulkShiftExpiryNotifications", null);
__decorate([
    (0, common_1.Get)('shift-expiry/:hrAdminId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Param)('hrAdminId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getShiftExpiryNotifications", null);
__decorate([
    (0, common_1.Post)('shift-renewal/confirm'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "sendShiftRenewalConfirmation", null);
__decorate([
    (0, common_1.Post)('shift-archive/notify'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "sendShiftArchiveNotification", null);
__decorate([
    (0, common_1.Get)('shift-notifications/:hrAdminId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Param)('hrAdminId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getAllShiftNotifications", null);
__decorate([
    (0, common_1.Post)('missed-punch/alert/employee'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "sendMissedPunchAlertToEmployee", null);
__decorate([
    (0, common_1.Post)('missed-punch/alert/manager'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "sendMissedPunchAlertToManager", null);
__decorate([
    (0, common_1.Post)('missed-punch/alert/bulk'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "sendBulkMissedPunchAlerts", null);
__decorate([
    (0, common_1.Get)('missed-punch/employee/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getMissedPunchNotificationsByEmployee", null);
__decorate([
    (0, common_1.Get)('missed-punch/manager/:managerId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('managerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getMissedPunchNotificationsByManager", null);
__decorate([
    (0, common_1.Get)('missed-punch/all'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getAllMissedPunchNotifications", null);
__decorate([
    (0, common_1.Post)('missed-punch/flag-with-notification'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "flagMissedPunchWithNotification", null);
__decorate([
    (0, common_1.Get)('missed-punch/statistics'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Query)('employeeId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getMissedPunchStatistics", null);
__decorate([
    (0, common_1.Post)('vacation/link-to-attendance'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "linkVacationToAttendanceSchedule", null);
__decorate([
    (0, common_1.Get)('vacation/attendance-status/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getEmployeeVacationAttendanceStatus", null);
__decorate([
    (0, common_1.Post)('vacation/validate-against-schedule'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "validateVacationAgainstShiftSchedule", null);
__decorate([
    (0, common_1.Post)('vacation/calculate-deductions'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "calculateLeaveDeductionsFromAttendance", null);
__decorate([
    (0, common_1.Post)('vacation/department-summary'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getDepartmentVacationAttendanceSummary", null);
__decorate([
    (0, common_1.Get)('payroll-cutoff/config'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getPayrollCutoffConfig", null);
__decorate([
    (0, common_1.Post)('payroll-cutoff/pending'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getPendingRequestsBeforePayrollCutoff", null);
__decorate([
    (0, common_1.Post)('payroll-cutoff/auto-escalate'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "autoEscalateBeforePayrollCutoff", null);
__decorate([
    (0, common_1.Post)('payroll-cutoff/readiness'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "checkPayrollReadinessStatus", null);
__decorate([
    (0, common_1.Post)('payroll-cutoff/escalation-history'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getEscalationHistory", null);
__decorate([
    (0, common_1.Post)('payroll-cutoff/send-reminders'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "sendPayrollCutoffReminders", null);
__decorate([
    (0, common_1.Get)('cross-module/status'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getCrossModuleSyncStatus", null);
__decorate([
    (0, common_1.Post)('cross-module/sync-leaves'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "syncWithLeavesModule", null);
__decorate([
    (0, common_1.Post)('cross-module/sync-benefits'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "syncWithBenefitsModule", null);
__decorate([
    (0, common_1.Post)('cross-module/sync-all'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "runFullCrossModuleSync", null);
__decorate([
    (0, common_1.Post)('cross-module/consistency-check'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "checkCrossModuleDataConsistency", null);
__decorate([
    (0, common_1.Post)('cross-module/data-packages'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationAndSyncController.prototype, "getDataForDownstreamModules", null);
exports.NotificationAndSyncController = NotificationAndSyncController = __decorate([
    (0, common_1.Controller)('notification-sync'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationAndSyncController);
//# sourceMappingURL=notification.controller.js.map