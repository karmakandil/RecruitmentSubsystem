"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";

export default function FinanceDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  useRequireAuth(SystemRole.FINANCE_STAFF);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome, {user?.fullName || "Finance Staff"}. Manage refunds, approved claims, and disputes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Approved Claims</CardTitle>
            <CardDescription>Review approved claims ready for reimbursement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              View claims that have passed manager approval and are ready for finance processing.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/finance/approved-claims")}
            >
              Open Claims
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Approved Disputes</CardTitle>
            <CardDescription>Process disputes approved for reimbursement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Review disputes that are approved and verify refund amounts before payment.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/finance/approved-disputes")}
            >
              Open Disputes
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Refunds</CardTitle>
            <CardDescription>Track pending and paid refunds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Monitor pending refunds and confirm payments processed in payroll runs.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/payroll-tracking/tracking")}
            >
              Track Refunds
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Payroll Modules</CardTitle>
            <CardDescription>Access payroll configuration, execution, and tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Jump to any payroll module to configure, execute, or review payroll results.
            </p>
            <Button className="w-full" onClick={() => router.push("/dashboard/payroll")}>
              Go to Payroll Modules
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Review payroll-related reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Access payroll run summaries, deductions, and reimbursement reports.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/finance/reports")}
            >
              Open Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}