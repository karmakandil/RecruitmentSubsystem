"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/shared/ui/Card';
import { Button } from '@/components/shared/ui/Button';
import { ConfigurationTable, ConfigurationItem } from '@/components/payroll-configuration/ConfigurationTable';
import { ApprovalModal } from '@/components/payroll-configuration/ApprovalModal';
import { RejectionModal } from '@/components/payroll-configuration/RejectionModal';
import { ViewDetailsModal } from '@/components/payroll-configuration/ViewDetailsModal';
import { approvalsApi, configDetailsApi, PendingApproval } from '@/lib/api/payroll-configuration';

export default function ApprovalsPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.PAYROLL_MANAGER);

  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Modal states
  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean;
    item: PendingApproval | null;
  }>({ isOpen: false, item: null });
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    item: PendingApproval | null;
  }>({ isOpen: false, item: null });
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    item: PendingApproval | null;
    details: any;
  }>({ isOpen: false, item: null, details: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadPendingApprovals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await approvalsApi.getPendingApprovals();
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setPendingApprovals(data);
      } else if (data && typeof data === 'object') {
        // Handle case where API returns { data: [...] } or { pendingApprovals: [...] }
        const arrayData = (data as any).data || (data as any).pendingApprovals || [];
        setPendingApprovals(Array.isArray(arrayData) ? arrayData : []);
      } else {
        setPendingApprovals([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load pending approvals');
      // Use empty array for UI structure when backend is not ready
      setPendingApprovals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (comment?: string) => {
    if (!approvalModal.item) return;

    try {
      setIsProcessing(true);
      setError(null);
      await approvalsApi.approve(
        approvalModal.item.type,
        approvalModal.item._id,
        comment ? { comment } : undefined
      );
      setSuccess('Configuration approved successfully');
      setApprovalModal({ isOpen: false, item: null });
      await loadPendingApprovals();
    } catch (err: any) {
      setError(err.message || 'Failed to approve configuration');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectionModal.item) return;

    try {
      setIsProcessing(true);
      setError(null);
      await approvalsApi.reject(
        rejectionModal.item.type,
        rejectionModal.item._id,
        { comment: reason }
      );
      setSuccess('Configuration rejected successfully');
      setRejectionModal({ isOpen: false, item: null });
      await loadPendingApprovals();
    } catch (err: any) {
      setError(err.message || 'Failed to reject configuration');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (item: PendingApproval) => {
    if (!confirm('Are you sure you want to delete this configuration?')) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      await approvalsApi.delete(item.type, item._id);
      setSuccess('Configuration deleted successfully');
      await loadPendingApprovals();
    } catch (err: any) {
      setError(err.message || 'Failed to delete configuration');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleView = async (item: PendingApproval) => {
    try {
      setIsLoadingDetails(true);
      const details = await configDetailsApi.getById(item.type, item._id);
      setViewModal({
        isOpen: true,
        item,
        details,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load configuration details');
      // Fallback: show data from the item itself
      setViewModal({
        isOpen: true,
        item,
        details: item.data || item,
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Filter approvals by type
  const filteredApprovals = Array.isArray(pendingApprovals)
    ? (filterType === 'all'
        ? pendingApprovals
        : pendingApprovals.filter((item) => item.type === filterType))
    : [];

  // Get unique types for filter
  const types = Array.isArray(pendingApprovals)
    ? Array.from(new Set(pendingApprovals.map((item) => item.type)))
    : [];

  // Transform pending approvals to table format
  const tableData: ConfigurationItem[] = filteredApprovals.map((item) => ({
    _id: item._id,
    status: item.status,
    type: item.type,
    data: item.data,
    ...item.data, // Spread the actual data for display
  }));

  // Define columns based on common fields
  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (item: ConfigurationItem) => (
        <span className="font-medium capitalize">
          {item.type?.replace(/-/g, ' ') || 'Unknown'}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Name/Title',
      render: (item: ConfigurationItem) => {
        // Try to find a name/title field in the data based on type
        let nameField = 'N/A';
        if (item.grade) nameField = item.grade;
        else if (item.name) nameField = item.name;
        else if (item.policyName) nameField = item.policyName;
        else if (item.type) nameField = item.type;
        return <span className="font-medium">{nameField}</span>;
      },
    },
    {
      key: 'details',
      label: 'Details',
      render: (item: ConfigurationItem) => {
        // Show relevant details based on type
        const details: string[] = [];
        if (item.baseSalary) details.push(`Base: ${item.baseSalary.toLocaleString()} EGP`);
        if (item.grossSalary) details.push(`Gross: ${item.grossSalary.toLocaleString()} EGP`);
        if (item.amount && !item.baseSalary) details.push(`${item.amount.toLocaleString()} EGP`);
        if (item.policyType) details.push(`Type: ${item.policyType}`);
        if (item.minSalary && item.maxSalary) {
          details.push(`${item.minSalary.toLocaleString()}-${item.maxSalary.toLocaleString()} EGP`);
        }
        return <span className="text-sm text-gray-600">{details.join(' • ') || '—'}</span>;
      },
    },
    {
      key: 'createdBy',
      label: 'Created By',
      render: (item: ConfigurationItem) => {
        const createdBy = item.createdBy || item.data?.createdBy;
        if (!createdBy) return <span className="text-gray-400">N/A</span>;
        if (typeof createdBy === 'object') {
          const name = `${createdBy.firstName || ''} ${createdBy.lastName || ''}`.trim();
          return <span className="text-sm">{name || createdBy.email || 'Unknown'}</span>;
        }
        return <span className="text-sm">{createdBy}</span>;
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (item: ConfigurationItem) => {
        const date = item.createdAt || item.data?.createdAt;
        return date ? (
          <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Approval Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Review and approve pending payroll configurations (Payroll Manager only)
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 text-green-800">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                {Array.isArray(pendingApprovals) ? pendingApprovals.length : 0} configuration(s) awaiting approval
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={loadPendingApprovals}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ConfigurationTable
            data={tableData}
            columns={columns}
            isLoading={isLoading}
            onView={(item) => {
              const found = Array.isArray(pendingApprovals) ? pendingApprovals.find((p) => p._id === item._id) : null;
              if (found) handleView(found);
            }}
            onApprove={(item) =>
              setApprovalModal({
                isOpen: true,
                item: (Array.isArray(pendingApprovals) ? pendingApprovals.find((p) => p._id === item._id) : null) || null,
              })
            }
            onReject={(item) =>
              setRejectionModal({
                isOpen: true,
                item: (Array.isArray(pendingApprovals) ? pendingApprovals.find((p) => p._id === item._id) : null) || null,
              })
            }
            onDelete={(item) => {
              const found = Array.isArray(pendingApprovals) ? pendingApprovals.find((p) => p._id === item._id) : null;
              if (found) handleDelete(found);
            }}
            canApprove={() => true}
            canReject={() => true}
            canDelete={(item) => item.status === 'draft'}
          />
        </CardContent>
      </Card>

      <ApprovalModal
        isOpen={approvalModal.isOpen}
        onClose={() => setApprovalModal({ isOpen: false, item: null })}
        onApprove={handleApprove}
        title={`Approve ${approvalModal.item?.type?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Configuration'}`}
        isLoading={isProcessing}
      />

      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={() => setRejectionModal({ isOpen: false, item: null })}
        onReject={handleReject}
        title={`Reject ${rejectionModal.item?.type?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Configuration'}`}
        isLoading={isProcessing}
      />

      <ViewDetailsModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, item: null, details: null })}
        title={`${viewModal.item?.type?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Configuration'} Details`}
        data={viewModal.details}
        type={viewModal.item?.type || ''}
      />
    </div>
  );
}

