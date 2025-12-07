import { Model, Types } from 'mongoose';
import { payGrade } from './models/payGrades.schema';
import { payrollPolicies } from './models/payrollPolicies.schema';
import { allowance } from './models/allowance.schema';
import { payType } from './models/payType.schema';
import { taxRules } from './models/taxRules.schema';
import { insuranceBrackets } from './models/insuranceBrackets.schema';
import { signingBonus } from './models/signingBonus.schema';
import { terminationAndResignationBenefits } from './models/terminationAndResignationBenefits';
import { CompanyWideSettings } from './models/CompanyWideSettings.schema';
import { ConfigStatus } from './enums/payroll-configuration-enums';
import { ApprovalDto, RejectionDto } from './dto/approval.dto';
interface CreatePayGradeDto {
    grade: string;
    baseSalary: number;
    grossSalary: number;
}
interface UpdatePayGradeDto {
    grade?: string;
    baseSalary?: number;
    grossSalary?: number;
}
interface CreateAllowanceDto {
    name: string;
    amount: number;
}
interface UpdateAllowanceDto {
    name?: string;
    amount?: number;
}
interface CreatePayTypeDto {
    type: string;
    amount: number;
}
interface UpdatePayTypeDto {
    type?: string;
    amount?: number;
}
interface CreateTaxRuleDto {
    name: string;
    description?: string;
    rate: number;
}
interface UpdateTaxRuleDto {
    name?: string;
    description?: string;
    rate?: number;
}
interface CreateInsuranceBracketDto {
    name: string;
    minSalary: number;
    maxSalary: number;
    employeeRate: number;
    employerRate: number;
}
interface UpdateInsuranceBracketDto {
    name?: string;
    minSalary?: number;
    maxSalary?: number;
    employeeRate?: number;
    employerRate?: number;
}
interface CreateSigningBonusDto {
    positionName: string;
    amount: number;
}
interface UpdateSigningBonusDto {
    positionName?: string;
    amount?: number;
}
interface CreateTerminationBenefitDto {
    name: string;
    amount: number;
    terms?: string;
}
interface UpdateTerminationBenefitDto {
    name?: string;
    amount?: number;
    terms?: string;
}
interface CreatePayrollPolicyDto {
    policyName: string;
    policyType: string;
    description: string;
    effectiveDate: string;
    ruleDefinition: {
        percentage: number;
        fixedAmount: number;
        thresholdAmount: number;
    };
    applicability: string;
}
interface UpdatePayrollPolicyDto {
    policyName?: string;
    policyType?: string;
    description?: string;
    effectiveDate?: string;
    ruleDefinition?: {
        percentage?: number;
        fixedAmount?: number;
        thresholdAmount?: number;
    };
    applicability?: string;
}
interface CreateCompanySettingsDto {
    payDate: string;
    timeZone: string;
    currency: string;
}
interface UpdateCompanySettingsDto {
    payDate?: string;
    timeZone?: string;
    currency?: string;
}
interface FilterDto {
    status?: ConfigStatus;
    createdBy?: string;
    page?: number;
    limit?: number;
}
export declare class PayrollConfigurationService {
    private payGradeModel;
    private payrollPoliciesModel;
    private allowanceModel;
    private payTypeModel;
    private taxRulesModel;
    private insuranceBracketsModel;
    private signingBonusModel;
    private terminationBenefitsModel;
    private companySettingsModel;
    private normalizeStatus;
    constructor(payGradeModel: Model<payGrade>, payrollPoliciesModel: Model<payrollPolicies>, allowanceModel: Model<allowance>, payTypeModel: Model<payType>, taxRulesModel: Model<taxRules>, insuranceBracketsModel: Model<insuranceBrackets>, signingBonusModel: Model<signingBonus>, terminationBenefitsModel: Model<terminationAndResignationBenefits>, companySettingsModel: Model<CompanyWideSettings>);
    createPayGrade(createDto: CreatePayGradeDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payGrade, {}, {}> & payGrade & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updatePayGrade(id: string, updateDto: UpdatePayGradeDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payGrade, {}, {}> & payGrade & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAllPayGrades(filterDto?: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, payGrade, {}, {}> & payGrade & {
            _id: Types.ObjectId;
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
    findOnePayGrade(id: string): Promise<import("mongoose").Document<unknown, {}, payGrade, {}, {}> & payGrade & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    approvePayGrade(id: string, approvalDto: ApprovalDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payGrade, {}, {}> & payGrade & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectPayGrade(id: string, rejectionDto: RejectionDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payGrade, {}, {}> & payGrade & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deletePayGrade(id: string): Promise<{
        message: string;
    }>;
    createAllowance(createDto: CreateAllowanceDto, userId: string): Promise<import("mongoose").Document<unknown, {}, allowance, {}, {}> & allowance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateAllowance(id: string, updateDto: UpdateAllowanceDto, userId: string): Promise<import("mongoose").Document<unknown, {}, allowance, {}, {}> & allowance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAllAllowances(filterDto?: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, allowance, {}, {}> & allowance & {
            _id: Types.ObjectId;
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
    findOneAllowance(id: string): Promise<import("mongoose").Document<unknown, {}, allowance, {}, {}> & allowance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    approveAllowance(id: string, approvalDto: ApprovalDto, userId: string): Promise<import("mongoose").Document<unknown, {}, allowance, {}, {}> & allowance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectAllowance(id: string, rejectionDto: RejectionDto, userId: string): Promise<import("mongoose").Document<unknown, {}, allowance, {}, {}> & allowance & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteAllowance(id: string): Promise<{
        message: string;
    }>;
    createPayType(createDto: CreatePayTypeDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payType, {}, {}> & payType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updatePayType(id: string, updateDto: UpdatePayTypeDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payType, {}, {}> & payType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAllPayTypes(filterDto?: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, payType, {}, {}> & payType & {
            _id: Types.ObjectId;
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
    findOnePayType(id: string): Promise<import("mongoose").Document<unknown, {}, payType, {}, {}> & payType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    approvePayType(id: string, approvalDto: ApprovalDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payType, {}, {}> & payType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectPayType(id: string, rejectionDto: RejectionDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payType, {}, {}> & payType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deletePayType(id: string): Promise<{
        message: string;
    }>;
    createTaxRule(createDto: CreateTaxRuleDto, userId: string): Promise<import("mongoose").Document<unknown, {}, taxRules, {}, {}> & taxRules & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateTaxRule(id: string, updateDto: UpdateTaxRuleDto, userId: string): Promise<import("mongoose").Document<unknown, {}, taxRules, {}, {}> & taxRules & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAllTaxRules(filterDto?: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, taxRules, {}, {}> & taxRules & {
            _id: Types.ObjectId;
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
    findOneTaxRule(id: string): Promise<import("mongoose").Document<unknown, {}, taxRules, {}, {}> & taxRules & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    approveTaxRule(id: string, approvalDto: ApprovalDto, userId: string): Promise<import("mongoose").Document<unknown, {}, taxRules, {}, {}> & taxRules & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectTaxRule(id: string, rejectionDto: RejectionDto, userId: string): Promise<import("mongoose").Document<unknown, {}, taxRules, {}, {}> & taxRules & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteTaxRule(id: string): Promise<{
        message: string;
    }>;
    createInsuranceBracket(createDto: CreateInsuranceBracketDto, userId: string): Promise<import("mongoose").Document<unknown, {}, insuranceBrackets, {}, {}> & insuranceBrackets & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateInsuranceBracket(id: string, updateDto: UpdateInsuranceBracketDto, userId: string): Promise<import("mongoose").Document<unknown, {}, insuranceBrackets, {}, {}> & insuranceBrackets & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAllInsuranceBrackets(filterDto?: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, insuranceBrackets, {}, {}> & insuranceBrackets & {
            _id: Types.ObjectId;
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
    findOneInsuranceBracket(id: string): Promise<import("mongoose").Document<unknown, {}, insuranceBrackets, {}, {}> & insuranceBrackets & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    approveInsuranceBracket(id: string, approvalDto: ApprovalDto, userId: string): Promise<import("mongoose").Document<unknown, {}, insuranceBrackets, {}, {}> & insuranceBrackets & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectInsuranceBracket(id: string, rejectionDto: RejectionDto, userId: string): Promise<import("mongoose").Document<unknown, {}, insuranceBrackets, {}, {}> & insuranceBrackets & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteInsuranceBracket(id: string): Promise<{
        message: string;
    }>;
    createSigningBonus(createDto: CreateSigningBonusDto, userId: string): Promise<import("mongoose").Document<unknown, {}, signingBonus, {}, {}> & signingBonus & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateSigningBonus(id: string, updateDto: UpdateSigningBonusDto, userId: string): Promise<import("mongoose").Document<unknown, {}, signingBonus, {}, {}> & signingBonus & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAllSigningBonuses(filterDto?: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, signingBonus, {}, {}> & signingBonus & {
            _id: Types.ObjectId;
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
    findOneSigningBonus(id: string): Promise<import("mongoose").Document<unknown, {}, signingBonus, {}, {}> & signingBonus & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    approveSigningBonus(id: string, approvalDto: ApprovalDto, userId: string): Promise<import("mongoose").Document<unknown, {}, signingBonus, {}, {}> & signingBonus & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectSigningBonus(id: string, rejectionDto: RejectionDto, userId: string): Promise<import("mongoose").Document<unknown, {}, signingBonus, {}, {}> & signingBonus & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteSigningBonus(id: string): Promise<{
        message: string;
    }>;
    createTerminationBenefit(createDto: CreateTerminationBenefitDto, userId: string): Promise<import("mongoose").Document<unknown, {}, terminationAndResignationBenefits, {}, {}> & terminationAndResignationBenefits & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateTerminationBenefit(id: string, updateDto: UpdateTerminationBenefitDto, userId: string): Promise<import("mongoose").Document<unknown, {}, terminationAndResignationBenefits, {}, {}> & terminationAndResignationBenefits & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAllTerminationBenefits(filterDto?: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, terminationAndResignationBenefits, {}, {}> & terminationAndResignationBenefits & {
            _id: Types.ObjectId;
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
    findOneTerminationBenefit(id: string): Promise<import("mongoose").Document<unknown, {}, terminationAndResignationBenefits, {}, {}> & terminationAndResignationBenefits & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    approveTerminationBenefit(id: string, approvalDto: ApprovalDto, userId: string): Promise<import("mongoose").Document<unknown, {}, terminationAndResignationBenefits, {}, {}> & terminationAndResignationBenefits & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectTerminationBenefit(id: string, rejectionDto: RejectionDto, userId: string): Promise<import("mongoose").Document<unknown, {}, terminationAndResignationBenefits, {}, {}> & terminationAndResignationBenefits & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteTerminationBenefit(id: string): Promise<{
        message: string;
    }>;
    createPayrollPolicy(createDto: CreatePayrollPolicyDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payrollPolicies, {}, {}> & payrollPolicies & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updatePayrollPolicy(id: string, updateDto: UpdatePayrollPolicyDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payrollPolicies, {}, {}> & payrollPolicies & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAllPayrollPolicies(filterDto?: FilterDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, payrollPolicies, {}, {}> & payrollPolicies & {
            _id: Types.ObjectId;
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
    findOnePayrollPolicy(id: string): Promise<import("mongoose").Document<unknown, {}, payrollPolicies, {}, {}> & payrollPolicies & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    approvePayrollPolicy(id: string, approvalDto: ApprovalDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payrollPolicies, {}, {}> & payrollPolicies & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectPayrollPolicy(id: string, rejectionDto: RejectionDto, userId: string): Promise<import("mongoose").Document<unknown, {}, payrollPolicies, {}, {}> & payrollPolicies & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deletePayrollPolicy(id: string): Promise<{
        message: string;
    }>;
    createCompanySettings(createDto: CreateCompanySettingsDto, userId: string): Promise<import("mongoose").Document<unknown, {}, CompanyWideSettings, {}, {}> & CompanyWideSettings & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateCompanySettings(updateDto: UpdateCompanySettingsDto, userId: string): Promise<import("mongoose").Document<unknown, {}, CompanyWideSettings, {}, {}> & CompanyWideSettings & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getCompanySettings(): Promise<import("mongoose").Document<unknown, {}, CompanyWideSettings, {}, {}> & CompanyWideSettings & {
        _id: Types.ObjectId;
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
    private getEntityStats;
    getPendingApprovals(userId?: string): Promise<{
        payGrades: (import("mongoose").Document<unknown, {}, payGrade, {}, {}> & payGrade & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        allowances: (import("mongoose").Document<unknown, {}, allowance, {}, {}> & allowance & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        payTypes: (import("mongoose").Document<unknown, {}, payType, {}, {}> & payType & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        taxRules: (import("mongoose").Document<unknown, {}, taxRules, {}, {}> & taxRules & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        insuranceBrackets: (import("mongoose").Document<unknown, {}, insuranceBrackets, {}, {}> & insuranceBrackets & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        signingBonuses: (import("mongoose").Document<unknown, {}, signingBonus, {}, {}> & signingBonus & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        terminationBenefits: (import("mongoose").Document<unknown, {}, terminationAndResignationBenefits, {}, {}> & terminationAndResignationBenefits & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        policies: (import("mongoose").Document<unknown, {}, payrollPolicies, {}, {}> & payrollPolicies & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        totalPending: number;
    }>;
}
export {};
