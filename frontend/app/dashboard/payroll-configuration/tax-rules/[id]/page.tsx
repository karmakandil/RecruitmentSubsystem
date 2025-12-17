'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { taxRulesApi } from '@/lib/api/payroll-configuration/tax-rules';
import { TaxRule } from '@/lib/api/payroll-configuration/types';

export default function TaxRuleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const taxRuleId = params.id as string;
  const [taxRule, setTaxRule] = useState<TaxRule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Only Legal Admin can edit tax rules - explicitly hide for Payroll Specialists
  // Use useMemo to recalculate when user or roles change
  const canEdit = useMemo(() => {
    // Don't show button if auth is still loading or user is not loaded
    if (authLoading || !user || !user.roles) {
      return false;
    }
    
    // Check if user is a Payroll Specialist - if so, hide the button
    const isPayrollSpecialist = user.roles.some(role => {
      const roleStr = String(role).trim().toLowerCase();
      const payrollSpecialistStr = String(SystemRole.PAYROLL_SPECIALIST).trim().toLowerCase();
      return role === SystemRole.PAYROLL_SPECIALIST || roleStr === payrollSpecialistStr;
    });
    
    // If user is a Payroll Specialist, they cannot edit
    if (isPayrollSpecialist) {
      return false;
    }
    
    // Check if user is Legal Admin
    const isLegalAdmin = user.roles.some(role => {
      const roleStr = String(role).trim().toLowerCase();
      const legalAdminStr = String(SystemRole.LEGAL_POLICY_ADMIN).trim().toLowerCase();
      return role === SystemRole.LEGAL_POLICY_ADMIN || roleStr === legalAdminStr;
    });
    
    // Only show edit button if user is Legal Admin
    return isLegalAdmin;
  }, [user, authLoading]);

  useEffect(() => {
    loadTaxRule();
  }, [taxRuleId]);

  const loadTaxRule = async () => {
    try {
      setIsLoading(true);
      const data = await taxRulesApi.getById(taxRuleId);
      setTaxRule(data);
    } catch (err) {
      console.error('Error loading tax rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tax rule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    // Tax rules can be edited even if approved (they go back to draft)
    // But only draft or approved tax rules can be edited
    if (taxRule && (taxRule.status === 'draft' || taxRule.status === 'approved')) {
      router.push(`/dashboard/payroll-configuration/tax-rules/${taxRuleId}/edit`);
    } else {
      alert('Only draft or approved tax rules can be edited.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading tax rule...</p>
        </div>
      </div>
    );
  }

  if (error || !taxRule) {
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

  // Extract createdBy name if it's an object
  const getCreatedByName = () => {
    if (!taxRule.createdBy) return 'N/A';
    if (typeof taxRule.createdBy === 'string') return taxRule.createdBy;
    const createdBy = taxRule.createdBy as any;
    if (createdBy && typeof createdBy === 'object') {
      if (createdBy.firstName && createdBy.lastName) {
        return `${createdBy.firstName} ${createdBy.lastName}`;
      }
      return createdBy.email || createdBy.fullName || 'N/A';
    }
    return 'N/A';
  };

  const getApprovedByName = () => {
    if (!taxRule.approvedBy) return null;
    if (typeof taxRule.approvedBy === 'string') return taxRule.approvedBy;
    const approvedBy = taxRule.approvedBy as any;
    if (approvedBy && typeof approvedBy === 'object') {
      if (approvedBy.firstName && approvedBy.lastName) {
        return `${approvedBy.firstName} ${approvedBy.lastName}`;
      }
      return approvedBy.email || approvedBy.fullName || 'Unknown';
    }
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
            className="mb-6 px-4 py-2 text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors duration-200 hover:bg-white rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Tax Rules
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">{taxRule.name}</h1>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <StatusBadge status={taxRule.status} />
                    {taxRule.isProgressive && (
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm">
                        Progressive
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {canEdit && (taxRule.status === 'draft' || taxRule.status === 'approved') && (
              <button
                onClick={handleEdit}
                className="group relative px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-slate-700 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 flex items-center transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Tax Rule
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-slate-100 to-gray-100 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Tax Rule Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 mb-2 block">Description</label>
                  <p className="text-gray-900 leading-relaxed">{taxRule.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                    <label className="text-sm font-semibold text-gray-500 mb-2 block">Tax Rate</label>
                    <p className="text-2xl font-bold text-slate-700">{taxRule.rate.toFixed(2)}%</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                    <label className="text-sm font-semibold text-gray-500 mb-2 block">Tax Type</label>
                    <p className="text-lg font-semibold text-gray-900">{taxRule.isProgressive ? 'Progressive' : 'Flat Rate'}</p>
                  </div>
                </div>

                {taxRule.effectiveDate && (
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                    <label className="text-sm font-semibold text-gray-500 mb-2 block">Effective Date</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(taxRule.effectiveDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {taxRule.thresholds && (taxRule.thresholds.minAmount !== undefined || taxRule.thresholds.maxAmount !== undefined) && (
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                    <label className="text-sm font-semibold text-gray-500 mb-3 block">Thresholds</label>
                    <div className="space-y-2">
                      {taxRule.thresholds.minAmount !== undefined && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                          </svg>
                          <span className="text-gray-900 font-medium">
                            Minimum: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP' }).format(taxRule.thresholds.minAmount)}
                          </span>
                        </div>
                      )}
                      {taxRule.thresholds.maxAmount !== undefined && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                          </svg>
                          <span className="text-gray-900 font-medium">
                            Maximum: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP' }).format(taxRule.thresholds.maxAmount)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {taxRule.exemptions && taxRule.exemptions.length > 0 && (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Exemptions</label>
                    <div className="space-y-2">
                      {taxRule.exemptions.map((exemption, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-gray-900 font-medium">{exemption}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Status & Metadata */}
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-slate-100 to-gray-100 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Metadata
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500 mb-1 block">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={taxRule.status} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 mb-1 block">Created By</label>
                  <p className="text-gray-900 font-medium">{getCreatedByName()}</p>
                </div>

                {taxRule.createdAt && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 mb-1 block">Created At</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(taxRule.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                {taxRule.updatedAt && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 mb-1 block">Last Updated</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(taxRule.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                {getApprovedByName() && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 mb-1 block">Approved By</label>
                    <p className="text-gray-900 font-medium">{getApprovedByName()}</p>
                  </div>
                )}

                {taxRule.approvedAt && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 mb-1 block">Approved At</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(taxRule.approvedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-500 mb-1 block">Version</label>
                  <p className="text-gray-900 font-medium">{taxRule.version || 1}</p>
                </div>
              </div>
            </div>

            {taxRule.status === 'approved' && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 mb-1">Note</p>
                    <p className="text-sm text-yellow-700">
                      Editing this approved tax rule will set it back to Draft status and require re-approval.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

