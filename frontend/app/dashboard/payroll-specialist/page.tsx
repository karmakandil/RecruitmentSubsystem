"use client";

import { useEffect, useState } from "react";
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
import {
  FileText,
  DollarSign,
  Briefcase,
  Gift,
  Users,
  Shield,
  FileCheck,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Calculator,
  Calendar,
  Eye,
  Send,
  Flag,
  Lock,
  Settings,
  Database,
  CheckCircle,
  Edit,
  RefreshCw,
  Receipt,
} from "lucide-react";

export default function PayrollSpecialistDashboardPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.PAYROLL_SPECIALIST);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Payroll Specialist Dashboard</h1>
        <p className="text-white mt-1">
          {mounted ? `Welcome, ${user?.fullName || "Specialist"}. Manage payroll configurations, processing, and execution workflows.` : 'Welcome. Manage payroll configurations, processing, and execution workflows.'}
        </p>
      </div>

      {/* ========== PAYROLL CONFIGURATION SECTION ========== */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          Payroll Configuration
        </h2>
        <p className="text-white mb-4">
          Configure company-level payroll policies, pay grades, allowances, tax rules, and benefits 
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* REQ-PY-1: Payroll Policies */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-7 w-7 text-blue-600" />
                <CardTitle className="text-xl font-bold">Payroll Policies</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-700 font-medium">
                Configure company-level payroll policies (create draft, edit draft, view all)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-configuration/policies"
                className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-semibold text-base"
              >
                Manage Policies →
              </Link>
            </CardContent>
          </Card>

          {/* REQ-PY-2: Pay Grades */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-7 w-7 text-purple-600" />
                <CardTitle className="text-xl font-bold">Pay Grades</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-700 font-medium">
                Define pay grades, salary, and compensation limits (create draft, edit draft, view all)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-configuration/pay-grades"
                className="block w-full text-center bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition font-semibold text-base"
              >
                Manage Pay Grades →
              </Link>
            </CardContent>
          </Card>

          {/* REQ-PY-5: Pay Types */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-indigo-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="h-7 w-7 text-indigo-600" />
                <CardTitle className="text-xl font-bold">Pay Types</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-700 font-medium">
                 Define employee pay types (hourly, daily, weekly, monthly, contract-based) (create draft, edit draft, view all)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-configuration/pay-types"
                className="block w-full text-center bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition font-semibold text-base"
              >
                Manage Pay Types →
              </Link>
            </CardContent>
          </Card>

          {/* REQ-PY-7: Allowances */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gift className="h-7 w-7 text-green-600" />
                <CardTitle className="text-xl font-bold">Allowances</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-700 font-medium">
                 Set allowances (transportation, housing, etc.) (create draft, edit draft, view all)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-configuration/allowances"
                className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-semibold text-base"
              >
                Manage Allowances →
              </Link>
            </CardContent>
          </Card>

          {/* REQ-PY-10: Tax Rules */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-red-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-7 w-7 text-red-600" />
                <CardTitle className="text-xl font-bold">Tax Rules</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-700 font-medium">
                Define tax rules and laws (progressive tax rates, exemptions, thresholds) (create draft, edit draft, view all)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-configuration/tax-rules"
                className="block w-full text-center bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition font-semibold text-base"
              >
                Manage Tax Rules →
              </Link>
            </CardContent>
          </Card>

          {/* REQ-PY-19: Signing Bonuses */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-7 w-7 text-amber-600" />
                <CardTitle className="text-xl font-bold">Signing Bonuses</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-700 font-medium">
                 Configure policies for signing bonuses (create draft, edit draft, view all)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-configuration/signing-bonuses"
                className="block w-full text-center bg-amber-600 text-white py-3 px-4 rounded-md hover:bg-amber-700 transition font-semibold text-base"
              >
                Manage Signing Bonuses →
              </Link>
            </CardContent>
          </Card>

          {/* REQ-PY-20: Termination Benefits */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-7 w-7 text-orange-600" />
                <CardTitle className="text-xl font-bold">Termination Benefits</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-700 font-medium">
                Configure resignation and termination benefits (create draft, edit draft, view all)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-configuration/termination-benefits"
                className="block w-full text-center bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition font-semibold text-base"
              >
                Manage Termination Benefits →
              </Link>
            </CardContent>
          </Card>

          {/* REQ-PY-21: Insurance Brackets */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-teal-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-7 w-7 text-teal-600" />
                <CardTitle className="text-xl font-bold">Insurance Brackets</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-700 font-medium">
                 Configure insurance brackets with salary ranges and contribution percentages (create draft, edit draft, view all)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-configuration/insurance-brackets"
                className="block w-full text-center bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition font-semibold text-base"
              >
                Manage Insurance Brackets →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ========== PAYROLL PROCESSING & EXECUTION SECTION ========== */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-white" />
          Payroll Processing & Execution
        </h2>
        <p className="text-white mb-4">
          Process payroll, calculate salaries, generate drafts, review, and send for approval 
        </p>

        {/* Pre-Initiation Phase */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3"> Pre-Initiation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Pre-Initiation Dashboard</CardTitle>
                <CardDescription>Review signing bonuses, termination benefits, and payroll period</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/pre-initiation"
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium text-sm"
                >
                  Open Dashboard →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg">Process Signing Bonuses</CardTitle>
                <CardDescription> Automatically process signing bonuses</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/process-signing-bonuses"
                  className="block w-full text-center bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition font-medium text-sm"
                >
                  Process Bonuses →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg">Process Termination Benefits</CardTitle>
                <CardDescription> Automatically process benefits upon resignation/termination</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/process-termination-benefits"
                  className="block w-full text-center bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition font-medium text-sm"
                >
                  Process Benefits →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg">Review Signing Bonuses</CardTitle>
                <CardDescription>Review and approve processed signing bonuses</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/pre-initiation/signing-bonuses"
                  className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition font-medium text-sm"
                >
                  Review Bonuses →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">Review Termination Benefits</CardTitle>
                <CardDescription> Review and approve processed benefits upon resignation</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/pre-initiation/termination-benefits"
                  className="block w-full text-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition font-medium text-sm"
                >
                  Review Benefits →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-lg">Edit Signing Bonuses</CardTitle>
                <CardDescription> Manually edit signing bonuses when needed</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/pre-initiation/signing-bonuses"
                  className="block w-full text-center bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition font-medium text-sm"
                >
                  Edit Bonuses →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="text-lg">Edit Termination Benefits</CardTitle>
                <CardDescription> Manually edit benefits upon resignation when needed</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/pre-initiation/termination-benefits"
                  className="block w-full text-center bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition font-medium text-sm"
                >
                  Edit Benefits →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Initiation Phase */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3">Payroll Initiation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">Process Initiation</CardTitle>
                <CardDescription> Automatically process payroll initiation</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/process-initiation"
                  className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition font-medium text-sm"
                >
                  Process Initiation →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Review Initiation</CardTitle>
                <CardDescription> Review and approve processed payroll initiation</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/review-initiation"
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium text-sm"
                >
                  Review Initiation →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-lg">Edit Initiation</CardTitle>
                <CardDescription> Manually edit payroll initiation when needed</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/review-initiation"
                  className="block w-full text-center bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition font-medium text-sm"
                >
                  Edit Initiation →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Calculation & Draft Generation */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3"> Calculation & Draft Generation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">Calculate Payroll</CardTitle>
                <CardDescription> Automatically calculate salaries, allowances, deductions, and contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/calculate-payroll"
                  className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition font-medium text-sm"
                >
                  Calculate →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg">Prorated Salary</CardTitle>
                <CardDescription> Calculate prorated salaries for mid-month hires/terminations</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/prorated-salary"
                  className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition font-medium text-sm"
                >
                  Calculate Prorated →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-lg">Apply Statutory Rules</CardTitle>
                <CardDescription> Auto-apply tax, pension, insurance, and labor law deductions</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/apply-statutory-rules"
                  className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition font-medium text-sm"
                >
                  Apply Rules →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg">Generate Draft</CardTitle>
                <CardDescription> Automatically generate draft payroll runs at end of each cycle</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/generate-draft"
                  className="block w-full text-center bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition font-medium text-sm"
                >
                  Generate Draft →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Review & Approval */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3"> Review & Approval</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg">Preview Dashboard</CardTitle>
                <CardDescription> Review system-generated payroll results in preview dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/preview"
                  className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition font-medium text-sm"
                >
                  View Preview →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg">Flag Irregularities</CardTitle>
                <CardDescription> Flag irregularities (salary spikes, missing bank accounts, negative net pay)</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/flag-irregularities"
                  className="block w-full text-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition font-medium text-sm"
                >
                  Flag Irregularities →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-cyan-200">
              <CardHeader>
                <CardTitle className="text-lg">Send for Approval</CardTitle>
                <CardDescription> Send payroll run for Manager and Finance approval before finalization</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/send-for-approval"
                  className="block w-full text-center bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition font-medium text-sm"
                >
                  Send for Approval →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payslip Generation */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-3"> Payslip Generation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-lg">Generate Payslips</CardTitle>
                <CardDescription>Automatically generate and distribute payslips (PDF, email, portal)</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/payslips/generate"
                  className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition font-medium text-sm"
                >
                  Generate Payslips →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-teal-200">
              <CardHeader>
                <CardTitle className="text-lg">View Payslips</CardTitle>
                <CardDescription>View and manage all generated employee payslips</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-execution/payslips"
                  className="block w-full text-center bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition font-medium text-sm"
                >
                  View Payslips →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ========== PAYROLL TRACKING SECTION ========== */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          Payroll Tracking
        </h2>
        <p className="text-white mb-4">
          Review and approve employee disputes and claims, generate reports, and track payroll status 
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-2 border-red-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-7 w-7 text-red-600" />
                <CardTitle className="text-xl font-bold">Pending Disputes</CardTitle>
              </div>
              <CardDescription> Approve/reject disputes (escalate to manager if approved)</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-tracking/pending-disputes"
                className="block w-full text-center bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition font-medium"
              >
                Review Disputes →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileCheck className="h-7 w-7 text-orange-600" />
                <CardTitle className="text-xl font-bold">Pending Claims</CardTitle>
              </div>
              <CardDescription> Approve/reject expense claims (escalate to manager if approved)</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-tracking/pending-claims"
                className="block w-full text-center bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition font-medium"
              >
                Review Claims →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-7 w-7 text-blue-600" />
                <CardTitle className="text-xl font-bold">Department Reports</CardTitle>
              </div>
              <CardDescription> Generate payroll reports by department</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-tracking/department-reports"
                className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-medium"
              >
                View Reports →
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-7 w-7 text-green-600" />
                <CardTitle className="text-xl font-bold">Track Status</CardTitle>
              </div>
              <CardDescription>Track claims, disputes, and refunds status</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/dashboard/payroll-tracking/tracking"
                className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-medium"
              >
                Track Status →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
