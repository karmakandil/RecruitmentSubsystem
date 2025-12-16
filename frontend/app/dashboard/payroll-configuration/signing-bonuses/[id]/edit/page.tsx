'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { signingBonusesApi } from '@/lib/api/payroll-configuration/signing-bonuses';
import { SigningBonus } from '@/lib/api/payroll-configuration/types';

export default function EditSigningBonusPage() {
  // Only Payroll Specialist can edit signing bonuses
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signingBonus, setSigningBonus] = useState<SigningBonus | null>(null);
  const [formData, setFormData] = useState({
    positionName: '',
    amount: '',
  });

  useEffect(() => {
    loadSigningBonus();
  }, [id]);

  const loadSigningBonus = async () => {
    try {
      setIsLoading(true);
      const data = await signingBonusesApi.getById(id);
      setSigningBonus(data);
      
      // Check if signing bonus can be edited
      if (data.status !== 'draft') {
        setError('Only draft signing bonuses can be edited.');
        return;
      }
      
      // Populate form with existing data
      setFormData({
        positionName: data.positionName || '',
        amount: data.amount?.toString() || '',
      });
    } catch (err) {
      console.error('Error loading signing bonus:', err);
      setError(err instanceof Error ? err.message : 'Failed to load signing bonus');
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
      if (!formData.positionName.trim()) {
        throw new Error('Position name is required');
      }
      if (!formData.amount || parseFloat(formData.amount) < 0) {
        throw new Error('Signing bonus amount must be non-negative');
      }
      
      // Prepare data for API
      const signingBonusData: Partial<SigningBonus> = {
        positionName: formData.positionName.trim(),
        amount: parseFloat(formData.amount),
      };
      
      await signingBonusesApi.update(id, signingBonusData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/signing-bonuses');
    } catch (err) {
      console.error('Error updating signing bonus:', err);
      setError(err instanceof Error ? err.message : 'Failed to update signing bonus');
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
          <div className="text-gray-500">Loading signing bonus...</div>
        </div>
      </div>
    );
  }

  if (!signingBonus) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Signing bonus not found</p>
        </div>
      </div>
    );
  }

  if (signingBonus.status !== 'draft') {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">
            This signing bonus cannot be edited because it is not in draft status. Only draft signing bonuses can be edited.
          </p>
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/signing-bonuses')}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700"
          >
            Back to Signing Bonuses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/signing-bonuses')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Signing Bonus</h1>
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
              disabled={isSaving}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

