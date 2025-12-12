'use client';

import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';

export default function PayGradeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const payGradeId = params.id as string;

  // Mock data
  const payGrade = {
    id: payGradeId,
    name: 'Senior Developer',
    description: 'Experienced software development position with leadership responsibilities',
    status: 'draft' as const,
    minSalary: 15000,
    maxSalary: 25000,
    currency: 'EGP',
    jobGrade: 'JG-7',
    jobBand: 'Senior Individual Contributor',
    benefits: ['Health Insurance', 'Annual Bonus', 'Stock Options', 'Flexible Hours'],
    isActive: true,
    createdBy: 'hr.admin@company.com',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-20T11:30:00Z',
    version: 1
  };

  const handleEdit = () => {
    if (payGrade.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/pay-grades/${payGradeId}/edit`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/pay-grades')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{payGrade.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={payGrade.status} />
              <span className="text-sm text-gray-500">ID: {payGrade.id}</span>
              <span className="text-sm text-gray-500">• {payGrade.jobGrade}</span>
            </div>
          </div>
        </div>
        
        {payGrade.status === 'draft' && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Edit Pay Grade
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700">{payGrade.description}</p>
          </div>

          {/* Salary Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Salary Range</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Minimum Salary</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payGrade.currency
                    }).format(payGrade.minSalary)}
                  </p>
                </div>
                <div className="text-gray-400 mx-4">→</div>
                <div>
                  <p className="text-sm text-gray-500">Maximum Salary</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payGrade.currency
                    }).format(payGrade.maxSalary)}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">Currency: {payGrade.currency}</p>
              </div>
            </div>
          </div>

          {/* Benefits Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Benefits</h2>
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
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Job Details Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Job Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Job Grade</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">{payGrade.jobGrade}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Job Band</label>
                <p className="mt-1 text-sm text-gray-900">{payGrade.jobBand}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  payGrade.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {payGrade.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created By</label>
                <p className="mt-1 text-sm text-gray-900">{payGrade.createdBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(payGrade.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(payGrade.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Version</label>
                <p className="mt-1 text-sm text-gray-900">{payGrade.version}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}