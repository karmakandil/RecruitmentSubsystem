import { TerminationBenefit } from './types';
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
const mapBackendToFrontend = (backendData: any): TerminationBenefit => {
  return {
    id: backendData._id || backendData.id,
    name: backendData.name || '',
    description: backendData.terms || `Termination/resignation benefit: ${backendData.name || ''}`,
    status: normalizeStatus(backendData.status),
    createdBy: extractUserName(backendData.createdBy),
    createdAt: backendData.createdAt || new Date().toISOString(),
    updatedAt: backendData.updatedAt || new Date().toISOString(),
    version: backendData.version || 1,
    amount: backendData.amount || 0,
    terms: backendData.terms || '',
    approvedBy: extractUserName(backendData.approvedBy),
    approvedAt: backendData.approvedAt,
  };
};

// Helper function to map frontend type to backend DTO
const mapFrontendToBackend = (frontendData: any) => {
  return {
    name: frontendData.name || '',
    amount: parseFloat(frontendData.amount) || 0,
    terms: frontendData.terms || '',
  };
};

export const terminationBenefitsApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<TerminationBenefit[]> => {
    try {
      const response = await api.get('/payroll-configuration/termination-benefits');
      // API interceptor returns response.data, so response is already the data at runtime
      // Use type assertion to handle different response formats
      const responseData = response as any;
      let terminationBenefits = Array.isArray(responseData) ? responseData : responseData.data || responseData.items || [];
      
      // Map each item from backend to frontend format
      terminationBenefits = terminationBenefits.map(mapBackendToFrontend);
      
      // Filter by status if provided
      if (status) {
        terminationBenefits = terminationBenefits.filter((item: TerminationBenefit) => 
          normalizeStatus(item.status) === status
        );
      }
      
      return terminationBenefits;
    } catch (error) {
      console.error('Error fetching termination benefits:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<TerminationBenefit> => {
    try {
      const response = await api.get(`/payroll-configuration/termination-benefits/${id}`);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error fetching termination benefit ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Omit<TerminationBenefit, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'status' | 'createdBy' | 'description'>): Promise<TerminationBenefit> => {
    try {
      // Map frontend data to backend DTO format
      const backendData = mapFrontendToBackend(data);
      
      // Validate required fields
      if (!backendData.name) {
        throw new Error('Termination benefit name is required');
      }
      if (backendData.amount < 0) {
        throw new Error('Termination benefit amount must be non-negative');
      }
      
      const response = await api.post('/payroll-configuration/termination-benefits', backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error('Error creating termination benefit:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<TerminationBenefit>): Promise<TerminationBenefit> => {
    try {
      // Map frontend data to backend DTO format
      const backendData: any = {};
      
      if (data.name !== undefined) backendData.name = data.name;
      if (data.amount !== undefined) backendData.amount = parseFloat(String(data.amount));
      if (data.terms !== undefined) backendData.terms = data.terms;
      
      const response = await api.put(`/payroll-configuration/termination-benefits/${id}`, backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error updating termination benefit ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/payroll-configuration/termination-benefits/${id}`);
    } catch (error) {
      console.error(`Error deleting termination benefit ${id}:`, error);
      throw error;
    }
  }
};

