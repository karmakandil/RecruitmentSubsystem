"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { payslipsApi } from "@/lib/api/payroll-tracking/payroll-tracking";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";

interface Claim {
  _id: string;
  claimId: string;
  description: string;
  claimType: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeNumber: string;
  };
  amount: number;
  approvedAmount?: number;
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

export default function ClaimDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useRequireAuth(SystemRole.DEPARTMENT_EMPLOYEE);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const claimId = params.id as string;
        const data = await payslipsApi.getClaimById(claimId);
        setClaim(data);
      } catch (err: any) {
        setError(err.message || "Failed to load claim details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClaim();
    }
  }, [params.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
            <p className="mt-4 text-gray-600">Loading claim details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || "Claim not found"}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.push("/dashboard/payroll-tracking/claims")}>
                  Back to Claims
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
          <h1 className="text-3xl font-bold text-gray-900">Claim Details</h1>
          <p className="text-gray-600 mt-1">Claim ID: {claim.claimId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/payroll-tracking/claims")}>
            Back to Claims
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Status</CardTitle>
            {getStatusBadge(claim.status)}
          </div>
        </CardHeader>
      </Card>

      {/* Claim Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Claim Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Claim Type</p>
              <p className="text-gray-900 font-semibold">{claim.claimType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
              <p className="text-gray-900">{claim.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Claimed Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(claim.amount)}
                </p>
              </div>
              {claim.approvedAmount !== undefined && claim.approvedAmount !== null && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Approved Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(claim.approvedAmount)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
                <p className="text-gray-900">{formatDate(claim.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                <p className="text-gray-900">{formatDate(claim.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviewers Information */}
      {(claim.payrollSpecialistId || claim.payrollManagerId || claim.financeStaffId) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reviewers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {claim.payrollSpecialistId && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Payroll Specialist</p>
                  <p className="text-gray-900">
                    {claim.payrollSpecialistId.firstName} {claim.payrollSpecialistId.lastName}
                  </p>
                </div>
              )}
              {claim.payrollManagerId && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Payroll Manager</p>
                  <p className="text-gray-900">
                    {claim.payrollManagerId.firstName} {claim.payrollManagerId.lastName}
                  </p>
                </div>
              )}
              {claim.financeStaffId && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Finance Staff</p>
                  <p className="text-gray-900">
                    {claim.financeStaffId.firstName} {claim.financeStaffId.lastName}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejection Reason */}
      {claim.rejectionReason && (
        <Card className="mb-6 border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Rejection Reason</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800">{claim.rejectionReason}</p>
          </CardContent>
        </Card>
      )}

      {/* Resolution Comment */}
      {claim.resolutionComment && (
        <Card className="mb-6 border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">Resolution Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800">{claim.resolutionComment}</p>
          </CardContent>
        </Card>
      )}

      {/* Status Timeline */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="font-semibold text-blue-900 mb-1">Claim Workflow</p>
              <p className="text-sm text-blue-800 mb-3">
                Your claim goes through the following stages:
              </p>
              <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                <li>
                  <strong>Under Review:</strong> Payroll specialist is reviewing your claim
                </li>
                <li>
                  <strong>Pending Manager Approval:</strong> Specialist has approved, waiting for manager confirmation
                </li>
                <li>
                  <strong>Approved:</strong> Manager has approved, finance team will process the reimbursement
                </li>
                <li>
                  <strong>Rejected:</strong> Claim was rejected with a reason provided
                </li>
              </ol>
              <p className="text-sm text-blue-800 mt-3">
                <strong>Note:</strong> If your claim is approved, the approved amount may differ from the claimed amount
                based on company policies and expense limits. The reimbursement will be processed in the next payroll cycle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

