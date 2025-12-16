import api from "../client";
import {
  ShiftAssignment,
  AssignShiftToEmployeeDto,
  AssignShiftToDepartmentDto,
  AssignShiftToPositionDto,
  UpdateShiftAssignmentDto,
  ShiftAssignmentStatus,
  Shift,
} from "../../../types/time-management";

// Helper API functions for fetching dropdown options
export const fetchShifts = async (activeOnly: boolean = true): Promise<Shift[]> => {
  const queryString = activeOnly ? '?active=true' : '';
  const response: any = await api.get(`/shift-schedule/shifts${queryString}`);
  // Handle different response formats
  return Array.isArray(response) ? response : (response.data || response.shifts || []);
};

export const fetchDepartments = async (activeOnly: boolean = true): Promise<any[]> => {
  const queryString = activeOnly ? '?isActive=true' : '';
  const response: any = await api.get(`/organization-structure/departments${queryString}`);
  return Array.isArray(response) ? response : (response.data || response.departments || []);
};

export const fetchPositions = async (activeOnly: boolean = true, departmentId?: string): Promise<any[]> => {
  const params: string[] = [];
  if (activeOnly) params.push('isActive=true');
  if (departmentId) params.push(`departmentId=${departmentId}`);
  const queryString = params.length > 0 ? `?${params.join('&')}` : '';
  const response: any = await api.get(`/organization-structure/positions${queryString}`);
  return Array.isArray(response) ? response : (response.data || response.positions || []);
};

export const fetchEmployees = async (): Promise<any[]> => {
  const response = await api.get('/employee-profile');
  // Interceptor returns response.data directly, so response is already the data
  // Handle nested data structure if backend wraps it
  if (response && typeof response === "object" && "data" in response && Array.isArray((response as any).data)) {
    return (response as any).data;
  }
  if (Array.isArray(response)) {
    return response;
  }
  return [];
};

export const shiftScheduleApi = {
  // GET all assignments (to view/manage)
  getAllShiftAssignments: async (filters?: {
    status?: ShiftAssignmentStatus;
    employeeId?: string;
    departmentId?: string;
    positionId?: string;
    shiftId?: string;
  }): Promise<ShiftAssignment[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.positionId) params.append('positionId', filters.positionId);
    if (filters?.shiftId) params.append('shiftId', filters.shiftId);
    const query = params.toString();
    return await api.get(`/shift-schedule/shift/assignments${query ? `?${query}` : ''}`);
  },
  
  // GET single assignment (to view details)
  getShiftAssignmentById: async (id: string): Promise<ShiftAssignment> => {
    return await api.get(`/shift-schedule/shift/assignment/${id}`);
  },
  
  // POST assign to employee
  assignShiftToEmployee: async (data: AssignShiftToEmployeeDto): Promise<ShiftAssignment> => {
    return await api.post("/shift-schedule/shift/assign", data);
  },
  
  // POST assign to department
  assignShiftToDepartment: async (data: AssignShiftToDepartmentDto): Promise<any> => {
    return await api.post("/shift-schedule/shift/assign/department", data);
  },
  
  // POST assign to position
  assignShiftToPosition: async (data: AssignShiftToPositionDto): Promise<any> => {
    return await api.post("/shift-schedule/shift/assign/position", data);
  },
  
  // PUT update assignment
  updateShiftAssignment: async (id: string, data: UpdateShiftAssignmentDto): Promise<ShiftAssignment> => {
    return await api.put(`/shift-schedule/shift/assignment/${id}`, data);
  },
};
