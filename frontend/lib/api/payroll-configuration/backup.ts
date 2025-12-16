import api from '../client';

export interface BackupRecord {
  id: string;
  createdAt: string;
  updatedAt?: string;
  size: string;
  status: 'completed' | 'failed' | 'in-progress';
  type: 'manual' | 'scheduled';
  fileName?: string;
  description?: string;
}

export interface BackupSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time?: string; // Time of day for scheduled backups (HH:mm format)
  enabled: boolean;
}

export interface CreateBackupResponse {
  id: string;
  status: 'in-progress' | 'completed' | 'failed';
  message: string;
}

export const backupApi = {
  // Get backup history
  getHistory: async (): Promise<BackupRecord[]> => {
    try {
      const response = await api.get('/payroll-configuration/backups');
      
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response && typeof response === 'object') {
        const backups = (response as any).data || (response as any).backups || [];
        return Array.isArray(backups) ? backups : [];
      }
      return [];
    } catch (error: any) {
      // If endpoint doesn't exist (404), return empty array gracefully
      // Check multiple ways the error might be structured
      const status = error?.response?.status || error?.status;
      const statusCode = error?.response?.statusCode;
      const message = String(error?.message || error?.response?.data?.message || '');
      const url = String(error?.config?.url || error?.request?.responseURL || '');
      
      const is404 = status === 404 || 
                    statusCode === 404 ||
                    message.includes('404') || 
                    message.includes('Cannot GET') || 
                    message.includes('Not Found') ||
                    message.includes('not found') ||
                    (url.includes('/backups') && (status === 404 || statusCode === 404));
      
      if (is404) {
        // Silently return empty array - endpoint not implemented yet
        // Browser will still log the network error, but we handle it gracefully
        return [];
      }
      // Only log and throw for actual errors (not 404s)
      console.error('Error fetching backup history:', error);
      throw error;
    }
  },

  // Create manual backup
  createManualBackup: async (): Promise<CreateBackupResponse> => {
    try {
      const response = await api.post('/payroll-configuration/backups', {
        type: 'manual',
      });
      return response as CreateBackupResponse;
    } catch (error: any) {
      // If endpoint doesn't exist (404), throw a user-friendly error
      if (error?.response?.status === 404 || error?.message?.includes('404')) {
        throw new Error('Backup API endpoint not yet implemented. Please contact the development team.');
      }
      console.error('Error creating backup:', error);
      throw error;
    }
  },

  // Download backup file
  downloadBackup: async (backupId: string): Promise<Blob> => {
    try {
      const response = await api.get(
        `/payroll-configuration/backups/${backupId}/download`,
        {
          responseType: 'blob',
        }
      );
      return response as Blob;
    } catch (error: any) {
      // If endpoint doesn't exist (404), throw a user-friendly error
      if (error?.response?.status === 404 || error?.message?.includes('404')) {
        throw new Error('Backup download endpoint not yet implemented. Please contact the development team.');
      }
      console.error(`Error downloading backup ${backupId}:`, error);
      throw error;
    }
  },

  // Get backup schedule configuration
  getSchedule: async (): Promise<BackupSchedule | null> => {
    try {
      const response = await api.get('/payroll-configuration/backups/schedule');
      return response as BackupSchedule;
    } catch (error: any) {
      // If endpoint doesn't exist (404), return null gracefully
      // Check multiple ways the error might be structured
      const status = error?.response?.status || error?.status;
      const statusCode = error?.response?.statusCode;
      const message = String(error?.message || error?.response?.data?.message || '');
      const url = String(error?.config?.url || error?.request?.responseURL || '');
      
      const is404 = status === 404 || 
                    statusCode === 404 ||
                    message.includes('404') || 
                    message.includes('Cannot GET') || 
                    message.includes('Not Found') ||
                    message.includes('not found') ||
                    (url.includes('/backups') && (status === 404 || statusCode === 404));
      
      if (is404) {
        // Silently return null - endpoint not implemented yet
        // Browser will still log the network error, but we handle it gracefully
        return null;
      }
      // Only log and throw for actual errors (not 404s)
      console.error('Error fetching backup schedule:', error);
      throw error;
    }
  },

  // Update backup schedule
  updateSchedule: async (schedule: BackupSchedule): Promise<BackupSchedule> => {
    try {
      const response = await api.put('/payroll-configuration/backups/schedule', schedule);
      return response as BackupSchedule;
    } catch (error: any) {
      // If endpoint doesn't exist (404), throw a user-friendly error
      if (error?.response?.status === 404 || error?.message?.includes('404')) {
        throw new Error('Backup schedule API endpoint not yet implemented. Please contact the development team.');
      }
      console.error('Error updating backup schedule:', error);
      throw error;
    }
  },

  // Delete backup
  deleteBackup: async (backupId: string): Promise<void> => {
    try {
      await api.delete(`/payroll-configuration/backups/${backupId}`);
    } catch (error: any) {
      // If endpoint doesn't exist (404), throw a user-friendly error
      if (error?.response?.status === 404 || error?.message?.includes('404')) {
        throw new Error('Backup delete endpoint not yet implemented. Please contact the development team.');
      }
      console.error(`Error deleting backup ${backupId}:`, error);
      throw error;
    }
  },
};

