import { PayGrade } from './types';
import { mockPayGrades } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const payGradesApi = {
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<PayGrade[]> => {
    await delay(500);
    let filtered = [...mockPayGrades];
    if (status) {
      filtered = filtered.filter((item: PayGrade) => item.status === status);
    }
    return filtered;
  },

  getById: async (id: string): Promise<PayGrade> => {
    await delay(300);
    const item = mockPayGrades.find((p: PayGrade) => p.id === id);
    if (!item) throw new Error(`Pay grade with ID ${id} not found`);
    return item;
  },

  create: async (data: Omit<PayGrade, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<PayGrade> => {
    await delay(500);
    const newItem: PayGrade = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      status: 'draft'
    };
    console.log('Created pay grade:', newItem);
    return newItem;
  },

  update: async (id: string, data: Partial<PayGrade>): Promise<PayGrade> => {
    await delay(500);
    const existing = mockPayGrades.find((p: PayGrade) => p.id === id);
    if (!existing) throw new Error(`Pay grade with ID ${id} not found`);
    if (existing.status !== 'draft') throw new Error('Cannot edit non-draft pay grades');
    
    const updated: PayGrade = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1
    };
    console.log('Updated pay grade:', updated);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const item = mockPayGrades.find((p: PayGrade) => p.id === id);
    if (!item) throw new Error(`Pay grade with ID ${id} not found`);
    if (item.status !== 'draft') throw new Error('Cannot delete non-draft pay grades');
    console.log(`Deleted pay grade: ${id}`);
    return;
  }
};