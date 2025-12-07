import { PayRollPaymentStatus, PayRollStatus } from '../enums/payroll-execution-enum';
export declare class CreatePayrollRunDto {
    runId: string;
    payrollPeriod: string;
    entity: string;
    employees: number;
    exceptions?: number;
    totalnetpay: number;
    payrollSpecialistId: string;
    status?: PayRollStatus;
    paymentStatus?: PayRollPaymentStatus;
    payrollManagerId?: string;
    financeStaffId?: string;
}
