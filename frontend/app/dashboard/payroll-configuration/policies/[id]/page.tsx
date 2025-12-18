'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { policiesApi } from '@/lib/api/payroll-configuration/policies';
import { PayrollPolicy } from '@/lib/api/payroll-configuration/types';

export default function PolicyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const policyId = params.id as string;
  const [policy, setPolicy] = useState<PayrollPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPolicy();
  }, [policyId]);

  const loadPolicy = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await policiesApi.getById(policyId);
      setPolicy(data);
    } catch (err) {
      console.error('Error loading policy:', err);
      setError(err instanceof Error ? err.message : 'Failed to load policy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (policy && policy.status?.toLowerCase() === 'draft') {
      router.push(`/dashboard/payroll-configuration/policies/${policyId}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading policy...</p>
        </div>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Policy</h2>
            <p className="text-red-700 mb-4">{error || 'Policy not found'}</p>
            <button
              onClick={() => router.push('/dashboard/payroll-configuration/policies')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Policies
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getCreatedByName = () => {
    if (!policy.createdBy) return 'N/A';
    if (typeof policy.createdBy === 'string') return policy.createdBy;
    const createdBy = policy.createdBy as any;
    if (createdBy && typeof createdBy === 'object') {
      if (createdBy.firstName && createdBy.lastName) {
        return `${createdBy.firstName} ${createdBy.lastName}`;
      }
      return createdBy.email || createdBy.fullName || 'N/A';
    }
    return 'N/A';
  };

  const getApprovedByName = () => {
    if (!policy.approvedBy) return null;
    if (typeof policy.approvedBy === 'string') return policy.approvedBy;
    const approvedBy = policy.approvedBy as any;
    if (approvedBy && typeof approvedBy === 'object') {
      if (approvedBy.firstName && approvedBy.lastName) {
        return `${approvedBy.firstName} ${approvedBy.lastName}`;
      }
      return approvedBy.email || approvedBy.fullName || 'Unknown';
    }
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/policies')}
            className="mb-6 group flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span className="font-medium">Back to Policies</span>
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {policy.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={policy.status} />
                  <span className="text-sm text-gray-500 font-mono">ID: {policy.id}</span>
                </div>
              </div>
            </div>
            
            {policy.status === 'draft' && (
              <button
                onClick={handleEdit}
                className="group px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Policy
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Policy Details</h2>
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                    <p className="mt-1 text-lg font-medium text-gray-900">{policy.name}</p>
                  </div>

                  {/* Description */}
                  {policy.description && (
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                      <p className="mt-1 text-gray-700">{policy.description}</p>
                    </div>
                  )}

                  {/* Policy Type */}
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Policy Type</label>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 shadow-sm">
                        {policy.policyType}
                      </span>
                    </div>
                  </div>

                  {/* Effective Date */}
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Effective Date</label>
                    <div className="mt-1 flex items-center gap-2">
                      <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="text-lg font-medium text-gray-900">
                        {new Date(policy.effectiveDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Department */}
                  {policy.department && (
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Department</label>
                      <p className="mt-1 text-lg font-medium text-gray-900">{policy.department}</p>
                    </div>
                  )}

                  {/* Location */}
                  {policy.location && (
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Location</label>
                      <p className="mt-1 text-lg font-medium text-gray-900">{policy.location}</p>
                    </div>
                  )}

                  {/* Rules */}
                  {policy.rules && Object.keys(policy.rules).length > 0 ? (
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Rules</label>
                      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                        {Object.entries(policy.rules).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-start py-2 border-b border-gray-200 last:border-0">
                            <span className="text-sm font-medium text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <span className="text-sm text-gray-900 font-medium">
                              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Rules</label>
                      <p className="text-gray-500 text-sm">No rules defined</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Card */}
            {policy.comments && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  <h2 className="text-lg font-semibold text-yellow-800">Comments</h2>
                </div>
                <p className="text-sm text-yellow-700">{policy.comments}</p>
              </div>
            )}
          </div>

          {/* Metadata Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <StatusBadge status={policy.status} />
                  </div>
                </div>

                {/* Created By */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created By</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{getCreatedByName()}</p>
                </div>

                {/* Created At */}
                {policy.createdAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created At</label>
                    <p className="mt-1 text-sm text-gray-700">
                      {new Date(policy.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Updated At */}
                {policy.updatedAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-700">
                      {new Date(policy.updatedAt).toLocaleString()}
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
                {policy.approvedAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Approved At</label>
                    <p className="mt-1 text-sm text-gray-700">
                      {new Date(policy.approvedAt).toLocaleString()}
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

