"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { useEffect, useState } from "react";
import { leavesApi } from "@/lib/api/leaves/leaves";
import type { LeaveRequest } from "@/types/leaves";

export default function PayrollManagerDashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { isLoading: isAuthLoading } = useRequireAuth(SystemRole.PAYROLL_MANAGER);

  // Delegated pending requests for Payroll Manager (exclude own requests)
  const [delegatedPendingRequests, setDelegatedPendingRequests] = useState<
    LeaveRequest[]
  >([]);
  const [loadingDelegated, setLoadingDelegated] = useState(false);
  const hasDelegated = delegatedPendingRequests.length > 0;

  useEffect(() => {
    const fetchDelegatedForPayrollManager = async () => {
      if (!user) return;

      const userId =
        (user as any)._id || (user as any).userId || (user as any).id;
      if (!userId) return;

      setLoadingDelegated(true);
      try {
        // Ask backend for pending requests for this user as manager/delegate
        const requests = await leavesApi.getEmployeeLeaveRequests(userId, {
          status: "pending",
        });

        const normalizedUserId = userId.toString();

        const filtered: LeaveRequest[] = Array.isArray(requests)
          ? requests.filter((req: any) => {
              if (req.status?.toLowerCase() !== "pending") return false;

              // Normalize employeeId from the request (can be string or populated object)
              const rawEmployeeId: any = req.employeeId;
              let employeeIdStr: string | null = null;

              if (typeof rawEmployeeId === "string") {
                employeeIdStr = rawEmployeeId;
              } else if (rawEmployeeId && typeof rawEmployeeId === "object") {
                employeeIdStr =
                  rawEmployeeId._id ||
                  rawEmployeeId.id ||
                  (typeof rawEmployeeId.toString === "function"
                    ? rawEmployeeId.toString()
                    : null);
              }

              // Exclude Payroll Manager's own requests from delegated list
              if (employeeIdStr && employeeIdStr === normalizedUserId) {
                return false;
              }

              return true;
            })
          : [];

        setDelegatedPendingRequests(filtered);
      } catch (err) {
        console.error("Failed to load delegated pending requests for Payroll Manager:", err);
        setDelegatedPendingRequests([]);
      } finally {
        setLoadingDelegated(false);
      }
    };

    fetchDelegatedForPayrollManager();
  }, [user]);

  // Show loading state while checking authentication
  // Don't render until auth is fully checked to prevent redirect flicker
  if (loading || isAuthLoading || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Double-check that user has the required role before rendering
  const hasPayrollManagerRole = user?.roles?.includes(SystemRole.PAYROLL_MANAGER);
  if (!hasPayrollManagerRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Payroll Manager Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome, {user?.fullName || "Manager"}. Manage payroll operations and team leave data.
        </p>
      </div>

      {/* Payroll Operations Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Payroll Operations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Payroll Configuration</CardTitle>
              <CardDescription>
                Configure pay grades, tax rules, and payroll settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-configuration"
                className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-medium"
              >
                Manage Configuration
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
            <CardHeader>
              <CardTitle>Payroll Tracking</CardTitle>
              <CardDescription>
                View payslips, claims, disputes, and refunds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll"
                className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-medium"
              >
                View Payroll
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leave Management Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Leave Management
        </h2>

        {/* Delegated Pending Requests banner for Payroll Manager */}
        {hasDelegated && (
          <Card className="mb-6 border-2 border-orange-300 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900">
                Delegated Pending Leave Requests
              </CardTitle>
              <CardDescription className="text-orange-700">
                You have been delegated{" "}
                <span className="font-semibold">
                  {delegatedPendingRequests.length} pending request
                  {delegatedPendingRequests.length !== 1 ? "s" : ""}
                </span>{" "}
                to review and approve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="border-orange-500 text-orange-700 hover:bg-orange-100"
                onClick={() => router.push("/dashboard/leaves/requests/review")}
                disabled={loadingDelegated}
              >
                View Delegated Requests
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
            <CardHeader>
              <CardTitle>View & Create Leave Requests</CardTitle>
              <CardDescription>
                View your leave balance, filter your requests, and create new leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/leaves/requests"
                className="block w-full text-center bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition font-medium"
              >
                My Leave Requests
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Review & Approve Requests</CardTitle>
              <CardDescription>
                Review and approve/reject leave requests from your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/leaves/requests/review"
                className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-medium"
              >
                Review Requests
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-teal-200">
            <CardHeader>
              <CardTitle>View Team Leave Balances</CardTitle>
              <CardDescription>
                View leave balances and upcoming leaves for your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/leaves/team-balances"
                className="block w-full text-center bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition font-medium"
              >
                View Team Balances
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-cyan-200">
            <CardHeader>
              <CardTitle>Manage Team Leave Data</CardTitle>
              <CardDescription>
                Filter and manage leave data for your team members with advanced filtering options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/leaves/team-management"
                className="block w-full text-center bg-cyan-600 text-white py-3 px-4 rounded-md hover:bg-cyan-700 transition font-medium"
              >
                Manage Team Data
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

