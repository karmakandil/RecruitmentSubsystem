'use client';

import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';

export default function PayTypeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const payTypeId = params.id as string;

  // Mock data - replace with API call
  const payType = {
    id: payTypeId,
    name: 'Monthly Salary',
    description: 'Fixed monthly salary for permanent employees',
    status: 'draft' as const,
    type: 'salary',
    calculationMethod: 'fixed',
    isTaxable: true,
    isOvertimeEligible: false,
    createdBy: 'payroll.admin@company.com',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    version: 1
  };

  const handleEdit = () => {
    if (payType.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/pay-types/${payTypeId}/edit`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/pay-types')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{payType.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={payType.status} />
              <span className="text-sm text-gray-500">ID: {payType.id}</span>
            </div>
          </div>
        </div>
        
        {payType.status === 'draft' && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Edit Pay Type
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Card */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pay Type Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1 text-gray-700">{payType.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="mt-1 text-gray-900 capitalize">{payType.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Calculation Method</label>
                <p className="mt-1 text-gray-900">{payType.calculationMethod}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tax Status</label>
                <p className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  payType.isTaxable ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {payType.isTaxable ? 'Taxable' : 'Tax-free'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Overtime</label>
                <p className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  payType.isOvertimeEligible ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {payType.isOvertimeEligible ? 'Eligible' : 'Not Eligible'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="mt-1 text-sm text-gray-900">{payType.createdBy}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(payType.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(payType.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Version</label>
              <p className="mt-1 text-sm text-gray-900">{payType.version}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}