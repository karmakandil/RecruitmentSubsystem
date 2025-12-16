'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { terminationBenefitsApi } from '@/lib/api/payroll-configuration/termination-benefits';
import { TerminationBenefit } from '@/lib/api/payroll-configuration/types';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/ui/Card';

export default function TerminationBenefitDetailsPage() {
  // Payroll Specialist can view termination benefits
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [terminationBenefit, setTerminationBenefit] = useState<TerminationBenefit | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTerminationBenefit();
  }, [id]);

  const loadTerminationBenefit = async () => {
    try {
      setIsLoading(true);
      const data = await terminationBenefitsApi.getById(id);
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
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading termination benefit details...</div>
        </div>
      </div>
    );
  }

  if (error || !terminationBenefit) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error || 'Termination benefit not found'}</p>
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Back to Termination Benefits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/termination-benefits')}
          className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Termination Benefits
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{terminationBenefit.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <StatusBadge status={terminationBenefit.status} />
              <span className="text-sm text-gray-500">Termination/Resignation Benefit Policy</span>
            </div>
          </div>
          {terminationBenefit.status === 'draft' && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Termination Benefit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Termination Benefit Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Benefit Name</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{terminationBenefit.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Benefit Amount</label>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EGP'
                  }).format(terminationBenefit.amount)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  This amount will be awarded to employees upon termination or resignation according to the terms and conditions.
                </p>
              </div>

              {terminationBenefit.terms && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Terms and Conditions</label>
                  <div className="mt-1 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-gray-900 whitespace-pre-wrap">{terminationBenefit.terms}</p>
                  </div>
                </div>
              )}
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
                  <StatusBadge status={terminationBenefit.status} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created By</label>
                <p className="mt-1 text-gray-900">{terminationBenefit.createdBy || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-gray-900">
                  {new Date(terminationBenefit.createdAt).toLocaleDateString('en-US', {
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
                  {new Date(terminationBenefit.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {terminationBenefit.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved By</label>
                  <p className="mt-1 text-gray-900">{terminationBenefit.approvedBy}</p>
                </div>
              )}

              {terminationBenefit.approvedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved At</label>
                  <p className="mt-1 text-gray-900">
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
                <label className="text-sm font-medium text-gray-500">Version</label>
                <p className="mt-1 text-gray-900">{terminationBenefit.version || 1}</p>
              </div>
            </CardContent>
          </Card>

          {terminationBenefit.status === 'draft' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This termination benefit is in draft status. It must be approved by a Payroll Manager before it can be used in the payroll system.
                </p>
              </CardContent>
            </Card>
          )}

          {terminationBenefit.status === 'approved' && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <p className="text-sm text-green-800">
                  <strong>Note:</strong> This termination benefit is approved and active. It will be automatically applied to eligible employees upon termination or resignation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

