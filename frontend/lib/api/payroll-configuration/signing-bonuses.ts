import { SigningBonus } from './types';
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
const mapBackendToFrontend = (backendData: any): SigningBonus => {
  return {
    id: backendData._id || backendData.id,
    name: backendData.positionName || '', // Use positionName as name for consistency
    description: `Signing bonus for ${backendData.positionName || ''} position`,
    status: normalizeStatus(backendData.status),
    createdBy: extractUserName(backendData.createdBy),
    createdAt: backendData.createdAt || new Date().toISOString(),
    updatedAt: backendData.updatedAt || new Date().toISOString(),
    version: backendData.version || 1,
    positionName: backendData.positionName || '',
    amount: backendData.amount || 0,
    approvedBy: extractUserName(backendData.approvedBy),
    approvedAt: backendData.approvedAt,
  };
};

// Helper function to map frontend type to backend DTO
const mapFrontendToBackend = (frontendData: any) => {
  return {
    positionName: frontendData.positionName || '',
    amount: parseFloat(frontendData.amount) || 0,
  };
};

export const signingBonusesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<SigningBonus[]> => {
    try {
      const response = await api.get('/payroll-configuration/signing-bonuses');
      // Axios responses are not arrays, so always get the array from .data
      let signingBonuses = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.items) ? response.data.items : []);
      
      // Map each item from backend to frontend format
      signingBonuses = signingBonuses.map(mapBackendToFrontend);
      // Filter by status if provided
      if (status) {
        signingBonuses = signingBonuses.filter((item: SigningBonus) => 
          normalizeStatus(item.status) === status
        );
      }
      
      return signingBonuses;
    } catch (error) {
      console.error('Error fetching signing bonuses:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<SigningBonus> => {
    try {
      const response = await api.get(`/payroll-configuration/signing-bonuses/${id}`);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error fetching signing bonus ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Omit<SigningBonus, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'status' | 'createdBy' | 'name' | 'description'>): Promise<SigningBonus> => {
    try {
      // Map frontend data to backend DTO format
      const backendData = mapFrontendToBackend(data);
      
      // Validate required fields
      if (!backendData.positionName) {
        throw new Error('Position name is required');
      }
      if (backendData.amount < 0) {
        throw new Error('Signing bonus amount must be non-negative');
      }
      
      const response = await api.post('/payroll-configuration/signing-bonuses', backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error('Error creating signing bonus:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<SigningBonus>): Promise<SigningBonus> => {
    try {
      // Map frontend data to backend DTO format
      const backendData: any = {};
      
      if (data.positionName !== undefined) backendData.positionName = data.positionName;
      if (data.amount !== undefined) backendData.amount = parseFloat(String(data.amount));
      
      const response = await api.put(`/payroll-configuration/signing-bonuses/${id}`, backendData);
      return mapBackendToFrontend(response);
    } catch (error) {
      console.error(`Error updating signing bonus ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/payroll-configuration/signing-bonuses/${id}`);
    } catch (error) {
      console.error(`Error deleting signing bonus ${id}:`, error);
      throw error;
    }
  }
};

