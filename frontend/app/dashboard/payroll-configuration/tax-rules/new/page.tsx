'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { taxRulesApi } from '@/lib/api/payroll-configuration/tax-rules';

export default function NewTaxRulePage() {
  // Only Legal & Policy Admin can create new tax rules
  useRequireAuth(SystemRole.LEGAL_POLICY_ADMIN, '/dashboard');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rate: '',
    effectiveDate: '',
    isProgressive: false,
    minAmount: '',
    maxAmount: '',
    exemptions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Tax rule name is required');
      }
      if (!formData.rate || parseFloat(formData.rate) < 0) {
        throw new Error('Tax rate must be non-negative');
      }
      
      // Parse exemptions (comma-separated)
      const exemptionsList = formData.exemptions
        ? formData.exemptions.split(',').map(e => e.trim()).filter(e => e.length > 0)
        : [];
      
      // Build thresholds object
      const thresholds: any = {};
      if (formData.minAmount) {
        thresholds.minAmount = parseFloat(formData.minAmount);
      }
      if (formData.maxAmount) {
        thresholds.maxAmount = parseFloat(formData.maxAmount);
      }
      
      // Prepare data for API
      const taxRuleData = {
        name: formData.name,
        description: formData.description || '',
        rate: parseFloat(formData.rate),
        effectiveDate: formData.effectiveDate || undefined,
        isProgressive: formData.isProgressive,
        exemptions: exemptionsList,
        thresholds: Object.keys(thresholds).length > 0 ? thresholds : undefined,
      };
      
      await taxRulesApi.create(taxRuleData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/tax-rules');
    } catch (err) {
      console.error('Error creating tax rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to create tax rule');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Tax Rule</h1>
      </div>

      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto">
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Tax Rule Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., Income Tax, Progressive Tax Rate"
              />
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Describe this tax rule and its legal basis..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Rate (%) *
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="block w-full border border-gray-300 rounded-l-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="0.00"
                />
                <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  %
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">Enter the tax rate as a percentage (e.g., 15.5 for 15.5%)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Effective Date (Optional)
              </label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isProgressive"
                  checked={formData.isProgressive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isProgressive: e.target.checked }))}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Progressive Tax Rate
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">Check this if this tax rule uses progressive rates based on income brackets</p>
            </div>

            <div className="sm:col-span-2 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thresholds (Optional)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Amount (EGP)
                  </label>
                  <input
                    type="number"
                    name="minAmount"
                    value={formData.minAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Amount (EGP)
                  </label>
                  <input
                    type="number"
                    name="maxAmount"
                    value={formData.maxAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 border-t pt-4">
              <label className="block text-sm font-medium text-gray-700">
                Exemptions (Optional)
              </label>
              <textarea
                name="exemptions"
                value={formData.exemptions}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter exemptions separated by commas (e.g., Medical expenses, Education fees, Charitable donations)"
              />
              <p className="mt-1 text-sm text-gray-500">List tax exemptions that apply to this rule, separated by commas</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Tax Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

