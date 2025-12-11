"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { leavesApi } from "@/lib/api/leaves/leaves";
import { LeaveRequest, LeaveType } from "@/types/leaves";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { Card } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { CancelLeaveRequestButton } from "@/components/leaves/CancelLeaveRequestButton";

export default function LeaveRequestsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useRequireAuth();

  useEffect(() => {
    if (user?.id || user?.userId) {
      fetchLeaveRequests();
      fetchLeaveTypes();
    }
  }, [user]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const employeeId = user?.id || user?.userId || "";
      const requests = await leavesApi.getEmployeeLeaveRequests(employeeId);
      setLeaveRequests(requests);
    } catch (error: any) {
      setError(error.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const types = await leavesApi.getLeaveTypes();
      setLeaveTypes(types);
    } catch (error) {
      console.warn("Failed to fetch leave types");
    }
  };

  const handleCancelSuccess = () => {
    setSuccessMessage("Leave request cancelled successfully");
    fetchLeaveRequests();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleCancelError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(""), 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getLeaveTypeName = (leaveTypeId: string | LeaveType): string => {
    if (typeof leaveTypeId === "string") {
      const type = leaveTypes.find((lt) => lt._id === leaveTypeId);
      return type?.name || leaveTypeId;
    }
    return leaveTypeId.name;
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Leave Requests</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage your leave requests
          </p>
        </div>
        <Link href="/dashboard/leaves/requests/new">
          <Button>Create New Request</Button>
        </Link>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {leaveRequests.length === 0 ? (
        <Card className="p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No leave requests
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You haven't submitted any leave requests yet.
          </p>
          <div className="mt-6">
            <Link href="/dashboard/leaves/requests/new">
              <Button>Create Your First Request</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <Card key={request._id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getLeaveTypeName(request.leaveTypeId)}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">From:</span>{" "}
                      {formatDate(request.dates.from)}
                    </div>
                    <div>
                      <span className="font-medium">To:</span>{" "}
                      {formatDate(request.dates.to)}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {request.durationDays} day{request.durationDays !== 1 ? "s" : ""}
                    </div>
                  </div>
                  {request.justification && (
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Reason:</span>{" "}
                      {request.justification}
                    </p>
                  )}
                  {request.createdAt && (
                    <p className="mt-2 text-xs text-gray-500">
                      Submitted on {formatDate(request.createdAt)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {request.status?.toUpperCase() === "PENDING" && (
                    <>
                      <Link href={`/dashboard/leaves/requests/edit/${request._id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <CancelLeaveRequestButton
                        leaveRequestId={request._id}
                        onSuccess={handleCancelSuccess}
                        onError={handleCancelError}
                        size="sm"
                      />
                    </>
                  )}
                  {request.status?.toUpperCase() !== "PENDING" && (
                    <span className="text-xs text-gray-500">
                      Cannot modify {request.status?.toLowerCase() || "this"} requests
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
