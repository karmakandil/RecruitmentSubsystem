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
  // Phase 2: Leave Request Types
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
  LeaveRequest,
} from "../../../types/leaves";

export const leavesApi = {
  // Leave Types
  getLeaveTypes: async (): Promise<LeaveType[]> => {
    try {
      return await api.get("/leaves/types");
    } catch (error: any) {
      // Silently fail for 404 - this endpoint is optional
      if (error.message?.includes("not available") || error.message?.includes("404") || error.message?.includes("not found")) {
        return [];
      }
      console.warn("Failed to fetch leave types:", error.message || "Unknown error");
      return [];
    }
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

  // ============================================================================
  // Phase 2: Leave Request Functions (Employee & Manager Features)
  // ============================================================================
  
  /**
   * Create a new leave request
   * POST /leaves/request
   * Required roles: DEPARTMENT_EMPLOYEE, DEPARTMENT_HEAD
   */
  createLeaveRequest: async (
    data: CreateLeaveRequestDto
  ): Promise<LeaveRequest> => {
    try {
      // Prepare the payload, ensuring dates are properly formatted
      const fromDate = typeof data.dates.from === 'string' 
        ? new Date(data.dates.from) 
        : data.dates.from;
      const toDate = typeof data.dates.to === 'string' 
        ? new Date(data.dates.to) 
        : data.dates.to;

      // Ensure dates are valid
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new Error("Invalid date format");
      }

      const payload: any = {
        employeeId: String(data.employeeId).trim(),
        leaveTypeId: String(data.leaveTypeId).trim(),
        durationDays: Number(data.durationDays),
        dates: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
      };

      // Only include optional fields if they have values (not empty strings)
      if (data.justification && String(data.justification).trim()) {
        payload.justification = String(data.justification).trim();
      }

      if (data.attachmentId && String(data.attachmentId).trim()) {
        payload.attachmentId = String(data.attachmentId).trim();
      }

      const result = await api.post("/leaves/request", payload);
      return result as unknown as LeaveRequest;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Get leave request by ID
   * GET /leaves/request/:id
   */
  getLeaveRequestById: async (id: string): Promise<LeaveRequest> => {
    return await api.get(`/leaves/request/${id}`) as unknown as LeaveRequest;
  },

  /**
   * Update a leave request
   * PUT /leaves/request/:id
   * Required roles: DEPARTMENT_EMPLOYEE, DEPARTMENT_HEAD, HR_ADMIN
   */
  updateLeaveRequest: async (
    id: string,
    data: UpdateLeaveRequestDto
  ): Promise<LeaveRequest> => {
    try {
      const payload: any = {};

      // Only include leaveTypeId if it's provided and not empty
      if (data.leaveTypeId && data.leaveTypeId.trim()) {
        payload.leaveTypeId = data.leaveTypeId.trim();
      }

      // Only include dates if both from and to are provided
      if (data.dates && data.dates.from && data.dates.to) {
        let fromDate: Date;
        let toDate: Date;

        if (typeof data.dates.from === 'string') {
          // Handle YYYY-MM-DD format from date inputs
          if (data.dates.from.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // YYYY-MM-DD format - append T00:00:00.000Z for UTC midnight
            fromDate = new Date(data.dates.from + 'T00:00:00.000Z');
          } else {
            // ISO string or other format
            fromDate = new Date(data.dates.from);
          }
        } else {
          fromDate = data.dates.from;
        }

        if (typeof data.dates.to === 'string') {
          // Handle YYYY-MM-DD format from date inputs
          if (data.dates.to.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // YYYY-MM-DD format - append T00:00:00.000Z for UTC midnight
            toDate = new Date(data.dates.to + 'T00:00:00.000Z');
          } else {
            // ISO string or other format
            toDate = new Date(data.dates.to);
          }
        } else {
          toDate = data.dates.to;
        }

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          throw new Error("Invalid date format");
        }

        // Send dates as ISO strings (NestJS will transform them to Date objects)
        // Use UTC midnight to avoid timezone issues
        payload.dates = {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        };
      }

      // Only include durationDays if it's defined and valid
      if (data.durationDays !== undefined && data.durationDays > 0) {
        payload.durationDays = Number(data.durationDays);
      }

      // Only include justification if it's provided and not empty
      if (data.justification !== undefined && data.justification && String(data.justification).trim()) {
        payload.justification = String(data.justification).trim();
      }

      // Only include attachmentId if it's provided and not empty
      if (data.attachmentId !== undefined && data.attachmentId && String(data.attachmentId).trim()) {
        payload.attachmentId = String(data.attachmentId).trim();
      }

      // Ensure we're sending at least one field to update
      if (Object.keys(payload).length === 0) {
        throw new Error("No fields provided to update. Please modify at least one field.");
      }

      console.log("Update leave request payload:", JSON.stringify(payload, null, 2));
      console.log("Update leave request URL:", `/leaves/request/${id}`);
      
      const result = await api.put(`/leaves/request/${id}`, payload);
      return result as unknown as LeaveRequest;
    } catch (error: any) {
      console.error("Error updating leave request:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  /**
   * Cancel a leave request
   * POST /leaves/request/:id/cancel
   * Required roles: DEPARTMENT_EMPLOYEE, HR_ADMIN
   */
  cancelLeaveRequest: async (id: string): Promise<LeaveRequest> => {
    try {
      const result = await api.post(`/leaves/request/${id}/cancel`, {});
      return result as unknown as LeaveRequest;
    } catch (error: any) {
      console.error("Error in cancelLeaveRequest:", error);
      throw error;
    }
  },

  /**
   * Upload attachment/document for leave request
   * Note: This tries multiple possible endpoints
   */
  uploadAttachment: async (file: File): Promise<{ attachmentId: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('auth_token') || '' 
        : '';

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

      // Try different possible endpoints
      const endpoints = [
        '/documents/upload',
        '/attachments/upload',
        '/leaves/attachment/upload',
      ];

      let lastError: Error | null = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            const attachmentId = data._id || data.id || data.documentId || data.attachmentId;
            if (attachmentId) {
              return { attachmentId };
            }
          } else if (response.status !== 404) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload attachment');
          }
        } catch (error: any) {
          if (error.message && !error.message.includes('404')) {
            throw error;
          }
          lastError = error;
          continue;
        }
      }

      throw new Error(
        'File upload endpoint not found. Please contact support or upload the file manually and enter the attachment ID.'
      );
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Get employee's leave requests
   * GET /leaves/past-requests/:employeeId
   */
  getEmployeeLeaveRequests: async (
    employeeId: string,
    filters?: {
      fromDate?: string;
      toDate?: string;
      status?: string;
      leaveTypeId?: string;
    }
  ): Promise<LeaveRequest[]> => {
    try {
      if (!employeeId || !employeeId.trim()) {
        throw new Error("Employee ID is required");
      }

      const params = new URLSearchParams();
      if (filters?.fromDate) params.append('fromDate', filters.fromDate);
      if (filters?.toDate) params.append('toDate', filters.toDate);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.leaveTypeId) params.append('leaveTypeId', filters.leaveTypeId);

      const queryString = params.toString();
      const url = `/leaves/past-requests/${employeeId.trim()}${queryString ? `?${queryString}` : ''}`;
      
      const result = await api.get(url);
      return result as unknown as LeaveRequest[];
    } catch (error: any) {
      console.error("Error fetching employee leave requests:", error);
      throw error;
    }
  },

  /**
   * Approve a leave request
   * POST /leaves/request/:id/approve
   * Required roles: DEPARTMENT_HEAD, HR_MANAGER, HR_ADMIN
   */
  approveLeaveRequest: async (leaveRequestId: string): Promise<LeaveRequest> => {
    try {
      const payload = {
        leaveRequestId: String(leaveRequestId).trim(),
        status: 'approved',
      };
      
      const result = await api.post(`/leaves/request/${leaveRequestId}/approve`, payload);
      return result as unknown as LeaveRequest;
    } catch (error: any) {
      console.error("Error approving leave request:", error);
      throw error;
    }
  },

  /**
   * Reject a leave request
   * POST /leaves/request/:id/reject
   * Required roles: DEPARTMENT_HEAD, HR_MANAGER, HR_ADMIN
   */
  rejectLeaveRequest: async (leaveRequestId: string): Promise<LeaveRequest> => {
    try {
      const payload = {
        leaveRequestId: String(leaveRequestId).trim(),
        status: 'rejected',
      };
      
      const result = await api.post(`/leaves/request/${leaveRequestId}/reject`, payload);
      return result as unknown as LeaveRequest;
    } catch (error: any) {
      console.error("Error rejecting leave request:", error);
      throw error;
    }
  },

  /**
   * Get pending leave requests for manager review
   * Note: This is a placeholder - backend should provide /leaves/pending/:managerId
   */
  getPendingLeaveRequestsForManager: async (): Promise<LeaveRequest[]> => {
    // Placeholder - managers will search by employee ID instead
    return [];
  },
};

