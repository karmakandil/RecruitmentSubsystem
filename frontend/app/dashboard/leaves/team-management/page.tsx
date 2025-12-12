"use client";

import React, { useState, useEffect } from "react";
import { leavesApi } from "@/lib/api/leaves/leaves";
import { authApi } from "@/lib/api/auth/auth";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { LeaveType } from "@/types/leaves";
import { api } from "@/lib/api/client";

interface TeamLeaveRequest {
  _id: string;
  employeeId: string;
  employeeName?: string;
  leaveTypeName: string;
  dates: { from: Date; to: Date };
  durationDays: number;
  status: string;
  createdAt: Date;
}

export default function TeamManagementPage() {
  const { user } = useAuthStore();
  const [leaveRequests, setLeaveRequests] = useState<TeamLeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState({
    departmentId: "",
    leaveTypeId: "",
    fromDate: "",
    toDate: "",
    status: "",
    sortByDate: "desc" as "asc" | "desc",
    sortByStatus: "" as "asc" | "desc" | "",
    offset: 0,
    limit: 10,
  });

  useRequireAuth();

  useEffect(() => {
    fetchLeaveTypes();
    fetchDepartments();
    fetchTeamLeaveData();
  }, [user]);

  useEffect(() => {
    fetchTeamLeaveData();
  }, [filters]);

  const fetchLeaveTypes = async () => {
    try {
      const types = await leavesApi.getLeaveTypes();
      setLeaveTypes(types || []);
    } catch (error) {
      console.warn("Failed to fetch leave types:", error);
      setLeaveTypes([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/organization-structure/departments?isActive=true");
      // Handle different response formats
      let departmentsData = [];
      if (Array.isArray(response)) {
        departmentsData = response;
      } else if (response && typeof response === "object") {
        if (Array.isArray(response.data)) {
          departmentsData = response.data;
        } else if (Array.isArray((response as any).departments)) {
          departmentsData = (response as any).departments;
        } else if (Array.isArray((response as any).items)) {
          departmentsData = (response as any).items;
        }
      }
      
      setDepartments(
        departmentsData.map((dept: any) => ({
          id: dept._id || dept.id,
          name: dept.name,
        }))
      );
    } catch (error) {
      console.warn("Failed to fetch departments:", error);
      setDepartments([]);
    }
  };

  const fetchTeamLeaveData = async () => {
    try {
      setLoading(true);
      setError("");
      const managerId = authApi.getUserId() || user?.id || user?.userId || "";
      
      if (!managerId || !managerId.trim()) {
        throw new Error("Manager ID is required. Please log in again.");
      }
      
      // Prepare filters with proper date format and lowercase status
      const filterPayload: any = {
        departmentId: filters.departmentId || undefined,
        leaveTypeId: filters.leaveTypeId || undefined,
        status: filters.status ? filters.status.toLowerCase() : undefined,
        sortByDate: filters.sortByDate || undefined,
        sortByStatus: filters.sortByStatus || undefined,
        offset: filters.offset,
        limit: filters.limit,
      };
      
      // Send dates as ISO strings (backend DTO expects date strings)
      if (filters.fromDate) {
        // Convert YYYY-MM-DD to ISO string
        filterPayload.fromDate = new Date(filters.fromDate + 'T00:00:00.000Z').toISOString();
      }
      if (filters.toDate) {
        // Convert YYYY-MM-DD to ISO string (end of day)
        filterPayload.toDate = new Date(filters.toDate + 'T23:59:59.999Z').toISOString();
      }
      
      const result = await leavesApi.filterTeamLeaveData(managerId.trim(), filterPayload);
      
      console.log("Team leave data result:", result);
      console.log("Total results:", result.total);
      console.log("Items:", result.items);
      
      setLeaveRequests(Array.isArray(result.items) ? result.items : []);
      setTotal(result.total || 0);
      
      // Provide helpful message if no results
      if (result.total === 0) {
        const hasFilters = filters.departmentId || filters.leaveTypeId || filters.fromDate || filters.toDate || filters.status;
        if (hasFilters) {
          setError("No leave requests found matching the current filters. Try clearing filters or adjusting date range.");
        } else {
          setError("No leave requests found. This could mean: 1) No team members are assigned to you, 2) Your team members have no leave requests, or 3) Team members need to have their supervisorPositionId set to your position.");
        }
      } else {
        setError(""); // Clear error if we have results
      }
    } catch (error: any) {
      console.error("Error fetching team leave data:", error);
      setError(error.message || "Failed to load team leave data. Please check: 1) You have a position assigned, 2) Team members have supervisorPositionId set to your position.");
      setLeaveRequests([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagIrregular = async (leaveRequestId: string) => {
    try {
      const managerId = authApi.getUserId() || user?.id || user?.userId || "";
      const flagReason = prompt("Please provide a reason for flagging this pattern:");
      if (!flagReason) return;
      
      const notes = prompt("Additional notes (optional):");
      await leavesApi.flagIrregularPattern(leaveRequestId, managerId, flagReason, notes || undefined);
      alert("Leave request flagged successfully");
      fetchTeamLeaveData();
    } catch (error: any) {
      alert(`Failed to flag pattern: ${error.message}`);
    }
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

  if (loading && leaveRequests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team leave data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Team Leave Management</h1>
        <p className="text-gray-600 mt-1">Filter and manage your team's leave requests</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={filters.departmentId}
                onChange={(e) => setFilters({ ...filters, departmentId: e.target.value, offset: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type
              </label>
              <select
                value={filters.leaveTypeId}
                onChange={(e) => setFilters({ ...filters, leaveTypeId: e.target.value, offset: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {leaveTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, offset: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value, offset: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value, offset: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By Date
              </label>
              <select
                value={filters.sortByDate}
                onChange={(e) => setFilters({ ...filters, sortByDate: e.target.value as "asc" | "desc" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By Status
              </label>
              <select
                value={filters.sortByStatus}
                onChange={(e) => setFilters({ ...filters, sortByStatus: e.target.value as "asc" | "desc" | "" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Sort</option>
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={fetchTeamLeaveData}>Apply Filters</Button>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  departmentId: "",
                  leaveTypeId: "",
                  fromDate: "",
                  toDate: "",
                  status: "",
                  sortByDate: "desc",
                  sortByStatus: "",
                  offset: 0,
                  limit: 10,
                });
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-4 text-sm text-gray-600">
        Total Results: {total}
      </div>

      {leaveRequests.length === 0 && !loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No leave requests found.</p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-left">
                <p className="text-sm font-semibold text-yellow-800 mb-2">Troubleshooting Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                  <li>Check if you have team members assigned:
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>Go to Employee Profile search page</li>
                      <li>Verify employees have their <code className="bg-yellow-100 px-1 rounded">supervisorPositionId</code> set to your position</li>
                    </ul>
                  </li>
                  <li>Verify your position is set in your employee profile (you need a <code className="bg-yellow-100 px-1 rounded">primaryPositionId</code>)</li>
                  <li>Check if your team members have submitted any leave requests</li>
                  <li>Try clearing all filters and clicking "Apply Filters"</li>
                  <li>Open browser console (F12) to see detailed logs</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <Card key={request._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.leaveTypeName}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>
                    {request.employeeName && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Employee:</span> {request.employeeName}
                      </p>
                    )}
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
                    {request.createdAt && (
                      <p className="mt-2 text-xs text-gray-500">
                        Created on {formatDate(request.createdAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlagIrregular(request._id)}
                    >
                      Flag Irregular Pattern
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > filters.limit && (
        <div className="mt-6 flex justify-between items-center">
          <Button
            variant="outline"
            disabled={filters.offset === 0}
            onClick={() => setFilters({ ...filters, offset: Math.max(0, filters.offset - filters.limit) })}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {Math.floor(filters.offset / filters.limit) + 1} of {Math.ceil(total / filters.limit)}
          </span>
          <Button
            variant="outline"
            disabled={filters.offset + filters.limit >= total}
            onClick={() => setFilters({ ...filters, offset: filters.offset + filters.limit })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

