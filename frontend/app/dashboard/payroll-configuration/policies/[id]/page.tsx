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
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-indigo-600"></div>
          <p className="ml-4 text-gray-600">Loading policy...</p>
        </div>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Policy</h2>
          <p className="text-red-700">{error || 'Policy not found'}</p>
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/policies')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Policies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/policies')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{policy.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={policy.status} />
              <span className="text-sm text-gray-500">ID: {policy.id}</span>
              {policy.version && (
                <span className="text-sm text-gray-500">• Version: {policy.version}</span>
              )}
            </div>
          </div>
        </div>
        
        {policy.status?.toLowerCase() === 'draft' && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Edit Policy
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Policy Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{policy.description || 'No description provided'}</p>
          </div>

          {/* Rules Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Policy Rules</h2>
            {policy.rules && Object.keys(policy.rules).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(policy.rules).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No rules defined</p>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Policy Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Policy Type</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{policy.policyType || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Effective Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {policy.effectiveDate ? new Date(policy.effectiveDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              {policy.department && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="mt-1 text-sm text-gray-900">{policy.department}</p>
                </div>
              )}
              {policy.location && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{policy.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Audit Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created By</label>
                <p className="mt-1 text-sm text-gray-900">{policy.createdBy || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-sm text-gray-900">
                  {policy.createdAt ? new Date(policy.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">
                  {policy.updatedAt ? new Date(policy.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>
              {policy.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved By</label>
                  <p className="mt-1 text-sm text-gray-900">{policy.approvedBy}</p>
                </div>
              )}
              {policy.approvedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved At</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(policy.approvedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Comments Card */}
          {policy.comments && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-yellow-800 mb-2">Comments</h2>
              <p className="text-sm text-yellow-700">{policy.comments}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

