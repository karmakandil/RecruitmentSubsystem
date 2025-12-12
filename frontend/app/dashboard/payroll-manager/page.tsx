"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { useEffect, useState } from "react";
import { payslipsApi } from "@/lib/api/payroll-tracking/payroll-tracking";

export default function PayrollManagerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  useRequireAuth(SystemRole.PAYROLL_MANAGER);
  
  const [pendingClaimsCount, setPendingClaimsCount] = useState<number | null>(null);
  const [pendingDisputesCount, setPendingDisputesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [claims, disputes] = await Promise.all([
          payslipsApi.getPendingClaims().catch((err) => {
            console.error("Failed to fetch pending claims:", err);
            return [];
          }),
          payslipsApi.getPendingDisputes().catch((err) => {
            console.error("Failed to fetch pending disputes:", err);
            return [];
          }),
        ]);
        // Filter to only show items pending manager approval
        const claimsPendingManager = (claims || []).filter(
          (c: any) => c.status === "pending payroll Manager approval"
        );
        const disputesPendingManager = (disputes || []).filter(
          (d: any) => d.status === "pending payroll Manager approval"
        );
        setPendingClaimsCount(claimsPendingManager.length);
        setPendingDisputesCount(disputesPendingManager.length);
      } catch (err: any) {
        console.error("Failed to load counts:", err);
        setPendingClaimsCount(0);
        setPendingDisputesCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payroll Manager Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome, {user?.fullName || "Payroll Manager"}. Confirm approvals for claims and disputes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Pending Claim Confirmations</CardTitle>
            <CardDescription>Confirm claims approved by specialists</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  {pendingClaimsCount === 0
                    ? "No claims awaiting your confirmation."
                    : `${pendingClaimsCount} claim${pendingClaimsCount !== 1 ? "s" : ""} awaiting your confirmation.`}
                </p>
                {pendingClaimsCount !== null && pendingClaimsCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                      {pendingClaimsCount} Pending
                    </span>
                  </div>
                )}
              </>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/payroll-tracking/manager-claims")}
            >
              Review Claims
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Pending Dispute Confirmations</CardTitle>
            <CardDescription>Confirm disputes approved by specialists</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  {pendingDisputesCount === 0
                    ? "No disputes awaiting your confirmation."
                    : `${pendingDisputesCount} dispute${pendingDisputesCount !== 1 ? "s" : ""} awaiting your confirmation.`}
                </p>
                {pendingDisputesCount !== null && pendingDisputesCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                      {pendingDisputesCount} Pending
                    </span>
                  </div>
                )}
              </>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/payroll-tracking/manager-disputes")}
            >
              Review Disputes
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
            <CardDescription>Generate payroll reports by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Access department-specific payroll reports and summaries.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/payroll-tracking/department-reports")}
            >
              Generate Department Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>All Claims</CardTitle>
            <CardDescription>View all expense claims</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Browse all expense claims regardless of status.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/payroll-tracking/claims")}
            >
              View All Claims
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>All Disputes</CardTitle>
            <CardDescription>View all payroll disputes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Browse all payroll disputes regardless of status.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/payroll-tracking/disputes")}
            >
              View All Disputes
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

