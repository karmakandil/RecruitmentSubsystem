"use client";

// CHANGED - New Offboarding Checklists page for HR Manager
// Implements: HR Manager creates offboarding checklist (IT assets, ID cards, equipment)

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import {
  TerminationRequest,
  ClearanceChecklist,
  UpdateClearanceItemStatusDto,
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
import { Select } from "@/components/leaves/Select";
import { Textarea } from "@/components/leaves/Textarea";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";

export default function OffboardingChecklistsPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  // CHANGED - State for terminations (to create checklists from)
  const [terminations, setTerminations] = useState<TerminationRequest[]>([]);
  // CHANGED - State for clearance checklists
  const [checklists, setChecklists] = useState<Map<string, ClearanceChecklist>>(new Map());
  const [loading, setLoading] = useState(true);

  // CHANGED - Modal states
  const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<ClearanceChecklist | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [updateForm, setUpdateForm] = useState({
    department: "",
    status: "pending",
    notes: "",
  });

  // CHANGED - Search state
  const [searchTerm, setSearchTerm] = useState("");
  // CHANGED - Termination ID for creating new checklists
  const [terminationId, setTerminationId] = useState("");
  // CHANGED - OFF-013: Final settlement state
  const [settlementEmployeeId, setSettlementEmployeeId] = useState("");
  const [settlementTerminationId, setSettlementTerminationId] = useState("");
  const [settlementResult, setSettlementResult] = useState<any>(null);
  const [triggeringSettlement, setTriggeringSettlement] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // CHANGED - Load terminations and their clearance checklists
  const loadData = async () => {
    try {
      setLoading(true);

      // Get termination requests (resignations) - HR Manager's own for now
      // In a full implementation, there would be an endpoint to get all terminations
      const resignations = await recruitmentApi.getMyResignationRequests();
      setTerminations(Array.isArray(resignations) ? resignations : []);

      // Load clearance checklists for each termination
      const checklistMap = new Map<string, ClearanceChecklist>();
      
      // Note: In production, you'd have an endpoint to get all clearance checklists
      // For now, we'll try to load by employee ID if available
      
      setChecklists(checklistMap);
    } catch (error: any) {
      // Expected - HR Manager may not have their own resignations
      console.log("No terminations found or error:", error.message);
      setTerminations([]);
    } finally {
      setLoading(false);
    }
  };

  // CHANGED - Create clearance checklist for a termination
  const handleCreateChecklist = async (terminationId: string) => {
    try {
      await recruitmentApi.createClearanceChecklist(terminationId);
      showToast("Clearance checklist created successfully", "success");
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to create clearance checklist", "error");
    }
  };

  // CHANGED - Load checklist by employee
  const handleLoadChecklist = async (employeeId: string) => {
    try {
      const checklist = await recruitmentApi.getClearanceChecklistByEmployee(employeeId);
      if (checklist) {
        setChecklists((prev) => new Map(prev).set(employeeId, checklist));
        showToast("Clearance checklist loaded", "success");
      }
    } catch (error: any) {
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        // CHANGED - Show helpful message when no checklist exists
        showToast(
          "No clearance checklist found. Please create one from a termination request first.",
          "info"
        );
      } else {
        showToast(error.message || "Failed to load clearance checklist", "error");
      }
    }
  };

  // CHANGED - Create checklist from termination ID
  const handleCreateFromTermination = async (terminationId: string) => {
    if (!terminationId.trim()) {
      showToast("Please enter a termination ID", "error");
      return;
    }

    try {
      await recruitmentApi.createClearanceChecklist(terminationId);
      showToast("Clearance checklist created successfully!", "success");
      // Try to reload - the checklist is now created
    } catch (error: any) {
      showToast(error.message || "Failed to create clearance checklist", "error");
    }
  };

  // CHANGED - Open update item modal
  const handleOpenUpdateItem = (checklist: ClearanceChecklist, itemIndex: number) => {
    setSelectedChecklist(checklist);
    setSelectedItemIndex(itemIndex);
    const item = checklist.items[itemIndex];
    setUpdateForm({
      department: item.department || "",
      status: item.status || "pending",
      notes: item.notes || "",
    });
    setIsUpdateItemModalOpen(true);
  };

  // CHANGED - Update clearance item
  const handleUpdateItem = async () => {
    if (!selectedChecklist) return;

    try {
      const updateData: UpdateClearanceItemStatusDto = {
        itemIndex: selectedItemIndex,
        status: updateForm.status,
        notes: updateForm.notes || undefined,
      };

      await recruitmentApi.updateClearanceItemStatus(selectedChecklist._id, updateData);
      showToast("Clearance item updated", "success");
      setIsUpdateItemModalOpen(false);
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to update clearance item", "error");
    }
  };

  // CHANGED - Mark checklist complete
  const handleMarkComplete = async (checklistId: string) => {
    try {
      await recruitmentApi.markClearanceChecklistComplete(checklistId);
      showToast("Clearance checklist marked as complete", "success");
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to mark checklist complete", "error");
    }
  };

  // CHANGED - Send reminders
  const handleSendReminders = async () => {
    try {
      await recruitmentApi.sendClearanceReminders(false);
      showToast("Clearance reminders sent to pending departments", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to send reminders", "error");
    }
  };

  // CHANGED - OFF-013: Trigger final settlement (benefits termination + final pay calc)
  const handleTriggerFinalSettlement = async () => {
    if (!settlementEmployeeId.trim() || !settlementTerminationId.trim()) {
      showToast("Please enter both Employee ID and Termination ID", "error");
      return;
    }

    // Validate ObjectId format (24-character hex string)
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;
    if (!objectIdRegex.test(settlementEmployeeId.trim())) {
      showToast("Invalid Employee ID format. Must be a 24-character MongoDB ObjectId.", "error");
      return;
    }
    if (!objectIdRegex.test(settlementTerminationId.trim())) {
      showToast("Invalid Termination ID format. Must be a 24-character MongoDB ObjectId.", "error");
      return;
    }

    try {
      setTriggeringSettlement(true);
      setSettlementResult(null);

      const result = await recruitmentApi.triggerFinalSettlement(
        settlementEmployeeId.trim(),
        settlementTerminationId.trim()
      );

      setSettlementResult(result);
      showToast("Final settlement triggered successfully! Benefits termination and final pay calculation initiated.", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to trigger final settlement", "error");
      setSettlementResult({ error: error.message });
    } finally {
      setTriggeringSettlement(false);
    }
  };

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

  // CHANGED - Get department icon
  const getDepartmentIcon = (department: string) => {
    switch (department?.toUpperCase()) {
      case "IT":
        return "💻";
      case "HR":
        return "👤";
      case "FINANCE":
        return "💰";
      case "FACILITIES":
        return "🏢";
      case "ADMIN":
        return "📋";
      case "LINE_MANAGER":
        return "👔";
      default:
        return "📁";
    }
  };

  // CHANGED - Calculate checklist progress
  const getChecklistProgress = (checklist: ClearanceChecklist) => {
    if (!checklist.items || checklist.items.length === 0) return 0;
    const approved = checklist.items.filter(
      (item) => item.status?.toLowerCase() === "approved"
    ).length;
    return Math.round((approved / checklist.items.length) * 100);
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
            Offboarding Checklists
          </h1>
          <p className="text-gray-600 mt-1">
            Manage offboarding checklists to ensure no company property is lost
            (IT assets, ID cards, equipment)
          </p>
        </div>

        {/* CHANGED - Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by employee ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSendReminders}>
              Send Reminders
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading offboarding checklists...</p>
          </div>
        ) : (
          <>
            {/* CHANGED - Instructions Card */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  How to use Offboarding Checklists
                </h3>
                <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                  <li>
                    First, create a termination request from the{" "}
                    <Link
                      href="/dashboard/recruitment/terminations"
                      className="underline"
                    >
                      Termination Management
                    </Link>{" "}
                    page
                  </li>
                  <li>
                    When a termination is approved, create a clearance checklist
                  </li>
                  <li>
                    Track approvals from each department (IT, HR, Finance,
                    Facilities, Admin)
                  </li>
                  <li>Ensure all equipment, ID cards, and assets are returned</li>
                  <li>Mark the checklist as complete when all items are approved</li>
                </ol>
              </CardContent>
            </Card>

            {/* CHANGED - Checklist Items Explanation */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Clearance Checklist Items</CardTitle>
                <CardDescription>
                  Each offboarding checklist includes the following departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">👔</span>
                    <div>
                      <p className="font-medium text-gray-900">Line Manager</p>
                      <p className="text-xs text-gray-500">
                        Work handover, project transfer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="font-medium text-gray-900">HR</p>
                      <p className="text-xs text-gray-500">
                        Exit interview, final paperwork
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">💻</span>
                    <div>
                      <p className="font-medium text-gray-900">IT</p>
                      <p className="text-xs text-gray-500">
                        Laptop, phone, software access
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="font-medium text-gray-900">Finance</p>
                      <p className="text-xs text-gray-500">
                        Final settlement, expenses
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <p className="font-medium text-gray-900">Facilities</p>
                      <p className="text-xs text-gray-500">
                        Desk, parking, building access
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="font-medium text-gray-900">Admin</p>
                      <p className="text-xs text-gray-500">
                        ID card, keys, access cards
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CHANGED - Create Checklist Section */}
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900">Create Clearance Checklist</CardTitle>
                <CardDescription className="text-green-700">
                  Enter a termination request ID to create a new clearance checklist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter Termination ID (MongoDB ObjectId, e.g., 507f1f77bcf86cd799439011)"
                    value={terminationId}
                    onChange={(e) => setTerminationId(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleCreateFromTermination(terminationId)}
                    disabled={!terminationId.trim()}
                  >
                    Create Checklist
                  </Button>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  You can find the Termination ID from the Termination Management page or your database.
                </p>
              </CardContent>
            </Card>

            {/* CHANGED - Load Checklist Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Load Existing Checklist</CardTitle>
                <CardDescription>
                  Enter an employee number to view their clearance checklist (if it exists)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter Employee Number (e.g., EMP-2025-0014)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleLoadChecklist(searchTerm)}
                    disabled={!searchTerm.trim()}
                  >
                    Load Checklist
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CHANGED - OFF-013: Final Settlement Section */}
            <Card className="mb-8 border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-900">
                  💰 Trigger Final Settlement (OFF-013)
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Send offboarding notification to trigger benefits termination and final pay calculation
                  (unused leave, deductions, severance)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-3">What this does:</h4>
                    <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
                      <li>Calculates unused leave balance for encashment</li>
                      <li>Creates employee termination benefit records in payroll module</li>
                      <li>Queues final pay calculation (salary, deductions, severance)</li>
                      <li>Triggers benefits plan termination</li>
                      <li>Sends notification to HR about settlement status</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee ID (MongoDB ObjectId) *
                      </label>
                      <Input
                        placeholder="e.g., 507f1f77bcf86cd799439011"
                        value={settlementEmployeeId}
                        onChange={(e) => setSettlementEmployeeId(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Termination ID (MongoDB ObjectId) *
                      </label>
                      <Input
                        placeholder="e.g., 507f1f77bcf86cd799439012"
                        value={settlementTerminationId}
                        onChange={(e) => setSettlementTerminationId(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleTriggerFinalSettlement}
                    disabled={triggeringSettlement || !settlementEmployeeId.trim() || !settlementTerminationId.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {triggeringSettlement ? "Processing..." : "🚀 Trigger Final Settlement"}
                  </Button>

                  <p className="text-xs text-purple-600">
                    Note: This should be triggered after all clearance items are approved.
                    The system automatically triggers this when all clearances are complete,
                    but you can also trigger it manually here.
                  </p>
                </div>

                {/* Settlement Result */}
                {settlementResult && (
                  <div className={`mt-4 p-4 rounded-lg ${settlementResult.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border`}>
                    <h4 className={`font-medium mb-2 ${settlementResult.error ? 'text-red-900' : 'text-green-900'}`}>
                      {settlementResult.error ? '❌ Settlement Error' : '✅ Settlement Result'}
                    </h4>
                    {settlementResult.error ? (
                      <p className="text-red-700 text-sm">{settlementResult.error}</p>
                    ) : (
                      <div className="text-sm text-green-800 space-y-2">
                        <p><strong>Status:</strong> {settlementResult.status || 'Processed'}</p>
                        {settlementResult.components && (
                          <>
                            {settlementResult.components.leaveEncashment && (
                              <div className="bg-white p-2 rounded">
                                <p className="font-medium">📅 Leave Encashment:</p>
                                <p>Unused Days: {settlementResult.components.leaveEncashment.unusedDays || 'N/A'}</p>
                                <p>Encashment Amount: {settlementResult.components.leaveEncashment.encashmentAmount || 'Calculated'}</p>
                              </div>
                            )}
                            {settlementResult.components.benefitsTermination && (
                              <div className="bg-white p-2 rounded">
                                <p className="font-medium">💼 Benefits Termination:</p>
                                <p>Benefits Created: {settlementResult.components.benefitsTermination.benefitsCreated || 0}</p>
                                <p>{settlementResult.components.benefitsTermination.note || 'Processed'}</p>
                              </div>
                            )}
                          </>
                        )}
                        {settlementResult.errors && settlementResult.errors.length > 0 && (
                          <div className="bg-yellow-50 p-2 rounded">
                            <p className="font-medium text-yellow-800">⚠️ Warnings:</p>
                            {settlementResult.errors.map((err: any, idx: number) => (
                              <p key={idx} className="text-yellow-700">{err.step}: {err.error}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CHANGED - Display loaded checklists */}
            {checklists.size > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Loaded Checklists
                </h2>
                {Array.from(checklists.values()).map((checklist) => (
                  <Card
                    key={checklist._id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">
                            Clearance Checklist
                          </CardTitle>
                          <CardDescription>
                            Employee: {checklist.employeeId || "N/A"}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                              checklist.status
                            )}`}
                          >
                            {checklist.status || "In Progress"}
                          </span>
                          <span className="text-sm text-gray-500">
                            Progress: {getChecklistProgress(checklist)}%
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${getChecklistProgress(checklist)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Checklist Items */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Department Approvals
                        </h3>
                        {checklist.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {getDepartmentIcon(item.department)}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.department}
                                </p>
                                {item.notes && (
                                  <p className="text-sm text-gray-500">
                                    {item.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                                  item.status
                                )}`}
                              >
                                {item.status || "pending"}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleOpenUpdateItem(checklist, index)
                                }
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>


                      {/* Actions */}
                      <div className="mt-6 flex gap-3">
                        <Button
                          onClick={() => handleMarkComplete(checklist._id)}
                          disabled={getChecklistProgress(checklist) < 100}
                        >
                          Mark Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* CHANGED - No checklists message */}
            {checklists.size === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 mb-4">
                    No clearance checklists loaded yet.
                  </p>
                  <p className="text-sm text-gray-400">
                    Enter an employee ID above to load their clearance checklist,
                    or create a termination request first.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* CHANGED - Update Item Modal */}
        <Modal
          isOpen={isUpdateItemModalOpen}
          onClose={() => setIsUpdateItemModalOpen(false)}
          title="Update Clearance Item"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <Input value={updateForm.department} disabled />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <Select
                value={updateForm.status}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, status: e.target.value })
                }
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments (Optional)
              </label>
              <Textarea
                value={updateForm.notes}
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, notes: e.target.value })
                }
                placeholder="Add any notes..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsUpdateItemModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateItem}>Update</Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

