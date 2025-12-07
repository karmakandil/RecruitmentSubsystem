declare class RefundDetailsDTO {
    description: string;
    amount: number;
}
export declare class GenerateRefundForClaimDTO {
    financeStaffId: string;
    refundDetails: RefundDetailsDTO;
}
export {};
