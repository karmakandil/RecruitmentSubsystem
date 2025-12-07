import { ConfigStatus } from '../enums/payroll-configuration-enums';
export declare class FilterDto {
    status?: ConfigStatus;
    createdBy?: string;
    page?: number;
    limit?: number;
}
