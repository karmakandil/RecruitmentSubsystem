'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { insuranceBracketsApi } from '@/lib/api/payroll-configuration/insurance-brackets';
import { InsuranceBracket } from '@/lib/api/payroll-configuration/types';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/ui/Card';

export default function InsuranceBracketDetailsPage() {
  // Payroll Specialist and HR Manager can view insurance brackets
  useRequireAuth([SystemRole.PAYROLL_SPECIALIST, SystemRole.HR_MANAGER], '/dashboard');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [insuranceBracket, setInsuranceBracket] = useState<InsuranceBracket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsuranceBracket();
  }, [id]);

  const loadInsuranceBracket = async () => {
    try {
      setIsLoading(true);
      const data = await insuranceBracketsApi.getById(id);
      setInsuranceBracket(data);
    } catch (err) {
      console.error('Error loading insurance bracket:', err);
      setError(err instanceof Error ? err.message : 'Failed to load insurance bracket');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (insuranceBracket && insuranceBracket.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/insurance-brackets/${insuranceBracket.id}/edit`);
    } else {
      alert('Only draft insurance brackets can be edited.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading insurance bracket details...</div>
        </div>
      </div>
    );
  }

  if (error || !insuranceBracket) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error || 'Insurance bracket not found'}</p>
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
            className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700"
          >
            Back to Insurance Brackets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/insurance-brackets')}
          className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Insurance Brackets
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{insuranceBracket.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <StatusBadge status={insuranceBracket.status} />
              <span className="text-sm text-gray-500">Insurance Bracket Configuration</span>
            </div>
          </div>
          {insuranceBracket.status === 'draft' && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Insurance Bracket
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Insurance Bracket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Insurance Bracket Name</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{insuranceBracket.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Minimum Salary</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'EGP'
                    }).format(insuranceBracket.minSalary)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Maximum Salary</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'EGP'
                    }).format(insuranceBracket.maxSalary)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee Contribution Rate</label>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{insuranceBracket.employeeRate.toFixed(2)}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employer Contribution Rate</label>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{insuranceBracket.employerRate.toFixed(2)}%</p>
                </div>
              </div>

              {insuranceBracket.amount && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Fixed Insurance Amount</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'EGP'
                    }).format(insuranceBracket.amount)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Fixed amount override. If set, this amount will be used instead of percentage-based calculation.
                  </p>
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
                  <StatusBadge status={insuranceBracket.status} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created By</label>
                <p className="mt-1 text-gray-900">{insuranceBracket.createdBy || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-gray-900">
                  {new Date(insuranceBracket.createdAt).toLocaleDateString('en-US', {
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
                  {new Date(insuranceBracket.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {insuranceBracket.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved By</label>
                  <p className="mt-1 text-gray-900">{insuranceBracket.approvedBy}</p>
                </div>
              )}

              {insuranceBracket.approvedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved At</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(insuranceBracket.approvedAt).toLocaleDateString('en-US', {
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
                <p className="mt-1 text-gray-900">{insuranceBracket.version || 1}</p>
              </div>
            </CardContent>
          </Card>

          {insuranceBracket.status === 'draft' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This insurance bracket is in draft status. It must be approved by an HR Manager before it can be used in the payroll system.
                </p>
              </CardContent>
            </Card>
          )}

          {insuranceBracket.status === 'approved' && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <p className="text-sm text-green-800">
                  <strong>Note:</strong> This insurance bracket is approved and active. The system will automatically apply the correct insurance deductions during payroll processing based on employee salary ranges.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

