'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { terminationBenefitsApi } from '@/lib/api/payroll-configuration/termination-benefits';
import { TerminationBenefit } from '@/lib/api/payroll-configuration/types';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';

export default function TerminationBenefitDetailsPage() {
  // Payroll Specialist can view termination benefits
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const router = useRouter();
  const params = useParams();
  const terminationBenefitId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [terminationBenefit, setTerminationBenefit] = useState<TerminationBenefit | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTerminationBenefit();
  }, [terminationBenefitId]);

  const loadTerminationBenefit = async () => {
    try {
      setIsLoading(true);
      const data = await terminationBenefitsApi.getById(terminationBenefitId);
      setTerminationBenefit(data);
    } catch (err) {
      console.error('Error loading termination benefit:', err);
      setError(err instanceof Error ? err.message : 'Failed to load termination benefit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (terminationBenefit && terminationBenefit.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/termination-benefits/${terminationBenefit.id}/edit`);
    } else {
      alert('Only draft termination benefits can be edited.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading termination benefit...</p>
        </div>
      </div>
    );
  }

  if (error || !terminationBenefit) {
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

  const getCreatedByName = () => {
    if (!terminationBenefit.createdBy) return 'N/A';
    if (typeof terminationBenefit.createdBy === 'string') return terminationBenefit.createdBy;
    const createdBy = terminationBenefit.createdBy as any;
    if (createdBy && typeof createdBy === 'object') {
      if (createdBy.firstName && createdBy.lastName) {
        return `${createdBy.firstName} ${createdBy.lastName}`;
      }
      return createdBy.email || createdBy.fullName || 'N/A';
    }
    return 'N/A';
  };

  const getApprovedByName = () => {
    if (!terminationBenefit.approvedBy) return null;
    if (typeof terminationBenefit.approvedBy === 'string') return terminationBenefit.approvedBy;
    const approvedBy = terminationBenefit.approvedBy as any;
    if (approvedBy && typeof approvedBy === 'object') {
      if (approvedBy.firstName && approvedBy.lastName) {
        return `${approvedBy.firstName} ${approvedBy.lastName}`;
      }
      return approvedBy.email || approvedBy.fullName || 'Unknown';
    }
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
            className="mb-6 group flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span className="font-medium">Back to Termination Benefits</span>
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">{terminationBenefit.name}</h1>
                  <div className="mt-2 flex items-center gap-3 flex-wrap">
                    <StatusBadge status={terminationBenefit.status} />
                  </div>
                </div>
              </div>
            </div>
            {terminationBenefit.status === 'draft' && (
              <button
                onClick={handleEdit}
                className="group relative px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-rose-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200 flex items-center transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Termination Benefit
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
              <div className="px-6 py-5 bg-gradient-to-r from-rose-100 to-orange-100 border-b border-rose-200">
                <h2 className="text-xl font-bold text-rose-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Termination Benefit Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 mb-2 block">Description</label>
                  <p className="text-gray-900 leading-relaxed">{terminationBenefit.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl border border-rose-200">
                    <label className="text-sm font-semibold text-gray-500 mb-2 block">Benefit Amount</label>
                    <p className="text-2xl font-bold text-rose-700">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'EGP',
                        minimumFractionDigits: 0
                      }).format(terminationBenefit.amount || 0)}
                    </p>
                  </div>
                  
                  {terminationBenefit.terms && (
                    <div className="p-4 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl border border-rose-200">
                      <label className="text-sm font-semibold text-gray-500 mb-2 block">Terms</label>
                      <p className="text-lg font-semibold text-gray-900">{terminationBenefit.terms}</p>
                    </div>
                  )}
                </div>

                {(terminationBenefit as any).eligibilityCriteria && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Eligibility Criteria</label>
                    <p className="text-gray-900">{(terminationBenefit as any).eligibilityCriteria}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Notes */}
            {terminationBenefit.status === 'draft' && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 mb-1">Draft Status</h3>
                    <p className="text-sm text-blue-700">
                      This termination benefit is in draft status. It must be approved by a Payroll Manager before it can be used in the payroll system.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {terminationBenefit.status === 'approved' && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-green-800 mb-1">Approved and Active</h3>
                    <p className="text-sm text-green-700">
                      This termination benefit is approved and active. It will be automatically applied to eligible employees upon termination or resignation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {terminationBenefit.comments && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  <h2 className="text-lg font-semibold text-yellow-800">Comments</h2>
                </div>
                <p className="text-sm text-yellow-700">{terminationBenefit.comments}</p>
              </div>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Status & Metadata */}
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-rose-100 to-orange-100 border-b border-rose-200">
                <h2 className="text-xl font-bold text-rose-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Metadata
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500 mb-1 block">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={terminationBenefit.status} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 mb-1 block">Created By</label>
                  <p className="text-gray-900 font-medium">{getCreatedByName()}</p>
                </div>

                {terminationBenefit.createdAt && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 mb-1 block">Created At</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(terminationBenefit.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                {terminationBenefit.updatedAt && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 mb-1 block">Last Updated</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(terminationBenefit.updatedAt).toLocaleDateString('en-US', {
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

                {terminationBenefit.approvedAt && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 mb-1 block">Approved At</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(terminationBenefit.approvedAt).toLocaleDateString('en-US', {
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
                  <p className="text-gray-900 font-medium">{terminationBenefit.version || 1}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

