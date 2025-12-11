"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { useRouter } from "next/navigation";

export default function PayrollSelectionPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
        <p className="text-gray-600 mt-1">Select a payroll module to access</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payroll Configuration */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/payroll-configuration")}>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">⚙️</div>
              <CardTitle className="text-xl">Payroll Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure payroll settings, pay grades, and payroll rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Manage pay grades, allowances, deductions, tax rules, and other payroll configurations.
            </p>
            <Button className="w-full" onClick={(e) => { e.stopPropagation(); router.push("/dashboard/payroll-configuration"); }}>
              Go to Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Payroll Execution */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/payroll-execution")}>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">💼</div>
              <CardTitle className="text-xl">Payroll Execution</CardTitle>
            </div>
            <CardDescription>
              Execute payroll runs and process payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Create payroll runs, calculate salaries, generate payslips, and process payments.
            </p>
            <Button className="w-full" onClick={(e) => { e.stopPropagation(); router.push("/dashboard/payroll-execution"); }}>
              Go to Execution
            </Button>
          </CardContent>
        </Card>

        {/* Payroll Tracking */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/payroll-tracking")}>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">📊</div>
              <CardTitle className="text-xl">Payroll Tracking</CardTitle>
            </div>
            <CardDescription>
              View payslips, track claims, disputes, and refunds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Access your payslips, submit expense claims, dispute payroll errors, and track reimbursement status.
            </p>
            <Button className="w-full" onClick={(e) => { e.stopPropagation(); router.push("/dashboard/payroll-tracking"); }}>
              Go to Tracking
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

