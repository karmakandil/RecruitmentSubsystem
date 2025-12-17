'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { payGradesApi } from '@/lib/api/payroll-configuration/payGrades';
import { PayGrade } from '@/lib/api/payroll-configuration/types';

export default function PayGradeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const payGradeId = params.id as string;
  const [payGrade, setPayGrade] = useState<PayGrade | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPayGrade();
  }, [payGradeId]);

  const loadPayGrade = async () => {
    try {
      setIsLoading(true);
      const data = await payGradesApi.getById(payGradeId);
      setPayGrade(data);
    } catch (err) {
      console.error('Error loading pay grade:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pay grade');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (payGrade && payGrade.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/pay-grades/${payGradeId}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading pay grade...</p>
        </div>
      </div>
    );
  }

  if (error || !payGrade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 font-semibold">{error || 'Pay grade not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getCreatedByName = () => {
    if (!payGrade.createdBy) return 'N/A';
    if (typeof payGrade.createdBy === 'string') return payGrade.createdBy;
    const createdBy = payGrade.createdBy as any;
    if (createdBy && typeof createdBy === 'object') {
      if (createdBy.firstName && createdBy.lastName) {
        return `${createdBy.firstName} ${createdBy.lastName}`;
      }
      return createdBy.email || createdBy.fullName || (createdBy as any).createdByName || 'N/A';
    }
    return 'N/A';
  };

  const getApprovedByName = () => {
    if (!payGrade.approvedBy) return null;
    if (typeof payGrade.approvedBy === 'string') return payGrade.approvedBy;
    const approvedBy = payGrade.approvedBy as any;
    if (approvedBy && typeof approvedBy === 'object') {
      if (approvedBy.firstName && approvedBy.lastName) {
        return `${approvedBy.firstName} ${approvedBy.lastName}`;
      }
      return approvedBy.email || approvedBy.fullName || 'Unknown';
    }
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/pay-grades')}
            className="mb-6 group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span className="font-medium">Back to Pay Grades</span>
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {payGrade.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={payGrade.status} />
                  <span className="text-sm text-gray-500 font-mono">ID: {payGrade.id}</span>
                </div>
              </div>
            </div>
            
            {payGrade.status === 'draft' && (
              <button
                onClick={handleEdit}
                className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Pay Grade
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details Card */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Pay Grade Details</h2>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                  <p className="mt-1 text-lg font-medium text-gray-900">{payGrade.name}</p>
                </div>

                {/* Description */}
                {payGrade.description && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                    <p className="mt-1 text-gray-700">{payGrade.description}</p>
                  </div>
                )}

                {/* Salary Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Minimum Salary</label>
                    <p className="mt-1 text-xl font-bold text-blue-600">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'EGP',
                        minimumFractionDigits: 0
                      }).format(payGrade.minSalary || 0)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Maximum Salary</label>
                    <p className="mt-1 text-xl font-bold text-indigo-600">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'EGP',
                        minimumFractionDigits: 0
                      }).format(payGrade.maxSalary || 0)}
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                {payGrade.benefits && payGrade.benefits.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Benefits</label>
                    <div className="flex flex-wrap gap-2">
                      {payGrade.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Is Active */}
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      payGrade.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {payGrade.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
                    <StatusBadge status={payGrade.status} />
                  </div>
                </div>

                {/* Created By */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created By</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">{getCreatedByName()}</p>
                </div>

                {/* Created At */}
                {payGrade.createdAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created At</label>
                    <p className="mt-1 text-sm text-gray-700">
                      {new Date(payGrade.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Updated At */}
                {payGrade.updatedAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-700">
                      {new Date(payGrade.updatedAt).toLocaleString()}
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
                {payGrade.approvedAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Approved At</label>
                    <p className="mt-1 text-sm text-gray-700">
                      {new Date(payGrade.approvedAt).toLocaleString()}
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

