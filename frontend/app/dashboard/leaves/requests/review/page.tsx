"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { leavesApi } from "@/lib/api/leaves/leaves";
import { LeaveRequest } from "@/types/leaves";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/Card";
import ApproveLeaveRequestButton from "@/components/leaves/ApproveLeaveRequestButton";
import RejectLeaveRequestButton from "@/components/leaves/RejectLeaveRequestButton";
import { Button } from "@/components/shared/ui/Button";
import { useRouter } from "next/navigation";

export default function ManagerLeaveReviewPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [employeeIdFilter, setEmployeeIdFilter] = useState("");
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useRequireAuth(SystemRole.DEPARTMENT_HEAD);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchPendingRequests = async (employeeId?: string) => {
    if (!employeeId) {
      setPendingRequests([]);
      setLoadingRequests(false);
      setHasSearched(false);
      return;
    }

    setLoadingRequests(true);
    setError(null);
    setHasSearched(true);
    try {
      console.log("Fetching pending requests for employee:", employeeId);
      const requests = await leavesApi.getEmployeeLeaveRequests(employeeId, {
        status: "pending",
      });
      console.log("Received requests:", requests);
      // Filter to only show pending requests (in case backend returns all)
      const pendingOnly = requests.filter(
        (req) => req.status?.toLowerCase() === "pending"
      );
      console.log("Filtered pending requests:", pendingOnly);
      setPendingRequests(pendingOnly);
    } catch (err: any) {
      console.error("Error fetching pending requests:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch pending leave requests";
      setError(errorMessage);
      setPendingRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleSearch = async () => {
    const trimmedId = employeeIdFilter.trim();
    if (!trimmedId) {
      setError("Please enter an employee ID");
      setHasSearched(false);
      setPendingRequests([]);
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setSearching(true);
    console.log("Searching for employee ID:", trimmedId);
    await fetchPendingRequests(trimmedId);
    setSearching(false);
  };

  const handleApproveSuccess = () => {
    setSuccessMessage("Leave request approved successfully");
    // Refresh the list
    if (employeeIdFilter.trim()) {
      fetchPendingRequests(employeeIdFilter.trim());
    }
  };

  const handleRejectSuccess = () => {
    setSuccessMessage("Leave request rejected successfully");
    // Refresh the list
    if (employeeIdFilter.trim()) {
      fetchPendingRequests(employeeIdFilter.trim());
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const roles = user?.roles || [];
  const isDepartmentHead = roles.includes(SystemRole.DEPARTMENT_HEAD);

  if (!isDepartmentHead) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800">
            You do not have permission to access this page. Only department heads can review leave requests.
          </p>
          <button
            onClick={() => router.push("/dashboard/leaves/requests")}
            className="mt-4 text-sm text-red-600 hover:text-red-800 underline"
          >
            Go back to leave requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review Leave Requests</h1>
        <p className="text-gray-600 mt-1">
          As a department head, review and approve or reject leave requests from your team members
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4 border border-green-200">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={employeeIdFilter}
                onChange={(e) => setEmployeeIdFilter(e.target.value)}
                placeholder="Enter Employee ID to view their pending leave requests"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={searching || loadingRequests}
            >
              {searching ? "Searching..." : "Search"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Note: Enter an employee ID (MongoDB ObjectId) to view their pending leave requests.
          </p>
          {employeeIdFilter && (
            <p className="mt-1 text-xs text-blue-600">
              Current search: {employeeIdFilter}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pending Requests List */}
      {loadingRequests ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending requests...</p>
        </div>
      ) : !hasSearched ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">
              Enter an employee ID above to search for pending leave requests.
            </p>
          </CardContent>
        </Card>
      ) : pendingRequests.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">
              No pending leave requests found for employee ID: {employeeIdFilter}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => {
            const leaveTypeName =
              typeof request.leaveTypeId === "object"
                ? request.leaveTypeId.name
                : "Unknown Leave Type";

            return (
              <Card key={request._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Leave Request #{request._id.slice(-8)}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Employee ID: {request.employeeId}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Leave Type</p>
                      <p className="text-sm text-gray-900">{leaveTypeName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Duration</p>
                      <p className="text-sm text-gray-900">
                        {request.durationDays} working day
                        {request.durationDays !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Start Date</p>
                      <p className="text-sm text-gray-900">
                        {formatDate(request.dates.from)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">End Date</p>
                      <p className="text-sm text-gray-900">
                        {formatDate(request.dates.to)}
                      </p>
                    </div>
                    {request.justification && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700">Justification</p>
                        <p className="text-sm text-gray-900">{request.justification}</p>
                      </div>
                    )}
                    {request.createdAt && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Submitted</p>
                        <p className="text-sm text-gray-900">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Approval Actions */}
                  {request.status.toLowerCase() === "pending" && (
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                      <ApproveLeaveRequestButton
                        leaveRequestId={request._id}
                        onSuccess={handleApproveSuccess}
                        onError={handleError}
                        variant="primary"
                        size="md"
                      />
                      <RejectLeaveRequestButton
                        leaveRequestId={request._id}
                        onSuccess={handleRejectSuccess}
                        onError={handleError}
                        variant="danger"
                        size="md"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

