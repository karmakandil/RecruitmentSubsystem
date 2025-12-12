"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated (only after mount to prevent hydration issues)
  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [mounted, loading, isAuthenticated, router]);

  // Show loading while checking auth
  if (!mounted || loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Check if user has access to Finance Dashboard
  const hasFinanceAccess = user?.roles?.some(
    (role) => role === SystemRole.FINANCE_STAFF || role === SystemRole.SYSTEM_ADMIN
  );
  
  // Check if user has access to Payroll Manager Dashboard
  const hasPayrollManagerAccess = user?.roles?.some(
    (role) => role === SystemRole.PAYROLL_MANAGER || role === SystemRole.SYSTEM_ADMIN
  );
  
  // Check if user has access to Payroll Specialist Dashboard
  const hasPayrollSpecialistAccess = user?.roles?.some(
    (role) => role === SystemRole.PAYROLL_SPECIALIST || role === SystemRole.SYSTEM_ADMIN
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mt-1">Welcome {user?.fullName}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Employee Profile</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/employee-profile" className="text-blue-600 hover:underline">
              Open Employee Profile
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payroll</CardTitle>
            <CardDescription>View payslips and salary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/payroll" className="text-blue-600 hover:underline block">
              Open Payroll
            </Link>
            {hasPayrollManagerAccess && (
              <Link href="/dashboard/payroll-manager" className="text-blue-600 hover:underline block">
                Payroll Manager Dashboard
              </Link>
            )}
            {hasPayrollSpecialistAccess && (
              <Link href="/dashboard/payroll-specialist" className="text-blue-600 hover:underline block">
                Payroll Specialist Dashboard
              </Link>
            )}
            {hasFinanceAccess && (
              <Link href="/dashboard/finance" className="text-blue-600 hover:underline block">
                Finance Dashboard
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaves</CardTitle>
            <CardDescription>Request and track leave</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/leaves" className="text-blue-600 hover:underline">
              Open Leaves
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>System administration tools</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/admin" className="text-blue-600 hover:underline">
              Admin Console
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
