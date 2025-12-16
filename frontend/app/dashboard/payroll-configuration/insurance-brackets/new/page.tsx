'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { insuranceBracketsApi } from '@/lib/api/payroll-configuration/insurance-brackets';

export default function NewInsuranceBracketPage() {
  // Only Payroll Specialist can create new insurance brackets
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    minSalary: '',
    maxSalary: '',
    employeeRate: '',
    employerRate: '',
    amount: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Insurance bracket name is required');
      }
      const minSalary = parseFloat(formData.minSalary);
      const maxSalary = parseFloat(formData.maxSalary);
      const employeeRate = parseFloat(formData.employeeRate);
      const employerRate = parseFloat(formData.employerRate);
      
      if (isNaN(minSalary) || minSalary < 0) {
        throw new Error('Minimum salary must be a non-negative number');
      }
      if (isNaN(maxSalary) || maxSalary < 0) {
        throw new Error('Maximum salary must be a non-negative number');
      }
      if (minSalary >= maxSalary) {
        throw new Error('Minimum salary must be less than maximum salary');
      }
      if (isNaN(employeeRate) || employeeRate < 0 || employeeRate > 100) {
        throw new Error('Employee contribution rate must be between 0 and 100');
      }
      if (isNaN(employerRate) || employerRate < 0 || employerRate > 100) {
        throw new Error('Employer contribution rate must be between 0 and 100');
      }
      
      // Prepare data for API
      const insuranceBracketData = {
        name: formData.name.trim(),
        minSalary: minSalary,
        maxSalary: maxSalary,
        employeeRate: employeeRate,
        employerRate: employerRate,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
      };
      
      await insuranceBracketsApi.create(insuranceBracketData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/insurance-brackets');
    } catch (err) {
      console.error('Error creating insurance bracket:', err);
      setError(err instanceof Error ? err.message : 'Failed to create insurance bracket');
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
          onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Insurance Bracket</h1>
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
                Insurance Bracket Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="e.g., Social Insurance, Health Insurance, Life Insurance"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a descriptive name for this insurance bracket (e.g., social, health insurance).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Salary (EGP) *
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="minSalary"
                  value={formData.minSalary}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="block w-full border border-gray-300 rounded-l-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="0.00"
                />
                <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  EGP
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Minimum salary threshold for this bracket.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Salary (EGP) *
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="maxSalary"
                  value={formData.maxSalary}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="block w-full border border-gray-300 rounded-l-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="0.00"
                />
                <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  EGP
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Maximum salary threshold for this bracket. Must be greater than minimum salary.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee Contribution Rate (%) *
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="employeeRate"
                  value={formData.employeeRate}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="block w-full border border-gray-300 rounded-l-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="0.00"
                />
                <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  %
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Employee contribution percentage (0-100%).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employer Contribution Rate (%) *
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="employerRate"
                  value={formData.employerRate}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="block w-full border border-gray-300 rounded-l-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="0.00"
                />
                <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  %
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Employer contribution percentage (0-100%).
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Fixed Insurance Amount (EGP) - Optional
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="block w-full border border-gray-300 rounded-l-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="0.00 (leave empty if using percentage-based calculation)"
                />
                <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  EGP
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Optional fixed insurance amount. If not provided, the system will calculate based on salary and contribution rates.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This insurance bracket will be created as a draft. After creation, it must be approved by an HR Manager before it can be used in the payroll system. Ensure all rates and salary ranges comply with local insurance policies and laws.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Insurance Bracket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

