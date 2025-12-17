'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth, useAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { ConfigurationTable } from '@/components/payroll-configuration/ConfigurationTable';
import StatusBadge from '@/components/payroll-configuration/StatusBadge';
import { taxRulesApi } from '@/lib/api/payroll-configuration/tax-rules';
import { TaxRule } from '@/lib/api/payroll-configuration/types';

export default function TaxRulesPage() {
  // Allow view access for multiple roles, but only Legal Admin can create/edit
  useRequireAuth(
    [
      SystemRole.LEGAL_POLICY_ADMIN,
      SystemRole.PAYROLL_SPECIALIST,
      SystemRole.PAYROLL_MANAGER,
      SystemRole.SYSTEM_ADMIN,
      SystemRole.HR_MANAGER,
      SystemRole.HR_ADMIN,
      SystemRole.DEPARTMENT_EMPLOYEE,
      SystemRole.DEPARTMENT_HEAD,
    ],
    '/dashboard'
  );
  
  const { user } = useAuth();
  const isLegalAdmin = user?.roles?.some(role => 
    String(role).toLowerCase() === String(SystemRole.LEGAL_POLICY_ADMIN).toLowerCase()
  );
  
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
      label: 'Tax Rule Name',
      render: (item: TaxRule) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-100 to-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{item.name}</div>
            {item.description && (
              <div className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{item.description}</div>
            )}
          </div>
        </div>
      )
    },
    { 
      key: 'rate', 
      label: 'Tax Rate',
      render: (item: TaxRule) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-700">{item.rate.toFixed(2)}%</span>
          </div>
          {item.isProgressive && (
            <div className="text-xs text-blue-600 font-medium">Progressive</div>
          )}
          <div className="text-xs text-gray-500">Tax rate</div>
        </div>
      )
    },
    { 
      key: 'thresholds', 
      label: 'Thresholds',
      render: (item: TaxRule) => {
        if (item.thresholds && (item.thresholds.minAmount || item.thresholds.maxAmount)) {
          return (
            <div className="text-sm text-gray-900 space-y-1">
              {item.thresholds.minAmount !== undefined && (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  <span>Min: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP' }).format(item.thresholds.minAmount)}</span>
                </div>
              )}
              {item.thresholds.maxAmount !== undefined && (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                  </svg>
                  <span>Max: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP' }).format(item.thresholds.maxAmount)}</span>
                </div>
              )}
            </div>
          );
        }
        return <span className="text-gray-400 text-sm">No thresholds</span>;
      }
    },
    { 
      key: 'exemptions', 
      label: 'Exemptions',
      render: (item: TaxRule) => (
        <div className="text-sm text-gray-900">
          {item.exemptions && item.exemptions.length > 0 ? (
            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm">
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
      label: 'Created By',
      render: (item: TaxRule) => {
        // Safety check: handle if createdBy is still an object
        let createdByDisplay: string = typeof item.createdBy === 'string' ? item.createdBy : '';
        if (item.createdBy && typeof item.createdBy === 'object') {
          const createdByObj = item.createdBy as any;
          if (createdByObj.firstName && createdByObj.lastName) {
            createdByDisplay = `${createdByObj.firstName} ${createdByObj.lastName}`;
          } else if (createdByObj.fullName) {
            createdByDisplay = createdByObj.fullName;
          } else if (createdByObj.email) {
            createdByDisplay = createdByObj.email;
          } else {
            createdByDisplay = 'Unknown';
          }
        }
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {createdByDisplay ? createdByDisplay.charAt(0).toUpperCase() : '?'}
            </div>
            <span className="text-sm font-medium text-gray-700">{createdByDisplay || 'N/A'}</span>
          </div>
        );
      }
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (item: TaxRule) => <StatusBadge status={item.status} />
    },
  ];

  const handleCreateNew = () => {
    // Only Legal Admin can create
    if (!isLegalAdmin) {
      alert('Only Legal Admin can create tax rules.');
      return;
    }
    router.push('/dashboard/payroll-configuration/tax-rules/new');
  };

  const handleView = (item: TaxRule) => {
    router.push(`/dashboard/payroll-configuration/tax-rules/${item.id}`);
  };

  const handleEdit = (item: TaxRule) => {
    // Only Legal Admin can edit
    if (!isLegalAdmin) {
      alert('Only Legal Admin can edit tax rules.');
      return;
    }
    // According to business rules, approved tax rules can be edited (for legal updates)
    // Editing approved tax rule sets it back to Draft
    if (item.status === 'draft' || item.status === 'approved') {
      router.push(`/dashboard/payroll-configuration/tax-rules/${item.id}/edit`);
    } else {
      alert('Only draft or approved tax rules can be edited.');
    }
  };

  const handleDelete = async (item: TaxRule) => {
    // Only Legal Admin can delete
    if (!isLegalAdmin) {
      alert('Only Legal Admin can delete tax rules.');
      return;
    }
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">Tax Rules</h1>
                  <p className="text-gray-600 mt-1 text-sm">Define tax rules and laws to ensure payroll compliance</p>
                </div>
              </div>
            </div>
            {isLegalAdmin && (
              <button
                onClick={handleCreateNew}
                className="group relative px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-slate-700 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 flex items-center transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Create New Tax Rule
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {(['draft', 'approved', 'rejected'] as const).map((status) => {
              const statusConfig = {
                draft: { border: 'border-amber-100', bg: 'bg-amber-100', icon: 'text-amber-600', bgIcon: 'bg-amber-100' },
                approved: { border: 'border-green-100', bg: 'bg-green-100', icon: 'text-green-600', bgIcon: 'bg-green-100' },
                rejected: { border: 'border-red-100', bg: 'bg-red-100', icon: 'text-red-600', bgIcon: 'bg-red-100' }
              };
              const config = statusConfig[status];
              return (
                <div key={status} className={`bg-white p-6 rounded-2xl shadow-lg border ${config.border} hover:shadow-xl transition-shadow duration-200 relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 ${config.bg} rounded-full -mr-16 -mt-16 opacity-50`}></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${config.bgIcon} rounded-xl`}>
                        {status === 'draft' && (
                          <svg className={`w-6 h-6 ${config.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        )}
                        {status === 'approved' && (
                          <svg className={`w-6 h-6 ${config.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        )}
                        {status === 'rejected' && (
                          <svg className={`w-6 h-6 ${config.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                        <p className="text-3xl font-bold text-gray-900">{getStatusCount(status)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter and Table Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                <label className="text-sm font-semibold text-gray-700">Filter by status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 text-sm font-medium border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-gray-700 transition-all duration-200 hover:border-slate-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <button
                onClick={loadTaxRules}
                className="px-4 py-2 border-2 border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 flex items-center hover:border-slate-300"
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
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="font-semibold mb-1">Tax Rule Management Rules:</p>
                  <p>• Only Legal Admin can create, edit, or delete tax rules.</p>
                  <p>• Draft tax rules can be edited or deleted.</p>
                  <p>• Approved tax rules can be edited (for legal updates) and will be set back to Draft status requiring re-approval.</p>
                  <p>• Rejected tax rules are read-only.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

