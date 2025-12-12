"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { ClockInOutButton } from "@/components/time-management/ClockInOutButton";
import { SystemRole } from "@/types";

export default function TimeManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes(SystemRole.HR_ADMIN) || user?.roles?.includes(SystemRole.SYSTEM_ADMIN);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Time Management</h1>
        <p className="text-gray-600 mt-1">
          {isAdmin
            ? "Manage attendance, schedules, shifts, and time tracking"
            : "Track your attendance and manage your time"}
        </p>
      </div>

      {/* Employee Section */}
      {!isAdmin && (
        <>
          {/* Clock In/Out */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Clock In/Out</CardTitle>
                  <CardDescription>Track your work hours by clocking in and out</CardDescription>
                </CardHeader>
                <CardContent>
                  <ClockInOutButton />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Navigate to related pages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/dashboard/time-management/attendance/records"
                  className="block text-blue-600 hover:underline font-medium"
                >
                  View Detailed Records
                </Link>
                <Link
                  href="/dashboard/time-management/attendance/corrections"
                  className="block text-blue-600 hover:underline font-medium"
                >
                  Correction Requests
                </Link>
                <Link
                  href="/dashboard/time-management/shifts"
                  className="block text-blue-600 hover:underline font-medium"
                >
                  Time Management Home
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* My Attendance Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                  <CardDescription>View your clock in/out records</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="/dashboard/time-management/attendance/records"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Records
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Correction Requests</CardTitle>
                  <CardDescription>Submit and track corrections</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="/dashboard/time-management/attendance/corrections"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Manage Corrections
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Shifts</CardTitle>
                  <CardDescription>View your shift assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="/dashboard/time-management/shifts"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Shifts
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Admin Section */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Shift Assignments</CardTitle>
              <CardDescription>Assign and manage shifts for employees, departments, and positions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href="/dashboard/time-management/shifts/assignments" 
                className="text-blue-600 hover:underline font-medium"
              >
                Manage Shift Assignments →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Corrections</CardTitle>
              <CardDescription>Review and approve attendance correction requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href="/dashboard/time-management/attendance/corrections" 
                className="text-blue-600 hover:underline font-medium"
              >
                Manage Corrections →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time Exceptions</CardTitle>
              <CardDescription>Review, approve, or reject time-related requests and exceptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href="/dashboard/time-management/exceptions" 
                className="text-blue-600 hover:underline font-medium"
              >
                Manage Exceptions →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Holidays & Rest Days</CardTitle>
              <CardDescription>Configure national holidays, organizational holidays, and weekly rest days</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href="/dashboard/time-management/policies/holidays" 
                className="text-blue-600 hover:underline font-medium"
              >
                Manage Holidays →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>View and export overtime and exception attendance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href="/dashboard/time-management/reports" 
                className="text-blue-600 hover:underline font-medium"
              >
                View Reports →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permission Validation Rules</CardTitle>
              <CardDescription>Define limits for permission durations and ensure only approved permissions affect payroll</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href="/dashboard/time-management/policies/permission-limits" 
                className="text-blue-600 hover:underline font-medium"
              >
                Manage Rules →
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

