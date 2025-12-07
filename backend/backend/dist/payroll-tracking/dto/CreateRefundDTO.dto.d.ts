import { RefundStatus } from '../enums/payroll-tracking-enum';
declare class RefundDetailsDTO {
    description: string;
    amount: number;
}
export declare class CreateRefundDTO {
    refundDetails: RefundDetailsDTO;
    employeeId: string;
    financeStaffId: string;
    claimId?: string;
    disputeId?: string;
    status?: RefundStatus;
}
export {};
