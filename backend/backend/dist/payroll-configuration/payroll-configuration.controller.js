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
exports.PayrollConfigurationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payroll_configuration_service_1 = require("./payroll-configuration.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payroll_configuration_enums_1 = require("./enums/payroll-configuration-enums");
const pay_grade_dto_1 = require("./dto/pay-grade.dto");
const approval_dto_1 = require("./dto/approval.dto");
const filter_dto_1 = require("./dto/filter.dto");
const allowance_dto_1 = require("./dto/allowance.dto");
const pay_type_dto_1 = require("./dto/pay-type.dto");
const tax_rule_dto_1 = require("./dto/tax-rule.dto");
const insurance_bracket_dto_1 = require("./dto/insurance-bracket.dto");
const signing_bonus_dto_1 = require("./dto/signing-bonus.dto");
const termination_benefit_dto_1 = require("./dto/termination-benefit.dto");
const payroll_policy_dto_1 = require("./dto/payroll-policy.dto");
const company_settings_dto_1 = require("./dto/company-settings.dto");
const object_id_pipe_1 = require("./common/pipes/object-id.pipe");
const roles_guard_1 = require("../common/guards/roles.guard");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const employee_profile_enums_1 = require("../employee-profile/enums/employee-profile.enums");
let PayrollConfigurationController = class PayrollConfigurationController {
    constructor(payrollConfigService, connection) {
        this.payrollConfigService = payrollConfigService;
        this.connection = connection;
    }
    async getPayGrades(filterDto) {
        return this.payrollConfigService.findAllPayGrades(filterDto);
    }
    async getPayGrade(id) {
        return this.payrollConfigService.findOnePayGrade(id);
    }
    async createPayGrade(createDto, user) {
        return this.payrollConfigService.createPayGrade(createDto, user.userId);
    }
    async updatePayGrade(id, updateDto, user) {
        return this.payrollConfigService.updatePayGrade(id, updateDto, user.userId);
    }
    async deletePayGrade(id) {
        return this.payrollConfigService.deletePayGrade(id);
    }
    async approvePayGrade(id, approvalDto, user) {
        return this.payrollConfigService.approvePayGrade(id, approvalDto, user.userId);
    }
    async rejectPayGrade(id, rejectionDto, user) {
        return this.payrollConfigService.rejectPayGrade(id, rejectionDto, user.userId);
    }
    async getConfigurationStats() {
        return this.payrollConfigService.getConfigurationStats();
    }
    async getPendingApprovals(userId) {
        return this.payrollConfigService.getPendingApprovals(userId);
    }
    async getDbDebug() {
        const db = this.connection?.db;
        if (!db) {
            throw new common_1.BadRequestException('Database connection not initialized');
        }
        const collections = await db.listCollections().toArray();
        return {
            database: db.databaseName,
            collections: collections.map((c) => c.name),
        };
    }
    async getCompanySettings() {
        return this.payrollConfigService.getCompanySettings();
    }
    async createCompanySettings(createDto, user) {
        if (!createDto) {
            throw new common_1.BadRequestException('Request body is required');
        }
        return this.payrollConfigService.createCompanySettings(createDto, user.userId);
    }
    async updateCompanySettings(updateDto, user) {
        return this.payrollConfigService.updateCompanySettings(updateDto, user.userId);
    }
    async getAllowances(filterDto) {
        return this.payrollConfigService.findAllAllowances(filterDto);
    }
    async getAllowance(id) {
        return this.payrollConfigService.findOneAllowance(id);
    }
    async createAllowance(createDto, user) {
        return this.payrollConfigService.createAllowance(createDto, user.userId);
    }
    async updateAllowance(id, updateDto, user) {
        return this.payrollConfigService.updateAllowance(id, updateDto, user.userId);
    }
    async deleteAllowance(id) {
        return this.payrollConfigService.deleteAllowance(id);
    }
    async approveAllowance(id, approvalDto, user) {
        return this.payrollConfigService.approveAllowance(id, approvalDto, user.userId);
    }
    async rejectAllowance(id, rejectionDto, user) {
        return this.payrollConfigService.rejectAllowance(id, rejectionDto, user.userId);
    }
    async getPayTypes(filterDto) {
        return this.payrollConfigService.findAllPayTypes(filterDto);
    }
    async getPayType(id) {
        return this.payrollConfigService.findOnePayType(id);
    }
    async createPayType(createDto, user) {
        return this.payrollConfigService.createPayType(createDto, user.userId);
    }
    async updatePayType(id, updateDto, user) {
        return this.payrollConfigService.updatePayType(id, updateDto, user.userId);
    }
    async deletePayType(id) {
        return this.payrollConfigService.deletePayType(id);
    }
    async approvePayType(id, approvalDto, user) {
        return this.payrollConfigService.approvePayType(id, approvalDto, user.userId);
    }
    async rejectPayType(id, rejectionDto, user) {
        return this.payrollConfigService.rejectPayType(id, rejectionDto, user.userId);
    }
    async getTaxRules(filterDto) {
        return this.payrollConfigService.findAllTaxRules(filterDto);
    }
    async getTaxRule(id) {
        return this.payrollConfigService.findOneTaxRule(id);
    }
    async createTaxRule(createDto, user) {
        return this.payrollConfigService.createTaxRule(createDto, user.userId);
    }
    async updateTaxRule(id, updateDto, user) {
        return this.payrollConfigService.updateTaxRule(id, updateDto, user.userId);
    }
    async deleteTaxRule(id) {
        return this.payrollConfigService.deleteTaxRule(id);
    }
    async approveTaxRule(id, approvalDto, user) {
        return this.payrollConfigService.approveTaxRule(id, approvalDto, user.userId);
    }
    async rejectTaxRule(id, rejectionDto, user) {
        return this.payrollConfigService.rejectTaxRule(id, rejectionDto, user.userId);
    }
    async getInsuranceBrackets(filterDto) {
        return this.payrollConfigService.findAllInsuranceBrackets(filterDto);
    }
    async getInsuranceBracket(id) {
        return this.payrollConfigService.findOneInsuranceBracket(id);
    }
    async createInsuranceBracket(createDto, user) {
        return this.payrollConfigService.createInsuranceBracket(createDto, user.userId);
    }
    async updateInsuranceBracket(id, updateDto, user) {
        return this.payrollConfigService.updateInsuranceBracket(id, updateDto, user.userId);
    }
    async deleteInsuranceBracket(id) {
        return this.payrollConfigService.deleteInsuranceBracket(id);
    }
    async approveInsuranceBracket(id, approvalDto, user) {
        return this.payrollConfigService.approveInsuranceBracket(id, approvalDto, user.userId);
    }
    async rejectInsuranceBracket(id, rejectionDto, user) {
        return this.payrollConfigService.rejectInsuranceBracket(id, rejectionDto, user.userId);
    }
    async getSigningBonuses(filterDto) {
        return this.payrollConfigService.findAllSigningBonuses(filterDto);
    }
    async getSigningBonus(id) {
        return this.payrollConfigService.findOneSigningBonus(id);
    }
    async createSigningBonus(createDto, user) {
        return this.payrollConfigService.createSigningBonus(createDto, user.userId);
    }
    async updateSigningBonus(id, updateDto, user) {
        return this.payrollConfigService.updateSigningBonus(id, updateDto, user.userId);
    }
    async deleteSigningBonus(id) {
        return this.payrollConfigService.deleteSigningBonus(id);
    }
    async approveSigningBonus(id, approvalDto, user) {
        return this.payrollConfigService.approveSigningBonus(id, approvalDto, user.userId);
    }
    async rejectSigningBonus(id, rejectionDto, user) {
        return this.payrollConfigService.rejectSigningBonus(id, rejectionDto, user.userId);
    }
    async getTerminationBenefits(filterDto) {
        return this.payrollConfigService.findAllTerminationBenefits(filterDto);
    }
    async getTerminationBenefit(id) {
        return this.payrollConfigService.findOneTerminationBenefit(id);
    }
    async createTerminationBenefit(createDto, user) {
        return this.payrollConfigService.createTerminationBenefit(createDto, user.userId);
    }
    async updateTerminationBenefit(id, updateDto, user) {
        return this.payrollConfigService.updateTerminationBenefit(id, updateDto, user.userId);
    }
    async deleteTerminationBenefit(id) {
        return this.payrollConfigService.deleteTerminationBenefit(id);
    }
    async approveTerminationBenefit(id, approvalDto, user) {
        return this.payrollConfigService.approveTerminationBenefit(id, approvalDto, user.userId);
    }
    async rejectTerminationBenefit(id, rejectionDto, user) {
        return this.payrollConfigService.rejectTerminationBenefit(id, rejectionDto, user.userId);
    }
    async getPayrollPolicies(filterDto) {
        return this.payrollConfigService.findAllPayrollPolicies(filterDto);
    }
    async getPayrollPolicy(id) {
        return this.payrollConfigService.findOnePayrollPolicy(id);
    }
    async createPayrollPolicy(createDto, user) {
        return this.payrollConfigService.createPayrollPolicy(createDto, user.userId);
    }
    async updatePayrollPolicy(id, updateDto, user) {
        return this.payrollConfigService.updatePayrollPolicy(id, updateDto, user.userId);
    }
    async deletePayrollPolicy(id) {
        return this.payrollConfigService.deletePayrollPolicy(id);
    }
    async approvePayrollPolicy(id, approvalDto, user) {
        return this.payrollConfigService.approvePayrollPolicy(id, approvalDto, user.userId);
    }
    async rejectPayrollPolicy(id, rejectionDto, user) {
        return this.payrollConfigService.rejectPayrollPolicy(id, rejectionDto, user.userId);
    }
};
exports.PayrollConfigurationController = PayrollConfigurationController;
__decorate([
    (0, common_1.Get)('pay-grades'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pay grades with pagination and filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: payroll_configuration_enums_1.ConfigStatus }),
    (0, swagger_1.ApiQuery)({ name: 'createdBy', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns paginated list of pay grades',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getPayGrades", null);
__decorate([
    (0, common_1.Get)('pay-grades/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pay grade by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Pay grade ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns pay grade details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pay grade not found' }),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getPayGrade", null);
__decorate([
    (0, common_1.Post)('pay-grades'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new pay grade' }),
    (0, swagger_1.ApiBody)({ type: pay_grade_dto_1.CreatePayGradeDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pay grade created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pay_grade_dto_1.CreatePayGradeDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "createPayGrade", null);
__decorate([
    (0, common_1.Put)('pay-grades/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a pay grade (DRAFT only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Pay grade ID' }),
    (0, swagger_1.ApiBody)({ type: pay_grade_dto_1.UpdatePayGradeDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pay grade updated successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot update non-DRAFT pay grade',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pay grade not found' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pay_grade_dto_1.UpdatePayGradeDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "updatePayGrade", null);
__decorate([
    (0, common_1.Delete)('pay-grades/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a pay grade (DRAFT only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Pay grade ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pay grade deleted successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot delete non-DRAFT pay grade',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pay grade not found' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "deletePayGrade", null);
__decorate([
    (0, common_1.Post)('pay-grades/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a pay grade' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Pay grade ID' }),
    (0, swagger_1.ApiBody)({ type: approval_dto_1.ApprovalDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pay grade approved successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot approve non-DRAFT pay grade',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pay grade not found' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.ApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "approvePayGrade", null);
__decorate([
    (0, common_1.Post)('pay-grades/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a pay grade' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Pay grade ID' }),
    (0, swagger_1.ApiBody)({ type: approval_dto_1.RejectionDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pay grade rejected successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Cannot reject non-DRAFT pay grade',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pay grade not found' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.RejectionDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "rejectPayGrade", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get configuration statistics dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns configuration statistics' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getConfigurationStats", null);
__decorate([
    (0, common_1.Get)('pending-approvals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pending approvals' }),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        required: false,
        description: 'Filter by user ID',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns pending approval items' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getPendingApprovals", null);
__decorate([
    (0, common_1.Get)('debug/db'),
    (0, swagger_1.ApiOperation)({ summary: 'Debug database connection info' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getDbDebug", null);
__decorate([
    (0, common_1.Get)('company-settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get company-wide settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns company settings' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Company settings not found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getCompanySettings", null);
__decorate([
    (0, common_1.Post)('company-settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Create company-wide settings' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Company settings created' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Company settings already exist' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_settings_dto_1.CreateCompanySettingsDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "createCompanySettings", null);
__decorate([
    (0, common_1.Put)('company-settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update company-wide settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company settings updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Company settings not found' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_settings_dto_1.UpdateCompanySettingsDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "updateCompanySettings", null);
__decorate([
    (0, common_1.Get)('allowances'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all allowances with pagination and filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: payroll_configuration_enums_1.ConfigStatus }),
    (0, swagger_1.ApiQuery)({ name: 'createdBy', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getAllowances", null);
__decorate([
    (0, common_1.Get)('allowances/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get allowance by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allowance ID' }),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getAllowance", null);
__decorate([
    (0, common_1.Post)('allowances'),
    (0, swagger_1.ApiOperation)({ summary: 'Create allowance (DRAFT)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [allowance_dto_1.CreateAllowanceDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "createAllowance", null);
__decorate([
    (0, common_1.Put)('allowances/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update allowance (DRAFT only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allowance ID' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, allowance_dto_1.UpdateAllowanceDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "updateAllowance", null);
__decorate([
    (0, common_1.Delete)('allowances/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete allowance (DRAFT only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Allowance ID' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "deleteAllowance", null);
__decorate([
    (0, common_1.Post)('allowances/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve allowance' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.ApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "approveAllowance", null);
__decorate([
    (0, common_1.Post)('allowances/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject allowance' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.RejectionDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "rejectAllowance", null);
__decorate([
    (0, common_1.Get)('pay-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pay types with pagination and filtering' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getPayTypes", null);
__decorate([
    (0, common_1.Get)('pay-types/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pay type by ID' }),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getPayType", null);
__decorate([
    (0, common_1.Post)('pay-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Create pay type (DRAFT)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pay_type_dto_1.CreatePayTypeDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "createPayType", null);
__decorate([
    (0, common_1.Put)('pay-types/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update pay type (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pay_type_dto_1.UpdatePayTypeDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "updatePayType", null);
__decorate([
    (0, common_1.Delete)('pay-types/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete pay type (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "deletePayType", null);
__decorate([
    (0, common_1.Post)('pay-types/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve pay type' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.ApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "approvePayType", null);
__decorate([
    (0, common_1.Post)('pay-types/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject pay type' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.RejectionDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "rejectPayType", null);
__decorate([
    (0, common_1.Get)('tax-rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tax rules with pagination and filtering' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getTaxRules", null);
__decorate([
    (0, common_1.Get)('tax-rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tax rule by ID' }),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getTaxRule", null);
__decorate([
    (0, common_1.Post)('tax-rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create tax rule (DRAFT)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.LEGAL_POLICY_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tax_rule_dto_1.CreateTaxRuleDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "createTaxRule", null);
__decorate([
    (0, common_1.Put)('tax-rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tax rule (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.LEGAL_POLICY_ADMIN),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tax_rule_dto_1.UpdateTaxRuleDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "updateTaxRule", null);
__decorate([
    (0, common_1.Delete)('tax-rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete tax rule (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "deleteTaxRule", null);
__decorate([
    (0, common_1.Post)('tax-rules/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve tax rule' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.ApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "approveTaxRule", null);
__decorate([
    (0, common_1.Post)('tax-rules/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject tax rule' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.RejectionDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "rejectTaxRule", null);
__decorate([
    (0, common_1.Get)('insurance-brackets'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all insurance brackets with pagination and filtering',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getInsuranceBrackets", null);
__decorate([
    (0, common_1.Get)('insurance-brackets/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get insurance bracket by ID' }),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getInsuranceBracket", null);
__decorate([
    (0, common_1.Post)('insurance-brackets'),
    (0, swagger_1.ApiOperation)({ summary: 'Create insurance bracket (DRAFT)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [insurance_bracket_dto_1.CreateInsuranceBracketDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "createInsuranceBracket", null);
__decorate([
    (0, common_1.Put)('insurance-brackets/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update insurance bracket (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, insurance_bracket_dto_1.UpdateInsuranceBracketDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "updateInsuranceBracket", null);
__decorate([
    (0, common_1.Delete)('insurance-brackets/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete insurance bracket (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "deleteInsuranceBracket", null);
__decorate([
    (0, common_1.Post)('insurance-brackets/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve insurance bracket' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.ApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "approveInsuranceBracket", null);
__decorate([
    (0, common_1.Post)('insurance-brackets/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject insurance bracket' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.RejectionDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "rejectInsuranceBracket", null);
__decorate([
    (0, common_1.Get)('signing-bonuses'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all signing bonuses with pagination and filtering',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getSigningBonuses", null);
__decorate([
    (0, common_1.Get)('signing-bonuses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get signing bonus by ID' }),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getSigningBonus", null);
__decorate([
    (0, common_1.Post)('signing-bonuses'),
    (0, swagger_1.ApiOperation)({ summary: 'Create signing bonus (DRAFT)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signing_bonus_dto_1.CreateSigningBonusDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "createSigningBonus", null);
__decorate([
    (0, common_1.Put)('signing-bonuses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update signing bonus (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, signing_bonus_dto_1.UpdateSigningBonusDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "updateSigningBonus", null);
__decorate([
    (0, common_1.Delete)('signing-bonuses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete signing bonus (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "deleteSigningBonus", null);
__decorate([
    (0, common_1.Post)('signing-bonuses/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve signing bonus' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.ApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "approveSigningBonus", null);
__decorate([
    (0, common_1.Post)('signing-bonuses/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject signing bonus' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.RejectionDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "rejectSigningBonus", null);
__decorate([
    (0, common_1.Get)('termination-benefits'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all termination benefits with pagination and filtering',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getTerminationBenefits", null);
__decorate([
    (0, common_1.Get)('termination-benefits/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get termination benefit by ID' }),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getTerminationBenefit", null);
__decorate([
    (0, common_1.Post)('termination-benefits'),
    (0, swagger_1.ApiOperation)({ summary: 'Create termination benefit (DRAFT)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [termination_benefit_dto_1.CreateTerminationBenefitDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "createTerminationBenefit", null);
__decorate([
    (0, common_1.Put)('termination-benefits/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update termination benefit (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, termination_benefit_dto_1.UpdateTerminationBenefitDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "updateTerminationBenefit", null);
__decorate([
    (0, common_1.Delete)('termination-benefits/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete termination benefit (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "deleteTerminationBenefit", null);
__decorate([
    (0, common_1.Post)('termination-benefits/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve termination benefit' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.ApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "approveTerminationBenefit", null);
__decorate([
    (0, common_1.Post)('termination-benefits/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject termination benefit' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.RejectionDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "rejectTerminationBenefit", null);
__decorate([
    (0, common_1.Get)('policies'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all payroll policies with pagination and filtering',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getPayrollPolicies", null);
__decorate([
    (0, common_1.Get)('policies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payroll policy by ID' }),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "getPayrollPolicy", null);
__decorate([
    (0, common_1.Post)('policies'),
    (0, swagger_1.ApiOperation)({ summary: 'Create payroll policy (DRAFT)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payroll_policy_dto_1.CreatePayrollPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "createPayrollPolicy", null);
__decorate([
    (0, common_1.Put)('policies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update payroll policy (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payroll_policy_dto_1.UpdatePayrollPolicyDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "updatePayrollPolicy", null);
__decorate([
    (0, common_1.Delete)('policies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete payroll policy (DRAFT only)' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "deletePayrollPolicy", null);
__decorate([
    (0, common_1.Post)('policies/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve payroll policy' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.ApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "approvePayrollPolicy", null);
__decorate([
    (0, common_1.Post)('policies/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject payroll policy' }),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id', object_id_pipe_1.ObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_dto_1.RejectionDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollConfigurationController.prototype, "rejectPayrollPolicy", null);
exports.PayrollConfigurationController = PayrollConfigurationController = __decorate([
    (0, swagger_1.ApiTags)('payroll-configuration'),
    (0, common_1.Controller)('payroll-configuration'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [payroll_configuration_service_1.PayrollConfigurationService,
        mongoose_2.Connection])
], PayrollConfigurationController);
//# sourceMappingURL=payroll-configuration.controller.js.map