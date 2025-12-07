import { BonusStatus } from '../enums/payroll-execution-enum';
export declare class CreateEmployeeSigningBonusDto {
    employeeId: string;
    signingBonusId: string;
    givenAmount: number;
    status?: BonusStatus;
    paymentDate?: string;
}
