import api from "../client";
import {
  LeaveType,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
  LeaveCategory,
  CreateLeaveCategoryDto,
  LeavePolicy,
  CreateLeavePolicyDto,
  UpdateLeavePolicyDto,
  LeaveEntitlement,
  CreateLeaveEntitlementDto,
  UpdateLeaveEntitlementDto,
  LeaveAdjustment,
  CreateLeaveAdjustmentDto,
  Calendar,
  CreateCalendarDto,
} from "../../../types/leaves";

export const leavesApi = {
  // Leave Types
  getLeaveTypes: async (): Promise<LeaveType[]> => {
    // TODO: Backend endpoint missing - GET /leaves/types
    // For now, return empty array - will be implemented when backend is ready
    return [];
  },

  getLeaveTypeById: async (id: string): Promise<LeaveType> => {
    // TODO: Backend endpoint missing - GET /leaves/type/:id
    throw new Error("Backend endpoint not implemented yet");
  },

  createLeaveType: async (data: CreateLeaveTypeDto): Promise<LeaveType> => {
    return await api.post("/leaves/type", data);
  },

  updateLeaveType: async (
    id: string,
    data: UpdateLeaveTypeDto
  ): Promise<LeaveType> => {
    return await api.put(`/leaves/type/${id}`, data);
  },

  deleteLeaveType: async (id: string): Promise<void> => {
    // TODO: Backend endpoint missing - DELETE /leaves/type/:id
    throw new Error("Backend endpoint not implemented yet");
  },

  // Leave Categories
  getLeaveCategories: async (): Promise<LeaveCategory[]> => {
    // TODO: Backend endpoint missing - GET /leaves/categories
    // For now, try to call the endpoint - if it fails, return empty array
    try {
      return await api.get("/leaves/categories");
    } catch (error: any) {
      // If endpoint doesn't exist, return empty array
      console.warn("Categories endpoint not available:", error);
      return [];
    }
  },

  getLeaveCategoryById: async (id: string): Promise<LeaveCategory> => {
    // TODO: Backend endpoint missing - GET /leaves/category/:id
    throw new Error("Backend endpoint not implemented yet");
  },

  createLeaveCategory: async (
    data: CreateLeaveCategoryDto
  ): Promise<LeaveCategory> => {
    return await api.post("/leaves/category", data);
  },

  deleteLeaveCategory: async (id: string): Promise<void> => {
    // TODO: Backend endpoint missing - DELETE /leaves/category/:id
    throw new Error("Backend endpoint not implemented yet");
  },

  // Leave Policies
  getLeavePolicies: async (): Promise<LeavePolicy[]> => {
    return await api.get("/leaves/policies");
  },

  getLeavePolicyById: async (id: string): Promise<LeavePolicy> => {
    return await api.get(`/leaves/policy/${id}`);
  },

  createLeavePolicy: async (
    data: CreateLeavePolicyDto
  ): Promise<LeavePolicy> => {
    return await api.post("/leaves/policy", data);
  },

  updateLeavePolicy: async (
    id: string,
    data: UpdateLeavePolicyDto
  ): Promise<LeavePolicy> => {
    return await api.put(`/leaves/policy/${id}`, data);
  },

  deleteLeavePolicy: async (id: string): Promise<void> => {
    return await api.delete(`/leaves/policy/${id}`);
  },

  // Leave Entitlements
  createLeaveEntitlement: async (
    data: CreateLeaveEntitlementDto
  ): Promise<LeaveEntitlement> => {
    return await api.post("/leaves/entitlement", data);
  },

  getLeaveEntitlement: async (
    employeeId: string,
    leaveTypeId: string
  ): Promise<LeaveEntitlement> => {
    return await api.get(`/leaves/entitlement/${employeeId}/${leaveTypeId}`);
  },

  updateLeaveEntitlement: async (
    id: string,
    data: UpdateLeaveEntitlementDto
  ): Promise<LeaveEntitlement> => {
    return await api.put(`/leaves/entitlement/${id}`, data);
  },

  assignPersonalizedEntitlement: async (
    employeeId: string,
    leaveTypeId: string,
    personalizedEntitlement: number
  ): Promise<LeaveEntitlement> => {
    return await api.post(
      `/leaves/entitlement/${employeeId}/${leaveTypeId}/personalized`,
      { personalizedEntitlement }
    );
  },

  // Leave Adjustments
  createLeaveAdjustment: async (
    data: CreateLeaveAdjustmentDto
  ): Promise<LeaveAdjustment> => {
    return await api.post("/leaves/adjustment", data);
  },

  getLeaveAdjustments: async (
    employeeId: string
  ): Promise<LeaveAdjustment[]> => {
    return await api.get(`/leaves/adjustment/${employeeId}`);
  },

  deleteLeaveAdjustment: async (id: string): Promise<void> => {
    return await api.delete(`/leaves/adjustment/${id}`);
  },

  // Calendar
  createCalendar: async (data: CreateCalendarDto): Promise<Calendar> => {
    return await api.post("/leaves/calendar", data);
  },

  getCalendarByYear: async (year: number): Promise<Calendar | null> => {
    return await api.get(`/leaves/calendar/${year}`);
  },

  updateCalendar: async (
    year: number,
    data: CreateCalendarDto
  ): Promise<Calendar> => {
    return await api.put(`/leaves/calendar/${year}`, data);
  },

  // Reset Leave Balances
  resetLeaveBalances: async (criterion?: string): Promise<{ message: string }> => {
    return await api.post("/leaves/reset-leave-balances", { criterion });
  },
};

