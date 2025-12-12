'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { allowancesApi } from '@/lib/api/payroll-configuration/allowances';

export default function AllowancesPage() {
  const router = useRouter();
  const [allowances, setAllowances] = useState<any[]>([]);
  const [allAllowances, setAllAllowances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadAllowances();
  }, [statusFilter]);

  const loadAllowances = async () => {
    setIsLoading(true);
    try {
      const status = statusFilter !== 'all' ? statusFilter as 'draft' | 'approved' | 'rejected' : undefined;
      const data = await allowancesApi.getAll(status);
      setAllAllowances(data);
      setAllowances(data);
    } catch (error) {
      console.error('Error loading allowances:', error);
      setAllowances([]);
      setAllAllowances([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Allowance Name',
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
          item.allowanceType === 'housing' ? 'bg-blue-100 text-blue-800' :
          item.allowanceType === 'transportation' ? 'bg-green-100 text-green-800' :
          item.allowanceType === 'meal' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {item.allowanceType}
        </span>
      )
    },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (item: any) => (
        <div>
          <div className="font-medium text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: item.currency
            }).format(item.amount)}
          </div>
          <div className="text-xs text-gray-500">
            {item.frequency} • {item.taxable ? 'Taxable' : 'Tax-free'}
          </div>
        </div>
      )
    },
    { 
      key: 'recurring', 
      header: 'Recurring',
      render: (item: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.isRecurring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {item.isRecurring ? 'Recurring' : 'One-time'}
        </span>
      )
    },
  ];

  const handleCreateNew = () => {
    router.push('/dashboard/payroll-configuration/allowances/new');
  };

  const handleView = (item: any) => {
    router.push(`/dashboard/payroll-configuration/allowances/${item.id}`);
  };

  const handleEdit = (item: any) => {
    if (item.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/allowances/${item.id}/edit`);
    } else {
      alert('Only draft allowances can be edited.');
    }
  };

  const handleDelete = async (item: any) => {
    if (item.status !== 'draft') {
      alert('Only draft allowances can be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      await allowancesApi.delete(item.id);
      loadAllowances(); // Refresh
    } catch (error) {
      console.error('Error deleting allowance:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete allowance');
    }
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    return allAllowances.filter(g => {
      const normalizedStatus = String(g.status || '').toLowerCase();
      return normalizedStatus === status;
    }).length;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Allowances</h1>
          <p className="text-gray-600 mt-1">Manage employee allowances (housing, transportation, meal, etc.)</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Allowance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {(['draft', 'approved', 'rejected'] as const).map((status) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <StatusBadge status={status} size="sm" />
              <div className="ml-3">
                <p className="text-sm text-gray-500">{status.charAt(0).toUpperCase() + status.slice(1)} Allowances</p>
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
            data={allowances}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            emptyMessage="No allowances found. Create your first allowance to get started."
          />
        </div>
      </div>
    </div>
  );
}