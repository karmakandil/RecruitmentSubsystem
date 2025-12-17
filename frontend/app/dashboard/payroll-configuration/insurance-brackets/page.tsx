'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { insuranceBracketsApi } from '@/lib/api/payroll-configuration/insurance-brackets';
import { InsuranceBracket } from '@/lib/api/payroll-configuration/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/shared/ui/Card';

export default function InsuranceBracketsPage() {
  // Only Payroll Specialist can create/edit insurance brackets
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST, '/dashboard');
  
  const router = useRouter();
  const [insuranceBrackets, setInsuranceBrackets] = useState<InsuranceBracket[]>([]);
  const [allInsuranceBrackets, setAllInsuranceBrackets] = useState<InsuranceBracket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadInsuranceBrackets();
  }, [statusFilter]);

  const loadInsuranceBrackets = async () => {
    setIsLoading(true);
    try {
      const status = statusFilter !== 'all' ? statusFilter as 'draft' | 'approved' | 'rejected' : undefined;
      const data = await insuranceBracketsApi.getAll(status);
      setAllInsuranceBrackets(data);
      setInsuranceBrackets(data);
    } catch (error) {
      console.error('Error loading insurance brackets:', error);
      setInsuranceBrackets([]);
      setAllInsuranceBrackets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Insurance Bracket Name',
      render: (item: InsuranceBracket) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">Insurance bracket configuration</div>
        </div>
      )
    },
    { 
      key: 'salaryRange', 
      label: 'Salary Range',
      render: (item: InsuranceBracket) => (
        <div className="text-sm text-gray-900">
          <div>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'EGP'
            }).format(item.minSalary)} - {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'EGP'
            }).format(item.maxSalary)}
          </div>
        </div>
      )
    },
    { 
      key: 'rates', 
      label: 'Contribution Rates',
      render: (item: InsuranceBracket) => (
        <div className="text-sm text-gray-900">
          <div>Employee: {item.employeeRate.toFixed(2)}%</div>
          <div>Employer: {item.employerRate.toFixed(2)}%</div>
        </div>
      )
    },
    { 
      key: 'createdBy', 
      label: 'Created By',
      render: (item: InsuranceBracket) => (
        <div className="text-sm text-gray-900">{item.createdBy || 'N/A'}</div>
      )
    },
  ];

  const handleCreateNew = () => {
    router.push('/dashboard/payroll-configuration/insurance-brackets/new');
  };

  const handleView = (item: InsuranceBracket) => {
    router.push(`/dashboard/payroll-configuration/insurance-brackets/${item.id}`);
  };

  const handleEdit = (item: InsuranceBracket) => {
    if (item.status === 'draft') {
      router.push(`/dashboard/payroll-configuration/insurance-brackets/${item.id}/edit`);
    } else {
      alert('Only draft insurance brackets can be edited.');
    }
  };

  const handleDelete = async (item: InsuranceBracket) => {
    if (item.status !== 'draft') {
      alert('Only draft insurance brackets can be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      await insuranceBracketsApi.delete(item.id);
      loadInsuranceBrackets(); // Refresh
    } catch (error) {
      console.error('Error deleting insurance bracket:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete insurance bracket');
    }
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    return allInsuranceBrackets.filter(g => {
      const normalizedStatus = String(g.status || '').toLowerCase();
      return normalizedStatus === status;
    }).length;
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insurance Brackets</h1>
            <p className="text-gray-600 mt-1">Configure insurance brackets (e.g., health, social, etc) with defined salary ranges and contribution percentages for both employer and employee, so that the system automatically applies the correct insurance deductions during payroll processing in compliance with policy and law</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-cyan-600 text-white text-sm font-medium rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200 flex items-center shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create New Insurance Bracket
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow border-2 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Insurance Brackets</p>
                <p className="text-3xl font-bold text-gray-900">{getStatusCount('draft')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Insurance Brackets</p>
                <p className="text-3xl font-bold text-gray-900">{getStatusCount('approved')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow border-2 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Insurance Brackets</p>
                <p className="text-3xl font-bold text-gray-900">{getStatusCount('rejected')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Insurance Brackets</CardTitle>
          <CardDescription>View, edit, and manage all insurance bracket configurations</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-4 border-b">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md transition"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <button
              onClick={loadInsuranceBrackets}
              className="px-4 py-2 border-2 border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 flex items-center transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>

          {/* Table */}
          <ConfigurationTable
            data={insuranceBrackets}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            emptyMessage={statusFilter !== 'all' ? `No ${statusFilter} insurance brackets found.` : 'No insurance brackets created yet. Start by creating your first insurance bracket configuration.'}
          />

          {/* Table Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Only insurance brackets with <StatusBadge status="draft" size="sm" /> status can be edited or deleted. 
                Insurance brackets with <StatusBadge status="approved" size="sm" /> or <StatusBadge status="rejected" size="sm" /> status are read-only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

