import { InsuranceBracket } from './types';
import api from '../client';

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
    employeeRate: backendData.employeeRate || 0,
    employerRate: backendData.employerRate || 0,
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
    amount: frontendData.amount ? parseFloat(frontendData.amount) : undefined,
  };
};

export const insuranceBracketsApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<InsuranceBracket[]> => {
    try {
      const params: any = {};
      if (status) {
        params.status = status;
      }
      
      const response = await api.get('/payroll-configuration/insurance-brackets', { params });
      
      // Handle different response formats
      let insuranceBrackets: any[] = [];
      if (Array.isArray(response)) {
        insuranceBrackets = response;
      } else if (response && typeof response === 'object') {
        insuranceBrackets = (response as any).data || (response as any).insuranceBrackets || [];
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
      const response = await api.get(`/payroll-configuration/insurance-brackets/${id}`);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error fetching insurance bracket ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Omit<InsuranceBracket, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'status' | 'createdBy' | 'description' | 'approvedBy' | 'approvedAt'>): Promise<InsuranceBracket> => {
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
      
      const response = await api.post('/payroll-configuration/insurance-brackets', backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error('Error creating insurance bracket:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<InsuranceBracket>): Promise<InsuranceBracket> => {
    try {
      // Map frontend data to backend DTO format
      const backendData: any = {};
      
      if (data.name !== undefined) backendData.name = data.name;
      if (data.minSalary !== undefined) backendData.minSalary = parseFloat(String(data.minSalary));
      if (data.maxSalary !== undefined) backendData.maxSalary = parseFloat(String(data.maxSalary));
      if (data.employeeRate !== undefined) backendData.employeeRate = parseFloat(String(data.employeeRate));
      if (data.employerRate !== undefined) backendData.employerRate = parseFloat(String(data.employerRate));
      if (data.amount !== undefined) backendData.amount = data.amount ? parseFloat(String(data.amount)) : undefined;
      
      // Validate if both min and max are provided
      if (backendData.minSalary !== undefined && backendData.maxSalary !== undefined) {
        if (backendData.minSalary >= backendData.maxSalary) {
          throw new Error('Minimum salary must be less than maximum salary');
        }
      }
      
      const response = await api.put(`/payroll-configuration/insurance-brackets/${id}`, backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error updating insurance bracket ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/payroll-configuration/insurance-brackets/${id}`);
    } catch (error) {
      console.error(`Error deleting insurance bracket ${id}:`, error);
      throw error;
    }
  },

  approve: async (
    id: string,
    data?: { comment?: string }
  ): Promise<any> => {
    const response = await api.post(
      `/payroll-configuration/insurance-brackets/${id}/approve`,
      data || {}
    );
    return response;
  },

  reject: async (
    id: string,
    data: { comment: string }
  ): Promise<any> => {
    const response = await api.post(
      `/payroll-configuration/insurance-brackets/${id}/reject`,
      data
    );
    return response;
  },
};
