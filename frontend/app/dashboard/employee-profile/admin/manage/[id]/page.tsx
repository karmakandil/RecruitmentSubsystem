"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";

export default function ManageEmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  useRequireAuth(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN);
  
  const employeeId = params.id as string;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/employee-profile")}
          className="mb-4 text-blue-600 hover:underline inline-flex items-center gap-2"
        >
          ← Back to Employee Profiles
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Manage Employee Profile</h1>
        <p className="text-gray-600 mt-1">
          Employee ID: {employeeId}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            View and manage employee profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Employee profile management interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}

