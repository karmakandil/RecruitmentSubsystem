import { ValidatorConstraintInterface } from 'class-validator';
export declare class IsValidISODateConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean;
    defaultMessage(): string;
}
export declare class CreateCompanySettingsDto {
    payDate: string;
    timeZone: string;
    currency: string;
}
export declare class UpdateCompanySettingsDto {
    payDate?: string;
    timeZone?: string;
    currency?: string;
}
