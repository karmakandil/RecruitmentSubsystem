import { BenefitStatus } from '../enums/payroll-execution-enum';
export declare class CreateEmployeeTerminationBenefitDto {
    employeeId: string;
    benefitId: string;
    terminationId: string;
    givenAmount: number;
    status?: BenefitStatus;
}
