import api from "../client";
import {
  AttendanceCorrectionRequest,
  CorrectionRequestStatus,
  GetAllCorrectionRequestsFilters,
  CorrectionRequestResponse,
  PendingCorrectionRequestsResponse,
  TimeException,
  TimeExceptionStatus,
  TimeExceptionType,
  GetAllTimeExceptionsFilters,
  OverdueExceptionsResponse,
  AutoEscalateResponse,
  GenerateOvertimeReportRequest,
  GenerateExceptionReportRequest,
  ExportReportRequest,
  OvertimeReportResponse,
  ExceptionReportResponse,
  ExportReportResponse,
} from "../../../types/time-management";

export const timeManagementApi = {
  // ===== Employee Self-Service APIs =====

  // Clock in
  clockIn: async (employeeId: string): Promise<any> => {
    return await api.post(`/time-management/clock-in/${employeeId}`);
  },

  // Clock out
  clockOut: async (employeeId: string): Promise<any> => {
    return await api.post(`/time-management/clock-out/${employeeId}`);
  },

  // Get attendance status for employee
  getAttendanceStatus: async (employeeId: string): Promise<any> => {
    return await api.get(`/time-management/attendance/status/${employeeId}`);
  },

  // Get attendance records for employee
  getAttendanceRecords: async (employeeId: string, filters?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<any> => {
    try {
      // Calculate date range - default to last 30 days
      const endDate = filters?.endDate ? new Date(filters.endDate) : new Date();
      const startDate = filters?.startDate 
        ? new Date(filters.startDate)
        : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

      const payload = {
        employeeId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        includeExceptions: true,
        includeOvertime: true,
      };

      console.log('Fetching attendance records with payload:', payload);

      const response = await api.post('/time-management/reports/employee-attendance-history', payload);
      
      console.log('Attendance records response:', response);
      
      return response;
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
  },

  // Submit correction request
  submitCorrectionRequest: async (data: {
    employeeId: string;
    attendanceRecord: string;
    reason: string;
  }): Promise<any> => {
    return await api.post('/time-management/correction-request', data);
  },

  // Get correction requests by employee
  getCorrectionRequestsByEmployee: async (
    employeeId: string,
    filters?: {
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<any> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = `/time-management/correction-request/employee/${employeeId}${queryString ? `?${queryString}` : ''}`;
    return await api.get(url);
  },

  // ===== Correction Request Management APIs =====

  // GET all correction requests
  getAllCorrectionRequests: async (
    filters?: GetAllCorrectionRequestsFilters
  ): Promise<AttendanceCorrectionRequest[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.employeeId) params.append("employeeId", filters.employeeId);

    const queryString = params.toString();
    const url = `/time-management/correction-request${queryString ? `?${queryString}` : ""}`;
    return await api.get(url);
  },

  // GET correction request by ID
  getCorrectionRequestById: async (
    requestId: string
  ): Promise<CorrectionRequestResponse> => {
    return await api.get(`/time-management/correction-request/${requestId}`);
  },

  // POST approve correction request
  approveCorrectionRequest: async (
    requestId: string,
    reason?: string
  ): Promise<CorrectionRequestResponse> => {
    return await api.post(`/time-management/correction-request/${requestId}/approve`, {
      reason,
    });
  },

  // POST reject correction request
  rejectCorrectionRequest: async (
    requestId: string,
    reason: string
  ): Promise<CorrectionRequestResponse> => {
    return await api.post(`/time-management/correction-request/${requestId}/reject`, {
      reason,
    });
  },

  // GET pending correction requests for manager
  getPendingCorrectionRequestsForManager: async (
    managerId?: string,
    departmentId?: string,
    limit?: number
  ): Promise<PendingCorrectionRequestsResponse> => {
    const params = new URLSearchParams();
    if (managerId) params.append("managerId", managerId);
    if (departmentId) params.append("departmentId", departmentId);
    if (limit) params.append("limit", limit.toString());

    const queryString = params.toString();
    const url = `/time-management/correction-request/pending/manager${queryString ? `?${queryString}` : ""}`;
    return await api.get(url);
  },

  // ===== Time Exception APIs =====

  // GET all time exceptions
  getAllTimeExceptions: async (
    filters?: GetAllTimeExceptionsFilters
  ): Promise<TimeException[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.employeeId) params.append("employeeId", filters.employeeId);
    if (filters?.assignedTo) params.append("assignedTo", filters.assignedTo);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const queryString = params.toString();
    const url = `/time-management/time-exceptions${queryString ? `?${queryString}` : ""}`;
    return await api.get(url);
  },

  // GET time exception by ID
  getTimeExceptionById: async (
    exceptionId: string
  ): Promise<TimeException> => {
    return await api.get(`/time-management/time-exception/${exceptionId}`);
  },

  // POST approve time exception
  approveTimeException: async (
    exceptionId: string,
    approvalNotes?: string
  ): Promise<TimeException> => {
    return await api.post("/time-management/time-exception/approve", {
      timeExceptionId: exceptionId,
      approvalNotes,
    });
  },

  // POST reject time exception
  rejectTimeException: async (
    exceptionId: string,
    rejectionReason?: string
  ): Promise<TimeException> => {
    return await api.post("/time-management/time-exception/reject", {
      timeExceptionId: exceptionId,
      rejectionReason,
    });
  },

  // POST escalate time exception
  escalateTimeException: async (
    exceptionId: string
  ): Promise<TimeException> => {
    return await api.post("/time-management/time-exception/escalate", {
      timeExceptionId: exceptionId,
    });
  },

  // POST auto-escalate overdue exceptions
  autoEscalateOverdueExceptions: async (
    thresholdDays: number,
    excludeTypes?: string[]
  ): Promise<AutoEscalateResponse> => {
    return await api.post("/time-management/time-exceptions/auto-escalate-overdue", {
      thresholdDays,
      excludeTypes,
    });
  },

  // GET overdue exceptions
  getOverdueExceptions: async (
    thresholdDays: number,
    status?: string
  ): Promise<OverdueExceptionsResponse> => {
    const params = new URLSearchParams();
    params.append("thresholdDays", thresholdDays.toString());
    if (status) params.append("status", status);

    const queryString = params.toString();
    return await api.get(`/time-management/time-exceptions/overdue?${queryString}`);
  },

  // GET pending exceptions for current user
  getMyPendingExceptions: async (): Promise<TimeException[]> => {
    return await api.get("/time-management/time-exceptions/my-pending");
  },

  // ===== Reports APIs =====

  // POST generate overtime report
  generateOvertimeReport: async (
    request: GenerateOvertimeReportRequest
  ): Promise<OvertimeReportResponse> => {
    return await api.post("/time-management/reports/overtime", request);
  },

  // POST generate exception report
  generateExceptionReport: async (
    request: GenerateExceptionReportRequest
  ): Promise<ExceptionReportResponse> => {
    return await api.post("/time-management/reports/exception", request);
  },

  // POST export report
  exportReport: async (
    request: ExportReportRequest
  ): Promise<ExportReportResponse> => {
    return await api.post("/time-management/reports/export", request);
  },
};

