"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRequireAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";

export default function EmployeeProfileApprovalsPage() {
  const { user } = useAuth();
  useRequireAuth(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee Profile Approvals</h1>
        <p className="text-gray-600 mt-1">
          Review and approve employee profile change requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>
            Employee profile change requests awaiting your review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No pending approvals at this time.</p>
        </CardContent>
      </Card>
    </div>
  );
}

