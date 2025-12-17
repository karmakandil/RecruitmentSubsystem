'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { payTypesApi } from '@/lib/api/payroll-configuration/payTypes';

export default function PayTypesPage() {
  // Only Payroll Specialist can create/edit pay types
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  
  const router = useRouter();
  const [payTypes, setPayTypes] = useState<any[]>([]);
  const [allPayTypes, setAllPayTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadPayTypes();
  }, [statusFilter]);

  const loadPayTypes = async () => {
    setIsLoading(true);
    try {
      const status = statusFilter !== 'all' ? statusFilter as 'draft' | 'approved' | 'rejected' : undefined;
      const data = await payTypesApi.getAll(status);
      setAllPayTypes(data);
      setPayTypes(data);
    } catch (error) {
      console.error('Error loading pay types:', error);
      setPayTypes([]);
      setAllPayTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Pay Type Name',
      render: (item: any) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">{item.description}</div>
        </div>
      )
    },
    { 
      key: 'type', 
      label: 'Type',
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
      label: 'Calculation Method',
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
      label: 'Tax Status',
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

    try {
      await payTypesApi.delete(item.id);
      loadPayTypes(); // Refresh
    } catch (error) {
      console.error('Error deleting pay type:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete pay type');
    }
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    return allPayTypes.filter(g => {
      const normalizedStatus = String(g.status || '').toLowerCase();
      return normalizedStatus === status;
    }).length;
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