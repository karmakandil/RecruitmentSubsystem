"use client";

import React, { useState, useEffect } from "react";
import { leavesApi } from "@/lib/api/leaves/leaves";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { LeaveType } from "@/types/leaves";

export default function AccrualManagementPage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  
  const [formData, setFormData] = useState({
    employeeId: "",
    leaveTypeId: "",
    accrualAmount: "",
    accrualType: "monthly",
    notes: "",
  });

  const [bulkFormData, setBulkFormData] = useState({
    leaveTypeId: "",
    accrualAmount: "",
    accrualType: "monthly",
    departmentId: "",
  });

  useRequireAuth();

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const types = await leavesApi.getLeaveTypes();
      setLeaveTypes(types || []);
    } catch (error) {
      console.warn("Failed to fetch leave types:", error);
      setLeaveTypes([]);
    }
  };

  const handleSingleAccrual = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      if (!formData.employeeId || !formData.leaveTypeId || !formData.accrualAmount) {
        throw new Error("Please fill in all required fields");
      }

      const result = await leavesApi.autoAccrueLeave(
        formData.employeeId,
        formData.leaveTypeId,
        parseFloat(formData.accrualAmount),
        formData.accrualType,
        undefined,
        formData.notes || undefined
      );

      if (result.success) {
        setSuccessMessage(`Leave accrued successfully. New balance: ${result.newBalance} days`);
        setFormData({
          employeeId: "",
          leaveTypeId: "",
          accrualAmount: "",
          accrualType: "monthly",
          notes: "",
        });
      } else {
        setError(result.reason || "Accrual was skipped");
      }
    } catch (error: any) {
      console.error("Error accruing leave:", error);
      setError(error.message || "Failed to accrue leave");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAccrual = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      if (!bulkFormData.leaveTypeId || !bulkFormData.accrualAmount) {
        throw new Error("Please fill in all required fields");
      }

      const result = await leavesApi.autoAccrueAllEmployees(
        bulkFormData.leaveTypeId,
        parseFloat(bulkFormData.accrualAmount),
        bulkFormData.accrualType,
        bulkFormData.departmentId || undefined
      );

      setSuccessMessage(
        `Bulk accrual completed. Successful: ${result.successful}, Failed: ${result.failed}, Skipped: ${result.skipped}`
      );
      setBulkFormData({
        leaveTypeId: "",
        accrualAmount: "",
        accrualType: "monthly",
        departmentId: "",
      });
    } catch (error: any) {
      console.error("Error in bulk accrual:", error);
      setError(error.message || "Failed to accrue leave for all employees");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Auto Accrual Management</h1>
        <p className="text-gray-600 mt-1">Automatically add leave days to employee balances</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single Employee Accrual */}
        <Card>
          <CardHeader>
            <CardTitle>Accrue Leave for Single Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSingleAccrual} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type *
                </label>
                <select
                  value={formData.leaveTypeId}
                  onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accrual Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.accrualAmount}
                  onChange={(e) => setFormData({ ...formData, accrualAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accrual Type *
                </label>
                <select
                  value={formData.accrualType}
                  onChange={(e) => setFormData({ ...formData, accrualType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="per_term">Per Term</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Accrue Leave"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bulk Accrual */}
        <Card>
          <CardHeader>
            <CardTitle>Accrue Leave for All Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBulkAccrual} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type *
                </label>
                <select
                  value={bulkFormData.leaveTypeId}
                  onChange={(e) => setBulkFormData({ ...bulkFormData, leaveTypeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accrual Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={bulkFormData.accrualAmount}
                  onChange={(e) => setBulkFormData({ ...bulkFormData, accrualAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accrual Type *
                </label>
                <select
                  value={bulkFormData.accrualType}
                  onChange={(e) => setBulkFormData({ ...bulkFormData, accrualType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="per_term">Per Term</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department ID (Optional)
                </label>
                <input
                  type="text"
                  value={bulkFormData.departmentId}
                  onChange={(e) => setBulkFormData({ ...bulkFormData, departmentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave empty for all departments"
                />
              </div>
              <Button type="submit" disabled={loading} variant="outline">
                {loading ? "Processing..." : "Accrue for All Employees"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

