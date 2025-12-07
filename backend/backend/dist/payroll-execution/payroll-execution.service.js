"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollExecutionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose = __importStar(require("mongoose"));
const payrollRuns_schema_1 = require("./models/payrollRuns.schema");
const employeePayrollDetails_schema_1 = require("./models/employeePayrollDetails.schema");
const EmployeeSigningBonus_schema_1 = require("./models/EmployeeSigningBonus.schema");
const EmployeeTerminationResignation_schema_1 = require("./models/EmployeeTerminationResignation.schema");
const payslip_schema_1 = require("./models/payslip.schema");
const payroll_configuration_service_1 = require("../payroll-configuration/payroll-configuration.service");
const payroll_tracking_service_1 = require("../payroll-tracking/payroll-tracking.service");
const employee_profile_service_1 = require("../employee-profile/employee-profile.service");
const leaves_service_1 = require("../leaves/leaves.service");
const payroll_execution_enum_1 = require("./enums/payroll-execution-enum");
const leave_status_enum_1 = require("../leaves/enums/leave-status.enum");
const index_1 = require("../time-management/models/enums/index");
const payroll_tracking_enum_1 = require("../payroll-tracking/enums/payroll-tracking-enum");
const termination_request_schema_1 = require("../recruitment/models/termination-request.schema");
const position_schema_1 = require("../organization-structure/models/position.schema");
const employeePenalties_schema_1 = require("./models/employeePenalties.schema");
const payroll_configuration_enums_1 = require("../payroll-configuration/enums/payroll-configuration-enums");
const employee_profile_enums_1 = require("../employee-profile/enums/employee-profile.enums");
const termination_status_enum_1 = require("../recruitment/enums/termination-status.enum");
const employee_system_role_schema_1 = require("../employee-profile/models/employee-system-role.schema");
let PayrollExecutionService = class PayrollExecutionService {
    constructor(payrollRunModel, employeePayrollDetailsModel, employeeSigningBonusModel, employeeTerminationResignationModel, paySlipModel, employeePenaltiesModel, employeeSystemRoleModel, payrollConfigurationService, payrollTrackingService, employeeProfileService, leavesService) {
        this.payrollRunModel = payrollRunModel;
        this.employeePayrollDetailsModel = employeePayrollDetailsModel;
        this.employeeSigningBonusModel = employeeSigningBonusModel;
        this.employeeTerminationResignationModel = employeeTerminationResignationModel;
        this.paySlipModel = paySlipModel;
        this.employeePenaltiesModel = employeePenaltiesModel;
        this.employeeSystemRoleModel = employeeSystemRoleModel;
        this.payrollConfigurationService = payrollConfigurationService;
        this.payrollTrackingService = payrollTrackingService;
        this.employeeProfileService = employeeProfileService;
        this.leavesService = leavesService;
    }
    async createPayrollRun(createPayrollRunDto, currentUserId) {
        let payrollManagerId = createPayrollRunDto.payrollManagerId;
        if (!payrollManagerId) {
            const defaultManager = await this.findDefaultPayrollManager();
            if (!defaultManager) {
                throw new Error('No payroll manager found. Please provide payrollManagerId or ensure a payroll manager exists in the system.');
            }
            payrollManagerId = defaultManager;
        }
        if (payrollManagerId === createPayrollRunDto.payrollSpecialistId) {
            throw new Error('Payroll manager must be different from payroll specialist.');
        }
        const payrollRun = new this.payrollRunModel({
            ...createPayrollRunDto,
            exceptions: createPayrollRunDto.exceptions ?? 0,
            payrollManagerId: new mongoose.Types.ObjectId(payrollManagerId),
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return await payrollRun.save();
    }
    async reviewPayroll(runId, reviewDto, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(runId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        payrollRun.status = payroll_execution_enum_1.PayRollStatus.UNDER_REVIEW;
        payrollRun.updatedBy = currentUserId;
        return await payrollRun.save();
    }
    async generateEmployeePayrollDetails(employeePayrollDetailsDto, currentUserId) {
        const employeePayrollDetails = new this.employeePayrollDetailsModel({
            ...employeePayrollDetailsDto,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return await employeePayrollDetails.save();
    }
    async flagPayrollException(runId, exceptionCode, exceptionMessage, currentUserId, employeeId) {
        const payrollRun = await this.payrollRunModel.findById(runId);
        if (!payrollRun) {
            throw new Error('Payroll run not found');
        }
        payrollRun.exceptions += 1;
        if (employeeId) {
            await this.addExceptionToEmployee(employeeId, runId, exceptionCode, exceptionMessage);
        }
        const exceptionDetails = {
            code: exceptionCode,
            message: exceptionMessage,
            payrollRunId: runId,
            employeeId: employeeId || 'N/A',
            timestamp: new Date(),
        };
        console.log('Logged exception:', exceptionDetails);
        payrollRun.updatedBy = currentUserId;
        return await payrollRun.save();
    }
    async addExceptionToEmployee(employeeId, payrollRunId, exceptionCode, exceptionMessage) {
        try {
            const payrollDetails = await this.employeePayrollDetailsModel.findOne({
                employeeId: new mongoose.Types.ObjectId(employeeId),
                payrollRunId: new mongoose.Types.ObjectId(payrollRunId),
            });
            if (!payrollDetails) {
                console.warn(`Payroll details not found for employee ${employeeId} in run ${payrollRunId}. Exception logged but not stored per employee.`);
                return;
            }
            let exceptionsData = {};
            if (payrollDetails.exceptions) {
                try {
                    exceptionsData = JSON.parse(payrollDetails.exceptions);
                }
                catch (error) {
                    if (typeof payrollDetails.exceptions === 'string' &&
                        payrollDetails.exceptions.includes('deductionsBreakdown')) {
                        try {
                            exceptionsData = JSON.parse(payrollDetails.exceptions);
                        }
                        catch (e) {
                            exceptionsData = {};
                        }
                    }
                    else {
                        exceptionsData = {};
                    }
                }
            }
            if (!exceptionsData.exceptionMessages) {
                exceptionsData.exceptionMessages = [];
            }
            if (!exceptionsData.exceptionHistory) {
                exceptionsData.exceptionHistory = [];
            }
            const exceptionEntry = {
                code: exceptionCode,
                message: exceptionMessage,
                timestamp: new Date().toISOString(),
                status: 'active',
                resolvedBy: null,
                resolvedAt: null,
                resolution: null,
            };
            exceptionsData.exceptionMessages.push(exceptionEntry);
            exceptionsData.exceptionHistory.push({
                ...exceptionEntry,
                action: 'flagged',
            });
            payrollDetails.exceptions = JSON.stringify(exceptionsData);
            await payrollDetails.save();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error adding exception to employee ${employeeId}: ${errorMessage}`);
        }
    }
    async detectIrregularities(payrollRunId, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(payrollRunId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        const irregularities = [];
        const payrollDetails = await this.employeePayrollDetailsModel
            .find({
            payrollRunId: new mongoose.Types.ObjectId(payrollRunId),
        })
            .populate('employeeId')
            .exec();
        for (const detail of payrollDetails) {
            const employeeId = detail.employeeId._id?.toString() ||
                detail.employeeId.toString();
            if (detail.netPay < 0) {
                const message = `Employee has negative net pay: ${detail.netPay}`;
                irregularities.push(`Employee ${employeeId} has negative net pay: ${detail.netPay}`);
                await this.flagPayrollException(payrollRunId, 'NEGATIVE_NET_PAY', message, currentUserId, employeeId);
            }
            if (detail.bankStatus === 'missing') {
                const message = 'Employee has missing bank account';
                irregularities.push(`Employee ${employeeId} has missing bank account`);
                await this.flagPayrollException(payrollRunId, 'MISSING_BANK_ACCOUNT', message, currentUserId, employeeId);
            }
            try {
                const employee = await this.employeeProfileService.findOne(employeeId);
                if (employee && detail.baseSalary > 0) {
                    const historicalData = await this.getEmployeeHistoricalPayrollData(employeeId, payrollRun.payrollPeriod);
                    if (historicalData && historicalData.averageBaseSalary > 0) {
                        const percentageIncrease = ((detail.baseSalary - historicalData.averageBaseSalary) /
                            historicalData.averageBaseSalary) *
                            100;
                        const isSpike = detail.baseSalary > historicalData.averageBaseSalary * 2 ||
                            percentageIncrease > 50;
                        if (isSpike) {
                            const message = `Sudden salary spike detected: Current ${detail.baseSalary} vs Historical Average ${historicalData.averageBaseSalary.toFixed(2)} (${percentageIncrease.toFixed(1)}% increase). Previous runs: ${historicalData.previousRunsCount}`;
                            irregularities.push(`Employee ${employeeId} has sudden salary spike: ${detail.baseSalary} (${percentageIncrease.toFixed(1)}% increase from average)`);
                            await this.flagPayrollException(payrollRunId, 'SALARY_SPIKE', message, currentUserId, employeeId);
                        }
                    }
                    else if (historicalData && historicalData.previousRunsCount === 0) {
                    }
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.warn(`Error checking salary spike for employee ${employeeId}: ${errorMessage}`);
            }
        }
        return irregularities;
    }
    async validatePreInitiationRequirements() {
        const pendingSigningBonuses = await this.employeeSigningBonusModel
            .find({
            status: payroll_execution_enum_1.BonusStatus.PENDING,
        })
            .populate('employeeId', 'employeeNumber firstName lastName')
            .populate('signingBonusId', 'name amount')
            .select('_id employeeId signingBonusId givenAmount status createdAt')
            .exec();
        const pendingTerminationBenefits = await this.employeeTerminationResignationModel
            .find({
            status: payroll_execution_enum_1.BenefitStatus.PENDING,
        })
            .populate('employeeId', 'employeeNumber firstName lastName')
            .populate('benefitId', 'name amount')
            .select('_id employeeId benefitId givenAmount status terminationId createdAt')
            .exec();
        if (pendingSigningBonuses.length > 0 ||
            pendingTerminationBenefits.length > 0) {
            const errorDetails = [];
            if (pendingSigningBonuses.length > 0) {
                const bonusDetails = pendingSigningBonuses
                    .map((bonus) => {
                    const employee = bonus.employeeId;
                    const employeeInfo = employee?.employeeNumber ||
                        employee?._id?.toString() ||
                        'Unknown';
                    const bonusConfig = bonus.signingBonusId;
                    const bonusName = bonusConfig?.name || 'Unknown Bonus';
                    const amount = bonus.givenAmount || bonusConfig?.amount || 0;
                    return `  - Signing Bonus ID: ${bonus._id}, Employee: ${employeeInfo}, Bonus: ${bonusName}, Amount: ${amount}`;
                })
                    .join('\n');
                errorDetails.push(`Pending Signing Bonuses (${pendingSigningBonuses.length}):\n${bonusDetails}`);
            }
            if (pendingTerminationBenefits.length > 0) {
                const benefitDetails = pendingTerminationBenefits
                    .map((benefit) => {
                    const employee = benefit.employeeId;
                    const employeeInfo = employee?.employeeNumber ||
                        employee?._id?.toString() ||
                        'Unknown';
                    const benefitConfig = benefit.benefitId;
                    const benefitName = benefitConfig?.name || 'Unknown Benefit';
                    const amount = benefit.givenAmount || benefitConfig?.amount || 0;
                    return `  - Termination Benefit ID: ${benefit._id}, Employee: ${employeeInfo}, Benefit: ${benefitName}, Amount: ${amount}`;
                })
                    .join('\n');
                errorDetails.push(`Pending Termination Benefits (${pendingTerminationBenefits.length}):\n${benefitDetails}`);
            }
            const errorMessage = `Cannot initiate payroll. There are pending items that require review before payroll initiation:\n\n` +
                `${errorDetails.join('\n\n')}\n\n` +
                `Please review and approve/reject these items before initiating payroll. ` +
                `You can use the review endpoints to process these items.`;
            return {
                isValid: false,
                errorMessage,
                pendingSigningBonuses: pendingSigningBonuses.map((b) => ({
                    id: b._id.toString(),
                    employeeId: b.employeeId?._id?.toString() ||
                        b.employeeId?.toString(),
                    employeeNumber: b.employeeId?.employeeNumber,
                    signingBonusId: b.signingBonusId?._id?.toString(),
                    bonusName: b.signingBonusId?.name,
                    givenAmount: b.givenAmount,
                    createdAt: b.createdAt,
                })),
                pendingTerminationBenefits: pendingTerminationBenefits.map((b) => ({
                    id: b._id.toString(),
                    employeeId: b.employeeId?._id?.toString() ||
                        b.employeeId?.toString(),
                    employeeNumber: b.employeeId?.employeeNumber,
                    benefitId: b.benefitId?._id?.toString(),
                    benefitName: b.benefitId?.name,
                    givenAmount: b.givenAmount,
                    terminationId: b.terminationId?.toString(),
                    createdAt: b.createdAt,
                })),
            };
        }
        return {
            isValid: true,
        };
    }
    async getPreInitiationValidationStatus(currentUserId) {
        const validationResult = await this.validatePreInitiationRequirements();
        const pendingItems = [];
        if (validationResult.pendingSigningBonuses) {
            for (const bonus of validationResult.pendingSigningBonuses) {
                pendingItems.push({
                    type: 'signing_bonus',
                    id: bonus.id,
                    employeeId: bonus.employeeId,
                    employeeNumber: bonus.employeeNumber,
                    itemName: bonus.bonusName || 'Signing Bonus',
                    amount: bonus.givenAmount || 0,
                    createdAt: bonus.createdAt,
                });
            }
        }
        if (validationResult.pendingTerminationBenefits) {
            for (const benefit of validationResult.pendingTerminationBenefits) {
                pendingItems.push({
                    type: 'termination_benefit',
                    id: benefit.id,
                    employeeId: benefit.employeeId,
                    employeeNumber: benefit.employeeNumber,
                    itemName: benefit.benefitName || 'Termination Benefit',
                    amount: benefit.givenAmount || 0,
                    createdAt: benefit.createdAt,
                });
            }
        }
        return {
            canInitiate: validationResult.isValid,
            pendingSigningBonuses: validationResult.pendingSigningBonuses?.length || 0,
            pendingTerminationBenefits: validationResult.pendingTerminationBenefits?.length || 0,
            pendingItems,
        };
    }
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            [payroll_execution_enum_1.PayRollStatus.DRAFT]: [
                payroll_execution_enum_1.PayRollStatus.UNDER_REVIEW,
                payroll_execution_enum_1.PayRollStatus.REJECTED,
            ],
            [payroll_execution_enum_1.PayRollStatus.UNDER_REVIEW]: [
                payroll_execution_enum_1.PayRollStatus.PENDING_FINANCE_APPROVAL,
                payroll_execution_enum_1.PayRollStatus.REJECTED,
            ],
            [payroll_execution_enum_1.PayRollStatus.PENDING_FINANCE_APPROVAL]: [
                payroll_execution_enum_1.PayRollStatus.APPROVED,
                payroll_execution_enum_1.PayRollStatus.REJECTED,
            ],
            [payroll_execution_enum_1.PayRollStatus.APPROVED]: [
                payroll_execution_enum_1.PayRollStatus.LOCKED,
            ],
            [payroll_execution_enum_1.PayRollStatus.LOCKED]: [
                payroll_execution_enum_1.PayRollStatus.UNLOCKED,
            ],
            [payroll_execution_enum_1.PayRollStatus.UNLOCKED]: [
                payroll_execution_enum_1.PayRollStatus.LOCKED,
            ],
            [payroll_execution_enum_1.PayRollStatus.REJECTED]: [],
        };
        const allowedTransitions = validTransitions[currentStatus] || [];
        if (!allowedTransitions.includes(newStatus)) {
            const allowedStatuses = allowedTransitions.length > 0
                ? allowedTransitions.join(', ')
                : 'none (must be recreated)';
            throw new Error(`Invalid status transition: Cannot change from '${currentStatus}' to '${newStatus}'. ` +
                `Valid transitions from '${currentStatus}' are: ${allowedStatuses}. ` +
                `Expected workflow: DRAFT → UNDER_REVIEW → PENDING_FINANCE_APPROVAL → APPROVED → LOCKED`);
        }
    }
    async lockPayroll(runId, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(runId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        this.validateStatusTransition(payrollRun.status, payroll_execution_enum_1.PayRollStatus.LOCKED);
        payrollRun.status = payroll_execution_enum_1.PayRollStatus.LOCKED;
        payrollRun.updatedBy = currentUserId;
        return await payrollRun.save();
    }
    async unlockPayroll(runId, unlockReason, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(runId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        this.validateStatusTransition(payrollRun.status, payroll_execution_enum_1.PayRollStatus.UNLOCKED);
        if (!unlockReason || unlockReason.trim().length === 0) {
            throw new Error('Unlock reason is required when unlocking a payroll run');
        }
        payrollRun.status = payroll_execution_enum_1.PayRollStatus.UNLOCKED;
        payrollRun.unlockReason = unlockReason;
        payrollRun.updatedBy = currentUserId;
        return await payrollRun.save();
    }
    async freezePayroll(runId, currentUserId) {
        return this.lockPayroll(runId, currentUserId);
    }
    async unfreezePayroll(runId, unfreezeReason, currentUserId) {
        return this.unlockPayroll(runId, unfreezeReason, currentUserId);
    }
    extractEntityAndCurrency(entityField) {
        if (!entityField) {
            return { entityName: 'Unknown', currency: 'USD' };
        }
        const parts = entityField.split('|');
        if (parts.length === 2) {
            return {
                entityName: parts[0].trim(),
                currency: parts[1].trim().toUpperCase() || 'USD',
            };
        }
        return {
            entityName: entityField.trim(),
            currency: 'USD',
        };
    }
    formatEntityWithCurrency(entityName, currency = 'USD') {
        return `${entityName}|${currency.toUpperCase()}`;
    }
    getPayrollRunCurrency(payrollRun) {
        if (!payrollRun || !payrollRun.entity) {
            return 'USD';
        }
        const { currency } = this.extractEntityAndCurrency(payrollRun.entity);
        return currency;
    }
    getCurrencyConversionRate(fromCurrency, toCurrency, date) {
        if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
            return 1;
        }
        const conversionRates = {
            USD: {
                EUR: 0.85,
                GBP: 0.73,
                JPY: 110.0,
                AED: 3.67,
                SAR: 3.75,
                EGP: 30.0,
            },
            EUR: {
                USD: 1.18,
                GBP: 0.86,
                JPY: 129.0,
                AED: 4.32,
                SAR: 4.41,
                EGP: 35.3,
            },
            GBP: {
                USD: 1.37,
                EUR: 1.16,
                JPY: 150.0,
                AED: 5.03,
                SAR: 5.14,
                EGP: 41.1,
            },
            JPY: {
                USD: 0.0091,
                EUR: 0.0078,
                GBP: 0.0067,
                AED: 0.033,
                SAR: 0.034,
                EGP: 0.27,
            },
            AED: {
                USD: 0.27,
                EUR: 0.23,
                GBP: 0.2,
                JPY: 30.0,
                SAR: 1.02,
                EGP: 8.17,
            },
            SAR: {
                USD: 0.27,
                EUR: 0.23,
                GBP: 0.19,
                JPY: 29.3,
                AED: 0.98,
                EGP: 8.0,
            },
            EGP: {
                USD: 0.033,
                EUR: 0.028,
                GBP: 0.024,
                JPY: 3.67,
                AED: 0.12,
                SAR: 0.125,
            },
        };
        const from = fromCurrency.toUpperCase();
        const to = toCurrency.toUpperCase();
        if (conversionRates[from] && conversionRates[from][to]) {
            return conversionRates[from][to];
        }
        if (conversionRates[to] && conversionRates[to][from]) {
            return 1 / conversionRates[to][from];
        }
        console.warn(`Currency conversion rate not found: ${from} to ${to}. Using 1.0 (no conversion).`);
        return 1;
    }
    convertCurrency(amount, fromCurrency, toCurrency, date) {
        if (amount === 0)
            return 0;
        const rate = this.getCurrencyConversionRate(fromCurrency, toCurrency, date);
        const converted = amount * rate;
        return Math.round(converted * 100) / 100;
    }
    async processPayrollInitiation(payrollPeriod, entity, payrollSpecialistId, currency, currentUserId, payrollManagerId) {
        if (!payrollPeriod ||
            !(payrollPeriod instanceof Date) ||
            isNaN(payrollPeriod.getTime())) {
            throw new Error('Invalid payroll period. Must be a valid date.');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const periodDate = new Date(payrollPeriod);
        periodDate.setHours(0, 0, 0, 0);
        const maxFutureMonths = 3;
        const maxFutureDate = new Date();
        maxFutureDate.setMonth(maxFutureDate.getMonth() + maxFutureMonths);
        if (periodDate > maxFutureDate) {
            throw new Error(`Payroll period cannot be more than ${maxFutureMonths} months in the future.`);
        }
        await this.validatePayrollPeriodAgainstContracts(payrollPeriod);
        const year = payrollPeriod.getFullYear();
        const month = payrollPeriod.getMonth();
        const periodStart = new Date(year, month, 1);
        const periodEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
        const existingRun = await this.payrollRunModel.findOne({
            payrollPeriod: {
                $gte: periodStart,
                $lte: periodEnd,
            },
            status: { $ne: payroll_execution_enum_1.PayRollStatus.REJECTED },
        });
        if (existingRun) {
            throw new Error(`Payroll run already exists for period ${year}-${String(month + 1).padStart(2, '0')}. Existing runId: ${existingRun.runId}`);
        }
        const validationResult = await this.validatePreInitiationRequirements();
        if (!validationResult.isValid) {
            throw new Error(validationResult.errorMessage);
        }
        const count = await this.payrollRunModel.countDocuments({
            payrollPeriod: {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1),
            },
        });
        const runId = `PR-${year}-${String(count + 1).padStart(4, '0')}`;
        const employeesResult = await this.employeeProfileService.findAll({
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
        });
        const activeEmployees = Array.isArray(employeesResult)
            ? employeesResult
            : employeesResult.data || [];
        const employeesCount = activeEmployees.length;
        const { entityName } = this.extractEntityAndCurrency(entity);
        const entityWithCurrency = currency
            ? this.formatEntityWithCurrency(entityName, currency)
            : entity;
        let finalPayrollManagerId;
        if (payrollManagerId) {
            try {
                finalPayrollManagerId = new mongoose.Types.ObjectId(payrollManagerId);
            }
            catch (error) {
                throw new Error(`Invalid payrollManagerId format: ${payrollManagerId}`);
            }
        }
        else {
            const defaultManager = await this.findDefaultPayrollManager();
            if (!defaultManager) {
                throw new Error('No payroll manager found. Please provide payrollManagerId or ensure a payroll manager exists in the system.');
            }
            try {
                finalPayrollManagerId = new mongoose.Types.ObjectId(defaultManager);
            }
            catch (error) {
                throw new Error(`Invalid default payroll manager ID format: ${defaultManager}`);
            }
        }
        if (!finalPayrollManagerId) {
            throw new Error('Payroll manager ID is required but was not set.');
        }
        if (finalPayrollManagerId.toString() === payrollSpecialistId) {
            throw new Error('Payroll manager must be different from payroll specialist.');
        }
        const payrollRun = new this.payrollRunModel({
            runId,
            payrollPeriod,
            entity: entityWithCurrency,
            employees: employeesCount,
            exceptions: 0,
            totalnetpay: 0,
            payrollSpecialistId: new mongoose.Types.ObjectId(payrollSpecialistId),
            payrollManagerId: finalPayrollManagerId,
            status: payroll_execution_enum_1.PayRollStatus.DRAFT,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return await payrollRun.save();
    }
    async findDefaultPayrollManager() {
        try {
            const managerRole = await this.employeeSystemRoleModel
                .findOne({
                roles: { $in: [employee_profile_enums_1.SystemRole.PAYROLL_MANAGER] },
                isActive: true
            })
                .exec();
            if (managerRole && managerRole.employeeProfileId) {
                const managerId = managerRole.employeeProfileId.toString();
                console.log(`Found default payroll manager: ${managerId}`);
                return managerId;
            }
            console.warn('No payroll manager found in the system. Please create a payroll manager or provide payrollManagerId in the request.');
            return null;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('Error finding default payroll manager:', errorMessage);
            return null;
        }
    }
    async validatePayrollPeriodAgainstContracts(payrollPeriod) {
        const year = payrollPeriod.getFullYear();
        const month = payrollPeriod.getMonth();
        const periodStart = new Date(year, month, 1);
        const periodEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
        const employeesResult = await this.employeeProfileService.findAll({
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
        });
        const activeEmployees = Array.isArray(employeesResult)
            ? employeesResult
            : employeesResult.data || [];
        const contractViolations = [];
        for (const employee of activeEmployees) {
            const employeeData = employee;
            const contractStartDate = employeeData.contractStartDate;
            const contractEndDate = employeeData.contractEndDate;
            const dateOfHire = employeeData.dateOfHire;
            const employeeNumber = employeeData.employeeNumber ||
                employeeData._id?.toString() ||
                'Unknown';
            if (contractStartDate || contractEndDate) {
                const contractStart = contractStartDate
                    ? new Date(contractStartDate)
                    : null;
                const contractEnd = contractEndDate ? new Date(contractEndDate) : null;
                if (contractStart && periodEnd < contractStart) {
                    contractViolations.push(`Employee ${employeeNumber}: Payroll period (${year}-${String(month + 1).padStart(2, '0')}) is before contract start date (${contractStart.toISOString().split('T')[0]})`);
                }
                if (contractEnd && periodStart > contractEnd) {
                    contractViolations.push(`Employee ${employeeNumber}: Payroll period (${year}-${String(month + 1).padStart(2, '0')}) is after contract end date (${contractEnd.toISOString().split('T')[0]})`);
                }
            }
            else {
                if (dateOfHire) {
                    const hireDate = new Date(dateOfHire);
                    hireDate.setHours(0, 0, 0, 0);
                    if (periodEnd < hireDate) {
                        contractViolations.push(`Employee ${employeeNumber}: Payroll period (${year}-${String(month + 1).padStart(2, '0')}) is before date of hire (${hireDate.toISOString().split('T')[0]})`);
                    }
                }
            }
        }
        if (contractViolations.length > 0) {
            const violationCount = contractViolations.length;
            const violationDetails = contractViolations.slice(0, 5).join('; ');
            const moreViolations = violationCount > 5 ? ` and ${violationCount - 5} more` : '';
            throw new Error(`Payroll period validation failed: ${violationCount} employee(s) have contract date violations. ` +
                `Details: ${violationDetails}${moreViolations}. ` +
                `Please ensure all employees have valid contracts for the payroll period.`);
        }
    }
    async reviewPayrollInitiation(runId, approved, reviewerId, rejectionReason, currentUserId) {
        console.log(`[Review Initiation] Starting review for payroll run: ${runId}, approved: ${approved}`);
        const payrollRun = await this.payrollRunModel.findOne({ runId });
        if (!payrollRun) {
            throw new Error('Payroll run not found');
        }
        if (payrollRun.status !== payroll_execution_enum_1.PayRollStatus.DRAFT) {
            throw new Error(`Payroll run ${runId} is in ${payrollRun.status} status and cannot be reviewed. Only DRAFT status payroll runs can be reviewed.`);
        }
        if (approved) {
            console.log(`[Review Initiation] Approving payroll run ${runId}...`);
            payrollRun.status = payroll_execution_enum_1.PayRollStatus.DRAFT;
            if (payrollRun.rejectionReason) {
                payrollRun.rejectionReason = undefined;
            }
            payrollRun.updatedBy = currentUserId;
            await payrollRun.save();
            console.log(`[Review Initiation] Payroll run saved. Starting draft generation...`);
            try {
                await this.generateDraftDetailsForPayrollRun(payrollRun._id.toString(), currentUserId);
                console.log(`[Review Initiation] Draft generation completed successfully.`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`[Review Initiation] Error generating draft for payroll run ${runId}: ${errorMessage}`);
                console.error(`[Review Initiation] Stack trace:`, error instanceof Error ? error.stack : 'No stack trace');
                throw new Error(`Failed to generate draft after approval: ${errorMessage}`);
            }
            const updatedPayrollRun = await this.payrollRunModel.findById(payrollRun._id);
            if (!updatedPayrollRun) {
                throw new Error('Payroll run not found after draft generation');
            }
            return updatedPayrollRun;
        }
        else {
            this.validateStatusTransition(payrollRun.status, payroll_execution_enum_1.PayRollStatus.REJECTED);
            payrollRun.status = payroll_execution_enum_1.PayRollStatus.REJECTED;
            payrollRun.rejectionReason =
                rejectionReason || 'Rejected during payroll initiation review';
            await this.employeePayrollDetailsModel
                .deleteMany({ payrollRunId: payrollRun._id })
                .exec();
            payrollRun.updatedBy = currentUserId;
            return await payrollRun.save();
        }
    }
    async editPayrollInitiation(runId, updates, currentUserId) {
        const payrollRun = await this.payrollRunModel.findOne({ runId });
        if (!payrollRun)
            throw new Error('Payroll run not found');
        if (payrollRun.status === payroll_execution_enum_1.PayRollStatus.LOCKED) {
            throw new Error('Cannot edit locked payroll run. Please unlock it first if you need to make changes.');
        }
        if (payrollRun.status === payroll_execution_enum_1.PayRollStatus.UNDER_REVIEW ||
            payrollRun.status === payroll_execution_enum_1.PayRollStatus.PENDING_FINANCE_APPROVAL ||
            payrollRun.status === payroll_execution_enum_1.PayRollStatus.APPROVED) {
            throw new Error(`Cannot edit payroll run in ${payrollRun.status} status. Please reject it first if you need to make changes.`);
        }
        const wasRejected = payrollRun.status === payroll_execution_enum_1.PayRollStatus.REJECTED;
        if (updates.payrollPeriod) {
            await this.validatePayrollPeriodAgainstContracts(new Date(updates.payrollPeriod));
            payrollRun.payrollPeriod = new Date(updates.payrollPeriod);
        }
        if (updates.entity) {
            payrollRun.entity = updates.entity;
        }
        if (updates.employees !== undefined) {
            payrollRun.employees = updates.employees;
        }
        if (updates.totalnetpay !== undefined) {
            payrollRun.totalnetpay = updates.totalnetpay;
        }
        if (updates.payrollSpecialistId) {
            payrollRun.payrollSpecialistId = new mongoose.Types.ObjectId(updates.payrollSpecialistId);
        }
        if (wasRejected) {
            payrollRun.status = payroll_execution_enum_1.PayRollStatus.DRAFT;
            payrollRun.rejectionReason = undefined;
        }
        payrollRun.updatedBy = currentUserId;
        return await payrollRun.save();
    }
    async reviewPayrollPeriod(reviewDto, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(reviewDto.payrollRunId);
        if (!payrollRun) {
            throw new Error('Payroll run not found');
        }
        if (payrollRun.status !== payroll_execution_enum_1.PayRollStatus.DRAFT && payrollRun.status !== payroll_execution_enum_1.PayRollStatus.UNDER_REVIEW) {
            throw new Error(`Payroll run ${reviewDto.payrollRunId} is in ${payrollRun.status} status and cannot be reviewed. Only DRAFT or UNDER_REVIEW status payroll runs can be reviewed.`);
        }
        if (reviewDto.status === payroll_execution_enum_1.PayRollStatus.APPROVED || reviewDto.status === payroll_execution_enum_1.PayRollStatus.UNDER_REVIEW) {
            payrollRun.status = reviewDto.status;
            if (payrollRun.rejectionReason) {
                payrollRun.rejectionReason = undefined;
            }
        }
        else if (reviewDto.status === payroll_execution_enum_1.PayRollStatus.REJECTED) {
            payrollRun.status = payroll_execution_enum_1.PayRollStatus.REJECTED;
            payrollRun.rejectionReason =
                reviewDto.rejectionReason || 'Rejected during payroll period review';
        }
        else {
            throw new Error(`Invalid status ${reviewDto.status} for payroll period review`);
        }
        payrollRun.updatedBy = currentUserId;
        return await payrollRun.save();
    }
    async editPayrollPeriod(editDto, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(editDto.payrollRunId);
        if (!payrollRun) {
            throw new Error('Payroll run not found');
        }
        if (payrollRun.status !== payroll_execution_enum_1.PayRollStatus.DRAFT &&
            payrollRun.status !== payroll_execution_enum_1.PayRollStatus.REJECTED) {
            throw new Error(`Cannot edit payroll period for payroll run in ${payrollRun.status} status. Only DRAFT or REJECTED payroll runs can have their period edited.`);
        }
        await this.validatePayrollPeriodAgainstContracts(new Date(editDto.payrollPeriod));
        payrollRun.payrollPeriod = new Date(editDto.payrollPeriod);
        if (payrollRun.status === payroll_execution_enum_1.PayRollStatus.REJECTED) {
            payrollRun.status = payroll_execution_enum_1.PayRollStatus.DRAFT;
            payrollRun.rejectionReason = undefined;
        }
        payrollRun.updatedBy = currentUserId;
        return await payrollRun.save();
    }
    async processSigningBonuses(currentUserId) {
        const PositionModel = this.payrollRunModel.db.model(position_schema_1.Position.name);
        const ContractModel = this.payrollRunModel.db.model('Contract');
        const OnboardingModel = this.payrollRunModel.db.model('Onboarding');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const employeesResult = await this.employeeProfileService.findAll({
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
            page: 1,
            limit: 10000,
        });
        const allEmployees = Array.isArray(employeesResult)
            ? employeesResult
            : employeesResult.data || [];
        const recentEmployees = allEmployees.filter((emp) => {
            return emp.dateOfHire && new Date(emp.dateOfHire) >= thirtyDaysAgo;
        });
        const signingBonusesResult = await this.payrollConfigurationService.findAllSigningBonuses({
            status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
            limit: 1000
        });
        const approvedSigningBonuses = signingBonusesResult?.data || [];
        const processedBonuses = [];
        for (const employee of recentEmployees) {
            const existingBonus = await this.employeeSigningBonusModel.findOne({
                employeeId: employee._id,
            });
            if (existingBonus) {
                continue;
            }
            const onboarding = await OnboardingModel.findOne({
                employeeId: employee._id,
            });
            let isEligible = false;
            let contractSigningBonus = undefined;
            if (onboarding && onboarding.contractId) {
                const contract = await ContractModel.findById(onboarding.contractId);
                if (contract &&
                    contract.signingBonus !== undefined &&
                    contract.signingBonus !== null &&
                    contract.signingBonus > 0) {
                    isEligible = true;
                    contractSigningBonus = contract.signingBonus;
                }
            }
            if (!isEligible) {
                continue;
            }
            if (!employee.primaryPositionId) {
                continue;
            }
            const position = await PositionModel.findById(employee.primaryPositionId);
            if (!position) {
                continue;
            }
            const signingBonusConfig = approvedSigningBonuses.find((bonus) => bonus.positionName === position.title);
            if (signingBonusConfig) {
                const bonusData = signingBonusConfig;
                const finalAmount = contractSigningBonus !== undefined
                    ? contractSigningBonus
                    : bonusData.amount;
                const employeeBonus = new this.employeeSigningBonusModel({
                    employeeId: employee._id,
                    signingBonusId: bonusData._id,
                    givenAmount: finalAmount,
                    status: payroll_execution_enum_1.BonusStatus.PENDING,
                    createdBy: currentUserId,
                    updatedBy: currentUserId,
                });
                await employeeBonus.save();
                processedBonuses.push(employeeBonus);
            }
        }
        return processedBonuses;
    }
    async createEmployeeSigningBonus(createDto, currentUserId) {
        const employee = await this.employeeProfileService.findOne(createDto.employeeId);
        if (!employee) {
            throw new Error(`Employee not found with ID: ${createDto.employeeId}`);
        }
        const signingBonusConfig = await this.payrollConfigurationService.findOneSigningBonus(createDto.signingBonusId);
        if (!signingBonusConfig) {
            throw new Error(`Signing bonus configuration not found with ID: ${createDto.signingBonusId}`);
        }
        const existingBonus = await this.employeeSigningBonusModel.findOne({
            employeeId: new mongoose.Types.ObjectId(createDto.employeeId),
            signingBonusId: new mongoose.Types.ObjectId(createDto.signingBonusId)
        });
        if (existingBonus) {
            throw new Error(`Signing bonus already exists for this employee and configuration. Use edit-signing-bonus endpoint instead. Existing ID: ${existingBonus._id}`);
        }
        const employeeBonus = new this.employeeSigningBonusModel({
            employeeId: new mongoose.Types.ObjectId(createDto.employeeId),
            signingBonusId: new mongoose.Types.ObjectId(createDto.signingBonusId),
            givenAmount: createDto.givenAmount,
            status: createDto.status || payroll_execution_enum_1.BonusStatus.PENDING,
            paymentDate: createDto.paymentDate ? new Date(createDto.paymentDate) : undefined,
            createdBy: currentUserId,
            updatedBy: currentUserId
        });
        const savedBonus = await employeeBonus.save();
        console.log(`[Create Signing Bonus] Created employee signing bonus: ${savedBonus._id} for employee: ${createDto.employeeId}`);
        return savedBonus;
    }
    async reviewSigningBonus(reviewDto, currentUserId) {
        if (!mongoose.Types.ObjectId.isValid(reviewDto.employeeSigningBonusId)) {
            throw new Error(`Invalid signing bonus ID format: ${reviewDto.employeeSigningBonusId}`);
        }
        console.log(`[Review Signing Bonus] Looking for signing bonus with ID: ${reviewDto.employeeSigningBonusId}`);
        const bonus = await this.employeeSigningBonusModel.findById(reviewDto.employeeSigningBonusId);
        if (!bonus) {
            const totalCount = await this.employeeSigningBonusModel.countDocuments();
            const pendingCount = await this.employeeSigningBonusModel.countDocuments({ status: payroll_execution_enum_1.BonusStatus.PENDING });
            console.error(`[Review Signing Bonus] Signing bonus not found. ID: ${reviewDto.employeeSigningBonusId}, Total employee signing bonuses in DB: ${totalCount}, Pending: ${pendingCount}`);
            try {
                const configCheck = await this.payrollConfigurationService.findOneSigningBonus(reviewDto.employeeSigningBonusId);
                if (configCheck) {
                    throw new Error(`The ID ${reviewDto.employeeSigningBonusId} belongs to a signing bonus CONFIGURATION (from 'signingbonus' collection), not an employee signing bonus record. You need to use an ID from the 'employeesigningbonus' collection. Please call 'POST /api/v1/payroll/process-signing-bonuses' first to create employee signing bonus records, then use one of those IDs.`);
                }
            }
            catch (error) {
            }
            if (totalCount === 0) {
                throw new Error(`No employee signing bonuses exist in the system. The ID you provided (${reviewDto.employeeSigningBonusId}) was not found in the 'employeesigningbonus' collection. Please call 'POST /api/v1/payroll/process-signing-bonuses' endpoint first to create signing bonuses for eligible employees (those hired within the last 30 days with matching position configurations).`);
            }
            else {
                const examples = await this.employeeSigningBonusModel.find().limit(5).select('_id employeeId status').populate('employeeId', 'fullName employeeNumber').exec();
                const exampleDetails = examples.map(b => {
                    const emp = b.employeeId;
                    return `${b._id.toString()} (Employee: ${emp?.fullName || emp?.employeeNumber || 'N/A'}, Status: ${b.status})`;
                }).join('; ');
                throw new Error(`Employee signing bonus not found with ID: ${reviewDto.employeeSigningBonusId}. Available employee signing bonus IDs (examples): ${exampleDetails}. Please use a valid employee signing bonus ID from the 'process-signing-bonuses' response.`);
            }
        }
        console.log(`[Review Signing Bonus] Found signing bonus. Current status: ${bonus.status}, Updating to: ${reviewDto.status}`);
        bonus.status = reviewDto.status;
        if (reviewDto.paymentDate) {
            bonus.paymentDate = new Date(reviewDto.paymentDate);
        }
        bonus.updatedBy = currentUserId;
        const savedBonus = await bonus.save();
        console.log(`[Review Signing Bonus] Signing bonus updated successfully. New status: ${savedBonus.status}`);
        return savedBonus;
    }
    async editSigningBonus(editDto, currentUserId) {
        const bonus = await this.employeeSigningBonusModel.findById(editDto.employeeSigningBonusId);
        if (!bonus)
            throw new Error('Signing bonus not found');
        const employeeId = bonus.employeeId;
        const bonusCreatedAt = bonus.createdAt;
        if (employeeId && bonusCreatedAt) {
            const lockedPayrolls = await this.payrollRunModel
                .find({
                status: payroll_execution_enum_1.PayRollStatus.LOCKED,
            })
                .exec();
            for (const lockedPayroll of lockedPayrolls) {
                const payrollDetails = await this.employeePayrollDetailsModel
                    .findOne({
                    employeeId: employeeId,
                    payrollRunId: lockedPayroll._id,
                })
                    .exec();
                if (payrollDetails) {
                    const payrollPeriod = lockedPayroll.payrollPeriod;
                    if (payrollPeriod) {
                        const periodEnd = new Date(payrollPeriod);
                        periodEnd.setHours(23, 59, 59, 999);
                        if (new Date(bonusCreatedAt) <= periodEnd) {
                            throw new Error(`Cannot edit signing bonus. This bonus is part of a locked payroll run (RunId: ${lockedPayroll.runId}, Period: ${payrollPeriod.toISOString().split('T')[0]}). ` +
                                `Please unlock the payroll run first if you need to make changes.`);
                        }
                    }
                }
            }
        }
        if (editDto.signingBonusId) {
            bonus.signingBonusId = new mongoose.Types.ObjectId(editDto.signingBonusId);
            try {
                const newConfig = await this.payrollConfigurationService.findOneSigningBonus(editDto.signingBonusId);
                if (newConfig && newConfig.amount) {
                    if (editDto.givenAmount === undefined) {
                        bonus.givenAmount = newConfig.amount;
                    }
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.warn(`Signing bonus config ${editDto.signingBonusId} not found: ${errorMessage}`);
            }
        }
        if (editDto.status) {
            bonus.status = editDto.status;
        }
        if (editDto.paymentDate) {
            bonus.paymentDate = new Date(editDto.paymentDate);
        }
        if (editDto.givenAmount !== undefined) {
            if (editDto.givenAmount < 0) {
                throw new Error('givenAmount cannot be negative');
            }
            bonus.givenAmount = editDto.givenAmount;
        }
        bonus.updatedBy = currentUserId;
        return await bonus.save();
    }
    async processTerminationResignationBenefits(currentUserId) {
        const TerminationRequestModel = this.payrollRunModel.db.model(termination_request_schema_1.TerminationRequest.name);
        const approvedTerminations = await TerminationRequestModel.find({
            status: termination_status_enum_1.TerminationStatus.APPROVED,
        }).exec();
        const processedBenefits = [];
        for (const termination of approvedTerminations) {
            const existingBenefit = await this.employeeTerminationResignationModel.findOne({
                terminationId: termination._id,
            });
            if (existingBenefit) {
                continue;
            }
            const benefitsResult = await this.payrollConfigurationService.findAllTerminationBenefits({
                status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
                limit: 1000
            });
            const benefits = benefitsResult?.data || [];
            for (const benefit of benefits) {
                const benefitData = benefit;
                const employeeBenefit = new this.employeeTerminationResignationModel({
                    employeeId: termination.employeeId,
                    benefitId: benefitData._id,
                    givenAmount: benefitData.amount,
                    terminationId: termination._id,
                    status: payroll_execution_enum_1.BenefitStatus.PENDING,
                    createdBy: currentUserId,
                    updatedBy: currentUserId,
                });
                await employeeBenefit.save();
                processedBenefits.push(employeeBenefit);
            }
        }
        return processedBenefits;
    }
    async createEmployeeTerminationBenefit(createDto, currentUserId) {
        const employee = await this.employeeProfileService.findOne(createDto.employeeId);
        if (!employee) {
            throw new Error(`Employee not found with ID: ${createDto.employeeId}`);
        }
        const benefitConfig = await this.payrollConfigurationService.findOneTerminationBenefit(createDto.benefitId);
        if (!benefitConfig) {
            throw new Error(`Termination benefit configuration not found with ID: ${createDto.benefitId}`);
        }
        const TerminationRequestModel = this.payrollRunModel.db.model(termination_request_schema_1.TerminationRequest.name);
        const terminationRequest = await TerminationRequestModel.findById(createDto.terminationId).exec();
        if (!terminationRequest) {
            throw new Error(`Termination request not found with ID: ${createDto.terminationId}`);
        }
        const existingBenefit = await this.employeeTerminationResignationModel.findOne({
            employeeId: new mongoose.Types.ObjectId(createDto.employeeId),
            benefitId: new mongoose.Types.ObjectId(createDto.benefitId),
            terminationId: new mongoose.Types.ObjectId(createDto.terminationId)
        });
        if (existingBenefit) {
            throw new Error(`Termination benefit already exists for this employee, benefit configuration, and termination request. Use edit-termination-benefit endpoint instead. Existing ID: ${existingBenefit._id}`);
        }
        const employeeBenefit = new this.employeeTerminationResignationModel({
            employeeId: new mongoose.Types.ObjectId(createDto.employeeId),
            benefitId: new mongoose.Types.ObjectId(createDto.benefitId),
            terminationId: new mongoose.Types.ObjectId(createDto.terminationId),
            givenAmount: createDto.givenAmount,
            status: createDto.status || payroll_execution_enum_1.BenefitStatus.PENDING,
            createdBy: currentUserId,
            updatedBy: currentUserId
        });
        const savedBenefit = await employeeBenefit.save();
        console.log(`[Create Termination Benefit] Created employee termination benefit: ${savedBenefit._id} for employee: ${createDto.employeeId}`);
        return savedBenefit;
    }
    async reviewTerminationBenefit(reviewDto, currentUserId) {
        if (!mongoose.Types.ObjectId.isValid(reviewDto.employeeTerminationResignationId)) {
            throw new Error(`Invalid termination benefit ID format: ${reviewDto.employeeTerminationResignationId}`);
        }
        console.log(`[Review Termination Benefit] Looking for termination benefit with ID: ${reviewDto.employeeTerminationResignationId}`);
        const benefit = await this.employeeTerminationResignationModel.findById(reviewDto.employeeTerminationResignationId);
        if (!benefit) {
            const totalCount = await this.employeeTerminationResignationModel.countDocuments();
            const pendingCount = await this.employeeTerminationResignationModel.countDocuments({ status: payroll_execution_enum_1.BenefitStatus.PENDING });
            console.error(`[Review Termination Benefit] Termination benefit not found. ID: ${reviewDto.employeeTerminationResignationId}, Total termination benefits in DB: ${totalCount}, Pending: ${pendingCount}`);
            try {
                const configCheck = await this.payrollConfigurationService.findOneTerminationBenefit(reviewDto.employeeTerminationResignationId);
                if (configCheck) {
                    throw new Error(`The ID ${reviewDto.employeeTerminationResignationId} belongs to a termination benefit CONFIGURATION (from 'terminationandresignationbenefits' collection), not an employee termination benefit record. You need to use an ID from the 'employeeterminationresignations' collection. Please call 'POST /api/v1/payroll/process-termination-benefits' first to create employee termination benefit records, then use one of those IDs.`);
                }
            }
            catch (error) {
            }
            if (totalCount === 0) {
                throw new Error(`No employee termination benefits exist in the system. The ID you provided (${reviewDto.employeeTerminationResignationId}) was not found in the 'employeeterminationresignations' collection. Please call 'POST /api/v1/payroll/process-termination-benefits' endpoint first to create termination benefits for eligible employees (those with approved termination requests).`);
            }
            else {
                const examples = await this.employeeTerminationResignationModel.find().limit(5).select('_id employeeId status').populate('employeeId', 'fullName employeeNumber').exec();
                const exampleDetails = examples.map(b => {
                    const emp = b.employeeId;
                    return `${b._id.toString()} (Employee: ${emp?.fullName || emp?.employeeNumber || 'N/A'}, Status: ${b.status})`;
                }).join('; ');
                throw new Error(`Employee termination benefit not found with ID: ${reviewDto.employeeTerminationResignationId}. Available employee termination benefit IDs (examples): ${exampleDetails}. Please use a valid employee termination benefit ID from the 'process-termination-benefits' response.`);
            }
        }
        console.log(`[Review Termination Benefit] Found termination benefit. Current status: ${benefit.status}, Updating to: ${reviewDto.status}`);
        benefit.status = reviewDto.status;
        benefit.updatedBy = currentUserId;
        const savedBenefit = await benefit.save();
        console.log(`[Review Termination Benefit] Termination benefit updated successfully. New status: ${savedBenefit.status}`);
        return savedBenefit;
    }
    async editTerminationBenefit(editDto, currentUserId) {
        const benefit = await this.employeeTerminationResignationModel.findById(editDto.employeeTerminationResignationId);
        if (!benefit)
            throw new Error('Termination benefit not found');
        const employeeId = benefit.employeeId;
        const benefitCreatedAt = benefit.createdAt;
        if (employeeId && benefitCreatedAt) {
            const lockedPayrolls = await this.payrollRunModel
                .find({
                status: payroll_execution_enum_1.PayRollStatus.LOCKED,
            })
                .exec();
            for (const lockedPayroll of lockedPayrolls) {
                const payrollDetails = await this.employeePayrollDetailsModel
                    .findOne({
                    employeeId: employeeId,
                    payrollRunId: lockedPayroll._id,
                })
                    .exec();
                if (payrollDetails) {
                    const payrollPeriod = lockedPayroll.payrollPeriod;
                    if (payrollPeriod) {
                        const periodEnd = new Date(payrollPeriod);
                        periodEnd.setHours(23, 59, 59, 999);
                        if (new Date(benefitCreatedAt) <= periodEnd) {
                            throw new Error(`Cannot edit termination benefit. This benefit is part of a locked payroll run (RunId: ${lockedPayroll.runId}, Period: ${payrollPeriod.toISOString().split('T')[0]}). ` +
                                `Please unlock the payroll run first if you need to make changes.`);
                        }
                    }
                }
            }
        }
        if (editDto.benefitId) {
            benefit.benefitId = new mongoose.Types.ObjectId(editDto.benefitId);
            try {
                const newConfig = await this.payrollConfigurationService.findOneTerminationBenefit(editDto.benefitId);
                if (newConfig && newConfig.amount) {
                    if (editDto.givenAmount === undefined) {
                        benefit.givenAmount = newConfig.amount;
                    }
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.warn(`Termination benefit config ${editDto.benefitId} not found: ${errorMessage}`);
            }
        }
        if (editDto.terminationId) {
            benefit.terminationId = new mongoose.Types.ObjectId(editDto.terminationId);
        }
        if (editDto.givenAmount !== undefined) {
            if (editDto.givenAmount < 0) {
                throw new Error('givenAmount cannot be negative');
            }
            benefit.givenAmount = editDto.givenAmount;
        }
        benefit.updatedBy = currentUserId;
        return await benefit.save();
    }
    async calculatePayroll(employeeId, payrollRunId, baseSalary, currentUserId) {
        const employee = await this.employeeProfileService.findOne(employeeId);
        if (!employee)
            throw new Error('Employee not found');
        let actualBaseSalary = undefined;
        let baseSalarySource = 'none';
        if (employee.payGradeId) {
            try {
                const payGradeData = await this.payrollConfigurationService.findOnePayGrade(employee.payGradeId.toString());
                if (payGradeData) {
                    if (payGradeData.status === payroll_configuration_enums_1.ConfigStatus.APPROVED) {
                        if (payGradeData.baseSalary && payGradeData.baseSalary > 0) {
                            actualBaseSalary = payGradeData.baseSalary;
                            baseSalarySource = 'paygrade';
                        }
                        else {
                            await this.flagPayrollException(payrollRunId, 'INVALID_PAYGRADE_SALARY', `PayGrade ${employee.payGradeId} has invalid baseSalary (${payGradeData.baseSalary}) for employee ${employeeId}`, currentUserId, employeeId);
                        }
                    }
                    else {
                        await this.flagPayrollException(payrollRunId, 'PAYGRADE_NOT_APPROVED', `PayGrade ${employee.payGradeId} is not approved (status: ${payGradeData.status}) for employee ${employeeId}. Cannot use baseSalary from PayGrade.`, currentUserId, employeeId);
                    }
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                await this.flagPayrollException(payrollRunId, 'PAYGRADE_NOT_FOUND', `PayGrade ${employee.payGradeId} not found or error fetching for employee ${employeeId}: ${errorMessage}`, currentUserId, employeeId);
                console.warn(`PayGrade ${employee.payGradeId} not found for employee ${employeeId}: ${errorMessage}`);
            }
        }
        else {
            await this.flagPayrollException(payrollRunId, 'NO_PAYGRADE_ASSIGNED', `Employee ${employeeId} has no PayGrade assigned. Cannot automatically retrieve baseSalary.`, currentUserId, employeeId);
        }
        if (baseSalary !== undefined && baseSalary !== null && baseSalary > 0) {
            if (actualBaseSalary !== undefined &&
                actualBaseSalary > 0 &&
                baseSalary !== actualBaseSalary) {
                await this.flagPayrollException(payrollRunId, 'BASE_SALARY_OVERRIDE', `Base salary override: Provided ${baseSalary} differs from PayGrade baseSalary ${actualBaseSalary} for employee ${employeeId}`, currentUserId, employeeId);
            }
            actualBaseSalary = baseSalary;
            baseSalarySource = 'provided';
        }
        if (!actualBaseSalary || actualBaseSalary <= 0) {
            actualBaseSalary = 0;
            await this.flagPayrollException(payrollRunId, 'MISSING_BASE_SALARY', `No valid baseSalary found for employee ${employeeId}. PayGrade: ${employee.payGradeId ? employee.payGradeId.toString() : 'none'}, Provided: ${baseSalary || 'none'}`, currentUserId, employeeId);
        }
        const payrollRun = await this.payrollRunModel.findById(payrollRunId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        const isNewHire = await this.checkNewHire(employeeId);
        const terminationInfo = await this.getTerminationInfo(employeeId);
        const isTerminated = !!terminationInfo;
        const isResigned = await this.checkResignation(employeeId);
        const payrollPeriodEnd = new Date(payrollRun.payrollPeriod);
        const payrollPeriodStart = new Date(payrollPeriodEnd.getFullYear(), payrollPeriodEnd.getMonth(), 1);
        const payrollPeriodEndDate = new Date(payrollPeriodEnd.getFullYear(), payrollPeriodEnd.getMonth() + 1, 0);
        const periodStart = new Date(payrollPeriodStart);
        periodStart.setHours(0, 0, 0, 0);
        const periodEnd = new Date(payrollPeriodEndDate);
        periodEnd.setHours(23, 59, 59, 999);
        let needsProration = false;
        let startDate = new Date(periodStart);
        let endDate = new Date(periodEnd);
        if (employee.dateOfHire) {
            const hireDate = new Date(employee.dateOfHire);
            hireDate.setHours(0, 0, 0, 0);
            if (hireDate > periodStart && hireDate <= periodEnd) {
                needsProration = true;
                startDate = hireDate;
            }
        }
        if (terminationInfo && terminationInfo.terminationDate) {
            const terminationDate = new Date(terminationInfo.terminationDate);
            terminationDate.setHours(23, 59, 59, 999);
            if (terminationDate >= periodStart && terminationDate < periodEnd) {
                needsProration = true;
                endDate = terminationDate;
            }
        }
        if (needsProration && actualBaseSalary > 0) {
            try {
                actualBaseSalary = await this.calculateProratedSalary(employeeId, actualBaseSalary, startDate, endDate, payrollPeriodEndDate, currentUserId);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`Error calculating prorated salary for employee ${employeeId}: ${errorMessage}`);
                await this.flagPayrollException(payrollRunId, 'PRORATION_ERROR', `Failed to calculate prorated salary for employee ${employeeId}: ${errorMessage}`, currentUserId, employeeId);
            }
        }
        const allowancesResult = await this.payrollConfigurationService.findAllAllowances({
            status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
            limit: 1000
        });
        const applicableAllowances = await this.getApplicableAllowancesForEmployee(employee, allowancesResult?.data || []);
        let totalAllowances = 0;
        for (const allowance of applicableAllowances) {
            totalAllowances += allowance.amount || 0;
        }
        const grossSalary = actualBaseSalary + totalAllowances;
        const statutoryBreakdown = await this.applyStatutoryRulesWithBreakdown(actualBaseSalary, employeeId);
        const statutoryDeductions = statutoryBreakdown.total;
        const penaltiesBreakdown = await this.calculatePenaltiesWithBreakdown(employeeId, payrollRunId);
        const penalties = penaltiesBreakdown.total;
        const refunds = await this.calculateRefunds(employeeId, payrollRunId);
        const netSalary = grossSalary - statutoryDeductions;
        const netPay = netSalary - penalties + refunds;
        const bankStatus = employee.bankAccountNumber ? 'valid' : 'missing';
        const deductionsBreakdown = {
            taxes: statutoryBreakdown.taxes,
            insurance: statutoryBreakdown.insurance,
            timeManagementPenalties: penaltiesBreakdown.timeManagementPenalties,
            unpaidLeavePenalties: penaltiesBreakdown.unpaidLeavePenalties,
            total: statutoryDeductions + penalties,
        };
        const payrollRunForCurrency = await this.payrollRunModel.findById(payrollRunId);
        const currency = payrollRunForCurrency
            ? this.getPayrollRunCurrency(payrollRunForCurrency)
            : 'USD';
        const breakdownJson = JSON.stringify({
            deductionsBreakdown,
            currency: currency,
            timestamp: new Date().toISOString(),
            exceptionMessages: [],
            exceptionHistory: [],
        });
        const payrollDetails = new this.employeePayrollDetailsModel({
            employeeId: new mongoose.Types.ObjectId(employeeId),
            payrollRunId: new mongoose.Types.ObjectId(payrollRunId),
            baseSalary: actualBaseSalary,
            allowances: totalAllowances,
            deductions: statutoryDeductions + penalties,
            netSalary,
            netPay: Math.max(0, netPay),
            bankStatus: bankStatus,
            exceptions: breakdownJson,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return await payrollDetails.save();
    }
    async checkNewHire(employeeId) {
        try {
            const employee = await this.employeeProfileService.findOne(employeeId);
            if (!employee)
                return false;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return employee.dateOfHire >= thirtyDaysAgo;
        }
        catch (error) {
            return false;
        }
    }
    async getTerminationInfo(employeeId) {
        const TerminationRequestModel = this.payrollRunModel.db.model(termination_request_schema_1.TerminationRequest.name);
        const termination = await TerminationRequestModel.findOne({
            employeeId: new mongoose.Types.ObjectId(employeeId),
            status: termination_status_enum_1.TerminationStatus.APPROVED,
        }).sort({ createdAt: -1 });
        return termination;
    }
    async checkTermination(employeeId) {
        const termination = await this.getTerminationInfo(employeeId);
        return !!termination;
    }
    async checkResignation(employeeId) {
        const TerminationRequestModel = this.payrollRunModel.db.model(termination_request_schema_1.TerminationRequest.name);
        const resignation = await TerminationRequestModel.findOne({
            employeeId: new mongoose.Types.ObjectId(employeeId),
            status: termination_status_enum_1.TerminationStatus.APPROVED,
        });
        return !!resignation;
    }
    async calculatePenalties(employeeId, payrollRunId) {
        const breakdown = await this.calculatePenaltiesWithBreakdown(employeeId, payrollRunId);
        return breakdown.total;
    }
    async calculatePenaltiesWithBreakdown(employeeId, payrollRunId) {
        const payrollRun = await this.payrollRunModel.findById(payrollRunId);
        if (!payrollRun) {
            throw new Error('Payroll run not found');
        }
        const employee = await this.employeeProfileService.findOne(employeeId);
        if (!employee) {
            throw new Error('Employee not found');
        }
        let baseSalary = 0;
        if (employee.payGradeId) {
            try {
                const payGradeDoc = await this.payrollConfigurationService.findOnePayGrade(employee.payGradeId.toString());
                if (payGradeDoc && payGradeDoc.status === payroll_configuration_enums_1.ConfigStatus.APPROVED) {
                    baseSalary = payGradeDoc.baseSalary || 0;
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.warn(`Could not fetch PayGrade for employee ${employeeId}: ${errorMessage}`);
            }
        }
        const dailyRate = baseSalary > 0 ? baseSalary / 30 : 0;
        const hourlyRate = baseSalary > 0 ? baseSalary / 240 : 0;
        let timeManagementPenalties = 0;
        let unpaidLeavePenalties = 0;
        try {
            const payrollPeriod = new Date(payrollRun.payrollPeriod);
            const year = payrollPeriod.getFullYear();
            const month = payrollPeriod.getMonth();
            const periodStart = new Date(year, month, 1);
            const periodEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
            const leaveRequests = await this.leavesService.getPastLeaveRequests(employeeId, {
                fromDate: periodStart,
                toDate: periodEnd,
                status: leave_status_enum_1.LeaveStatus.APPROVED,
            });
            const uniqueLeaveTypeIds = [
                ...new Set(leaveRequests.map((lr) => lr.leaveTypeId)),
            ];
            const LeaveTypeModel = this.payrollRunModel.db.model('LeaveType');
            const leaveTypes = await LeaveTypeModel.find({
                _id: {
                    $in: uniqueLeaveTypeIds.map((id) => new mongoose.Types.ObjectId(id)),
                },
            }).exec();
            const leaveTypePaidMap = new Map();
            for (const leaveType of leaveTypes) {
                const lt = leaveType;
                leaveTypePaidMap.set(lt._id.toString(), lt.paid !== false);
            }
            for (const leaveRequest of leaveRequests) {
                const leaveTypeId = leaveRequest.leaveTypeId?.toString() || leaveRequest.leaveTypeId;
                const isPaid = leaveTypePaidMap.get(leaveTypeId);
                if (isPaid === false) {
                    const durationDays = leaveRequest.durationDays || 0;
                    const penalty = dailyRate * durationDays;
                    unpaidLeavePenalties += penalty;
                }
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.warn(`Error calculating unpaid leave penalties for employee ${employeeId}: ${errorMessage}`);
        }
        try {
            const payrollPeriod = new Date(payrollRun.payrollPeriod);
            const year = payrollPeriod.getFullYear();
            const month = payrollPeriod.getMonth();
            const periodStart = new Date(year, month, 1);
            const periodEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
            const AttendanceRecordModel = this.payrollRunModel.db.model('AttendanceRecord');
            const TimeExceptionModel = this.payrollRunModel.db.model('TimeException');
            const attendanceRecords = await AttendanceRecordModel.find({
                employeeId: new mongoose.Types.ObjectId(employeeId),
                finalisedForPayroll: true,
            }).exec();
            const timeExceptions = await TimeExceptionModel.find({
                employeeId: new mongoose.Types.ObjectId(employeeId),
                status: {
                    $in: [index_1.TimeExceptionStatus.APPROVED, index_1.TimeExceptionStatus.RESOLVED],
                },
                type: {
                    $in: [
                        index_1.TimeExceptionType.LATE,
                        index_1.TimeExceptionType.EARLY_LEAVE,
                        index_1.TimeExceptionType.SHORT_TIME,
                        index_1.TimeExceptionType.MISSED_PUNCH,
                    ],
                },
            }).exec();
            for (const exception of timeExceptions) {
                const exceptionData = exception;
                const exceptionType = exceptionData.type;
                const attendanceRecord = attendanceRecords.find((ar) => ar._id.toString() === exceptionData.attendanceRecordId?.toString());
                if (attendanceRecord) {
                    let penaltyHours = 0;
                    if (exceptionType === index_1.TimeExceptionType.MISSED_PUNCH) {
                        penaltyHours = 4;
                    }
                    else if ([
                        index_1.TimeExceptionType.LATE,
                        index_1.TimeExceptionType.EARLY_LEAVE,
                        index_1.TimeExceptionType.SHORT_TIME,
                    ].includes(exceptionType)) {
                        penaltyHours = 1;
                    }
                    const penalty = hourlyRate * penaltyHours;
                    timeManagementPenalties += penalty;
                }
            }
            for (const attendanceRecord of attendanceRecords) {
                const record = attendanceRecord;
                const totalWorkMinutes = record.totalWorkMinutes || 0;
                const expectedWorkMinutes = 8 * 60;
                if (totalWorkMinutes < expectedWorkMinutes * 0.5) {
                    const missingMinutes = expectedWorkMinutes - totalWorkMinutes;
                    const missingHours = missingMinutes / 60;
                    const penalty = hourlyRate * missingHours;
                    timeManagementPenalties += penalty;
                }
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.warn(`Error calculating time management penalties for employee ${employeeId}: ${errorMessage}`);
        }
        const total = timeManagementPenalties + unpaidLeavePenalties;
        return {
            total: Math.round(total * 100) / 100,
            timeManagementPenalties: Math.round(timeManagementPenalties * 100) / 100,
            unpaidLeavePenalties: Math.round(unpaidLeavePenalties * 100) / 100,
        };
    }
    async getApplicableAllowancesForEmployee(employee, allAllowances) {
        if (!employee || !allAllowances || allAllowances.length === 0) {
            return [];
        }
        const employeePosition = employee.primaryPositionId;
        const employeeDepartment = employee.primaryDepartmentId;
        const employeePayGrade = employee.payGradeId;
        const employeeContractType = employee.contractType;
        const employeeWorkType = employee.workType;
        let positionTitle = '';
        let departmentName = '';
        let payGradeGrade = '';
        if (employeePosition) {
            if (typeof employeePosition === 'object' && employeePosition !== null) {
                positionTitle = (employeePosition.title || '')
                    .toLowerCase()
                    .trim();
            }
            else if (typeof employeePosition === 'string') {
                positionTitle = '';
            }
        }
        if (employeeDepartment) {
            if (typeof employeeDepartment === 'object' &&
                employeeDepartment !== null) {
                departmentName = (employeeDepartment.name || '')
                    .toLowerCase()
                    .trim();
            }
            else if (typeof employeeDepartment === 'string') {
                departmentName = '';
            }
        }
        if (employeePayGrade) {
            if (typeof employeePayGrade === 'object' && employeePayGrade !== null) {
                payGradeGrade = (employeePayGrade.grade || '')
                    .toLowerCase()
                    .trim();
            }
            else if (typeof employeePayGrade === 'string') {
                payGradeGrade = '';
            }
        }
        const contractTypeStr = employeeContractType
            ? String(employeeContractType).toLowerCase().trim()
            : '';
        const workTypeStr = employeeWorkType
            ? String(employeeWorkType).toLowerCase().trim()
            : '';
        const universalAllowanceKeywords = [
            'housing',
            'transport',
            'transportation',
            'communication',
            'meal',
            'meals',
            'uniform',
            'medical',
            'health',
            'insurance',
            'benefit',
            'general',
        ];
        const positionKeywords = [
            'manager',
            'director',
            'executive',
            'supervisor',
            'lead',
            'senior',
            'junior',
            'assistant',
            'officer',
            'specialist',
            'analyst',
            'coordinator',
            'administrator',
            'chief',
            'head',
            'vice',
            'president',
            'ceo',
            'cto',
            'cfo',
        ];
        const departmentKeywords = [
            'sales',
            'marketing',
            'hr',
            'human resources',
            'finance',
            'accounting',
            'it',
            'information technology',
            'operations',
            'production',
            'engineering',
            'research',
            'development',
            'r&d',
            'legal',
            'compliance',
            'quality',
            'qa',
        ];
        const contractTypeKeywords = [
            'contract',
            'permanent',
            'temporary',
            'part-time',
            'full-time',
            'freelance',
        ];
        const workTypeKeywords = [
            'remote',
            'hybrid',
            'onsite',
            'office',
            'field',
            'travel',
        ];
        const applicableAllowances = [];
        for (const allowance of allAllowances) {
            if (!allowance || !allowance.name) {
                continue;
            }
            const allowanceName = String(allowance.name).toLowerCase().trim();
            if (!allowanceName) {
                continue;
            }
            let isApplicable = false;
            const isUniversal = universalAllowanceKeywords.some((keyword) => allowanceName.includes(keyword));
            if (isUniversal) {
                isApplicable = true;
            }
            else {
                if (positionTitle) {
                    const positionMatch = positionKeywords.some((keyword) => {
                        const allowanceHasKeyword = allowanceName.includes(keyword);
                        const positionHasKeyword = positionTitle.includes(keyword);
                        return allowanceHasKeyword && positionHasKeyword;
                    });
                    if (positionMatch) {
                        isApplicable = true;
                    }
                }
                if (!isApplicable && departmentName) {
                    const departmentMatch = departmentKeywords.some((keyword) => {
                        const allowanceHasKeyword = allowanceName.includes(keyword);
                        const departmentHasKeyword = departmentName.includes(keyword);
                        return allowanceHasKeyword && departmentHasKeyword;
                    });
                    if (departmentMatch) {
                        isApplicable = true;
                    }
                }
                if (!isApplicable && payGradeGrade) {
                    if (allowanceName.includes('grade')) {
                        const payGradeParts = payGradeGrade
                            .split(' ')
                            .filter((p) => p.length > 0);
                        const gradeMatch = payGradeParts.some((part) => allowanceName.includes(part)) ||
                            allowanceName.includes(payGradeGrade);
                        if (gradeMatch) {
                            isApplicable = true;
                        }
                    }
                }
                if (!isApplicable && contractTypeStr) {
                    const contractMatch = contractTypeKeywords.some((keyword) => {
                        const allowanceHasKeyword = allowanceName.includes(keyword);
                        const contractHasKeyword = contractTypeStr.includes(keyword);
                        return allowanceHasKeyword && contractHasKeyword;
                    });
                    if (contractMatch) {
                        isApplicable = true;
                    }
                }
                if (!isApplicable && workTypeStr) {
                    const workTypeMatch = workTypeKeywords.some((keyword) => {
                        const allowanceHasKeyword = allowanceName.includes(keyword);
                        const workTypeHasKeyword = workTypeStr.includes(keyword);
                        return allowanceHasKeyword && workTypeHasKeyword;
                    });
                    if (workTypeMatch) {
                        isApplicable = true;
                    }
                }
                if (!isApplicable) {
                    const hasPositionKeyword = positionKeywords.some((kw) => allowanceName.includes(kw));
                    const hasDepartmentKeyword = departmentKeywords.some((kw) => allowanceName.includes(kw));
                    const hasContractKeyword = contractTypeKeywords.some((kw) => allowanceName.includes(kw));
                    const hasWorkTypeKeyword = workTypeKeywords.some((kw) => allowanceName.includes(kw));
                    const hasPayGradeKeyword = allowanceName.includes('grade');
                    if (hasPositionKeyword ||
                        hasDepartmentKeyword ||
                        hasContractKeyword ||
                        hasWorkTypeKeyword ||
                        hasPayGradeKeyword) {
                        isApplicable = false;
                    }
                    else {
                        isApplicable = true;
                    }
                }
            }
            if (isApplicable) {
                applicableAllowances.push(allowance);
            }
        }
        return applicableAllowances.length > 0
            ? applicableAllowances
            : allAllowances;
    }
    async calculateRefunds(employeeId, payrollRunId) {
        try {
            const refunds = await this.payrollTrackingService.getRefundsByEmployeeId(employeeId);
            if (!refunds || refunds.length === 0) {
                return 0;
            }
            let totalRefunds = 0;
            for (const refund of refunds) {
                const refundData = refund;
                const isPending = refundData.status === payroll_tracking_enum_1.RefundStatus.PENDING ||
                    refundData.status === 'pending';
                const notPaid = !refundData.paidInPayrollRunId;
                if (isPending && notPaid) {
                    if (refundData.refundDetails && refundData.refundDetails.amount) {
                        const amount = Number(refundData.refundDetails.amount);
                        if (!isNaN(amount) && amount > 0) {
                            totalRefunds += amount;
                        }
                    }
                }
            }
            return Math.round(totalRefunds * 100) / 100;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.warn(`Error fetching refunds for employee ${employeeId}: ${errorMessage}`);
            return 0;
        }
    }
    async calculateProratedSalary(employeeId, baseSalary, startDate, endDate, payrollPeriodEnd, currentUserId) {
        if (baseSalary <= 0) {
            return 0;
        }
        if (startDate > endDate) {
            throw new Error(`Invalid date range: startDate (${startDate}) cannot be after endDate (${endDate})`);
        }
        const daysInMonth = new Date(payrollPeriodEnd.getFullYear(), payrollPeriodEnd.getMonth() + 1, 0).getDate();
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysWorked = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        const actualDaysWorked = Math.min(daysWorked, daysInMonth);
        const proratedSalary = (baseSalary / daysInMonth) * actualDaysWorked;
        return Math.round(proratedSalary * 100) / 100;
    }
    async applyStatutoryRules(baseSalary, employeeId, currentUserId) {
        const breakdown = await this.applyStatutoryRulesWithBreakdown(baseSalary, employeeId);
        return breakdown.total;
    }
    async applyStatutoryRulesWithBreakdown(baseSalary, employeeId) {
        if (!baseSalary || baseSalary < 0) {
            throw new Error('Base salary must be a positive number');
        }
        let totalTaxes = 0;
        let totalInsurance = 0;
        const taxRulesResult = await this.payrollConfigurationService.findAllTaxRules({
            status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
            limit: 1000
        });
        for (const rule of taxRulesResult?.data || []) {
            const ruleData = rule;
            if (ruleData.rate && ruleData.rate > 0) {
                const taxAmount = (baseSalary * ruleData.rate) / 100;
                totalTaxes += taxAmount;
            }
        }
        const insuranceRulesResult = await this.payrollConfigurationService.findAllInsuranceBrackets({
            status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
            limit: 1000
        });
        for (const rule of insuranceRulesResult?.data || []) {
            const ruleData = rule;
            if (baseSalary >= ruleData.minSalary &&
                (ruleData.maxSalary === null ||
                    ruleData.maxSalary === undefined ||
                    baseSalary <= ruleData.maxSalary)) {
                if (ruleData.employeeRate && ruleData.employeeRate > 0) {
                    const insuranceAmount = (baseSalary * ruleData.employeeRate) / 100;
                    totalInsurance += insuranceAmount;
                }
            }
        }
        const total = totalTaxes + totalInsurance;
        return {
            total: Math.round(total * 100) / 100,
            taxes: Math.round(totalTaxes * 100) / 100,
            insurance: Math.round(totalInsurance * 100) / 100,
        };
    }
    async generateDraftPayrollRun(payrollPeriod, entity, payrollSpecialistId, currency, currentUserId, payrollManagerId) {
        if (!payrollPeriod || !entity || !payrollSpecialistId) {
            throw new Error('Payroll period, entity, and payroll specialist ID are required');
        }
        if (!(payrollPeriod instanceof Date) || isNaN(payrollPeriod.getTime())) {
            throw new Error('Invalid payroll period. Must be a valid date.');
        }
        await this.validatePayrollPeriodAgainstContracts(payrollPeriod);
        const year = payrollPeriod.getFullYear();
        const month = payrollPeriod.getMonth();
        const periodStart = new Date(year, month, 1);
        const periodEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
        const existingRun = await this.payrollRunModel.findOne({
            payrollPeriod: {
                $gte: periodStart,
                $lte: periodEnd,
            },
            status: { $ne: payroll_execution_enum_1.PayRollStatus.REJECTED },
        });
        if (existingRun) {
            throw new Error(`Payroll run already exists for period ${year}-${String(month + 1).padStart(2, '0')}. Existing runId: ${existingRun.runId}`);
        }
        const validationResult = await this.validatePreInitiationRequirements();
        if (!validationResult.isValid) {
            throw new Error(validationResult.errorMessage);
        }
        const employeesResult = await this.employeeProfileService.findAll({
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
            page: 1,
            limit: 10000,
        });
        const activeEmployees = Array.isArray(employeesResult)
            ? employeesResult
            : employeesResult.data || [];
        if (activeEmployees.length === 0) {
            throw new Error('No active employees found. Cannot generate draft payroll run.');
        }
        const count = await this.payrollRunModel.countDocuments({
            payrollPeriod: {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1),
            },
        });
        const runId = `PR-${year}-${String(count + 1).padStart(4, '0')}`;
        const { entityName } = this.extractEntityAndCurrency(entity);
        const entityWithCurrency = currency
            ? this.formatEntityWithCurrency(entityName, currency)
            : entity;
        let finalPayrollManagerId;
        if (payrollManagerId) {
            try {
                finalPayrollManagerId = new mongoose.Types.ObjectId(payrollManagerId);
            }
            catch (error) {
                throw new Error(`Invalid payrollManagerId format: ${payrollManagerId}`);
            }
        }
        else {
            const defaultManager = await this.findDefaultPayrollManager();
            if (!defaultManager) {
                throw new Error('No payroll manager found. Please provide payrollManagerId or ensure a payroll manager exists in the system.');
            }
            try {
                finalPayrollManagerId = new mongoose.Types.ObjectId(defaultManager);
            }
            catch (error) {
                throw new Error(`Invalid default payroll manager ID format: ${defaultManager}`);
            }
        }
        if (!finalPayrollManagerId) {
            throw new Error('Payroll manager ID is required but was not set.');
        }
        if (finalPayrollManagerId.toString() === payrollSpecialistId) {
            throw new Error('Payroll manager must be different from payroll specialist.');
        }
        const payrollRun = new this.payrollRunModel({
            runId,
            payrollPeriod,
            entity: entityWithCurrency,
            employees: activeEmployees.length,
            exceptions: 0,
            totalnetpay: 0,
            payrollSpecialistId: new mongoose.Types.ObjectId(payrollSpecialistId),
            payrollManagerId: finalPayrollManagerId,
            status: payroll_execution_enum_1.PayRollStatus.DRAFT,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        const savedPayrollRun = await payrollRun.save();
        try {
            await this.generateDraftDetailsForPayrollRun(savedPayrollRun._id.toString(), currentUserId);
        }
        catch (error) {
            await this.payrollRunModel.findByIdAndDelete(savedPayrollRun._id);
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to generate draft payroll details: ${errorMessage}`);
        }
        const updatedPayrollRun = await this.payrollRunModel.findById(savedPayrollRun._id);
        if (!updatedPayrollRun) {
            throw new Error('Payroll run not found after draft generation');
        }
        return updatedPayrollRun;
    }
    async generateDraftDetailsForPayrollRun(payrollRunId, currentUserId) {
        console.log(`[Draft Generation] Starting draft generation for payroll run: ${payrollRunId}`);
        console.log(`[Draft Generation] Processing signing bonuses...`);
        await this.processSigningBonuses(currentUserId);
        console.log(`[Draft Generation] Signing bonuses processed. Processing termination benefits...`);
        await this.processTerminationResignationBenefits(currentUserId);
        console.log(`[Draft Generation] Termination benefits processed.`);
        const payrollRun = await this.payrollRunModel.findById(payrollRunId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        if (payrollRun.status === payroll_execution_enum_1.PayRollStatus.LOCKED) {
            throw new Error('Cannot generate draft for locked payroll run');
        }
        console.log(`[Draft Generation] Fetching active employees...`);
        const employeesResult = await this.employeeProfileService.findAll({
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
            page: 1,
            limit: 10000,
        });
        const activeEmployees = Array.isArray(employeesResult) ? employeesResult : employeesResult.data || [];
        console.log(`[Draft Generation] Found ${activeEmployees.length} active employees.`);
        payrollRun.employees = activeEmployees.length;
        await payrollRun.save();
        console.log(`[Draft Generation] Clearing existing payroll details...`);
        await this.employeePayrollDetailsModel.deleteMany({
            payrollRunId: new mongoose.Types.ObjectId(payrollRunId),
        });
        let totalNetPay = 0;
        let exceptions = 0;
        console.log(`[Draft Generation] Starting payroll calculation for ${activeEmployees.length} employees...`);
        for (let i = 0; i < activeEmployees.length; i++) {
            const employee = activeEmployees[i];
            if ((i + 1) % 10 === 0) {
                console.log(`[Draft Generation] Processing employee ${i + 1}/${activeEmployees.length}...`);
            }
            try {
                const payrollDetails = await this.calculatePayroll(employee._id.toString(), payrollRunId, undefined, currentUserId);
                if (payrollDetails.baseSalary <= 0) {
                    exceptions++;
                    await this.flagPayrollException(payrollRunId, 'MISSING_BASE_SALARY', `Employee ${employee._id} has no PayGrade/base salary configured`, currentUserId, employee._id.toString());
                }
                const approvedSigningBonus = await this.employeeSigningBonusModel.findOne({
                    employeeId: employee._id,
                    status: payroll_execution_enum_1.BonusStatus.APPROVED,
                });
                if (approvedSigningBonus) {
                    payrollDetails.bonus = approvedSigningBonus.givenAmount;
                    payrollDetails.netPay += approvedSigningBonus.givenAmount;
                    await payrollDetails.save();
                }
                const approvedBenefits = await this.employeeTerminationResignationModel.find({
                    employeeId: employee._id,
                    status: payroll_execution_enum_1.BenefitStatus.APPROVED,
                });
                let totalBenefits = 0;
                for (const benefit of approvedBenefits) {
                    totalBenefits += benefit.givenAmount;
                }
                if (totalBenefits > 0) {
                    payrollDetails.benefit = totalBenefits;
                    payrollDetails.netPay += totalBenefits;
                    await payrollDetails.save();
                }
                totalNetPay += payrollDetails.netPay;
            }
            catch (error) {
                exceptions++;
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`[Draft Generation] Error calculating payroll for employee ${employee._id}: ${errorMessage}`);
                await this.flagPayrollException(payrollRunId, 'CALC_ERROR', `Error calculating payroll for employee ${employee._id}: ${errorMessage}`, currentUserId, employee._id.toString());
            }
        }
        console.log(`[Draft Generation] Completed payroll calculation. Total net pay: ${totalNetPay}, Exceptions: ${exceptions}`);
        payrollRun.exceptions = exceptions;
        payrollRun.totalnetpay = totalNetPay;
        await payrollRun.save();
    }
    getDeductionsBreakdown(payrollDetails) {
        if (!payrollDetails || !payrollDetails.exceptions) {
            return null;
        }
        try {
            const parsed = JSON.parse(payrollDetails.exceptions);
            if (parsed.deductionsBreakdown) {
                return parsed.deductionsBreakdown;
            }
        }
        catch (error) {
            return null;
        }
        return null;
    }
    getEmployeePayrollCurrency(payrollDetails) {
        if (!payrollDetails || !payrollDetails.exceptions) {
            return 'USD';
        }
        try {
            const parsed = JSON.parse(payrollDetails.exceptions);
            if (parsed.currency) {
                return parsed.currency;
            }
        }
        catch (error) {
        }
        return 'USD';
    }
    async getPayrollPreview(payrollRunId, targetCurrency, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(payrollRunId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        const payrollDetails = await this.employeePayrollDetailsModel
            .find({
            payrollRunId: new mongoose.Types.ObjectId(payrollRunId),
        })
            .populate('employeeId')
            .exec();
        const sourceCurrency = this.getPayrollRunCurrency(payrollRun);
        const displayCurrency = targetCurrency || sourceCurrency;
        const needsConversion = sourceCurrency !== displayCurrency;
        const enhancedDetails = payrollDetails.map((detail) => {
            const breakdown = this.getDeductionsBreakdown(detail);
            let baseSalary = detail.baseSalary;
            let allowances = detail.allowances;
            let deductions = detail.deductions;
            let netSalary = detail.netSalary;
            let netPay = detail.netPay;
            if (needsConversion) {
                baseSalary = this.convertCurrency(baseSalary, sourceCurrency, displayCurrency);
                allowances = this.convertCurrency(allowances, sourceCurrency, displayCurrency);
                deductions = this.convertCurrency(deductions, sourceCurrency, displayCurrency);
                netSalary = this.convertCurrency(netSalary, sourceCurrency, displayCurrency);
                netPay = this.convertCurrency(netPay, sourceCurrency, displayCurrency);
                if (breakdown) {
                    breakdown.taxes = this.convertCurrency(breakdown.taxes, sourceCurrency, displayCurrency);
                    breakdown.insurance = this.convertCurrency(breakdown.insurance, sourceCurrency, displayCurrency);
                    breakdown.timeManagementPenalties = this.convertCurrency(breakdown.timeManagementPenalties, sourceCurrency, displayCurrency);
                    breakdown.unpaidLeavePenalties = this.convertCurrency(breakdown.unpaidLeavePenalties, sourceCurrency, displayCurrency);
                    breakdown.total = this.convertCurrency(breakdown.total, sourceCurrency, displayCurrency);
                }
            }
            return {
                employeeId: detail.employeeId,
                baseSalary,
                allowances,
                deductions,
                deductionsBreakdown: breakdown,
                netSalary,
                netPay,
                bankStatus: detail.bankStatus,
                exceptions: detail.exceptions,
                currency: displayCurrency,
            };
        });
        const { entityName, currency } = this.extractEntityAndCurrency(payrollRun.entity);
        return {
            payrollRun: {
                runId: payrollRun.runId,
                payrollPeriod: payrollRun.payrollPeriod,
                status: payrollRun.status,
                employees: payrollRun.employees,
                exceptions: payrollRun.exceptions,
                totalnetpay: needsConversion
                    ? this.convertCurrency(payrollRun.totalnetpay, sourceCurrency, displayCurrency)
                    : payrollRun.totalnetpay,
                entity: entityName,
                currency: displayCurrency,
                sourceCurrency: sourceCurrency,
                converted: needsConversion,
            },
            employeeDetails: enhancedDetails,
        };
    }
    async generateAndDistributePayslips(payrollRunId, distributionMethod, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(payrollRunId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        if (payrollRun.status !== payroll_execution_enum_1.PayRollStatus.LOCKED ||
            payrollRun.paymentStatus !== payroll_execution_enum_1.PayRollPaymentStatus.PAID) {
            throw new Error('Payroll run must be approved by Finance and locked before generating payslips');
        }
        const payrollDetails = await this.employeePayrollDetailsModel
            .find({
            payrollRunId: new mongoose.Types.ObjectId(payrollRunId),
        })
            .populate('employeeId')
            .exec();
        console.log(`[Generate Payslips] Found ${payrollDetails.length} employee payroll details for payroll run ${payrollRunId}`);
        if (payrollDetails.length === 0) {
            const payrollRunStatus = payrollRun.status;
            const payrollRunPeriod = payrollRun.payrollPeriod;
            let errorMessage = `No employee payroll details found for payroll run ${payrollRunId}.\n\n`;
            errorMessage += `Payroll Run Status: ${payrollRunStatus}\n`;
            errorMessage += `Payroll Period: ${new Date(payrollRunPeriod).toISOString().split('T')[0]}\n\n`;
            errorMessage += `To generate payslips, you must first generate the payroll draft.\n\n`;
            errorMessage += `Option 1: Review and approve payroll initiation (auto-generates draft):\n`;
            errorMessage += `  POST /api/v1/payroll/review-initiation/${payrollRunId}\n`;
            errorMessage += `  Body: { "approved": true, "reviewerId": "...", "rejectionReason": null }\n\n`;
            errorMessage += `Option 2: Generate draft directly:\n`;
            errorMessage += `  POST /api/v1/payroll/generate-draft\n`;
            errorMessage += `  Body: { "payrollPeriod": "${new Date(payrollRunPeriod).toISOString()}", "entity": "${payrollRun.entity}", ... }\n\n`;
            errorMessage += `After generating the draft, complete the approval workflow:\n`;
            errorMessage += `  1. Send for approval → 2. Manager approval → 3. Finance approval → 4. Lock → 5. Generate payslips`;
            throw new Error(errorMessage);
        }
        const generatedPayslips = [];
        const allowancesResult = await this.payrollConfigurationService.findAllAllowances({
            status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
            limit: 1000
        });
        const allAllowances = allowancesResult?.data || [];
        const taxRulesResult = await this.payrollConfigurationService.findAllTaxRules({
            status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
            limit: 1000
        });
        const allTaxRules = taxRulesResult?.data || [];
        const insuranceBracketsResult = await this.payrollConfigurationService.findAllInsuranceBrackets({
            status: payroll_configuration_enums_1.ConfigStatus.APPROVED,
            limit: 1000
        });
        const allInsuranceBrackets = insuranceBracketsResult?.data || [];
        for (const detail of payrollDetails) {
            const employeeIdString = detail.employeeId?._id?.toString() ||
                detail.employeeId?.toString() ||
                detail.employeeId?.toString();
            if (!employeeIdString || !mongoose.Types.ObjectId.isValid(employeeIdString)) {
                const errorMsg = `Invalid employeeId in payroll detail: ${JSON.stringify(detail.employeeId)}`;
                console.error(`[Generate Payslips] ${errorMsg}`);
                await this.flagPayrollException(payrollRunId, 'INVALID_EMPLOYEE_ID', errorMsg, currentUserId, 'unknown');
                continue;
            }
            const employeeId = employeeIdString;
            const baseSalary = detail.baseSalary;
            const deductionsBreakdown = this.getDeductionsBreakdown(detail);
            let employee;
            try {
                employee = await this.employeeProfileService.findOne(employeeId);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`[Generate Payslips] Error fetching employee ${employeeId}: ${errorMessage}`);
                await this.flagPayrollException(payrollRunId, 'EMPLOYEE_NOT_FOUND', `Employee ${employeeId} not found or invalid: ${errorMessage}`, currentUserId, employeeId);
                continue;
            }
            const employeeAllowances = await this.getApplicableAllowancesForEmployee(employee, allAllowances);
            const applicableAllowances = employeeAllowances
                .filter((allowance) => {
                const allowanceData = allowance.toObject
                    ? allowance.toObject()
                    : allowance;
                return allowanceData.status === payroll_configuration_enums_1.ConfigStatus.APPROVED;
            })
                .map((allowance) => ({
                ...(allowance.toObject ? allowance.toObject() : allowance),
                _id: allowance._id,
            }));
            const employeeObjectId = new mongoose.Types.ObjectId(employeeId);
            const approvedSigningBonuses = await this.employeeSigningBonusModel
                .find({
                employeeId: employeeObjectId,
                status: payroll_execution_enum_1.BonusStatus.APPROVED,
            })
                .populate('signingBonusId')
                .exec();
            const signingBonusConfigs = [];
            for (const bonus of approvedSigningBonuses) {
                if (bonus.signingBonusId) {
                    try {
                        const signingBonusId = bonus.signingBonusId;
                        const configId = signingBonusId?._id
                            ? signingBonusId._id.toString()
                            : signingBonusId?.toString() || signingBonusId;
                        if (configId) {
                            const config = await this.payrollConfigurationService.findOneSigningBonus(configId);
                            const configData = config;
                            if (configData.status === payroll_configuration_enums_1.ConfigStatus.APPROVED) {
                                signingBonusConfigs.push(configData);
                            }
                            else {
                                console.warn(`Signing bonus config ${configId} is not APPROVED (status: ${configData.status}). Skipping.`);
                            }
                        }
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        const signingBonusId = bonus.signingBonusId;
                        const configId = signingBonusId?._id
                            ? signingBonusId._id.toString()
                            : signingBonusId?.toString() || signingBonusId;
                        console.warn(`Error fetching signing bonus config ${configId}: ${errorMessage}`);
                    }
                }
            }
            const approvedBenefits = await this.employeeTerminationResignationModel
                .find({
                employeeId: employeeObjectId,
                status: payroll_execution_enum_1.BenefitStatus.APPROVED,
            })
                .populate('benefitId')
                .exec();
            const terminationBenefitConfigs = [];
            for (const benefit of approvedBenefits) {
                if (benefit.benefitId) {
                    try {
                        const benefitId = benefit.benefitId;
                        const configId = benefitId?._id
                            ? benefitId._id.toString()
                            : benefitId?.toString() || benefitId;
                        if (configId) {
                            const config = await this.payrollConfigurationService.findOneTerminationBenefit(configId);
                            if (config.status === payroll_configuration_enums_1.ConfigStatus.APPROVED) {
                                terminationBenefitConfigs.push(config);
                            }
                            else {
                                console.warn(`Termination benefit config ${configId} is not APPROVED (status: ${config.status}). Skipping.`);
                            }
                        }
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        console.warn(`Error fetching termination benefit config ${benefit.benefitId}: ${errorMessage}`);
                    }
                }
            }
            const allRefunds = await this.payrollTrackingService.getRefundsByEmployeeId(employeeId);
            const refundDetailsList = [];
            const refundsToProcess = [];
            for (const refund of allRefunds) {
                const refundData = refund;
                const isPending = refundData.status === payroll_tracking_enum_1.RefundStatus.PENDING ||
                    refundData.status === 'pending';
                const isPaidInThisRun = refundData.paidInPayrollRunId &&
                    refundData.paidInPayrollRunId.toString() === payrollRunId;
                if (isPaidInThisRun || (isPending && !refundData.paidInPayrollRunId)) {
                    if (refundData.refundDetails) {
                        refundDetailsList.push(refundData.refundDetails);
                        if (isPending && !refundData.paidInPayrollRunId) {
                            refundsToProcess.push(refundData);
                        }
                    }
                }
            }
            const applicableTaxRules = allTaxRules
                .filter((rule) => {
                const ruleData = rule.toObject ? rule.toObject() : rule;
                return ruleData.status === payroll_configuration_enums_1.ConfigStatus.APPROVED;
            })
                .map((rule) => ({
                ...(rule.toObject ? rule.toObject() : rule),
                _id: rule._id,
            }));
            const applicableInsuranceBrackets = allInsuranceBrackets
                .filter((rule) => {
                const ruleData = rule.toObject ? rule.toObject() : rule;
                if (ruleData.status !== payroll_configuration_enums_1.ConfigStatus.APPROVED) {
                    return false;
                }
                return (baseSalary >= ruleData.minSalary &&
                    (ruleData.maxSalary === null ||
                        ruleData.maxSalary === undefined ||
                        baseSalary <= ruleData.maxSalary));
            })
                .map((rule) => ({
                ...(rule.toObject ? rule.toObject() : rule),
                _id: rule._id,
            }));
            const penalties = await this.employeePenaltiesModel
                .findOne({
                employeeId: employeeObjectId,
            })
                .exec();
            const totalAllowancesAmount = applicableAllowances.reduce((sum, allowance) => sum + (allowance.amount || 0), 0);
            const totalBonusesAmount = approvedSigningBonuses.reduce((sum, bonus) => sum + (bonus.givenAmount || 0), 0);
            const totalBenefitsAmount = approvedBenefits.reduce((sum, benefit) => sum + (benefit.givenAmount || 0), 0);
            const totalRefundsAmount = refundDetailsList.reduce((sum, refund) => sum + (refund.amount || 0), 0);
            const totalGrossSalary = baseSalary +
                totalAllowancesAmount +
                totalBonusesAmount +
                totalBenefitsAmount +
                totalRefundsAmount;
            const totalTaxAmount = applicableTaxRules.reduce((sum, rule) => {
                return sum + (baseSalary * (rule.rate || 0)) / 100;
            }, 0);
            const totalInsuranceAmount = applicableInsuranceBrackets.reduce((sum, rule) => {
                return sum + (baseSalary * (rule.employeeRate || 0)) / 100;
            }, 0);
            const totalPenaltiesAmount = penalties
                ? penalties.amount || 0
                : 0;
            const totaDeductions = totalTaxAmount + totalInsuranceAmount + totalPenaltiesAmount;
            const existingPayslip = await this.paySlipModel.findOne({
                employeeId: employeeObjectId,
                payrollRunId: new mongoose.Types.ObjectId(payrollRunId),
            });
            if (existingPayslip) {
                console.log(`[Generate Payslips] Payslip already exists for employee ${employeeId} in payroll run ${payrollRunId}. Skipping creation.`);
                generatedPayslips.push(existingPayslip);
                continue;
            }
            let payslip = null;
            try {
                console.log(`[Generate Payslips] Creating payslip for employee ${employeeId}...`);
                const payrollRunObjectId = new mongoose.Types.ObjectId(payrollRunId);
                const payslipData = {
                    employeeId: employeeObjectId,
                    payrollRunId: payrollRunObjectId,
                    earningsDetails: {
                        baseSalary: baseSalary,
                        allowances: Array.isArray(applicableAllowances) ? applicableAllowances : [],
                        bonuses: Array.isArray(signingBonusConfigs) && signingBonusConfigs.length > 0
                            ? signingBonusConfigs
                            : undefined,
                        benefits: Array.isArray(terminationBenefitConfigs) && terminationBenefitConfigs.length > 0
                            ? terminationBenefitConfigs
                            : undefined,
                        refunds: Array.isArray(refundDetailsList) && refundDetailsList.length > 0
                            ? refundDetailsList
                            : undefined,
                    },
                    deductionsDetails: {
                        taxes: Array.isArray(applicableTaxRules) ? applicableTaxRules : [],
                        insurances: Array.isArray(applicableInsuranceBrackets) && applicableInsuranceBrackets.length > 0
                            ? applicableInsuranceBrackets
                            : undefined,
                        penalties: penalties ? penalties : undefined,
                    },
                    totalGrossSalary: totalGrossSalary,
                    totaDeductions: totaDeductions,
                    netPay: detail.netPay,
                    paymentStatus: payroll_execution_enum_1.PaySlipPaymentStatus.PENDING,
                };
                payslip = new this.paySlipModel(payslipData);
                console.log(`[Generate Payslips] Saving payslip for employee ${employeeId}...`);
                const savedPayslip = await payslip.save();
                console.log(`[Generate Payslips] Successfully saved payslip ${savedPayslip._id} for employee ${employeeId} in MongoDB`);
                const verifiedPayslip = await this.paySlipModel.findById(savedPayslip._id);
                if (!verifiedPayslip) {
                    throw new Error(`Payslip was not found in database after save. Save operation may have failed.`);
                }
                generatedPayslips.push(savedPayslip);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`[Generate Payslips] Error creating/saving payslip for employee ${employeeId}: ${errorMessage}`);
                if (error instanceof Error && error.errors) {
                    console.error(`[Generate Payslips] Validation errors:`, JSON.stringify(error.errors, null, 2));
                }
                await this.flagPayrollException(payrollRunId, 'PAYSLIP_GENERATION_ERROR', `Failed to generate payslip for employee ${employeeId}: ${errorMessage}`, currentUserId, employeeId.toString());
                continue;
            }
            if (!payslip) {
                console.warn(`[Generate Payslips] Skipping refund processing and distribution for employee ${employeeId} - payslip creation failed`);
                continue;
            }
            for (const refundToProcess of refundsToProcess) {
                try {
                    await this.payrollTrackingService.processRefund(refundToProcess._id.toString(), {
                        paidInPayrollRunId: payrollRunId,
                    });
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error(`Error processing refund ${refundToProcess._id} for employee ${employeeId}: ${errorMessage}`);
                    await this.flagPayrollException(payrollRunId, 'REFUND_PROCESSING_ERROR', `Failed to process refund ${refundToProcess._id} for employee ${employeeId}: ${errorMessage}`, currentUserId, employeeId.toString());
                }
            }
            try {
                if (distributionMethod === 'PDF') {
                    await this.distributePayslipAsPDF(payslip, employeeObjectId);
                }
                else if (distributionMethod === 'EMAIL') {
                    await this.distributePayslipViaEmail(payslip, employeeObjectId);
                }
                else if (distributionMethod === 'PORTAL') {
                    await this.distributePayslipViaPortal(payslip);
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`Error distributing payslip ${payslip._id} via ${distributionMethod}: ${errorMessage}`);
                await this.flagPayrollException(payrollRunId, 'PAYSLIP_DISTRIBUTION_ERROR', `Failed to distribute payslip for employee ${employeeId} via ${distributionMethod}: ${errorMessage}`, currentUserId, employeeId.toString());
            }
        }
        console.log(`[Generate Payslips] Completed. Generated ${generatedPayslips.length} payslips out of ${payrollDetails.length} employees via ${distributionMethod}`);
        if (generatedPayslips.length === 0) {
            throw new Error(`Failed to generate any payslips. Check the logs for validation errors.`);
        }
        return {
            message: `Generated ${generatedPayslips.length} payslips via ${distributionMethod}`,
            payslips: generatedPayslips,
            distributionMethod,
            totalEmployees: payrollDetails.length,
            successful: generatedPayslips.length,
            failed: payrollDetails.length - generatedPayslips.length,
        };
    }
    async distributePayslipAsPDF(payslip, employeeId) {
        try {
            const employee = await this.employeeProfileService.findOne(employeeId.toString());
            if (!employee) {
                throw new Error('Employee not found for PDF generation');
            }
            const payrollRun = await this.payrollRunModel.findById(payslip.payrollRunId);
            const periodDate = payrollRun
                ? new Date(payrollRun.payrollPeriod)
                : new Date();
            const periodMonth = periodDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
            });
            let PDFDocument;
            let fs;
            let path;
            try {
                PDFDocument = require('pdfkit');
                fs = require('fs');
                path = require('path');
            }
            catch (e) {
                console.warn(`PDF generation skipped: pdfkit library not installed. Install with: npm install pdfkit @types/pdfkit`);
                console.log(`Payslip ${payslip._id} generated successfully. PDF generation requires pdfkit library.`);
                return;
            }
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `payslip-${employee.employeeNumber}-${payslip._id.toString()}.pdf`;
            const payslipsDir = path.join(process.cwd(), 'payslips');
            const filePath = path.join(payslipsDir, fileName);
            if (!fs.existsSync(payslipsDir)) {
                fs.mkdirSync(payslipsDir, { recursive: true });
            }
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);
            doc.fontSize(20).text('PAYSLIP', { align: 'center' });
            doc.moveDown(0.5);
            doc
                .fontSize(12)
                .text(`Employee: ${employee.fullName || `${employee.firstName} ${employee.lastName}`}`);
            doc.text(`Employee Number: ${employee.employeeNumber}`);
            doc.text(`Period: ${periodMonth}`);
            doc.moveDown();
            doc.fontSize(14).text('EARNINGS', { underline: true });
            doc.fontSize(10);
            doc.text(`Base Salary: ${payslip.earningsDetails.baseSalary.toFixed(2)}`);
            if (payslip.earningsDetails.allowances &&
                payslip.earningsDetails.allowances.length > 0) {
                payslip.earningsDetails.allowances.forEach((allowance) => {
                    doc.text(`  ${allowance.name || 'Allowance'}: ${(allowance.amount || 0).toFixed(2)}`);
                });
            }
            if (payslip.earningsDetails.bonuses &&
                payslip.earningsDetails.bonuses.length > 0) {
                payslip.earningsDetails.bonuses.forEach((bonus) => {
                    doc.text(`  Bonus: ${(bonus.amount || 0).toFixed(2)}`);
                });
            }
            if (payslip.earningsDetails.benefits &&
                payslip.earningsDetails.benefits.length > 0) {
                payslip.earningsDetails.benefits.forEach((benefit) => {
                    doc.text(`  Benefit: ${(benefit.amount || 0).toFixed(2)}`);
                });
            }
            if (payslip.earningsDetails.refunds &&
                payslip.earningsDetails.refunds.length > 0) {
                payslip.earningsDetails.refunds.forEach((refund) => {
                    doc.text(`  Refund: ${(refund.amount || 0).toFixed(2)} - ${refund.description || ''}`);
                });
            }
            doc.moveDown();
            doc
                .fontSize(12)
                .text(`Total Gross Salary: ${payslip.totalGrossSalary.toFixed(2)}`, {
                underline: true,
            });
            doc.moveDown();
            doc.fontSize(14).text('DEDUCTIONS', { underline: true });
            doc.fontSize(10);
            if (payslip.deductionsDetails.taxes &&
                payslip.deductionsDetails.taxes.length > 0) {
                payslip.deductionsDetails.taxes.forEach((tax) => {
                    const taxAmount = (payslip.earningsDetails.baseSalary * (tax.percentage || 0)) / 100;
                    doc.text(`  ${tax.name || 'Tax'} (${tax.percentage || 0}%): ${taxAmount.toFixed(2)}`);
                });
            }
            if (payslip.deductionsDetails.insurances &&
                payslip.deductionsDetails.insurances.length > 0) {
                payslip.deductionsDetails.insurances.forEach((insurance) => {
                    const insuranceAmount = (payslip.earningsDetails.baseSalary * (insurance.percentage || 0)) /
                        100;
                    doc.text(`  ${insurance.name || 'Insurance'} (${insurance.percentage || 0}%): ${insuranceAmount.toFixed(2)}`);
                });
            }
            if (payslip.deductionsDetails.penalties) {
                const penaltyAmount = payslip.deductionsDetails.penalties.amount || 0;
                if (penaltyAmount > 0) {
                    doc.text(`  Penalties: ${penaltyAmount.toFixed(2)}`);
                }
            }
            doc.moveDown();
            doc
                .fontSize(12)
                .text(`Total Deductions: ${payslip.totaDeductions.toFixed(2)}`, {
                underline: true,
            });
            doc.moveDown();
            doc.fontSize(16).text('NET PAY', { align: 'center', underline: true });
            doc
                .fontSize(18)
                .text(`${payslip.netPay.toFixed(2)}`, { align: 'center' });
            doc.end();
            await new Promise((resolve, reject) => {
                stream.on('finish', () => {
                    console.log(`PDF generated successfully: ${filePath}`);
                    resolve();
                });
                stream.on('error', reject);
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error generating PDF for payslip ${payslip._id}: ${errorMessage}`);
            throw error;
        }
    }
    async distributePayslipViaEmail(payslip, employeeId) {
        try {
            const employee = await this.employeeProfileService.findOne(employeeId.toString());
            if (!employee) {
                throw new Error('Employee not found for email distribution');
            }
            const emailAddress = employee.workEmail || employee.personalEmail;
            if (!emailAddress) {
                throw new Error(`No email address found for employee ${employee.employeeNumber}`);
            }
            const payrollRun = await this.payrollRunModel.findById(payslip.payrollRunId);
            const periodDate = payrollRun
                ? new Date(payrollRun.payrollPeriod)
                : new Date();
            const periodMonth = periodDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
            });
            let nodemailer;
            try {
                nodemailer = require('nodemailer');
            }
            catch (e) {
                console.warn(`Email sending skipped: nodemailer library not installed. Install with: npm install nodemailer @types/nodemailer`);
                console.log(`Payslip ${payslip._id} generated successfully. Email sending requires nodemailer library.`);
                return;
            }
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });
            let earningsHtml = `<p>Base Salary: ${payslip.earningsDetails.baseSalary.toFixed(2)}</p>`;
            if (payslip.earningsDetails.allowances &&
                payslip.earningsDetails.allowances.length > 0) {
                earningsHtml += '<p>Allowances:</p><ul>';
                payslip.earningsDetails.allowances.forEach((allowance) => {
                    earningsHtml += `<li>${allowance.name || 'Allowance'}: ${(allowance.amount || 0).toFixed(2)}</li>`;
                });
                earningsHtml += '</ul>';
            }
            if (payslip.earningsDetails.bonuses &&
                payslip.earningsDetails.bonuses.length > 0) {
                earningsHtml += '<p>Bonuses:</p><ul>';
                payslip.earningsDetails.bonuses.forEach((bonus) => {
                    earningsHtml += `<li>Bonus: ${(bonus.amount || 0).toFixed(2)}</li>`;
                });
                earningsHtml += '</ul>';
            }
            if (payslip.earningsDetails.refunds &&
                payslip.earningsDetails.refunds.length > 0) {
                earningsHtml += '<p>Refunds:</p><ul>';
                payslip.earningsDetails.refunds.forEach((refund) => {
                    earningsHtml += `<li>${refund.description || 'Refund'}: ${(refund.amount || 0).toFixed(2)}</li>`;
                });
                earningsHtml += '</ul>';
            }
            earningsHtml += `<p><strong>Total Gross Salary: ${payslip.totalGrossSalary.toFixed(2)}</strong></p>`;
            let deductionsHtml = '';
            if (payslip.deductionsDetails.taxes &&
                payslip.deductionsDetails.taxes.length > 0) {
                deductionsHtml += '<p>Taxes:</p><ul>';
                payslip.deductionsDetails.taxes.forEach((tax) => {
                    const taxAmount = (payslip.earningsDetails.baseSalary * (tax.percentage || 0)) / 100;
                    deductionsHtml += `<li>${tax.name || 'Tax'} (${tax.percentage || 0}%): ${taxAmount.toFixed(2)}</li>`;
                });
                deductionsHtml += '</ul>';
            }
            if (payslip.deductionsDetails.insurances &&
                payslip.deductionsDetails.insurances.length > 0) {
                deductionsHtml += '<p>Insurance:</p><ul>';
                payslip.deductionsDetails.insurances.forEach((insurance) => {
                    const insuranceAmount = (payslip.earningsDetails.baseSalary * (insurance.percentage || 0)) /
                        100;
                    deductionsHtml += `<li>${insurance.name || 'Insurance'} (${insurance.percentage || 0}%): ${insuranceAmount.toFixed(2)}</li>`;
                });
                deductionsHtml += '</ul>';
            }
            if (payslip.deductionsDetails.penalties) {
                const penaltyAmount = payslip.deductionsDetails.penalties.amount || 0;
                if (penaltyAmount > 0) {
                    deductionsHtml += `<p>Penalties: ${penaltyAmount.toFixed(2)}</p>`;
                }
            }
            deductionsHtml += `<p><strong>Total Deductions: ${payslip.totaDeductions.toFixed(2)}</strong></p>`;
            await transporter.sendMail({
                from: process.env.SMTP_FROM ||
                    process.env.SMTP_USER ||
                    'payroll@company.com',
                to: emailAddress,
                subject: `Your Payslip for ${periodMonth}`,
                html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #2c3e50;">Your Payslip for ${periodMonth}</h2>
              <p>Dear ${employee.fullName || `${employee.firstName} ${employee.lastName}`},</p>
              <p>Please find your payslip details below:</p>
              
              <h3 style="color: #27ae60;">Earnings</h3>
              ${earningsHtml}
              
              <h3 style="color: #e74c3c;">Deductions</h3>
              ${deductionsHtml}
              
              <h3 style="color: #3498db;">Net Pay</h3>
              <p style="font-size: 18px; font-weight: bold; color: #2c3e50;">${payslip.netPay.toFixed(2)}</p>
              
              <p>For detailed breakdown, please log in to the employee portal.</p>
              
              <p style="margin-top: 30px; font-size: 12px; color: #7f8c8d;">
                This is an automated message. Please do not reply to this email.
              </p>
            </body>
          </html>
        `,
            });
            console.log(`Email sent successfully for payslip ${payslip._id} to ${emailAddress}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error sending email for payslip ${payslip._id}: ${errorMessage}`);
            throw error;
        }
    }
    async distributePayslipViaPortal(payslip) {
        try {
            console.log(`Payslip ${payslip._id} is now available in employee portal`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error distributing payslip ${payslip._id} via portal: ${errorMessage}`);
            throw error;
        }
    }
    async sendForApproval(payrollRunId, managerId, financeStaffId, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(payrollRunId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        this.validateStatusTransition(payrollRun.status, payroll_execution_enum_1.PayRollStatus.UNDER_REVIEW);
        payrollRun.status = payroll_execution_enum_1.PayRollStatus.UNDER_REVIEW;
        payrollRun.payrollManagerId = new mongoose.Types.ObjectId(managerId);
        payrollRun.financeStaffId = new mongoose.Types.ObjectId(financeStaffId);
        payrollRun.updatedBy = currentUserId;
        return await payrollRun.save();
    }
    async approvePayrollDisbursement(financeDecisionDto, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(financeDecisionDto.payrollRunId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        if (financeDecisionDto.decision === 'approve') {
            this.validateStatusTransition(payrollRun.status, payroll_execution_enum_1.PayRollStatus.APPROVED);
            payrollRun.status = payroll_execution_enum_1.PayRollStatus.APPROVED;
            payrollRun.paymentStatus = payroll_execution_enum_1.PayRollPaymentStatus.PAID;
            if (financeDecisionDto.decisionDate) {
                const approvalDate = new Date(financeDecisionDto.decisionDate);
                const now = new Date();
                if (approvalDate > now) {
                    throw new Error('Finance approval date cannot be in the future');
                }
                payrollRun.financeApprovalDate = approvalDate;
            }
            else {
                payrollRun.financeApprovalDate = new Date();
            }
            if (financeDecisionDto.financeStaffId) {
                payrollRun.financeStaffId = new mongoose.Types.ObjectId(financeDecisionDto.financeStaffId);
            }
        }
        else {
            this.validateStatusTransition(payrollRun.status, payroll_execution_enum_1.PayRollStatus.REJECTED);
            payrollRun.status = payroll_execution_enum_1.PayRollStatus.REJECTED;
            payrollRun.rejectionReason =
                financeDecisionDto.reason || 'Rejected by Finance';
        }
        payrollRun.updatedBy = currentUserId;
        return await payrollRun.save();
    }
    async resolveIrregularity(payrollRunId, employeeId, exceptionCode, resolution, managerId, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(payrollRunId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        const payrollDetails = await this.employeePayrollDetailsModel.findOne({
            employeeId: new mongoose.Types.ObjectId(employeeId),
            payrollRunId: new mongoose.Types.ObjectId(payrollRunId),
        });
        if (!payrollDetails) {
            throw new Error(`Payroll details not found for employee ${employeeId} in run ${payrollRunId}`);
        }
        let exceptionsData = {};
        if (payrollDetails.exceptions) {
            try {
                exceptionsData = JSON.parse(payrollDetails.exceptions);
            }
            catch (error) {
                throw new Error(`Invalid exceptions data format for employee ${employeeId}`);
            }
        }
        if (!exceptionsData.exceptionMessages) {
            exceptionsData.exceptionMessages = [];
        }
        if (!exceptionsData.exceptionHistory) {
            exceptionsData.exceptionHistory = [];
        }
        let exceptionFound = false;
        for (const exception of exceptionsData.exceptionMessages) {
            if (exception.code === exceptionCode && exception.status === 'active') {
                exception.status = 'resolved';
                exception.resolvedBy = managerId;
                exception.resolvedAt = new Date().toISOString();
                exception.resolution = resolution;
                exceptionFound = true;
                exceptionsData.exceptionHistory.push({
                    ...exception,
                    action: 'resolved',
                });
                break;
            }
        }
        if (!exceptionFound) {
            throw new Error(`Active exception with code ${exceptionCode} not found for employee ${employeeId}`);
        }
        payrollDetails.exceptions = JSON.stringify(exceptionsData);
        payrollDetails.updatedBy = currentUserId;
        await payrollDetails.save();
        const activeExceptions = exceptionsData.exceptionMessages.filter((e) => e.status === 'active');
        if (activeExceptions.length === 0 && payrollRun.exceptions > 0) {
            payrollRun.exceptions = Math.max(0, payrollRun.exceptions - 1);
        }
        payrollRun.updatedBy = currentUserId;
        await payrollRun.save();
        return {
            payrollRun,
            employeePayrollDetails: payrollDetails,
        };
    }
    async getEmployeeExceptions(employeeId, payrollRunId, currentUserId) {
        const payrollDetails = await this.employeePayrollDetailsModel.findOne({
            employeeId: new mongoose.Types.ObjectId(employeeId),
            payrollRunId: new mongoose.Types.ObjectId(payrollRunId),
        });
        if (!payrollDetails || !payrollDetails.exceptions) {
            return {
                activeExceptions: [],
                resolvedExceptions: [],
                exceptionHistory: [],
                deductionsBreakdown: this.getDeductionsBreakdown(payrollDetails),
            };
        }
        try {
            const exceptionsData = JSON.parse(payrollDetails.exceptions);
            return {
                activeExceptions: (exceptionsData.exceptionMessages || []).filter((e) => e.status === 'active'),
                resolvedExceptions: (exceptionsData.exceptionMessages || []).filter((e) => e.status === 'resolved'),
                exceptionHistory: exceptionsData.exceptionHistory || [],
                deductionsBreakdown: this.getDeductionsBreakdown(payrollDetails),
            };
        }
        catch (error) {
            return {
                activeExceptions: [],
                resolvedExceptions: [],
                exceptionHistory: [],
                deductionsBreakdown: this.getDeductionsBreakdown(payrollDetails),
            };
        }
    }
    async getEmployeeHistoricalPayrollData(employeeId, currentPayrollPeriod) {
        try {
            const currentPeriodStart = new Date(currentPayrollPeriod.getFullYear(), currentPayrollPeriod.getMonth(), 1);
            const previousPayrollRuns = await this.payrollRunModel
                .find({
                payrollPeriod: { $lt: currentPeriodStart },
                status: { $in: [payroll_execution_enum_1.PayRollStatus.LOCKED, payroll_execution_enum_1.PayRollStatus.APPROVED] },
            })
                .sort({ payrollPeriod: -1 })
                .limit(12)
                .select('_id payrollPeriod')
                .exec();
            if (previousPayrollRuns.length === 0) {
                return {
                    averageBaseSalary: 0,
                    previousRunsCount: 0,
                    previousSalaries: [],
                    lastSalary: null,
                };
            }
            const previousPayrollRunIds = previousPayrollRuns.map((run) => run._id);
            const previousPayrollDetails = await this.employeePayrollDetailsModel
                .find({
                employeeId: new mongoose.Types.ObjectId(employeeId),
                payrollRunId: { $in: previousPayrollRunIds },
            })
                .select('baseSalary payrollRunId')
                .sort({ payrollRunId: -1 })
                .exec();
            if (previousPayrollDetails.length === 0) {
                return {
                    averageBaseSalary: 0,
                    previousRunsCount: 0,
                    previousSalaries: [],
                    lastSalary: null,
                };
            }
            const previousSalaries = previousPayrollDetails
                .map((detail) => detail.baseSalary)
                .filter((salary) => salary > 0);
            if (previousSalaries.length === 0) {
                return {
                    averageBaseSalary: 0,
                    previousRunsCount: previousPayrollDetails.length,
                    previousSalaries: [],
                    lastSalary: null,
                };
            }
            const sum = previousSalaries.reduce((acc, salary) => acc + salary, 0);
            const averageBaseSalary = sum / previousSalaries.length;
            const lastSalary = previousSalaries[0];
            return {
                averageBaseSalary: Math.round(averageBaseSalary * 100) / 100,
                previousRunsCount: previousPayrollDetails.length,
                previousSalaries,
                lastSalary,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error getting historical payroll data for employee ${employeeId}: ${errorMessage}`);
            return null;
        }
    }
    async getAllPayrollExceptions(payrollRunId, currentUserId) {
        const payrollDetails = await this.employeePayrollDetailsModel
            .find({
            payrollRunId: new mongoose.Types.ObjectId(payrollRunId),
        })
            .populate('employeeId')
            .exec();
        let totalActive = 0;
        let totalResolved = 0;
        const employeeExceptions = [];
        for (const detail of payrollDetails) {
            if (!detail.exceptions)
                continue;
            try {
                const exceptionsData = JSON.parse(detail.exceptions);
                const active = (exceptionsData.exceptionMessages || []).filter((e) => e.status === 'active');
                const resolved = (exceptionsData.exceptionMessages || []).filter((e) => e.status === 'resolved');
                totalActive += active.length;
                totalResolved += resolved.length;
                const employeeId = detail.employeeId._id?.toString() ||
                    detail.employeeId.toString();
                employeeExceptions.push({
                    employeeId,
                    activeExceptions: active,
                    resolvedExceptions: resolved,
                });
            }
            catch (error) {
                continue;
            }
        }
        return {
            totalExceptions: totalActive + totalResolved,
            activeExceptions: totalActive,
            resolvedExceptions: totalResolved,
            employeeExceptions,
        };
    }
    async approvePayrollRun(managerApprovalDto, currentUserId) {
        const payrollRun = await this.payrollRunModel.findById(managerApprovalDto.payrollRunId);
        if (!payrollRun)
            throw new Error('Payroll run not found');
        if (managerApprovalDto.managerDecision === payroll_execution_enum_1.PayRollStatus.APPROVED) {
            this.validateStatusTransition(payrollRun.status, payroll_execution_enum_1.PayRollStatus.PENDING_FINANCE_APPROVAL);
            payrollRun.status = payroll_execution_enum_1.PayRollStatus.PENDING_FINANCE_APPROVAL;
            if (managerApprovalDto.managerApprovalDate) {
                const approvalDate = new Date(managerApprovalDto.managerApprovalDate);
                const now = new Date();
                if (approvalDate > now) {
                    throw new Error('Manager approval date cannot be in the future');
                }
                payrollRun.managerApprovalDate = approvalDate;
            }
            else {
                payrollRun.managerApprovalDate = new Date();
            }
            if (managerApprovalDto.payrollManagerId) {
                payrollRun.payrollManagerId = new mongoose.Types.ObjectId(managerApprovalDto.payrollManagerId);
            }
        }
        else if (managerApprovalDto.managerDecision === payroll_execution_enum_1.PayRollStatus.REJECTED) {
            this.validateStatusTransition(payrollRun.status, payroll_execution_enum_1.PayRollStatus.REJECTED);
            payrollRun.status = payroll_execution_enum_1.PayRollStatus.REJECTED;
            payrollRun.rejectionReason =
                managerApprovalDto.managerComments || 'Rejected by Manager';
        }
        else {
            throw new Error(`Invalid manager decision: ${managerApprovalDto.managerDecision}. Must be '${payroll_execution_enum_1.PayRollStatus.APPROVED}' or '${payroll_execution_enum_1.PayRollStatus.REJECTED}'`);
        }
        payrollRun.updatedBy = currentUserId;
        return await payrollRun.save();
    }
};
exports.PayrollExecutionService = PayrollExecutionService;
exports.PayrollExecutionService = PayrollExecutionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payrollRuns_schema_1.payrollRuns.name)),
    __param(1, (0, mongoose_1.InjectModel)(employeePayrollDetails_schema_1.employeePayrollDetails.name)),
    __param(2, (0, mongoose_1.InjectModel)(EmployeeSigningBonus_schema_1.employeeSigningBonus.name)),
    __param(3, (0, mongoose_1.InjectModel)(EmployeeTerminationResignation_schema_1.EmployeeTerminationResignation.name)),
    __param(4, (0, mongoose_1.InjectModel)(payslip_schema_1.paySlip.name)),
    __param(5, (0, mongoose_1.InjectModel)(employeePenalties_schema_1.employeePenalties.name)),
    __param(6, (0, mongoose_1.InjectModel)(employee_system_role_schema_1.EmployeeSystemRole.name)),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => payroll_tracking_service_1.PayrollTrackingService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        payroll_configuration_service_1.PayrollConfigurationService,
        payroll_tracking_service_1.PayrollTrackingService,
        employee_profile_service_1.EmployeeProfileService,
        leaves_service_1.LeavesService])
], PayrollExecutionService);
//# sourceMappingURL=payroll-execution.service.js.map