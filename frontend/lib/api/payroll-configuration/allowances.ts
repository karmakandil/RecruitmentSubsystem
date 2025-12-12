import { Allowance } from './types';
import { mockAllowances } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const allowancesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<Allowance[]> => {
    await delay(500);
    let filtered = [...mockAllowances];
    if (status) filtered = filtered.filter((item: Allowance) => item.status === status);
    return filtered;
  },

  getById: async (id: string): Promise<Allowance> => {
    await delay(300);
    const item = mockAllowances.find((p: Allowance) => p.id === id);
    if (!item) throw new Error(`Allowance with ID ${id} not found`);
    return item;
  },

  create: async (data: Omit<Allowance, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Allowance> => {
    await delay(500);
    const newItem: Allowance = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      status: 'draft'
    };
    console.log('Created allowance:', newItem);
    return newItem;
  },

  update: async (id: string, data: Partial<Allowance>): Promise<Allowance> => {
    await delay(500);
    const existing = mockAllowances.find((p: Allowance) => p.id === id);
    if (!existing) throw new Error(`Allowance with ID ${id} not found`);
    if (existing.status !== 'draft') throw new Error('Cannot edit non-draft allowances');
    
    const updated: Allowance = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1
    };
    console.log('Updated allowance:', updated);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const item = mockAllowances.find((p: Allowance) => p.id === id);
    if (!item) throw new Error(`Allowance with ID ${id} not found`);
    if (item.status !== 'draft') throw new Error('Cannot delete non-draft allowances');
    console.log(`Deleted allowance: ${id}`);
    return;
  }
};