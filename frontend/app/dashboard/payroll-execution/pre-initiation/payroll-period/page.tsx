"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../../components/shared/ui/Button";
import PayrollPeriodReviewForm from "../../../../../components/payroll-execution/PayrollPeriodReviewForm";
import { payrollExecutionApi } from "../../../../../lib/api/payroll-execution/payroll-execution";
import { PreInitiationStatus, PayrollRun } from "../../../../../types/payroll-execution";

export default function PayrollPeriodPage() {
  const router = useRouter();
  const [status, setStatus] = useState<PreInitiationStatus | null>(null);
  const [payrollRun, setPayrollRun] = useState<PayrollRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const validationStatus = await payrollExecutionApi.getPreInitiationValidationStatus();
      setStatus(validationStatus);

      // If there's a payroll run ID, fetch the full payroll run details
      if (validationStatus.payrollPeriod.payrollRunId) {
        // Note: This endpoint may need to be added to the API client
        // For now, we'll construct a basic PayrollRun object from the status
        const run: PayrollRun = {
          _id: validationStatus.payrollPeriod.payrollRunId,
          runId: validationStatus.payrollPeriod.payrollRunId,
          payrollPeriod: validationStatus.payrollPeriod.period || "",
          entity: "",
          employees: 0,
          totalnetpay: 0,
          status: validationStatus.payrollPeriod.status as any,
          paymentStatus: "PENDING" as any,
          payrollSpecialistId: "",
          createdAt: "",
          updatedAt: "",
        };
        setPayrollRun(run);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch payroll period information");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchData();
  };

  const handleCancel = () => {
    router.push("/dashboard/payroll-execution/pre-initiation");
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
        <Link href="/dashboard/payroll-execution/pre-initiation">
          <Button className="bg-gray-500 hover:bg-gray-600">Back</Button>
        </Link>
      </div>
    );
  }

  if (!status || !payrollRun) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <p className="text-gray-600 mb-4">
            No payroll period found. Please create a payroll initiation first.
          </p>
          <Link href="/dashboard/payroll-execution/pre-initiation">
            <Button className="bg-gray-500 hover:bg-gray-600">Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/payroll-execution/pre-initiation">
          <Button className="bg-gray-500 hover:bg-gray-600 mb-4">← Back</Button>
        </Link>
        <h1 className="text-3xl font-bold">Review Payroll Period</h1>
      </div>

      <PayrollPeriodReviewForm
        payrollRun={payrollRun}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}

