declare class RefundDetailsDTO {
    description: string;
    amount: number;
}
export declare class GenerateRefundForDisputeDTO {
    financeStaffId: string;
    refundDetails: RefundDetailsDTO;
}
export {};
