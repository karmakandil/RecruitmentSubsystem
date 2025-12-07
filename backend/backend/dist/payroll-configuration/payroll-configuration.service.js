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
exports.PayrollConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payGrades_schema_1 = require("./models/payGrades.schema");
const payrollPolicies_schema_1 = require("./models/payrollPolicies.schema");
const allowance_schema_1 = require("./models/allowance.schema");
const payType_schema_1 = require("./models/payType.schema");
const taxRules_schema_1 = require("./models/taxRules.schema");
const insuranceBrackets_schema_1 = require("./models/insuranceBrackets.schema");
const signingBonus_schema_1 = require("./models/signingBonus.schema");
const terminationAndResignationBenefits_1 = require("./models/terminationAndResignationBenefits");
const CompanyWideSettings_schema_1 = require("./models/CompanyWideSettings.schema");
const payroll_configuration_enums_1 = require("./enums/payroll-configuration-enums");
let PayrollConfigurationService = class PayrollConfigurationService {
    normalizeStatus(status) {
        return status?.toString().toLowerCase() || '';
    }
    constructor(payGradeModel, payrollPoliciesModel, allowanceModel, payTypeModel, taxRulesModel, insuranceBracketsModel, signingBonusModel, terminationBenefitsModel, companySettingsModel) {
        this.payGradeModel = payGradeModel;
        this.payrollPoliciesModel = payrollPoliciesModel;
        this.allowanceModel = allowanceModel;
        this.payTypeModel = payTypeModel;
        this.taxRulesModel = taxRulesModel;
        this.insuranceBracketsModel = insuranceBracketsModel;
        this.signingBonusModel = signingBonusModel;
        this.terminationBenefitsModel = terminationBenefitsModel;
        this.companySettingsModel = companySettingsModel;
    }
    async createPayGrade(createDto, userId) {
        if (createDto.grossSalary < createDto.baseSalary) {
            throw new common_1.BadRequestException('Gross salary must be greater than or equal to base salary');
        }
        if (createDto.baseSalary < 6000 || createDto.grossSalary < 6000) {
            throw new common_1.BadRequestException('Base salary and gross salary must be at least 6000');
        }
        const payGrade = new this.payGradeModel({
            ...createDto,
            status: payroll_configuration_enums_1.ConfigStatus.DRAFT,
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        return await payGrade.save();
    }
    async updatePayGrade(id, updateDto, userId) {
        const payGrade = await this.payGradeModel.findById(id);
        if (!payGrade) {
            throw new common_1.NotFoundException(`Pay grade with ID ${id} not found`);
        }
        if (this.normalizeStatus(payGrade.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot update pay grade with status ${payGrade.status}. Only DRAFT items can be edited.`);
        }
        const newGrossSalary = updateDto.grossSalary ?? payGrade.grossSalary;
        const newBaseSalary = updateDto.baseSalary ?? payGrade.baseSalary;
        if (newGrossSalary < newBaseSalary) {
            throw new common_1.BadRequestException('Gross salary must be greater than or equal to base salary');
        }
        if (newBaseSalary < 6000 || newGrossSalary < 6000) {
            throw new common_1.BadRequestException('Base salary and gross salary must be at least 6000');
        }
        Object.assign(payGrade, updateDto);
        return await payGrade.save();
    }
    async findAllPayGrades(filterDto) {
        const { status, createdBy, page = 1, limit = 10 } = filterDto || {};
        const filter = {};
        if (status)
            filter.status = status;
        if (createdBy)
            filter.createdBy = new mongoose_2.Types.ObjectId(createdBy);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.payGradeModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email')
                .populate('approvedBy', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.payGradeModel.countDocuments(filter),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOnePayGrade(id) {
        const payGrade = await this.payGradeModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .exec();
        if (!payGrade) {
            throw new common_1.NotFoundException(`Pay grade with ID ${id} not found`);
        }
        return payGrade;
    }
    async approvePayGrade(id, approvalDto, userId) {
        const payGrade = await this.payGradeModel.findById(id);
        if (!payGrade) {
            throw new common_1.NotFoundException(`Pay grade with ID ${id} not found`);
        }
        if (this.normalizeStatus(payGrade.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot approve pay grade with status ${payGrade.status}. Only DRAFT items can be approved.`);
        }
        payGrade.status = payroll_configuration_enums_1.ConfigStatus.APPROVED;
        payGrade.approvedBy = new mongoose_2.Types.ObjectId(userId);
        payGrade.approvedAt = new Date();
        return await payGrade.save();
    }
    async rejectPayGrade(id, rejectionDto, userId) {
        const payGrade = await this.payGradeModel.findById(id);
        if (!payGrade) {
            throw new common_1.NotFoundException(`Pay grade with ID ${id} not found`);
        }
        if (this.normalizeStatus(payGrade.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot reject pay grade with status ${payGrade.status}. Only DRAFT items can be rejected.`);
        }
        payGrade.status = payroll_configuration_enums_1.ConfigStatus.REJECTED;
        payGrade.approvedBy = new mongoose_2.Types.ObjectId(userId);
        payGrade.approvedAt = new Date();
        return await payGrade.save();
    }
    async deletePayGrade(id) {
        const payGrade = await this.payGradeModel.findById(id);
        if (!payGrade) {
            throw new common_1.NotFoundException(`Pay grade with ID ${id} not found`);
        }
        if (this.normalizeStatus(payGrade.status) === this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.REJECTED)) {
            throw new common_1.BadRequestException(`Cannot delete pay grade with status ${payGrade.status}.`);
        }
        await this.payGradeModel.findByIdAndDelete(id);
        return { message: 'Pay grade deleted successfully' };
    }
    async createAllowance(createDto, userId) {
        if (createDto.amount < 0) {
            throw new common_1.BadRequestException('Allowance amount must be non-negative');
        }
        const allowance = new this.allowanceModel({
            ...createDto,
            status: payroll_configuration_enums_1.ConfigStatus.DRAFT,
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        return await allowance.save();
    }
    async updateAllowance(id, updateDto, userId) {
        const allowance = await this.allowanceModel.findById(id);
        if (!allowance) {
            throw new common_1.NotFoundException(`Allowance with ID ${id} not found`);
        }
        if (this.normalizeStatus(allowance.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot update allowance with status ${allowance.status}. Only DRAFT items can be edited.`);
        }
        if (updateDto.amount !== undefined && updateDto.amount < 0) {
            throw new common_1.BadRequestException('Allowance amount must be non-negative');
        }
        Object.assign(allowance, updateDto);
        return await allowance.save();
    }
    async findAllAllowances(filterDto) {
        const { status, createdBy, page = 1, limit = 10 } = filterDto || {};
        const filter = {};
        if (status)
            filter.status = status;
        if (createdBy)
            filter.createdBy = new mongoose_2.Types.ObjectId(createdBy);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.allowanceModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email')
                .populate('approvedBy', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.allowanceModel.countDocuments(filter),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOneAllowance(id) {
        const allowance = await this.allowanceModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .exec();
        if (!allowance) {
            throw new common_1.NotFoundException(`Allowance with ID ${id} not found`);
        }
        return allowance;
    }
    async approveAllowance(id, approvalDto, userId) {
        const allowance = await this.allowanceModel.findById(id);
        if (!allowance) {
            throw new common_1.NotFoundException(`Allowance with ID ${id} not found`);
        }
        if (this.normalizeStatus(allowance.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot approve allowance with status ${allowance.status}. Only DRAFT items can be approved.`);
        }
        allowance.status = payroll_configuration_enums_1.ConfigStatus.APPROVED;
        allowance.approvedBy = new mongoose_2.Types.ObjectId(userId);
        allowance.approvedAt = new Date();
        return await allowance.save();
    }
    async rejectAllowance(id, rejectionDto, userId) {
        const allowance = await this.allowanceModel.findById(id);
        if (!allowance) {
            throw new common_1.NotFoundException(`Allowance with ID ${id} not found`);
        }
        if (this.normalizeStatus(allowance.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot reject allowance with status ${allowance.status}. Only DRAFT items can be rejected.`);
        }
        allowance.status = payroll_configuration_enums_1.ConfigStatus.REJECTED;
        allowance.approvedBy = new mongoose_2.Types.ObjectId(userId);
        allowance.approvedAt = new Date();
        if (rejectionDto.comment) {
        }
        return await allowance.save();
    }
    async deleteAllowance(id) {
        const allowance = await this.allowanceModel.findById(id);
        if (!allowance) {
            throw new common_1.NotFoundException(`Allowance with ID ${id} not found`);
        }
        if (this.normalizeStatus(allowance.status) === this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.REJECTED)) {
            throw new common_1.BadRequestException(`Cannot delete allowance with status ${allowance.status}.`);
        }
        await this.allowanceModel.findByIdAndDelete(id);
        return { message: 'Allowance deleted successfully' };
    }
    async createPayType(createDto, userId) {
        if (createDto.amount < 6000) {
            throw new common_1.BadRequestException('Pay type amount must be at least 6000');
        }
        const payType = new this.payTypeModel({
            ...createDto,
            status: payroll_configuration_enums_1.ConfigStatus.DRAFT,
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        return await payType.save();
    }
    async updatePayType(id, updateDto, userId) {
        const payType = await this.payTypeModel.findById(id);
        if (!payType) {
            throw new common_1.NotFoundException(`Pay type with ID ${id} not found`);
        }
        if (this.normalizeStatus(payType.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot update pay type with status ${payType.status}. Only DRAFT items can be edited.`);
        }
        if (updateDto.amount !== undefined && updateDto.amount < 6000) {
            throw new common_1.BadRequestException('Pay type amount must be at least 6000');
        }
        Object.assign(payType, updateDto);
        return await payType.save();
    }
    async findAllPayTypes(filterDto) {
        const { status, createdBy, page = 1, limit = 10 } = filterDto || {};
        const filter = {};
        if (status)
            filter.status = status;
        if (createdBy)
            filter.createdBy = new mongoose_2.Types.ObjectId(createdBy);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.payTypeModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email')
                .populate('approvedBy', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.payTypeModel.countDocuments(filter),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOnePayType(id) {
        const payType = await this.payTypeModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .exec();
        if (!payType) {
            throw new common_1.NotFoundException(`Pay type with ID ${id} not found`);
        }
        return payType;
    }
    async approvePayType(id, approvalDto, userId) {
        const payType = await this.payTypeModel.findById(id);
        if (!payType) {
            throw new common_1.NotFoundException(`Pay type with ID ${id} not found`);
        }
        if (this.normalizeStatus(payType.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot approve pay type with status ${payType.status}. Only DRAFT items can be approved.`);
        }
        payType.status = payroll_configuration_enums_1.ConfigStatus.APPROVED;
        payType.approvedBy = new mongoose_2.Types.ObjectId(userId);
        payType.approvedAt = new Date();
        return await payType.save();
    }
    async rejectPayType(id, rejectionDto, userId) {
        const payType = await this.payTypeModel.findById(id);
        if (!payType) {
            throw new common_1.NotFoundException(`Pay type with ID ${id} not found`);
        }
        if (this.normalizeStatus(payType.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot reject pay type with status ${payType.status}. Only DRAFT items can be rejected.`);
        }
        payType.status = payroll_configuration_enums_1.ConfigStatus.REJECTED;
        payType.approvedBy = new mongoose_2.Types.ObjectId(userId);
        payType.approvedAt = new Date();
        return await payType.save();
    }
    async deletePayType(id) {
        const payType = await this.payTypeModel.findById(id);
        if (!payType) {
            throw new common_1.NotFoundException(`Pay type with ID ${id} not found`);
        }
        if (this.normalizeStatus(payType.status) === this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.REJECTED)) {
            throw new common_1.BadRequestException(`Cannot delete pay type with status ${payType.status}.`);
        }
        await this.payTypeModel.findByIdAndDelete(id);
        return { message: 'Pay type deleted successfully' };
    }
    async createTaxRule(createDto, userId) {
        if (createDto.rate < 0) {
            throw new common_1.BadRequestException('Tax rate must be non-negative');
        }
        const taxRule = new this.taxRulesModel({
            ...createDto,
            status: payroll_configuration_enums_1.ConfigStatus.DRAFT,
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        return await taxRule.save();
    }
    async updateTaxRule(id, updateDto, userId) {
        const taxRule = await this.taxRulesModel.findById(id);
        if (!taxRule) {
            throw new common_1.NotFoundException(`Tax rule with ID ${id} not found`);
        }
        const wasApproved = this.normalizeStatus(taxRule.status) === this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.APPROVED);
        if (this.normalizeStatus(taxRule.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT) &&
            !wasApproved) {
            throw new common_1.BadRequestException(`Cannot update tax rule with status ${taxRule.status}. Only DRAFT items can be edited.`);
        }
        if (updateDto.rate !== undefined && updateDto.rate < 0) {
            throw new common_1.BadRequestException('Tax rate must be non-negative');
        }
        if (wasApproved) {
            taxRule.status = payroll_configuration_enums_1.ConfigStatus.DRAFT;
            taxRule.approvedBy = undefined;
            taxRule.approvedAt = undefined;
        }
        Object.assign(taxRule, updateDto);
        return await taxRule.save();
    }
    async findAllTaxRules(filterDto) {
        const { status, createdBy, page = 1, limit = 10 } = filterDto || {};
        const filter = {};
        if (status)
            filter.status = status;
        if (createdBy)
            filter.createdBy = new mongoose_2.Types.ObjectId(createdBy);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.taxRulesModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email')
                .populate('approvedBy', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.taxRulesModel.countDocuments(filter),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOneTaxRule(id) {
        const taxRule = await this.taxRulesModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .exec();
        if (!taxRule) {
            throw new common_1.NotFoundException(`Tax rule with ID ${id} not found`);
        }
        return taxRule;
    }
    async approveTaxRule(id, approvalDto, userId) {
        const taxRule = await this.taxRulesModel.findById(id);
        if (!taxRule) {
            throw new common_1.NotFoundException(`Tax rule with ID ${id} not found`);
        }
        if (this.normalizeStatus(taxRule.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot approve tax rule with status ${taxRule.status}. Only DRAFT items can be approved.`);
        }
        taxRule.status = payroll_configuration_enums_1.ConfigStatus.APPROVED;
        taxRule.approvedBy = new mongoose_2.Types.ObjectId(userId);
        taxRule.approvedAt = new Date();
        return await taxRule.save();
    }
    async rejectTaxRule(id, rejectionDto, userId) {
        const taxRule = await this.taxRulesModel.findById(id);
        if (!taxRule) {
            throw new common_1.NotFoundException(`Tax rule with ID ${id} not found`);
        }
        if (this.normalizeStatus(taxRule.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot reject tax rule with status ${taxRule.status}. Only DRAFT items can be rejected.`);
        }
        taxRule.status = payroll_configuration_enums_1.ConfigStatus.REJECTED;
        taxRule.approvedBy = new mongoose_2.Types.ObjectId(userId);
        taxRule.approvedAt = new Date();
        return await taxRule.save();
    }
    async deleteTaxRule(id) {
        const taxRule = await this.taxRulesModel.findById(id);
        if (!taxRule) {
            throw new common_1.NotFoundException(`Tax rule with ID ${id} not found`);
        }
        if (this.normalizeStatus(taxRule.status) === this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.REJECTED)) {
            throw new common_1.BadRequestException(`Cannot delete tax rule with status ${taxRule.status}.`);
        }
        await this.taxRulesModel.findByIdAndDelete(id);
        return { message: 'Tax rule deleted successfully' };
    }
    async createInsuranceBracket(createDto, userId) {
        if (createDto.minSalary >= createDto.maxSalary) {
            throw new common_1.BadRequestException('Min salary must be less than max salary');
        }
        if (createDto.employeeRate < 0 || createDto.employeeRate > 100) {
            throw new common_1.BadRequestException('Employee rate must be between 0 and 100');
        }
        if (createDto.employerRate < 0 || createDto.employerRate > 100) {
            throw new common_1.BadRequestException('Employer rate must be between 0 and 100');
        }
        console.log('Insurance bracket created - HR oversight required');
        const insuranceBracket = new this.insuranceBracketsModel({
            ...createDto,
            status: payroll_configuration_enums_1.ConfigStatus.DRAFT,
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        return await insuranceBracket.save();
    }
    async updateInsuranceBracket(id, updateDto, userId) {
        const insuranceBracket = await this.insuranceBracketsModel.findById(id);
        if (!insuranceBracket) {
            throw new common_1.NotFoundException(`Insurance bracket with ID ${id} not found`);
        }
        if (this.normalizeStatus(insuranceBracket.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot update insurance bracket with status ${insuranceBracket.status}. Only DRAFT items can be edited.`);
        }
        const newMinSalary = updateDto.minSalary ?? insuranceBracket.minSalary;
        const newMaxSalary = updateDto.maxSalary ?? insuranceBracket.maxSalary;
        if (newMinSalary >= newMaxSalary) {
            throw new common_1.BadRequestException('Min salary must be less than max salary');
        }
        if (updateDto.employeeRate !== undefined) {
            if (updateDto.employeeRate < 0 || updateDto.employeeRate > 100) {
                throw new common_1.BadRequestException('Employee rate must be between 0 and 100');
            }
        }
        if (updateDto.employerRate !== undefined) {
            if (updateDto.employerRate < 0 || updateDto.employerRate > 100) {
                throw new common_1.BadRequestException('Employer rate must be between 0 and 100');
            }
        }
        Object.assign(insuranceBracket, updateDto);
        return await insuranceBracket.save();
    }
    async findAllInsuranceBrackets(filterDto) {
        const { status, createdBy, page = 1, limit = 10 } = filterDto || {};
        const filter = {};
        if (status)
            filter.status = status;
        if (createdBy)
            filter.createdBy = new mongoose_2.Types.ObjectId(createdBy);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.insuranceBracketsModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email')
                .populate('approvedBy', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.insuranceBracketsModel.countDocuments(filter),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOneInsuranceBracket(id) {
        const insuranceBracket = await this.insuranceBracketsModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .exec();
        if (!insuranceBracket) {
            throw new common_1.NotFoundException(`Insurance bracket with ID ${id} not found`);
        }
        return insuranceBracket;
    }
    async approveInsuranceBracket(id, approvalDto, userId) {
        const insuranceBracket = await this.insuranceBracketsModel.findById(id);
        if (!insuranceBracket) {
            throw new common_1.NotFoundException(`Insurance bracket with ID ${id} not found`);
        }
        if (this.normalizeStatus(insuranceBracket.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot approve insurance bracket with status ${insuranceBracket.status}. Only DRAFT items can be approved.`);
        }
        console.log('Insurance bracket approved by HR');
        insuranceBracket.status = payroll_configuration_enums_1.ConfigStatus.APPROVED;
        insuranceBracket.approvedBy = new mongoose_2.Types.ObjectId(userId);
        insuranceBracket.approvedAt = new Date();
        return await insuranceBracket.save();
    }
    async rejectInsuranceBracket(id, rejectionDto, userId) {
        const insuranceBracket = await this.insuranceBracketsModel.findById(id);
        if (!insuranceBracket) {
            throw new common_1.NotFoundException(`Insurance bracket with ID ${id} not found`);
        }
        if (this.normalizeStatus(insuranceBracket.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot reject insurance bracket with status ${insuranceBracket.status}. Only DRAFT items can be rejected.`);
        }
        insuranceBracket.status = payroll_configuration_enums_1.ConfigStatus.REJECTED;
        insuranceBracket.approvedBy = new mongoose_2.Types.ObjectId(userId);
        insuranceBracket.approvedAt = new Date();
        return await insuranceBracket.save();
    }
    async deleteInsuranceBracket(id) {
        const insuranceBracket = await this.insuranceBracketsModel.findById(id);
        if (!insuranceBracket) {
            throw new common_1.NotFoundException(`Insurance bracket with ID ${id} not found`);
        }
        if (this.normalizeStatus(insuranceBracket.status) === this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.REJECTED)) {
            throw new common_1.BadRequestException(`Cannot delete insurance bracket with status ${insuranceBracket.status}.`);
        }
        await this.insuranceBracketsModel.findByIdAndDelete(id);
        return { message: 'Insurance bracket deleted successfully' };
    }
    async createSigningBonus(createDto, userId) {
        if (createDto.amount < 0) {
            throw new common_1.BadRequestException('Signing bonus amount must be non-negative');
        }
        const signingBonus = new this.signingBonusModel({
            ...createDto,
            status: payroll_configuration_enums_1.ConfigStatus.DRAFT,
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        return await signingBonus.save();
    }
    async updateSigningBonus(id, updateDto, userId) {
        const signingBonus = await this.signingBonusModel.findById(id);
        if (!signingBonus) {
            throw new common_1.NotFoundException(`Signing bonus with ID ${id} not found`);
        }
        if (this.normalizeStatus(signingBonus.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot update signing bonus with status ${signingBonus.status}. Only DRAFT items can be edited.`);
        }
        if (updateDto.amount !== undefined && updateDto.amount < 0) {
            throw new common_1.BadRequestException('Signing bonus amount must be non-negative');
        }
        Object.assign(signingBonus, updateDto);
        return await signingBonus.save();
    }
    async findAllSigningBonuses(filterDto) {
        const { status, createdBy, page = 1, limit = 10 } = filterDto || {};
        const filter = {};
        if (status)
            filter.status = status;
        if (createdBy)
            filter.createdBy = new mongoose_2.Types.ObjectId(createdBy);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.signingBonusModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email')
                .populate('approvedBy', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.signingBonusModel.countDocuments(filter),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOneSigningBonus(id) {
        const signingBonus = await this.signingBonusModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .exec();
        if (!signingBonus) {
            throw new common_1.NotFoundException(`Signing bonus with ID ${id} not found`);
        }
        return signingBonus;
    }
    async approveSigningBonus(id, approvalDto, userId) {
        const signingBonus = await this.signingBonusModel.findById(id);
        if (!signingBonus) {
            throw new common_1.NotFoundException(`Signing bonus with ID ${id} not found`);
        }
        if (this.normalizeStatus(signingBonus.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot approve signing bonus with status ${signingBonus.status}. Only DRAFT items can be approved.`);
        }
        signingBonus.status = payroll_configuration_enums_1.ConfigStatus.APPROVED;
        signingBonus.approvedBy = new mongoose_2.Types.ObjectId(userId);
        signingBonus.approvedAt = new Date();
        return await signingBonus.save();
    }
    async rejectSigningBonus(id, rejectionDto, userId) {
        const signingBonus = await this.signingBonusModel.findById(id);
        if (!signingBonus) {
            throw new common_1.NotFoundException(`Signing bonus with ID ${id} not found`);
        }
        if (this.normalizeStatus(signingBonus.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot reject signing bonus with status ${signingBonus.status}. Only DRAFT items can be rejected.`);
        }
        signingBonus.status = payroll_configuration_enums_1.ConfigStatus.REJECTED;
        signingBonus.approvedBy = new mongoose_2.Types.ObjectId(userId);
        signingBonus.approvedAt = new Date();
        return await signingBonus.save();
    }
    async deleteSigningBonus(id) {
        const signingBonus = await this.signingBonusModel.findById(id);
        if (!signingBonus) {
            throw new common_1.NotFoundException(`Signing bonus with ID ${id} not found`);
        }
        if (this.normalizeStatus(signingBonus.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot delete signing bonus with status ${signingBonus.status}. Only DRAFT items can be deleted.`);
        }
        await this.signingBonusModel.findByIdAndDelete(id);
        return { message: 'Signing bonus deleted successfully' };
    }
    async createTerminationBenefit(createDto, userId) {
        if (createDto.amount < 0) {
            throw new common_1.BadRequestException('Termination benefit amount must be non-negative');
        }
        const benefit = new this.terminationBenefitsModel({
            ...createDto,
            status: payroll_configuration_enums_1.ConfigStatus.DRAFT,
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        return await benefit.save();
    }
    async updateTerminationBenefit(id, updateDto, userId) {
        const benefit = await this.terminationBenefitsModel.findById(id);
        if (!benefit) {
            throw new common_1.NotFoundException(`Termination benefit with ID ${id} not found`);
        }
        if (this.normalizeStatus(benefit.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot update termination benefit with status ${benefit.status}. Only DRAFT items can be edited.`);
        }
        if (updateDto.amount !== undefined && updateDto.amount < 0) {
            throw new common_1.BadRequestException('Termination benefit amount must be non-negative');
        }
        Object.assign(benefit, updateDto);
        return await benefit.save();
    }
    async findAllTerminationBenefits(filterDto) {
        const { status, createdBy, page = 1, limit = 10 } = filterDto || {};
        const filter = {};
        if (status)
            filter.status = status;
        if (createdBy)
            filter.createdBy = new mongoose_2.Types.ObjectId(createdBy);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.terminationBenefitsModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email')
                .populate('approvedBy', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.terminationBenefitsModel.countDocuments(filter),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOneTerminationBenefit(id) {
        const benefit = await this.terminationBenefitsModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .exec();
        if (!benefit) {
            throw new common_1.NotFoundException(`Termination benefit with ID ${id} not found`);
        }
        return benefit;
    }
    async approveTerminationBenefit(id, approvalDto, userId) {
        const benefit = await this.terminationBenefitsModel.findById(id);
        if (!benefit) {
            throw new common_1.NotFoundException(`Termination benefit with ID ${id} not found`);
        }
        if (this.normalizeStatus(benefit.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot approve termination benefit with status ${benefit.status}. Only DRAFT items can be approved.`);
        }
        benefit.status = payroll_configuration_enums_1.ConfigStatus.APPROVED;
        benefit.approvedBy = new mongoose_2.Types.ObjectId(userId);
        benefit.approvedAt = new Date();
        return await benefit.save();
    }
    async rejectTerminationBenefit(id, rejectionDto, userId) {
        const benefit = await this.terminationBenefitsModel.findById(id);
        if (!benefit) {
            throw new common_1.NotFoundException(`Termination benefit with ID ${id} not found`);
        }
        if (this.normalizeStatus(benefit.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot reject termination benefit with status ${benefit.status}. Only DRAFT items can be rejected.`);
        }
        benefit.status = payroll_configuration_enums_1.ConfigStatus.REJECTED;
        benefit.approvedBy = new mongoose_2.Types.ObjectId(userId);
        benefit.approvedAt = new Date();
        return await benefit.save();
    }
    async deleteTerminationBenefit(id) {
        const benefit = await this.terminationBenefitsModel.findById(id);
        if (!benefit) {
            throw new common_1.NotFoundException(`Termination benefit with ID ${id} not found`);
        }
        if (this.normalizeStatus(benefit.status) === this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.REJECTED)) {
            throw new common_1.BadRequestException(`Cannot delete termination benefit with status ${benefit.status}.`);
        }
        await this.terminationBenefitsModel.findByIdAndDelete(id);
        return { message: 'Termination benefit deleted successfully' };
    }
    async createPayrollPolicy(createDto, userId) {
        const { ruleDefinition } = createDto;
        if (ruleDefinition.percentage < 0 || ruleDefinition.percentage > 100) {
            throw new common_1.BadRequestException('Percentage must be between 0 and 100');
        }
        if (ruleDefinition.fixedAmount < 0) {
            throw new common_1.BadRequestException('Fixed amount must be non-negative');
        }
        if (ruleDefinition.thresholdAmount < 1) {
            throw new common_1.BadRequestException('Threshold amount must be at least 1');
        }
        const policy = new this.payrollPoliciesModel({
            ...createDto,
            effectiveDate: new Date(createDto.effectiveDate),
            status: payroll_configuration_enums_1.ConfigStatus.DRAFT,
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        return await policy.save();
    }
    async updatePayrollPolicy(id, updateDto, userId) {
        const policy = await this.payrollPoliciesModel.findById(id);
        if (!policy) {
            throw new common_1.NotFoundException(`Payroll policy with ID ${id} not found`);
        }
        if (this.normalizeStatus(policy.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot update payroll policy with status ${policy.status}. Only DRAFT items can be edited.`);
        }
        if (updateDto.ruleDefinition) {
            const { percentage, fixedAmount, thresholdAmount } = updateDto.ruleDefinition;
            if (percentage !== undefined && (percentage < 0 || percentage > 100)) {
                throw new common_1.BadRequestException('Percentage must be between 0 and 100');
            }
            if (fixedAmount !== undefined && fixedAmount < 0) {
                throw new common_1.BadRequestException('Fixed amount must be non-negative');
            }
            if (thresholdAmount !== undefined && thresholdAmount < 1) {
                throw new common_1.BadRequestException('Threshold amount must be at least 1');
            }
        }
        const updateData = { ...updateDto };
        if (updateData.effectiveDate) {
            updateData.effectiveDate = new Date(updateData.effectiveDate);
        }
        Object.assign(policy, updateData);
        return await policy.save();
    }
    async findAllPayrollPolicies(filterDto) {
        const { status, createdBy, page = 1, limit = 10 } = filterDto || {};
        const filter = {};
        if (status)
            filter.status = status;
        if (createdBy)
            filter.createdBy = new mongoose_2.Types.ObjectId(createdBy);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.payrollPoliciesModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email')
                .populate('approvedBy', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.payrollPoliciesModel.countDocuments(filter),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOnePayrollPolicy(id) {
        const policy = await this.payrollPoliciesModel
            .findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .exec();
        if (!policy) {
            throw new common_1.NotFoundException(`Payroll policy with ID ${id} not found`);
        }
        return policy;
    }
    async approvePayrollPolicy(id, approvalDto, userId) {
        const policy = await this.payrollPoliciesModel.findById(id);
        if (!policy) {
            throw new common_1.NotFoundException(`Payroll policy with ID ${id} not found`);
        }
        if (this.normalizeStatus(policy.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot approve payroll policy with status ${policy.status}. Only DRAFT items can be approved.`);
        }
        policy.status = payroll_configuration_enums_1.ConfigStatus.APPROVED;
        policy.approvedBy = new mongoose_2.Types.ObjectId(userId);
        policy.approvedAt = new Date();
        return await policy.save();
    }
    async rejectPayrollPolicy(id, rejectionDto, userId) {
        const policy = await this.payrollPoliciesModel.findById(id);
        if (!policy) {
            throw new common_1.NotFoundException(`Payroll policy with ID ${id} not found`);
        }
        if (this.normalizeStatus(policy.status) !== this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.DRAFT)) {
            throw new common_1.BadRequestException(`Cannot reject payroll policy with status ${policy.status}. Only DRAFT items can be rejected.`);
        }
        policy.status = payroll_configuration_enums_1.ConfigStatus.REJECTED;
        policy.approvedBy = new mongoose_2.Types.ObjectId(userId);
        policy.approvedAt = new Date();
        return await policy.save();
    }
    async deletePayrollPolicy(id) {
        const policy = await this.payrollPoliciesModel.findById(id);
        if (!policy) {
            throw new common_1.NotFoundException(`Payroll policy with ID ${id} not found`);
        }
        if (this.normalizeStatus(policy.status) === this.normalizeStatus(payroll_configuration_enums_1.ConfigStatus.REJECTED)) {
            throw new common_1.BadRequestException(`Cannot delete payroll policy with status ${policy.status}.`);
        }
        await this.payrollPoliciesModel.findByIdAndDelete(id);
        return { message: 'Payroll policy deleted successfully' };
    }
    async createCompanySettings(createDto, userId) {
        const existingSettings = await this.companySettingsModel.findOne();
        if (existingSettings) {
            throw new common_1.ConflictException('Company settings already exist. Use update instead.');
        }
        if (createDto.currency !== 'EGP') {
            throw new common_1.BadRequestException('Only EGP currency is allowed');
        }
        const settings = new this.companySettingsModel({
            ...createDto,
            payDate: new Date(createDto.payDate),
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        return await settings.save();
    }
    async updateCompanySettings(updateDto, userId) {
        const settings = await this.companySettingsModel.findOne();
        if (!settings) {
            throw new common_1.NotFoundException('Company settings not found. Create them first.');
        }
        if (updateDto.currency && updateDto.currency !== 'EGP') {
            throw new common_1.BadRequestException('Only EGP currency is allowed');
        }
        const updateData = { ...updateDto };
        if (updateData.payDate) {
            updateData.payDate = new Date(updateData.payDate);
        }
        Object.assign(settings, {
            ...updateData,
            updatedBy: new mongoose_2.Types.ObjectId(userId),
            updatedAt: new Date(),
        });
        return await settings.save();
    }
    async getCompanySettings() {
        const settings = await this.companySettingsModel.findOne();
        if (!settings) {
            throw new common_1.NotFoundException('Company settings not found');
        }
        return settings;
    }
    async getConfigurationStats() {
        const [payGradeStats, allowanceStats, payTypeStats, taxRuleStats, insuranceStats, signingBonusStats, terminationBenefitStats, policyStats,] = await Promise.all([
            this.getEntityStats(this.payGradeModel),
            this.getEntityStats(this.allowanceModel),
            this.getEntityStats(this.payTypeModel),
            this.getEntityStats(this.taxRulesModel),
            this.getEntityStats(this.insuranceBracketsModel),
            this.getEntityStats(this.signingBonusModel),
            this.getEntityStats(this.terminationBenefitsModel),
            this.getEntityStats(this.payrollPoliciesModel),
        ]);
        return {
            payGrades: payGradeStats,
            allowances: allowanceStats,
            payTypes: payTypeStats,
            taxRules: taxRuleStats,
            insuranceBrackets: insuranceStats,
            signingBonuses: signingBonusStats,
            terminationBenefits: terminationBenefitStats,
            payrollPolicies: policyStats,
        };
    }
    async getEntityStats(model) {
        const [total, draft, approved, rejected] = await Promise.all([
            model.countDocuments(),
            model.countDocuments({ status: payroll_configuration_enums_1.ConfigStatus.DRAFT }),
            model.countDocuments({ status: payroll_configuration_enums_1.ConfigStatus.APPROVED }),
            model.countDocuments({ status: payroll_configuration_enums_1.ConfigStatus.REJECTED }),
        ]);
        return {
            total,
            draft,
            approved,
            rejected,
        };
    }
    async getPendingApprovals(userId) {
        const filter = { status: payroll_configuration_enums_1.ConfigStatus.DRAFT };
        if (userId) {
            filter.createdBy = new mongoose_2.Types.ObjectId(userId);
        }
        const [payGrades, allowances, payTypes, taxRules, insuranceBrackets, signingBonuses, terminationBenefits, policies,] = await Promise.all([
            this.payGradeModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email'),
            this.allowanceModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email'),
            this.payTypeModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email'),
            this.taxRulesModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email'),
            this.insuranceBracketsModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email'),
            this.signingBonusModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email'),
            this.terminationBenefitsModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email'),
            this.payrollPoliciesModel
                .find(filter)
                .populate('createdBy', 'firstName lastName email'),
        ]);
        return {
            payGrades,
            allowances,
            payTypes,
            taxRules,
            insuranceBrackets,
            signingBonuses,
            terminationBenefits,
            policies,
            totalPending: payGrades.length +
                allowances.length +
                payTypes.length +
                taxRules.length +
                insuranceBrackets.length +
                signingBonuses.length +
                terminationBenefits.length +
                policies.length,
        };
    }
};
exports.PayrollConfigurationService = PayrollConfigurationService;
exports.PayrollConfigurationService = PayrollConfigurationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payGrades_schema_1.payGrade.name)),
    __param(1, (0, mongoose_1.InjectModel)(payrollPolicies_schema_1.payrollPolicies.name)),
    __param(2, (0, mongoose_1.InjectModel)(allowance_schema_1.allowance.name)),
    __param(3, (0, mongoose_1.InjectModel)(payType_schema_1.payType.name)),
    __param(4, (0, mongoose_1.InjectModel)(taxRules_schema_1.taxRules.name)),
    __param(5, (0, mongoose_1.InjectModel)(insuranceBrackets_schema_1.insuranceBrackets.name)),
    __param(6, (0, mongoose_1.InjectModel)(signingBonus_schema_1.signingBonus.name)),
    __param(7, (0, mongoose_1.InjectModel)(terminationAndResignationBenefits_1.terminationAndResignationBenefits.name)),
    __param(8, (0, mongoose_1.InjectModel)(CompanyWideSettings_schema_1.CompanyWideSettings.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PayrollConfigurationService);
//# sourceMappingURL=payroll-configuration.service.js.map