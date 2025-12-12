"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../../../../components/shared/ui/Button";
import { Input } from "../../../../../../../components/shared/ui/Input";
import { Card } from "../../../../../../../components/shared/ui/Card";
import { payrollExecutionApi } from "../../../../../../../lib/api/payroll-execution/payroll-execution";
import { EmployeeTerminationBenefit, TerminationBenefitEditDto, BenefitStatus } from "../../../../../../../types/payroll-execution";

export default function EditTerminationBenefitPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [terminationBenefit, setTerminationBenefit] = useState<EmployeeTerminationBenefit | null>(null);
  const [givenAmount, setGivenAmount] = useState<number>(0);
  const [status, setStatus] = useState<BenefitStatus>(BenefitStatus.PENDING);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTerminationBenefit();
    }
  }, [id]);

  const fetchTerminationBenefit = async () => {
    try {
      setLoading(true);
      const data = await payrollExecutionApi.getTerminationBenefitById(id);
      setTerminationBenefit(data);
      setGivenAmount(data.givenAmount);
      setStatus(data.status || BenefitStatus.PENDING);
    } catch (err: any) {
      setError(err.message || "Failed to fetch termination benefit");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const editDto: TerminationBenefitEditDto = {
        employeeTerminationResignationId: id,
        givenAmount,
        status,
      };

      await payrollExecutionApi.editTerminationBenefit(editDto);
      router.push("/dashboard/payroll-execution/pre-initiation/termination-benefits");
    } catch (err: any) {
      setError(err.message || "Failed to edit termination benefit");
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

  if (error && !terminationBenefit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link href="/dashboard/payroll-execution/pre-initiation/termination-benefits">
          <Button className="bg-gray-500 hover:bg-gray-600">Back to List</Button>
        </Link>
      </div>
    );
  }

  if (!terminationBenefit) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/payroll-execution/pre-initiation/termination-benefits">
          <Button className="bg-gray-500 hover:bg-gray-600 mb-4">← Back to List</Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Termination Benefit</h1>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee Name</label>
              <p className="text-gray-700">
                {terminationBenefit.employeeId && typeof terminationBenefit.employeeId === "object" && terminationBenefit.employeeId !== null
                  ? `${terminationBenefit.employeeId.firstName || ""} ${terminationBenefit.employeeId.lastName || ""}`.trim() || "N/A"
                  : typeof terminationBenefit.employeeId === "string"
                  ? `Employee ID: ${terminationBenefit.employeeId}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employee ID</label>
              <p className="text-gray-700">
                {terminationBenefit.employeeId && typeof terminationBenefit.employeeId === "object" && terminationBenefit.employeeId !== null
                  ? terminationBenefit.employeeId.employeeNumber || (terminationBenefit.employeeId._id ? String(terminationBenefit.employeeId._id) : "N/A")
                  : typeof terminationBenefit.employeeId === "string"
                  ? terminationBenefit.employeeId
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Termination Type</label>
              <p className="text-gray-700">
                {terminationBenefit.terminationId && typeof terminationBenefit.terminationId === "object" && terminationBenefit.terminationId !== null
                  ? terminationBenefit.terminationId.type
                  : "Unknown"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Benefit Name</label>
              <p className="text-gray-700">
                {terminationBenefit.benefitId && typeof terminationBenefit.benefitId === "object" && terminationBenefit.benefitId !== null
                  ? terminationBenefit.benefitId.name
                  : "Unknown"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Status</label>
              <p className="text-gray-700">{terminationBenefit.status}</p>
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
                  value={BenefitStatus.APPROVED}
                  checked={status === BenefitStatus.APPROVED}
                  onChange={(e) => setStatus(e.target.value as BenefitStatus)}
                  className="mr-2"
                />
                Approve
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={BenefitStatus.REJECTED}
                  checked={status === BenefitStatus.REJECTED}
                  onChange={(e) => setStatus(e.target.value as BenefitStatus)}
                  className="mr-2"
                />
                Reject
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={BenefitStatus.PENDING}
                  checked={status === BenefitStatus.PENDING}
                  onChange={(e) => setStatus(e.target.value as BenefitStatus)}
                  className="mr-2"
                />
                Pending
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={BenefitStatus.PAID}
                  checked={status === BenefitStatus.PAID}
                  onChange={(e) => setStatus(e.target.value as BenefitStatus)}
                  className="mr-2"
                />
                Paid
              </label>
            </div>
          </div>

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
            <Link href="/dashboard/payroll-execution/pre-initiation/termination-benefits">
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

