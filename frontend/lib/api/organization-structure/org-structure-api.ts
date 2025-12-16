import { api } from "../client";

// Interfaces for Organization Structure - These will be refined based on backend API
export interface Department {
  _id: string;
  code: string;
  name: string;
  description?: string;
  headPositionId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  _id: string;
  code: string;
  title: string;
  description?: string;
  departmentId: string;
  reportsToPositionId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDepartmentDto {
  code?: string;
  name: string;
  description?: string;
  headPositionId?: string;
}

export interface UpdateDepartmentDto {
  code?: string;
  name?: string;
  description?: string;
  headPositionId?: string;
  isActive?: boolean;
}

export interface CreatePositionDto {
  code?: string;
  title: string;
  description?: string;
  departmentId: string;
  reportsToPositionId?: string;
}

export interface UpdatePositionDto {
  code?: string;
  title?: string;
  description?: string;
  departmentId?: string;
  reportsToPositionId?: string;
  isActive?: boolean;
}

export interface PositionAssignment {
  _id: string;
  employeeProfileId: string;
  positionId: string;
  departmentId: string;
  startDate: Date;
  endDate?: Date;
  changeRequestId?: string;
  reason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePositionAssignmentDto {
  employeeProfileId: string;
  positionId: string;
  departmentId: string;
  startDate: string;
  endDate?: string;
  changeRequestId?: string;
  reason?: string;
  notes?: string;
}

export interface UpdatePositionAssignmentDto {
  endDate?: string;
  reason?: string;
  notes?: string;
}

export enum StructureRequestType {
  NEW_DEPARTMENT = 'NEW_DEPARTMENT',
  UPDATE_DEPARTMENT = 'UPDATE_DEPARTMENT',
  NEW_POSITION = 'NEW_POSITION',
  UPDATE_POSITION = 'UPDATE_POSITION',
  CLOSE_POSITION = 'CLOSE_POSITION',
}

export enum StructureRequestStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  IMPLEMENTED = 'IMPLEMENTED',
}

export enum ApprovalDecision {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ChangeLogAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DEACTIVATED = 'DEACTIVATED',
  REASSIGNED = 'REASSIGNED',
}

export interface StructureChangeRequest {
  _id: string;
  requestNumber: string;
  requestedByEmployeeId: string;
  requestType: StructureRequestType;
  targetDepartmentId?: string;
  targetPositionId?: string;
  details?: string;
  reason?: string;
  status: StructureRequestStatus;
  submittedByEmployeeId?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStructureChangeRequestDto {
  requestedByEmployeeId: string;
  requestType: StructureRequestType;
  targetDepartmentId?: string;
  targetPositionId?: string;
  details?: string;
  reason?: string;
}

export interface UpdateStructureChangeRequestDto {
  requestType?: StructureRequestType;
  targetDepartmentId?: string;
  targetPositionId?: string;
  details?: string;
  reason?: string;
}

export interface SubmitChangeRequestDto {
  submittedByEmployeeId: string;
}

export interface StructureApproval {
  _id: string;
  changeRequestId: string;
  approverEmployeeId: string;
  decision: ApprovalDecision;
  comments?: string;
  decidedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStructureApprovalDto {
  changeRequestId: string;
  approverEmployeeId: string;
}

export interface UpdateApprovalDecisionDto {
  decision: ApprovalDecision;
  comments?: string;
}

export interface StructureChangeLog {
  _id: string;
  action: ChangeLogAction;
  entityType: string;
  entityId: string;
  performedByEmployeeId?: string;
  summary?: string;
  beforeSnapshot?: Record<string, unknown>;
  afterSnapshot?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// API calls for Departments
export const organizationStructureApi = {
  createDepartment: async (data: CreateDepartmentDto): Promise<Department> => {
    const response = await api.post<Department>("/organization-structure/departments", data);
    return response.data;
  },

  getDepartments: async (isActive?: boolean): Promise<Department[]> => {
    const params = isActive !== undefined ? { isActive } : {};
    const response = await api.get<Department[]>("/organization-structure/departments", { params });
    return response.data;
  },

  getDepartmentById: async (id: string): Promise<Department> => {
    const response = await api.get<Department>(`/organization-structure/departments/${id}`);
    return response.data;
  },

  updateDepartment: async (id: string, data: UpdateDepartmentDto): Promise<Department> => {
    const response = await api.put<Department>(`/organization-structure/departments/${id}`, data);
    return response.data;
  },

  deactivateDepartment: async (id: string): Promise<void> => {
    await api.delete(`/organization-structure/departments/${id}`);
  },

  getDepartmentHierarchy: async (): Promise<any> => {
    const response = await api.get("/organization-structure/departments/hierarchy/all");
    return response.data;
  },

  // API calls for Positions
  createPosition: async (data: CreatePositionDto): Promise<Position> => {
    const response = await api.post<Position>("/organization-structure/positions", data);
    return response.data;
  },

  getPositions: async (departmentId?: string, isActive?: boolean): Promise<Position[]> => {
    const params: { departmentId?: string; isActive?: boolean } = {};
    if (departmentId) {
      params.departmentId = departmentId;
    }
    if (isActive !== undefined) {
      params.isActive = isActive;
    }
    const response = await api.get<Position[]>("/organization-structure/positions", { params });
    return response.data;
  },

  getPositionById: async (id: string): Promise<Position> => {
    const response = await api.get<Position>(`/organization-structure/positions/${id}`);
    return response.data;
  },

  updatePosition: async (id: string, data: UpdatePositionDto): Promise<Position> => {
    const response = await api.put<Position>(`/organization-structure/positions/${id}`, data);
    return response.data;
  },

  deactivatePosition: async (id: string): Promise<void> => {
    await api.delete(`/organization-structure/positions/${id}`);
  },

  getPositionHierarchy: async (id: string): Promise<any> => {
    const response = await api.get(`/organization-structure/positions/${id}/hierarchy`);
    return response.data;
  },

  // API calls for Position Assignments
  createPositionAssignment: async (data: CreatePositionAssignmentDto): Promise<PositionAssignment> => {
    const response = await api.post<PositionAssignment>("/organization-structure/assignments", data);
    return response.data;
  },

  getEmployeeAssignments: async (employeeProfileId: string, activeOnly?: boolean): Promise<PositionAssignment[]> => {
    const params = activeOnly !== undefined ? { activeOnly } : {};
    const response = await api.get<PositionAssignment[]>(`/organization-structure/assignments/employee/${employeeProfileId}`, { params });
    return response.data;
  },

  getPositionAssignments: async (positionId: string): Promise<PositionAssignment[]> => {
    const response = await api.get<PositionAssignment[]>(`/organization-structure/assignments/position/${positionId}`);
    return response.data;
  },

  updatePositionAssignment: async (id: string, data: UpdatePositionAssignmentDto): Promise<PositionAssignment> => {
    const response = await api.patch<PositionAssignment>(`/organization-structure/assignments/${id}`, data);
    return response.data;
  },

  endPositionAssignment: async (id: string, endDate: string): Promise<PositionAssignment> => {
    const response = await api.patch<PositionAssignment>(`/organization-structure/assignments/${id}/end`, { endDate });
    return response.data;
  },

  // API calls for Change Requests
  createChangeRequest: async (data: CreateStructureChangeRequestDto): Promise<StructureChangeRequest> => {
    const response = await api.post<StructureChangeRequest>("/organization-structure/change-requests", data);
    return response.data;
  },

  getAllChangeRequests: async (status?: StructureRequestStatus): Promise<StructureChangeRequest[]> => {
    const params = status ? { status } : {};
    const response = await api.get<StructureChangeRequest[]>("/organization-structure/change-requests", { params });
    return response.data;
  },

  getChangeRequestById: async (id: string): Promise<StructureChangeRequest> => {
    const response = await api.get<StructureChangeRequest>(`/organization-structure/change-requests/${id}`);
    return response.data;
  },

  updateChangeRequest: async (id: string, data: UpdateStructureChangeRequestDto): Promise<StructureChangeRequest> => {
    const response = await api.put<StructureChangeRequest>(`/organization-structure/change-requests/${id}`, data);
    return response.data;
  },

  submitChangeRequest: async (id: string, data: SubmitChangeRequestDto): Promise<StructureChangeRequest> => {
    const response = await api.post<StructureChangeRequest>(`/organization-structure/change-requests/${id}/submit`, data);
    return response.data;
  },

  cancelChangeRequest: async (id: string): Promise<StructureChangeRequest> => {
    const response = await api.post<StructureChangeRequest>(`/organization-structure/change-requests/${id}/cancel`);
    return response.data;
  },

  // API calls for Approvals
  createApproval: async (data: CreateStructureApprovalDto): Promise<StructureApproval> => {
    const response = await api.post<StructureApproval>("/organization-structure/approvals", data);
    return response.data;
  },

  updateApprovalDecision: async (id: string, data: UpdateApprovalDecisionDto): Promise<StructureApproval> => {
    const response = await api.patch<StructureApproval>(`/organization-structure/approvals/${id}/decision`, data);
    return response.data;
  },

  getRequestApprovals: async (changeRequestId: string): Promise<StructureApproval[]> => {
    const response = await api.get<StructureApproval[]>(`/organization-structure/approvals/change-request/${changeRequestId}`);
    return response.data;
  },

  // API calls for Change Logs
  getChangeLogs: async (entityType?: string, entityId?: string): Promise<StructureChangeLog[]> => {
    const params: { entityType?: string; entityId?: string } = {};
    if (entityType) {
      params.entityType = entityType;
    }
    if (entityId) {
      params.entityId = entityId;
    }
    const response = await api.get<StructureChangeLog[]>("/organization-structure/change-logs", { params });
    return response.data;
  },

  getEntityChangeLogs: async (entityType: string, entityId: string): Promise<StructureChangeLog[]> => {
    const response = await api.get<StructureChangeLog[]>(`/organization-structure/change-logs/${entityType}/${entityId}`);
    return response.data;
  },
};
