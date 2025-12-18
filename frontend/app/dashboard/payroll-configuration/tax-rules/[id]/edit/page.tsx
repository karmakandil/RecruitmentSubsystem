'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { taxRulesApi } from '@/lib/api/payroll-configuration/tax-rules';
import { TaxRule } from '@/lib/api/payroll-configuration/types';

export default function EditTaxRulePage() {
  // Only Legal & Policy Admin can edit tax rules
  useRequireAuth(SystemRole.LEGAL_POLICY_ADMIN, '/dashboard');
  const params = useParams();
  const router = useRouter();
  const taxRuleId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taxRule, setTaxRule] = useState<TaxRule | null>(null);
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

  useEffect(() => {
    loadTaxRule();
  }, [taxRuleId]);

  const loadTaxRule = async () => {
    try {
      setIsLoadingData(true);
      const data = await taxRulesApi.getById(taxRuleId);
      setTaxRule(data);
      
      // Check if tax rule can be edited
      if (data.status === 'rejected') {
        setError('Rejected tax rules cannot be edited.');
        return;
      }
      
      // Populate form with existing data
      setFormData({
        name: data.name || '',
        description: data.description || '',
        rate: data.rate?.toString() || '',
        effectiveDate: data.effectiveDate ? new Date(data.effectiveDate).toISOString().split('T')[0] : '',
        isProgressive: data.isProgressive || false,
        minAmount: data.thresholds?.minAmount?.toString() || '',
        maxAmount: data.thresholds?.maxAmount?.toString() || '',
        exemptions: data.exemptions?.join(', ') || '',
      });
    } catch (err) {
      console.error('Error loading tax rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tax rule');
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
        throw new Error('Tax rule name is required');
      }
      if (!formData.rate || parseFloat(formData.rate) < 0 || parseFloat(formData.rate) > 100) {
        throw new Error('Tax rate must be between 0 and 100');
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
      const taxRuleData: Partial<TaxRule> = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        rate: parseFloat(formData.rate),
        effectiveDate: formData.effectiveDate || undefined,
        isProgressive: formData.isProgressive,
        exemptions: exemptionsList,
        thresholds: Object.keys(thresholds).length > 0 ? thresholds : undefined,
      };
      
      await taxRulesApi.update(taxRuleId, taxRuleData);
      
      // Redirect back to list
      router.push('/dashboard/payroll-configuration/tax-rules');
    } catch (err) {
      console.error('Error updating tax rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to update tax rule');
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

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading tax rule...</p>
        </div>
      </div>
    );
  }

  if (!taxRule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-semibold">{error || 'Tax rule not found'}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Tax Rules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
          className="mb-6 group flex items-center gap-2 text-gray-600 hover:text-slate-600 transition-colors duration-200"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span className="font-medium">Back to Tax Rules</span>
        </button>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">Edit Tax Rule</h1>
            <p className="text-gray-600 mt-1 text-sm">Update tax rule information and settings</p>
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
                  Tax Rule Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                  placeholder="Enter tax rule name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 resize-none"
                  placeholder="Enter tax rule description"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="rate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tax Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>

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
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isProgressive"
                  name="isProgressive"
                  checked={formData.isProgressive}
                  onChange={handleChange}
                  className="w-5 h-5 text-slate-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 cursor-pointer"
                />
                <label htmlFor="isProgressive" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer">
                  Progressive Tax Rate
                </label>
              </div>
            </div>

            {/* Thresholds */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Thresholds</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="minAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Amount (EGP)
                  </label>
                  <input
                    type="number"
                    id="minAmount"
                    name="minAmount"
                    value={formData.minAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="maxAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                    Maximum Amount (EGP)
                  </label>
                  <input
                    type="number"
                    id="maxAmount"
                    name="maxAmount"
                    value={formData.maxAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Exemptions */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Exemptions</h2>
              
              <div>
                <label htmlFor="exemptions" className="block text-sm font-semibold text-gray-700 mb-2">
                  Exemptions (comma-separated)
                </label>
                <textarea
                  id="exemptions"
                  name="exemptions"
                  value={formData.exemptions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 resize-none"
                  placeholder="Enter exemptions separated by commas (e.g., Medical, Education)"
                />
                <p className="mt-2 text-xs text-gray-500">Separate multiple exemptions with commas</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-slate-700 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

