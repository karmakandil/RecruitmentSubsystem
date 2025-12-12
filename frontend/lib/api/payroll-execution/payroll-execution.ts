import api from "../client";
import {
  PreInitiationStatus,
  SigningBonusReviewDto,
  SigningBonusEditDto,
  TerminationBenefitReviewDto,
  TerminationBenefitEditDto,
  ReviewPayrollPeriodDto,
  EditPayrollPeriodDto,
  EmployeeSigningBonus,
  EmployeeTerminationBenefit,
  PayrollRun,
} from "../../../types/payroll-execution";

export const payrollExecutionApi = {
  // Pre-Initiation Validation
  getPreInitiationValidationStatus: async (): Promise<PreInitiationStatus> => {
    return await api.get("/payroll/pre-initiation-validation");
  },

  // Signing Bonuses
  getSigningBonuses: async (): Promise<EmployeeSigningBonus[]> => {
    try {
      // Backend returns paginated response: { data: [...], total, page, limit }
      const response = await api.get("/payroll/signing-bonuses");
      // Handle both paginated response and direct array
      if (response && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (err: any) {
      console.error("Error fetching signing bonuses:", err);
      throw err;
    }
  },

  getSigningBonusById: async (id: string): Promise<EmployeeSigningBonus> => {
    // Note: This endpoint needs to be added to the backend
    return await api.get(`/payroll/signing-bonuses/${id}`);
  },

  reviewSigningBonus: async (
    data: SigningBonusReviewDto
  ): Promise<EmployeeSigningBonus> => {
    return await api.post("/payroll/review-signing-bonus", data);
  },

  editSigningBonus: async (
    data: SigningBonusEditDto
  ): Promise<EmployeeSigningBonus> => {
    return await api.put("/payroll/edit-signing-bonus", data);
  },

  // Termination Benefits
  getTerminationBenefits: async (): Promise<EmployeeTerminationBenefit[]> => {
    try {
      // Backend returns paginated response: { data: [...], total, page, limit }
      const response = await api.get("/payroll/termination-benefits");
      // Handle both paginated response and direct array
      if (response && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (err: any) {
      console.error("Error fetching termination benefits:", err);
      throw err;
    }
  },

  getTerminationBenefitById: async (
    id: string
  ): Promise<EmployeeTerminationBenefit> => {
    // Note: This endpoint needs to be added to the backend
    return await api.get(`/payroll/termination-benefits/${id}`);
  },

  reviewTerminationBenefit: async (
    data: TerminationBenefitReviewDto
  ): Promise<EmployeeTerminationBenefit> => {
    return await api.post("/payroll/review-termination-benefit", data);
  },

  editTerminationBenefit: async (
    data: TerminationBenefitEditDto
  ): Promise<EmployeeTerminationBenefit> => {
    return await api.put("/payroll/edit-termination-benefit", data);
  },

  // Payroll Period
  reviewPayrollPeriod: async (
    data: ReviewPayrollPeriodDto
  ): Promise<PayrollRun> => {
    return await api.post("/payroll/review-payroll-period", data);
  },

  editPayrollPeriod: async (
    data: EditPayrollPeriodDto
  ): Promise<PayrollRun> => {
    return await api.put("/payroll/edit-payroll-period", data);
  },

  // Payroll Initiation
  processPayrollInitiation: async (data: {
    payrollPeriod: string;
    entity: string;
    payrollSpecialistId: string;
    currency?: string;
    payrollManagerId?: string;
  }): Promise<PayrollRun> => {
    return await api.post("/payroll/process-initiation", data);
  },
};

