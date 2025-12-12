"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { payslipsApi } from "@/lib/api/payroll-tracking/payroll-tracking";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Modal } from "@/components/leaves/Modal";
import { Textarea } from "@/components/leaves/Textarea";
import Link from "next/link";

interface Dispute {
  _id: string;
  disputeId: string;
  description: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeNumber: string;
  };
  payslipId: {
    _id: string;
    payrollRunId?: {
      runId: string;
      payrollPeriod: string;
    };
  };
  status: "under review" | "pending payroll Manager approval" | "approved" | "rejected";
  rejectionReason?: string;
  resolutionComment?: string;
  payrollSpecialistId?: {
    firstName: string;
    lastName: string;
  };
  payrollManagerId?: {
    firstName: string;
    lastName: string;
  };
  financeStaffId?: {
    firstName: string;
    lastName: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function DisputeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [approveComment, setApproveComment] = useState("");
  const [confirmComment, setConfirmComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  // Allow employees, payroll specialists, and payroll managers to access
  const isPayrollSpecialist = user?.roles?.includes(SystemRole.PAYROLL_SPECIALIST);
  const isPayrollManager = user?.roles?.includes(SystemRole.PAYROLL_MANAGER);
  const allowedRole = isPayrollManager 
    ? SystemRole.PAYROLL_MANAGER 
    : isPayrollSpecialist 
    ? SystemRole.PAYROLL_SPECIALIST 
    : SystemRole.DEPARTMENT_EMPLOYEE;
  useRequireAuth(allowedRole);

  const fetchDispute = async () => {
    try {
      const disputeId = params.id as string;
      const data = await payslipsApi.getDisputeById(disputeId);
      setDispute(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dispute details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchDispute();
    }
  }, [params.id]);

  const handleApprove = async () => {
    if (!dispute || !user?.id && !user?.userId) {
      setError("User ID not found");
      return;
    }

    setProcessing(true);
    try {
      const payrollSpecialistId = user.id || user.userId;
      await payslipsApi.approveDisputeBySpecialist(dispute.disputeId, {
        payrollSpecialistId: payrollSpecialistId!,
        resolutionComment: approveComment || undefined,
      });
      setShowApproveModal(false);
      setApproveComment("");
      await fetchDispute(); // Refresh dispute data
    } catch (err: any) {
      setError(err.message || "Failed to approve dispute");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!dispute || !user?.id && !user?.userId) {
      setError("User ID not found");
      return;
    }

    if (!rejectReason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    setProcessing(true);
    try {
      const payrollSpecialistId = user.id || user.userId;
      await payslipsApi.rejectDisputeBySpecialist(dispute.disputeId, {
        payrollSpecialistId: payrollSpecialistId!,
        rejectionReason: rejectReason,
      });
      setShowRejectModal(false);
      setRejectReason("");
      await fetchDispute(); // Refresh dispute data
    } catch (err: any) {
      setError(err.message || "Failed to reject dispute");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!dispute || !user?.id && !user?.userId) {
      setError("User ID not found");
      return;
    }

    setProcessing(true);
    try {
      const payrollManagerId = user.id || user.userId;
      await payslipsApi.confirmDisputeApproval(dispute.disputeId, {
        payrollManagerId: payrollManagerId!,
        resolutionComment: confirmComment || undefined,
      });
      setShowConfirmModal(false);
      setConfirmComment("");
      await fetchDispute(); // Refresh dispute data
    } catch (err: any) {
      setError(err.message || "Failed to confirm dispute approval");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "approved") {
      return (
        <span className="px-3 py-1 rounded text-sm font-medium bg-green-100 text-green-800 border border-green-300">
          Approved
        </span>
      );
    } else if (statusLower === "rejected") {
      return (
        <span className="px-3 py-1 rounded text-sm font-medium bg-red-100 text-red-800 border border-red-300">
          Rejected
        </span>
      );
    } else if (statusLower === "pending payroll manager approval" || statusLower.includes("pending")) {
      return (
        <span className="px-3 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
          Pending Manager Approval
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
          Under Review
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dispute details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || "Dispute not found"}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.push("/dashboard/payroll-tracking/disputes")}>
                  Back to Disputes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispute Details</h1>
          <p className="text-gray-600 mt-1">Dispute ID: {dispute.disputeId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/payroll-tracking/disputes")}>
            Back to Disputes
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Status</CardTitle>
            <div className="flex items-center gap-3">
              {getStatusBadge(dispute.status)}
              {/* Payroll Specialist Actions */}
              {isPayrollSpecialist && dispute.status === "under review" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowApproveModal(true)}
                    className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectModal(true)}
                    className="bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                  >
                    Reject
                  </Button>
                </div>
              )}
              {/* Payroll Manager Actions */}
              {isPayrollManager && dispute.status === "pending payroll Manager approval" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmModal(true)}
                    className="bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    Confirm Approval
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Dispute Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dispute Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
              <p className="text-gray-900">{dispute.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Payslip</p>
                <Link
                  href={`/dashboard/payroll-tracking/${dispute.payslipId._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {dispute.payslipId.payrollRunId?.runId || "View Payslip"}
                </Link>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Payroll Period</p>
                <p className="text-gray-900">
                  {dispute.payslipId.payrollRunId?.payrollPeriod
                    ? new Date(dispute.payslipId.payrollRunId.payrollPeriod).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
                <p className="text-gray-900">{formatDate(dispute.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                <p className="text-gray-900">{formatDate(dispute.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviewers Information */}
      {(dispute.payrollSpecialistId || dispute.payrollManagerId || dispute.financeStaffId) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reviewers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dispute.payrollSpecialistId && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Payroll Specialist</p>
                  <p className="text-gray-900">
                    {dispute.payrollSpecialistId.firstName} {dispute.payrollSpecialistId.lastName}
                  </p>
                </div>
              )}
              {dispute.payrollManagerId && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Payroll Manager</p>
                  <p className="text-gray-900">
                    {dispute.payrollManagerId.firstName} {dispute.payrollManagerId.lastName}
                  </p>
                </div>
              )}
              {dispute.financeStaffId && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Finance Staff</p>
                  <p className="text-gray-900">
                    {dispute.financeStaffId.firstName} {dispute.financeStaffId.lastName}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejection Reason */}
      {dispute.rejectionReason && (
        <Card className="mb-6 border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Rejection Reason</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800">{dispute.rejectionReason}</p>
          </CardContent>
        </Card>
      )}

      {/* Resolution Comment */}
      {dispute.resolutionComment && (
        <Card className="mb-6 border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">Resolution Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800">{dispute.resolutionComment}</p>
          </CardContent>
        </Card>
      )}

      {/* Status Timeline */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="font-semibold text-blue-900 mb-1">Dispute Workflow</p>
              <p className="text-sm text-blue-800 mb-3">
                {isPayrollManager
                  ? "As a Payroll Manager, you can confirm disputes that have been approved by Payroll Specialists. Once confirmed, they will be forwarded to Finance for processing."
                  : isPayrollSpecialist
                  ? "As a Payroll Specialist, you can approve or reject disputes. Approved disputes will be escalated to the Payroll Manager."
                  : "Your dispute goes through the following stages:"}
              </p>
              <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                <li>
                  <strong>Under Review:</strong> Payroll specialist is investigating your dispute
                </li>
                <li>
                  <strong>Pending Manager Approval:</strong> Specialist has approved, waiting for manager confirmation
                </li>
                <li>
                  <strong>Approved:</strong> Manager has approved, finance team will process the resolution
                </li>
                <li>
                  <strong>Rejected:</strong> Dispute was rejected with a reason provided
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setApproveComment("");
        }}
        title="Approve Dispute"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveModal(false);
                setApproveComment("");
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing ? "Approving..." : "Approve Dispute"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Approving this dispute will escalate it to the Payroll Manager for final confirmation.
            The employee will be notified of the status change.
          </p>
          <div>
            <label htmlFor="approve-comment" className="block text-sm font-medium text-gray-700 mb-1">
              Resolution Comment (Optional)
            </label>
            <Textarea
              id="approve-comment"
              value={approveComment}
              onChange={(e) => setApproveComment(e.target.value)}
              placeholder="Add any comments about your approval decision..."
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              {approveComment.length} characters
            </p>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason("");
        }}
        title="Reject Dispute"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason("");
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={processing || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {processing ? "Rejecting..." : "Reject Dispute"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please provide a clear reason for rejecting this dispute. The employee will be notified
            with this reason.
          </p>
          <div>
            <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700 mb-1">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this dispute is being rejected..."
              rows={4}
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {rejectReason.length} characters (minimum 5 required)
            </p>
            {rejectReason.length > 0 && rejectReason.length < 5 && (
              <p className="text-xs text-red-500 mt-1">
                Rejection reason must be at least 5 characters long
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Confirm Approval Modal (Payroll Manager) */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setConfirmComment("");
        }}
        title="Confirm Dispute Approval"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmModal(false);
                setConfirmComment("");
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {processing ? "Confirming..." : "Confirm Approval"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Confirming this approval will finalize the dispute and forward it to Finance for refund processing.
            The employee will be notified of the final approval.
          </p>
          {dispute?.resolutionComment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 mb-1">Specialist Comment:</p>
              <p className="text-sm text-blue-800">{dispute.resolutionComment}</p>
            </div>
          )}
          <div>
            <label htmlFor="confirm-comment" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmation Comment (Optional)
            </label>
            <Textarea
              id="confirm-comment"
              value={confirmComment}
              onChange={(e) => setConfirmComment(e.target.value)}
              placeholder="Add any comments about your confirmation..."
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              {confirmComment.length} characters
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

