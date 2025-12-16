'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { terminationBenefitsApi } from '@/lib/api/payroll-configuration/termination-benefits';
import { TerminationBenefit } from '@/lib/api/payroll-configuration/types';

export default function EditTerminationBenefitPage() {
  // Only Payroll Specialist can edit termination benefits
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [terminationBenefit, setTerminationBenefit] = useState<TerminationBenefit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    terms: '',
  });

  useEffect(() => {
    loadTerminationBenefit();
  }, [id]);

  const loadTerminationBenefit = async () => {
    try {
      setIsLoading(true);
      const data = await terminationBenefitsApi.getById(id);
      setTerminationBenefit(data);
      
      // Check if termination benefit can be edited
      if (data.status !== 'draft') {
        setError('Only draft termination benefits can be edited.');
        return;
      }
      
      // Populate form with existing data
      setFormData({
        name: data.name || '',
        amount: data.amount?.toString() || '',
        terms: data.terms || '',
      });
    } catch (err) {
      console.error('Error loading termination benefit:', err);
      setError(err instanceof Error ? err.message : 'Failed to load termination benefit');
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
        throw new Error('Termination benefit name is required');
      }
      if (!formData.amount || parseFloat(formData.amount) < 0) {
        throw new Error('Termination benefit amount must be non-negative');
      }
      
      // Prepare data for API
      const terminationBenefitData: Partial<TerminationBenefit> = {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        terms: formData.terms.trim() || undefined,
      };
      
      await terminationBenefitsApi.update(id, terminationBenefitData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/termination-benefits');
    } catch (err) {
      console.error('Error updating termination benefit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update termination benefit');
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
          <div className="text-gray-500">Loading termination benefit...</div>
        </div>
      </div>
    );
  }

  if (!terminationBenefit) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Termination benefit not found</p>
        </div>
      </div>
    );
  }

  if (terminationBenefit.status !== 'draft') {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">
            This termination benefit cannot be edited because it is not in draft status. Only draft termination benefits can be edited.
          </p>
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Back to Termination Benefits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Termination Benefit</h1>
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
                Benefit Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., End of Service Benefit, Resignation Compensation, Termination Package"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a descriptive name for this termination or resignation benefit.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Benefit Amount (EGP) *
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
                  className="block w-full border border-gray-300 rounded-l-md py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="0.00"
                />
                <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                  EGP
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter the benefit amount that will be awarded upon employee termination or resignation.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Terms and Conditions (Optional)
              </label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                rows={6}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter the terms and conditions for this benefit, including eligibility criteria, payment schedule, legal compliance requirements, etc."
              />
              <p className="mt-1 text-sm text-gray-500">
                Describe the terms, conditions, and eligibility criteria for this termination benefit. Include any legal compliance requirements or payment schedules.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

