export declare class ManagerDecisionDto {
    payrollRunId: string;
    decision: 'approve' | 'reject';
    reason?: string;
    managerId?: string;
    decisionDate?: string;
}
