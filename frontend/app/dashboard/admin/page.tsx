"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.HR_ADMIN);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome, {user?.fullName || "Admin"}. Choose a section to manage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leaves Management</CardTitle>
            <CardDescription>
              Configure and manage leave policies, types, entitlements, and calendars
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/leaves"
              className="text-blue-600 hover:underline font-medium inline-flex items-center gap-2"
            >
              Open Leaves Management →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Profiles</CardTitle>
            <CardDescription>
              View and manage employee information and profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/employee-profile"
              className="text-blue-600 hover:underline font-medium inline-flex items-center gap-2"
            >
              Open Employee Profiles →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recruitment</CardTitle>
            <CardDescription>
              Manage job postings, candidates, and recruitment processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/recruitment"
              className="text-blue-600 hover:underline font-medium inline-flex items-center gap-2"
            >
              Open Recruitment →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payroll</CardTitle>
            <CardDescription>
              Manage payroll configuration and execution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/payroll"
              className="text-blue-600 hover:underline font-medium inline-flex items-center gap-2"
            >
              Open Payroll →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Management</CardTitle>
            <CardDescription>
              Manage attendance, schedules, and time tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/time-management"
              className="text-blue-600 hover:underline font-medium inline-flex items-center gap-2"
            >
              Open Time Management →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>
              Manage performance reviews and evaluations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/performance"
              className="text-blue-600 hover:underline font-medium inline-flex items-center gap-2"
            >
              Open Performance →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

