"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { useEffect, useState } from "react";
import { payslipsApi } from "@/lib/api/payroll-tracking/payroll-tracking";

export default function PayrollSpecialistDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST);
  
  const [pendingClaimsCount, setPendingClaimsCount] = useState<number | null>(null);
  const [pendingDisputesCount, setPendingDisputesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [claims, disputes] = await Promise.all([
          payslipsApi.getPendingClaims(),
          payslipsApi.getPendingDisputes(),
        ]);
        setPendingClaimsCount(claims?.length || 0);
        setPendingDisputesCount(disputes?.length || 0);
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
        <h1 className="text-3xl font-bold text-gray-900">Payroll Specialist Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome, {user?.fullName || "Payroll Specialist"}. Review and process claims and disputes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Pending Claims</CardTitle>
            <CardDescription>Review expense claims awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  {pendingClaimsCount === 0
                    ? "No pending claims at this time."
                    : `${pendingClaimsCount} claim${pendingClaimsCount !== 1 ? "s" : ""} awaiting review.`}
                </p>
                {pendingClaimsCount !== null && pendingClaimsCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">
                      {pendingClaimsCount} Pending
                    </span>
                  </div>
                )}
              </>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/payroll-tracking/pending-claims")}
            >
              Review Claims
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Pending Disputes</CardTitle>
            <CardDescription>Review payroll disputes awaiting investigation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  {pendingDisputesCount === 0
                    ? "No pending disputes at this time."
                    : `${pendingDisputesCount} dispute${pendingDisputesCount !== 1 ? "s" : ""} awaiting review.`}
                </p>
                {pendingDisputesCount !== null && pendingDisputesCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">
                      {pendingDisputesCount} Pending
                    </span>
                  </div>
                )}
              </>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/payroll-tracking/pending-disputes")}
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

