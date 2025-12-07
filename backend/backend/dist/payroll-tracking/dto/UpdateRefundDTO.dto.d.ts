import { RefundStatus } from '../enums/payroll-tracking-enum';
declare class RefundDetailsDTO {
    description: string;
    amount: number;
}
export declare class UpdateRefundDTO {
    refundDetails?: RefundDetailsDTO;
    financeStaffId?: string;
    claimId?: string;
    disputeId?: string;
    paidInPayrollRunId?: string;
    status?: RefundStatus;
}
export {};
