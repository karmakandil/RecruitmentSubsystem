'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { signingBonusesApi } from '@/lib/api/payroll-configuration/signing-bonuses';

export default function NewSigningBonusPage() {
  // Only Payroll Specialist can create new signing bonuses
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    positionName: '',
    amount: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.positionName.trim()) {
        throw new Error('Position name is required');
      }
      if (!formData.amount || parseFloat(formData.amount) < 0) {
        throw new Error('Signing bonus amount must be non-negative');
      }
      
      // Prepare data for API
      const signingBonusData = {
        positionName: formData.positionName.trim(),
        amount: parseFloat(formData.amount),
      };
      
      await signingBonusesApi.create(signingBonusData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/signing-bonuses');
    } catch (err) {
      console.error('Error creating signing bonus:', err);
      setError(err instanceof Error ? err.message : 'Failed to create signing bonus');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/signing-bonuses')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Signing Bonus</h1>
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
                Position Name *
              </label>
              <input
                type="text"
                name="positionName"
                value={formData.positionName}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="e.g., Junior TA, Mid TA, Senior TA, Software Engineer"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the position name that is eligible for this signing bonus. This should match the position name used in employee contracts.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Signing Bonus Amount (EGP) *
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="block w-full border border-gray-300 rounded-l-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="0.00"
                />
                <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  EGP
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter the signing bonus amount that will be awarded to new hires in this position.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This signing bonus policy will be created as a draft. After creation, it must be approved by a Payroll Manager before it can be used in the payroll system.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/signing-bonuses')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Signing Bonus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

