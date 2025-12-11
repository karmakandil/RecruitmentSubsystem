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
};
