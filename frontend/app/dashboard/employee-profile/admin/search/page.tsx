// app/dashboard/employee-profile/admin/manage/[id]/page.tsx
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

// Helper function to extract data
function extractData<T>(response: any): T | null {
  if (!response) return null;

  if (typeof response === "object") {
    if ("data" in response) {
      const data = response.data;
      if (data && typeof data === "object" && "data" in data) {
        return data.data as T;
      }
      return data as T;
    }
    return response as T;
  }

  return null;
}

export default function ManageProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { toast, showToast, hideToast } = useToast();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authorization
  const isAuthorized = user?.roles?.some(
    (role) =>
      role === SystemRole.HR_ADMIN ||
      role === SystemRole.HR_MANAGER ||
      role === "HR Admin" ||
      role === "HR Manager"
  );

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!id || !isAuthorized) return;

        setLoading(true);
        const response = await employeeProfileApi.getEmployeeById(id);

        console.log("Profile API response:", response); // Debug log

        // Extract data
        const extractedData = extractData<EmployeeProfile>(response);
        setProfile(extractedData);

        if (!extractedData) {
          showToast("Employee profile not found", "error");
        }
      } catch (error: unknown) {
        console.error("Error loading profile:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load profile";
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized && id) {
      loadProfile();
    }
  }, [id, isAuthorized, showToast]);

  // Show access denied if not authorized
  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">
            Access denied. You don't have permission to manage employee
            profiles.
          </p>
          <Button
            onClick={() =>
              router.push("/dashboard/employee-profile/admin/search")
            }
            className="mt-3"
          >
            Back to Search
          </Button>
        </div>
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Employee Profile
          </h1>
          <p className="text-gray-600 mt-1">Employee ID: {id}</p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            router.push("/dashboard/employee-profile/admin/search")
          }
        >
          ← Back to Search
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600" />
        </div>
      ) : !profile ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-gray-600 text-lg">
                Employee profile not found.
              </p>
              <Button
                onClick={() =>
                  router.push("/dashboard/employee-profile/admin/search")
                }
                className="mt-4"
              >
                Search for Employees
              </Button>
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

          {/* Employment Information */}
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

          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>Department and position details</CardDescription>
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
