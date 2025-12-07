import { BankStatus } from '../enums/payroll-execution-enum';
export declare class EmployeePayrollDetailsUpsertDto {
    employeeId: string;
    payrollRunId: string;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    netPay: number;
    bankStatus: BankStatus;
    exceptions?: string;
    bonus?: number;
    benefit?: number;
}
