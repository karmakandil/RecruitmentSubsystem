'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { payGradesApi } from '@/lib/api/payroll-configuration/payGrades';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';

interface PayGrade {
  id: string;
  name: string;
  description?: string;
  status?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  jobGrade?: string;
  jobBand?: string;
  benefits?: string[];
  isActive?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function PayGradeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const payGradeId = params.id as string;

  const [payGrade, setPayGrade] = useState<PayGrade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await payGradesApi.getById(payGradeId);
        setPayGrade({
          id: data.id,
          name: data.name,
          description: data.description,
          status: data.status,
          minSalary: data.minSalary,
          maxSalary: data.maxSalary,
          currency: data.currency,
          jobGrade: data.jobGrade,
          jobBand: data.jobBand,
          benefits: data.benefits,
          isActive: data.isActive,
          createdBy: (data as any).createdByName || data.createdBy,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } catch (err: any) {
        console.error('Error loading pay grade:', err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load pay grade details'
        );
      } finally {
        setLoading(false);
      }
    };

    if (payGradeId) {
      load();
    }
  }, [payGradeId]);

  const handleEdit = () => {
    if (!payGrade) return;
    // Only allow editing drafts as per requirements
    if (String(payGrade.status || '').toLowerCase() === 'draft') {
      router.push(`/dashboard/payroll-configuration/pay-grades/${payGradeId}/edit`);
    }
  };

  const formatMoney = (amount?: number, currency?: string) => {
    if (amount == null || !currency) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading pay grade details...</p>
      </div>
    );
  }

  if (error || !payGrade) {
    return (
      <div className="p-6 space-y-4">
        <button
          onClick={() => router.push('/dashboard/payroll-configuration/pay-grades')}
          className="px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
        >
          ← Back
        </button>
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Pay grade not found'}
        </div>
      </div>
    );
  }

  const normalizedStatus = String(payGrade.status || '').toLowerCase() as
    | 'draft'
    | 'approved'
    | 'rejected'
    | 'pending';

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/pay-grades')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {payGrade.name || 'Pay Grade'}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {payGrade.status && (
                <StatusBadge status={normalizedStatus as any} />
              )}
              {payGrade.jobGrade && (
                <span className="text-sm text-gray-500">ID: {payGrade.id}</span>
              )}
              {payGrade.jobGrade && (
                <span className="text-sm text-gray-500">• {payGrade.jobGrade}</span>
              )}
            </div>
          </div>
        </div>

        {normalizedStatus === 'draft' && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Edit Pay Grade
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700">
              {payGrade.description || 'No description provided.'}
            </p>
          </div>

          {/* Salary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Salary Range</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Minimum Salary</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatMoney(payGrade.minSalary, payGrade.currency)}
                  </p>
                </div>
                <div className="text-gray-400 mx-4">→</div>
                <div>
                  <p className="text-sm text-gray-500">Maximum Salary</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatMoney(payGrade.maxSalary, payGrade.currency)}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Currency: {payGrade.currency || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Benefits</h2>
            {payGrade.benefits && payGrade.benefits.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {payGrade.benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No benefits configured.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Job Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Job Grade</p>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {payGrade.jobGrade || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Job Band</p>
                <p className="mt-1 text-sm text-gray-900">
                  {payGrade.jobBand || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p
                  className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    payGrade.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {payGrade.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created By</p>
                <p className="mt-1 text-sm text-gray-900">
                  {payGrade.createdBy || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(payGrade.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(payGrade.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


