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
  Users,
  DollarSign,
  Calendar,
  Eye,
  Search,
} from "lucide-react";

interface PayrollRun {
  _id: string;
  runId: string;
  payrollPeriod: string;
  status: string;
  entity: string;
  employees: number;
  totalnetpay: number;
  exceptions?: number;
  payrollManagerId?: string;
  financeStaffId?: string;
  createdAt?: string;
}

export default function ManagerApprovalPage() {
  const router = useRouter();
  const { user } = useAuth();
  useRequireAuth(SystemRole.PAYROLL_MANAGER);

  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [filteredRuns, setFilteredRuns] = useState<PayrollRun[]>([]);
  const [selectedPayrollRun, setSelectedPayrollRun] = useState<PayrollRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [comments, setComments] = useState("");
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPayrollRuns();
  }, []);

  useEffect(() => {
    filterRuns();
  }, [payrollRuns, searchTerm]);

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
    // Show only payroll runs under review that are assigned to current manager
    const underReview = payrollRuns.filter((run) => {
      const statusMatch =
        run.status?.toLowerCase() === "under review" ||
        run.status?.toLowerCase() === "under_review";
      
      // If payrollManagerId is set, only show runs assigned to current user
      if (run.payrollManagerId) {
        return statusMatch && run.payrollManagerId === user?.userId;
      }
      
      // If no manager assigned, show all under review runs (any manager can approve)
      return statusMatch;
    });

    // Filter by search term
    let filtered = underReview;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = underReview.filter(
        (run) =>
          run.runId.toLowerCase().includes(searchLower) ||
          run.entity.toLowerCase().includes(searchLower) ||
          formatDate(run.payrollPeriod).toLowerCase().includes(searchLower)
      );
    }

    setFilteredRuns(filtered);
  };

  const handleDecision = (run: PayrollRun, decisionType: "approve" | "reject") => {
    setSelectedPayrollRun(run);
    setDecision(decisionType);
    setComments("");
    setShowDecisionModal(true);
  };

  const handleSubmitDecision = async () => {
    if (!selectedPayrollRun || !decision) {
      setError("Please select a decision");
      return;
    }

    if (decision === "reject" && !comments.trim()) {
      setError("Please provide comments when rejecting a payroll run");
      return;
    }

    setProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      await payrollExecutionApi.managerApproval({
        payrollRunId: selectedPayrollRun._id,
        status: selectedPayrollRun.status,
        managerDecision: decision,
        managerComments: decision === "reject" ? comments : comments || undefined,
        payrollManagerId: user?.userId,
      });

      setSuccess(
        `Payroll run ${selectedPayrollRun.runId} has been ${
          decision === "approve" ? "approved" : "rejected"
        } successfully!`
      );

      setShowDecisionModal(false);
      setSelectedPayrollRun(null);
      setDecision(null);
      setComments("");

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

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "under review" || statusLower === "under_review") {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
          Under Review
        </span>
      );
    } else if (statusLower === "pending finance approval" || statusLower === "pending_finance_approval") {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          Pending Finance Approval
        </span>
      );
    } else if (statusLower === "approved") {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
          Approved
        </span>
      );
    } else if (statusLower === "rejected") {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
          Rejected
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Approve Payroll Runs
        </h1>
        <p className="text-gray-600 mt-1">
          Review and approve payroll runs to ensure validation at the managerial level prior to distribution
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

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by run ID, entity, or period..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

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
              No payroll runs pending approval
            </p>
            <p className="text-gray-500 text-sm">
              Payroll runs will appear here after they have been sent for approval by Payroll Specialists
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredRuns.map((run) => (
            <Card key={run._id} className="border-2 border-yellow-200">
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
                    {getStatusBadge(run.status)}
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
                    onClick={() => router.push(`/dashboard/payroll-execution/preview?payrollRunId=${run._id}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleDecision(run, "approve")}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    disabled={processing}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Approve
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
                  ? "Approve Payroll Run"
                  : "Reject Payroll Run"}
              </CardTitle>
              <CardDescription>
                {decision === "approve"
                  ? "Confirm approval of this payroll run. It will be sent to Finance Staff for final approval."
                  : "Provide a reason for rejecting this payroll run. The payroll run will be marked as rejected."}
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
                <p className="text-sm text-gray-600">
                  Employees: {selectedPayrollRun.employees}
                </p>
                {selectedPayrollRun.exceptions && selectedPayrollRun.exceptions > 0 && (
                  <p className="text-sm text-yellow-700 mt-2">
                    ⚠️ This payroll run has {selectedPayrollRun.exceptions} exception{selectedPayrollRun.exceptions !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <Label htmlFor="comments">
                  {decision === "approve" ? "Comments (Optional)" : "Rejection Reason *"}
                </Label>
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder={
                    decision === "approve"
                      ? "Add any comments or notes about this approval..."
                      : "Please provide a detailed reason for rejecting this payroll run..."
                  }
                  required={decision === "reject"}
                />
              </div>

              {decision === "approve" && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Important:</strong> Approving this payroll run will send it to Finance Staff for final approval. 
                    Please ensure all amounts and employee details are correct before proceeding.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowDecisionModal(false);
                    setSelectedPayrollRun(null);
                    setDecision(null);
                    setComments("");
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
                  disabled={processing || (decision === "reject" && !comments.trim())}
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
          onClick={() => router.push("/dashboard/payroll-manager")}
          variant="outline"
        >
          ← Back to Payroll Manager Dashboard
        </Button>
      </div>
    </div>
  );
}

