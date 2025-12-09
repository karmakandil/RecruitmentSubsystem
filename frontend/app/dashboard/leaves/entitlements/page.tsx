"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { leavesApi } from "@/lib/api/leaves/leaves";
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

  const [entitlements, setEntitlements] = useState<LeaveEntitlement[]>([]);
  const [loading, setLoading] = useState(true);
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
    // Note: There's no endpoint to list all entitlements, so we'll show a form to create/view by employee+type
  }, []);

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
      await leavesApi.createLeaveEntitlement(formData);
      showToast("Leave entitlement created successfully", "success");
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
    } catch (error: any) {
      showToast(error.message || "Failed to create leave entitlement", "error");
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

      <Card>
        <CardHeader>
          <CardTitle>Create Leave Entitlement</CardTitle>
          <CardDescription>
            Create a new leave entitlement for an employee. To view existing entitlements,
            use the API endpoint with employee ID and leave type ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Note: To view existing entitlements, you need to query by employee ID and leave type ID.
            Use the form below to create new entitlements.
          </p>
        </CardContent>
      </Card>

      {/* Create Entitlement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Leave Entitlement"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Employee ID *"
              value={formData.employeeId}
              onChange={(e) =>
                setFormData({ ...formData, employeeId: e.target.value })
              }
              error={errors.employeeId}
              placeholder="Employee ID"
            />
            <Input
              label="Leave Type ID *"
              value={formData.leaveTypeId}
              onChange={(e) =>
                setFormData({ ...formData, leaveTypeId: e.target.value })
              }
              error={errors.leaveTypeId}
              placeholder="Leave Type ID"
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
          <Input
            label="Employee ID *"
            value={personalizedData.employeeId}
            onChange={(e) =>
              setPersonalizedData({
                ...personalizedData,
                employeeId: e.target.value,
              })
            }
            placeholder="Employee ID"
          />
          <Input
            label="Leave Type ID *"
            value={personalizedData.leaveTypeId}
            onChange={(e) =>
              setPersonalizedData({
                ...personalizedData,
                leaveTypeId: e.target.value,
              })
            }
            placeholder="Leave Type ID"
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

