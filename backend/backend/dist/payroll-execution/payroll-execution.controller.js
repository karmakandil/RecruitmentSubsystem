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
exports.PayrollExecutionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const employee_profile_enums_1 = require("../employee-profile/enums/employee-profile.enums");
const payroll_execution_service_1 = require("./payroll-execution.service");
const CreatePayrollRunDto_dto_1 = require("./dto/CreatePayrollRunDto.dto");
const EmployeePayrollDetailsUpsertDto_dto_1 = require("./dto/EmployeePayrollDetailsUpsertDto.dto");
const PublishRunForApprovalDto_dto_1 = require("./dto/PublishRunForApprovalDto.dto");
const FlagPayrollExceptionDto_dto_1 = require("./dto/FlagPayrollExceptionDto.dto");
const UnlockPayrollDto_dto_1 = require("./dto/UnlockPayrollDto.dto");
const SigningBonusReviewDto_dto_1 = require("./dto/SigningBonusReviewDto.dto");
const SigningBonusEditDto_dto_1 = require("./dto/SigningBonusEditDto.dto");
const CreateEmployeeTerminationBenefitDto_dto_1 = require("./dto/CreateEmployeeTerminationBenefitDto.dto");
const CreateEmployeeSigningBonusDto_dto_1 = require("./dto/CreateEmployeeSigningBonusDto.dto");
const TerminationBenefitReviewDto_dto_1 = require("./dto/TerminationBenefitReviewDto.dto");
const TerminationBenefitEditDto_dto_1 = require("./dto/TerminationBenefitEditDto.dto");
const ManagerApprovalReviewDto_dto_1 = require("./dto/ManagerApprovalReviewDto.dto");
const FinanceDecisionDto_dto_1 = require("./dto/FinanceDecisionDto.dto");
const ReviewPayrollPeriodDto_dto_1 = require("./dto/ReviewPayrollPeriodDto.dto");
const EditPayrollPeriodDto_dto_1 = require("./dto/EditPayrollPeriodDto.dto");
const ProcessPayrollInitiationDto_dto_1 = require("./dto/ProcessPayrollInitiationDto.dto");
const ReviewPayrollInitiationDto_dto_1 = require("./dto/ReviewPayrollInitiationDto.dto");
const CalculatePayrollDto_dto_1 = require("./dto/CalculatePayrollDto.dto");
const CalculateProratedSalaryDto_dto_1 = require("./dto/CalculateProratedSalaryDto.dto");
const ApplyStatutoryRulesDto_dto_1 = require("./dto/ApplyStatutoryRulesDto.dto");
const GenerateDraftPayrollRunDto_dto_1 = require("./dto/GenerateDraftPayrollRunDto.dto");
const GenerateAndDistributePayslipsDto_dto_1 = require("./dto/GenerateAndDistributePayslipsDto.dto");
const SendForApprovalDto_dto_1 = require("./dto/SendForApprovalDto.dto");
const ResolveIrregularityDto_dto_1 = require("./dto/ResolveIrregularityDto.dto");
let PayrollExecutionController = class PayrollExecutionController {
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async createPayrollRun(createPayrollRunDto, user) {
        return this.payrollService.createPayrollRun(createPayrollRunDto, user.userId);
    }
    async reviewPayroll(id, publishRunForApprovalDto, user) {
        return this.payrollService.reviewPayroll(id, publishRunForApprovalDto, user.userId);
    }
    async generateEmployeePayrollDetails(employeePayrollDetailsDto, user) {
        return this.payrollService.generateEmployeePayrollDetails(employeePayrollDetailsDto, user.userId);
    }
    async flagPayrollException(flagPayrollExceptionDto, user) {
        return this.payrollService.flagPayrollException(flagPayrollExceptionDto.payrollRunId, flagPayrollExceptionDto.code, flagPayrollExceptionDto.message, user.userId);
    }
    async detectIrregularities(payrollRunId, user) {
        return this.payrollService.detectIrregularities(payrollRunId, user.userId);
    }
    async lockPayroll(id, user) {
        return this.payrollService.lockPayroll(id, user.userId);
    }
    async unlockPayroll(id, unlockPayrollDto, user) {
        return this.payrollService.unlockPayroll(id, unlockPayrollDto.unlockReason, user.userId);
    }
    async freezePayroll(id, user) {
        return this.payrollService.freezePayroll(id, user.userId);
    }
    async unfreezePayroll(id, unlockPayrollDto, user) {
        return this.payrollService.unfreezePayroll(id, unlockPayrollDto.unlockReason, user.userId);
    }
    async processPayrollInitiation(processPayrollInitiationDto, user) {
        return this.payrollService.processPayrollInitiation(new Date(processPayrollInitiationDto.payrollPeriod), processPayrollInitiationDto.entity, processPayrollInitiationDto.payrollSpecialistId, processPayrollInitiationDto.currency, user.userId, processPayrollInitiationDto.payrollManagerId);
    }
    async reviewPayrollInitiation(runId, reviewPayrollInitiationDto, user) {
        return this.payrollService.reviewPayrollInitiation(runId, reviewPayrollInitiationDto.approved, reviewPayrollInitiationDto.reviewerId, reviewPayrollInitiationDto.rejectionReason, user.userId);
    }
    async editPayrollInitiation(runId, updates, user) {
        return this.payrollService.editPayrollInitiation(runId, updates, user.userId);
    }
    async reviewPayrollPeriod(reviewDto, user) {
        return this.payrollService.reviewPayrollPeriod(reviewDto, user.userId);
    }
    async editPayrollPeriod(editDto, user) {
        return this.payrollService.editPayrollPeriod(editDto, user.userId);
    }
    async processSigningBonuses(user) {
        return this.payrollService.processSigningBonuses(user.userId);
    }
    async createEmployeeSigningBonus(createDto, user) {
        return this.payrollService.createEmployeeSigningBonus(createDto, user.userId);
    }
    async reviewSigningBonus(reviewDto, user) {
        return this.payrollService.reviewSigningBonus(reviewDto, user.userId);
    }
    async editSigningBonus(editDto, user) {
        return this.payrollService.editSigningBonus(editDto, user.userId);
    }
    async processTerminationResignationBenefits(user) {
        return this.payrollService.processTerminationResignationBenefits(user.userId);
    }
    async createEmployeeTerminationBenefit(createDto, user) {
        return this.payrollService.createEmployeeTerminationBenefit(createDto, user.userId);
    }
    async reviewTerminationBenefit(reviewDto, user) {
        return this.payrollService.reviewTerminationBenefit(reviewDto, user.userId);
    }
    async editTerminationBenefit(editDto, user) {
        return this.payrollService.editTerminationBenefit(editDto, user.userId);
    }
    async calculatePayroll(calculatePayrollDto, user) {
        return this.payrollService.calculatePayroll(calculatePayrollDto.employeeId, calculatePayrollDto.payrollRunId, calculatePayrollDto.baseSalary, user.userId);
    }
    async calculateProratedSalary(calculateProratedSalaryDto, user) {
        return this.payrollService.calculateProratedSalary(calculateProratedSalaryDto.employeeId, calculateProratedSalaryDto.baseSalary, new Date(calculateProratedSalaryDto.startDate), new Date(calculateProratedSalaryDto.endDate), new Date(calculateProratedSalaryDto.payrollPeriodEnd), user.userId);
    }
    async applyStatutoryRules(applyStatutoryRulesDto, user) {
        return this.payrollService.applyStatutoryRules(applyStatutoryRulesDto.baseSalary, applyStatutoryRulesDto.employeeId, user.userId);
    }
    async generateDraftPayrollRun(generateDraftPayrollRunDto, user) {
        return this.payrollService.generateDraftPayrollRun(new Date(generateDraftPayrollRunDto.payrollPeriod), generateDraftPayrollRunDto.entity, generateDraftPayrollRunDto.payrollSpecialistId, generateDraftPayrollRunDto.currency, user.userId, generateDraftPayrollRunDto.payrollManagerId);
    }
    async getPayrollPreview(payrollRunId, user, currency) {
        return this.payrollService.getPayrollPreview(payrollRunId, currency, user.userId);
    }
    async getPreInitiationValidationStatus(user) {
        return this.payrollService.getPreInitiationValidationStatus(user.userId);
    }
    async generateAndDistributePayslips(generateAndDistributePayslipsDto, user) {
        return this.payrollService.generateAndDistributePayslips(generateAndDistributePayslipsDto.payrollRunId, generateAndDistributePayslipsDto.distributionMethod || GenerateAndDistributePayslipsDto_dto_1.PayslipDistributionMethod.PORTAL, user.userId);
    }
    async sendForApproval(sendForApprovalDto, user) {
        return this.payrollService.sendForApproval(sendForApprovalDto.payrollRunId, sendForApprovalDto.managerId, sendForApprovalDto.financeStaffId, user.userId);
    }
    async approvePayrollDisbursement(financeDecisionDto, user) {
        return this.payrollService.approvePayrollDisbursement(financeDecisionDto, user.userId);
    }
    async resolveIrregularity(resolveIrregularityDto, user) {
        return this.payrollService.resolveIrregularity(resolveIrregularityDto.payrollRunId, resolveIrregularityDto.employeeId, resolveIrregularityDto.exceptionCode, resolveIrregularityDto.resolution, resolveIrregularityDto.managerId, user.userId);
    }
    async getEmployeeExceptions(employeeId, payrollRunId, user) {
        return this.payrollService.getEmployeeExceptions(employeeId, payrollRunId, user.userId);
    }
    async getAllPayrollExceptions(payrollRunId, user) {
        return this.payrollService.getAllPayrollExceptions(payrollRunId, user.userId);
    }
    async approvePayrollRun(managerApprovalDto, user) {
        return this.payrollService.approvePayrollRun(managerApprovalDto, user.userId);
    }
};
exports.PayrollExecutionController = PayrollExecutionController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePayrollRunDto_dto_1.CreatePayrollRunDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "createPayrollRun", null);
__decorate([
    (0, common_1.Post)(':id/review'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PublishRunForApprovalDto_dto_1.PublishRunForApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "reviewPayroll", null);
__decorate([
    (0, common_1.Post)('generate-details'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EmployeePayrollDetailsUpsertDto_dto_1.EmployeePayrollDetailsUpsertDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "generateEmployeePayrollDetails", null);
__decorate([
    (0, common_1.Post)('flag-exception'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FlagPayrollExceptionDto_dto_1.FlagPayrollExceptionDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "flagPayrollException", null);
__decorate([
    (0, common_1.Post)('detect-irregularities/:payrollRunId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('payrollRunId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "detectIrregularities", null);
__decorate([
    (0, common_1.Post)(':id/lock'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "lockPayroll", null);
__decorate([
    (0, common_1.Post)(':id/unlock'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UnlockPayrollDto_dto_1.UnlockPayrollDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "unlockPayroll", null);
__decorate([
    (0, common_1.Post)(':id/freeze'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "freezePayroll", null);
__decorate([
    (0, common_1.Post)(':id/unfreeze'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UnlockPayrollDto_dto_1.UnlockPayrollDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "unfreezePayroll", null);
__decorate([
    (0, common_1.Post)('process-initiation'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProcessPayrollInitiationDto_dto_1.ProcessPayrollInitiationDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "processPayrollInitiation", null);
__decorate([
    (0, common_1.Post)('review-initiation/:runId'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('runId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ReviewPayrollInitiationDto_dto_1.ReviewPayrollInitiationDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "reviewPayrollInitiation", null);
__decorate([
    (0, common_1.Put)('edit-initiation/:runId'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Param)('runId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "editPayrollInitiation", null);
__decorate([
    (0, common_1.Post)('review-payroll-period'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReviewPayrollPeriodDto_dto_1.ReviewPayrollPeriodDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "reviewPayrollPeriod", null);
__decorate([
    (0, common_1.Put)('edit-payroll-period'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditPayrollPeriodDto_dto_1.EditPayrollPeriodDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "editPayrollPeriod", null);
__decorate([
    (0, common_1.Post)('process-signing-bonuses'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "processSigningBonuses", null);
__decorate([
    (0, common_1.Post)('create-signing-bonus'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEmployeeSigningBonusDto_dto_1.CreateEmployeeSigningBonusDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "createEmployeeSigningBonus", null);
__decorate([
    (0, common_1.Post)('review-signing-bonus'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SigningBonusReviewDto_dto_1.SigningBonusReviewDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "reviewSigningBonus", null);
__decorate([
    (0, common_1.Put)('edit-signing-bonus'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SigningBonusEditDto_dto_1.SigningBonusEditDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "editSigningBonus", null);
__decorate([
    (0, common_1.Post)('process-termination-benefits'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "processTerminationResignationBenefits", null);
__decorate([
    (0, common_1.Post)('create-termination-benefit'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEmployeeTerminationBenefitDto_dto_1.CreateEmployeeTerminationBenefitDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "createEmployeeTerminationBenefit", null);
__decorate([
    (0, common_1.Post)('review-termination-benefit'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TerminationBenefitReviewDto_dto_1.TerminationBenefitReviewDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "reviewTerminationBenefit", null);
__decorate([
    (0, common_1.Put)('edit-termination-benefit'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TerminationBenefitEditDto_dto_1.TerminationBenefitEditDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "editTerminationBenefit", null);
__decorate([
    (0, common_1.Post)('calculate-payroll'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculatePayrollDto_dto_1.CalculatePayrollDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "calculatePayroll", null);
__decorate([
    (0, common_1.Post)('calculate-prorated-salary'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculateProratedSalaryDto_dto_1.CalculateProratedSalaryDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "calculateProratedSalary", null);
__decorate([
    (0, common_1.Post)('apply-statutory-rules'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ApplyStatutoryRulesDto_dto_1.ApplyStatutoryRulesDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "applyStatutoryRules", null);
__decorate([
    (0, common_1.Post)('generate-draft'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateDraftPayrollRunDto_dto_1.GenerateDraftPayrollRunDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "generateDraftPayrollRun", null);
__decorate([
    (0, common_1.Get)('preview/:payrollRunId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('payrollRunId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "getPayrollPreview", null);
__decorate([
    (0, common_1.Get)('pre-initiation-validation'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "getPreInitiationValidationStatus", null);
__decorate([
    (0, common_1.Post)('generate-payslips'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateAndDistributePayslipsDto_dto_1.GenerateAndDistributePayslipsDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "generateAndDistributePayslips", null);
__decorate([
    (0, common_1.Post)('send-for-approval'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendForApprovalDto_dto_1.SendForApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "sendForApproval", null);
__decorate([
    (0, common_1.Post)('finance-approval'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.FINANCE_STAFF),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FinanceDecisionDto_dto_1.FinanceDecisionDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "approvePayrollDisbursement", null);
__decorate([
    (0, common_1.Post)('resolve-irregularity'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResolveIrregularityDto_dto_1.ResolveIrregularityDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "resolveIrregularity", null);
__decorate([
    (0, common_1.Get)('employee-exceptions/:employeeId/:payrollRunId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Param)('payrollRunId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "getEmployeeExceptions", null);
__decorate([
    (0, common_1.Get)('payroll-exceptions/:payrollRunId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_SPECIALIST, employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Param)('payrollRunId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "getAllPayrollExceptions", null);
__decorate([
    (0, common_1.Post)('manager-approval'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.PAYROLL_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ManagerApprovalReviewDto_dto_1.ManagerApprovalReviewDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollExecutionController.prototype, "approvePayrollRun", null);
exports.PayrollExecutionController = PayrollExecutionController = __decorate([
    (0, common_1.Controller)('payroll'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [payroll_execution_service_1.PayrollExecutionService])
], PayrollExecutionController);
//# sourceMappingURL=payroll-execution.controller.js.map