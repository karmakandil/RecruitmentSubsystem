export declare class FinanceDecisionDto {
    payrollRunId: string;
    decision: 'approve' | 'reject';
    reason?: string;
    financeStaffId?: string;
    decisionDate?: string;
}
