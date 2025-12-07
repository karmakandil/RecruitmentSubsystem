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
exports.PayrollTrackingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const claims_schema_1 = require("./models/claims.schema");
const disputes_schema_1 = require("./models/disputes.schema");
const refunds_schema_1 = require("./models/refunds.schema");
const employee_profile_schema_1 = require("../employee-profile/models/employee-profile.schema");
const employee_profile_enums_1 = require("../employee-profile/enums/employee-profile.enums");
const employee_profile_service_1 = require("../employee-profile/employee-profile.service");
const payroll_configuration_service_1 = require("../payroll-configuration/payroll-configuration.service");
const leaves_service_1 = require("../leaves/leaves.service");
const time_management_service_1 = require("../time-management/services/time-management.service");
const payslip_schema_1 = require("../payroll-execution/models/payslip.schema");
const payrollRuns_schema_1 = require("../payroll-execution/models/payrollRuns.schema");
const leave_entitlement_schema_1 = require("../leaves/models/leave-entitlement.schema");
const leave_request_schema_1 = require("../leaves/models/leave-request.schema");
const attendance_record_schema_1 = require("../time-management/models/attendance-record.schema");
const time_exception_schema_1 = require("../time-management/models/time-exception.schema");
const index_1 = require("../time-management/models/enums/index");
const department_schema_1 = require("../organization-structure/models/department.schema");
const position_schema_1 = require("../organization-structure/models/position.schema");
const position_assignment_schema_1 = require("../organization-structure/models/position-assignment.schema");
const leave_status_enum_1 = require("../leaves/enums/leave-status.enum");
const payroll_execution_enum_1 = require("../payroll-execution/enums/payroll-execution-enum");
const payroll_tracking_enum_1 = require("./enums/payroll-tracking-enum");
const employee_profile_enums_2 = require("../employee-profile/enums/employee-profile.enums");
const payroll_configuration_enums_1 = require("../payroll-configuration/enums/payroll-configuration-enums");
let PayrollTrackingService = class PayrollTrackingService {
    constructor(claimModel, disputeModel, refundModel, employeeProfileModel, employeeProfileService, payrollConfigurationService, leavesService, timeManagementService, payslipModel, payrollRunsModel, leaveEntitlementModel, leaveRequestModel, attendanceRecordModel, timeExceptionModel, departmentModel, positionModel, positionAssignmentModel) {
        this.claimModel = claimModel;
        this.disputeModel = disputeModel;
        this.refundModel = refundModel;
        this.employeeProfileModel = employeeProfileModel;
        this.employeeProfileService = employeeProfileService;
        this.payrollConfigurationService = payrollConfigurationService;
        this.leavesService = leavesService;
        this.timeManagementService = timeManagementService;
        this.payslipModel = payslipModel;
        this.payrollRunsModel = payrollRunsModel;
        this.leaveEntitlementModel = leaveEntitlementModel;
        this.leaveRequestModel = leaveRequestModel;
        this.attendanceRecordModel = attendanceRecordModel;
        this.timeExceptionModel = timeExceptionModel;
        this.departmentModel = departmentModel;
        this.positionModel = positionModel;
        this.positionAssignmentModel = positionAssignmentModel;
    }
    async generateClaimId() {
        try {
            const year = new Date().getFullYear();
            const count = await this.claimModel.countDocuments({
                claimId: new RegExp(`^CLAIM-${year}-`),
            });
            const sequence = String(count + 1).padStart(4, '0');
            return `CLAIM-${year}-${sequence}`;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to generate claim ID: ${error?.message || 'Unknown error'}`);
        }
    }
    async generateDisputeId() {
        try {
            const year = new Date().getFullYear();
            const count = await this.disputeModel.countDocuments({
                disputeId: new RegExp(`^DISP-${year}-`),
            });
            const sequence = String(count + 1).padStart(4, '0');
            return `DISP-${year}-${sequence}`;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to generate dispute ID: ${error?.message || 'Unknown error'}`);
        }
    }
    validateObjectId(id, fieldName) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid ${fieldName}: ${id} is not a valid MongoDB ObjectId`);
        }
        return new mongoose_2.Types.ObjectId(id);
    }
    async validateEmployeeExists(employeeId, checkActive = true) {
        const validEmployeeId = this.validateObjectId(employeeId, 'employeeId');
        const employee = await this.employeeProfileService.findOne(employeeId);
        if (checkActive && employee.status !== employee_profile_enums_1.EmployeeStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Employee with ID ${employeeId} is not active. Current status: ${employee.status}`);
        }
        return validEmployeeId;
    }
    async enrichTaxDeductionWithConfiguration(taxDeduction) {
        try {
            if (!taxDeduction || !taxDeduction.name) {
                return taxDeduction;
            }
            const taxRulesResult = await this.payrollConfigurationService.findAllTaxRules({
                status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
                page: 1,
                limit: 100,
            });
            const matchingTaxRule = taxRulesResult.data.find((rule) => rule.name === taxDeduction.name || rule._id?.toString() === taxDeduction._id?.toString());
            if (matchingTaxRule) {
                return {
                    ...taxDeduction,
                    configurationDetails: {
                        name: matchingTaxRule.name,
                        description: matchingTaxRule.description,
                        rate: matchingTaxRule.rate,
                        status: matchingTaxRule.status,
                        approvedAt: matchingTaxRule.approvedAt,
                        approvedBy: matchingTaxRule.approvedBy,
                    },
                };
            }
            return {
                ...taxDeduction,
                configurationDetails: {
                    warning: 'Tax rule configuration not found or not approved',
                    status: taxDeduction.status || 'unknown',
                },
            };
        }
        catch (error) {
            console.warn(`Failed to enrich tax deduction: ${error?.message}`);
            return taxDeduction;
        }
    }
    async enrichInsuranceDeductionWithConfiguration(insuranceDeduction) {
        try {
            if (!insuranceDeduction || !insuranceDeduction.name) {
                return insuranceDeduction;
            }
            const insuranceBracketsResult = await this.payrollConfigurationService.findAllInsuranceBrackets({
                status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
                page: 1,
                limit: 100,
            });
            const matchingBracket = insuranceBracketsResult.data.find((bracket) => bracket.name === insuranceDeduction.name || bracket._id?.toString() === insuranceDeduction._id?.toString());
            if (matchingBracket) {
                return {
                    ...insuranceDeduction,
                    configurationDetails: {
                        name: matchingBracket.name,
                        minSalary: matchingBracket.minSalary,
                        maxSalary: matchingBracket.maxSalary,
                        employeeRate: matchingBracket.employeeRate,
                        employerRate: matchingBracket.employerRate,
                        status: matchingBracket.status,
                        approvedAt: matchingBracket.approvedAt,
                        approvedBy: matchingBracket.approvedBy,
                    },
                };
            }
            return {
                ...insuranceDeduction,
                configurationDetails: {
                    warning: 'Insurance bracket configuration not found or not approved',
                    status: insuranceDeduction.status || 'unknown',
                },
            };
        }
        catch (error) {
            console.warn(`Failed to enrich insurance deduction: ${error?.message}`);
            return insuranceDeduction;
        }
    }
    validateEmployeeAccess(requestedEmployeeId, authenticatedUserId, userRoles) {
        if (!authenticatedUserId || !userRoles || userRoles.length === 0) {
            return;
        }
        const requestedId = requestedEmployeeId.toString();
        const authenticatedId = authenticatedUserId.toString();
        const isRegularEmployee = userRoles.some((role) => role === employee_profile_enums_2.SystemRole.DEPARTMENT_EMPLOYEE &&
            !userRoles.includes(employee_profile_enums_2.SystemRole.PAYROLL_SPECIALIST) &&
            !userRoles.includes(employee_profile_enums_2.SystemRole.FINANCE_STAFF) &&
            !userRoles.includes(employee_profile_enums_2.SystemRole.SYSTEM_ADMIN));
        if (isRegularEmployee && requestedId !== authenticatedId) {
            throw new common_1.ForbiddenException('You do not have permission to access this employee\'s data. You can only access your own data.');
        }
    }
    getPayrollPeriodDateRange(payrollRun) {
        if (!payrollRun || !payrollRun.payrollPeriod) {
            throw new common_1.BadRequestException('Invalid payroll run: missing payroll period');
        }
        const payrollPeriod = new Date(payrollRun.payrollPeriod);
        const startDate = new Date(payrollPeriod.getFullYear(), payrollPeriod.getMonth(), 1);
        const endDate = new Date(payrollPeriod.getFullYear(), payrollPeriod.getMonth() + 1, 0, 23, 59, 59, 999);
        return { startDate, endDate };
    }
    isDateInRange(date, startDate, endDate) {
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return checkDate >= start && checkDate <= end;
    }
    doDateRangesOverlap(range1Start, range1End, range2Start, range2End) {
        return range1Start <= range2End && range1End >= range2Start;
    }
    async sendNotification(notificationType, recipientId, recipientRole, message, metadata) {
        try {
            const recipientIdStr = recipientId instanceof mongoose_2.Types.ObjectId
                ? recipientId.toString()
                : recipientId;
            const notificationLog = {
                type: notificationType,
                recipientId: recipientIdStr,
                recipientRole,
                message,
                metadata: metadata || {},
                timestamp: new Date().toISOString(),
            };
            console.log('[PAYROLL_TRACKING_NOTIFICATION]', JSON.stringify(notificationLog, null, 2));
        }
        catch (error) {
            console.error('[PAYROLL_TRACKING_NOTIFICATION_ERROR]', {
                notificationType,
                recipientId: recipientId instanceof mongoose_2.Types.ObjectId
                    ? recipientId.toString()
                    : recipientId,
                error: error instanceof Error ? error?.message : 'Unknown error',
            });
        }
    }
    async createClaim(createClaimDTO, currentUserId) {
        try {
            if (!createClaimDTO.description ||
                createClaimDTO.description.trim().length === 0) {
                throw new common_1.BadRequestException('Description is required and cannot be empty');
            }
            if (!createClaimDTO.claimType ||
                createClaimDTO.claimType.trim().length === 0) {
                throw new common_1.BadRequestException('Claim type is required and cannot be empty');
            }
            if (!createClaimDTO.amount || createClaimDTO.amount <= 0) {
                throw new common_1.BadRequestException('Amount must be greater than 0');
            }
            if (createClaimDTO.amount > 10000000) {
                throw new common_1.BadRequestException('Amount exceeds maximum allowed limit');
            }
            const employeeId = await this.validateEmployeeExists(createClaimDTO.employeeId, true);
            const financeStaffId = createClaimDTO.financeStaffId
                ? await this.validateEmployeeExists(createClaimDTO.financeStaffId, false)
                : undefined;
            const claimId = await this.generateClaimId();
            const claimData = {
                ...createClaimDTO,
                employeeId,
                financeStaffId,
                claimId,
                status: payroll_tracking_enum_1.ClaimStatus.UNDER_REVIEW,
                createdBy: new mongoose_2.Types.ObjectId(currentUserId),
                updatedBy: new mongoose_2.Types.ObjectId(currentUserId),
            };
            const newClaim = new this.claimModel(claimData);
            const savedClaim = await newClaim.save();
            return await this.claimModel
                .findById(savedClaim._id)
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .exec();
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error?.name === 'ValidationError') {
                const validationErrors = Object.values(error?.errors || {})
                    .map((err) => err?.message)
                    .join(', ');
                throw new common_1.BadRequestException(`Validation error: ${validationErrors || error?.message || 'Unknown validation error'}`);
            }
            if (error?.code === 11000) {
                throw new common_1.BadRequestException(`Duplicate key error: ${JSON.stringify(error?.keyValue || {})}`);
            }
            throw new common_1.BadRequestException(`Failed to create claim: ${error?.message || 'Unknown error'}`);
        }
    }
    async getClaimById(claimId) {
        try {
            if (!claimId || claimId.trim().length === 0) {
                throw new common_1.BadRequestException('Claim ID is required');
            }
            const claim = await this.claimModel
                .findOne({ claimId })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .exec();
            if (!claim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found`);
            }
            return claim;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve claim: ${error?.message || 'Unknown error'}`);
        }
    }
    async updateClaim(claimId, updateClaimDTO, currentUserId) {
        try {
            if (!claimId || claimId.trim().length === 0) {
                throw new common_1.BadRequestException('Claim ID is required');
            }
            const claim = await this.claimModel.findOne({ claimId });
            if (!claim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found`);
            }
            if (updateClaimDTO.amount !== undefined && updateClaimDTO.amount <= 0) {
                throw new common_1.BadRequestException('Amount must be greater than 0');
            }
            if (updateClaimDTO.approvedAmount !== undefined) {
                if (updateClaimDTO.approvedAmount <= 0) {
                    throw new common_1.BadRequestException('Approved amount must be greater than 0');
                }
                if (updateClaimDTO.approvedAmount > claim.amount) {
                    throw new common_1.BadRequestException('Approved amount cannot exceed the original claim amount');
                }
            }
            if (updateClaimDTO.description !== undefined &&
                updateClaimDTO.description.trim().length === 0) {
                throw new common_1.BadRequestException('Description cannot be empty');
            }
            if (updateClaimDTO.claimType !== undefined &&
                updateClaimDTO.claimType.trim().length === 0) {
                throw new common_1.BadRequestException('Claim type cannot be empty');
            }
            const updateData = { ...updateClaimDTO };
            if (updateClaimDTO.financeStaffId) {
                updateData.financeStaffId = await this.validateEmployeeExists(updateClaimDTO.financeStaffId, false);
            }
            updateData.updatedBy = new mongoose_2.Types.ObjectId(currentUserId);
            const updatedClaim = await this.claimModel
                .findOneAndUpdate({ claimId }, updateData, {
                new: true,
                runValidators: true,
            })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .exec();
            if (!updatedClaim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found after update`);
            }
            return updatedClaim;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error?.name === 'ValidationError') {
                const validationErrors = Object.values(error?.errors || {})
                    .map((err) => err.message)
                    .join(', ');
                throw new common_1.BadRequestException(`Validation error: ${validationErrors || error?.message}`);
            }
            throw new common_1.BadRequestException(`Failed to update claim: ${error?.message || 'Unknown error'}`);
        }
    }
    async getClaimsByEmployeeId(employeeId) {
        try {
            if (!employeeId || employeeId.trim().length === 0) {
                throw new common_1.BadRequestException('Employee ID is required');
            }
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            return await this.claimModel
                .find({ employeeId: validEmployeeId })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .sort({ createdAt: -1 })
                .exec();
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve claims: ${error?.message || 'Unknown error'}`);
        }
    }
    async getPendingClaims() {
        try {
            return await this.claimModel
                .find({
                status: {
                    $in: [payroll_tracking_enum_1.ClaimStatus.UNDER_REVIEW, payroll_tracking_enum_1.ClaimStatus.PENDING_MANAGER_APPROVAL]
                }
            })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .sort({ createdAt: -1 })
                .exec();
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to retrieve pending claims: ${error?.message || 'Unknown error'}`);
        }
    }
    async approveClaim(claimId, approvedAmount, financeStaffId, resolutionComment) {
        try {
            if (!claimId || claimId.trim().length === 0) {
                throw new common_1.BadRequestException('Claim ID is required');
            }
            if (!approvedAmount || approvedAmount <= 0) {
                throw new common_1.BadRequestException('Approved amount must be greater than 0');
            }
            if (!financeStaffId || financeStaffId.trim().length === 0) {
                throw new common_1.BadRequestException('Finance staff ID is required');
            }
            const claim = await this.claimModel.findOne({ claimId });
            if (!claim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found`);
            }
            if (claim.status !== payroll_tracking_enum_1.ClaimStatus.UNDER_REVIEW) {
                throw new common_1.BadRequestException(`Claim is already ${claim.status}`);
            }
            if (approvedAmount > claim.amount) {
                throw new common_1.BadRequestException(`Approved amount (${approvedAmount}) cannot exceed the original claim amount (${claim.amount})`);
            }
            const updatedClaim = await this.claimModel
                .findOneAndUpdate({ claimId }, {
                status: payroll_tracking_enum_1.ClaimStatus.APPROVED,
                approvedAmount,
                financeStaffId: this.validateObjectId(financeStaffId, 'financeStaffId'),
                resolutionComment,
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('financeStaffId', 'firstName lastName')
                .exec();
            if (!updatedClaim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found after approval`);
            }
            return updatedClaim;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to approve claim: ${error?.message || 'Unknown error'}`);
        }
    }
    async rejectClaim(claimId, rejectionReason, financeStaffId) {
        try {
            if (!claimId || claimId.trim().length === 0) {
                throw new common_1.BadRequestException('Claim ID is required');
            }
            if (!rejectionReason || rejectionReason.trim().length === 0) {
                throw new common_1.BadRequestException('Rejection reason is required');
            }
            if (!financeStaffId || financeStaffId.trim().length === 0) {
                throw new common_1.BadRequestException('Finance staff ID is required');
            }
            const claim = await this.claimModel.findOne({ claimId });
            if (!claim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found`);
            }
            if (claim.status !== payroll_tracking_enum_1.ClaimStatus.UNDER_REVIEW) {
                throw new common_1.BadRequestException(`Claim is already ${claim.status}`);
            }
            const updatedClaim = await this.claimModel
                .findOneAndUpdate({ claimId }, {
                status: payroll_tracking_enum_1.ClaimStatus.REJECTED,
                rejectionReason: rejectionReason.trim(),
                financeStaffId: this.validateObjectId(financeStaffId, 'financeStaffId'),
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('financeStaffId', 'firstName lastName')
                .exec();
            if (!updatedClaim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found after rejection`);
            }
            return updatedClaim;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to reject claim: ${error?.message || 'Unknown error'}`);
        }
    }
    async createDispute(createDisputeDTO, currentUserId) {
        try {
            if (!createDisputeDTO.description ||
                createDisputeDTO.description.trim().length === 0) {
                throw new common_1.BadRequestException('Description is required and cannot be empty');
            }
            if (createDisputeDTO.description.trim().length < 10) {
                throw new common_1.BadRequestException('Description must be at least 10 characters long to explain the dispute');
            }
            const employeeId = await this.validateEmployeeExists(createDisputeDTO.employeeId, true);
            const payslipId = this.validateObjectId(createDisputeDTO.payslipId, 'payslipId');
            const disputeId = await this.generateDisputeId();
            const newDispute = new this.disputeModel({
                ...createDisputeDTO,
                employeeId,
                payslipId,
                disputeId,
                status: payroll_tracking_enum_1.DisputeStatus.UNDER_REVIEW,
                createdBy: new mongoose_2.Types.ObjectId(currentUserId),
                updatedBy: new mongoose_2.Types.ObjectId(currentUserId),
            });
            const savedDispute = await newDispute.save();
            return await this.disputeModel
                .findById(savedDispute._id)
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .populate('payslipId')
                .exec();
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error?.name === 'ValidationError') {
                const validationErrors = Object.values(error?.errors || {})
                    .map((err) => err.message)
                    .join(', ');
                throw new common_1.BadRequestException(`Validation error: ${validationErrors || error?.message}`);
            }
            if (error?.code === 11000) {
                throw new common_1.BadRequestException(`Duplicate key error: ${JSON.stringify(error?.keyValue)}`);
            }
            throw new common_1.BadRequestException(`Failed to create dispute: ${error?.message || 'Unknown error'}`);
        }
    }
    async getDisputeById(disputeId) {
        try {
            if (!disputeId || disputeId.trim().length === 0) {
                throw new common_1.BadRequestException('Dispute ID is required');
            }
            let dispute;
            if (mongoose_2.Types.ObjectId.isValid(disputeId)) {
                dispute = await this.disputeModel
                    .findById(disputeId)
                    .populate('employeeId', 'firstName lastName employeeNumber')
                    .populate('payrollSpecialistId', 'firstName lastName')
                    .populate('payrollManagerId', 'firstName lastName')
                    .populate('financeStaffId', 'firstName lastName')
                    .populate('payslipId')
                    .exec();
                if (!dispute) {
                    dispute = await this.disputeModel
                        .findOne({ disputeId })
                        .populate('employeeId', 'firstName lastName employeeNumber')
                        .populate('payrollSpecialistId', 'firstName lastName')
                        .populate('payrollManagerId', 'firstName lastName')
                        .populate('financeStaffId', 'firstName lastName')
                        .populate('payslipId')
                        .exec();
                }
            }
            else {
                dispute = await this.disputeModel
                    .findOne({ disputeId })
                    .populate('employeeId', 'firstName lastName employeeNumber')
                    .populate('payrollSpecialistId', 'firstName lastName')
                    .populate('payrollManagerId', 'firstName lastName')
                    .populate('financeStaffId', 'firstName lastName')
                    .populate('payslipId')
                    .exec();
            }
            if (!dispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found`);
            }
            return dispute;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve dispute: ${error?.message || 'Unknown error'}`);
        }
    }
    async updateDispute(disputeId, updateDisputeDTO, currentUserId) {
        try {
            if (!disputeId || disputeId.trim().length === 0) {
                throw new common_1.BadRequestException('Dispute ID is required');
            }
            let dispute;
            if (mongoose_2.Types.ObjectId.isValid(disputeId)) {
                dispute = await this.disputeModel.findById(disputeId);
                if (!dispute) {
                    dispute = await this.disputeModel.findOne({ disputeId });
                }
            }
            else {
                dispute = await this.disputeModel.findOne({ disputeId });
            }
            if (!dispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found`);
            }
            if (dispute.status !== payroll_tracking_enum_1.DisputeStatus.UNDER_REVIEW) {
                throw new common_1.BadRequestException(`Cannot update dispute. Dispute status is ${dispute.status}. Only disputes under review can be updated.`);
            }
            if (updateDisputeDTO.description !== undefined) {
                if (updateDisputeDTO.description.trim().length === 0) {
                    throw new common_1.BadRequestException('Description cannot be empty');
                }
                if (updateDisputeDTO.description.trim().length < 10) {
                    throw new common_1.BadRequestException('Description must be at least 10 characters long');
                }
            }
            if (updateDisputeDTO.rejectionReason !== undefined &&
                updateDisputeDTO.rejectionReason.trim().length === 0) {
                throw new common_1.BadRequestException('Rejection reason cannot be empty');
            }
            const updateData = {};
            if (updateDisputeDTO.description !== undefined) {
                updateData.description = updateDisputeDTO.description.trim();
            }
            if (updateDisputeDTO.resolutionComment !== undefined) {
                updateData.resolutionComment = updateDisputeDTO.resolutionComment.trim();
            }
            if (updateDisputeDTO.rejectionReason !== undefined) {
                updateData.rejectionReason = updateDisputeDTO.rejectionReason.trim();
            }
            if (updateDisputeDTO.financeStaffId !== undefined) {
                updateData.financeStaffId = await this.validateEmployeeExists(updateDisputeDTO.financeStaffId, false);
            }
            if (updateDisputeDTO.status !== undefined) {
                updateData.status = updateDisputeDTO.status;
            }
            updateData.updatedBy = new mongoose_2.Types.ObjectId(currentUserId);
            const updateQuery = { $set: updateData };
            const updatedDispute = await this.disputeModel
                .findByIdAndUpdate(dispute._id, updateQuery, {
                new: true,
                runValidators: true,
            })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .populate('payslipId')
                .exec();
            if (!updatedDispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found after update`);
            }
            return updatedDispute;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error?.name === 'ValidationError') {
                const validationErrors = Object.values(error?.errors || {})
                    .map((err) => err.message)
                    .join(', ');
                throw new common_1.BadRequestException(`Validation error: ${validationErrors || error?.message}`);
            }
            throw new common_1.BadRequestException(`Failed to update dispute: ${error?.message || 'Unknown error'}`);
        }
    }
    async getDisputesByEmployeeId(employeeId) {
        try {
            if (!employeeId || employeeId.trim().length === 0) {
                throw new common_1.BadRequestException('Employee ID is required');
            }
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            return await this.disputeModel
                .find({ employeeId: validEmployeeId })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .populate('payslipId')
                .sort({ createdAt: -1 })
                .exec();
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve disputes: ${error?.message || 'Unknown error'}`);
        }
    }
    async getPendingDisputes() {
        try {
            return await this.disputeModel
                .find({
                status: {
                    $in: [payroll_tracking_enum_1.DisputeStatus.UNDER_REVIEW, payroll_tracking_enum_1.DisputeStatus.PENDING_MANAGER_APPROVAL]
                }
            })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .populate('payslipId')
                .sort({ createdAt: -1 })
                .exec();
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to retrieve pending disputes: ${error?.message || 'Unknown error'}`);
        }
    }
    async approveDispute(disputeId, financeStaffId, resolutionComment) {
        try {
            if (!disputeId || disputeId.trim().length === 0) {
                throw new common_1.BadRequestException('Dispute ID is required');
            }
            if (!financeStaffId || financeStaffId.trim().length === 0) {
                throw new common_1.BadRequestException('Finance staff ID is required');
            }
            const dispute = await this.disputeModel.findOne({ disputeId });
            if (!dispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found`);
            }
            if (dispute.status !== payroll_tracking_enum_1.DisputeStatus.UNDER_REVIEW) {
                throw new common_1.BadRequestException(`Dispute is already ${dispute.status}`);
            }
            const updatedDispute = await this.disputeModel
                .findOneAndUpdate({ disputeId }, {
                status: payroll_tracking_enum_1.DisputeStatus.APPROVED,
                financeStaffId: this.validateObjectId(financeStaffId, 'financeStaffId'),
                resolutionComment,
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('financeStaffId', 'firstName lastName')
                .populate('payslipId')
                .exec();
            if (!updatedDispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found after approval`);
            }
            return updatedDispute;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to approve dispute: ${error?.message || 'Unknown error'}`);
        }
    }
    async rejectDispute(disputeId, rejectionReason, financeStaffId) {
        try {
            if (!disputeId || disputeId.trim().length === 0) {
                throw new common_1.BadRequestException('Dispute ID is required');
            }
            if (!rejectionReason || rejectionReason.trim().length === 0) {
                throw new common_1.BadRequestException('Rejection reason is required');
            }
            if (!financeStaffId || financeStaffId.trim().length === 0) {
                throw new common_1.BadRequestException('Finance staff ID is required');
            }
            const dispute = await this.disputeModel.findOne({ disputeId });
            if (!dispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found`);
            }
            if (dispute.status !== payroll_tracking_enum_1.DisputeStatus.UNDER_REVIEW) {
                throw new common_1.BadRequestException(`Dispute is already ${dispute.status}`);
            }
            const updatedDispute = await this.disputeModel
                .findOneAndUpdate({ disputeId }, {
                status: payroll_tracking_enum_1.DisputeStatus.REJECTED,
                rejectionReason: rejectionReason.trim(),
                financeStaffId: this.validateObjectId(financeStaffId, 'financeStaffId'),
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('financeStaffId', 'firstName lastName')
                .populate('payslipId')
                .exec();
            if (!updatedDispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found after rejection`);
            }
            return updatedDispute;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to reject dispute: ${error?.message || 'Unknown error'}`);
        }
    }
    async createRefund(createRefundDTO, currentUserId) {
        try {
            if (!createRefundDTO.refundDetails) {
                throw new common_1.BadRequestException('Refund details are required');
            }
            if (!createRefundDTO.refundDetails.description ||
                createRefundDTO.refundDetails.description.trim().length === 0) {
                throw new common_1.BadRequestException('Refund description is required and cannot be empty');
            }
            if (!createRefundDTO.refundDetails.amount ||
                createRefundDTO.refundDetails.amount <= 0) {
                throw new common_1.BadRequestException('Refund amount must be greater than 0');
            }
            if (createRefundDTO.refundDetails.amount > 10000000) {
                throw new common_1.BadRequestException('Refund amount exceeds maximum allowed limit');
            }
            if (createRefundDTO.claimId && createRefundDTO.disputeId) {
                throw new common_1.BadRequestException('Cannot provide both claimId and disputeId. Please provide only one.');
            }
            if (!createRefundDTO.claimId && !createRefundDTO.disputeId) {
                throw new common_1.BadRequestException('Either claimId or disputeId must be provided');
            }
            if (createRefundDTO.claimId) {
                const claim = await this.claimModel.findById(createRefundDTO.claimId);
                if (!claim) {
                    throw new common_1.NotFoundException(`Claim with ID ${createRefundDTO.claimId} not found`);
                }
                if (claim.status !== payroll_tracking_enum_1.ClaimStatus.APPROVED) {
                    throw new common_1.BadRequestException(`Claim must be approved before creating a refund. Current status: ${claim.status}`);
                }
                const existingRefund = await this.refundModel.findOne({
                    claimId: createRefundDTO.claimId,
                    status: payroll_tracking_enum_1.RefundStatus.PENDING,
                });
                if (existingRefund) {
                    throw new common_1.BadRequestException('A pending refund already exists for this claim');
                }
            }
            if (createRefundDTO.disputeId) {
                const dispute = await this.disputeModel.findById(createRefundDTO.disputeId);
                if (!dispute) {
                    throw new common_1.NotFoundException(`Dispute with ID ${createRefundDTO.disputeId} not found`);
                }
                if (dispute.status !== payroll_tracking_enum_1.DisputeStatus.APPROVED) {
                    throw new common_1.BadRequestException(`Dispute must be approved before creating a refund. Current status: ${dispute.status}`);
                }
                const existingRefund = await this.refundModel.findOne({
                    disputeId: createRefundDTO.disputeId,
                    status: payroll_tracking_enum_1.RefundStatus.PENDING,
                });
                if (existingRefund) {
                    throw new common_1.BadRequestException('A pending refund already exists for this dispute');
                }
            }
            const validEmployeeId = await this.validateEmployeeExists(createRefundDTO.employeeId, false);
            const validFinanceStaffId = createRefundDTO.financeStaffId
                ? await this.validateEmployeeExists(createRefundDTO.financeStaffId, false)
                : undefined;
            const newRefund = new this.refundModel({
                ...createRefundDTO,
                employeeId: validEmployeeId,
                financeStaffId: validFinanceStaffId,
                claimId: createRefundDTO.claimId
                    ? this.validateObjectId(createRefundDTO.claimId, 'claimId')
                    : undefined,
                disputeId: createRefundDTO.disputeId
                    ? this.validateObjectId(createRefundDTO.disputeId, 'disputeId')
                    : undefined,
                status: createRefundDTO.status || payroll_tracking_enum_1.RefundStatus.PENDING,
                createdBy: new mongoose_2.Types.ObjectId(currentUserId),
                updatedBy: new mongoose_2.Types.ObjectId(currentUserId),
            });
            const savedRefund = await newRefund.save();
            return await this.refundModel
                .findById(savedRefund._id)
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('financeStaffId', 'firstName lastName')
                .populate('claimId')
                .populate('disputeId')
                .populate('paidInPayrollRunId')
                .exec();
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error?.name === 'ValidationError') {
                const validationErrors = Object.values(error?.errors || {})
                    .map((err) => err.message)
                    .join(', ');
                throw new common_1.BadRequestException(`Validation error: ${validationErrors || error?.message}`);
            }
            if (error?.code === 11000) {
                throw new common_1.BadRequestException(`Duplicate key error: ${JSON.stringify(error?.keyValue)}`);
            }
            throw new common_1.BadRequestException(`Failed to create refund: ${error?.message || 'Unknown error'}`);
        }
    }
    async getRefundById(refundId) {
        try {
            if (!refundId || !mongoose_2.Types.ObjectId.isValid(refundId)) {
                throw new common_1.BadRequestException('Valid refund ID is required');
            }
            const refund = await this.refundModel
                .findById(refundId)
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('financeStaffId', 'firstName lastName')
                .populate('claimId')
                .populate('disputeId')
                .populate('paidInPayrollRunId')
                .exec();
            if (!refund) {
                throw new common_1.NotFoundException(`Refund with ID ${refundId} not found`);
            }
            return refund;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve refund: ${error?.message || 'Unknown error'}`);
        }
    }
    async updateRefund(refundId, updateRefundDTO, currentUserId) {
        try {
            if (!refundId || !mongoose_2.Types.ObjectId.isValid(refundId)) {
                throw new common_1.BadRequestException('Valid refund ID is required');
            }
            const refund = await this.refundModel.findById(refundId);
            if (!refund) {
                throw new common_1.NotFoundException(`Refund with ID ${refundId} not found`);
            }
            if (updateRefundDTO.refundDetails) {
                if (!updateRefundDTO.refundDetails.description ||
                    updateRefundDTO.refundDetails.description.trim().length === 0) {
                    throw new common_1.BadRequestException('Refund description cannot be empty');
                }
                if (!updateRefundDTO.refundDetails.amount ||
                    updateRefundDTO.refundDetails.amount <= 0) {
                    throw new common_1.BadRequestException('Refund amount must be greater than 0');
                }
            }
            if (updateRefundDTO.status) {
                if (refund.status === payroll_tracking_enum_1.RefundStatus.PAID &&
                    updateRefundDTO.status !== payroll_tracking_enum_1.RefundStatus.PAID) {
                    throw new common_1.BadRequestException('Cannot change status of a paid refund');
                }
                if (refund.status === payroll_tracking_enum_1.RefundStatus.PENDING &&
                    updateRefundDTO.status === payroll_tracking_enum_1.RefundStatus.PAID &&
                    !updateRefundDTO.paidInPayrollRunId) {
                    throw new common_1.BadRequestException('Cannot mark refund as paid without providing paidInPayrollRunId');
                }
            }
            const updateData = { ...updateRefundDTO };
            if (updateRefundDTO.financeStaffId) {
                updateData.financeStaffId = await this.validateEmployeeExists(updateRefundDTO.financeStaffId, false);
            }
            if (updateRefundDTO.claimId) {
                updateData.claimId = this.validateObjectId(updateRefundDTO.claimId, 'claimId');
            }
            if (updateRefundDTO.disputeId) {
                updateData.disputeId = this.validateObjectId(updateRefundDTO.disputeId, 'disputeId');
            }
            if (updateRefundDTO.paidInPayrollRunId) {
                updateData.paidInPayrollRunId = this.validateObjectId(updateRefundDTO.paidInPayrollRunId, 'paidInPayrollRunId');
            }
            updateData.updatedBy = new mongoose_2.Types.ObjectId(currentUserId);
            const updatedRefund = await this.refundModel
                .findByIdAndUpdate(refundId, updateData, {
                new: true,
                runValidators: true,
            })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('financeStaffId', 'firstName lastName')
                .populate('claimId')
                .populate('disputeId')
                .populate('paidInPayrollRunId')
                .exec();
            if (!updatedRefund) {
                throw new common_1.NotFoundException(`Refund with ID ${refundId} not found after update`);
            }
            return updatedRefund;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error?.name === 'ValidationError') {
                const validationErrors = Object.values(error?.errors || {})
                    .map((err) => err.message)
                    .join(', ');
                throw new common_1.BadRequestException(`Validation error: ${validationErrors || error?.message}`);
            }
            throw new common_1.BadRequestException(`Failed to update refund: ${error?.message || 'Unknown error'}`);
        }
    }
    async getRefundsByEmployeeId(employeeId) {
        try {
            if (!employeeId || employeeId.trim().length === 0) {
                throw new common_1.BadRequestException('Employee ID is required');
            }
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            return await this.refundModel
                .find({ employeeId: validEmployeeId })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('financeStaffId', 'firstName lastName')
                .populate('claimId')
                .populate('disputeId')
                .populate('paidInPayrollRunId')
                .sort({ createdAt: -1 })
                .exec();
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve refunds: ${error?.message || 'Unknown error'}`);
        }
    }
    async getPendingRefunds() {
        try {
            return await this.refundModel
                .find({ status: payroll_tracking_enum_1.RefundStatus.PENDING })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('financeStaffId', 'firstName lastName')
                .populate('claimId')
                .populate('disputeId')
                .sort({ createdAt: -1 })
                .exec();
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to retrieve pending refunds: ${error?.message || 'Unknown error'}`);
        }
    }
    async processRefund(refundId, processRefundDTO, currentUserId) {
        try {
            if (!refundId || !mongoose_2.Types.ObjectId.isValid(refundId)) {
                throw new common_1.BadRequestException('Valid refund ID is required');
            }
            if (!processRefundDTO.paidInPayrollRunId) {
                throw new common_1.BadRequestException('Payroll run ID is required to process refund');
            }
            const refund = await this.refundModel.findById(refundId);
            if (!refund) {
                throw new common_1.NotFoundException(`Refund with ID ${refundId} not found`);
            }
            if (refund.status !== payroll_tracking_enum_1.RefundStatus.PENDING) {
                throw new common_1.BadRequestException(`Refund is already ${refund.status}. Only pending refunds can be processed.`);
            }
            const updatedRefund = await this.refundModel
                .findByIdAndUpdate(refundId, {
                status: payroll_tracking_enum_1.RefundStatus.PAID,
                paidInPayrollRunId: this.validateObjectId(processRefundDTO.paidInPayrollRunId, 'paidInPayrollRunId'),
                updatedBy: new mongoose_2.Types.ObjectId(currentUserId),
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('financeStaffId', 'firstName lastName')
                .populate('claimId')
                .populate('disputeId')
                .populate('paidInPayrollRunId')
                .exec();
            if (!updatedRefund) {
                throw new common_1.NotFoundException(`Refund with ID ${refundId} not found after processing`);
            }
            const employeeIdValue = updatedRefund.employeeId;
            const employeeId = employeeIdValue instanceof mongoose_2.Types.ObjectId
                ? employeeIdValue.toString()
                : employeeIdValue?._id?.toString() || String(employeeIdValue);
            const refundAmount = updatedRefund.refundDetails?.amount || 0;
            const refundDescription = updatedRefund.refundDetails?.description || 'Refund';
            const payrollRunIdValue = updatedRefund.paidInPayrollRunId;
            const payrollRunId = payrollRunIdValue instanceof mongoose_2.Types.ObjectId
                ? payrollRunIdValue.toString()
                : payrollRunIdValue?._id?.toString() || (payrollRunIdValue ? String(payrollRunIdValue) : 'N/A');
            await this.sendNotification('REFUND_PROCESSED', employeeId, 'DEPARTMENT_EMPLOYEE', `Your refund of ${refundAmount} for "${refundDescription}" has been processed and included in payroll run ${payrollRunId}. The amount will be reflected in your next payslip.`, {
                refundId: updatedRefund._id.toString(),
                refundAmount,
                refundDescription,
                payrollRunId,
                status: payroll_tracking_enum_1.RefundStatus.PAID,
                claimId: updatedRefund.claimId?.toString(),
                disputeId: updatedRefund.disputeId?.toString(),
            });
            return updatedRefund;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to process refund: ${error?.message || 'Unknown error'}`);
        }
    }
    async approveClaimBySpecialist(claimId, approveClaimBySpecialistDTO, currentUserId) {
        try {
            if (!claimId || claimId.trim().length === 0) {
                throw new common_1.BadRequestException('Claim ID is required');
            }
            const claim = await this.claimModel.findOne({ claimId });
            if (!claim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found`);
            }
            if (claim.status !== payroll_tracking_enum_1.ClaimStatus.UNDER_REVIEW) {
                throw new common_1.BadRequestException(`Claim is already ${claim.status}. Only claims under review can be approved by specialist.`);
            }
            const approvedAmount = approveClaimBySpecialistDTO.approvedAmount || claim.amount;
            if (approvedAmount <= 0) {
                throw new common_1.BadRequestException('Approved amount must be greater than 0');
            }
            if (approvedAmount > claim.amount) {
                throw new common_1.BadRequestException(`Approved amount (${approvedAmount}) cannot exceed the original claim amount (${claim.amount})`);
            }
            const validPayrollSpecialistId = await this.validateEmployeeExists(approveClaimBySpecialistDTO.payrollSpecialistId, false);
            const updatedClaim = await this.claimModel
                .findOneAndUpdate({ claimId }, {
                status: payroll_tracking_enum_1.ClaimStatus.PENDING_MANAGER_APPROVAL,
                payrollSpecialistId: validPayrollSpecialistId,
                approvedAmount,
                resolutionComment: approveClaimBySpecialistDTO.resolutionComment,
                updatedBy: new mongoose_2.Types.ObjectId(currentUserId),
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .exec();
            if (!updatedClaim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found after approval`);
            }
            const employeeIdValue = updatedClaim.employeeId;
            const employeeId = employeeIdValue instanceof mongoose_2.Types.ObjectId
                ? employeeIdValue.toString()
                : employeeIdValue?._id?.toString() || String(employeeIdValue);
            await this.sendNotification('CLAIM_PENDING_MANAGER_APPROVAL', employeeId, 'DEPARTMENT_EMPLOYEE', `Your expense claim ${claimId} has been approved by payroll specialist and is pending manager approval. Approved amount: ${approvedAmount}`, {
                claimId: updatedClaim.claimId,
                approvedAmount,
                status: payroll_tracking_enum_1.ClaimStatus.PENDING_MANAGER_APPROVAL,
            });
            return updatedClaim;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to approve claim: ${error?.message || 'Unknown error'}`);
        }
    }
    async rejectClaimBySpecialist(claimId, rejectClaimBySpecialistDTO, currentUserId) {
        try {
            if (!claimId || claimId.trim().length === 0) {
                throw new common_1.BadRequestException('Claim ID is required');
            }
            if (!rejectClaimBySpecialistDTO.rejectionReason ||
                rejectClaimBySpecialistDTO.rejectionReason.trim().length === 0) {
                throw new common_1.BadRequestException('Rejection reason is required');
            }
            const claim = await this.claimModel.findOne({ claimId });
            if (!claim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found`);
            }
            if (claim.status !== payroll_tracking_enum_1.ClaimStatus.UNDER_REVIEW) {
                throw new common_1.BadRequestException(`Claim is already ${claim.status}. Cannot reject a claim that is not under review.`);
            }
            const validPayrollSpecialistId = await this.validateEmployeeExists(rejectClaimBySpecialistDTO.payrollSpecialistId, false);
            const updatedClaim = await this.claimModel
                .findOneAndUpdate({ claimId }, {
                status: payroll_tracking_enum_1.ClaimStatus.REJECTED,
                rejectionReason: rejectClaimBySpecialistDTO.rejectionReason.trim(),
                payrollSpecialistId: validPayrollSpecialistId,
                updatedBy: new mongoose_2.Types.ObjectId(currentUserId),
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .exec();
            if (!updatedClaim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found after rejection`);
            }
            const employeeIdValue = updatedClaim.employeeId;
            const employeeId = employeeIdValue instanceof mongoose_2.Types.ObjectId
                ? employeeIdValue.toString()
                : employeeIdValue?._id?.toString() || String(employeeIdValue);
            await this.sendNotification('CLAIM_REJECTED', employeeId, 'DEPARTMENT_EMPLOYEE', `Your expense claim ${claimId} has been rejected. Reason: ${rejectClaimBySpecialistDTO.rejectionReason}`, {
                claimId: updatedClaim.claimId,
                rejectionReason: rejectClaimBySpecialistDTO.rejectionReason,
                status: payroll_tracking_enum_1.ClaimStatus.REJECTED,
            });
            return updatedClaim;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to reject claim: ${error?.message || 'Unknown error'}`);
        }
    }
    async approveDisputeBySpecialist(disputeId, approveDisputeBySpecialistDTO, currentUserId) {
        try {
            if (!disputeId || disputeId.trim().length === 0) {
                throw new common_1.BadRequestException('Dispute ID is required');
            }
            const dispute = await this.disputeModel.findOne({ disputeId });
            if (!dispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found`);
            }
            if (dispute.status !== payroll_tracking_enum_1.DisputeStatus.UNDER_REVIEW) {
                throw new common_1.BadRequestException(`Dispute is already ${dispute.status}. Only disputes under review can be approved by specialist.`);
            }
            const validPayrollSpecialistId = await this.validateEmployeeExists(approveDisputeBySpecialistDTO.payrollSpecialistId, false);
            const updatedDispute = await this.disputeModel
                .findOneAndUpdate({ disputeId }, {
                status: payroll_tracking_enum_1.DisputeStatus.PENDING_MANAGER_APPROVAL,
                payrollSpecialistId: validPayrollSpecialistId,
                resolutionComment: approveDisputeBySpecialistDTO.resolutionComment,
                updatedBy: new mongoose_2.Types.ObjectId(currentUserId),
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .populate('payslipId')
                .exec();
            if (!updatedDispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found after approval`);
            }
            const employeeIdValue = updatedDispute.employeeId;
            const employeeId = employeeIdValue instanceof mongoose_2.Types.ObjectId
                ? employeeIdValue.toString()
                : employeeIdValue?._id?.toString() || String(employeeIdValue);
            await this.sendNotification('DISPUTE_PENDING_MANAGER_APPROVAL', employeeId, 'DEPARTMENT_EMPLOYEE', `Your payroll dispute ${disputeId} has been approved by payroll specialist and is pending manager approval.`, {
                disputeId: updatedDispute.disputeId,
                status: payroll_tracking_enum_1.DisputeStatus.PENDING_MANAGER_APPROVAL,
            });
            return updatedDispute;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to approve dispute: ${error?.message || 'Unknown error'}`);
        }
    }
    async rejectDisputeBySpecialist(disputeId, rejectDisputeBySpecialistDTO, currentUserId) {
        try {
            if (!disputeId || disputeId.trim().length === 0) {
                throw new common_1.BadRequestException('Dispute ID is required');
            }
            if (!rejectDisputeBySpecialistDTO.rejectionReason ||
                rejectDisputeBySpecialistDTO.rejectionReason.trim().length === 0) {
                throw new common_1.BadRequestException('Rejection reason is required');
            }
            const dispute = await this.disputeModel.findOne({ disputeId });
            if (!dispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found`);
            }
            if (dispute.status !== payroll_tracking_enum_1.DisputeStatus.UNDER_REVIEW) {
                throw new common_1.BadRequestException(`Dispute is already ${dispute.status}. Cannot reject a dispute that is not under review.`);
            }
            const validPayrollSpecialistId = await this.validateEmployeeExists(rejectDisputeBySpecialistDTO.payrollSpecialistId, false);
            const updatedDispute = await this.disputeModel
                .findOneAndUpdate({ disputeId }, {
                status: payroll_tracking_enum_1.DisputeStatus.REJECTED,
                rejectionReason: rejectDisputeBySpecialistDTO.rejectionReason.trim(),
                payrollSpecialistId: validPayrollSpecialistId,
                updatedBy: new mongoose_2.Types.ObjectId(currentUserId),
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .populate('payslipId')
                .exec();
            if (!updatedDispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found after rejection`);
            }
            const employeeIdValue = updatedDispute.employeeId;
            const employeeId = employeeIdValue instanceof mongoose_2.Types.ObjectId
                ? employeeIdValue.toString()
                : employeeIdValue?._id?.toString() || String(employeeIdValue);
            await this.sendNotification('DISPUTE_REJECTED', employeeId, 'DEPARTMENT_EMPLOYEE', `Your payroll dispute ${disputeId} has been rejected. Reason: ${rejectDisputeBySpecialistDTO.rejectionReason}`, {
                disputeId: updatedDispute.disputeId,
                rejectionReason: rejectDisputeBySpecialistDTO.rejectionReason,
                status: payroll_tracking_enum_1.DisputeStatus.REJECTED,
            });
            return updatedDispute;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to reject dispute: ${error?.message || 'Unknown error'}`);
        }
    }
    async confirmDisputeApproval(disputeId, confirmDisputeApprovalDTO, currentUserId) {
        try {
            if (!disputeId || disputeId.trim().length === 0) {
                throw new common_1.BadRequestException('Dispute ID is required');
            }
            const dispute = await this.disputeModel.findOne({ disputeId });
            if (!dispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found`);
            }
            if (dispute.status !== payroll_tracking_enum_1.DisputeStatus.PENDING_MANAGER_APPROVAL) {
                throw new common_1.BadRequestException(`Dispute must be pending manager approval. Current status: ${dispute.status}`);
            }
            const validPayrollManagerId = await this.validateEmployeeExists(confirmDisputeApprovalDTO.payrollManagerId, false);
            const updatedDispute = await this.disputeModel
                .findOneAndUpdate({ disputeId }, {
                status: payroll_tracking_enum_1.DisputeStatus.APPROVED,
                payrollManagerId: validPayrollManagerId,
                resolutionComment: confirmDisputeApprovalDTO.resolutionComment ||
                    dispute.resolutionComment,
                updatedBy: new mongoose_2.Types.ObjectId(currentUserId),
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .populate('payslipId')
                .exec();
            if (!updatedDispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found after confirmation`);
            }
            await this.sendNotification('DISPUTE_APPROVED_FOR_FINANCE', 'FINANCE_STAFF', 'FINANCE_STAFF', `A new dispute ${disputeId} has been approved and is ready for refund processing. Employee: ${updatedDispute.employeeId?.firstName || ''} ${updatedDispute.employeeId?.lastName || ''}`, {
                disputeId: updatedDispute.disputeId,
                employeeId: (() => {
                    const empId = updatedDispute.employeeId;
                    return empId instanceof mongoose_2.Types.ObjectId
                        ? empId.toString()
                        : empId?._id?.toString() || String(empId);
                })(),
                status: payroll_tracking_enum_1.DisputeStatus.APPROVED,
            });
            const employeeIdValue = updatedDispute.employeeId;
            const employeeId = employeeIdValue instanceof mongoose_2.Types.ObjectId
                ? employeeIdValue.toString()
                : employeeIdValue?._id?.toString() || String(employeeIdValue);
            await this.sendNotification('DISPUTE_APPROVED', employeeId, 'DEPARTMENT_EMPLOYEE', `Your payroll dispute ${disputeId} has been fully approved by the payroll manager. Finance staff will process your refund.`, {
                disputeId: updatedDispute.disputeId,
                status: payroll_tracking_enum_1.DisputeStatus.APPROVED,
            });
            return updatedDispute;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to confirm dispute approval: ${error?.message || 'Unknown error'}`);
        }
    }
    async confirmClaimApproval(claimId, confirmClaimApprovalDTO, currentUserId) {
        try {
            if (!claimId || claimId.trim().length === 0) {
                throw new common_1.BadRequestException('Claim ID is required');
            }
            const claim = await this.claimModel.findOne({ claimId });
            if (!claim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found`);
            }
            if (claim.status !== payroll_tracking_enum_1.ClaimStatus.PENDING_MANAGER_APPROVAL) {
                throw new common_1.BadRequestException(`Claim must be pending manager approval. Current status: ${claim.status}`);
            }
            const validPayrollManagerId = await this.validateEmployeeExists(confirmClaimApprovalDTO.payrollManagerId, false);
            const updatedClaim = await this.claimModel
                .findOneAndUpdate({ claimId }, {
                status: payroll_tracking_enum_1.ClaimStatus.APPROVED,
                payrollManagerId: validPayrollManagerId,
                resolutionComment: confirmClaimApprovalDTO.resolutionComment ||
                    claim.resolutionComment,
                updatedBy: new mongoose_2.Types.ObjectId(currentUserId),
            }, { new: true, runValidators: true })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .exec();
            if (!updatedClaim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found after confirmation`);
            }
            await this.sendNotification('CLAIM_APPROVED_FOR_FINANCE', 'FINANCE_STAFF', 'FINANCE_STAFF', `A new expense claim ${claimId} has been approved and is ready for refund processing. Employee: ${updatedClaim.employeeId?.firstName || ''} ${updatedClaim.employeeId?.lastName || ''}. Amount: ${updatedClaim.approvedAmount || updatedClaim.amount}`, {
                claimId: updatedClaim.claimId,
                employeeId: (() => {
                    const empId = updatedClaim.employeeId;
                    return empId instanceof mongoose_2.Types.ObjectId
                        ? empId.toString()
                        : empId?._id?.toString() || String(empId);
                })(),
                approvedAmount: updatedClaim.approvedAmount || updatedClaim.amount,
                status: payroll_tracking_enum_1.ClaimStatus.APPROVED,
            });
            const employeeIdValue = updatedClaim.employeeId;
            const employeeId = employeeIdValue instanceof mongoose_2.Types.ObjectId
                ? employeeIdValue.toString()
                : employeeIdValue?._id?.toString() || String(employeeIdValue);
            await this.sendNotification('CLAIM_APPROVED', employeeId, 'DEPARTMENT_EMPLOYEE', `Your expense claim ${claimId} has been fully approved by the payroll manager. Finance staff will process your refund of ${updatedClaim.approvedAmount || updatedClaim.amount}.`, {
                claimId: updatedClaim.claimId,
                approvedAmount: updatedClaim.approvedAmount || updatedClaim.amount,
                status: payroll_tracking_enum_1.ClaimStatus.APPROVED,
            });
            return updatedClaim;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to confirm claim approval: ${error?.message || 'Unknown error'}`);
        }
    }
    async getApprovedDisputesForFinance() {
        try {
            return await this.disputeModel
                .find({ status: payroll_tracking_enum_1.DisputeStatus.APPROVED })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .populate('payslipId')
                .sort({ updatedAt: -1, createdAt: -1 })
                .exec();
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to retrieve approved disputes: ${error?.message || 'Unknown error'}`);
        }
    }
    async getApprovedClaimsForFinance() {
        try {
            return await this.claimModel
                .find({ status: payroll_tracking_enum_1.ClaimStatus.APPROVED })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .sort({ updatedAt: -1, createdAt: -1 })
                .exec();
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to retrieve approved claims: ${error?.message || 'Unknown error'}`);
        }
    }
    async generateRefundForDispute(disputeId, generateRefundForDisputeDTO, currentUserId) {
        try {
            if (!disputeId || disputeId.trim().length === 0) {
                throw new common_1.BadRequestException('Dispute ID is required');
            }
            const dispute = await this.disputeModel.findOne({ disputeId });
            if (!dispute) {
                throw new common_1.NotFoundException(`Dispute with ID ${disputeId} not found`);
            }
            if (dispute.status !== payroll_tracking_enum_1.DisputeStatus.APPROVED) {
                throw new common_1.BadRequestException(`Dispute must be approved before generating refund. Current status: ${dispute.status}`);
            }
            const existingRefund = await this.refundModel.findOne({
                disputeId: dispute._id,
                status: payroll_tracking_enum_1.RefundStatus.PENDING,
            });
            if (existingRefund) {
                throw new common_1.BadRequestException('A pending refund already exists for this dispute');
            }
            const disputeObjectId = dispute._id.toString();
            const employeeId = dispute.employeeId.toString();
            const createRefundDTO = {
                refundDetails: generateRefundForDisputeDTO.refundDetails,
                employeeId,
                financeStaffId: generateRefundForDisputeDTO.financeStaffId,
                disputeId: disputeObjectId,
            };
            return await this.createRefund(createRefundDTO, currentUserId);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to generate refund for dispute: ${error?.message || 'Unknown error'}`);
        }
    }
    async generateRefundForClaim(claimId, generateRefundForClaimDTO, currentUserId) {
        try {
            if (!claimId || claimId.trim().length === 0) {
                throw new common_1.BadRequestException('Claim ID is required');
            }
            const claim = await this.claimModel.findOne({ claimId });
            if (!claim) {
                throw new common_1.NotFoundException(`Claim with ID ${claimId} not found`);
            }
            if (claim.status !== payroll_tracking_enum_1.ClaimStatus.APPROVED) {
                throw new common_1.BadRequestException(`Claim must be approved before generating refund. Current status: ${claim.status}`);
            }
            const existingRefund = await this.refundModel.findOne({
                claimId: claim._id,
                status: payroll_tracking_enum_1.RefundStatus.PENDING,
            });
            if (existingRefund) {
                throw new common_1.BadRequestException('A pending refund already exists for this claim');
            }
            const employeeId = claim.employeeId.toString();
            const claimObjectId = claim._id.toString();
            const createRefundDTO = {
                refundDetails: generateRefundForClaimDTO.refundDetails,
                employeeId,
                financeStaffId: generateRefundForClaimDTO.financeStaffId,
                claimId: claimObjectId,
            };
            return await this.createRefund(createRefundDTO, currentUserId);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to generate refund for claim: ${error?.message || 'Unknown error'}`);
        }
    }
    async getPayslipsByEmployeeId(employeeId) {
        try {
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            const payslips = await this.payslipModel
                .find({ employeeId: validEmployeeId })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollRunId', 'runId payrollPeriod status entity')
                .sort({ createdAt: -1 })
                .exec();
            const enhancedPayslips = await Promise.all(payslips.map(async (payslip) => {
                const payslipId = payslip._id;
                const disputes = await this.disputeModel
                    .find({ payslipId })
                    .select('disputeId status description createdAt')
                    .sort({ createdAt: -1 })
                    .exec();
                const isDisputed = disputes.length > 0;
                const hasActiveDispute = disputes.some((d) => d.status !== payroll_tracking_enum_1.DisputeStatus.REJECTED);
                const payslipData = payslip.toObject ? payslip.toObject() : payslip;
                return {
                    ...payslipData,
                    paymentStatus: payslip.paymentStatus,
                    isDisputed,
                    hasActiveDispute,
                    disputeCount: disputes.length,
                    status: hasActiveDispute
                        ? payslip.paymentStatus === payroll_execution_enum_1.PaySlipPaymentStatus.PAID
                            ? 'paid-disputed'
                            : 'disputed'
                        : payslip.paymentStatus === payroll_execution_enum_1.PaySlipPaymentStatus.PAID
                            ? 'paid'
                            : 'pending',
                };
            }));
            return enhancedPayslips;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve payslips: ${error?.message || 'Unknown error'}`);
        }
    }
    async getPayslipById(payslipId, employeeId) {
        try {
            const validPayslipId = this.validateObjectId(payslipId, 'payslipId');
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            const payslip = await this.payslipModel
                .findOne({ _id: validPayslipId, employeeId: validEmployeeId })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollRunId', 'runId payrollPeriod status entity')
                .exec();
            if (!payslip) {
                throw new common_1.NotFoundException(`Payslip with ID ${payslipId} not found for this employee`);
            }
            const disputes = await this.disputeModel
                .find({ payslipId: validPayslipId })
                .select('disputeId status description createdAt')
                .sort({ createdAt: -1 })
                .exec();
            const isDisputed = disputes.length > 0;
            const hasActiveDispute = disputes.some((d) => d.status !== payroll_tracking_enum_1.DisputeStatus.REJECTED);
            const latestDispute = disputes.length > 0 ? disputes[0] : null;
            const payslipData = payslip.toObject ? payslip.toObject() : payslip;
            return {
                ...payslipData,
                paymentStatus: payslip.paymentStatus,
                isDisputed,
                hasActiveDispute,
                disputeCount: disputes.length,
                latestDispute: latestDispute
                    ? {
                        disputeId: latestDispute.disputeId,
                        status: latestDispute.status,
                        description: latestDispute.description,
                        createdAt: latestDispute?.createdAt,
                    }
                    : null,
                status: hasActiveDispute
                    ? payslip.paymentStatus === payroll_execution_enum_1.PaySlipPaymentStatus.PAID
                        ? 'paid-disputed'
                        : 'disputed'
                    : payslip.paymentStatus === payroll_execution_enum_1.PaySlipPaymentStatus.PAID
                        ? 'paid'
                        : 'pending',
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve payslip: ${error?.message || 'Unknown error'}`);
        }
    }
    async getEmployeeBaseSalary(employeeId) {
        try {
            const employee = await this.employeeProfileService.findOne(employeeId);
            let payGradeIdValue = null;
            if (employee.payGradeId) {
                payGradeIdValue = employee.payGradeId?._id?.toString() ||
                    employee.payGradeId?.toString() ||
                    null;
            }
            let payGradeDetails = null;
            let baseSalary = null;
            let grossSalary = null;
            if (payGradeIdValue) {
                try {
                    const payGrade = await this.payrollConfigurationService.findOnePayGrade(payGradeIdValue);
                    if (payGrade) {
                        baseSalary = payGrade.baseSalary || null;
                        grossSalary = payGrade.grossSalary || null;
                        payGradeDetails = {
                            _id: payGrade._id?.toString(),
                            grade: payGrade.grade,
                            baseSalary: payGrade.baseSalary,
                            grossSalary: payGrade.grossSalary,
                            status: payGrade.status,
                            ...(payGrade.status !== payroll_configuration_enums_1.ConfigStatus.APPROVED && {
                                statusWarning: `Pay grade status is ${payGrade.status}. Base salary may not be active.`,
                            }),
                        };
                    }
                }
                catch (error) {
                    console.warn(`Pay grade not found for employee ${employeeId}: ${error?.message}`);
                }
            }
            const response = {
                employeeId: employee._id?.toString() || employee.id?.toString() || employeeId,
                employeeNumber: employee.employeeNumber,
                firstName: employee.firstName,
                lastName: employee.lastName,
                contractType: employee.contractType,
                workType: employee.workType,
                payGradeId: payGradeIdValue,
                payGradeDetails: payGradeDetails,
                baseSalary: baseSalary,
                grossSalary: grossSalary,
                contractStartDate: employee.contractStartDate,
                contractEndDate: employee.contractEndDate,
            };
            if (!payGradeIdValue) {
                response.warning = 'No pay grade assigned to this employee. Base salary information is not available.';
            }
            else if (!baseSalary) {
                response.warning = 'Pay grade found but base salary information is not available.';
            }
            return response;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve base salary: ${error?.message || 'Unknown error'}`);
        }
    }
    async getLeaveEncashmentByEmployeeId(employeeId, payrollRunId) {
        try {
            const employee = await this.employeeProfileService.findOne(employeeId);
            const validEmployeeId = new mongoose_2.Types.ObjectId(employee._id?.toString() || employeeId);
            const leaveEntitlements = await this.leaveEntitlementModel
                .find({ employeeId: validEmployeeId })
                .populate('leaveTypeId', 'name code paid encashable')
                .exec();
            let payrollRun;
            let payslip;
            if (payrollRunId) {
                const validPayrollRunId = this.validateObjectId(payrollRunId, 'payrollRunId');
                payrollRun = await this.payrollRunsModel.findById(validPayrollRunId).exec();
                if (!payrollRun) {
                    throw new common_1.NotFoundException(`Payroll run with ID ${payrollRunId} not found`);
                }
                payslip = await this.payslipModel
                    .findOne({ employeeId: validEmployeeId, payrollRunId: validPayrollRunId })
                    .populate('payrollRunId')
                    .exec();
            }
            else {
                payslip = await this.payslipModel
                    .findOne({ employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .sort({ createdAt: -1 })
                    .exec();
                if (payslip && payslip.payrollRunId) {
                    payrollRun = await this.payrollRunsModel.findById(payslip.payrollRunId).exec();
                }
            }
            const leaveEncashment = payslip?.earningsDetails?.allowances?.filter((allowance) => allowance.type === 'LEAVE_ENCASHMENT' ||
                allowance.name?.toLowerCase().includes('leave') ||
                allowance.name?.toLowerCase().includes('encashment')) || [];
            const enrichedLeaveEncashment = await Promise.all(leaveEncashment.map(async (enc) => {
                try {
                    if (enc.name) {
                        const allowancesResult = await this.payrollConfigurationService.findAllAllowances({
                            status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
                            page: 1,
                            limit: 100,
                        });
                        const matchingAllowance = allowancesResult.data.find((allowance) => allowance.name === enc.name || allowance._id?.toString() === enc._id?.toString());
                        if (matchingAllowance) {
                            return {
                                ...enc,
                                configurationDetails: {
                                    name: matchingAllowance.name,
                                    amount: matchingAllowance.amount,
                                    status: matchingAllowance.status,
                                    approvedAt: matchingAllowance.approvedAt,
                                },
                            };
                        }
                    }
                    return enc;
                }
                catch (error) {
                    console.warn(`Failed to enrich leave encashment allowance: ${error?.message}`);
                    return enc;
                }
            }));
            const baseSalary = employee.payGradeId?.baseSalary || 0;
            const dailySalary = baseSalary > 0 ? baseSalary / 30 : 0;
            const encashableLeaves = leaveEntitlements
                .filter((ent) => {
                const leaveType = ent.leaveTypeId;
                return leaveType && (leaveType.encashable !== false) && ent.remaining > 0;
            })
                .map((ent) => {
                const leaveType = ent.leaveTypeId;
                const potentialEncashment = ent.remaining * dailySalary;
                return {
                    leaveType: {
                        id: leaveType._id || leaveType,
                        name: leaveType.name,
                        code: leaveType.code,
                    },
                    remainingDays: ent.remaining,
                    accruedDays: ent.accruedActual,
                    takenDays: ent.taken,
                    potentialEncashmentAmount: potentialEncashment,
                    isEncashable: leaveType.encashable !== false,
                };
            });
            let payrollPeriodInfo = null;
            if (payrollRun) {
                const { startDate, endDate } = this.getPayrollPeriodDateRange(payrollRun);
                payrollPeriodInfo = {
                    payrollRunId: payrollRun._id,
                    runId: payrollRun.runId,
                    period: payrollRun.payrollPeriod,
                    startDate,
                    endDate,
                };
            }
            return {
                employeeId: validEmployeeId,
                employeeNumber: employee.employeeNumber,
                baseSalary,
                dailySalary,
                leaveEntitlements: leaveEntitlements.map((ent) => ({
                    leaveType: ent.leaveTypeId,
                    remaining: ent.remaining,
                    accrued: ent.accruedActual,
                    taken: ent.taken,
                    yearlyEntitlement: ent.yearlyEntitlement,
                })),
                encashableLeaves,
                encashmentInPayslip: enrichedLeaveEncashment.map((enc) => ({
                    type: enc.type,
                    name: enc.name,
                    amount: enc.amount,
                    description: enc.description,
                    configurationDetails: enc.configurationDetails,
                })),
                totalEncashmentInPayslip: enrichedLeaveEncashment.reduce((sum, enc) => sum + (enc.amount || 0), 0),
                payslipId: payslip?._id,
                payrollPeriod: payrollPeriodInfo,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve leave encashment: ${error?.message || 'Unknown error'}`);
        }
    }
    async getTransportationAllowance(employeeId, payslipId) {
        try {
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            let payslip;
            if (payslipId) {
                const validPayslipId = this.validateObjectId(payslipId, 'payslipId');
                payslip = await this.payslipModel
                    .findOne({ _id: validPayslipId, employeeId: validEmployeeId })
                    .exec();
            }
            else {
                payslip = await this.payslipModel
                    .findOne({ employeeId: validEmployeeId })
                    .sort({ createdAt: -1 })
                    .exec();
            }
            if (!payslip) {
                throw new common_1.NotFoundException('No payslip found for this employee');
            }
            const transportationAllowance = payslip.earningsDetails?.allowances?.filter((allowance) => allowance.type === 'TRANSPORTATION' ||
                allowance.name?.toLowerCase().includes('transport') ||
                allowance.name?.toLowerCase().includes('commuting')) || [];
            const enrichedTransportationAllowance = await Promise.all(transportationAllowance.map(async (allowance) => {
                try {
                    if (allowance.name) {
                        const allowancesResult = await this.payrollConfigurationService.findAllAllowances({
                            status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
                            page: 1,
                            limit: 100,
                        });
                        const matchingAllowance = allowancesResult.data.find((configAllowance) => configAllowance.name === allowance.name || configAllowance._id?.toString() === allowance._id?.toString());
                        if (matchingAllowance) {
                            return {
                                ...allowance,
                                configurationDetails: {
                                    name: matchingAllowance.name,
                                    amount: matchingAllowance.amount,
                                    status: matchingAllowance.status,
                                    approvedAt: matchingAllowance.approvedAt,
                                },
                            };
                        }
                    }
                    return allowance;
                }
                catch (error) {
                    console.warn(`Failed to enrich transportation allowance: ${error?.message}`);
                    return allowance;
                }
            }));
            return {
                payslipId: payslip._id,
                payrollPeriod: payslip.payrollRunId,
                transportationAllowance: enrichedTransportationAllowance,
                totalTransportationAllowance: enrichedTransportationAllowance.reduce((sum, allowance) => sum + (allowance.amount || 0), 0),
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve transportation allowance: ${error?.message || 'Unknown error'}`);
        }
    }
    async getTaxDeductions(employeeId, payslipId) {
        try {
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            let payslip;
            if (payslipId) {
                const validPayslipId = this.validateObjectId(payslipId, 'payslipId');
                payslip = await this.payslipModel
                    .findOne({ _id: validPayslipId, employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .exec();
            }
            else {
                payslip = await this.payslipModel
                    .findOne({ employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .sort({ createdAt: -1 })
                    .exec();
            }
            if (!payslip) {
                throw new common_1.NotFoundException('No payslip found for this employee');
            }
            return {
                payslipId: payslip._id,
                payrollPeriod: payslip.payrollRunId,
                taxDeductions: payslip.deductionsDetails?.taxes || [],
                totalTaxDeductions: payslip.deductionsDetails?.taxes?.reduce((sum, tax) => sum + (tax.amount || 0), 0) || 0,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve tax deductions: ${error?.message || 'Unknown error'}`);
        }
    }
    async getInsuranceDeductions(employeeId, payslipId) {
        try {
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            let payslip;
            if (payslipId) {
                const validPayslipId = this.validateObjectId(payslipId, 'payslipId');
                payslip = await this.payslipModel
                    .findOne({ _id: validPayslipId, employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .exec();
            }
            else {
                payslip = await this.payslipModel
                    .findOne({ employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .sort({ createdAt: -1 })
                    .exec();
            }
            if (!payslip) {
                throw new common_1.NotFoundException('No payslip found for this employee');
            }
            const insuranceDeductions = payslip.deductionsDetails?.insurances || [];
            const enrichedInsuranceDeductions = await Promise.all(insuranceDeductions.map((insurance) => this.enrichInsuranceDeductionWithConfiguration(insurance)));
            return {
                payslipId: payslip._id,
                payrollPeriod: payslip.payrollRunId,
                insuranceDeductions: enrichedInsuranceDeductions,
                totalInsuranceDeductions: enrichedInsuranceDeductions.reduce((sum, insurance) => sum + (insurance.amount || 0), 0),
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve insurance deductions: ${error?.message || 'Unknown error'}`);
        }
    }
    async getMisconductDeductions(employeeId, payslipId) {
        try {
            const employee = await this.employeeProfileService.findOne(employeeId);
            const validEmployeeId = new mongoose_2.Types.ObjectId(employee._id?.toString() || employeeId);
            let payrollRun;
            let payslip;
            let payrollPeriodRange = null;
            if (payslipId) {
                const validPayslipId = this.validateObjectId(payslipId, 'payslipId');
                payslip = await this.payslipModel
                    .findOne({ _id: validPayslipId, employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .exec();
                if (!payslip) {
                    throw new common_1.NotFoundException(`Payslip with ID ${payslipId} not found for this employee`);
                }
                if (payslip.payrollRunId) {
                    payrollRun = await this.payrollRunsModel.findById(payslip.payrollRunId).exec();
                    if (payrollRun) {
                        payrollPeriodRange = this.getPayrollPeriodDateRange(payrollRun);
                    }
                }
            }
            else {
                payslip = await this.payslipModel
                    .findOne({ employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .sort({ createdAt: -1 })
                    .exec();
                if (!payslip) {
                    throw new common_1.NotFoundException('No payslip found for this employee');
                }
                if (payslip.payrollRunId) {
                    payrollRun = await this.payrollRunsModel.findById(payslip.payrollRunId).exec();
                    if (payrollRun) {
                        payrollPeriodRange = this.getPayrollPeriodDateRange(payrollRun);
                    }
                }
            }
            const allTimeExceptions = await this.timeExceptionModel
                .find({
                employeeId: validEmployeeId,
                status: { $in: [index_1.TimeExceptionStatus.RESOLVED, index_1.TimeExceptionStatus.APPROVED] },
                type: {
                    $in: [
                        index_1.TimeExceptionType.LATE,
                        index_1.TimeExceptionType.SHORT_TIME,
                        index_1.TimeExceptionType.EARLY_LEAVE,
                        index_1.TimeExceptionType.MISSED_PUNCH,
                    ],
                },
            })
                .populate('attendanceRecordId')
                .sort({ _id: -1 })
                .exec();
            let relevantTimeExceptions = allTimeExceptions;
            if (payrollPeriodRange) {
                relevantTimeExceptions = allTimeExceptions.filter((exception) => {
                    const attendanceRecord = exception.attendanceRecordId;
                    if (!attendanceRecord) {
                        return true;
                    }
                    let exceptionDate;
                    if (attendanceRecord.punches && Array.isArray(attendanceRecord.punches) && attendanceRecord.punches.length > 0) {
                        exceptionDate = new Date(attendanceRecord.punches[0].time);
                    }
                    else {
                        return true;
                    }
                    return this.isDateInRange(exceptionDate, payrollPeriodRange.startDate, payrollPeriodRange.endDate);
                });
            }
            let attendanceRecords = [];
            if (payrollPeriodRange) {
                const allAttendanceRecords = await this.attendanceRecordModel
                    .find({
                    employeeId: validEmployeeId,
                    finalisedForPayroll: true,
                })
                    .exec();
                attendanceRecords = allAttendanceRecords.filter((record) => {
                    if (!record.punches || record.punches.length === 0) {
                        return false;
                    }
                    const firstPunchTime = new Date(record.punches[0].time);
                    return this.isDateInRange(firstPunchTime, payrollPeriodRange.startDate, payrollPeriodRange.endDate);
                });
            }
            const baseSalary = employee.payGradeId?.baseSalary || 0;
            const dailySalary = baseSalary > 0 ? baseSalary / 30 : 0;
            const hourlySalary = dailySalary > 0 ? dailySalary / 8 : 0;
            const lateExceptions = relevantTimeExceptions.filter((ex) => ex.type === index_1.TimeExceptionType.LATE);
            const earlyLeaveExceptions = relevantTimeExceptions.filter((ex) => ex.type === index_1.TimeExceptionType.EARLY_LEAVE);
            const shortTimeExceptions = relevantTimeExceptions.filter((ex) => ex.type === index_1.TimeExceptionType.SHORT_TIME);
            const missedPunchExceptions = relevantTimeExceptions.filter((ex) => ex.type === index_1.TimeExceptionType.MISSED_PUNCH);
            const payslipPenalties = payslip.deductionsDetails?.penalties || null;
            const misconductSummary = {
                lateCount: lateExceptions.length,
                earlyLeaveCount: earlyLeaveExceptions.length,
                shortTimeCount: shortTimeExceptions.length,
                missedPunchCount: missedPunchExceptions.length,
                totalExceptions: relevantTimeExceptions.length,
            };
            return {
                employeeId: validEmployeeId,
                employeeNumber: employee.employeeNumber,
                payslipId: payslip._id,
                payrollPeriod: payrollRun ? {
                    payrollRunId: payrollRun._id,
                    runId: payrollRun.runId,
                    period: payrollRun.payrollPeriod,
                    startDate: payrollPeriodRange?.startDate,
                    endDate: payrollPeriodRange?.endDate,
                } : null,
                baseSalary,
                dailySalary,
                hourlySalary,
                penalties: payslipPenalties,
                misconductSummary,
                timeExceptions: {
                    all: relevantTimeExceptions.map((ex) => {
                        const attendanceRecord = ex.attendanceRecordId;
                        let exceptionDate;
                        if (attendanceRecord && typeof attendanceRecord === 'object') {
                            if (attendanceRecord.punches && Array.isArray(attendanceRecord.punches) && attendanceRecord.punches.length > 0) {
                                exceptionDate = new Date(attendanceRecord.punches[0].time);
                            }
                        }
                        return {
                            id: ex._id,
                            type: ex.type,
                            status: ex.status,
                            reason: ex.reason,
                            attendanceRecordId: ex.attendanceRecordId,
                            date: exceptionDate,
                        };
                    }),
                    late: lateExceptions.map((ex) => ({
                        id: ex._id,
                        type: ex.type,
                        status: ex.status,
                        reason: ex.reason,
                        attendanceRecordId: ex.attendanceRecordId,
                    })),
                    earlyLeave: earlyLeaveExceptions.map((ex) => ({
                        id: ex._id,
                        type: ex.type,
                        status: ex.status,
                        reason: ex.reason,
                        attendanceRecordId: ex.attendanceRecordId,
                    })),
                    shortTime: shortTimeExceptions.map((ex) => ({
                        id: ex._id,
                        type: ex.type,
                        status: ex.status,
                        reason: ex.reason,
                        attendanceRecordId: ex.attendanceRecordId,
                    })),
                    missedPunch: missedPunchExceptions.map((ex) => ({
                        id: ex._id,
                        type: ex.type,
                        status: ex.status,
                        reason: ex.reason,
                        attendanceRecordId: ex.attendanceRecordId,
                    })),
                },
                attendanceRecords: attendanceRecords.length,
                note: 'Actual deductions are reflected in the payslip penalties. This is informational data showing time exceptions that may have resulted in deductions.',
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve misconduct deductions: ${error?.message || 'Unknown error'}`);
        }
    }
    async getUnpaidLeaveDeductions(employeeId, payslipId) {
        try {
            const employee = await this.employeeProfileService.findOne(employeeId);
            const validEmployeeId = new mongoose_2.Types.ObjectId(employee._id?.toString() || employeeId);
            let payrollRun;
            let payslip;
            let payrollPeriodRange = null;
            if (payslipId) {
                const validPayslipId = this.validateObjectId(payslipId, 'payslipId');
                payslip = await this.payslipModel
                    .findOne({ _id: validPayslipId, employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .exec();
                if (!payslip) {
                    throw new common_1.NotFoundException(`Payslip with ID ${payslipId} not found for this employee`);
                }
                if (payslip.payrollRunId) {
                    payrollRun = await this.payrollRunsModel.findById(payslip.payrollRunId).exec();
                    if (payrollRun) {
                        payrollPeriodRange = this.getPayrollPeriodDateRange(payrollRun);
                    }
                }
            }
            else {
                payslip = await this.payslipModel
                    .findOne({ employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .sort({ createdAt: -1 })
                    .exec();
                if (payslip && payslip.payrollRunId) {
                    payrollRun = await this.payrollRunsModel.findById(payslip.payrollRunId).exec();
                    if (payrollRun) {
                        payrollPeriodRange = this.getPayrollPeriodDateRange(payrollRun);
                    }
                }
            }
            const allLeaveRequests = await this.leaveRequestModel
                .find({
                employeeId: validEmployeeId,
                status: leave_status_enum_1.LeaveStatus.APPROVED,
            })
                .populate('leaveTypeId', 'name code paid deductible')
                .sort({ 'dates.from': -1 })
                .exec();
            const unpaidLeaveRequests = allLeaveRequests.filter((request) => {
                const leaveType = request.leaveTypeId;
                return leaveType && leaveType.paid === false;
            });
            let relevantUnpaidLeaves = unpaidLeaveRequests;
            if (payrollPeriodRange) {
                relevantUnpaidLeaves = unpaidLeaveRequests.filter((leave) => {
                    const leaveStart = new Date(leave.dates.from);
                    const leaveEnd = new Date(leave.dates.to);
                    return this.doDateRangesOverlap(leaveStart, leaveEnd, payrollPeriodRange.startDate, payrollPeriodRange.endDate);
                });
            }
            const baseSalary = employee.payGradeId?.baseSalary || 0;
            const dailySalary = baseSalary > 0 ? baseSalary / 30 : 0;
            const hourlySalary = dailySalary > 0 ? dailySalary / 8 : 0;
            const unpaidLeaveDeductions = relevantUnpaidLeaves.map((leave) => {
                const leaveType = leave.leaveTypeId;
                const deductionAmount = leave.durationDays * dailySalary;
                let daysInPeriod = leave.durationDays;
                if (payrollPeriodRange) {
                    const leaveStart = new Date(leave.dates.from);
                    const leaveEnd = new Date(leave.dates.to);
                    const periodStart = new Date(payrollPeriodRange.startDate);
                    const periodEnd = new Date(payrollPeriodRange.endDate);
                    const overlapStart = leaveStart > periodStart ? leaveStart : periodStart;
                    const overlapEnd = leaveEnd < periodEnd ? leaveEnd : periodEnd;
                    if (overlapStart <= overlapEnd) {
                        const diffTime = overlapEnd.getTime() - overlapStart.getTime();
                        daysInPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    }
                    else {
                        daysInPeriod = 0;
                    }
                }
                return {
                    leaveRequestId: leave._id,
                    leaveType: {
                        id: leaveType._id || leaveType,
                        name: leaveType.name,
                        code: leaveType.code,
                        paid: leaveType.paid,
                        deductible: leaveType.deductible,
                    },
                    dates: {
                        from: leave.dates.from,
                        to: leave.dates.to,
                    },
                    durationDays: leave.durationDays,
                    daysInPayrollPeriod: daysInPeriod,
                    dailySalary,
                    deductionAmount: daysInPeriod * dailySalary,
                    justification: leave.justification,
                    status: leave.status,
                };
            });
            const totalDeductionAmount = unpaidLeaveDeductions.reduce((sum, deduction) => sum + (deduction.deductionAmount || 0), 0);
            const payslipDeduction = payslip?.deductionsDetails?.penalties?.unpaidLeaveDeduction || null;
            return {
                employeeId: validEmployeeId,
                employeeNumber: employee.employeeNumber,
                baseSalary,
                dailySalary,
                hourlySalary,
                unpaidLeaveRequests: unpaidLeaveDeductions,
                totalUnpaidLeaveDays: relevantUnpaidLeaves.reduce((sum, leave) => sum + leave.durationDays, 0),
                totalDeductionAmount,
                payslipDeduction,
                payslipId: payslip?._id,
                payrollPeriod: payrollRun ? {
                    payrollRunId: payrollRun._id,
                    runId: payrollRun.runId,
                    period: payrollRun.payrollPeriod,
                    startDate: payrollPeriodRange?.startDate,
                    endDate: payrollPeriodRange?.endDate,
                } : null,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve unpaid leave deductions: ${error?.message || 'Unknown error'}`);
        }
    }
    async getSalaryHistory(employeeId, limit = 12) {
        try {
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            return await this.payslipModel
                .find({ employeeId: validEmployeeId })
                .populate('employeeId', 'firstName lastName employeeNumber')
                .populate('payrollRunId', 'runId payrollPeriod status entity')
                .select('earningsDetails deductionsDetails totalGrossSalary totaDeductions netPay paymentStatus createdAt')
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec();
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve salary history: ${error?.message || 'Unknown error'}`);
        }
    }
    async getEmployerContributions(employeeId, payslipId) {
        try {
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            let payslip;
            if (payslipId) {
                const validPayslipId = this.validateObjectId(payslipId, 'payslipId');
                payslip = await this.payslipModel
                    .findOne({ _id: validPayslipId, employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .exec();
            }
            else {
                payslip = await this.payslipModel
                    .findOne({ employeeId: validEmployeeId })
                    .populate('payrollRunId')
                    .sort({ createdAt: -1 })
                    .exec();
            }
            if (!payslip) {
                throw new common_1.NotFoundException('No payslip found for this employee');
            }
            const employerContributions = payslip.deductionsDetails?.insurances?.map((insurance) => ({
                type: insurance.type,
                employeeContribution: insurance.employeeContribution || 0,
                employerContribution: insurance.employerContribution || 0,
                total: insurance.amount || 0,
            })) || [];
            return {
                payslipId: payslip._id,
                payrollPeriod: payslip.payrollRunId,
                employerContributions,
                totalEmployerContributions: employerContributions.reduce((sum, contrib) => sum + (contrib.employerContribution || 0), 0),
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve employer contributions: ${error?.message || 'Unknown error'}`);
        }
    }
    async getTaxDocuments(employeeId, year) {
        try {
            const validEmployeeId = await this.validateEmployeeExists(employeeId, false);
            const targetYear = year || new Date().getFullYear();
            const startDate = new Date(targetYear, 0, 1);
            const endDate = new Date(targetYear, 11, 31);
            const payrollRuns = await this.payrollRunsModel
                .find({
                payrollPeriod: { $gte: startDate, $lte: endDate },
            })
                .exec();
            const payrollRunIds = payrollRuns.map((run) => run._id);
            const payslips = await this.payslipModel
                .find({
                employeeId: validEmployeeId,
                payrollRunId: { $in: payrollRunIds },
            })
                .populate('payrollRunId', 'runId payrollPeriod')
                .sort({ createdAt: 1 })
                .exec();
            const annualTotals = {
                totalGrossSalary: payslips.reduce((sum, p) => sum + (p.totalGrossSalary || 0), 0),
                totalDeductions: payslips.reduce((sum, p) => sum + (p.totaDeductions || 0), 0),
                totalNetPay: payslips.reduce((sum, p) => sum + (p.netPay || 0), 0),
                totalTaxes: payslips.reduce((sum, p) => sum +
                    (p.deductionsDetails?.taxes?.reduce((taxSum, tax) => taxSum + (tax.amount || 0), 0) || 0), 0),
                payslips: payslips.map((p) => ({
                    payslipId: p._id,
                    payrollPeriod: p.payrollRunId,
                    grossSalary: p.totalGrossSalary,
                    deductions: p.totaDeductions,
                    netPay: p.netPay,
                })),
            };
            return {
                employeeId: validEmployeeId,
                year: targetYear,
                annualStatement: annualTotals,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to retrieve tax documents: ${error?.message || 'Unknown error'}`);
        }
    }
    async getPayrollReportByDepartment(departmentId, payrollRunId) {
        try {
            const validDepartmentId = this.validateObjectId(departmentId, 'departmentId');
            const department = await this.departmentModel
                .findById(validDepartmentId)
                .populate('headPositionId', 'title code')
                .exec();
            if (!department) {
                throw new common_1.NotFoundException(`Department with ID ${departmentId} not found`);
            }
            if (!department.isActive) {
                throw new common_1.BadRequestException(`Department ${department.name} is not active`);
            }
            const positions = await this.positionModel
                .find({ departmentId: validDepartmentId, isActive: true })
                .select('_id code title')
                .exec();
            const employeesData = await this.employeeProfileService.findByDepartment(departmentId);
            const employees = employeesData
                .filter(emp => emp.status === employee_profile_enums_1.EmployeeStatus.ACTIVE)
                .map(emp => ({
                _id: new mongoose_2.Types.ObjectId(emp._id?.toString() || emp.id?.toString()),
                firstName: emp.firstName,
                lastName: emp.lastName,
                employeeNumber: emp.employeeNumber,
                primaryPositionId: emp.primaryPositionId,
            }));
            const employeeIds = employees.map((emp) => emp._id);
            const activePositionAssignments = await this.positionAssignmentModel
                .find({
                departmentId: validDepartmentId,
                endDate: { $exists: false },
            })
                .populate('positionId', 'code title')
                .populate('employeeProfileId', 'firstName lastName employeeNumber')
                .exec();
            let payrollRun;
            if (payrollRunId) {
                const validPayrollRunId = this.validateObjectId(payrollRunId, 'payrollRunId');
                payrollRun = await this.payrollRunsModel.findById(validPayrollRunId).exec();
                if (!payrollRun) {
                    throw new common_1.NotFoundException(`Payroll run with ID ${payrollRunId} not found`);
                }
            }
            else {
                payrollRun = await this.payrollRunsModel
                    .findOne()
                    .sort({ createdAt: -1 })
                    .exec();
            }
            if (!payrollRun) {
                throw new common_1.NotFoundException('No payroll run found');
            }
            const payslips = await this.payslipModel
                .find({
                employeeId: { $in: employeeIds },
                payrollRunId: payrollRun._id,
            })
                .populate('employeeId', 'firstName lastName employeeNumber primaryPositionId')
                .exec();
            const totalGrossSalary = payslips.reduce((sum, p) => sum + (p.totalGrossSalary || 0), 0);
            const totalDeductions = payslips.reduce((sum, p) => sum + (p.totaDeductions || 0), 0);
            const totalNetPay = payslips.reduce((sum, p) => sum + (p.netPay || 0), 0);
            const taxBreakdown = {};
            const insuranceBreakdown = {};
            let totalTaxes = 0;
            let totalEmployeeInsurance = 0;
            let totalEmployerInsurance = 0;
            payslips.forEach((payslip) => {
                payslip.deductionsDetails?.taxes?.forEach((tax) => {
                    const taxType = tax.type || tax.name || 'Unknown';
                    taxBreakdown[taxType] = (taxBreakdown[taxType] || 0) + (tax.amount || 0);
                    totalTaxes += tax.amount || 0;
                });
                payslip.deductionsDetails?.insurances?.forEach((insurance) => {
                    const insType = insurance.type || insurance.name || 'Unknown';
                    if (!insuranceBreakdown[insType]) {
                        insuranceBreakdown[insType] = { employee: 0, employer: 0 };
                    }
                    insuranceBreakdown[insType].employee += insurance.employeeContribution || 0;
                    insuranceBreakdown[insType].employer += insurance.employerContribution || 0;
                    totalEmployeeInsurance += insurance.employeeContribution || 0;
                    totalEmployerInsurance += insurance.employerContribution || 0;
                });
            });
            const payslipsByPosition = {};
            payslips.forEach((payslip) => {
                const employee = payslip.employeeId;
                const positionId = employee?.primaryPositionId?._id?.toString() || employee?.primaryPositionId?.toString() || 'UNASSIGNED';
                if (!payslipsByPosition[positionId]) {
                    payslipsByPosition[positionId] = [];
                }
                payslipsByPosition[positionId].push(payslip);
            });
            const report = {
                department: {
                    id: department._id,
                    name: department.name,
                    code: department.code,
                    description: department.description,
                    isActive: department.isActive,
                    headPosition: department.headPositionId ? {
                        id: department.headPositionId?._id,
                        title: department.headPositionId?.title,
                        code: department.headPositionId?.code,
                    } : null,
                },
                organizationStructure: {
                    totalPositions: positions.length,
                    positions: positions.map((pos) => ({
                        id: pos._id,
                        code: pos.code,
                        title: pos.title,
                    })),
                    activeAssignments: activePositionAssignments.length,
                },
                payrollRun: {
                    id: payrollRun._id,
                    runId: payrollRun.runId,
                    payrollPeriod: payrollRun.payrollPeriod,
                    status: payrollRun.status,
                    paymentStatus: payrollRun.paymentStatus,
                },
                summary: {
                    totalEmployees: employees.length,
                    employeesWithPayslips: payslips.length,
                    employeesWithoutPayslips: employees.length - payslips.length,
                    totalGrossSalary,
                    totalDeductions,
                    totalNetPay,
                    averageGrossSalary: payslips.length > 0 ? totalGrossSalary / payslips.length : 0,
                    averageNetPay: payslips.length > 0 ? totalNetPay / payslips.length : 0,
                },
                financialBreakdown: {
                    taxes: {
                        breakdown: taxBreakdown,
                        total: totalTaxes,
                    },
                    insurance: {
                        breakdown: insuranceBreakdown,
                        totalEmployeeContributions: totalEmployeeInsurance,
                        totalEmployerContributions: totalEmployerInsurance,
                        total: totalEmployeeInsurance + totalEmployerInsurance,
                    },
                },
                payslipsByPosition: Object.keys(payslipsByPosition).map((positionId) => {
                    const positionPayslips = payslipsByPosition[positionId];
                    const position = positions.find((p) => p._id.toString() === positionId);
                    return {
                        position: position ? {
                            id: position._id,
                            code: position.code,
                            title: position.title,
                        } : { id: 'UNASSIGNED', code: 'UNASSIGNED', title: 'Unassigned Position' },
                        employeeCount: positionPayslips.length,
                        totalGrossSalary: positionPayslips.reduce((sum, p) => sum + (p.totalGrossSalary || 0), 0),
                        totalDeductions: positionPayslips.reduce((sum, p) => sum + (p.totaDeductions || 0), 0),
                        totalNetPay: positionPayslips.reduce((sum, p) => sum + (p.netPay || 0), 0),
                    };
                }),
                payslips: payslips.map((p) => {
                    const employee = p.employeeId;
                    return {
                        employee: {
                            id: employee?._id || employee,
                            firstName: employee?.firstName,
                            lastName: employee?.lastName,
                            employeeNumber: employee?.employeeNumber,
                            position: employee?.primaryPositionId ? {
                                id: employee.primaryPositionId?._id,
                                title: employee.primaryPositionId?.title,
                                code: employee.primaryPositionId?.code,
                            } : null,
                        },
                        grossSalary: p.totalGrossSalary,
                        deductions: p.totaDeductions,
                        netPay: p.netPay,
                        paymentStatus: p.paymentStatus,
                        payslipId: p._id,
                    };
                }),
            };
            return report;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to generate department report: ${error?.message || 'Unknown error'}`);
        }
    }
    async getPayrollSummary(period, date, departmentId) {
        try {
            const targetDate = date || new Date();
            let startDate;
            let endDate;
            if (period === 'month') {
                startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
                endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
            }
            else {
                startDate = new Date(targetDate.getFullYear(), 0, 1);
                endDate = new Date(targetDate.getFullYear(), 11, 31);
            }
            let department = null;
            let employeeIds = null;
            if (departmentId) {
                const validDepartmentId = this.validateObjectId(departmentId, 'departmentId');
                department = await this.departmentModel.findById(validDepartmentId).exec();
                if (!department) {
                    throw new common_1.NotFoundException(`Department with ID ${departmentId} not found`);
                }
                const employees = await this.employeeProfileService.findByDepartment(departmentId);
                employeeIds = employees
                    .filter(emp => emp.status === employee_profile_enums_1.EmployeeStatus.ACTIVE)
                    .map((emp) => new mongoose_2.Types.ObjectId(emp._id?.toString() || emp.id?.toString()));
                if (employeeIds.length === 0) {
                    return {
                        period,
                        startDate,
                        endDate,
                        department: {
                            id: department._id,
                            name: department.name,
                            code: department.code,
                        },
                        totalPayrollRuns: 0,
                        totalEmployees: 0,
                        totalGrossSalary: 0,
                        totalDeductions: 0,
                        totalNetPay: 0,
                        payrollRuns: [],
                        departmentBreakdown: null,
                    };
                }
            }
            const payrollRuns = await this.payrollRunsModel
                .find({
                payrollPeriod: { $gte: startDate, $lte: endDate },
                status: 'FINALIZED',
            })
                .populate('payrollSpecialistId', 'firstName lastName')
                .populate('payrollManagerId', 'firstName lastName')
                .populate('financeStaffId', 'firstName lastName')
                .sort({ payrollPeriod: 1 })
                .exec();
            const payrollRunIds = payrollRuns.map((run) => run._id);
            const payslipQuery = { payrollRunId: { $in: payrollRunIds } };
            if (employeeIds && employeeIds.length > 0) {
                payslipQuery.employeeId = { $in: employeeIds };
            }
            const payslips = await this.payslipModel
                .find(payslipQuery)
                .populate('employeeId', 'firstName lastName employeeNumber primaryDepartmentId')
                .exec();
            let departmentBreakdown = null;
            if (department) {
                departmentBreakdown = {
                    department: {
                        id: department._id,
                        name: department.name,
                        code: department.code,
                    },
                    employeeCount: employeeIds?.length || 0,
                    totalGrossSalary: payslips.reduce((sum, p) => sum + (p.totalGrossSalary || 0), 0),
                    totalDeductions: payslips.reduce((sum, p) => sum + (p.totaDeductions || 0), 0),
                    totalNetPay: payslips.reduce((sum, p) => sum + (p.netPay || 0), 0),
                };
            }
            else {
                const departmentMap = new Map();
                payslips.forEach((payslip) => {
                    const employee = payslip.employeeId;
                    const deptId = employee?.primaryDepartmentId?.toString() || 'UNASSIGNED';
                    if (!departmentMap.has(deptId)) {
                        departmentMap.set(deptId, {
                            name: deptId === 'UNASSIGNED' ? 'Unassigned' : 'Unknown',
                            code: deptId === 'UNASSIGNED' ? 'UNASSIGNED' : 'UNKNOWN',
                            payslips: [],
                        });
                    }
                    departmentMap.get(deptId).payslips.push(payslip);
                });
                const departmentIds = Array.from(departmentMap.keys()).filter((id) => id !== 'UNASSIGNED');
                if (departmentIds.length > 0) {
                    const departments = await this.departmentModel
                        .find({ _id: { $in: departmentIds.map((id) => new mongoose_2.Types.ObjectId(id)) } })
                        .select('_id name code')
                        .exec();
                    departments.forEach((dept) => {
                        const deptId = dept._id.toString();
                        if (departmentMap.has(deptId)) {
                            departmentMap.get(deptId).name = dept.name;
                            departmentMap.get(deptId).code = dept.code;
                        }
                    });
                }
                departmentBreakdown = Array.from(departmentMap.entries()).map(([deptId, data]) => ({
                    department: {
                        id: deptId === 'UNASSIGNED' ? null : deptId,
                        name: data.name,
                        code: data.code,
                    },
                    employeeCount: new Set(data.payslips.map((p) => p.employeeId.toString())).size,
                    totalGrossSalary: data.payslips.reduce((sum, p) => sum + (p.totalGrossSalary || 0), 0),
                    totalDeductions: data.payslips.reduce((sum, p) => sum + (p.totaDeductions || 0), 0),
                    totalNetPay: data.payslips.reduce((sum, p) => sum + (p.netPay || 0), 0),
                }));
            }
            const summary = {
                period,
                startDate,
                endDate,
                department: department ? {
                    id: department._id,
                    name: department.name,
                    code: department.code,
                } : null,
                totalPayrollRuns: payrollRuns.length,
                totalEmployees: new Set(payslips.map((p) => p.employeeId.toString())).size,
                totalGrossSalary: payslips.reduce((sum, p) => sum + (p.totalGrossSalary || 0), 0),
                totalDeductions: payslips.reduce((sum, p) => sum + (p.totaDeductions || 0), 0),
                totalNetPay: payslips.reduce((sum, p) => sum + (p.netPay || 0), 0),
                payrollRuns: payrollRuns.map((run) => ({
                    runId: run.runId,
                    payrollPeriod: run.payrollPeriod,
                    employees: run.employees,
                    totalNetPay: run.totalnetpay,
                    status: run.status,
                    paymentStatus: run.paymentStatus,
                })),
                departmentBreakdown,
            };
            return summary;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to generate payroll summary: ${error?.message || 'Unknown error'}`);
        }
    }
    async getTaxInsuranceBenefitsReport(period, date, departmentId) {
        try {
            const targetDate = date || new Date();
            let startDate;
            let endDate;
            if (period === 'month') {
                startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
                endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
            }
            else {
                startDate = new Date(targetDate.getFullYear(), 0, 1);
                endDate = new Date(targetDate.getFullYear(), 11, 31);
            }
            let department = null;
            let employeeIds = null;
            if (departmentId) {
                const validDepartmentId = this.validateObjectId(departmentId, 'departmentId');
                department = await this.departmentModel.findById(validDepartmentId).exec();
                if (!department) {
                    throw new common_1.NotFoundException(`Department with ID ${departmentId} not found`);
                }
                const employees = await this.employeeProfileService.findByDepartment(departmentId);
                employeeIds = employees
                    .filter(emp => emp.status === employee_profile_enums_1.EmployeeStatus.ACTIVE)
                    .map((emp) => new mongoose_2.Types.ObjectId(emp._id?.toString() || emp.id?.toString()));
                if (employeeIds.length === 0) {
                    return {
                        period,
                        startDate,
                        endDate,
                        department: {
                            id: department._id,
                            name: department.name,
                            code: department.code,
                        },
                        taxes: {
                            breakdown: {},
                            total: 0,
                        },
                        insurance: {
                            breakdown: {},
                            totalEmployeeContributions: 0,
                            totalEmployerContributions: 0,
                            total: 0,
                        },
                        benefits: {
                            total: 0,
                        },
                        summary: {
                            totalEmployees: 0,
                            totalPayslips: 0,
                        },
                        departmentBreakdown: null,
                    };
                }
            }
            const payrollRuns = await this.payrollRunsModel
                .find({
                payrollPeriod: { $gte: startDate, $lte: endDate },
                status: 'FINALIZED',
            })
                .exec();
            const payrollRunIds = payrollRuns.map((run) => run._id);
            const payslipQuery = { payrollRunId: { $in: payrollRunIds } };
            if (employeeIds && employeeIds.length > 0) {
                payslipQuery.employeeId = { $in: employeeIds };
            }
            const payslips = await this.payslipModel
                .find(payslipQuery)
                .populate('employeeId', 'primaryDepartmentId')
                .exec();
            const taxBreakdown = {};
            let totalTaxes = 0;
            const insuranceBreakdown = {};
            let totalEmployeeInsurance = 0;
            let totalEmployerInsurance = 0;
            let totalBenefits = 0;
            payslips.forEach((payslip) => {
                payslip.deductionsDetails?.taxes?.forEach((tax) => {
                    const taxType = tax.type || tax.name || 'Unknown';
                    taxBreakdown[taxType] = (taxBreakdown[taxType] || 0) + (tax.amount || 0);
                    totalTaxes += tax.amount || 0;
                });
                payslip.deductionsDetails?.insurances?.forEach((insurance) => {
                    const insType = insurance.type || insurance.name || 'Unknown';
                    if (!insuranceBreakdown[insType]) {
                        insuranceBreakdown[insType] = { employee: 0, employer: 0 };
                    }
                    insuranceBreakdown[insType].employee += insurance.employeeContribution || 0;
                    insuranceBreakdown[insType].employer += insurance.employerContribution || 0;
                    totalEmployeeInsurance += insurance.employeeContribution || 0;
                    totalEmployerInsurance += insurance.employerContribution || 0;
                });
                payslip.earningsDetails?.benefits?.forEach((benefit) => {
                    totalBenefits += benefit.amount || 0;
                });
            });
            let departmentBreakdown = null;
            if (!department) {
                const departmentMap = new Map();
                payslips.forEach((payslip) => {
                    const employee = payslip.employeeId;
                    const deptId = employee?.primaryDepartmentId?.toString() || 'UNASSIGNED';
                    if (!departmentMap.has(deptId)) {
                        departmentMap.set(deptId, {
                            name: deptId === 'UNASSIGNED' ? 'Unassigned' : 'Unknown',
                            code: deptId === 'UNASSIGNED' ? 'UNASSIGNED' : 'UNKNOWN',
                            payslips: [],
                            taxes: {},
                            insurance: {},
                            benefits: 0,
                        });
                    }
                    const deptData = departmentMap.get(deptId);
                    deptData.payslips.push(payslip);
                    payslip.deductionsDetails?.taxes?.forEach((tax) => {
                        const taxType = tax.type || tax.name || 'Unknown';
                        deptData.taxes[taxType] = (deptData.taxes[taxType] || 0) + (tax.amount || 0);
                    });
                    payslip.deductionsDetails?.insurances?.forEach((insurance) => {
                        const insType = insurance.type || insurance.name || 'Unknown';
                        if (!deptData.insurance[insType]) {
                            deptData.insurance[insType] = { employee: 0, employer: 0 };
                        }
                        deptData.insurance[insType].employee += insurance.employeeContribution || 0;
                        deptData.insurance[insType].employer += insurance.employerContribution || 0;
                    });
                    payslip.earningsDetails?.benefits?.forEach((benefit) => {
                        deptData.benefits += benefit.amount || 0;
                    });
                });
                const departmentIds = Array.from(departmentMap.keys()).filter((id) => id !== 'UNASSIGNED');
                if (departmentIds.length > 0) {
                    const departments = await this.departmentModel
                        .find({ _id: { $in: departmentIds.map((id) => new mongoose_2.Types.ObjectId(id)) } })
                        .select('_id name code')
                        .exec();
                    departments.forEach((dept) => {
                        const deptId = dept._id.toString();
                        if (departmentMap.has(deptId)) {
                            departmentMap.get(deptId).name = dept.name;
                            departmentMap.get(deptId).code = dept.code;
                        }
                    });
                }
                departmentBreakdown = Array.from(departmentMap.entries()).map(([deptId, data]) => ({
                    department: {
                        id: deptId === 'UNASSIGNED' ? null : deptId,
                        name: data.name,
                        code: data.code,
                    },
                    employeeCount: new Set(data.payslips.map((p) => p.employeeId.toString())).size,
                    taxes: {
                        breakdown: data.taxes,
                        total: Object.values(data.taxes).reduce((sum, val) => sum + val, 0),
                    },
                    insurance: {
                        breakdown: data.insurance,
                        totalEmployeeContributions: Object.values(data.insurance).reduce((sum, ins) => sum + ins.employee, 0),
                        totalEmployerContributions: Object.values(data.insurance).reduce((sum, ins) => sum + ins.employer, 0),
                        total: Object.values(data.insurance).reduce((sum, ins) => sum + ins.employee + ins.employer, 0),
                    },
                    benefits: {
                        total: data.benefits,
                    },
                }));
            }
            return {
                period,
                startDate,
                endDate,
                department: department ? {
                    id: department._id,
                    name: department.name,
                    code: department.code,
                } : null,
                taxes: {
                    breakdown: taxBreakdown,
                    total: totalTaxes,
                },
                insurance: {
                    breakdown: insuranceBreakdown,
                    totalEmployeeContributions: totalEmployeeInsurance,
                    totalEmployerContributions: totalEmployerInsurance,
                    total: totalEmployeeInsurance + totalEmployerInsurance,
                },
                benefits: {
                    total: totalBenefits,
                },
                summary: {
                    totalEmployees: new Set(payslips.map((p) => p.employeeId.toString())).size,
                    totalPayslips: payslips.length,
                },
                departmentBreakdown,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to generate tax/insurance/benefits report: ${error?.message || 'Unknown error'}`);
        }
    }
    async getActiveDepartments() {
        try {
            const departments = await this.departmentModel
                .find({ isActive: true })
                .populate('headPositionId', 'title code')
                .select('_id name code description headPositionId isActive')
                .sort({ name: 1 })
                .exec();
            const departmentsWithEmployeeCount = await Promise.all(departments.map(async (dept) => {
                const employeeCount = await this.employeeProfileModel
                    .countDocuments({
                    primaryDepartmentId: dept._id,
                    status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
                })
                    .exec();
                return {
                    id: dept._id,
                    name: dept.name,
                    code: dept.code,
                    description: dept.description,
                    isActive: dept.isActive,
                    headPosition: dept.headPositionId ? {
                        id: dept.headPositionId?._id,
                        title: dept.headPositionId?.title,
                        code: dept.headPositionId?.code,
                    } : null,
                    activeEmployeeCount: employeeCount,
                };
            }));
            return {
                totalDepartments: departmentsWithEmployeeCount.length,
                departments: departmentsWithEmployeeCount,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to retrieve departments: ${error?.message || 'Unknown error'}`);
        }
    }
    async getPayrollSummaryByAllDepartments(period, date) {
        try {
            const targetDate = date || new Date();
            let startDate;
            let endDate;
            if (period === 'month') {
                startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
                endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
            }
            else {
                startDate = new Date(targetDate.getFullYear(), 0, 1);
                endDate = new Date(targetDate.getFullYear(), 11, 31);
            }
            const departments = await this.departmentModel
                .find({ isActive: true })
                .select('_id name code')
                .exec();
            const payrollRuns = await this.payrollRunsModel
                .find({
                payrollPeriod: { $gte: startDate, $lte: endDate },
                status: 'FINALIZED',
            })
                .exec();
            const payrollRunIds = payrollRuns.map((run) => run._id);
            const payslips = await this.payslipModel
                .find({ payrollRunId: { $in: payrollRunIds } })
                .populate('employeeId', 'primaryDepartmentId')
                .exec();
            const departmentSummaries = await Promise.all(departments.map(async (dept) => {
                const employees = await this.employeeProfileService.findByDepartment(dept._id.toString());
                const employeeIds = employees
                    .filter(emp => emp.status === employee_profile_enums_1.EmployeeStatus.ACTIVE)
                    .map((emp) => new mongoose_2.Types.ObjectId(emp._id?.toString() || emp.id?.toString()));
                const deptPayslips = payslips.filter((p) => {
                    const employee = p.employeeId;
                    const empId = employee?._id?.toString() || employee?.toString();
                    return employeeIds.some((eid) => eid.toString() === empId);
                });
                const totalGrossSalary = deptPayslips.reduce((sum, p) => sum + (p.totalGrossSalary || 0), 0);
                const totalDeductions = deptPayslips.reduce((sum, p) => sum + (p.totaDeductions || 0), 0);
                const totalNetPay = deptPayslips.reduce((sum, p) => sum + (p.netPay || 0), 0);
                return {
                    department: {
                        id: dept._id,
                        name: dept.name,
                        code: dept.code,
                    },
                    employeeCount: employees.length,
                    employeesWithPayslips: deptPayslips.length,
                    totalGrossSalary,
                    totalDeductions,
                    totalNetPay,
                    averageGrossSalary: deptPayslips.length > 0 ? totalGrossSalary / deptPayslips.length : 0,
                    averageNetPay: deptPayslips.length > 0 ? totalNetPay / deptPayslips.length : 0,
                };
            }));
            const totalGrossSalary = departmentSummaries.reduce((sum, dept) => sum + dept.totalGrossSalary, 0);
            const totalDeductions = departmentSummaries.reduce((sum, dept) => sum + dept.totalDeductions, 0);
            const totalNetPay = departmentSummaries.reduce((sum, dept) => sum + dept.totalNetPay, 0);
            const totalEmployees = departmentSummaries.reduce((sum, dept) => sum + dept.employeeCount, 0);
            return {
                period,
                startDate,
                endDate,
                summary: {
                    totalDepartments: departments.length,
                    totalEmployees,
                    totalGrossSalary,
                    totalDeductions,
                    totalNetPay,
                },
                departments: departmentSummaries.sort((a, b) => b.totalNetPay - a.totalNetPay),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to generate payroll summary by departments: ${error?.message || 'Unknown error'}`);
        }
    }
};
exports.PayrollTrackingService = PayrollTrackingService;
exports.PayrollTrackingService = PayrollTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(claims_schema_1.claims.name)),
    __param(1, (0, mongoose_1.InjectModel)(disputes_schema_1.disputes.name)),
    __param(2, (0, mongoose_1.InjectModel)(refunds_schema_1.refunds.name)),
    __param(3, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => employee_profile_service_1.EmployeeProfileService))),
    __param(5, (0, common_1.Inject)(payroll_configuration_service_1.PayrollConfigurationService)),
    __param(6, (0, common_1.Inject)(leaves_service_1.LeavesService)),
    __param(7, (0, common_1.Inject)(time_management_service_1.TimeManagementService)),
    __param(8, (0, mongoose_1.InjectModel)(payslip_schema_1.paySlip.name)),
    __param(9, (0, mongoose_1.InjectModel)(payrollRuns_schema_1.payrollRuns.name)),
    __param(10, (0, mongoose_1.InjectModel)(leave_entitlement_schema_1.LeaveEntitlement.name)),
    __param(11, (0, mongoose_1.InjectModel)(leave_request_schema_1.LeaveRequest.name)),
    __param(12, (0, mongoose_1.InjectModel)(attendance_record_schema_1.AttendanceRecord.name)),
    __param(13, (0, mongoose_1.InjectModel)(time_exception_schema_1.TimeException.name)),
    __param(14, (0, mongoose_1.InjectModel)(department_schema_1.Department.name)),
    __param(15, (0, mongoose_1.InjectModel)(position_schema_1.Position.name)),
    __param(16, (0, mongoose_1.InjectModel)(position_assignment_schema_1.PositionAssignment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        employee_profile_service_1.EmployeeProfileService,
        payroll_configuration_service_1.PayrollConfigurationService,
        leaves_service_1.LeavesService,
        time_management_service_1.TimeManagementService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PayrollTrackingService);
//# sourceMappingURL=payroll-tracking.service.js.map