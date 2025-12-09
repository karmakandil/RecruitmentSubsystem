"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { leavesApi } from "@/lib/api/leaves/leaves";
import { LeavePolicy, CreateLeavePolicyDto, UpdateLeavePolicyDto } from "@/types/leaves";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/leaves/Select";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";
import { LeaveType } from "@/types/leaves";

export default function LeavePoliciesPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.HR_ADMIN);
  const { toast, showToast, hideToast } = useToast();

  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicy | null>(null);
  const [deletingPolicy, setDeletingPolicy] = useState<LeavePolicy | null>(null);
  const [formData, setFormData] = useState<CreateLeavePolicyDto>({
    leaveTypeId: "",
    accrualMethod: "monthly",
    monthlyRate: 0,
    yearlyRate: 0,
    roundingRule: "none",
    maxCarryForward: 0,
    minNoticeDays: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const policiesData = await leavesApi.getLeavePolicies();
      setPolicies(policiesData);
      
      // TODO: Load leave types when endpoint is ready
      // const types = await leavesApi.getLeaveTypes();
      // setLeaveTypes(types);
      setLeaveTypes([]);
    } catch (error: any) {
      showToast(error.message || "Failed to load leave policies", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPolicy(null);
    setFormData({
      leaveTypeId: "",
      accrualMethod: "monthly",
      monthlyRate: 0,
      yearlyRate: 0,
      roundingRule: "none",
      maxCarryForward: 0,
      minNoticeDays: 0,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (policy: LeavePolicy) => {
    setEditingPolicy(policy);
    setFormData({
      leaveTypeId: policy.leaveTypeId.toString(),
      accrualMethod: policy.accrualMethod,
      monthlyRate: policy.monthlyRate,
      yearlyRate: policy.yearlyRate,
      roundingRule: policy.roundingRule,
      maxCarryForward: policy.maxCarryForward,
      minNoticeDays: policy.minNoticeDays,
      maxConsecutiveDays: policy.maxConsecutiveDays,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (policy: LeavePolicy) => {
    setDeletingPolicy(policy);
    setIsDeleteModalOpen(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.leaveTypeId) newErrors.leaveTypeId = "Leave type is required";
    if (formData.monthlyRate < 0) newErrors.monthlyRate = "Monthly rate must be >= 0";
    if (formData.yearlyRate < 0) newErrors.yearlyRate = "Yearly rate must be >= 0";
    if (formData.minNoticeDays < 0) newErrors.minNoticeDays = "Min notice days must be >= 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingPolicy) {
        await leavesApi.updateLeavePolicy(editingPolicy._id, formData);
        showToast("Leave policy updated successfully", "success");
      } else {
        await leavesApi.createLeavePolicy(formData);
        showToast("Leave policy created successfully", "success");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to save leave policy", "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingPolicy) return;
    try {
      await leavesApi.deleteLeavePolicy(deletingPolicy._id);
      showToast("Leave policy deleted successfully", "success");
      setIsDeleteModalOpen(false);
      setDeletingPolicy(null);
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to delete leave policy", "error");
    }
  };

  const accrualMethodOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "per-term", label: "Per Term" },
  ];

  const roundingRuleOptions = [
    { value: "none", label: "None" },
    { value: "round", label: "Round" },
    { value: "round_up", label: "Round Up" },
    { value: "round_down", label: "Round Down" },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Leave Policies</h1>
          <p className="text-gray-600 mt-1">
            Configure accrual rates, carry-over, and eligibility rules
          </p>
        </div>
        <Button onClick={handleOpenCreate}>Create Policy</Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : policies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              No policies found. Create your first policy to get started.
            </p>
            <Button onClick={handleOpenCreate}>Create Policy</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Leave Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Accrual Method</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Monthly Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Yearly Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Max Carry Forward</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Min Notice Days</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {leaveTypes.find((t) => t._id === policy.leaveTypeId.toString())?.name || policy.leaveTypeId}
                  </td>
                  <td className="py-3 px-4 capitalize">{policy.accrualMethod}</td>
                  <td className="py-3 px-4">{policy.monthlyRate}</td>
                  <td className="py-3 px-4">{policy.yearlyRate}</td>
                  <td className="py-3 px-4">{policy.maxCarryForward}</td>
                  <td className="py-3 px-4">{policy.minNoticeDays}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(policy)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDelete(policy)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPolicy ? "Edit Leave Policy" : "Create Leave Policy"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingPolicy ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Select
            label="Accrual Method *"
            value={formData.accrualMethod}
            onChange={(e) =>
              setFormData({
                ...formData,
                accrualMethod: e.target.value as any,
              })
            }
            options={accrualMethodOptions}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Rate *"
              type="number"
              step="0.01"
              value={formData.monthlyRate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monthlyRate: parseFloat(e.target.value) || 0,
                })
              }
              error={errors.monthlyRate}
            />
            <Input
              label="Yearly Rate *"
              type="number"
              step="0.01"
              value={formData.yearlyRate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  yearlyRate: parseFloat(e.target.value) || 0,
                })
              }
              error={errors.yearlyRate}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Rounding Rule"
              value={formData.roundingRule}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roundingRule: e.target.value as any,
                })
              }
              options={roundingRuleOptions}
            />
            <Input
              label="Max Carry Forward"
              type="number"
              value={formData.maxCarryForward}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxCarryForward: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Notice Days *"
              type="number"
              value={formData.minNoticeDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minNoticeDays: parseInt(e.target.value) || 0,
                })
              }
              error={errors.minNoticeDays}
            />
            <Input
              label="Max Consecutive Days (Optional)"
              type="number"
              value={formData.maxConsecutiveDays || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxConsecutiveDays: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Leave Policy"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete this leave policy? This action cannot
          be undone.
        </p>
      </Modal>
    </div>
  );
}

