"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { SystemRole } from "@/types";

export default function ShiftsPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes(SystemRole.HR_ADMIN) || user?.roles?.includes(SystemRole.SYSTEM_ADMIN);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shifts</h1>
        <p className="text-gray-600 mt-1">
          {isAdmin ? "Manage shift assignments and schedules" : "View your shift assignments"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isAdmin && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Shift Assignments</CardTitle>
                <CardDescription>Manage shift assignments for employees</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/time-management/shifts/assignments"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Manage Assignments
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shift Schedules</CardTitle>
                <CardDescription>View and manage shift schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/time-management/shifts/schedules"
                  className="text-blue-600 hover:underline font-medium"
                >
                  View Schedules
                </Link>
              </CardContent>
            </Card>
          </>
        )}

        {!isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>My Shift Schedule</CardTitle>
              <CardDescription>View your assigned shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Your shift schedule will be displayed here. Contact your manager for shift changes.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Back to Time Management</CardTitle>
            <CardDescription>Return to main menu</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/time-management"
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Time Management
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
