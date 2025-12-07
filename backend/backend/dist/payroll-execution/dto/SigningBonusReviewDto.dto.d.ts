import { BonusStatus } from '../enums/payroll-execution-enum';
export declare class SigningBonusReviewDto {
    employeeSigningBonusId: string;
    status: BonusStatus;
    paymentDate?: string;
}
