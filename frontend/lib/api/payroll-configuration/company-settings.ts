import api from '../client';
import {
  CompanySettings,
  CreateCompanySettingsDto,
  UpdateCompanySettingsDto,
  ApiResponse,
} from './types';

export const companySettingsApi = {
  get: async (): Promise<CompanySettings> => {
    const response = await api.get('/payroll-configuration/company-settings');
    return response as CompanySettings;
  },

  create: async (
    data: CreateCompanySettingsDto
  ): Promise<ApiResponse<CompanySettings>> => {
    const response = await api.post(
      '/payroll-configuration/company-settings',
      data
    );
    return response as ApiResponse<CompanySettings>;
  },

  update: async (
    data: UpdateCompanySettingsDto
  ): Promise<ApiResponse<CompanySettings>> => {
    const response = await api.put(
      '/payroll-configuration/company-settings',
      data
    );
    return response as ApiResponse<CompanySettings>;
  },
};

