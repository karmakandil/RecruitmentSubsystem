import { Model, Types } from 'mongoose';
import { claims } from './models/claims.schema';
import { disputes } from './models/disputes.schema';
import { refunds } from './models/refunds.schema';
import { EmployeeProfileDocument } from '../employee-profile/models/employee-profile.schema';
import { EmployeeProfileService } from '../employee-profile/employee-profile.service';
import { PayrollConfigurationService } from '../payroll-configuration/payroll-configuration.service';
import { LeavesService } from '../leaves/leaves.service';
import { TimeManagementService } from '../time-management/services/time-management.service';
import { paySlip, PayslipDocument } from '../payroll-execution/models/payslip.schema';
import { payrollRunsDocument } from '../payroll-execution/models/payrollRuns.schema';
import { LeaveEntitlementDocument } from '../leaves/models/leave-entitlement.schema';
import { LeaveRequestDocument } from '../leaves/models/leave-request.schema';
import { AttendanceRecordDocument } from '../time-management/models/attendance-record.schema';
import { TimeExceptionDocument } from '../time-management/models/time-exception.schema';
import { TimeExceptionType, TimeExceptionStatus } from '../time-management/models/enums/index';
import { DepartmentDocument } from '../organization-structure/models/department.schema';
import { PositionDocument } from '../organization-structure/models/position.schema';
import { PositionAssignmentDocument } from '../organization-structure/models/position-assignment.schema';
import { LeaveStatus } from '../leaves/enums/leave-status.enum';
import { PaySlipPaymentStatus } from '../payroll-execution/enums/payroll-execution-enum';
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
import { DisputeStatus } from './enums/payroll-tracking-enum';
export declare class PayrollTrackingService {
    private readonly claimModel;
    private readonly disputeModel;
    private readonly refundModel;
    private readonly employeeProfileModel;
    private readonly employeeProfileService;
    private readonly payrollConfigurationService;
    private readonly leavesService;
    private readonly timeManagementService;
    private readonly payslipModel;
    private readonly payrollRunsModel;
    private readonly leaveEntitlementModel;
    private readonly leaveRequestModel;
    private readonly attendanceRecordModel;
    private readonly timeExceptionModel;
    private readonly departmentModel;
    private readonly positionModel;
    private readonly positionAssignmentModel;
    constructor(claimModel: Model<claims>, disputeModel: Model<disputes>, refundModel: Model<refunds>, employeeProfileModel: Model<EmployeeProfileDocument>, employeeProfileService: EmployeeProfileService, payrollConfigurationService: PayrollConfigurationService, leavesService: LeavesService, timeManagementService: TimeManagementService, payslipModel: Model<PayslipDocument>, payrollRunsModel: Model<payrollRunsDocument>, leaveEntitlementModel: Model<LeaveEntitlementDocument>, leaveRequestModel: Model<LeaveRequestDocument>, attendanceRecordModel: Model<AttendanceRecordDocument>, timeExceptionModel: Model<TimeExceptionDocument>, departmentModel: Model<DepartmentDocument>, positionModel: Model<PositionDocument>, positionAssignmentModel: Model<PositionAssignmentDocument>);
    private generateClaimId;
    private generateDisputeId;
    private validateObjectId;
    private validateEmployeeExists;
    private enrichTaxDeductionWithConfiguration;
    private enrichInsuranceDeductionWithConfiguration;
    private validateEmployeeAccess;
    private getPayrollPeriodDateRange;
    private isDateInRange;
    private doDateRangesOverlap;
    private sendNotification;
    createClaim(createClaimDTO: CreateClaimDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getClaimById(claimId: string): Promise<import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateClaim(claimId: string, updateClaimDTO: UpdateClaimDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getClaimsByEmployeeId(employeeId: string): Promise<(import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getPendingClaims(): Promise<(import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    approveClaim(claimId: string, approvedAmount: number, financeStaffId: string, resolutionComment?: string): Promise<import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectClaim(claimId: string, rejectionReason: string, financeStaffId: string): Promise<import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    createDispute(createDisputeDTO: CreateDisputeDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, disputes, {}, {}> & disputes & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getDisputeById(disputeId: string): Promise<any>;
    updateDispute(disputeId: string, updateDisputeDTO: UpdateDisputeDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, disputes, {}, {}> & disputes & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getDisputesByEmployeeId(employeeId: string): Promise<(import("mongoose").Document<unknown, {}, disputes, {}, {}> & disputes & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getPendingDisputes(): Promise<(import("mongoose").Document<unknown, {}, disputes, {}, {}> & disputes & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    approveDispute(disputeId: string, financeStaffId: string, resolutionComment?: string): Promise<import("mongoose").Document<unknown, {}, disputes, {}, {}> & disputes & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectDispute(disputeId: string, rejectionReason: string, financeStaffId: string): Promise<import("mongoose").Document<unknown, {}, disputes, {}, {}> & disputes & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    createRefund(createRefundDTO: CreateRefundDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, refunds, {}, {}> & refunds & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getRefundById(refundId: string): Promise<import("mongoose").Document<unknown, {}, refunds, {}, {}> & refunds & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateRefund(refundId: string, updateRefundDTO: UpdateRefundDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, refunds, {}, {}> & refunds & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getRefundsByEmployeeId(employeeId: string): Promise<(import("mongoose").Document<unknown, {}, refunds, {}, {}> & refunds & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getPendingRefunds(): Promise<(import("mongoose").Document<unknown, {}, refunds, {}, {}> & refunds & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    processRefund(refundId: string, processRefundDTO: ProcessRefundDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, refunds, {}, {}> & refunds & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    approveClaimBySpecialist(claimId: string, approveClaimBySpecialistDTO: ApproveClaimBySpecialistDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectClaimBySpecialist(claimId: string, rejectClaimBySpecialistDTO: RejectClaimBySpecialistDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    approveDisputeBySpecialist(disputeId: string, approveDisputeBySpecialistDTO: ApproveDisputeBySpecialistDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, disputes, {}, {}> & disputes & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    rejectDisputeBySpecialist(disputeId: string, rejectDisputeBySpecialistDTO: RejectDisputeBySpecialistDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, disputes, {}, {}> & disputes & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    confirmDisputeApproval(disputeId: string, confirmDisputeApprovalDTO: ConfirmDisputeApprovalDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, disputes, {}, {}> & disputes & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    confirmClaimApproval(claimId: string, confirmClaimApprovalDTO: ConfirmClaimApprovalDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getApprovedDisputesForFinance(): Promise<(import("mongoose").Document<unknown, {}, disputes, {}, {}> & disputes & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getApprovedClaimsForFinance(): Promise<(import("mongoose").Document<unknown, {}, claims, {}, {}> & claims & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    generateRefundForDispute(disputeId: string, generateRefundForDisputeDTO: GenerateRefundForDisputeDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, refunds, {}, {}> & refunds & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    generateRefundForClaim(claimId: string, generateRefundForClaimDTO: GenerateRefundForClaimDTO, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, refunds, {}, {}> & refunds & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getPayslipsByEmployeeId(employeeId: string): Promise<{
        paymentStatus: PaySlipPaymentStatus;
        isDisputed: boolean;
        hasActiveDispute: boolean;
        disputeCount: number;
        status: string;
        _id: Types.ObjectId;
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
        employeeId: Types.ObjectId;
        payrollRunId: Types.ObjectId;
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
    getPayslipById(payslipId: string, employeeId: string): Promise<{
        paymentStatus: PaySlipPaymentStatus;
        isDisputed: boolean;
        hasActiveDispute: boolean;
        disputeCount: number;
        latestDispute: {
            disputeId: string;
            status: DisputeStatus;
            description: string;
            createdAt: any;
        };
        status: string;
        _id: Types.ObjectId;
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
        employeeId: Types.ObjectId;
        payrollRunId: Types.ObjectId;
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
    getEmployeeBaseSalary(employeeId: string): Promise<any>;
    getLeaveEncashmentByEmployeeId(employeeId: string, payrollRunId?: string): Promise<{
        employeeId: Types.ObjectId;
        employeeNumber: string;
        baseSalary: any;
        dailySalary: number;
        leaveEntitlements: {
            leaveType: Types.ObjectId;
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
    getTransportationAllowance(employeeId: string, payslipId?: string): Promise<{
        payslipId: any;
        payrollPeriod: any;
        transportationAllowance: any[];
        totalTransportationAllowance: any;
    }>;
    getTaxDeductions(employeeId: string, payslipId?: string): Promise<{
        payslipId: any;
        payrollPeriod: any;
        taxDeductions: any;
        totalTaxDeductions: any;
    }>;
    getInsuranceDeductions(employeeId: string, payslipId?: string): Promise<{
        payslipId: any;
        payrollPeriod: any;
        insuranceDeductions: any[];
        totalInsuranceDeductions: any;
    }>;
    getMisconductDeductions(employeeId: string, payslipId?: string): Promise<{
        employeeId: Types.ObjectId;
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
                id: Types.ObjectId;
                type: TimeExceptionType;
                status: TimeExceptionStatus;
                reason: string;
                attendanceRecordId: Types.ObjectId;
                date: Date;
            }[];
            late: {
                id: Types.ObjectId;
                type: TimeExceptionType;
                status: TimeExceptionStatus;
                reason: string;
                attendanceRecordId: Types.ObjectId;
            }[];
            earlyLeave: {
                id: Types.ObjectId;
                type: TimeExceptionType;
                status: TimeExceptionStatus;
                reason: string;
                attendanceRecordId: Types.ObjectId;
            }[];
            shortTime: {
                id: Types.ObjectId;
                type: TimeExceptionType;
                status: TimeExceptionStatus;
                reason: string;
                attendanceRecordId: Types.ObjectId;
            }[];
            missedPunch: {
                id: Types.ObjectId;
                type: TimeExceptionType;
                status: TimeExceptionStatus;
                reason: string;
                attendanceRecordId: Types.ObjectId;
            }[];
        };
        attendanceRecords: number;
        note: string;
    }>;
    getUnpaidLeaveDeductions(employeeId: string, payslipId?: string): Promise<{
        employeeId: Types.ObjectId;
        employeeNumber: string;
        baseSalary: any;
        dailySalary: number;
        hourlySalary: number;
        unpaidLeaveRequests: {
            leaveRequestId: Types.ObjectId;
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
            status: LeaveStatus;
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
    getSalaryHistory(employeeId: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, paySlip, {}, {}> & paySlip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, paySlip, {}, {}> & paySlip & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getEmployerContributions(employeeId: string, payslipId?: string): Promise<{
        payslipId: any;
        payrollPeriod: any;
        employerContributions: any;
        totalEmployerContributions: any;
    }>;
    getTaxDocuments(employeeId: string, year?: number): Promise<{
        employeeId: Types.ObjectId;
        year: number;
        annualStatement: {
            totalGrossSalary: number;
            totalDeductions: number;
            totalNetPay: number;
            totalTaxes: number;
            payslips: {
                payslipId: Types.ObjectId;
                payrollPeriod: Types.ObjectId;
                grossSalary: number;
                deductions: number;
                netPay: number;
            }[];
        };
    }>;
    getPayrollReportByDepartment(departmentId: string, payrollRunId?: string): Promise<{
        department: {
            id: Types.ObjectId;
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
                id: Types.ObjectId;
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
                id: Types.ObjectId;
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
            paymentStatus: PaySlipPaymentStatus;
            payslipId: Types.ObjectId;
        }[];
    }>;
    getPayrollSummary(period: 'month' | 'year', date?: Date, departmentId?: string): Promise<{
        period: "month" | "year";
        startDate: Date;
        endDate: Date;
        department: {
            id: Types.ObjectId;
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
    getTaxInsuranceBenefitsReport(period: 'month' | 'year', date?: Date, departmentId?: string): Promise<{
        period: "month" | "year";
        startDate: Date;
        endDate: Date;
        department: {
            id: Types.ObjectId;
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
    getActiveDepartments(): Promise<{
        totalDepartments: number;
        departments: {
            id: Types.ObjectId;
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
    getPayrollSummaryByAllDepartments(period: 'month' | 'year', date?: Date): Promise<{
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
                id: Types.ObjectId;
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
