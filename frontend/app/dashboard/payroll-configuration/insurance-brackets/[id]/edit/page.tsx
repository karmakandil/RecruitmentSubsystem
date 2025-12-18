'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { insuranceBracketsApi } from '@/lib/api/payroll-configuration/insurance-brackets';

export default function EditInsuranceBracketPage() {
  // Only Payroll Specialist can edit insurance brackets
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const params = useParams();
  const router = useRouter();
  const insuranceBracketId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  }, [insuranceBracketId]);

  const loadInsuranceBracket = async () => {
    try {
      setIsLoadingData(true);
      const insuranceBracket = await insuranceBracketsApi.getById(insuranceBracketId);
      
      // Convert insurance bracket data to form format
      // Handle both employeeRate/employerRate and employeeContribution/employerContribution
      const employeeRate = (insuranceBracket as any).employeeRate ?? (insuranceBracket as any).employeeContribution ?? 0;
      const employerRate = (insuranceBracket as any).employerRate ?? (insuranceBracket as any).employerContribution ?? 0;
      
      setFormData({
        name: (insuranceBracket as any).name || '',
        minSalary: insuranceBracket.minSalary?.toString() || '',
        maxSalary: insuranceBracket.maxSalary?.toString() || '',
        employeeRate: employeeRate.toString(),
        employerRate: employerRate.toString(),
        amount: (insuranceBracket as any).amount?.toString() || '',
      });
    } catch (err) {
      console.error('Error loading insurance bracket:', err);
      setError(err instanceof Error ? err.message : 'Failed to load insurance bracket');
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
      const insuranceBracketData: any = {
        name: formData.name.trim(),
        minSalary: minSalary,
        maxSalary: maxSalary,
        employeeRate: employeeRate,
        employerRate: employerRate,
      };
      
      if (formData.amount && parseFloat(formData.amount) >= 0) {
        insuranceBracketData.amount = parseFloat(formData.amount);
      }
      
      await insuranceBracketsApi.update(insuranceBracketId, insuranceBracketData);
      
      // Redirect to insurance bracket details
      router.push(`/dashboard/payroll-configuration/insurance-brackets/${insuranceBracketId}`);
    } catch (err) {
      console.error('Error updating insurance bracket:', err);
      setError(err instanceof Error ? err.message : 'Failed to update insurance bracket');
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading insurance bracket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Edit Insurance Bracket</h1>
                <p className="text-gray-600 mt-1 text-sm">Update insurance bracket configuration details</p>
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
                  Insurance Bracket Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 transition-all duration-200"
                  placeholder="e.g., Social Insurance Bracket"
                />
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="minSalary" className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Salary (EGP) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="minSalary"
                      name="minSalary"
                      value={formData.minSalary}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 transition-all duration-200"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      EGP
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="maxSalary" className="block text-sm font-semibold text-gray-700 mb-2">
                    Maximum Salary (EGP) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="maxSalary"
                      name="maxSalary"
                      value={formData.maxSalary}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 transition-all duration-200"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      EGP
                    </span>
                  </div>
                </div>
              </div>

              {/* Contribution Rates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="employeeRate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee Contribution Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="employeeRate"
                      name="employeeRate"
                      value={formData.employeeRate}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 transition-all duration-200"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      %
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Percentage of salary for employee contribution</p>
                </div>

                <div>
                  <label htmlFor="employerRate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Employer Contribution Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="employerRate"
                      name="employerRate"
                      value={formData.employerRate}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 transition-all duration-200"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      %
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Percentage of salary for employer contribution</p>
                </div>
              </div>

              {/* Fixed Amount (Optional) */}
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Fixed Insurance Amount (EGP) <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 transition-all duration-200"
                    placeholder="0.00 (leave empty if using percentage-based calculation)"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    EGP
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Optional fixed amount. If provided, this will be used instead of percentage-based calculation.</p>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
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
                    'Update Insurance Bracket'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
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

