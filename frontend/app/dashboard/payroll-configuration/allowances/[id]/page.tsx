'use client';

import { useParams, useRouter } from 'next/navigation';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';

type AllowanceStatus = 'draft' | 'approved' |  'rejected';

type Allowance = {
  id: string;
  name: string;
  description: string;
  status: AllowanceStatus;
  allowanceType: string;
  amount: number;
  currency: string;
  isRecurring: boolean;
  frequency: string;
  taxable: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export default function AllowanceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const allowanceId = params.id as string;

  // Mock data with proper typing
  const allowance: Allowance = {
    id: allowanceId,
    name: 'Transportation Allowance',
    description: 'Monthly transportation support for employees',
    status: 'approved',
    allowanceType: 'transportation',
    amount: 500,
    currency: 'EGP',
    isRecurring: true,
    frequency: 'monthly',
    taxable: false,
    createdBy: 'hr.admin@company.com',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    version: 1
  };

  const handleEdit = () => {
    if (allowance.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/allowances/${allowanceId}/edit`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard/payroll-configuration/allowances')}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{allowance.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={allowance.status} />
              <span className="text-sm text-gray-500">ID: {allowance.id}</span>
            </div>
          </div>
        </div>
        
        {allowance.status === 'draft' && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Edit Allowance
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Card */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Allowance Details</h2>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1 text-gray-700">{allowance.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="mt-1 capitalize text-gray-900">{allowance.allowanceType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="mt-1 text-gray-900">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: allowance.currency
                  }).format(allowance.amount)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Frequency</label>
                <p className="mt-1 capitalize text-gray-900">{allowance.frequency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Recurring</label>
                <p className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  allowance.isRecurring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {allowance.isRecurring ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tax Status</label>
                <p className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  allowance.taxable ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {allowance.taxable ? 'Taxable' : 'Tax-free'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Currency</label>
                <p className="mt-1 text-gray-900">{allowance.currency}</p>
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
              <p className="mt-1 text-sm text-gray-900">{allowance.createdBy}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(allowance.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(allowance.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Version</label>
              <p className="mt-1 text-sm text-gray-900">{allowance.version}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}