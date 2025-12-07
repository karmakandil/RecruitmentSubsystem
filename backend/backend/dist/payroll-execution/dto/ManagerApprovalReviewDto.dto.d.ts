import { PayRollStatus } from '../enums/payroll-execution-enum';
export declare class ManagerApprovalReviewDto {
    payrollRunId: string;
    status: PayRollStatus;
    managerComments?: string;
    managerDecision?: PayRollStatus;
    payrollManagerId?: string;
    managerApprovalDate?: string;
}
