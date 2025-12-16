'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { signingBonusesApi } from '@/lib/api/payroll-configuration/signing-bonuses';
import { SigningBonus } from '@/lib/api/payroll-configuration/types';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/ui/Card';

export default function SigningBonusDetailsPage() {
  // Payroll Specialist can view signing bonuses
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [signingBonus, setSigningBonus] = useState<SigningBonus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSigningBonus();
  }, [id]);

  const loadSigningBonus = async () => {
    try {
      setIsLoading(true);
      const data = await signingBonusesApi.getById(id);
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
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading signing bonus details...</div>
        </div>
      </div>
    );
  }

  if (error || !signingBonus) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error || 'Signing bonus not found'}</p>
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/signing-bonuses')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Back to Signing Bonuses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/signing-bonuses')}
          className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Signing Bonuses
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{signingBonus.positionName}</h1>
            <div className="mt-2 flex items-center gap-3">
              <StatusBadge status={signingBonus.status} />
              <span className="text-sm text-gray-500">Signing Bonus Policy</span>
            </div>
          </div>
          {signingBonus.status === 'draft' && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Signing Bonus
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Signing Bonus Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Position Name</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{signingBonus.positionName}</p>
                <p className="mt-1 text-sm text-gray-500">
                  This signing bonus applies to employees hired in this position.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Signing Bonus Amount</label>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EGP'
                  }).format(signingBonus.amount)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  This amount will be awarded to new hires in this position when they join the company.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <StatusBadge status={signingBonus.status} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created By</label>
                <p className="mt-1 text-gray-900">{signingBonus.createdBy || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-gray-900">
                  {new Date(signingBonus.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-gray-900">
                  {new Date(signingBonus.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {signingBonus.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved By</label>
                  <p className="mt-1 text-gray-900">{signingBonus.approvedBy}</p>
                </div>
              )}

              {signingBonus.approvedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved At</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(signingBonus.approvedAt).toLocaleDateString('en-US', {
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
                <label className="text-sm font-medium text-gray-500">Version</label>
                <p className="mt-1 text-gray-900">{signingBonus.version || 1}</p>
              </div>
            </CardContent>
          </Card>

          {signingBonus.status === 'draft' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This signing bonus is in draft status. It must be approved by a Payroll Manager before it can be used in the payroll system.
                </p>
              </CardContent>
            </Card>
          )}

          {signingBonus.status === 'approved' && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <p className="text-sm text-green-800">
                  <strong>Note:</strong> This signing bonus is approved and active. It will be automatically applied to new hires in this position.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

