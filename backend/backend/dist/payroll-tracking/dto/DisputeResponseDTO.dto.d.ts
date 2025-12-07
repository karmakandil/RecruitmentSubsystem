import { DisputeStatus } from '../enums/payroll-tracking-enum';
export declare class DisputeResponseDTO {
    disputeId: string;
    description: string;
    employeeId: string;
    payslipId: string;
    financeStaffId?: string;
    status: DisputeStatus;
    rejectionReason?: string;
    resolutionComment?: string;
}
