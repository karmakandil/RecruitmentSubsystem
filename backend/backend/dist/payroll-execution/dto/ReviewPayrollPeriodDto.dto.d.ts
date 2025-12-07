import { PayRollStatus } from '../enums/payroll-execution-enum';
export declare class ReviewPayrollPeriodDto {
    payrollRunId: string;
    status: PayRollStatus;
    rejectionReason?: string;
}
