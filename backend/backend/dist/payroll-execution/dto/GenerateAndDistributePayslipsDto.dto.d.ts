export declare enum PayslipDistributionMethod {
    PDF = "PDF",
    EMAIL = "EMAIL",
    PORTAL = "PORTAL"
}
export declare class GenerateAndDistributePayslipsDto {
    payrollRunId: string;
    distributionMethod?: PayslipDistributionMethod;
}
