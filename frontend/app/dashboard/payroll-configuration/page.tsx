"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { SystemRole } from "@/types";
import {
  FileText,
  DollarSign,
  Calendar,
  Gift,
  Briefcase,
  Shield,
  Scale,
  Settings,
  Database,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export default function PayrollConfigurationPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  // Protect route - only allow roles that have access to payroll configuration
  useRequireAuth(
    [
      SystemRole.PAYROLL_SPECIALIST,
      SystemRole.PAYROLL_MANAGER,
      SystemRole.SYSTEM_ADMIN,
      SystemRole.HR_MANAGER,
      SystemRole.HR_ADMIN,
      SystemRole.LEGAL_POLICY_ADMIN,
      SystemRole.DEPARTMENT_EMPLOYEE, // View-only access
      SystemRole.DEPARTMENT_HEAD, // View-only access
    ],
    '/dashboard'
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasPayrollAccess = user?.roles?.some(
    (role) =>
      role === SystemRole.PAYROLL_SPECIALIST ||
      role === SystemRole.PAYROLL_MANAGER ||
      role === SystemRole.SYSTEM_ADMIN ||
      role === SystemRole.HR_MANAGER ||
      role === SystemRole.LEGAL_POLICY_ADMIN
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payroll Configuration</h1>
        <p className="text-gray-600 mt-1">
          {mounted ? `Welcome, ${user?.fullName || "User"}. Manage payroll policies, pay grades, allowances, and system settings` : 'Welcome. Manage payroll policies, pay grades, allowances, and system settings'}
        </p>
      </div>

      {/* Payroll Specialist Configuration Section */}
      {mounted && user?.roles?.includes(SystemRole.PAYROLL_SPECIALIST) && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Configuration Management
          </h2>
          <p className="text-gray-600 mb-4">
            Create, edit, and manage payroll configurations (draft, edit, view all)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <CardTitle>Payroll Policies</CardTitle>
                </div>
                <CardDescription>Configure company-level payroll policies (salary types, misconduct penalties, leave policies, allowances)</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/policies"
                  className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition font-medium"
                >
                  Manage Policies →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <CardTitle>Pay Grades</CardTitle>
                </div>
                <CardDescription>Define pay grades, salary, and compensation limits for department and position</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/pay-grades"
                  className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition font-medium"
                >
                  Manage Pay Grades →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <CardTitle>Pay Types</CardTitle>
                </div>
                <CardDescription>Define employee pay types (hourly, daily, weekly, monthly, contract-based)</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/pay-types"
                  className="block w-full text-center bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition font-medium"
                >
                  Manage Pay Types →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-indigo-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Gift className="h-6 w-6 text-indigo-600" />
                  <CardTitle>Allowances</CardTitle>
                </div>
                <CardDescription>Set allowances (transportation, housing, etc.) for special conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/allowances"
                  className="block w-full text-center bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition font-medium"
                >
                  Manage Allowances →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-yellow-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-yellow-600" />
                  <CardTitle>Signing Bonuses</CardTitle>
                </div>
                <CardDescription>Configure policies for signing bonuses for new hires</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/signing-bonuses"
                  className="block w-full text-center bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition font-medium"
                >
                  Manage Signing Bonuses →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-red-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-red-600" />
                  <CardTitle>Termination Benefits</CardTitle>
                </div>
                <CardDescription>Configure resignation and termination benefits and their terms</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/termination-benefits"
                  className="block w-full text-center bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition font-medium"
                >
                  Manage Termination Benefits →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-cyan-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-cyan-600" />
                  <CardTitle>Insurance Brackets</CardTitle>
                </div>
                <CardDescription>Configure insurance brackets with salary ranges and contribution percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/insurance-brackets"
                  className="block w-full text-center bg-cyan-600 text-white py-3 px-4 rounded-md hover:bg-cyan-700 transition font-medium"
                >
                  Manage Insurance Brackets →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Legal Admin - Tax Rules */}
      {mounted && user?.roles?.includes(SystemRole.LEGAL_POLICY_ADMIN) && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Legal & Policy Administration
          </h2>
          <p className="text-gray-600 mb-4">
            Define and update tax rules and legal regulations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-orange-600" />
                  <CardTitle>Tax Rules</CardTitle>
                </div>
                <CardDescription>Define tax rules and laws (progressive tax rates, exemptions, thresholds)</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/tax-rules"
                  className="block w-full text-center bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition font-medium"
                >
                  Manage Tax Rules →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Payroll Manager - Approvals */}
      {mounted && user?.roles?.includes(SystemRole.PAYROLL_MANAGER) && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Configuration Approval
          </h2>
          <p className="text-gray-600 mb-4">
            Review and approve payroll module configuration changes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-2 border-teal-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                  <CardTitle>Approval Dashboard</CardTitle>
                </div>
                <CardDescription>Review and approve pending configurations (edit and approve, delete except insurance)</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/approvals"
                  className="block w-full text-center bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition font-medium"
                >
                  View Pending Approvals →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-violet-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-violet-600" />
                  <CardTitle>Configuration Statistics</CardTitle>
                </div>
                <CardDescription>View overview and statistics of all configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/stats"
                  className="block w-full text-center bg-violet-600 text-white py-3 px-4 rounded-md hover:bg-violet-700 transition font-medium"
                >
                  View Statistics →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* HR Manager - Insurance Oversight */}
      {mounted && user?.roles?.includes(SystemRole.HR_MANAGER) && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Insurance Oversight
          </h2>
          <p className="text-gray-600 mb-4">
            Review and update insurance bracket configurations when policies or regulations change
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-2 border-pink-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-pink-600" />
                  <CardTitle>Insurance Oversight</CardTitle>
                </div>
                <CardDescription>Review, approve/reject, view, edit, and delete insurance brackets</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/insurance-oversight"
                  className="block w-full text-center bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 transition font-medium"
                >
                  Manage Insurance Oversight →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* System Admin - Settings & Backup */}
      {mounted && user?.roles?.includes(SystemRole.SYSTEM_ADMIN) && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            System Administration
          </h2>
          <p className="text-gray-600 mb-4">
            Configure company-wide settings and manage system backups
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-2 border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-slate-600" />
                  <CardTitle>Company Settings</CardTitle>
                </div>
                <CardDescription>Set company-wide settings (pay dates, time zone, currency)</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/company-settings"
                  className="block w-full text-center bg-slate-600 text-white py-3 px-4 rounded-md hover:bg-slate-700 transition font-medium"
                >
                  Manage Company Settings →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-6 w-6 text-gray-600" />
                  <CardTitle>Backup Management</CardTitle>
                </div>
                <CardDescription>Back up data regularly so nothing is lost</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/payroll-configuration/backup"
                  className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition font-medium"
                >
                  Manage Backups →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
