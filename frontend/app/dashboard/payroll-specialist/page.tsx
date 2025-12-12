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

export default function PayrollSpecialistDashboardPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payroll Specialist Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome, {user?.fullName || "Specialist"}. Manage payroll execution and processing workflows.
        </p>
      </div>

      {/* Pre-Initiation Phase */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Phase 0: Pre-Initiation Reviews
        </h2>
        <p className="text-gray-600 mb-4">
          Review and approve pending items before initiating payroll runs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Pre-Initiation Dashboard</CardTitle>
              <CardDescription>
                Review signing bonuses, termination benefits, and payroll period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/pre-initiation"
                className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-medium"
              >
                Open Pre-Initiation →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Signing Bonuses</CardTitle>
              <CardDescription>
                Review and approve employee signing bonuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/pre-initiation/signing-bonuses"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Review Bonuses →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Termination Benefits</CardTitle>
              <CardDescription>
                Review and approve termination/resignation benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/pre-initiation/termination-benefits"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Review Benefits →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Payroll Period</CardTitle>
              <CardDescription>
                Review and approve payroll period for initiation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/pre-initiation/payroll-period"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Review Period →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payroll Initiation Phase */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Phase 1: Payroll Initiation
        </h2>
        <p className="text-gray-600 mb-4">
          Process payroll initiation and create new payroll runs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
            <CardHeader>
              <CardTitle>Process Initiation</CardTitle>
              <CardDescription>
                Create a new payroll run for a specific period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/initiation/create"
                className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-medium"
              >
                Create Payroll Run →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Review Initiation</CardTitle>
              <CardDescription>
                Review and approve processed payroll initiation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/initiation"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Review Initiation →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Generate Draft</CardTitle>
              <CardDescription>
                Generate draft payroll run with calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/draft/generate"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Generate Draft →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payroll Review Phase */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Phase 2: Payroll Review & Exceptions
        </h2>
        <p className="text-gray-600 mb-4">
          Review draft payroll, flag exceptions, and prepare for approval
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
              <CardTitle>Flag Exceptions</CardTitle>
              <CardDescription>
                Flag payroll irregularities and exceptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/review/exceptions"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Manage Exceptions →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Detect Irregularities</CardTitle>
              <CardDescription>
                Auto-detect salary spikes, missing accounts, negative net pay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/review/irregularities"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Detect Issues →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Send for Approval</CardTitle>
              <CardDescription>
                Send payroll run for manager and finance approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/review/send-approval"
                className="block w-full text-center bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition font-medium"
              >
                Send for Approval →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payroll Execution Phase */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Phase 4: Payslip Generation
        </h2>
        <p className="text-gray-600 mb-4">
          Generate and distribute employee payslips after approval
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-2 border-indigo-200">
            <CardHeader>
              <CardTitle>Generate Payslips</CardTitle>
              <CardDescription>
                Generate and distribute payslips (PDF, Email, Portal)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/payslips/generate"
                className="block w-full text-center bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition font-medium"
              >
                Generate Payslips →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Payslip History</CardTitle>
              <CardDescription>
                View generated payslips and distribution history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/payslips"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                View Payslips →
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
              <CardTitle>Calculate Payroll</CardTitle>
              <CardDescription>
                Calculate salaries, allowances, deductions, and contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/calculate"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Calculate →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Prorated Salary</CardTitle>
              <CardDescription>
                Calculate prorated salaries for mid-month hires/terminations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/prorated"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Calculate Prorated →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Apply Statutory Rules</CardTitle>
              <CardDescription>
                Auto-apply tax, pension, insurance, and labor law deductions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-execution/statutory"
                className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
              >
                Apply Rules →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>
                View payroll history and audit trail
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
        </div>
      </div>
    </div>
  );
}