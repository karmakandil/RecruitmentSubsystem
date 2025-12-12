import { PayGrade } from './types';
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
const mapBackendToFrontend = (backendData: any): PayGrade => {
  return {
    id: backendData._id || backendData.id,
    name: backendData.grade || backendData.name || '',
    description: backendData.description || '',
    status: normalizeStatus(backendData.status),
    createdBy: extractUserName(backendData.createdBy),
    createdAt: backendData.createdAt || new Date().toISOString(),
    updatedAt: backendData.updatedAt || new Date().toISOString(),
    version: backendData.version || 1,
    minSalary: backendData.baseSalary || 0,
    maxSalary: backendData.grossSalary || 0,
    currency: backendData.currency || 'EGP',
    jobGrade: backendData.jobGrade || '',
    jobBand: backendData.jobBand || '',
    benefits: backendData.benefits || [],
    isActive: backendData.isActive !== false,
    comments: backendData.comments,
    approvedBy: extractUserName(backendData.approvedBy),
  };
};

// Helper function to map frontend type to backend DTO
const mapFrontendToBackend = (frontendData: any) => {
  return {
    grade: frontendData.name || frontendData.grade,
    baseSalary: parseFloat(frontendData.minSalary) || parseFloat(frontendData.baseSalary) || 0,
    grossSalary: parseFloat(frontendData.maxSalary) || parseFloat(frontendData.grossSalary) || 0,
  };
};

export const payGradesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<PayGrade[]> => {
    try {
      const response = await api.get('/payroll-configuration/pay-grades');
      let payGrades = Array.isArray(response) ? response : response.data || response.items || [];
      
      // Map each item from backend to frontend format
      payGrades = payGrades.map(mapBackendToFrontend);
      
      // Filter by status if provided
      if (status) {
        payGrades = payGrades.filter((item: PayGrade) => 
          normalizeStatus(item.status) === status
        );
      }
      
      return payGrades;
    } catch (error) {
      console.error('Error fetching pay grades:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<PayGrade> => {
    try {
      const response = await api.get(`/payroll-configuration/pay-grades/${id}`);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error fetching pay grade ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Omit<PayGrade, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'status' | 'createdBy'>): Promise<PayGrade> => {
    try {
      // Map frontend data to backend DTO format
      const backendData = mapFrontendToBackend(data);
      
      // Validate required fields
      if (!backendData.grade) {
        throw new Error('Pay grade name is required');
      }
      if (!backendData.baseSalary || backendData.baseSalary < 6000) {
        throw new Error('Base salary must be at least 6000');
      }
      if (!backendData.grossSalary || backendData.grossSalary < 6000) {
        throw new Error('Gross salary must be at least 6000');
      }
      if (backendData.grossSalary < backendData.baseSalary) {
        throw new Error('Gross salary must be greater than or equal to base salary');
      }
      
      const response = await api.post('/payroll-configuration/pay-grades', backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error('Error creating pay grade:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<PayGrade>): Promise<PayGrade> => {
    try {
      // Map frontend data to backend DTO format
      const backendData: any = {};
      
      if (data.name !== undefined) backendData.grade = data.name;
      if (data.minSalary !== undefined) backendData.baseSalary = parseFloat(String(data.minSalary));
      if (data.maxSalary !== undefined) backendData.grossSalary = parseFloat(String(data.maxSalary));
      
      const response = await api.put(`/payroll-configuration/pay-grades/${id}`, backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error updating pay grade ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/payroll-configuration/pay-grades/${id}`);
    } catch (error) {
      console.error(`Error deleting pay grade ${id}:`, error);
      throw error;
    }
  }
};
