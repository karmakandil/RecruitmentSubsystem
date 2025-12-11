"use client";

// CHANGED - New Termination Management page for HR Manager
// Implements OFF-001: HR Manager initiates termination based on performance

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import {
  TerminationRequest,
  TerminateEmployeeDto,
  TerminationStatus,
  TerminationInitiation,
} from "@/types/recruitment";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Textarea } from "@/components/leaves/Textarea";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";
import { StatusBadge } from "@/components/recruitment/StatusBadge";

export default function TerminationsPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  // CHANGED - State for employees list
  const [employees, setEmployees] = useState<any[]>([]);
  // CHANGED - State for termination requests
  const [terminations, setTerminations] = useState<TerminationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // CHANGED - Modal states
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [performanceData, setPerformanceData] = useState<any | null>(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);

  // CHANGED - Form state
  const [terminateForm, setTerminateForm] = useState<TerminateEmployeeDto>({
    employeeId: "",
    reason: "",
    hrComments: "",
    terminationDate: "",
  });

  // CHANGED - Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // CHANGED - Load employees and existing terminations
  const loadData = async () => {
    try {
      setLoading(true);

      // Load all employees
      const employeeResponse = await recruitmentApi.getAllEmployees();
      const employeeList = employeeResponse?.data || employeeResponse || [];
      setEmployees(Array.isArray(employeeList) ? employeeList : []);

      // Load existing resignation/termination requests for current user
      try {
        const resignations = await recruitmentApi.getMyResignationRequests();
        setTerminations(Array.isArray(resignations) ? resignations : []);
      } catch (e) {
        // HR Manager viewing - may not have their own resignations
        setTerminations([]);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  // CHANGED - View employee performance
  const handleViewPerformance = async (employee: any) => {
    setSelectedEmployee(employee);
    setPerformanceData(null);
    setPerformanceLoading(true);
    setIsPerformanceModalOpen(true);

    try {
      const data = await recruitmentApi.getEmployeePerformance(employee._id);
      setPerformanceData(data);
    } catch (error: any) {
      // CHANGED - Handle case where no appraisal exists
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        setPerformanceData({ noData: true });
      } else {
        showToast(error.message || "Failed to load performance data", "error");
        setPerformanceData({ error: true });
      }
    } finally {
      setPerformanceLoading(false);
    }
  };

  // CHANGED - Open terminate modal
  const handleOpenTerminate = (employee: any) => {
    setSelectedEmployee(employee);
    setTerminateForm({
      employeeId: employee.employeeNumber || "",
      reason: "",
      hrComments: "",
      terminationDate: "",
    });
    setIsTerminateModalOpen(true);
  };

  // CHANGED - Submit termination
  const handleTerminate = async () => {
    if (!terminateForm.employeeId || !terminateForm.reason) {
      showToast("Employee ID and reason are required", "error");
      return;
    }

    try {
      const result = await recruitmentApi.terminateEmployee(terminateForm);
      showToast(
        `Termination initiated for ${terminateForm.employeeId}. Performance score: ${result.performanceScore}`,
        "success"
      );
      setIsTerminateModalOpen(false);
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to initiate termination", "error");
    }
  };

  // CHANGED - Update termination status
  const handleUpdateStatus = async (
    terminationId: string,
    newStatus: string
  ) => {
    try {
      await recruitmentApi.updateTerminationStatus(terminationId, newStatus);
      showToast(`Termination status updated to ${newStatus}`, "success");
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to update status", "error");
    }
  };

  // CHANGED - Filter employees by search term
  const filteredEmployees = employees.filter((emp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (emp.employeeNumber?.toLowerCase() || "").includes(searchLower) ||
      (emp.firstName?.toLowerCase() || "").includes(searchLower) ||
      (emp.lastName?.toLowerCase() || "").includes(searchLower) ||
      (emp.fullName?.toLowerCase() || "").includes(searchLower) ||
      (emp.department?.toLowerCase() || "").includes(searchLower)
    );
  });

  // CHANGED - Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute allowedRoles={[SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN]}>
      <div className="container mx-auto px-6 py-8">
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />

        <div className="mb-8">
          <Link
            href="/dashboard/recruitment"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Recruitment
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Termination Management
          </h1>
          <p className="text-gray-600 mt-1">
            Review employee performance and initiate terminations based on
            warnings and performance data (OFF-001)
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            {/* CHANGED - Employee Search Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Employee Performance Review</CardTitle>
                <CardDescription>
                  Search employees to view their performance and initiate
                  termination if performance score is below 2.5
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search by name, employee number, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {filteredEmployees.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No employees found matching your search.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEmployees.slice(0, 20).map((emp) => (
                          <tr key={emp._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {emp.fullName ||
                                      `${emp.firstName || ""} ${emp.lastName || ""}`.trim() ||
                                      "N/A"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {emp.employeeNumber || "No ID"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {emp.department || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {emp.position || ""}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  emp.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {emp.status || "active"}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewPerformance(emp)}
                                >
                                  View Performance
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleOpenTerminate(emp)}
                                >
                                  Initiate Termination
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredEmployees.length > 20 && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Showing 20 of {filteredEmployees.length} employees. Refine
                        your search for more specific results.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CHANGED - Existing Termination Requests Section */}
            <Card>
              <CardHeader>
                <CardTitle>Termination Requests</CardTitle>
                <CardDescription>
                  Track and manage existing termination requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {terminations.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No termination requests found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {terminations.map((term) => (
                      <div
                        key={term._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {term.employee?.fullName ||
                                term.employee?.employeeNumber ||
                                term.employeeId}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {term.reason}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Initiated:{" "}
                              {term.createdAt
                                ? new Date(term.createdAt).toLocaleDateString()
                                : "N/A"}
                              {term.initiator && ` • By: ${term.initiator}`}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                                term.status
                              )}`}
                            >
                              {term.status}
                            </span>
                            {term.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(term._id, "approved")
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(term._id, "rejected")
                                  }
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* CHANGED - Performance Review Modal */}
        <Modal
          isOpen={isPerformanceModalOpen}
          onClose={() => setIsPerformanceModalOpen(false)}
          title={`Performance Review: ${
            selectedEmployee?.fullName || selectedEmployee?.employeeNumber || ""
          }`}
          size="lg"
        >
          <div className="space-y-4 text-gray-900">
            {performanceLoading ? (
              <p className="text-center py-4 text-gray-500">
                Loading performance data...
              </p>
            ) : performanceData?.noData ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  No appraisal records found for this employee.
                </p>
                <p className="text-sm text-yellow-600 mt-2">
                  Performance-based termination requires at least one appraisal
                  record with a score below 2.5.
                </p>
              </div>
            ) : performanceData?.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  Failed to load performance data.
                </p>
              </div>
            ) : performanceData ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Latest Performance Score</p>
                    <p
                      className={`text-3xl font-bold ${
                        performanceData.totalScore < 2.5
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {performanceData.totalScore?.toFixed(2) || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {performanceData.totalScore < 2.5
                        ? "Eligible for termination"
                        : "Not eligible for termination (score must be < 2.5)"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Review Period</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {performanceData.reviewPeriod || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {performanceData.reviewDate
                        ? `Date: ${new Date(
                            performanceData.reviewDate
                          ).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                </div>

                {performanceData.feedback && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Manager Feedback</p>
                    <p className="text-gray-900">{performanceData.feedback}</p>
                  </div>
                )}

                {performanceData.totalScore < 2.5 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-semibold">
                      ⚠️ This employee is eligible for termination due to low
                      performance score.
                    </p>
                    <Button
                      className="mt-3"
                      variant="danger"
                      onClick={() => {
                        setIsPerformanceModalOpen(false);
                        handleOpenTerminate(selectedEmployee);
                      }}
                    >
                      Initiate Termination
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">No performance data available.</p>
            )}
          </div>
        </Modal>

        {/* CHANGED - Terminate Employee Modal */}
        <Modal
          isOpen={isTerminateModalOpen}
          onClose={() => setIsTerminateModalOpen(false)}
          title="Initiate Employee Termination"
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-semibold">⚠️ Warning</p>
              <p className="text-sm text-red-700 mt-1">
                You are about to initiate termination for{" "}
                <strong>
                  {selectedEmployee?.fullName ||
                    selectedEmployee?.employeeNumber}
                </strong>
                . This action requires the employee to have a performance score
                below 2.5.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Number *
              </label>
              <Input
                value={terminateForm.employeeId}
                onChange={(e) =>
                  setTerminateForm({
                    ...terminateForm,
                    employeeId: e.target.value,
                  })
                }
                placeholder="e.g., EMP-001"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the employee number (e.g., EMP-001)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Termination *
              </label>
              <Textarea
                value={terminateForm.reason}
                onChange={(e) =>
                  setTerminateForm({
                    ...terminateForm,
                    reason: e.target.value,
                  })
                }
                placeholder="Explain the reason for termination..."
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HR Comments (Optional)
              </label>
              <Textarea
                value={terminateForm.hrComments || ""}
                onChange={(e) =>
                  setTerminateForm({
                    ...terminateForm,
                    hrComments: e.target.value,
                  })
                }
                placeholder="Additional comments for the record..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Termination Date (Optional)
              </label>
              <Input
                type="date"
                value={terminateForm.terminationDate || ""}
                onChange={(e) =>
                  setTerminateForm({
                    ...terminateForm,
                    terminationDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsTerminateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleTerminate}>
                Initiate Termination
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

