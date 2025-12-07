import { ClaimStatus } from '../enums/payroll-tracking-enum';
export declare class ClaimResponseDTO {
    claimId: string;
    description: string;
    claimType: string;
    employeeId: string;
    financeStaffId?: string;
    amount: number;
    approvedAmount?: number;
    status: ClaimStatus;
    rejectionReason?: string;
    resolutionComment?: string;
}
