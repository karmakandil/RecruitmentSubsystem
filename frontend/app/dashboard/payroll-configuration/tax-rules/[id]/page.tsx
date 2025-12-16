'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { taxRulesApi } from '@/lib/api/payroll-configuration/tax-rules';
import { TaxRule } from '@/lib/api/payroll-configuration/types';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/ui/Card';

export default function TaxRuleDetailsPage() {
  // Legal & Policy Admin can view tax rules
  useRequireAuth(SystemRole.LEGAL_POLICY_ADMIN, '/dashboard');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [taxRule, setTaxRule] = useState<TaxRule | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTaxRule();
  }, [id]);

  const loadTaxRule = async () => {
    try {
      setIsLoading(true);
      const data = await taxRulesApi.getById(id);
      setTaxRule(data);
    } catch (err) {
      console.error('Error loading tax rule:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tax rule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (taxRule && (taxRule.status === 'draft' || taxRule.status === 'approved')) {
      router.push(`/dashboard/payroll-configuration/tax-rules/${taxRule.id}/edit`);
    } else {
      alert('Only draft or approved tax rules can be edited.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading tax rule details...</div>
        </div>
      </div>
    );
  }

  if (error || !taxRule) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error || 'Tax rule not found'}</p>
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Back to Tax Rules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/tax-rules')}
          className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Tax Rules
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{taxRule.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <StatusBadge status={taxRule.status} />
              {taxRule.isProgressive && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Progressive
                </span>
              )}
            </div>
          </div>
          {(taxRule.status === 'draft' || taxRule.status === 'approved') && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Tax Rule
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Rule Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-900">{taxRule.description || 'No description provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tax Rate</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{taxRule.rate.toFixed(2)}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tax Type</label>
                  <p className="mt-1 text-gray-900">{taxRule.isProgressive ? 'Progressive' : 'Flat Rate'}</p>
                </div>
              </div>

              {taxRule.effectiveDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Effective Date</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(taxRule.effectiveDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thresholds */}
          {taxRule.thresholds && (taxRule.thresholds.minAmount || taxRule.thresholds.maxAmount) && (
            <Card>
              <CardHeader>
                <CardTitle>Thresholds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {taxRule.thresholds.minAmount !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Minimum Amount</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'EGP'
                        }).format(taxRule.thresholds.minAmount)}
                      </p>
                    </div>
                  )}
                  {taxRule.thresholds.maxAmount !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Maximum Amount</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'EGP'
                        }).format(taxRule.thresholds.maxAmount)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exemptions */}
          {taxRule.exemptions && taxRule.exemptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Exemptions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {taxRule.exemptions.map((exemption, index) => (
                    <li key={index} className="text-gray-900">{exemption}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created By</label>
                <p className="mt-1 text-gray-900">{taxRule.createdBy || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-gray-900">
                  {new Date(taxRule.createdAt).toLocaleDateString('en-US', {
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
                  {new Date(taxRule.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {taxRule.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved By</label>
                  <p className="mt-1 text-gray-900">{taxRule.approvedBy}</p>
                </div>
              )}

              {taxRule.approvedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Approved At</label>
                  <p className="mt-1 text-gray-900">
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
                <label className="text-sm font-medium text-gray-500">Version</label>
                <p className="mt-1 text-gray-900">{taxRule.version || 1}</p>
              </div>
            </CardContent>
          </Card>

          {taxRule.status === 'approved' && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Editing this approved tax rule will set it back to Draft status and require re-approval.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

