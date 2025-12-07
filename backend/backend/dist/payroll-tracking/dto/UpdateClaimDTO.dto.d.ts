import { ClaimStatus } from '../enums/payroll-tracking-enum';
export declare class UpdateClaimDTO {
    description?: string;
    claimType?: string;
    amount?: number;
    approvedAmount?: number;
    financeStaffId?: string;
    status?: ClaimStatus;
    rejectionReason?: string;
    resolutionComment?: string;
}
