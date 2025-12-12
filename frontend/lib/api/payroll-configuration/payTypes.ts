import { PayType } from './types';
import { mockPayTypes } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const payTypesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<PayType[]> => {
    await delay(500);
    let filtered = [...mockPayTypes];
    if (status) filtered = filtered.filter((item: PayType) => item.status === status);
    return filtered;
  },

  getById: async (id: string): Promise<PayType> => {
    await delay(300);
    const item = mockPayTypes.find((p: PayType) => p.id === id);
    if (!item) throw new Error(`Pay type with ID ${id} not found`);
    return item;
  },

  create: async (data: Omit<PayType, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<PayType> => {
    await delay(500);
    const newItem: PayType = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      status: 'draft'
    };
    console.log('Created pay type:', newItem);
    return newItem;
  },

  update: async (id: string, data: Partial<PayType>): Promise<PayType> => {
    await delay(500);
    const existing = mockPayTypes.find((p: PayType) => p.id === id);
    if (!existing) throw new Error(`Pay type with ID ${id} not found`);
    if (existing.status !== 'draft') throw new Error('Cannot edit non-draft pay types');
    
    const updated: PayType = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1
    };
    console.log('Updated pay type:', updated);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const item = mockPayTypes.find((p: PayType) => p.id === id);
    if (!item) throw new Error(`Pay type with ID ${id} not found`);
    if (item.status !== 'draft') throw new Error('Cannot delete non-draft pay types');
    console.log(`Deleted pay type: ${id}`);
    return;
  }
};