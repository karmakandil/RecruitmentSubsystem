'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import { policiesApi } from '@/lib/api/payroll-configuration/policies';
import { PayrollPolicy } from '@/lib/api/payroll-configuration/types';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';

export default function PoliciesPage() {
  const router = useRouter();
  const [allPolicies, setAllPolicies] = useState<PayrollPolicy[]>([]); // Store all policies for stats
  const [policies, setPolicies] = useState<PayrollPolicy[]>([]); // Filtered policies for display
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadPolicies();
  }, [statusFilter]);

  const loadPolicies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Always fetch all policies for accurate stats
      const allData = await policiesApi.getAll();
      setAllPolicies(allData);
      
      // Apply filter for display
      const filter = statusFilter === 'all' ? undefined : statusFilter as 'draft' | 'approved' | 'rejected';
      if (filter) {
        const filtered = allData.filter(p => p.status.toLowerCase() === filter.toLowerCase());
        setPolicies(filtered);
      } else {
        setPolicies(allData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load policies');
      console.error('Error loading policies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Policy Name',
      render: (item: PayrollPolicy) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          {item.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
          )}
        </div>
      )
    },
    { 
      key: 'policyType', 
      header: 'Type',
      render: (item: PayrollPolicy) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {item.policyType}
        </span>
      )
    },
    { 
      key: 'effectiveDate', 
      header: 'Effective Date',
      render: (item: PayrollPolicy) => (
        <div className="text-sm text-gray-900">
          {new Date(item.effectiveDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      )
    },
    { 
      key: 'createdBy', 
      header: 'Created By',
      render: (item: PayrollPolicy) => {
        // Safety check: handle if createdBy is still an object
        let createdByDisplay = item.createdBy;
        if (createdByDisplay && typeof createdByDisplay === 'object') {
          if (createdByDisplay.firstName && createdByDisplay.lastName) {
            createdByDisplay = `${createdByDisplay.firstName} ${createdByDisplay.lastName}`;
          } else if (createdByDisplay.fullName) {
            createdByDisplay = createdByDisplay.fullName;
          } else if (createdByDisplay.email) {
            createdByDisplay = createdByDisplay.email;
          } else {
            createdByDisplay = 'Unknown';
          }
        }
        return <div className="text-sm text-gray-900">{createdByDisplay || 'N/A'}</div>;
      }
    },
  ];

  const handleCreateNew = () => {
    router.push('/dashboard/payroll-configuration/policies/new');
  };

  const handleView = (policy: PayrollPolicy) => {
    router.push(`/dashboard/payroll-configuration/policies/${policy.id}`);
  };

  const handleEdit = (policy: PayrollPolicy) => {
    if (policy.status?.toLowerCase() === 'draft') {
      router.push(`/dashboard/payroll-configuration/policies/${policy.id}/edit`);
    } else {
      alert('Only draft policies can be edited.');
    }
  };

  const handleDelete = async (policy: PayrollPolicy) => {
    if (policy.status?.toLowerCase() !== 'draft') {
      alert('Only draft policies can be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${policy.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await policiesApi.delete(policy.id);
      // Refresh the list
      loadPolicies();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete policy');
    }
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    // Use allPolicies for accurate counts, not filtered policies
    return allPolicies.filter(p => p.status?.toLowerCase() === status.toLowerCase()).length;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Policies</h1>
          <p className="text-gray-600 mt-1">Manage and configure payroll policies for your organization</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Policy
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 mr-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Draft Policies</p>
              <p className="text-2xl font-bold">{getStatusCount('draft')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved Policies</p>
              <p className="text-2xl font-bold">{getStatusCount('approved')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected Policies</p>
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
            
            <button
              onClick={loadPolicies}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 font-medium">Error: {error}</p>
              </div>
            </div>
          )}

          {/* Table */}
          <ConfigurationTable
            data={policies}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            emptyMessage={statusFilter !== 'all' ? `No ${statusFilter} policies found.` : 'No policies created yet. Start by creating your first policy.'}
          />

          {/* Table Info */}
          <div className="mt-4 text-sm text-gray-500">
            <p>• Only policies with <StatusBadge status="draft" size="sm" /> status can be edited or deleted.</p>
            <p>• Policies with <StatusBadge status="approved" size="sm" /> or <StatusBadge status="rejected" size="sm" /> status are read-only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}