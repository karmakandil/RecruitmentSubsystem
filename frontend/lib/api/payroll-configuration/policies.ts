import { PayrollPolicy } from './types';
import { mockPolicies } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const policiesApi = {
  // Get all policies (with optional status filter)
  getAll: async (status?: 'draft' | 'approved' | 'rejected'): Promise<PayrollPolicy[]> => {
    await delay(500); // Simulate network delay
    
    let filteredPolicies = [...mockPolicies]; // Create a copy
    
    if (status) {
      filteredPolicies = filteredPolicies.filter((policy: PayrollPolicy) => policy.status === status);
    }
    
    return filteredPolicies;
  },

  // Get single policy
  getById: async (id: string): Promise<PayrollPolicy> => {
    await delay(300);
    
    const policy = mockPolicies.find((p: PayrollPolicy) => p.id === id);
    
    if (!policy) {
      throw new Error(`Policy with ID ${id} not found`);
    }
    
    return policy;
  },

  // Create new policy
  create: async (data: Omit<PayrollPolicy, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<PayrollPolicy> => {
    await delay(500);
    
    const newPolicy: PayrollPolicy = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      status: 'draft' // Always draft when created
    };
    
    console.log('Created new policy:', newPolicy);
    
    return newPolicy;
  },

  // Update policy
  update: async (id: string, data: Partial<PayrollPolicy>): Promise<PayrollPolicy> => {
    await delay(500);
    
    const existingPolicy = mockPolicies.find((p: PayrollPolicy) => p.id === id);
    
    if (!existingPolicy) {
      throw new Error(`Policy with ID ${id} not found`);
    }
    
    if (existingPolicy.status !== 'draft') {
      throw new Error('Cannot edit non-draft policies');
    }
    
    const updatedPolicy: PayrollPolicy = {
      ...existingPolicy,
      ...data,
      updatedAt: new Date().toISOString(),
      version: existingPolicy.version + 1
    };
    
    console.log('Updated policy:', updatedPolicy);
    
    return updatedPolicy;
  },

  // Delete policy
  delete: async (id: string): Promise<void> => {
    await delay(300);
    
    const policyIndex = mockPolicies.findIndex((p: PayrollPolicy) => p.id === id);
    
    if (policyIndex === -1) {
      throw new Error(`Policy with ID ${id} not found`);
    }
    
    const policy = mockPolicies[policyIndex];
    
    if (policy.status !== 'draft') {
      throw new Error('Cannot delete non-draft policies');
    }
    
    console.log(`Deleted policy with ID: ${id}`);
    
    return;
  }
};