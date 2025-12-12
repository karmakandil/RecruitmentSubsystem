import api from '../client';
import {
  InsuranceBracket,
  ApiResponse,
  ConfigStatus,
} from './types';

export interface FilterDto {
  status?: ConfigStatus;
  page?: number;
  limit?: number;
}

export const insuranceBracketsApi = {
  getAll: async (filters?: FilterDto): Promise<InsuranceBracket[]> => {
    const response = await api.get('/payroll-configuration/insurance-brackets', {
      params: filters,
    });
    
    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    }
    
    // If response is an object, try to extract array
    if (response && typeof response === 'object') {
      const arrayData = (response as any).data || (response as any).insuranceBrackets || [];
      return Array.isArray(arrayData) ? arrayData : [];
    }
    
    return [];
  },

  getById: async (id: string): Promise<InsuranceBracket> => {
    const response = await api.get(
      `/payroll-configuration/insurance-brackets/${id}`
    );
    return response as InsuranceBracket;
  },

  approve: async (
    id: string,
    data?: { comment?: string }
  ): Promise<ApiResponse> => {
    const response = await api.post(
      `/payroll-configuration/insurance-brackets/${id}/approve`,
      data || {}
    );
    return response as ApiResponse;
  },

  reject: async (
    id: string,
    data: { comment: string }
  ): Promise<ApiResponse> => {
    const response = await api.post(
      `/payroll-configuration/insurance-brackets/${id}/reject`,
      data
    );
    return response as ApiResponse;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(
      `/payroll-configuration/insurance-brackets/${id}`
    );
    return response as ApiResponse;
  },
};

