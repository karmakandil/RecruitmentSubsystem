"use client";

import { useState } from "react";
import { Button } from "../shared/ui/Button";
import { Card } from "../shared/ui/Card";
import {
  TerminationBenefitReviewDto,
  BenefitStatus,
  EmployeeTerminationBenefit,
} from "../../types/payroll-execution";
import { payrollExecutionApi } from "../../lib/api/payroll-execution/payroll-execution";

interface TerminationBenefitReviewFormProps {
  terminationBenefit: EmployeeTerminationBenefit;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TerminationBenefitReviewForm({
  terminationBenefit,
  onSuccess,
  onCancel,
}: TerminationBenefitReviewFormProps) {
  const [status, setStatus] = useState<BenefitStatus>(
    terminationBenefit.status || BenefitStatus.PENDING
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const reviewDto: TerminationBenefitReviewDto = {
        employeeTerminationResignationId: terminationBenefit._id,
        status,
      };

      await payrollExecutionApi.reviewTerminationBenefit(reviewDto);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to review termination benefit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTerminationType = () => {
    if (terminationBenefit.terminationId && typeof terminationBenefit.terminationId === "object" && terminationBenefit.terminationId !== null) {
      return terminationBenefit.terminationId.type;
    }
    return "Unknown";
  };

  const getTerminationReason = () => {
    if (terminationBenefit.terminationId && typeof terminationBenefit.terminationId === "object" && terminationBenefit.terminationId !== null) {
      return terminationBenefit.terminationId.reason;
    }
    return "N/A";
  };

  const getBenefitName = () => {
    if (terminationBenefit.benefitId && typeof terminationBenefit.benefitId === "object" && terminationBenefit.benefitId !== null) {
      return terminationBenefit.benefitId.name;
    }
    return "Unknown";
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Review Termination Benefit</h2>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Employee Name
            </label>
            <p className="text-gray-700">
              {terminationBenefit.employeeId && typeof terminationBenefit.employeeId === "object" && terminationBenefit.employeeId !== null
                ? `${terminationBenefit.employeeId.firstName || ""} ${terminationBenefit.employeeId.lastName || ""}`.trim() || "N/A"
                : typeof terminationBenefit.employeeId === "string"
                ? `Employee ID: ${terminationBenefit.employeeId}`
                : "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Employee ID
            </label>
            <p className="text-gray-700">
              {terminationBenefit.employeeId && typeof terminationBenefit.employeeId === "object" && terminationBenefit.employeeId !== null
                ? terminationBenefit.employeeId.employeeNumber || (terminationBenefit.employeeId._id ? String(terminationBenefit.employeeId._id) : "N/A")
                : typeof terminationBenefit.employeeId === "string"
                ? terminationBenefit.employeeId
                : "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Termination Type
            </label>
            <p className="text-gray-700">{getTerminationType()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Benefit Name
            </label>
            <p className="text-gray-700">{getBenefitName()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Given Amount
            </label>
            <p className="text-gray-700">
              ${terminationBenefit.givenAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Termination Reason
            </label>
            <p className="text-gray-700">{getTerminationReason()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Status
            </label>
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
          </div>
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
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

