'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';

// Mock data
const mockPayTypes = [
  {
    id: '1',
    name: 'Monthly Salary',
    description: 'Fixed monthly salary',
    status: 'approved' as const,
    type: 'salary',
    calculationMethod: 'fixed',
    isTaxable: true,
    isOvertimeEligible: false,
    createdBy: 'payroll.specialist@company.com',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
    version: 1
  },
  {
    id: '2',
    name: 'Hourly Contract',
    description: 'Hourly rate for contractors',
    status: 'draft' as const,
    type: 'hourly',
    calculationMethod: 'hourly_rate * hours_worked',
    isTaxable: true,
    isOvertimeEligible: true,
    overtimeRate: 1.5,
    minHours: 40,
    maxHours: 60,
    createdBy: 'payroll.specialist@company.com',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-10T11:00:00Z',
    version: 1
  },
  {
    id: '3',
    name: 'Commission Based',
    description: 'Sales commission',
    status: 'draft' as const,
    type: 'commission',
    calculationMethod: 'sales * commission_rate',
    isTaxable: true,
    isOvertimeEligible: false,
    createdBy: 'sales.admin@company.com',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
    version: 1
  }
];

export default function PayTypesPage() {
  const router = useRouter();
  const [payTypes, setPayTypes] = useState<any[]>(mockPayTypes);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadPayTypes();
  }, [statusFilter]);

  const loadPayTypes = async () => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = mockPayTypes;
      if (statusFilter !== 'all') {
        filtered = mockPayTypes.filter(g => g.status === statusFilter);
      }
      setPayTypes(filtered);
      setIsLoading(false);
    }, 500);
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Pay Type Name',
      render: (item: any) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">{item.description}</div>
        </div>
      )
    },
    { 
      key: 'type', 
      header: 'Type',
      render: (item: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.type === 'salary' ? 'bg-purple-100 text-purple-800' :
          item.type === 'hourly' ? 'bg-blue-100 text-blue-800' :
          item.type === 'commission' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.type}
        </span>
      )
    },
    { 
      key: 'calculationMethod', 
      header: 'Calculation Method',
      render: (item: any) => (
        <div className="text-sm text-gray-900">
          {item.calculationMethod}
          {item.isOvertimeEligible && (
            <div className="text-xs text-blue-600 mt-1">Overtime eligible</div>
          )}
        </div>
      )
    },
    { 
      key: 'taxStatus', 
      header: 'Tax Status',
      render: (item: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.isTaxable ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {item.isTaxable ? 'Taxable' : 'Tax-free'}
        </span>
      )
    },
  ];

  const handleCreateNew = () => {
    router.push('/dashboard/payroll-configuration/pay-types/new');
  };

  const handleView = (item: any) => {
    router.push(`/dashboard/payroll-configuration/pay-types/${item.id}`);
  };

  const handleEdit = (item: any) => {
    if (item.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/pay-types/${item.id}/edit`);
    } else {
      alert('Only draft pay types can be edited.');
    }
  };

  const handleDelete = async (item: any) => {
    if (item.status !== 'draft') {
      alert('Only draft pay types can be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    console.log('Delete pay type:', item.id);
    loadPayTypes();
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    return mockPayTypes.filter(g => g.status === status).length;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pay Types</h1>
          <p className="text-gray-600 mt-1">Define different types of compensation (salary, hourly, commission, etc.)</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Pay Type
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {(['draft', 'approved', 'rejected'] as const).map((status) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <StatusBadge status={status} size="sm" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">{status.charAt(0).toUpperCase() + status.slice(1)} Pay Types</p>
                <p className="text-2xl font-bold">{getStatusCount(status)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <ConfigurationTable
            data={payTypes}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            emptyMessage="No pay types found. Create your first pay type to get started."
          />
        </div>
      </div>
    </div>
  );
}