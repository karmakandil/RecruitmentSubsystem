import { PayType } from './types';
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
const mapBackendToFrontend = (backendData: any): PayType & { _amount?: number } => {
  return {
    id: backendData._id || backendData.id,
    name: backendData.type || backendData.name || '',
    description: backendData.description || '',
    status: normalizeStatus(backendData.status),
    createdBy: extractUserName(backendData.createdBy),
    createdAt: backendData.createdAt || new Date().toISOString(),
    updatedAt: backendData.updatedAt || new Date().toISOString(),
    version: backendData.version || 1,
    type: (backendData.type as 'hourly' | 'salary' | 'commission' | 'contract') || 'salary',
    calculationMethod: backendData.calculationMethod || '',
    isTaxable: backendData.isTaxable !== false,
    isOvertimeEligible: backendData.isOvertimeEligible || false,
    overtimeRate: backendData.overtimeRate,
    minHours: backendData.minHours,
    maxHours: backendData.maxHours,
    _amount: backendData.amount, // Store amount for updates
  } as PayType & { _amount?: number };
};

// Helper function to map frontend type to backend DTO
const mapFrontendToBackend = (frontendData: any) => {
  return {
    type: frontendData.name || frontendData.type || '',
    amount: parseFloat(frontendData.amount) || 0,
  };
};

export const payTypesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<PayType[]> => {
    try {
      const response = await api.get('/payroll-configuration/pay-types');
      let payTypes = Array.isArray(response) ? response : response.data || response.items || [];
      
      // Map each item from backend to frontend format
      payTypes = payTypes.map(mapBackendToFrontend);
      
      // Filter by status if provided
      if (status) {
        payTypes = payTypes.filter((item: PayType) => 
          normalizeStatus(item.status) === status
        );
      }
      
      return payTypes;
    } catch (error) {
      console.error('Error fetching pay types:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<PayType> => {
    try {
      const response = await api.get(`/payroll-configuration/pay-types/${id}`);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error fetching pay type ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Omit<PayType, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'status' | 'createdBy'>): Promise<PayType> => {
    try {
      // Map frontend data to backend DTO format
      const backendData = mapFrontendToBackend(data);
      
      // Validate required fields
      if (!backendData.type) {
        throw new Error('Pay type name is required');
      }
      if (!backendData.amount || backendData.amount < 6000) {
        throw new Error('Pay type amount must be at least 6000');
      }
      
      const response = await api.post('/payroll-configuration/pay-types', backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error('Error creating pay type:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<PayType & { amount?: number }>): Promise<PayType> => {
    try {
      // First, get the current pay type to preserve the amount field
      const currentPayType = await payTypesApi.getById(id);
      const currentAmount = (currentPayType as any)._amount || 6000; // Default to 6000 if not found
      
      // Map frontend data to backend DTO format
      const backendData: any = {};
      
      // Map name to type (backend expects 'type' field)
      if (data.name !== undefined) {
        backendData.type = data.name;
      } else if (data.type !== undefined) {
        backendData.type = data.type;
      }
      
      // Preserve or update the amount field
      if (data.amount !== undefined) {
        backendData.amount = parseFloat(String(data.amount));
      } else {
        // Preserve existing amount
        backendData.amount = currentAmount;
      }
      
      // Validate amount
      if (backendData.amount < 6000) {
        throw new Error('Pay type amount must be at least 6000');
      }
      
      const response = await api.put(`/payroll-configuration/pay-types/${id}`, backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error updating pay type ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/payroll-configuration/pay-types/${id}`);
    } catch (error) {
      console.error(`Error deleting pay type ${id}:`, error);
      throw error;
    }
  }
};
