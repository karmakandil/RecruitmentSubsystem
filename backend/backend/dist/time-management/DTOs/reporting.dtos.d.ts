import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class IsEndDateAfterStartDateConstraint implements ValidatorConstraintInterface {
    validate(endDate: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class GenerateOvertimeReportDto {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
}
export declare class GenerateLatenessReportDto {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
}
export declare class GenerateExceptionReportDto {
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
}
export declare class ExportReportDto {
    reportType: 'overtime' | 'lateness' | 'exception';
    format: 'excel' | 'csv' | 'text';
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
}
