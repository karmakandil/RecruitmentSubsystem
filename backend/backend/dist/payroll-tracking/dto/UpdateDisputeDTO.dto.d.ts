import { DisputeStatus } from '../enums/payroll-tracking-enum';
export declare class UpdateDisputeDTO {
    description?: string;
    financeStaffId?: string;
    status?: DisputeStatus;
    rejectionReason?: string;
    resolutionComment?: string;
}
