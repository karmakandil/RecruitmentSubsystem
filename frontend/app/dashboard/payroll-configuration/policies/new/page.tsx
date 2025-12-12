'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { policiesApi } from '@/lib/api/payroll-configuration/policies';

export default function NewPolicyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    policyType: 'overtime',
    effectiveDate: '',
    department: '',
    location: '',
    rules_overtimeRate: '1.5',
    rules_maxOvertimeHours: '20',
    applicability: 'All Employees',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Client-side validation
    if (!formData.name.trim()) {
      setError('Policy name is required');
      setIsLoading(false);
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      setIsLoading(false);
      return;
    }
    
    if (!formData.effectiveDate) {
      setError('Effective date is required');
      setIsLoading(false);
      return;
    }
    
    try {
      // Convert form data to API format
      const policyData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        policyType: formData.policyType,
        effectiveDate: formData.effectiveDate ? new Date(formData.effectiveDate).toISOString() : new Date().toISOString(),
        department: formData.department?.trim() || undefined,
        location: formData.location?.trim() || undefined,
        rules: {
          overtimeRate: parseFloat(formData.rules_overtimeRate) || 1.5,
          maxOvertimeHours: parseInt(formData.rules_maxOvertimeHours) || 20,
        },
        applicability: formData.applicability,
      };
      
      await policiesApi.create(policyData);
      
      // Redirect to policies list
      router.push('/dashboard/payroll-configuration/policies');
    } catch (err) {
      console.error('Error creating policy:', err);
      setError(err instanceof Error ? err.message : 'Failed to create policy');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/policies')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Policy</h1>
      </div>

      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto">
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Policy Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Overtime Policy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Policy Type *
                </label>
                <select
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="attendance">Attendance Policy</option>
                  <option value="overtime">Overtime Policy</option>
                  <option value="bonus">Bonus Policy</option>
                  <option value="deduction">Deduction Policy</option>
                  <option value="other">Other Policy</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe this policy..."
                />
                <p className="mt-1 text-xs text-gray-500">Description is required</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Effective Date *
                </label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department (Optional)
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Engineering"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Cairo Office"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Applicability *
                </label>
                <select
                  name="applicability"
                  value={formData.applicability}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="All Employees">All Employees</option>
                  <option value="Full Time Employees">Full Time Employees</option>
                  <option value="Part Time Employees">Part Time Employees</option>
                  <option value="Contractors">Contractors</option>
                </select>
              </div>
            </div>
          </div>

          {/* Policy Rules */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Policy Rules</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Overtime Rate
                </label>
                <input
                  type="number"
                  name="rules_overtimeRate"
                  value={formData.rules_overtimeRate}
                  onChange={handleChange}
                  step="0.1"
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">Multiplier for overtime hours (e.g., 1.5 for time and a half)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Overtime Hours
                </label>
                <input
                  type="number"
                  name="rules_maxOvertimeHours"
                  value={formData.rules_maxOvertimeHours}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">Maximum overtime hours allowed per month</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/policies')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}