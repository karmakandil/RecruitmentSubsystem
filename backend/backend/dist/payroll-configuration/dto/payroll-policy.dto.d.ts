import { ValidatorConstraintInterface } from 'class-validator';
import { PolicyType, Applicability } from '../enums/payroll-configuration-enums';
export declare class IsValidISODateConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean;
    defaultMessage(): string;
}
declare class RuleDefinitionDto {
    percentage: number;
    fixedAmount: number;
    thresholdAmount: number;
}
export declare class CreatePayrollPolicyDto {
    policyName: string;
    policyType: PolicyType;
    description: string;
    effectiveDate: string;
    ruleDefinition: RuleDefinitionDto;
    applicability: Applicability;
}
export declare class UpdatePayrollPolicyDto {
    policyName?: string;
    policyType?: PolicyType;
    description?: string;
    effectiveDate?: string;
    ruleDefinition?: RuleDefinitionDto;
    applicability?: Applicability;
}
export {};
