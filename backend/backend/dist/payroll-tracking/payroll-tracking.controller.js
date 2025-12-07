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
exports.PayrollTrackingController = void 0;
const common_1 = require("@nestjs/common");
const payroll_tracking_service_1 = require("./payroll-tracking.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const employee_profile_enums_1 = require("../employee-profile/enums/employee-profile.enums");
const CreateClaimDTO_dto_1 = require("./dto/CreateClaimDTO.dto");
const UpdateClaimDTO_dto_1 = require("./dto/UpdateClaimDTO.dto");
const CreateDisputeDTO_dto_1 = require("./dto/CreateDisputeDTO.dto");
const UpdateDisputeDTO_dto_1 = require("./dto/UpdateDisputeDTO.dto");
const CreateRefundDTO_dto_1 = require("./dto/CreateRefundDTO.dto");
const UpdateRefundDTO_dto_1 = require("./dto/UpdateRefundDTO.dto");
const ApproveClaimBySpecialistDTO_dto_1 = require("./dto/ApproveClaimBySpecialistDTO.dto");
const RejectClaimBySpecialistDTO_dto_1 = require("./dto/RejectClaimBySpecialistDTO.dto");
const ConfirmClaimApprovalDTO_dto_1 = require("./dto/ConfirmClaimApprovalDTO.dto");
const ApproveDisputeBySpecialistDTO_dto_1 = require("./dto/ApproveDisputeBySpecialistDTO.dto");
const RejectDisputeBySpecialistDTO_dto_1 = require("./dto/RejectDisputeBySpecialistDTO.dto");
const ConfirmDisputeApprovalDTO_dto_1 = require("./dto/ConfirmDisputeApprovalDTO.dto");
const GenerateRefundForDisputeDTO_dto_1 = require("./dto/GenerateRefundForDisputeDTO.dto");
const GenerateRefundForClaimDTO_dto_1 = require("./dto/GenerateRefundForClaimDTO.dto");
const ProcessRefundDTO_dto_1 = require("./dto/ProcessRefundDTO.dto");
let PayrollTrackingController = class PayrollTrackingController {
    constructor(payrollTrackingService) {
        this.payrollTrackingService = payrollTrackingService;
    }
    async createClaim(createClaimDTO, user) {
        return await this.payrollTrackingService.createClaim(createClaimDTO, user.userId);
    }
    async getPendingClaims(user) {
        return await this.payrollTrackingService.getPendingClaims();
    }
    async getApprovedClaimsForFinance(user) {
        return await this.payrollTrackingService.getApprovedClaimsForFinance();
    }
    async getClaimsByEmployeeId(employeeId, user) {
        return await this.payrollTrackingService.getClaimsByEmployeeId(employeeId);
    }
    async getClaimById(claimId, user) {
        return await this.payrollTrackingService.getClaimById(claimId);
    }
    async updateClaim(claimId, updateClaimDTO, user) {
        return await this.payrollTrackingService.updateClaim(claimId, updateClaimDTO, user.userId);
    }
    async approveClaimBySpecialist(claimId, approveClaimBySpecialistDTO, user) {
        return await this.payrollTrackingService.approveClaimBySpecialist(claimId, approveClaimBySpecialistDTO, user.userId);
    }
    async rejectClaimBySpecialist(claimId, rejectClaimBySpecialistDTO, user) {
        return await this.payrollTrackingService.rejectClaimBySpecialist(claimId, rejectClaimBySpecialistDTO, user.userId);
    }
    async confirmClaimApproval(claimId, confirmClaimApprovalDTO, user) {
        return await this.payrollTrackingService.confirmClaimApproval(claimId, confirmClaimApprovalDTO, user.userId);
    }
    async createDispute(createDisputeDTO, user) {
        return await this.payrollTrackingService.createDispute(createDisputeDTO, user.userId);
    }
    async getPendingDisputes(user) {
        return await this.payrollTrackingService.getPendingDisputes();
    }
    async getApprovedDisputesForFinance(user) {
        return await this.payrollTrackingService.getApprovedDisputesForFinance();
    }
    async getDisputesByEmployeeId(employeeId, user) {
        return await this.payrollTrackingService.getDisputesByEmployeeId(employeeId);
    }
    async getDisputeById(disputeId, user) {
        return await this.payrollTrackingService.getDisputeById(disputeId);
    }
    async updateDispute(disputeId, updateDisputeDTO, user) {
        return await this.payrollTrackingService.updateDispute(disputeId, updateDisputeDTO, user.userId);
    }
    async approveDisputeBySpecialist(disputeId, approveDisputeBySpecialistDTO, user) {
        return await this.payrollTrackingService.approveDisputeBySpecialist(disputeId, approveDisputeBySpecialistDTO, user.userId);
    }
    async rejectDisputeBySpecialist(disputeId, rejectDisputeBySpecialistDTO, user) {
        return await this.payrollTrackingService.rejectDisputeBySpecialist(disputeId, rejectDisputeBySpecialistDTO, user.userId);
    }
    async confirmDisputeApproval(disputeId, confirmDisputeApprovalDTO, user) {
        return await this.payrollTrackingService.confirmDisputeApproval(disputeId, confirmDisputeApprovalDTO, user.userId);
    }
    async createRefund(createRefundDTO, user) {
        return await this.payrollTrackingService.createRefund(createRefundDTO, user.userId);
    }
    async getPendingRefunds(user) {
        return await this.payrollTrackingService.getPendingRefunds();
    }
    async getRefundsByEmployeeId(employeeId, user) {
        return await this.payrollTrackingService.getRefundsByEmployeeId(employeeId);
    }
    async getRefundById(refundId, user) {
        return await this.payrollTrackingService.getRefundById(refundId);
    }
    async updateRefund(refundId, updateRefundDTO, user) {
        return await this.payrollTrackingService.updateRefund(refundId, updateRefundDTO, user.userId);
    }
    async processRefund(refundId, processRefundDTO, user) {
        return await this.payrollTrackingService.processRefund(refundId, processRefundDTO, user.userId);
    }
    async generateRefundForDispute(disputeId, generateRefundForDisputeDTO, user) {
        return await this.payrollTrackingService.generateRefundForDispute(disputeId, generateRefundForDisputeDTO, user.userId);
    }
    async generateRefundForClaim(claimId, generateRefundForClaimDTO, user) {
        return await this.payrollTrackingService.generateRefundForClaim(claimId, generateRefundForClaimDTO, user.userId);
    }
    async getPayslipsByEmployeeId(employeeId, user) {
        return await this.payrollTrackingService.getPayslipsByEmployeeId(employeeId);
    }
    async getPayslipById(employeeId, payslipId, user) {
        return await this.payrollTrackingService.getPayslipById(payslipId, employeeId);
    }
    async getEmployeeBaseSalary(employeeId, user) {
        return await this.payrollTrackingService.getEmployeeBaseSalary(employeeId);
    }
    async getLeaveEncashmentByEmployeeId(employeeId, user, payrollRunId) {
        return await this.payrollTrackingService.getLeaveEncashmentByEmployeeId(employeeId, payrollRunId);
    }
    async getTransportationAllowance(employeeId, user, payslipId) {
        return await this.payrollTrackingService.getTransportationAllowance(employeeId, payslipId);
    }
    async getTaxDeductions(employeeId, user, payslipId) {
        return await this.payrollTrackingService.getTaxDeductions(employeeId, payslipId);
    }
    async getInsuranceDeductions(employeeId, user, payslipId) {
        return await this.payrollTrackingService.getInsuranceDeductions(employeeId, payslipId);
    }
    async getMisconductDeductions(employeeId, user, payslipId) {
        return await this.payrollTrackingService.getMisconductDeductions(employeeId, payslipId);
    }
    async getUnpaidLeaveDeductions(employeeId, user, payslipId) {
        return await this.payrollTrackingService.getUnpaidLeaveDeductions(employeeId, payslipId);
    }
    async getSalaryHistory(employeeId, user, limit) {
        return await this.payrollTrackingService.getSalaryHistory(employeeId, limit ? parseInt(limit, 10) : 12);
    }
    async getEmployerContributions(employeeId, user, payslipId) {
        return await this.payrollTrackingService.getEmployerContributions(employeeId, payslipId);
    }
    async getTaxDocuments(employeeId, user, year) {
        return await this.payrollTrackingService.getTaxDocuments(employeeId, year ? parseInt(year, 10) : undefined);
    }
    async getPayrollReportByDepartment(departmentId, user, payrollRunId) {
        return await this.payrollTrackingService.getPayrollReportByDepartment(departmentId, payrollRunId);
    }
    async getPayrollSummary(period, user, date, departmentId) {
        return await this.payrollTrackingService.getPayrollSummary(period, date ? new Date(date) : undefined, departmentId);
    }
    async getTaxInsuranceBenefitsReport(period, user, date, departmentId) {
        return await this.payrollTrackingService.getTaxInsuranceBenefitsReport(period, date ? new Date(date) : undefined, departmentId);
    }
    async getActiveDepartments(user) {
        return await this.payrollTrackingService.getActiveDepartments();
    }
    async getPayrollSummaryByAllDepartments(period, user, date) {
        return await this.payrollTrackingService.getPayrollSummaryByAllDepartments(period, date ? new Date(date) : undefined);
    }
};
exports.PayrollTrackingController = PayrollTrackingController;
__decorate([
    (0, common_1.Post)('claims'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateClaimDTO_dto_1.CreateClaimDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "createClaim", null);
__decorate([
    (0, common_1.Get)('claims/pending'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getPendingClaims", null);
__decorate([
    (0, common_1.Get)('claims/approved'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getApprovedClaimsForFinance", null);
__decorate([
    (0, common_1.Get)('claims/employee/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getClaimsByEmployeeId", null);
__decorate([
    (0, common_1.Get)('claims/:claimId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('claimId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getClaimById", null);
__decorate([
    (0, common_1.Put)('claims/:claimId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('claimId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateClaimDTO_dto_1.UpdateClaimDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "updateClaim", null);
__decorate([
    (0, common_1.Put)('claims/:claimId/approve-by-specialist'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('claimId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ApproveClaimBySpecialistDTO_dto_1.ApproveClaimBySpecialistDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "approveClaimBySpecialist", null);
__decorate([
    (0, common_1.Put)('claims/:claimId/reject-by-specialist'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('claimId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RejectClaimBySpecialistDTO_dto_1.RejectClaimBySpecialistDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "rejectClaimBySpecialist", null);
__decorate([
    (0, common_1.Put)('claims/:claimId/confirm-approval'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('claimId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ConfirmClaimApprovalDTO_dto_1.ConfirmClaimApprovalDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "confirmClaimApproval", null);
__decorate([
    (0, common_1.Post)('disputes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateDisputeDTO_dto_1.CreateDisputeDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "createDispute", null);
__decorate([
    (0, common_1.Get)('disputes/pending'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getPendingDisputes", null);
__decorate([
    (0, common_1.Get)('disputes/approved'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getApprovedDisputesForFinance", null);
__decorate([
    (0, common_1.Get)('disputes/employee/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getDisputesByEmployeeId", null);
__decorate([
    (0, common_1.Get)('disputes/:disputeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('disputeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getDisputeById", null);
__decorate([
    (0, common_1.Put)('disputes/:disputeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('disputeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateDisputeDTO_dto_1.UpdateDisputeDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "updateDispute", null);
__decorate([
    (0, common_1.Put)('disputes/:disputeId/approve-by-specialist'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('disputeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ApproveDisputeBySpecialistDTO_dto_1.ApproveDisputeBySpecialistDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "approveDisputeBySpecialist", null);
__decorate([
    (0, common_1.Put)('disputes/:disputeId/reject-by-specialist'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('disputeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RejectDisputeBySpecialistDTO_dto_1.RejectDisputeBySpecialistDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "rejectDisputeBySpecialist", null);
__decorate([
    (0, common_1.Put)('disputes/:disputeId/confirm-approval'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('disputeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ConfirmDisputeApprovalDTO_dto_1.ConfirmDisputeApprovalDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "confirmDisputeApproval", null);
__decorate([
    (0, common_1.Post)('refunds'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRefundDTO_dto_1.CreateRefundDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "createRefund", null);
__decorate([
    (0, common_1.Get)('refunds/pending'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getPendingRefunds", null);
__decorate([
    (0, common_1.Get)('refunds/employee/:employeeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getRefundsByEmployeeId", null);
__decorate([
    (0, common_1.Get)('refunds/:refundId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('refundId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getRefundById", null);
__decorate([
    (0, common_1.Put)('refunds/:refundId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('refundId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateRefundDTO_dto_1.UpdateRefundDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "updateRefund", null);
__decorate([
    (0, common_1.Put)('refunds/:refundId/process'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('refundId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ProcessRefundDTO_dto_1.ProcessRefundDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "processRefund", null);
__decorate([
    (0, common_1.Post)('refunds/dispute/:disputeId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('disputeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, GenerateRefundForDisputeDTO_dto_1.GenerateRefundForDisputeDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "generateRefundForDispute", null);
__decorate([
    (0, common_1.Post)('refunds/claim/:claimId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('claimId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, GenerateRefundForClaimDTO_dto_1.GenerateRefundForClaimDTO, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "generateRefundForClaim", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/payslips'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getPayslipsByEmployeeId", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/payslips/:payslipId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Param)('payslipId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getPayslipById", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/base-salary'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getEmployeeBaseSalary", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/leave-encashment'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('payrollRunId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getLeaveEncashmentByEmployeeId", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/transportation-allowance'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('payslipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getTransportationAllowance", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/tax-deductions'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('payslipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getTaxDeductions", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/insurance-deductions'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('payslipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getInsuranceDeductions", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/misconduct-deductions'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('payslipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getMisconductDeductions", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/unpaid-leave-deductions'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('payslipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getUnpaidLeaveDeductions", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/salary-history'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getSalaryHistory", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/employer-contributions'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('payslipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getEmployerContributions", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/tax-documents'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getTaxDocuments", null);
__decorate([
    (0, common_1.Get)('reports/department/:departmentId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('departmentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('payrollRunId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getPayrollReportByDepartment", null);
__decorate([
    (0, common_1.Get)('reports/payroll-summary'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getPayrollSummary", null);
__decorate([
    (0, common_1.Get)('reports/tax-insurance-benefits'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getTaxInsuranceBenefitsReport", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getActiveDepartments", null);
__decorate([
    (0, common_1.Get)('reports/departments-summary'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.FINANCE_STAFF, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollTrackingController.prototype, "getPayrollSummaryByAllDepartments", null);
exports.PayrollTrackingController = PayrollTrackingController = __decorate([
    (0, common_1.Controller)('payroll-tracking'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [payroll_tracking_service_1.PayrollTrackingService])
], PayrollTrackingController);
//# sourceMappingURL=payroll-tracking.controller.js.map