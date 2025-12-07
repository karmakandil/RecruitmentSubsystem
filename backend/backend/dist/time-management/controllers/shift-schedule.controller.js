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
exports.ShiftAndScheduleController = void 0;
const common_1 = require("@nestjs/common");
const shift_schedule_service_1 = require("../services/shift-schedule.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const employee_profile_enums_1 = require("../../employee-profile/enums/employee-profile.enums");
const enums_1 = require("../models/enums");
const shift_dtos_1 = require("../DTOs/shift.dtos");
let ShiftAndScheduleController = class ShiftAndScheduleController {
    constructor(shiftScheduleService) {
        this.shiftScheduleService = shiftScheduleService;
    }
    async createShiftType(createShiftTypeDto, user) {
        return this.shiftScheduleService.createShiftType(createShiftTypeDto, user.userId);
    }
    async getShiftTypes(active) {
        const filters = active !== undefined ? { active: active === 'true' } : undefined;
        return this.shiftScheduleService.getShiftTypes(filters);
    }
    async getShiftTypeById(id) {
        return this.shiftScheduleService.getShiftTypeById(id);
    }
    async updateShiftType(id, updateShiftTypeDto, user) {
        return this.shiftScheduleService.updateShiftType(id, updateShiftTypeDto, user.userId);
    }
    async deleteShiftType(id) {
        return this.shiftScheduleService.deleteShiftType(id);
    }
    async createShift(createShiftDto, user) {
        return this.shiftScheduleService.createShift(createShiftDto, user.userId);
    }
    async getShifts(active, shiftType) {
        const filters = {};
        if (active !== undefined) {
            filters.active = active === 'true';
        }
        if (shiftType) {
            filters.shiftType = shiftType;
        }
        return this.shiftScheduleService.getShifts(filters);
    }
    async getShiftById(id) {
        return this.shiftScheduleService.getShiftById(id);
    }
    async updateShift(id, updateShiftDto, user) {
        return this.shiftScheduleService.updateShift(id, updateShiftDto, user.userId);
    }
    async deleteShift(id) {
        return this.shiftScheduleService.deleteShift(id);
    }
    async getShiftsByType(shiftTypeId) {
        return this.shiftScheduleService.getShiftsByType(shiftTypeId);
    }
    async assignShiftToEmployee(assignShiftToEmployeeDto, user) {
        return this.shiftScheduleService.assignShiftToEmployee(assignShiftToEmployeeDto, user.userId);
    }
    async assignShiftToDepartment(dto, user) {
        return this.shiftScheduleService.assignShiftToDepartment(dto, user.userId);
    }
    async assignShiftToPosition(dto, user) {
        return this.shiftScheduleService.assignShiftToPosition(dto, user.userId);
    }
    async updateShiftAssignment(id, dto, user) {
        return this.shiftScheduleService.updateShiftAssignment(id, dto, user.userId);
    }
    async getAllShiftAssignments(status, employeeId, departmentId, positionId, shiftId) {
        return this.shiftScheduleService.getAllShiftAssignments({
            status,
            employeeId,
            departmentId,
            positionId,
            shiftId,
        });
    }
    async getShiftAssignmentById(id) {
        return this.shiftScheduleService.getShiftAssignmentById(id);
    }
    async getEmployeeShiftAssignments(employeeId, user) {
        return this.shiftScheduleService.getEmployeeShiftAssignments(employeeId, user.userId);
    }
    async getDepartmentShiftAssignments(departmentId) {
        return this.shiftScheduleService.getDepartmentShiftAssignments(departmentId);
    }
    async getPositionShiftAssignments(positionId) {
        return this.shiftScheduleService.getPositionShiftAssignments(positionId);
    }
    async getShiftAssignmentStatus(id, user) {
        return this.shiftScheduleService.getShiftAssignmentStatus(id, user.userId);
    }
    async renewShiftAssignment(dto, user) {
        return this.shiftScheduleService.renewShiftAssignment(dto, user.userId);
    }
    async cancelShiftAssignment(dto, user) {
        return this.shiftScheduleService.cancelShiftAssignment(dto, user.userId);
    }
    async postponeShiftAssignment(dto, user) {
        return this.shiftScheduleService.postponeShiftAssignment(dto, user.userId);
    }
    async checkExpiredAssignments() {
        return this.shiftScheduleService.checkExpiredAssignments();
    }
    async createScheduleRule(createScheduleRuleDto, user) {
        return this.shiftScheduleService.createScheduleRule(createScheduleRuleDto, user.userId);
    }
    async getScheduleRules(active) {
        const filters = active !== undefined ? { active: active === 'true' } : undefined;
        return this.shiftScheduleService.getScheduleRules(filters);
    }
    async getScheduleRuleById(id) {
        return this.shiftScheduleService.getScheduleRuleById(id);
    }
    async updateScheduleRule(id, updateScheduleRuleDto, user) {
        return this.shiftScheduleService.updateScheduleRule(id, updateScheduleRuleDto, user.userId);
    }
    async deleteScheduleRule(id) {
        return this.shiftScheduleService.deleteScheduleRule(id);
    }
    async defineFlexibleSchedulingRules(defineFlexibleSchedulingRulesDto, user) {
        return this.shiftScheduleService.defineFlexibleSchedulingRules(defineFlexibleSchedulingRulesDto, user.userId);
    }
    async validateScheduleRule(body) {
        return this.shiftScheduleService.validateScheduleRule(body.scheduleRuleId, body.assignmentDate ? new Date(body.assignmentDate) : undefined);
    }
    async applyScheduleRuleToShiftAssignment(body, user) {
        return this.shiftScheduleService.applyScheduleRuleToShiftAssignment(body.shiftAssignmentId, body.scheduleRuleId, user.userId);
    }
    async getShiftAssignmentsByScheduleRule(id) {
        return this.shiftScheduleService.getShiftAssignmentsByScheduleRule(id);
    }
    async isWorkingDayPerScheduleRule(body) {
        return this.shiftScheduleService.isWorkingDayPerScheduleRule(body.scheduleRuleId, new Date(body.checkDate), body.cycleStartDate ? new Date(body.cycleStartDate) : undefined);
    }
};
exports.ShiftAndScheduleController = ShiftAndScheduleController;
__decorate([
    (0, common_1.Post)('shift/type'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_dtos_1.CreateShiftTypeDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "createShiftType", null);
__decorate([
    (0, common_1.Get)('shift/types'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getShiftTypes", null);
__decorate([
    (0, common_1.Get)('shift/type/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getShiftTypeById", null);
__decorate([
    (0, common_1.Put)('shift/type/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shift_dtos_1.CreateShiftTypeDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "updateShiftType", null);
__decorate([
    (0, common_1.Delete)('shift/type/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "deleteShiftType", null);
__decorate([
    (0, common_1.Post)('shift'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_dtos_1.CreateShiftDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "createShift", null);
__decorate([
    (0, common_1.Get)('shifts'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Query)('active')),
    __param(1, (0, common_1.Query)('shiftType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getShifts", null);
__decorate([
    (0, common_1.Get)('shift/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getShiftById", null);
__decorate([
    (0, common_1.Put)('shift/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shift_dtos_1.UpdateShiftDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "updateShift", null);
__decorate([
    (0, common_1.Delete)('shift/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "deleteShift", null);
__decorate([
    (0, common_1.Get)('shifts/type/:shiftTypeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('shiftTypeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getShiftsByType", null);
__decorate([
    (0, common_1.Post)('shift/assign'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_dtos_1.AssignShiftToEmployeeDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "assignShiftToEmployee", null);
__decorate([
    (0, common_1.Post)('shift/assign/department'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_dtos_1.AssignShiftToDepartmentDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "assignShiftToDepartment", null);
__decorate([
    (0, common_1.Post)('shift/assign/position'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_dtos_1.AssignShiftToPositionDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "assignShiftToPosition", null);
__decorate([
    (0, common_1.Put)('shift/assignment/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shift_dtos_1.UpdateShiftAssignmentDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "updateShiftAssignment", null);
__decorate([
    (0, common_1.Get)('shift/assignments'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('employeeId')),
    __param(2, (0, common_1.Query)('departmentId')),
    __param(3, (0, common_1.Query)('positionId')),
    __param(4, (0, common_1.Query)('shiftId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getAllShiftAssignments", null);
__decorate([
    (0, common_1.Get)('shift/assignment/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getShiftAssignmentById", null);
__decorate([
    (0, common_1.Get)('shift/assignments/employee/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getEmployeeShiftAssignments", null);
__decorate([
    (0, common_1.Get)('shift/assignments/department/:departmentId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getDepartmentShiftAssignments", null);
__decorate([
    (0, common_1.Get)('shift/assignments/position/:positionId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('positionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getPositionShiftAssignments", null);
__decorate([
    (0, common_1.Get)('shift/assignment/:id/status'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getShiftAssignmentStatus", null);
__decorate([
    (0, common_1.Post)('shift/assignment/renew'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_dtos_1.RenewShiftAssignmentDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "renewShiftAssignment", null);
__decorate([
    (0, common_1.Post)('shift/assignment/cancel'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_dtos_1.CancelShiftAssignmentDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "cancelShiftAssignment", null);
__decorate([
    (0, common_1.Post)('shift/assignment/postpone'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_dtos_1.PostponeShiftAssignmentDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "postponeShiftAssignment", null);
__decorate([
    (0, common_1.Post)('shift/assignments/check-expired'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "checkExpiredAssignments", null);
__decorate([
    (0, common_1.Post)('schedule'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_dtos_1.CreateScheduleRuleDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "createScheduleRule", null);
__decorate([
    (0, common_1.Get)('schedules'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getScheduleRules", null);
__decorate([
    (0, common_1.Get)('schedule/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getScheduleRuleById", null);
__decorate([
    (0, common_1.Put)('schedule/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shift_dtos_1.CreateScheduleRuleDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "updateScheduleRule", null);
__decorate([
    (0, common_1.Delete)('schedule/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "deleteScheduleRule", null);
__decorate([
    (0, common_1.Post)('schedule/flexible'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_dtos_1.DefineFlexibleSchedulingRulesDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "defineFlexibleSchedulingRules", null);
__decorate([
    (0, common_1.Post)('schedule/validate'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "validateScheduleRule", null);
__decorate([
    (0, common_1.Post)('schedule/apply-to-assignment'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "applyScheduleRuleToShiftAssignment", null);
__decorate([
    (0, common_1.Get)('schedule/:id/assignments'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "getShiftAssignmentsByScheduleRule", null);
__decorate([
    (0, common_1.Post)('schedule/check-working-day'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShiftAndScheduleController.prototype, "isWorkingDayPerScheduleRule", null);
exports.ShiftAndScheduleController = ShiftAndScheduleController = __decorate([
    (0, common_1.Controller)('shift-schedule'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [shift_schedule_service_1.ShiftScheduleService])
], ShiftAndScheduleController);
//# sourceMappingURL=shift-schedule.controller.js.map