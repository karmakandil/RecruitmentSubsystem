import { PayrollTrackingService } from './payroll-tracking.service';
import { CreateClaimDTO } from './dto/CreateClaimDTO.dto';
import { UpdateClaimDTO } from './dto/UpdateClaimDTO.dto';
import { CreateDisputeDTO } from './dto/CreateDisputeDTO.dto';
import { UpdateDisputeDTO } from './dto/UpdateDisputeDTO.dto';
import { CreateRefundDTO } from './dto/CreateRefundDTO.dto';
import { UpdateRefundDTO } from './dto/UpdateRefundDTO.dto';
import { ApproveClaimBySpecialistDTO } from './dto/ApproveClaimBySpecialistDTO.dto';
import { RejectClaimBySpecialistDTO } from './dto/RejectClaimBySpecialistDTO.dto';
import { ConfirmClaimApprovalDTO } from './dto/ConfirmClaimApprovalDTO.dto';
import { ApproveDisputeBySpecialistDTO } from './dto/ApproveDisputeBySpecialistDTO.dto';
import { RejectDisputeBySpecialistDTO } from './dto/RejectDisputeBySpecialistDTO.dto';
import { ConfirmDisputeApprovalDTO } from './dto/ConfirmDisputeApprovalDTO.dto';
import { GenerateRefundForDisputeDTO } from './dto/GenerateRefundForDisputeDTO.dto';
import { GenerateRefundForClaimDTO } from './dto/GenerateRefundForClaimDTO.dto';
import { ProcessRefundDTO } from './dto/ProcessRefundDTO.dto';
export declare class PayrollTrackingController {
    private readonly payrollTrackingService;
    constructor(payrollTrackingService: PayrollTrackingService);
    createClaim(createClaimDTO: CreateClaimDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/claims.schema").claims, {}, {}> & import("./models/claims.schema").claims & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getPendingClaims(user: any): Promise<(import("mongoose").Document<unknown, {}, import("./models/claims.schema").claims, {}, {}> & import("./models/claims.schema").claims & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getApprovedClaimsForFinance(user: any): Promise<(import("mongoose").Document<unknown, {}, import("./models/claims.schema").claims, {}, {}> & import("./models/claims.schema").claims & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getClaimsByEmployeeId(employeeId: string, user: any): Promise<(import("mongoose").Document<unknown, {}, import("./models/claims.schema").claims, {}, {}> & import("./models/claims.schema").claims & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getClaimById(claimId: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/claims.schema").claims, {}, {}> & import("./models/claims.schema").claims & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateClaim(claimId: string, updateClaimDTO: UpdateClaimDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/claims.schema").claims, {}, {}> & import("./models/claims.schema").claims & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    approveClaimBySpecialist(claimId: string, approveClaimBySpecialistDTO: ApproveClaimBySpecialistDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/claims.schema").claims, {}, {}> & import("./models/claims.schema").claims & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectClaimBySpecialist(claimId: string, rejectClaimBySpecialistDTO: RejectClaimBySpecialistDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/claims.schema").claims, {}, {}> & import("./models/claims.schema").claims & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    confirmClaimApproval(claimId: string, confirmClaimApprovalDTO: ConfirmClaimApprovalDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/claims.schema").claims, {}, {}> & import("./models/claims.schema").claims & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createDispute(createDisputeDTO: CreateDisputeDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/disputes.schema").disputes, {}, {}> & import("./models/disputes.schema").disputes & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getPendingDisputes(user: any): Promise<(import("mongoose").Document<unknown, {}, import("./models/disputes.schema").disputes, {}, {}> & import("./models/disputes.schema").disputes & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getApprovedDisputesForFinance(user: any): Promise<(import("mongoose").Document<unknown, {}, import("./models/disputes.schema").disputes, {}, {}> & import("./models/disputes.schema").disputes & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getDisputesByEmployeeId(employeeId: string, user: any): Promise<(import("mongoose").Document<unknown, {}, import("./models/disputes.schema").disputes, {}, {}> & import("./models/disputes.schema").disputes & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getDisputeById(disputeId: string, user: any): Promise<any>;
    updateDispute(disputeId: string, updateDisputeDTO: UpdateDisputeDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/disputes.schema").disputes, {}, {}> & import("./models/disputes.schema").disputes & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    approveDisputeBySpecialist(disputeId: string, approveDisputeBySpecialistDTO: ApproveDisputeBySpecialistDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/disputes.schema").disputes, {}, {}> & import("./models/disputes.schema").disputes & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectDisputeBySpecialist(disputeId: string, rejectDisputeBySpecialistDTO: RejectDisputeBySpecialistDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/disputes.schema").disputes, {}, {}> & import("./models/disputes.schema").disputes & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    confirmDisputeApproval(disputeId: string, confirmDisputeApprovalDTO: ConfirmDisputeApprovalDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/disputes.schema").disputes, {}, {}> & import("./models/disputes.schema").disputes & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createRefund(createRefundDTO: CreateRefundDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/refunds.schema").refunds, {}, {}> & import("./models/refunds.schema").refunds & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getPendingRefunds(user: any): Promise<(import("mongoose").Document<unknown, {}, import("./models/refunds.schema").refunds, {}, {}> & import("./models/refunds.schema").refunds & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getRefundsByEmployeeId(employeeId: string, user: any): Promise<(import("mongoose").Document<unknown, {}, import("./models/refunds.schema").refunds, {}, {}> & import("./models/refunds.schema").refunds & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getRefundById(refundId: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/refunds.schema").refunds, {}, {}> & import("./models/refunds.schema").refunds & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateRefund(refundId: string, updateRefundDTO: UpdateRefundDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/refunds.schema").refunds, {}, {}> & import("./models/refunds.schema").refunds & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    processRefund(refundId: string, processRefundDTO: ProcessRefundDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/refunds.schema").refunds, {}, {}> & import("./models/refunds.schema").refunds & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    generateRefundForDispute(disputeId: string, generateRefundForDisputeDTO: GenerateRefundForDisputeDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/refunds.schema").refunds, {}, {}> & import("./models/refunds.schema").refunds & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    generateRefundForClaim(claimId: string, generateRefundForClaimDTO: GenerateRefundForClaimDTO, user: any): Promise<import("mongoose").Document<unknown, {}, import("./models/refunds.schema").refunds, {}, {}> & import("./models/refunds.schema").refunds & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getPayslipsByEmployeeId(employeeId: string, user: any): Promise<{
        paymentStatus: import("../payroll-execution/enums/payroll-execution-enum").PaySlipPaymentStatus;
        isDisputed: boolean;
        hasActiveDispute: boolean;
        disputeCount: number;
        status: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        employeeId: import("mongoose").Types.ObjectId;
        payrollRunId: import("mongoose").Types.ObjectId;
        earningsDetails: {
            baseSalary: number;
            allowances: import("../payroll-configuration/models/allowance.schema").allowance[];
            bonuses?: import("../payroll-configuration/models/signingBonus.schema").signingBonus[];
            benefits?: import("../payroll-configuration/models/terminationAndResignationBenefits").terminationAndResignationBenefits[];
            refunds?: import("./models/refunds.schema").refundDetails[];
        };
        deductionsDetails: {
            taxes: import("../payroll-configuration/models/taxRules.schema").taxRules[];
            insurances?: import("../payroll-configuration/models/insuranceBrackets.schema").insuranceBrackets[];
            penalties?: import("../payroll-execution/models/employeePenalties.schema").employeePenalties;
        };
        totalGrossSalary: number;
        totaDeductions?: number;
        netPay: number;
        __v: number;
    }[]>;
    getPayslipById(employeeId: string, payslipId: string, user: any): Promise<{
        paymentStatus: import("../payroll-execution/enums/payroll-execution-enum").PaySlipPaymentStatus;
        isDisputed: boolean;
        hasActiveDispute: boolean;
        disputeCount: number;
        latestDispute: {
            disputeId: string;
            status: import("./enums/payroll-tracking-enum").DisputeStatus;
            description: string;
            createdAt: any;
        };
        status: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        employeeId: import("mongoose").Types.ObjectId;
        payrollRunId: import("mongoose").Types.ObjectId;
        earningsDetails: {
            baseSalary: number;
            allowances: import("../payroll-configuration/models/allowance.schema").allowance[];
            bonuses?: import("../payroll-configuration/models/signingBonus.schema").signingBonus[];
            benefits?: import("../payroll-configuration/models/terminationAndResignationBenefits").terminationAndResignationBenefits[];
            refunds?: import("./models/refunds.schema").refundDetails[];
        };
        deductionsDetails: {
            taxes: import("../payroll-configuration/models/taxRules.schema").taxRules[];
            insurances?: import("../payroll-configuration/models/insuranceBrackets.schema").insuranceBrackets[];
            penalties?: import("../payroll-execution/models/employeePenalties.schema").employeePenalties;
        };
        totalGrossSalary: number;
        totaDeductions?: number;
        netPay: number;
        __v: number;
    }>;
    getEmployeeBaseSalary(employeeId: string, user: any): Promise<any>;
    getLeaveEncashmentByEmployeeId(employeeId: string, user: any, payrollRunId?: string): Promise<{
        employeeId: import("mongoose").Types.ObjectId;
        employeeNumber: string;
        baseSalary: any;
        dailySalary: number;
        leaveEntitlements: {
            leaveType: import("mongoose").Types.ObjectId;
            remaining: number;
            accrued: number;
            taken: number;
            yearlyEntitlement: number;
        }[];
        encashableLeaves: {
            leaveType: {
                id: any;
                name: any;
                code: any;
            };
            remainingDays: number;
            accruedDays: number;
            takenDays: number;
            potentialEncashmentAmount: number;
            isEncashable: boolean;
        }[];
        encashmentInPayslip: {
            type: any;
            name: any;
            amount: any;
            description: any;
            configurationDetails: any;
        }[];
        totalEncashmentInPayslip: any;
        payslipId: any;
        payrollPeriod: {
            payrollRunId: any;
            runId: string;
            period: Date;
            startDate: Date;
            endDate: Date;
        };
    }>;
    getTransportationAllowance(employeeId: string, user: any, payslipId?: string): Promise<{
        payslipId: any;
        payrollPeriod: any;
        transportationAllowance: any[];
        totalTransportationAllowance: any;
    }>;
    getTaxDeductions(employeeId: string, user: any, payslipId?: string): Promise<{
        payslipId: any;
        payrollPeriod: any;
        taxDeductions: any;
        totalTaxDeductions: any;
    }>;
    getInsuranceDeductions(employeeId: string, user: any, payslipId?: string): Promise<{
        payslipId: any;
        payrollPeriod: any;
        insuranceDeductions: any[];
        totalInsuranceDeductions: any;
    }>;
    getMisconductDeductions(employeeId: string, user: any, payslipId?: string): Promise<{
        employeeId: import("mongoose").Types.ObjectId;
        employeeNumber: string;
        payslipId: any;
        payrollPeriod: {
            payrollRunId: any;
            runId: any;
            period: any;
            startDate: Date;
            endDate: Date;
        };
        baseSalary: any;
        dailySalary: number;
        hourlySalary: number;
        penalties: any;
        misconductSummary: {
            lateCount: number;
            earlyLeaveCount: number;
            shortTimeCount: number;
            missedPunchCount: number;
            totalExceptions: number;
        };
        timeExceptions: {
            all: {
                id: import("mongoose").Types.ObjectId;
                type: import("../time-management/models/enums").TimeExceptionType;
                status: import("../time-management/models/enums").TimeExceptionStatus;
                reason: string;
                attendanceRecordId: import("mongoose").Types.ObjectId;
                date: Date;
            }[];
            late: {
                id: import("mongoose").Types.ObjectId;
                type: import("../time-management/models/enums").TimeExceptionType;
                status: import("../time-management/models/enums").TimeExceptionStatus;
                reason: string;
                attendanceRecordId: import("mongoose").Types.ObjectId;
            }[];
            earlyLeave: {
                id: import("mongoose").Types.ObjectId;
                type: import("../time-management/models/enums").TimeExceptionType;
                status: import("../time-management/models/enums").TimeExceptionStatus;
                reason: string;
                attendanceRecordId: import("mongoose").Types.ObjectId;
            }[];
            shortTime: {
                id: import("mongoose").Types.ObjectId;
                type: import("../time-management/models/enums").TimeExceptionType;
                status: import("../time-management/models/enums").TimeExceptionStatus;
                reason: string;
                attendanceRecordId: import("mongoose").Types.ObjectId;
            }[];
            missedPunch: {
                id: import("mongoose").Types.ObjectId;
                type: import("../time-management/models/enums").TimeExceptionType;
                status: import("../time-management/models/enums").TimeExceptionStatus;
                reason: string;
                attendanceRecordId: import("mongoose").Types.ObjectId;
            }[];
        };
        attendanceRecords: number;
        note: string;
    }>;
    getUnpaidLeaveDeductions(employeeId: string, user: any, payslipId?: string): Promise<{
        employeeId: import("mongoose").Types.ObjectId;
        employeeNumber: string;
        baseSalary: any;
        dailySalary: number;
        hourlySalary: number;
        unpaidLeaveRequests: {
            leaveRequestId: import("mongoose").Types.ObjectId;
            leaveType: {
                id: any;
                name: any;
                code: any;
                paid: any;
                deductible: any;
            };
            dates: {
                from: Date;
                to: Date;
            };
            durationDays: number;
            daysInPayrollPeriod: number;
            dailySalary: number;
            deductionAmount: number;
            justification: string;
            status: import("../leaves/enums/leave-status.enum").LeaveStatus;
        }[];
        totalUnpaidLeaveDays: number;
        totalDeductionAmount: number;
        payslipDeduction: any;
        payslipId: any;
        payrollPeriod: {
            payrollRunId: any;
            runId: any;
            period: any;
            startDate: Date;
            endDate: Date;
        };
    }>;
    getSalaryHistory(employeeId: string, user: any, limit?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../payroll-execution/models/payslip.schema").paySlip, {}, {}> & import("../payroll-execution/models/payslip.schema").paySlip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../payroll-execution/models/payslip.schema").paySlip, {}, {}> & import("../payroll-execution/models/payslip.schema").paySlip & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getEmployerContributions(employeeId: string, user: any, payslipId?: string): Promise<{
        payslipId: any;
        payrollPeriod: any;
        employerContributions: any;
        totalEmployerContributions: any;
    }>;
    getTaxDocuments(employeeId: string, user: any, year?: string): Promise<{
        employeeId: import("mongoose").Types.ObjectId;
        year: number;
        annualStatement: {
            totalGrossSalary: number;
            totalDeductions: number;
            totalNetPay: number;
            totalTaxes: number;
            payslips: {
                payslipId: import("mongoose").Types.ObjectId;
                payrollPeriod: import("mongoose").Types.ObjectId;
                grossSalary: number;
                deductions: number;
                netPay: number;
            }[];
        };
    }>;
    getPayrollReportByDepartment(departmentId: string, user: any, payrollRunId?: string): Promise<{
        department: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            code: string;
            description: string;
            isActive: true;
            headPosition: {
                id: any;
                title: any;
                code: any;
            };
        };
        organizationStructure: {
            totalPositions: number;
            positions: {
                id: import("mongoose").Types.ObjectId;
                code: string;
                title: string;
            }[];
            activeAssignments: number;
        };
        payrollRun: {
            id: any;
            runId: any;
            payrollPeriod: any;
            status: any;
            paymentStatus: any;
        };
        summary: {
            totalEmployees: number;
            employeesWithPayslips: number;
            employeesWithoutPayslips: number;
            totalGrossSalary: number;
            totalDeductions: number;
            totalNetPay: number;
            averageGrossSalary: number;
            averageNetPay: number;
        };
        financialBreakdown: {
            taxes: {
                breakdown: Record<string, number>;
                total: number;
            };
            insurance: {
                breakdown: Record<string, {
                    employee: number;
                    employer: number;
                }>;
                totalEmployeeContributions: number;
                totalEmployerContributions: number;
                total: number;
            };
        };
        payslipsByPosition: {
            position: {
                id: import("mongoose").Types.ObjectId;
                code: string;
                title: string;
            } | {
                id: string;
                code: string;
                title: string;
            };
            employeeCount: number;
            totalGrossSalary: any;
            totalDeductions: any;
            totalNetPay: any;
        }[];
        payslips: {
            employee: {
                id: any;
                firstName: any;
                lastName: any;
                employeeNumber: any;
                position: {
                    id: any;
                    title: any;
                    code: any;
                };
            };
            grossSalary: number;
            deductions: number;
            netPay: number;
            paymentStatus: import("../payroll-execution/enums/payroll-execution-enum").PaySlipPaymentStatus;
            payslipId: import("mongoose").Types.ObjectId;
        }[];
    }>;
    getPayrollSummary(period: 'month' | 'year', user: any, date?: string, departmentId?: string): Promise<{
        period: "month" | "year";
        startDate: Date;
        endDate: Date;
        department: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            code: string;
        };
        totalPayrollRuns: number;
        totalEmployees: number;
        totalGrossSalary: number;
        totalDeductions: number;
        totalNetPay: number;
        payrollRuns: {
            runId: string;
            payrollPeriod: Date;
            employees: number;
            totalNetPay: number;
            status: import("../payroll-execution/enums/payroll-execution-enum").PayRollStatus;
            paymentStatus: import("../payroll-execution/enums/payroll-execution-enum").PayRollPaymentStatus;
        }[];
        departmentBreakdown: any;
    }>;
    getTaxInsuranceBenefitsReport(period: 'month' | 'year', user: any, date?: string, departmentId?: string): Promise<{
        period: "month" | "year";
        startDate: Date;
        endDate: Date;
        department: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            code: string;
        };
        taxes: {
            breakdown: Record<string, number>;
            total: number;
        };
        insurance: {
            breakdown: Record<string, {
                employee: number;
                employer: number;
            }>;
            totalEmployeeContributions: number;
            totalEmployerContributions: number;
            total: number;
        };
        benefits: {
            total: number;
        };
        summary: {
            totalEmployees: number;
            totalPayslips: number;
        };
        departmentBreakdown: any;
    }>;
    getActiveDepartments(user: any): Promise<{
        totalDepartments: number;
        departments: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            code: string;
            description: string;
            isActive: boolean;
            headPosition: {
                id: any;
                title: any;
                code: any;
            };
            activeEmployeeCount: number;
        }[];
    }>;
    getPayrollSummaryByAllDepartments(period: 'month' | 'year', user: any, date?: string): Promise<{
        period: "month" | "year";
        startDate: Date;
        endDate: Date;
        summary: {
            totalDepartments: number;
            totalEmployees: number;
            totalGrossSalary: number;
            totalDeductions: number;
            totalNetPay: number;
        };
        departments: {
            department: {
                id: import("mongoose").Types.ObjectId;
                name: string;
                code: string;
            };
            employeeCount: number;
            employeesWithPayslips: number;
            totalGrossSalary: number;
            totalDeductions: number;
            totalNetPay: number;
            averageGrossSalary: number;
            averageNetPay: number;
        }[];
    }>;
}
