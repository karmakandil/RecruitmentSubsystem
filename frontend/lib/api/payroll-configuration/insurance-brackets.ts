import { InsuranceBracket } from './types';
import api from '../client';

// Type definitions for DTOs (in case they're not exported)
type CreateInsuranceBracketDto = {
  name: string;
  minSalary: number;
  maxSalary: number;
  employeeRate: number;
  employerRate: number;
  amount?: number;
};

type UpdateInsuranceBracketDto = {
  name?: string;
  minSalary?: number;
  maxSalary?: number;
  employeeRate?: number;
  employerRate?: number;
  amount?: number;
};

type ApprovalDto = {
  comment?: string;
};

type RejectionDto = {
  comment: string;
};

const BASE_URL = '/payroll-configuration/insurance-brackets';

// Helper function to extract user name from user object
const extractUserName = (user: any): string => {
  if (!user) return '';
  if (typeof user === 'string') return user;
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.fullName) return user.fullName;
  if (user.email) return user.email;
  if (user.employeeNumber) return user.employeeNumber;
  return user._id || user.id || '';
};

// Helper function to normalize status (handle case differences)
const normalizeStatus = (status: any): 'draft' | 'approved' | 'rejected' => {
  if (!status) return 'draft';
  const statusStr = String(status).toLowerCase();
  if (statusStr === 'approved') return 'approved';
  if (statusStr === 'rejected') return 'rejected';
  return 'draft'; // Default to draft
};

// Helper function to map backend response to frontend type
const mapBackendToFrontend = (backendData: any): InsuranceBracket => {
  return {
    id: backendData._id || backendData.id,
    name: backendData.name || '',
    description: `Insurance bracket: ${backendData.name || ''} (${backendData.minSalary || 0} - ${backendData.maxSalary || 0} EGP)`,
    status: normalizeStatus(backendData.status),
    createdBy: extractUserName(backendData.createdBy),
    createdAt: backendData.createdAt || new Date().toISOString(),
    updatedAt: backendData.updatedAt || new Date().toISOString(),
    version: backendData.version || 1,
    minSalary: backendData.minSalary || 0,
    maxSalary: backendData.maxSalary || 0,
    employeeRate: backendData.employeeRate || backendData.employeeContribution || 0,
    employerRate: backendData.employerRate || backendData.employerContribution || 0,
    amount: backendData.amount,
    approvedBy: extractUserName(backendData.approvedBy),
    approvedAt: backendData.approvedAt,
  };
};

// Helper function to map frontend type to backend DTO
const mapFrontendToBackend = (frontendData: any) => {
  return {
    name: frontendData.name || '',
    minSalary: parseFloat(frontendData.minSalary) || 0,
    maxSalary: parseFloat(frontendData.maxSalary) || 0,
    employeeRate: parseFloat(frontendData.employeeRate) || 0,
    employerRate: parseFloat(frontendData.employerRate) || 0,
    amount: frontendData.amount ? parseFloat(String(frontendData.amount)) : undefined,
  };
};

export const insuranceBracketsApi = {
  getAll: async (statusFilter?: 'draft' | 'approved' | 'rejected'): Promise<InsuranceBracket[]> => {
    try {
      const params: any = {};
      if (statusFilter) {
        params.status = statusFilter;
      }
      
      const response = await api.get(BASE_URL, params ? { params } : {}) as any;
      
      // Handle different response formats
      let insuranceBrackets: any[] = [];
      if (Array.isArray(response)) {
        insuranceBrackets = response;
      } else if (response && typeof response === 'object') {
        insuranceBrackets = response.data || response.items || response.insuranceBrackets || [];
      }
      
      // Map each item from backend to frontend format
      return insuranceBrackets.map(mapBackendToFrontend);
    } catch (error) {
      console.error('Error fetching insurance brackets:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<InsuranceBracket> => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`) as any;
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error fetching insurance bracket ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateInsuranceBracketDto | Omit<InsuranceBracket, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'status' | 'createdBy' | 'description' | 'approvedBy' | 'approvedAt'>): Promise<InsuranceBracket> => {
    try {
      // Map frontend data to backend DTO format
      const backendData = mapFrontendToBackend(data);
      
      // Validate required fields
      if (!backendData.name) {
        throw new Error('Insurance bracket name is required');
      }
      if (backendData.minSalary < 0 || backendData.maxSalary < 0) {
        throw new Error('Salary values must be non-negative');
      }
      if (backendData.minSalary >= backendData.maxSalary) {
        throw new Error('Minimum salary must be less than maximum salary');
      }
      if (backendData.employeeRate < 0 || backendData.employeeRate > 100) {
        throw new Error('Employee rate must be between 0 and 100');
      }
      if (backendData.employerRate < 0 || backendData.employerRate > 100) {
        throw new Error('Employer rate must be between 0 and 100');
      }
      
      const response = await api.post(BASE_URL, backendData) as any;
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error('Error creating insurance bracket:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateInsuranceBracketDto | Partial<InsuranceBracket>): Promise<InsuranceBracket> => {
    try {
      // Map frontend data to backend DTO format
      const backendData: any = {};
      
      if (data.name !== undefined) backendData.name = String(data.name).trim();
      if (data.minSalary !== undefined) backendData.minSalary = Number(data.minSalary);
      if (data.maxSalary !== undefined) backendData.maxSalary = Number(data.maxSalary);
      if (data.employeeRate !== undefined) backendData.employeeRate = Number(data.employeeRate);
      if (data.employerRate !== undefined) backendData.employerRate = Number(data.employerRate);
      if (data.amount !== undefined && data.amount !== null) {
        backendData.amount = Number(data.amount);
      }
      
      // Validate if both min and max are provided
      if (backendData.minSalary !== undefined && backendData.maxSalary !== undefined) {
        if (backendData.minSalary >= backendData.maxSalary) {
          throw new Error('Minimum salary must be less than maximum salary');
        }
      }
      
      const response = await api.put(`${BASE_URL}/${id}`, backendData) as any;
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error updating insurance bracket ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting insurance bracket ${id}:`, error);
      throw error;
    }
  },

  approve: async (id: string, data?: ApprovalDto | { comment?: string }): Promise<void> => {
    try {
      await api.post(`${BASE_URL}/${id}/approve`, data || {});
    } catch (error) {
      console.error(`Error approving insurance bracket ${id}:`, error);
      throw error;
    }
  },

  reject: async (id: string, data: RejectionDto | { comment: string }): Promise<void> => {
    try {
      await api.post(`${BASE_URL}/${id}/reject`, data);
    } catch (error) {
      console.error(`Error rejecting insurance bracket ${id}:`, error);
      throw error;
    }
  },
};

