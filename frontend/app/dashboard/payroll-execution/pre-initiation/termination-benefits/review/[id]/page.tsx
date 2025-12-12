"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../../../../components/shared/ui/Button";
import TerminationBenefitReviewForm from "../../../../../../../components/payroll-execution/TerminationBenefitReviewForm";
import { payrollExecutionApi } from "../../../../../../../lib/api/payroll-execution/payroll-execution";
import { EmployeeTerminationBenefit } from "../../../../../../../types/payroll-execution";

export default function TerminationBenefitReviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [terminationBenefit, setTerminationBenefit] = useState<EmployeeTerminationBenefit | null>(null);
  const [loading, setLoading] = useState(true);
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
    } catch (err: any) {
      setError(err.message || "Failed to fetch termination benefit");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push("/dashboard/payroll-execution/pre-initiation/termination-benefits");
  };

  const handleCancel = () => {
    router.push("/dashboard/payroll-execution/pre-initiation/termination-benefits");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Termination benefit not found</div>
        <Link href="/dashboard/payroll-execution/pre-initiation/termination-benefits">
          <Button className="mt-4 bg-gray-500 hover:bg-gray-600">Back to List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/payroll-execution/pre-initiation/termination-benefits">
          <Button className="bg-gray-500 hover:bg-gray-600 mb-4">← Back to List</Button>
        </Link>
        <h1 className="text-3xl font-bold">Review Termination Benefit</h1>
      </div>

      <TerminationBenefitReviewForm
        terminationBenefit={terminationBenefit}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}

