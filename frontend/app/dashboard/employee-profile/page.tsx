// app/dashboard/employee-profile/page.tsx - CORRECTED
"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SystemRole } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shared/ui/Card";

export default function EmployeeProfileDashboardPage() {
  const { user } = useAuth();

  // Helper function to check roles properly
  const hasRole = (role: SystemRole | string): boolean => {
    if (!user?.roles) return false;

    return user.roles.some((userRole) => {
      if (typeof userRole === "string" && typeof role === "string") {
        return userRole.toLowerCase() === role.toLowerCase();
      }
      return userRole === role;
    });
  };

  // Determine access based on roles
  const isEmployee =
    user?.userType === "employee" || hasRole(SystemRole.DEPARTMENT_EMPLOYEE);
  const isHRAdmin = hasRole(SystemRole.HR_ADMIN);
  const isHRManager = hasRole(SystemRole.HR_MANAGER);
  const isDepartmentHead = hasRole(SystemRole.DEPARTMENT_HEAD);

  // HR Admin and HR Manager have same permissions
  const isHR = isHRAdmin || isHRManager;

  // Permission flags
  const canEditOwnProfile = isEmployee;
  const canSubmitChangeRequests = isEmployee;
  const canViewTeam = isDepartmentHead || isHR;
  const canManageAll = isHR;
  const canApprove = isHR;

  return (
    <ProtectedRoute
      allowedRoles={[
        SystemRole.DEPARTMENT_EMPLOYEE,
        SystemRole.DEPARTMENT_HEAD,
        SystemRole.HR_MANAGER,
        SystemRole.HR_ADMIN,
        SystemRole.SYSTEM_ADMIN,
      ]}
    >
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Employee Profile Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome, {user?.fullName || "User"}
          {isHR && (
            <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
              {isHRAdmin ? "HR Admin" : "HR Manager"}
            </span>
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* My Profile Card - Show for all employees */}
          {isEmployee && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/dashboard/employee-profile/my-profile"
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  View Profile
                </Link>
                {canEditOwnProfile && (
                  <Link
                    href="/dashboard/employee-profile/my-profile/edit"
                    className="block w-full text-center border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-50 transition"
                  >
                    Edit Profile
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Change Requests - Show for department employees */}
          {canSubmitChangeRequests && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Change Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/dashboard/employee-profile/change-requests"
                  className="block w-full text-center bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition"
                >
                  My Requests
                </Link>
                <Link
                  href="/dashboard/employee-profile/change-requests/new"
                  className="block w-full text-center border border-amber-600 text-amber-600 py-2 px-4 rounded hover:bg-amber-50 transition"
                >
                  New Request
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Team View - Show for managers/HR */}
          {canViewTeam && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Team View</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="/dashboard/employee-profile/team"
                  className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                >
                  View Team
                </Link>
              </CardContent>
            </Card>
          )}

          {/* HR Admin/Manager Features */}
          {canManageAll && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <p className="text-sm text-gray-500">
                  {isHRAdmin ? "HR Admin" : "HR Manager"} Access
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/dashboard/employee-profile/admin/search"
                  className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
                >
                  Search Employees
                </Link>
                {canApprove && (
                  <Link
                    href="/dashboard/employee-profile/admin/approvals"
                    className="block w-full text-center border border-purple-600 text-purple-600 py-2 px-4 rounded hover:bg-purple-50 transition"
                  >
                    Approval Queue ({isHRAdmin ? "Admin" : "Manager"})
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats for HR */}
        {isHR && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              HR Access Notes:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • HR Admin and HR Manager have identical access to employee
                profiles
              </li>
              <li>• You can search all employees and manage their profiles</li>
              <li>• You can approve/reject employee change requests</li>
              <li>• You can view team members across all departments</li>
            </ul>
          </div>
        )}

        {/* Back to Main Dashboard */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Back to Main Dashboard
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
