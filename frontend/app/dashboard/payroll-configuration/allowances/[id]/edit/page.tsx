'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { allowancesApi } from '@/lib/api/payroll-configuration/allowances';

export default function EditAllowancePage() {
  // Only Payroll Specialist can edit allowances
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const params = useParams();
  const router = useRouter();
  const allowanceId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    allowanceType: 'transportation',
    amount: '',
    currency: 'EGP',
    isRecurring: true,
    frequency: 'monthly',
    taxable: false,
    effectiveDate: '',
  });

  useEffect(() => {
    loadAllowance();
  }, [allowanceId]);

  const loadAllowance = async () => {
    try {
      setIsLoadingData(true);
      const allowance = await allowancesApi.getById(allowanceId);
      
      // Convert allowance data to form format
      setFormData({
        name: allowance.name || '',
        description: allowance.description || '',
        allowanceType: allowance.allowanceType || 'transportation',
        amount: allowance.amount?.toString() || '',
        currency: allowance.currency || 'EGP',
        isRecurring: allowance.isRecurring ?? true,
        frequency: allowance.frequency || 'monthly',
        taxable: allowance.taxable ?? false,
        effectiveDate: allowance.effectiveDate ? new Date(allowance.effectiveDate).toISOString().split('T')[0] : '',
      });
    } catch (err) {
      console.error('Error loading allowance:', err);
      setError(err instanceof Error ? err.message : 'Failed to load allowance');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Allowance name is required');
      }
      if (!formData.amount || parseFloat(formData.amount) < 0) {
        throw new Error('Allowance amount must be non-negative');
      }
      
      // Prepare data for API
      const allowanceData = {
        name: formData.name,
        description: formData.description || '',
        allowanceType: formData.allowanceType as 'housing' | 'transportation' | 'meal' | 'education' | 'medical' | 'other',
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        isRecurring: formData.isRecurring,
        frequency: formData.frequency as 'monthly' | 'quarterly' | 'yearly' | 'one-time' | undefined,
        taxable: formData.taxable,
        effectiveDate: formData.effectiveDate || undefined,
      };
      
      await allowancesApi.update(allowanceId, allowanceData);
      
      // Redirect to allowance details
      router.push(`/dashboard/payroll-configuration/allowances/${allowanceId}`);
    } catch (err) {
      console.error('Error updating allowance:', err);
      setError(err instanceof Error ? err.message : 'Failed to update allowance');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseFloat(value) : value
    }));
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading allowance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/dashboard/payroll-configuration/allowances')}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Edit Allowance</h1>
                <p className="text-gray-600 mt-1 text-sm">Update allowance configuration details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Allowance Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-all duration-200"
                  placeholder="e.g., Transportation Allowance"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-all duration-200"
                  placeholder="Describe the allowance..."
                />
              </div>

              {/* Allowance Type and Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="allowanceType" className="block text-sm font-semibold text-gray-700 mb-2">
                    Allowance Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="allowanceType"
                    name="allowanceType"
                    value={formData.allowanceType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-all duration-200"
                  >
                    <option value="housing">Housing</option>
                    <option value="transportation">Transportation</option>
                    <option value="meal">Meal</option>
                    <option value="education">Education</option>
                    <option value="medical">Medical</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-all duration-200"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {formData.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Currency and Frequency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-all duration-200"
                  >
                    <option value="EGP">EGP (Egyptian Pound)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="frequency" className="block text-sm font-semibold text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    disabled={!formData.isRecurring}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
              </div>

              {/* Recurring and Taxable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    name="isRecurring"
                    checked={formData.isRecurring}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 border-2 border-emerald-300 rounded focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
                  />
                  <label htmlFor="isRecurring" className="ml-3 text-sm font-medium text-gray-700">
                    Recurring Allowance
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="taxable"
                    name="taxable"
                    checked={formData.taxable}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 border-2 border-emerald-300 rounded focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
                  />
                  <label htmlFor="taxable" className="ml-3 text-sm font-medium text-gray-700">
                    Taxable
                  </label>
                </div>
              </div>

              {/* Effective Date */}
              <div>
                <label htmlFor="effectiveDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Effective Date
                </label>
                <input
                  type="date"
                  id="effectiveDate"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-all duration-200"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Allowance'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/payroll-configuration/allowances')}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

