import { TaxRule } from './types';
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
const mapBackendToFrontend = (backendData: any): TaxRule => {
  return {
    id: backendData._id || backendData.id,
    name: backendData.name || '',
    description: backendData.description || '',
    status: normalizeStatus(backendData.status),
    createdBy: extractUserName(backendData.createdBy),
    createdAt: backendData.createdAt || new Date().toISOString(),
    updatedAt: backendData.updatedAt || new Date().toISOString(),
    version: backendData.version || 1,
    rate: backendData.rate || 0,
    effectiveDate: backendData.effectiveDate,
    exemptions: backendData.exemptions || [],
    thresholds: backendData.thresholds || {},
    isProgressive: backendData.isProgressive || false,
    approvedBy: extractUserName(backendData.approvedBy),
    approvedAt: backendData.approvedAt,
  };
};

// Helper function to map frontend type to backend DTO
const mapFrontendToBackend = (frontendData: any) => {
  return {
    name: frontendData.name || '',
    description: frontendData.description || '',
    rate: parseFloat(frontendData.rate) || 0,
    effectiveDate: frontendData.effectiveDate,
    exemptions: frontendData.exemptions || [],
    thresholds: frontendData.thresholds || {},
    isProgressive: frontendData.isProgressive || false,
  };
};

export const taxRulesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<TaxRule[]> => {
    try {
      const response = await api.get('/payroll-configuration/tax-rules');
      // The Axios response will have .data; backend might return array or object with "items"
      let raw = response?.data;
      let taxRules: any[] =
        Array.isArray(raw)
          ? raw
          : (raw && Array.isArray(raw.items) ? raw.items : []);
      
      // Map each item from backend to frontend format
      taxRules = taxRules.map(mapBackendToFrontend);
      // Filter by status if provided
      if (status) {
        taxRules = taxRules.filter((item: TaxRule) => 
          normalizeStatus(item.status) === status
        );
      }
      
      return taxRules;
    } catch (error) {
      console.error('Error fetching tax rules:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<TaxRule> => {
    try {
      const response = await api.get(`/payroll-configuration/tax-rules/${id}`);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error fetching tax rule ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Omit<TaxRule, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'status' | 'createdBy'>): Promise<TaxRule> => {
    try {
      // Map frontend data to backend DTO format
      const backendData = mapFrontendToBackend(data);
      
      // Validate required fields
      if (!backendData.name) {
        throw new Error('Tax rule name is required');
      }
      if (backendData.rate < 0) {
        throw new Error('Tax rate must be non-negative');
      }
      
      const response = await api.post('/payroll-configuration/tax-rules', backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error('Error creating tax rule:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<TaxRule>): Promise<TaxRule> => {
    try {
      // Map frontend data to backend DTO format
      const backendData: any = {};
      
      if (data.name !== undefined) backendData.name = data.name;
      if (data.description !== undefined) backendData.description = data.description;
      if (data.rate !== undefined) backendData.rate = parseFloat(String(data.rate));
      if (data.effectiveDate !== undefined) backendData.effectiveDate = data.effectiveDate;
      if (data.exemptions !== undefined) backendData.exemptions = data.exemptions;
      if (data.thresholds !== undefined) backendData.thresholds = data.thresholds;
      if (data.isProgressive !== undefined) backendData.isProgressive = data.isProgressive;
      
      const response = await api.put(`/payroll-configuration/tax-rules/${id}`, backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error updating tax rule ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/payroll-configuration/tax-rules/${id}`);
    } catch (error) {
      console.error(`Error deleting tax rule ${id}:`, error);
      throw error;
    }
  }
};

