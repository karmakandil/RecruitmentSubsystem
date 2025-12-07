import { PayrollConfigurationService } from './payroll-configuration.service';
import { Connection } from 'mongoose';
import { CreatePayGradeDto, UpdatePayGradeDto } from './dto/pay-grade.dto';
import { ApprovalDto, RejectionDto } from './dto/approval.dto';
import { FilterDto } from './dto/filter.dto';
import { CreateAllowanceDto, UpdateAllowanceDto } from './dto/allowance.dto';
import { CreatePayTypeDto, UpdatePayTypeDto } from './dto/pay-type.dto';
import { CreateTaxRuleDto, UpdateTaxRuleDto } from './dto/tax-rule.dto';
import { CreateInsuranceBracketDto, UpdateInsuranceBracketDto } from './dto/insurance-bracket.dto';
import { CreateSigningBonusDto, UpdateSigningBonusDto } from './dto/signing-bonus.dto';
import { CreateTerminationBenefitDto, UpdateTerminationBenefitDto } from './dto/termination-benefit.dto';
import { CreatePayrollPolicyDto, UpdatePayrollPolicyDto } from './dto/payroll-policy.dto';
import { CreateCompanySettingsDto, UpdateCompanySettingsDto } from './dto/company-settings.dto';
export declare class PayrollConfigurationController {
    private readonly payrollConfigService;
    private readonly connection;
    constructor(payrollConfigService: PayrollConfigurationService, connection: Connection);
    getPayGrades(filterDto: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./models/payGrades.schema").payGrade, {}, {}> & import("./models/payGrades.schema").payGrade & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPayGrade(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/payGrades.schema").payGrade, {}, {}> & import("./models/payGrades.schema").payGrade & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createPayGrade(createDto: CreatePayGradeDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payGrades.schema").payGrade, {}, {}> & import("./models/payGrades.schema").payGrade & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updatePayGrade(id: string, updateDto: UpdatePayGradeDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payGrades.schema").payGrade, {}, {}> & import("./models/payGrades.schema").payGrade & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deletePayGrade(id: string): Promise<{
        message: string;
    }>;
    approvePayGrade(id: string, approvalDto: ApprovalDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payGrades.schema").payGrade, {}, {}> & import("./models/payGrades.schema").payGrade & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectPayGrade(id: string, rejectionDto: RejectionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payGrades.schema").payGrade, {}, {}> & import("./models/payGrades.schema").payGrade & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getConfigurationStats(): Promise<{
        payGrades: {
            total: number;
            draft: number;
            approved: number;
            rejected: number;
        };
        allowances: {
            total: number;
            draft: number;
            approved: number;
            rejected: number;
        };
        payTypes: {
            total: number;
            draft: number;
            approved: number;
            rejected: number;
        };
        taxRules: {
            total: number;
            draft: number;
            approved: number;
            rejected: number;
        };
        insuranceBrackets: {
            total: number;
            draft: number;
            approved: number;
            rejected: number;
        };
        signingBonuses: {
            total: number;
            draft: number;
            approved: number;
            rejected: number;
        };
        terminationBenefits: {
            total: number;
            draft: number;
            approved: number;
            rejected: number;
        };
        payrollPolicies: {
            total: number;
            draft: number;
            approved: number;
            rejected: number;
        };
    }>;
    getPendingApprovals(userId?: string): Promise<{
        payGrades: (import("mongoose").Document<unknown, {}, import("./models/payGrades.schema").payGrade, {}, {}> & import("./models/payGrades.schema").payGrade & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        allowances: (import("mongoose").Document<unknown, {}, import("./models/allowance.schema").allowance, {}, {}> & import("./models/allowance.schema").allowance & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        payTypes: (import("mongoose").Document<unknown, {}, import("./models/payType.schema").payType, {}, {}> & import("./models/payType.schema").payType & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        taxRules: (import("mongoose").Document<unknown, {}, import("./models/taxRules.schema").taxRules, {}, {}> & import("./models/taxRules.schema").taxRules & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        insuranceBrackets: (import("mongoose").Document<unknown, {}, import("./models/insuranceBrackets.schema").insuranceBrackets, {}, {}> & import("./models/insuranceBrackets.schema").insuranceBrackets & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        signingBonuses: (import("mongoose").Document<unknown, {}, import("./models/signingBonus.schema").signingBonus, {}, {}> & import("./models/signingBonus.schema").signingBonus & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        terminationBenefits: (import("mongoose").Document<unknown, {}, import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits, {}, {}> & import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        policies: (import("mongoose").Document<unknown, {}, import("./models/payrollPolicies.schema").payrollPolicies, {}, {}> & import("./models/payrollPolicies.schema").payrollPolicies & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        totalPending: number;
    }>;
    getDbDebug(): Promise<{
        database: string;
        collections: string[];
    }>;
    getCompanySettings(): Promise<import("mongoose").Document<unknown, {}, import("./models/CompanyWideSettings.schema").CompanyWideSettings, {}, {}> & import("./models/CompanyWideSettings.schema").CompanyWideSettings & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createCompanySettings(createDto: CreateCompanySettingsDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/CompanyWideSettings.schema").CompanyWideSettings, {}, {}> & import("./models/CompanyWideSettings.schema").CompanyWideSettings & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateCompanySettings(updateDto: UpdateCompanySettingsDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/CompanyWideSettings.schema").CompanyWideSettings, {}, {}> & import("./models/CompanyWideSettings.schema").CompanyWideSettings & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllowances(filterDto: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./models/allowance.schema").allowance, {}, {}> & import("./models/allowance.schema").allowance & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAllowance(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/allowance.schema").allowance, {}, {}> & import("./models/allowance.schema").allowance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createAllowance(createDto: CreateAllowanceDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/allowance.schema").allowance, {}, {}> & import("./models/allowance.schema").allowance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateAllowance(id: string, updateDto: UpdateAllowanceDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/allowance.schema").allowance, {}, {}> & import("./models/allowance.schema").allowance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteAllowance(id: string): Promise<{
        message: string;
    }>;
    approveAllowance(id: string, approvalDto: ApprovalDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/allowance.schema").allowance, {}, {}> & import("./models/allowance.schema").allowance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectAllowance(id: string, rejectionDto: RejectionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/allowance.schema").allowance, {}, {}> & import("./models/allowance.schema").allowance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getPayTypes(filterDto: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./models/payType.schema").payType, {}, {}> & import("./models/payType.schema").payType & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPayType(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/payType.schema").payType, {}, {}> & import("./models/payType.schema").payType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createPayType(createDto: CreatePayTypeDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payType.schema").payType, {}, {}> & import("./models/payType.schema").payType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updatePayType(id: string, updateDto: UpdatePayTypeDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payType.schema").payType, {}, {}> & import("./models/payType.schema").payType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deletePayType(id: string): Promise<{
        message: string;
    }>;
    approvePayType(id: string, approvalDto: ApprovalDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payType.schema").payType, {}, {}> & import("./models/payType.schema").payType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectPayType(id: string, rejectionDto: RejectionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payType.schema").payType, {}, {}> & import("./models/payType.schema").payType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getTaxRules(filterDto: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./models/taxRules.schema").taxRules, {}, {}> & import("./models/taxRules.schema").taxRules & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTaxRule(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/taxRules.schema").taxRules, {}, {}> & import("./models/taxRules.schema").taxRules & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createTaxRule(createDto: CreateTaxRuleDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/taxRules.schema").taxRules, {}, {}> & import("./models/taxRules.schema").taxRules & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateTaxRule(id: string, updateDto: UpdateTaxRuleDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/taxRules.schema").taxRules, {}, {}> & import("./models/taxRules.schema").taxRules & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteTaxRule(id: string): Promise<{
        message: string;
    }>;
    approveTaxRule(id: string, approvalDto: ApprovalDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/taxRules.schema").taxRules, {}, {}> & import("./models/taxRules.schema").taxRules & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectTaxRule(id: string, rejectionDto: RejectionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/taxRules.schema").taxRules, {}, {}> & import("./models/taxRules.schema").taxRules & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getInsuranceBrackets(filterDto: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./models/insuranceBrackets.schema").insuranceBrackets, {}, {}> & import("./models/insuranceBrackets.schema").insuranceBrackets & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getInsuranceBracket(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/insuranceBrackets.schema").insuranceBrackets, {}, {}> & import("./models/insuranceBrackets.schema").insuranceBrackets & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createInsuranceBracket(createDto: CreateInsuranceBracketDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/insuranceBrackets.schema").insuranceBrackets, {}, {}> & import("./models/insuranceBrackets.schema").insuranceBrackets & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateInsuranceBracket(id: string, updateDto: UpdateInsuranceBracketDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/insuranceBrackets.schema").insuranceBrackets, {}, {}> & import("./models/insuranceBrackets.schema").insuranceBrackets & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteInsuranceBracket(id: string): Promise<{
        message: string;
    }>;
    approveInsuranceBracket(id: string, approvalDto: ApprovalDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/insuranceBrackets.schema").insuranceBrackets, {}, {}> & import("./models/insuranceBrackets.schema").insuranceBrackets & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectInsuranceBracket(id: string, rejectionDto: RejectionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/insuranceBrackets.schema").insuranceBrackets, {}, {}> & import("./models/insuranceBrackets.schema").insuranceBrackets & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getSigningBonuses(filterDto: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./models/signingBonus.schema").signingBonus, {}, {}> & import("./models/signingBonus.schema").signingBonus & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSigningBonus(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/signingBonus.schema").signingBonus, {}, {}> & import("./models/signingBonus.schema").signingBonus & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createSigningBonus(createDto: CreateSigningBonusDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/signingBonus.schema").signingBonus, {}, {}> & import("./models/signingBonus.schema").signingBonus & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateSigningBonus(id: string, updateDto: UpdateSigningBonusDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/signingBonus.schema").signingBonus, {}, {}> & import("./models/signingBonus.schema").signingBonus & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteSigningBonus(id: string): Promise<{
        message: string;
    }>;
    approveSigningBonus(id: string, approvalDto: ApprovalDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/signingBonus.schema").signingBonus, {}, {}> & import("./models/signingBonus.schema").signingBonus & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectSigningBonus(id: string, rejectionDto: RejectionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/signingBonus.schema").signingBonus, {}, {}> & import("./models/signingBonus.schema").signingBonus & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getTerminationBenefits(filterDto: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits, {}, {}> & import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTerminationBenefit(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits, {}, {}> & import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createTerminationBenefit(createDto: CreateTerminationBenefitDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits, {}, {}> & import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateTerminationBenefit(id: string, updateDto: UpdateTerminationBenefitDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits, {}, {}> & import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteTerminationBenefit(id: string): Promise<{
        message: string;
    }>;
    approveTerminationBenefit(id: string, approvalDto: ApprovalDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits, {}, {}> & import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectTerminationBenefit(id: string, rejectionDto: RejectionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits, {}, {}> & import("./models/terminationAndResignationBenefits").terminationAndResignationBenefits & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getPayrollPolicies(filterDto: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./models/payrollPolicies.schema").payrollPolicies, {}, {}> & import("./models/payrollPolicies.schema").payrollPolicies & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPayrollPolicy(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/payrollPolicies.schema").payrollPolicies, {}, {}> & import("./models/payrollPolicies.schema").payrollPolicies & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createPayrollPolicy(createDto: CreatePayrollPolicyDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payrollPolicies.schema").payrollPolicies, {}, {}> & import("./models/payrollPolicies.schema").payrollPolicies & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updatePayrollPolicy(id: string, updateDto: UpdatePayrollPolicyDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payrollPolicies.schema").payrollPolicies, {}, {}> & import("./models/payrollPolicies.schema").payrollPolicies & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deletePayrollPolicy(id: string): Promise<{
        message: string;
    }>;
    approvePayrollPolicy(id: string, approvalDto: ApprovalDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payrollPolicies.schema").payrollPolicies, {}, {}> & import("./models/payrollPolicies.schema").payrollPolicies & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectPayrollPolicy(id: string, rejectionDto: RejectionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/payrollPolicies.schema").payrollPolicies, {}, {}> & import("./models/payrollPolicies.schema").payrollPolicies & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
