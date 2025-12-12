'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { payTypesApi } from '@/lib/api/payroll-configuration/payTypes';

export default function NewPayTypePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'salary',
    description: '',
    calculationMethod: '',
    isTaxable: false,
    isOvertimeEligible: false,
    amount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Pay type name is required');
      }
      if (!formData.amount || parseFloat(formData.amount) < 6000) {
        throw new Error('Pay type amount must be at least 6000');
      }
      
      // Prepare data for API
      const payTypeData = {
        name: formData.name,
        type: formData.type as 'hourly' | 'salary' | 'commission' | 'contract',
        description: formData.description || '',
        calculationMethod: formData.calculationMethod || '',
        isTaxable: formData.isTaxable,
        isOvertimeEligible: formData.isOvertimeEligible,
        amount: parseFloat(formData.amount),
      };
      
      await payTypesApi.create(payTypeData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/pay-types');
    } catch (err) {
      console.error('Error creating pay type:', err);
      setError(err instanceof Error ? err.message : 'Failed to create pay type');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/pay-types')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Pay Type</h1>
      </div>

      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto">
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pay Type Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Monthly Salary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="salary">Salary</option>
                <option value="hourly">Hourly</option>
                <option value="commission">Commission</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe this pay type..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount * (Minimum 6000)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="6000"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="6000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Calculation Method
              </label>
              <input
                type="text"
                name="calculationMethod"
                value={formData.calculationMethod}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., fixed, hourly_rate * hours"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isTaxable"
                  checked={formData.isTaxable}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Is Taxable
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isOvertimeEligible"
                  checked={formData.isOvertimeEligible}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Overtime Eligible
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/pay-types')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Pay Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}