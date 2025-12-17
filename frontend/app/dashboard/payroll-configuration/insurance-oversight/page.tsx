"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRequireAuth } from '@/lib/hooks/use-auth';
import { SystemRole } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/shared/ui/Card';
import { Button } from '@/components/shared/ui/Button';
import { ConfigurationTable, ConfigurationItem } from '@/components/payroll-configuration/ConfigurationTable';
import { ApprovalModal } from '@/components/payroll-configuration/ApprovalModal';
import { RejectionModal } from '@/components/payroll-configuration/RejectionModal';
import { ViewDetailsModal } from '@/components/payroll-configuration/ViewDetailsModal';
import { insuranceBracketsApi, configDetailsApi, InsuranceBracket, ConfigStatus } from '@/lib/api/payroll-configuration';

export default function InsuranceOversightPage() {
  const { user } = useAuth();
  const router = useRouter();
  useRequireAuth(SystemRole.HR_MANAGER);

  const [insuranceBrackets, setInsuranceBrackets] = useState<InsuranceBracket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ConfigStatus | 'all'>('all');

  // Modal states
  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean;
    item: InsuranceBracket | null;
  }>({ isOpen: false, item: null });
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    item: InsuranceBracket | null;
  }>({ isOpen: false, item: null });
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    item: InsuranceBracket | null;
    details: any;
  }>({ isOpen: false, item: null, details: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    loadInsuranceBrackets();
  }, [statusFilter]);

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadInsuranceBrackets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const status = statusFilter !== 'all' ? statusFilter as 'draft' | 'approved' | 'rejected' : undefined;
      const data = await insuranceBracketsApi.getAll(status);
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setInsuranceBrackets(data);
      } else if (data && typeof data === 'object') {
        // Handle case where API returns { data: [...] } or { insuranceBrackets: [...] }
        const arrayData = (data as any).data || (data as any).insuranceBrackets || [];
        setInsuranceBrackets(Array.isArray(arrayData) ? arrayData : []);
      } else {
        setInsuranceBrackets([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load insurance brackets');
      // Use empty array for UI structure when backend is not ready
      setInsuranceBrackets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (comment?: string) => {
    if (!approvalModal.item) return;

    try {
      setIsProcessing(true);
      setError(null);
      const id = approvalModal.item.id;
      await insuranceBracketsApi.approve(
        id,
        comment ? { comment } : undefined
      );
      setSuccess('Insurance bracket approved successfully');
      setApprovalModal({ isOpen: false, item: null });
      await loadInsuranceBrackets();
    } catch (err: any) {
      setError(err.message || 'Failed to approve insurance bracket');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectionModal.item) return;

    try {
      setIsProcessing(true);
      setError(null);
      const id = rejectionModal.item.id;
      await insuranceBracketsApi.reject(id, { comment: reason });
      setSuccess('Insurance bracket rejected successfully');
      setRejectionModal({ isOpen: false, item: null });
      await loadInsuranceBrackets();
    } catch (err: any) {
      setError(err.message || 'Failed to reject insurance bracket');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (item: InsuranceBracket) => {
    if (!confirm('Are you sure you want to delete this insurance bracket?')) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const id = item.id;
      await insuranceBracketsApi.delete(id);
      setSuccess('Insurance bracket deleted successfully');
      await loadInsuranceBrackets();
    } catch (err: any) {
      setError(err.message || 'Failed to delete insurance bracket');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleView = async (item: InsuranceBracket) => {
    try {
      setIsLoadingDetails(true);
      const id = item.id;
      const details = await insuranceBracketsApi.getById(id);
      setViewModal({
        isOpen: true,
        item,
        details,
      });
    } catch (err: any) {
      // Fallback: use the item data itself
      setViewModal({
        isOpen: true,
        item,
        details: item,
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleEdit = (item: InsuranceBracket) => {
    // Navigate to edit page - HR Managers can edit insurance brackets
    // Pattern: /dashboard/payroll-configuration/insurance-brackets/{id}/edit
    const editUrl = `/dashboard/payroll-configuration/insurance-brackets/${item.id}/edit`;
    router.push(editUrl);
  };

  // Filter brackets by status
  const filteredBrackets = Array.isArray(insuranceBrackets)
    ? (statusFilter === 'all'
        ? insuranceBrackets
        : insuranceBrackets.filter((item) => item.status === statusFilter))
    : [];

  // Transform to table format
  const tableData: ConfigurationItem[] = filteredBrackets.map((item) => ({
    _id: item.id, // Map id to _id for table compatibility
    ...item, // This already includes id and status
  }));

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item: ConfigurationItem) => (
        <span className="font-medium">{item.name || 'N/A'}</span>
      ),
    },
    {
      key: 'minSalary',
      label: 'Salary Range',
      render: (item: ConfigurationItem) => (
        <span className="font-medium">
          {item.minSalary?.toLocaleString()} - {item.maxSalary?.toLocaleString()} EGP
        </span>
      ),
    },
    {
      key: 'employeeRate',
      label: 'Employee Rate',
      render: (item: ConfigurationItem) => (
        <span>{item.employeeRate?.toFixed(2) || '0.00'}%</span>
      ),
    },
    {
      key: 'employerRate',
      label: 'Employer Rate',
      render: (item: ConfigurationItem) => (
        <span>{item.employerRate?.toFixed(2) || '0.00'}%</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (item: ConfigurationItem) => {
        const date = item.createdAt;
        return date ? new Date(date).toLocaleDateString() : 'N/A';
      },
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Insurance Oversight</h1>
        <p className="text-gray-600 mt-1">
          Review and update insurance bracket configurations when policies or regulations change, so that payroll calculations remain accurate, compliant, and reflect the most current insurance requirements. (Approve/reject, Edit, View, Delete)
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
              <CardTitle>Insurance Brackets</CardTitle>
              <CardDescription>
                {Array.isArray(insuranceBrackets) ? insuranceBrackets.length : 0} insurance bracket(s) configured
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ConfigStatus | 'all')}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={loadInsuranceBrackets}
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
              const found = Array.isArray(insuranceBrackets) ? insuranceBrackets.find((b) => b.id === (item._id || item.id)) : null;
              if (found) handleView(found);
            }}
            onEdit={(item) => {
              const found = Array.isArray(insuranceBrackets) ? insuranceBrackets.find((b) => b.id === (item._id || item.id)) : null;
              if (found) handleEdit(found);
            }}
            onApprove={(item) =>
              setApprovalModal({
                isOpen: true,
                item: (Array.isArray(insuranceBrackets) ? insuranceBrackets.find((b) => b.id === (item._id || item.id)) : null) || null,
              })
            }
            onReject={(item) =>
              setRejectionModal({
                isOpen: true,
                item: (Array.isArray(insuranceBrackets) ? insuranceBrackets.find((b) => b.id === (item._id || item.id)) : null) || null,
              })
            }
            onDelete={(item) => {
              const found = Array.isArray(insuranceBrackets) ? insuranceBrackets.find((b) => b.id === (item._id || item.id)) : null;
              if (found) handleDelete(found);
            }}
            canApprove={(item) => item.status === 'draft'}
            canReject={(item) => item.status === 'draft'}
            canEdit={(item) => {
              // HR Managers can edit draft or approved items (approved items will revert to draft when edited)
              return item.status === 'draft' || item.status === 'approved';
            }}
            canDelete={(item) => item.status === 'draft'}
          />
        </CardContent>
      </Card>

      <ApprovalModal
        isOpen={approvalModal.isOpen}
        onClose={() => setApprovalModal({ isOpen: false, item: null })}
        onApprove={handleApprove}
        title="Approve Insurance Bracket"
        isLoading={isProcessing}
      />

      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={() => setRejectionModal({ isOpen: false, item: null })}
        onReject={handleReject}
        title="Reject Insurance Bracket"
        isLoading={isProcessing}
      />

      <ViewDetailsModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, item: null, details: null })}
        title="Insurance Bracket Details"
        data={viewModal.details}
        type="insurance-brackets"
      />
    </div>
  );
}

