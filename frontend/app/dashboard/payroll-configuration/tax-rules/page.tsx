'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import ConfigurationTable from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { taxRulesApi } from '@/lib/api/payroll-configuration/tax-rules';
import { TaxRule } from '@/lib/api/payroll-configuration/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/shared/ui/Card';

export default function TaxRulesPage() {
  // Legal & Policy Admin can create/edit tax rules
  useRequireAuth(SystemRole.LEGAL_POLICY_ADMIN, '/dashboard');
  
  const router = useRouter();
  const [taxRules, setTaxRules] = useState<TaxRule[]>([]);
  const [allTaxRules, setAllTaxRules] = useState<TaxRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadTaxRules();
  }, [statusFilter]);

  const loadTaxRules = async () => {
    setIsLoading(true);
    try {
      const status = statusFilter !== 'all' ? statusFilter as 'draft' | 'approved' | 'rejected' : undefined;
      const data = await taxRulesApi.getAll(status);
      setAllTaxRules(data);
      setTaxRules(data);
    } catch (error) {
      console.error('Error loading tax rules:', error);
      setTaxRules([]);
      setAllTaxRules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Tax Rule Name',
      render: (item: TaxRule) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          {item.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
          )}
        </div>
      )
    },
    { 
      key: 'rate', 
      header: 'Tax Rate',
      render: (item: TaxRule) => (
        <div>
          <div className="font-medium text-gray-900">
            {item.rate.toFixed(2)}%
          </div>
          {item.isProgressive && (
            <div className="text-xs text-blue-600 font-medium">Progressive</div>
          )}
        </div>
      )
    },
    { 
      key: 'thresholds', 
      header: 'Thresholds',
      render: (item: TaxRule) => {
        if (item.thresholds && (item.thresholds.minAmount || item.thresholds.maxAmount)) {
          return (
            <div className="text-sm text-gray-900">
              {item.thresholds.minAmount !== undefined && (
                <div>Min: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP' }).format(item.thresholds.minAmount)}</div>
              )}
              {item.thresholds.maxAmount !== undefined && (
                <div>Max: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP' }).format(item.thresholds.maxAmount)}</div>
              )}
            </div>
          );
        }
        return <span className="text-gray-400">No thresholds</span>;
      }
    },
    { 
      key: 'exemptions', 
      header: 'Exemptions',
      render: (item: TaxRule) => (
        <div className="text-sm text-gray-900">
          {item.exemptions && item.exemptions.length > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {item.exemptions.length} exemption{item.exemptions.length !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-gray-400">None</span>
          )}
        </div>
      )
    },
    { 
      key: 'createdBy', 
      header: 'Created By',
      render: (item: TaxRule) => (
        <div className="text-sm text-gray-900">{item.createdBy || 'N/A'}</div>
      )
    },
  ];

  const handleCreateNew = () => {
    router.push('/dashboard/payroll-configuration/tax-rules/new');
  };

  const handleView = (item: TaxRule) => {
    router.push(`/dashboard/payroll-configuration/tax-rules/${item.id}`);
  };

  const handleEdit = (item: TaxRule) => {
    // According to business rules, approved tax rules can be edited (for legal updates)
    // Editing approved tax rule sets it back to Draft
    if (item.status === 'draft' || item.status === 'approved') {
      router.push(`/dashboard/payroll-configuration/tax-rules/${item.id}/edit`);
    } else {
      alert('Only draft or approved tax rules can be edited.');
    }
  };

  const handleDelete = async (item: TaxRule) => {
    if (item.status !== 'draft') {
      alert('Only draft tax rules can be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      await taxRulesApi.delete(item.id);
      loadTaxRules(); // Refresh
    } catch (error) {
      console.error('Error deleting tax rule:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete tax rule');
    }
  };

  const getStatusCount = (status: 'draft' | 'approved' | 'rejected') => {
    return allTaxRules.filter(g => {
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
            <h1 className="text-3xl font-bold text-gray-900">Tax Rules</h1>
            <p className="text-gray-600 mt-1">Define tax rules and laws (progressive tax rates, exemptions, thresholds) to ensure payroll compliance with current legislation</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 flex items-center shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create New Tax Rule
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
                <p className="text-sm font-medium text-gray-600">Draft Tax Rules</p>
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
                <p className="text-sm font-medium text-gray-600">Approved Tax Rules</p>
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
                <p className="text-sm font-medium text-gray-600">Rejected Tax Rules</p>
                <p className="text-3xl font-bold text-gray-900">{getStatusCount('rejected')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Tax Rules</CardTitle>
          <CardDescription>View, edit, and manage all tax rules and laws</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-4 border-b">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-sm border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 rounded-md transition"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <button
              onClick={loadTaxRules}
              className="px-4 py-2 border-2 border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>

          {/* Table */}
          <ConfigurationTable
            data={taxRules}
            columns={columns}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            emptyMessage={statusFilter !== 'all' ? `No ${statusFilter} tax rules found.` : 'No tax rules created yet. Start by creating your first tax rule.'}
          />

          {/* Table Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Draft tax rules can be edited or deleted. Approved tax rules can be edited (for legal updates) and will be set back to Draft status requiring re-approval. 
                Rejected tax rules are read-only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

