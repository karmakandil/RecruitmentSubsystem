'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';

// Mock data - you'll replace this with real API
const mockPayGrades = [
  {
    id: '1',
    name: 'Junior Developer',
    description: 'Entry-level software development position',
    status: 'approved' as const,
    minSalary: 8000,
    maxSalary: 12000,
    currency: 'EGP',
    jobGrade: 'JG-5',
    jobBand: 'Individual Contributor',
    benefits: ['Health Insurance', 'Annual Bonus'],
    isActive: true,
    createdBy: 'hr.admin@company.com',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z',
    version: 1
  },
  {
    id: '2',
    name: 'Senior Developer',
    description: 'Experienced software development position',
    status: 'draft' as const,
    minSalary: 15000,
    maxSalary: 25000,
    currency: 'EGP',
    jobGrade: 'JG-7',
    jobBand: 'Senior Individual Contributor',
    benefits: ['Health Insurance', 'Annual Bonus', 'Stock Options'],
    isActive: true,
    createdBy: 'hr.admin@company.com',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
    version: 1
  },
  {
    id: '3',
    name: 'Team Lead',
    description: 'Team leadership position',
    status: 'draft' as const,
    minSalary: 20000,
    maxSalary: 35000,
    currency: 'EGP',
    jobGrade: 'JG-8',
    jobBand: 'Leadership',
    benefits: ['Health Insurance', 'Annual Bonus', 'Stock Options', 'Car Allowance'],
    isActive: true,
    createdBy: 'hr.admin@company.com',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    version: 1
  }
];

export default function PayGradesPage() {
  const router = useRouter();
  const [payGrades, setPayGrades] = useState<any[]>(mockPayGrades);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // In real app: fetch data from API
    loadPayGrades();
  }, [statusFilter]);

  const loadPayGrades = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = mockPayGrades;
      if (statusFilter !== 'all') {
        filtered = mockPayGrades.filter(g => g.status === statusFilter);
      }
      setPayGrades(filtered);
      setIsLoading(false);
    }, 500);
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Pay Grade Name',
      render: (item: any) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">{item.jobGrade} • {item.jobBand}</div>
        </div>
      )
    },
    { 
      key: 'salary', 
      header: 'Salary Range',
      render: (item: any) => (
        <div>
          <div className="font-medium text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: item.currency
            }).format(item.minSalary)} - {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: item.currency
            }).format(item.maxSalary)}
          </div>
          <div className="text-xs text-gray-500">{item.currency}</div>
        </div>
      )
    },
    { 
      key: 'benefits', 
      header: 'Benefits',
      render: (item: any) => (
        <div className="text-sm text-gray-900">
          {item.benefits?.slice(0, 2).join(', ')}
          {item.benefits?.length > 2 && '...'}
        </div>
      )
    },
    { 
      key: 'createdBy', 
      header: 'Created By',
      render: (item: any) => (
        <div className="text-sm text-gray-900">{item.createdBy}</div>
      )
    },
  ];

  const handleCreateNew = () => {
    router.push('/dashboard/payroll-configuration/pay-grades/new');
  };

  const handleView = (item: any) => {
    router.push(`/dashboard/payroll-configuration/pay-grades/${item.id}`);
  };

  const handleEdit = (item: any) => {
    if (item.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/pay-grades/${item.id}/edit`);
    } else {
      alert('Only draft pay grades can be edited.');
    }
  };

  const handleDelete = async (item: any) => {
    if (item.status !== 'draft') {
      alert('Only draft pay grades can be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    // In real app: API call to delete
    console.log('Delete pay grade:', item.id);
    loadPayGrades(); // Refresh
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    return mockPayGrades.filter(g => g.status === status).length;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pay Grades</h1>
          <p className="text-gray-600 mt-1">Define salary ranges and benefits for different job grades</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Pay Grade
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <StatusBadge status="draft" size="sm" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Draft Pay Grades</p>
              <p className="text-2xl font-bold">{getStatusCount('draft')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <StatusBadge status="approved" size="sm" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Approved Pay Grades</p>
              <p className="text-2xl font-bold">{getStatusCount('approved')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <StatusBadge status="rejected" size="sm" />
            <div className="ml-3">
              <p className="text-sm text-gray-500">Rejected Pay Grades</p>
              <p className="text-2xl font-bold">{getStatusCount('rejected')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Filters */}
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

          {/* Table */}
          <ConfigurationTable
            data={payGrades}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            emptyMessage="No pay grades found. Create your first pay grade to get started."
          />
        </div>
      </div>
    </div>
  );
}