<<<<<<< HEAD
import api from "../client";
import { Department, Position } from "@/types/performance";

export const organizationStructureApi = {
  // ============================================
  // DEPARTMENTS
  // ============================================
  
  // Get all departments (optionally filter by active status)
  getAllDepartments: async (isActive?: boolean): Promise<Department[]> => {
    const params = isActive !== undefined ? { isActive: isActive.toString() } : {};
    return await api.get("/organization-structure/departments", { params });
  },

  // Get a single department by ID
  getDepartmentById: async (id: string): Promise<Department> => {
    return await api.get(`/organization-structure/departments/${id}`);
  },

  // ============================================
  // POSITIONS
  // ============================================
  
  // Get all positions (optionally filter by department or active status)
  getAllPositions: async (
    departmentId?: string,
    isActive?: boolean
  ): Promise<Position[]> => {
    const params: Record<string, string> = {};
    if (departmentId) params.departmentId = departmentId;
    if (isActive !== undefined) params.isActive = isActive.toString();
    return await api.get("/organization-structure/positions", { params });
  },

  // Get a single position by ID
  getPositionById: async (id: string): Promise<Position> => {
    return await api.get(`/organization-structure/positions/${id}`);
  },
=======
// Main organization-structure API exports
import { departmentsApi } from "./departments.api";
import { positionsApi } from "./positions.api";
import { changeRequestsApi } from "./change-requests.api";
import { approvalsApi } from "./approvals.api";
import { positionAssignmentsApi } from "./position-assignments.api";
import { changeLogsApi } from "./change-logs.api";

export const organizationStructureApi = {
  departments: departmentsApi,
  positions: positionsApi,
  changeRequests: changeRequestsApi,
  approvals: approvalsApi,
  positionAssignments: positionAssignmentsApi,
  changeLogs: changeLogsApi,
};

// Also export individual APIs for flexibility
export {
  departmentsApi,
  positionsApi,
  changeRequestsApi,
  approvalsApi,
  positionAssignmentsApi,
  changeLogsApi,
>>>>>>> develop2
};
