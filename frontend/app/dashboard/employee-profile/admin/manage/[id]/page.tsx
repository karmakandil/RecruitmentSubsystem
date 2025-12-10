// app/dashboard/employee-profile/admin/manage/[id]/page.tsx - CORRECTED
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole, EmployeeProfile } from "@/types";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Toast, useToast } from "@/components/leaves/Toast";
import { employeeProfileApi } from "@/lib/api/employee-profile/profile";
import { isHRAdminOrManager } from "@/lib/utils/role-utils";

export default function ManageProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { toast, showToast, hideToast } = useToast();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authorized (HR Admin or HR Manager)
  const isAuthorized = isHRAdminOrManager(user);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id || !isAuthorized) return;

        setLoading(true);
        console.log("Loading profile for ID:", id);

        // Use the API method which now handles response extraction
        const response = await employeeProfileApi.getEmployeeById(id);

        console.log("Profile API response:", response);

        // Response is already extracted by the API helper
        if (response && typeof response === "object") {
          setProfile(response as EmployeeProfile);
        } else {
          setProfile(null);
          showToast("Profile not found", "error");
        }
      } catch (error: any) {
        console.error("Error loading profile:", error);
        showToast(error.message || "Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      load();
    }
  }, [id, isAuthorized, showToast]);

  // Redirect if not authorized
  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have permission to manage employee profiles. Only HR
                Admin and HR Manager can access this page.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => router.push("/dashboard/employee-profile")}
                  variant="primary"
                >
                  Go to Profile Dashboard
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                >
                  Back to Main Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Employee Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Employee ID: {id}
            {user?.roles?.includes(SystemRole.HR_ADMIN) && (
              <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                HR Admin
              </span>
            )}
            {user?.roles?.includes(SystemRole.HR_MANAGER) && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                HR Manager
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() =>
              router.push("/dashboard/employee-profile/admin/search")
            }
          >
            ← Back to Search
          </Button>
          <Button onClick={() => router.push("/dashboard/employee-profile")}>
            Profile Dashboard
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600" />
          <p className="ml-4 text-gray-600">Loading employee profile...</p>
        </div>
      ) : !profile ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-4">
                Employee profile not found.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() =>
                    router.push("/dashboard/employee-profile/admin/search")
                  }
                  variant="primary"
                >
                  Search for Employees
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/employee-profile")}
                  variant="outline"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Employee's personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="mt-1 text-lg font-medium">{profile.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Employee Number
                  </p>
                  <p className="mt-1 font-mono text-lg">
                    {profile.employeeNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </p>
                  <p className="mt-1">
                    {profile.dateOfBirth
                      ? new Date(profile.dateOfBirth).toLocaleDateString()
                      : "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="mt-1">{profile.gender || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Marital Status
                  </p>
                  <p className="mt-1">
                    {profile.maritalStatus || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    National ID
                  </p>
                  <p className="mt-1 font-mono">
                    {profile.nationalId || "Not provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Information</CardTitle>
              <CardDescription>Job and contract details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span
                  className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    profile.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : profile.status === "ON_LEAVE"
                      ? "bg-blue-100 text-blue-800"
                      : profile.status === "TERMINATED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {profile.status || "UNKNOWN"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Date of Hire
                </p>
                <p className="mt-1">
                  {profile.dateOfHire
                    ? new Date(profile.dateOfHire).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Contract Type
                </p>
                <p className="mt-1">{profile.contractType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Work Type</p>
                <p className="mt-1">{profile.workType || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Employee contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Work Email
                  </p>
                  <p className="mt-1">{profile.workEmail || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Personal Email
                  </p>
                  <p className="mt-1">{profile.personalEmail || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Mobile Phone
                  </p>
                  <p className="mt-1">{profile.mobilePhone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Home Phone
                  </p>
                  <p className="mt-1">{profile.homePhone || "N/A"}</p>
                </div>
                {profile.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="mt-1">
                      {[
                        profile.address.streetAddress,
                        profile.address.city,
                        profile.address.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Not provided"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Department & Position */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>Department and position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="mt-1 text-lg font-medium">
                  {profile.primaryDepartment?.name || "Not assigned"}
                </p>
                {profile.primaryDepartment?.code && (
                  <p className="text-sm text-gray-500">
                    Code: {profile.primaryDepartment.code}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Position</p>
                <p className="mt-1 text-lg font-medium">
                  {profile.primaryPosition?.title || "Not assigned"}
                </p>
                {profile.primaryPosition?.code && (
                  <p className="text-sm text-gray-500">
                    Code: {profile.primaryPosition.code}
                  </p>
                )}
              </div>
              {profile.supervisor && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Supervisor
                  </p>
                  <p className="mt-1">{profile.supervisor.fullName}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* HR Admin/Manager Notes */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">HR Access Notes:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • As an{" "}
            <strong>
              {user?.roles?.includes(SystemRole.HR_ADMIN)
                ? "HR Admin"
                : "HR Manager"}
            </strong>
            , you can view and manage all employee profiles
          </li>
          <li>
            • To edit this profile, use the "Edit Profile" button on the
            employee's own profile page
          </li>
          <li>
            • Status changes will sync with Payroll and Time Management modules
          </li>
          <li>• All changes are logged for audit purposes</li>
        </ul>
      </div>
    </div>
  );
}
