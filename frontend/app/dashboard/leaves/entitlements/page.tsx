"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { leavesApi } from "@/lib/api/leaves/leaves";
import { employeeProfileApi } from "@/lib/api/employee-profile/employee-profile";
import { LeaveEntitlement, CreateLeaveEntitlementDto, UpdateLeaveEntitlementDto } from "@/types/leaves";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/leaves/Select";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";

export default function LeaveEntitlementsPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.HR_ADMIN);
  const { toast, showToast, hideToast } = useToast();

  const [entitlement, setEntitlement] = useState<LeaveEntitlement | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Array<{ _id: string; employeeId: string; firstName: string; lastName: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchLeaveTypeId, setSearchLeaveTypeId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPersonalizedModalOpen, setIsPersonalizedModalOpen] = useState(false);
  const [editingEntitlement, setEditingEntitlement] = useState<LeaveEntitlement | null>(null);
  const [formData, setFormData] = useState<CreateLeaveEntitlementDto>({
    employeeId: "",
    leaveTypeId: "",
    yearlyEntitlement: 0,
    accruedActual: 0,
    accruedRounded: 0,
    carryForward: 0,
    taken: 0,
    pending: 0,
    remaining: 0,
  });
  const [personalizedData, setPersonalizedData] = useState({
    employeeId: "",
    leaveTypeId: "",
    personalizedEntitlement: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load leave types and employees for dropdowns
    loadLeaveTypes();
    loadEmployees();
  }, []);

  // NEW: Load employees for dropdown
  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await employeeProfileApi.getAllEmployees({ limit: 1000 });
      const employeesList = Array.isArray(response.data) ? response.data : [];
      setEmployees(employeesList.map((emp: any) => ({
        _id: emp._id,
        employeeId: emp.employeeId || emp._id,
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
      })));
    } catch (error: any) {
      console.error("Failed to load employees:", error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const loadLeaveTypes = async () => {
    try {
      const types = await leavesApi.getLeaveTypes();
      setLeaveTypes(types);
    } catch (error: any) {
      console.warn("Failed to load leave types:", error);
    }
  };

  const loadEntitlement = async () => {
    if (!searchEmployeeId || !searchLeaveTypeId) {
      setEntitlement(null);
      showToast("Please enter both Employee ID and Leave Type", "error");
      return;
    }

    try {
      setLoading(true);
      const data = await leavesApi.getLeaveEntitlement(searchEmployeeId, searchLeaveTypeId);
      setEntitlement(data);
    } catch (error: any) {
      showToast(error.message || "Failed to load leave entitlement", "error");
      setEntitlement(null);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!formData.leaveTypeId) newErrors.leaveTypeId = "Leave type is required";
    if (formData.yearlyEntitlement < 0) newErrors.yearlyEntitlement = "Must be >= 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingEntitlement) {
        await leavesApi.updateLeaveEntitlement(editingEntitlement._id, formData);
        showToast("Leave entitlement updated successfully", "success");
      } else {
        await leavesApi.createLeaveEntitlement(formData);
        showToast("Leave entitlement created successfully", "success");
      }
      setIsModalOpen(false);
      setFormData({
        employeeId: "",
        leaveTypeId: "",
        yearlyEntitlement: 0,
        accruedActual: 0,
        accruedRounded: 0,
        carryForward: 0,
        taken: 0,
        pending: 0,
        remaining: 0,
      });
      setEditingEntitlement(null);
      if (searchEmployeeId && searchLeaveTypeId) {
        loadEntitlement();
      }
    } catch (error: any) {
      showToast(error.message || "Failed to save leave entitlement", "error");
    }
  };

  const handlePersonalizedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalizedData.employeeId || !personalizedData.leaveTypeId) {
      showToast("Employee ID and Leave Type are required", "error");
      return;
    }

    try {
      await leavesApi.assignPersonalizedEntitlement(
        personalizedData.employeeId,
        personalizedData.leaveTypeId,
        personalizedData.personalizedEntitlement
      );
      showToast("Personalized entitlement assigned successfully", "success");
      setIsPersonalizedModalOpen(false);
      setPersonalizedData({
        employeeId: "",
        leaveTypeId: "",
        personalizedEntitlement: 0,
      });
    } catch (error: any) {
      showToast(error.message || "Failed to assign personalized entitlement", "error");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Entitlements</h1>
          <p className="text-gray-600 mt-1">
            Assign and manage employee leave entitlements
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsPersonalizedModalOpen(true)}>
            Assign Personalized
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>Create Entitlement</Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>View Leave Entitlement</CardTitle>
          <CardDescription>
            Enter Employee ID and Leave Type to view a specific entitlement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Employee ID *"
              value={searchEmployeeId}
              onChange={(e) => setSearchEmployeeId(e.target.value)}
              options={
                employees.length > 0
                  ? employees.map((emp) => ({
                      value: emp.employeeId || emp._id,
                      label: `${emp.employeeId || emp._id} - ${emp.firstName} ${emp.lastName}`,
                    }))
                  : [{ value: "", label: loadingEmployees ? "Loading employees..." : "No employees available" }]
              }
              placeholder="Select employee"
            />
            <Select
              label="Leave Type *"
              value={searchLeaveTypeId}
              onChange={(e) => setSearchLeaveTypeId(e.target.value)}
              options={
                leaveTypes.length > 0
                  ? leaveTypes.map((t) => ({ value: t._id, label: t.name }))
                  : [{ value: "", label: "No leave types available" }]
              }
              placeholder="Select a leave type"
            />
          </div>
          <div className="mt-4">
            <Button onClick={loadEntitlement} disabled={!searchEmployeeId || !searchLeaveTypeId}>
              Load Entitlement
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : !entitlement ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              {searchEmployeeId && searchLeaveTypeId
                ? "No entitlement found. Create one using the form above."
                : "Enter Employee ID and Leave Type to view entitlement."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Leave Entitlement Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Leave Type</p>
                <p className="font-medium">
                  {leaveTypes.find((t) => t._id === entitlement.leaveTypeId.toString())?.name || entitlement.leaveTypeId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Yearly Entitlement</p>
                <p className="font-medium">{entitlement.yearlyEntitlement} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Accrued Actual</p>
                <p className="font-medium">{entitlement.accruedActual} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Accrued Rounded</p>
                <p className="font-medium">{entitlement.accruedRounded} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Taken</p>
                <p className="font-medium">{entitlement.taken} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="font-medium">{entitlement.pending} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="font-medium text-green-600">{entitlement.remaining} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Carry Forward</p>
                <p className="font-medium">{entitlement.carryForward} days</p>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingEntitlement(entitlement);
                  setFormData({
                    employeeId: entitlement.employeeId.toString(),
                    leaveTypeId: entitlement.leaveTypeId.toString(),
                    yearlyEntitlement: entitlement.yearlyEntitlement,
                    accruedActual: entitlement.accruedActual,
                    accruedRounded: entitlement.accruedRounded,
                    carryForward: entitlement.carryForward,
                    taken: entitlement.taken,
                    pending: entitlement.pending,
                    remaining: entitlement.remaining,
                  });
                  setIsModalOpen(true);
                }}
              >
                Edit Entitlement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Entitlement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntitlement(null);
        }}
        title={editingEntitlement ? "Edit Leave Entitlement" : "Create Leave Entitlement"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsModalOpen(false);
              setEditingEntitlement(null);
            }}>
              Cancel
            </Button>
            <Button type="submit" form="entitlement-form">
              {editingEntitlement ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <form id="entitlement-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Employee ID *"
              value={formData.employeeId}
              onChange={(e) =>
                setFormData({ ...formData, employeeId: e.target.value })
              }
              error={errors.employeeId}
              options={
                employees.length > 0
                  ? employees.map((emp) => ({
                      value: emp.employeeId || emp._id,
                      label: `${emp.employeeId || emp._id} - ${emp.firstName} ${emp.lastName}`,
                    }))
                  : [{ value: "", label: loadingEmployees ? "Loading employees..." : "No employees available" }]
              }
              placeholder="Select employee"
            />
            <Select
              label="Leave Type *"
              value={formData.leaveTypeId}
              onChange={(e) =>
                setFormData({ ...formData, leaveTypeId: e.target.value })
              }
              error={errors.leaveTypeId}
              options={
                leaveTypes.length > 0
                  ? leaveTypes.map((t) => ({ value: t._id, label: t.name }))
                  : [{ value: "", label: "No leave types available" }]
              }
              placeholder="Select a leave type"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Yearly Entitlement *"
              type="number"
              step="0.01"
              value={formData.yearlyEntitlement}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  yearlyEntitlement: parseFloat(e.target.value) || 0,
                })
              }
              error={errors.yearlyEntitlement}
            />
            <Input
              label="Accrued Actual"
              type="number"
              step="0.01"
              value={formData.accruedActual}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accruedActual: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Accrued Rounded"
              type="number"
              step="0.01"
              value={formData.accruedRounded}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accruedRounded: parseFloat(e.target.value) || 0,
                })
              }
            />
            <Input
              label="Carry Forward"
              type="number"
              step="0.01"
              value={formData.carryForward}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  carryForward: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Taken"
              type="number"
              step="0.01"
              value={formData.taken}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  taken: parseFloat(e.target.value) || 0,
                })
              }
            />
            <Input
              label="Pending"
              type="number"
              step="0.01"
              value={formData.pending}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pending: parseFloat(e.target.value) || 0,
                })
              }
            />
            <Input
              label="Remaining"
              type="number"
              step="0.01"
              value={formData.remaining}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  remaining: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
        </form>
      </Modal>

      {/* Personalized Entitlement Modal */}
      <Modal
        isOpen={isPersonalizedModalOpen}
        onClose={() => setIsPersonalizedModalOpen(false)}
        title="Assign Personalized Entitlement"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPersonalizedModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePersonalizedSubmit}>Assign</Button>
          </>
        }
      >
        <form onSubmit={handlePersonalizedSubmit} className="space-y-4">
          <Select
            label="Employee ID *"
            value={personalizedData.employeeId}
            onChange={(e) =>
              setPersonalizedData({
                ...personalizedData,
                employeeId: e.target.value,
              })
            }
            options={
              employees.length > 0
                ? employees.map((emp) => ({
                    value: emp.employeeId || emp._id,
                    label: `${emp.employeeId || emp._id} - ${emp.firstName} ${emp.lastName}`,
                  }))
                : [{ value: "", label: loadingEmployees ? "Loading employees..." : "No employees available" }]
            }
            placeholder="Select employee"
          />
          <Select
            label="Leave Type *"
            value={personalizedData.leaveTypeId}
            onChange={(e) =>
              setPersonalizedData({
                ...personalizedData,
                leaveTypeId: e.target.value,
              })
            }
            options={
              leaveTypes.length > 0
                ? leaveTypes.map((t) => ({ value: t._id, label: t.name }))
                : [{ value: "", label: "No leave types available" }]
            }
            placeholder="Select leave type"
          />
          <Input
            label="Personalized Entitlement *"
            type="number"
            step="0.01"
            value={personalizedData.personalizedEntitlement}
            onChange={(e) =>
              setPersonalizedData({
                ...personalizedData,
                personalizedEntitlement: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="Additional entitlement days"
          />
        </form>
      </Modal>
    </div>
  );
}

