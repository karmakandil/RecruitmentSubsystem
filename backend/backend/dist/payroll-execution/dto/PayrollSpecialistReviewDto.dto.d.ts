import { PayRollStatus } from '../enums/payroll-execution-enum';
export declare class PayrollSpecialistReviewDto {
    payrollRunId: string;
    status: PayRollStatus;
    payrollSpecialistId?: string;
    reviewNotes?: string;
}
