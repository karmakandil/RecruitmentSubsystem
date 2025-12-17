'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { signingBonusesApi } from '@/lib/api/payroll-configuration/signing-bonuses';
import { SigningBonus } from '@/lib/api/payroll-configuration/types';

export default function SigningBonusDetailsPage() {
  // Payroll Specialist can view signing bonuses
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const params = useParams();
  const router = useRouter();
  const signingBonusId = params.id as string;
  const [signingBonus, setSigningBonus] = useState<SigningBonus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSigningBonus();
  }, [signingBonusId]);

  const loadSigningBonus = async () => {
    try {
      setIsLoading(true);
      const data = await signingBonusesApi.getById(signingBonusId);
      setSigningBonus(data);
    } catch (err) {
      console.error('Error loading signing bonus:', err);
      setError(err instanceof Error ? err.message : 'Failed to load signing bonus');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (signingBonus && signingBonus.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/signing-bonuses/${signingBonus.id}/edit`);
    } else {
      alert('Only draft signing bonuses can be edited.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading signing bonus...</p>
        </div>
      </div>
    );
  }

  if (error || !signingBonus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Signing Bonus</h2>
            <p className="text-red-700 mb-4">{error || 'Signing bonus not found'}</p>
            <button
              onClick={() => router.push('/dashboard/payroll-configuration/signing-bonuses')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Signing Bonuses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getCreatedByName = () => {
    if (!signingBonus.createdBy) return 'N/A';
    if (typeof signingBonus.createdBy === 'string') return signingBonus.createdBy;
    const createdBy = signingBonus.createdBy as any;
    if (createdBy && typeof createdBy === 'object') {
      if (createdBy.firstName && createdBy.lastName) {
        return `${createdBy.firstName} ${createdBy.lastName}`;
      }
      return createdBy.email || createdBy.fullName || 'N/A';
    }
    return 'N/A';
  };

  const getApprovedByName = () => {
    if (!signingBonus.approvedBy) return null;
    if (typeof signingBonus.approvedBy === 'string') return signingBonus.approvedBy;
    const approvedBy = signingBonus.approvedBy as any;
    if (approvedBy && typeof approvedBy === 'object') {
      if (approvedBy.firstName && approvedBy.lastName) {
        return `${approvedBy.firstName} ${approvedBy.lastName}`;
      }
      return approvedBy.email || approvedBy.fullName || 'Unknown';
    }
    return 'Unknown';
  };

  const positionName = (signingBonus as any).positionName || 'Signing Bonus';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/signing-bonuses')}
            className="mb-6 group flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span className="font-medium">Back to Signing Bonuses</span>
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  {positionName}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={signingBonus.status} />
                  <span className="text-sm text-gray-500 font-mono">ID: {signingBonus.id}</span>
                </div>
              </div>
            </div>
            
            {signingBonus.status === 'draft' && (
              <button
                onClick={handleEdit}
                className="group px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:from-yellow-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Signing Bonus
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Signing Bonus Information Card */}
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Signing Bonus Information</h2>
                </div>

                <div className="space-y-6">
                  {/* Position Name */}
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Position Name</label>
                    <p className="mt-1 text-lg font-medium text-gray-900">{positionName}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      This signing bonus applies to employees hired in this position.
                    </p>
                  </div>

                  {/* Signing Bonus Amount */}
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Signing Bonus Amount</label>
                    <p className="mt-1 text-3xl font-bold text-yellow-600">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'EGP',
                        minimumFractionDigits: 0
                      }).format(signingBonus.amount)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      This amount will be awarded to new hires in this position when they join the company.
                    </p>
                  </div>

                  {/* Description */}
                  {signingBonus.description && (
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                      <p className="mt-1 text-gray-700">{signingBonus.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Notes */}
            {signingBonus.status === 'draft' && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 mb-1">Draft Status</h3>
                    <p className="text-sm text-blue-700">
                      This signing bonus is in draft status. It must be approved by a Payroll Manager before it can be used in the payroll system.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {signingBonus.status === 'approved' && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-green-800 mb-1">Approved and Active</h3>
                    <p className="text-sm text-green-700">
                      This signing bonus is approved and active. It will be automatically applied to new hires in this position.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments */}
            {signingBonus.comments && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  <h2 className="text-lg font-semibold text-yellow-800">Comments</h2>
                </div>
                <p className="text-sm text-yellow-700">{signingBonus.comments}</p>
              </div>
            )}
          </div>

          {/* Metadata Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Metadata</h2>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={signingBonus.status} />
                  </div>
                </div>

                {/* Created By */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created By</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{getCreatedByName()}</p>
                </div>

                {/* Created At */}
                {signingBonus.createdAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created At</label>
                    <p className="mt-1 text-sm text-gray-700">
                      {new Date(signingBonus.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Updated At */}
                {signingBonus.updatedAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-700">
                      {new Date(signingBonus.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Approved By */}
                {getApprovedByName() && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Approved By</label>
                    <p className="mt-1 text-sm font-medium text-gray-900">{getApprovedByName()}</p>
                  </div>
                )}

                {/* Approved At */}
                {signingBonus.approvedAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Approved At</label>
                    <p className="mt-1 text-sm text-gray-700">
                      {new Date(signingBonus.approvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

