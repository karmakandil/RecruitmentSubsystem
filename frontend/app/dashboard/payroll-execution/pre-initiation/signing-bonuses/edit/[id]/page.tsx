"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../../../../components/shared/ui/Button";
import { Input } from "../../../../../../../components/shared/ui/Input";
import { Card } from "../../../../../../../components/shared/ui/Card";
import { payrollExecutionApi } from "../../../../../../../lib/api/payroll-execution/payroll-execution";
import { EmployeeSigningBonus, SigningBonusEditDto, BonusStatus } from "../../../../../../../types/payroll-execution";

export default function EditSigningBonusPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [signingBonus, setSigningBonus] = useState<EmployeeSigningBonus | null>(null);
  const [givenAmount, setGivenAmount] = useState<number>(0);
  const [status, setStatus] = useState<BonusStatus>(BonusStatus.PENDING);
  const [paymentDate, setPaymentDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSigningBonus();
    }
  }, [id]);

  const fetchSigningBonus = async () => {
    try {
      setLoading(true);
      const data = await payrollExecutionApi.getSigningBonusById(id);
      setSigningBonus(data);
      setGivenAmount(data.givenAmount);
      setStatus(data.status || BonusStatus.PENDING);
      if (data.paymentDate) {
        // Convert paymentDate to YYYY-MM-DD format for date input
        const date = new Date(data.paymentDate);
        setPaymentDate(date.toISOString().split('T')[0]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch signing bonus");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const editDto: SigningBonusEditDto = {
        employeeSigningBonusId: id,
        givenAmount,
        status,
        ...(status === BonusStatus.APPROVED && paymentDate && { paymentDate }),
      };

      await payrollExecutionApi.editSigningBonus(editDto);
      router.push("/dashboard/payroll-execution/pre-initiation/signing-bonuses");
    } catch (err: any) {
      setError(err.message || "Failed to edit signing bonus");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error && !signingBonus) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link href="/dashboard/payroll-execution/pre-initiation/signing-bonuses">
          <Button className="bg-gray-500 hover:bg-gray-600">Back to List</Button>
        </Link>
      </div>
    );
  }

  if (!signingBonus) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/payroll-execution/pre-initiation/signing-bonuses">
          <Button className="bg-gray-500 hover:bg-gray-600 mb-4">← Back to List</Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Signing Bonus</h1>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee Name</label>
              <p className="text-gray-700">
                {signingBonus.employeeId && typeof signingBonus.employeeId === "object" && signingBonus.employeeId !== null
                  ? `${signingBonus.employeeId.firstName || ""} ${signingBonus.employeeId.lastName || ""}`.trim() || "N/A"
                  : typeof signingBonus.employeeId === "string"
                  ? `Employee ID: ${signingBonus.employeeId}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employee ID</label>
              <p className="text-gray-700">
                {signingBonus.employeeId && typeof signingBonus.employeeId === "object" && signingBonus.employeeId !== null
                  ? signingBonus.employeeId.employeeNumber || (signingBonus.employeeId._id ? String(signingBonus.employeeId._id) : "N/A")
                  : typeof signingBonus.employeeId === "string"
                  ? signingBonus.employeeId
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Review Decision *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={BonusStatus.APPROVED}
                  checked={status === BonusStatus.APPROVED}
                  onChange={(e) => setStatus(e.target.value as BonusStatus)}
                  className="mr-2"
                />
                Approve
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={BonusStatus.REJECTED}
                  checked={status === BonusStatus.REJECTED}
                  onChange={(e) => setStatus(e.target.value as BonusStatus)}
                  className="mr-2"
                />
                Reject
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={BonusStatus.PENDING}
                  checked={status === BonusStatus.PENDING}
                  onChange={(e) => setStatus(e.target.value as BonusStatus)}
                  className="mr-2"
                />
                Pending
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={BonusStatus.PAID}
                  checked={status === BonusStatus.PAID}
                  onChange={(e) => setStatus(e.target.value as BonusStatus)}
                  className="mr-2"
                />
                Paid
              </label>
            </div>
          </div>

          {status === BonusStatus.APPROVED && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Date (Optional)
              </label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Given Amount *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={givenAmount}
              onChange={(e) => setGivenAmount(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Link href="/dashboard/payroll-execution/pre-initiation/signing-bonuses">
              <Button
                type="button"
                disabled={isSubmitting}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

