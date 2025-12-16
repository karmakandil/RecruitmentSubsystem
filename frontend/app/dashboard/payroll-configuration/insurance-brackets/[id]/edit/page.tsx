'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { insuranceBracketsApi } from '@/lib/api/payroll-configuration/insurance-brackets';
import { InsuranceBracket } from '@/lib/api/payroll-configuration/types';

export default function EditInsuranceBracketPage() {
  // Payroll Specialist and HR Manager can edit insurance brackets
  useRequireAuth([SystemRole.PAYROLL_SPECIALIST, SystemRole.HR_MANAGER], '/dashboard');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insuranceBracket, setInsuranceBracket] = useState<InsuranceBracket | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    minSalary: '',
    maxSalary: '',
    employeeRate: '',
    employerRate: '',
    amount: '',
  });

  useEffect(() => {
    loadInsuranceBracket();
  }, [id]);

  const loadInsuranceBracket = async () => {
    try {
      setIsLoading(true);
      const data = await insuranceBracketsApi.getById(id);
      setInsuranceBracket(data);
      
      // Check if insurance bracket can be edited
      if (data.status !== 'draft') {
        setError('Only draft insurance brackets can be edited.');
        return;
      }
      
      // Populate form with existing data
      setFormData({
        name: data.name || '',
        minSalary: data.minSalary?.toString() || '',
        maxSalary: data.maxSalary?.toString() || '',
        employeeRate: data.employeeRate?.toString() || '',
        employerRate: data.employerRate?.toString() || '',
        amount: data.amount?.toString() || '',
      });
    } catch (err) {
      console.error('Error loading insurance bracket:', err);
      setError(err instanceof Error ? err.message : 'Failed to load insurance bracket');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    
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
      const insuranceBracketData: Partial<InsuranceBracket> = {
        name: formData.name.trim(),
        minSalary: minSalary,
        maxSalary: maxSalary,
        employeeRate: employeeRate,
        employerRate: employerRate,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
      };
      
      await insuranceBracketsApi.update(id, insuranceBracketData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/insurance-brackets');
    } catch (err) {
      console.error('Error updating insurance bracket:', err);
      setError(err instanceof Error ? err.message : 'Failed to update insurance bracket');
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading insurance bracket...</div>
        </div>
      </div>
    );
  }

  if (!insuranceBracket) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Insurance bracket not found</p>
        </div>
      </div>
    );
  }

  if (insuranceBracket.status !== 'draft') {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">
            This insurance bracket cannot be edited because it is not in draft status. Only draft insurance brackets can be edited.
          </p>
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
            className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700"
          >
            Back to Insurance Brackets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Insurance Bracket</h1>
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
              disabled={isSaving}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

