import { BonusStatus } from '../enums/payroll-execution-enum';
export declare class SigningBonusEditDto {
    employeeSigningBonusId: string;
    signingBonusId?: string;
    status?: BonusStatus;
    paymentDate?: string;
    givenAmount?: number;
}
