"use client";

import Link from "next/link";
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

export default function PayrollManagerDashboardPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.PAYROLL_MANAGER);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payroll Manager Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome, {user?.fullName || "Manager"}. Review and approve payroll runs, resolve exceptions, and manage payroll execution.
        </p>
      </div>

      {/* Approval Queue */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Approval Queue
        </h2>
        <p className="text-gray-600 mb-4">
          Review and approve payroll runs pending your approval
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Review payroll runs awaiting manager approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/approval/manager"
                className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-medium"
              >
                View Pending Approvals →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
            <CardHeader>
              <CardTitle>Approve Payroll</CardTitle>
              <CardDescription>
                Review and approve payroll runs submitted for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/approval/manager/review"
                className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-medium"
              >
                Review & Approve →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
              <CardDescription>
                View previously approved or rejected payroll runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/approval/manager/history"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                View History →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Exception Resolution */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Exception Resolution
        </h2>
        <p className="text-gray-600 mb-4">
          Resolve escalated irregularities and exceptions in payroll runs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-2 border-red-200">
            <CardHeader>
              <CardTitle>Resolve Irregularities</CardTitle>
              <CardDescription>
                Resolve escalated irregularities flagged by specialists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/approval/manager/resolve"
                className="block w-full text-center bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition font-medium"
              >
                Resolve Issues →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>View Exceptions</CardTitle>
              <CardDescription>
                View all exceptions and irregularities in payroll runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/review/exceptions"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                View Exceptions →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Employee Exceptions</CardTitle>
              <CardDescription>
                View exceptions for specific employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/review/employee-exceptions"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Employee Exceptions →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payroll Lock Management */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Payroll Lock Management
        </h2>
        <p className="text-gray-600 mb-4">
          Lock or unlock payroll runs after finance approval
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-2 border-yellow-200">
            <CardHeader>
              <CardTitle>Lock Payroll</CardTitle>
              <CardDescription>
                Lock finalized payroll runs after finance approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/approval/manager/lock"
                className="block w-full text-center bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition font-medium"
              >
                Lock Payroll →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Unlock Payroll</CardTitle>
              <CardDescription>
                Unlock payroll runs with reason if modifications needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/approval/manager/unlock"
                className="block w-full text-center bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition font-medium"
              >
                Unlock Payroll →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Locked Payrolls</CardTitle>
              <CardDescription>
                View all locked payroll runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/approval/manager/locked"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                View Locked →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review & Preview */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Review & Preview
        </h2>
        <p className="text-gray-600 mb-4">
          Review payroll runs and preview calculations
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-2 border-purple-200">
            <CardHeader>
              <CardTitle>Preview Dashboard</CardTitle>
              <CardDescription>
                Review system-generated payroll results in preview dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/review"
                className="block w-full text-center bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition font-medium"
              >
                View Preview →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Review Payroll Runs</CardTitle>
              <CardDescription>
                Review payroll runs and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/review"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Review Runs →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Pre-Initiation Status</CardTitle>
              <CardDescription>
                View pre-initiation validation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/pre-initiation"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                View Status →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>
                View complete payroll history and audit trail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/history"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                View History →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate payroll reports and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/reports"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                View Reports →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>
                View and manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/employee-profile/my-profile"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                My Profile →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>
                View team members and organization structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/employee-profile/team"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                View Team →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

