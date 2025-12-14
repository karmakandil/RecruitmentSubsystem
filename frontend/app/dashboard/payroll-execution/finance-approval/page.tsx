"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { payrollExecutionApi } from "@/lib/api/payroll-execution/payroll-execution";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Label } from "@/components/shared/ui/Label";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";

interface PayrollRun {
  _id: string;
  runId: string;
  payrollPeriod: string;
  status: string;
  entity: string;
  employees: number;
  totalnetpay: number;
  paymentStatus?: string;
  financeStaffId?: string;
  managerApprovalDate?: string;
  exceptions?: number;
}

export default function FinanceApprovalPage() {
  const router = useRouter();
  const { user } = useAuth();
  useRequireAuth(SystemRole.FINANCE_STAFF);

  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [filteredRuns, setFilteredRuns] = useState<PayrollRun[]>([]);
  const [selectedPayrollRun, setSelectedPayrollRun] = useState<PayrollRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [showDecisionModal, setShowDecisionModal] = useState(false);

  useEffect(() => {
    fetchPayrollRuns();
  }, []);

  useEffect(() => {
    filterRuns();
  }, [payrollRuns, user]);

  const fetchPayrollRuns = async () => {
    setLoading(true);
    setError(null);
    try {
      const runsResponse = await payrollExecutionApi.getAllPayrollRuns({
        limit: 1000,
      });

      let runsData: any[] = [];
      if (Array.isArray(runsResponse)) {
        runsData = runsResponse;
      } else if (Array.isArray((runsResponse as any)?.data)) {
        runsData = (runsResponse as any).data;
      } else if (Array.isArray((runsResponse as any)?.data?.items)) {
        runsData = (runsResponse as any).data.items;
      }

      setPayrollRuns(runsData);
    } catch (err: any) {
      setError(err.message || "Failed to load payroll runs");
    } finally {
      setLoading(false);
    }
  };

  const filterRuns = () => {
    // Show only payroll runs pending finance approval that are assigned to current user
    const pending = payrollRuns.filter((run) => {
      const statusMatch =
        run.status?.toLowerCase() === "pending finance approval" ||
        run.status?.toLowerCase() === "pending_finance_approval";
      
      // If financeStaffId is set, only show runs assigned to current user
      if (run.financeStaffId) {
        return statusMatch && run.financeStaffId === user?.userId;
      }
      
      // If no financeStaffId is set, show all pending finance approval runs
      // (any finance staff can approve)
      return statusMatch;
    });
    setFilteredRuns(pending);
  };

  const handleDecision = (run: PayrollRun, decisionType: "approve" | "reject") => {
    setSelectedPayrollRun(run);
    setDecision(decisionType);
    setReason("");
    setShowDecisionModal(true);
  };

  const handleSubmitDecision = async () => {
    if (!selectedPayrollRun || !decision) {
      setError("Please select a decision");
      return;
    }

    if (decision === "reject" && !reason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await payrollExecutionApi.financeApproval({
        payrollRunId: selectedPayrollRun._id,
        decision,
        reason: decision === "reject" ? reason : undefined,
        financeStaffId: user?.userId,
      });

      setSuccess(
        `Payroll run ${(response as any)?.runId || selectedPayrollRun.runId} has been ${
          decision === "approve" ? "approved" : "rejected"
        } successfully!`
      );

      setShowDecisionModal(false);
      setSelectedPayrollRun(null);
      setDecision(null);
      setReason("");

      // Refresh the list
      setTimeout(() => {
        fetchPayrollRuns();
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        `Failed to ${decision === "approve" ? "approve" : "reject"} payroll run`;
      setError(errorMessage);
      console.error("Error processing decision:", err);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Approve Payroll Disbursements
        </h1>
        <p className="text-gray-600 mt-1">
          Review and approve payroll runs before execution to ensure no incorrect payments are made
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Loading payroll runs...</p>
          </CardContent>
        </Card>
      ) : filteredRuns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              No payroll runs pending finance approval
            </p>
            <p className="text-gray-500 text-sm">
              Payroll runs will appear here after they have been approved by the Payroll Manager
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredRuns.map((run) => (
            <Card key={run._id} className="border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      {run.runId}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Payroll Period: {formatDate(run.payrollPeriod)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Pending Finance Approval
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Period</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatDate(run.payrollPeriod)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Employees</span>
                    </div>
                    <p className="font-semibold text-gray-900">{run.employees}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Total Net Pay</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(run.totalnetpay)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Exceptions</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {run.exceptions || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    onClick={() => handleDecision(run, "approve")}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    disabled={processing}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Approve Disbursement
                  </Button>
                  <Button
                    onClick={() => handleDecision(run, "reject")}
                    variant="destructive"
                    className="flex-1"
                    disabled={processing}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Decision Modal */}
      {showDecisionModal && selectedPayrollRun && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {decision === "approve"
                  ? "Approve Payroll Disbursement"
                  : "Reject Payroll Disbursement"}
              </CardTitle>
              <CardDescription>
                {decision === "approve"
                  ? "Confirm approval of this payroll run. Payments will be authorized after approval."
                  : "Provide a reason for rejecting this payroll run."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-gray-600 mb-1">Payroll Run:</p>
                <p className="font-semibold text-gray-900">{selectedPayrollRun.runId}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Period: {formatDate(selectedPayrollRun.payrollPeriod)}
                </p>
                <p className="text-sm text-gray-600">
                  Total Net Pay: {formatCurrency(selectedPayrollRun.totalnetpay)}
                </p>
              </div>

              {decision === "reject" && (
                <div className="mb-4">
                  <Label htmlFor="reason">Rejection Reason *</Label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={4}
                    placeholder="Please provide a reason for rejecting this payroll run..."
                    required
                  />
                </div>
              )}

              {decision === "approve" && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> Approving this payroll run will authorize
                    payments. Please ensure all amounts and employee details are correct
                    before proceeding.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowDecisionModal(false);
                    setSelectedPayrollRun(null);
                    setDecision(null);
                    setReason("");
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitDecision}
                  className={`flex-1 ${
                    decision === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white`}
                  disabled={processing || (decision === "reject" && !reason.trim())}
                >
                  {processing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : decision === "approve" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Approval
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Confirm Rejection
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8">
        <Button
          onClick={() => router.push("/dashboard/finance")}
          variant="outline"
        >
          ← Back to Finance Dashboard
        </Button>
      </div>
    </div>
  );
}

