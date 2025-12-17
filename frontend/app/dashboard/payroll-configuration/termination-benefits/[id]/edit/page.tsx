'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { terminationBenefitsApi } from '@/lib/api/payroll-configuration/termination-benefits';
import { TerminationBenefit } from '@/lib/api/payroll-configuration/types';

export default function EditTerminationBenefitPage() {
  // Only Payroll Specialist can edit termination benefits
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const params = useParams();
  const router = useRouter();
  const terminationBenefitId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terminationBenefit, setTerminationBenefit] = useState<TerminationBenefit | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    terms: '',
  });

  useEffect(() => {
    loadTerminationBenefit();
  }, [terminationBenefitId]);

  const loadTerminationBenefit = async () => {
    try {
      setIsLoadingData(true);
      const data = await terminationBenefitsApi.getById(terminationBenefitId);
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
        terms: (data as any).terms || '',
      });
    } catch (err) {
      console.error('Error loading termination benefit:', err);
      setError(err instanceof Error ? err.message : 'Failed to load termination benefit');
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
      
      await terminationBenefitsApi.update(terminationBenefitId, terminationBenefitData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/termination-benefits');
    } catch (err) {
      console.error('Error updating termination benefit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update termination benefit');
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

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading termination benefit...</p>
        </div>
      </div>
    );
  }

  if (!terminationBenefit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-semibold">{error || 'Termination benefit not found'}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Termination Benefits
          </button>
        </div>
      </div>
    );
  }

  if (terminationBenefit.status !== 'draft') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">Cannot Edit</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  This termination benefit cannot be edited because it is not in draft status. Only draft termination benefits can be edited.
                </p>
                <button
                  onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Back to Termination Benefits
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
          className="mb-6 group flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors duration-200"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span className="font-medium">Back to Termination Benefits</span>
        </button>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">Edit Termination Benefit</h1>
            <p className="text-gray-600 mt-1 text-sm">Update termination benefit information and settings</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 font-medium text-sm">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Basic Information</h2>
              
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Termination Benefit Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                  placeholder="Enter termination benefit name"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Benefit Amount (EGP) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="terms" className="block text-sm font-semibold text-gray-700 mb-2">
                  Terms and Conditions
                </label>
                <textarea
                  id="terms"
                  name="terms"
                  value={formData.terms}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 resize-none"
                  placeholder="Enter terms and conditions for this termination benefit"
                />
                <p className="mt-2 text-xs text-gray-500">Describe the terms and conditions under which this benefit applies</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-rose-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

