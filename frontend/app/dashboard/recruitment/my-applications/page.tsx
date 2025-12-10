"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/Card";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import { Application } from "@/types/recruitment";
import { StatusBadge } from "@/components/recruitment/StatusBadge";
import { Toast, useToast } from "@/components/leaves/Toast";

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const allApplications = await recruitmentApi.getApplications();
      const candidateApplications = allApplications.filter(
        (app) => app.candidateId === user?.id || app.candidateId === user?.userId
      );
      setApplications(candidateApplications);
    } catch (error: any) {
      showToast(error.message || "Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (status: string, stage?: string): number => {
    const statusMap: Record<string, number> = {
      submitted: 20,
      in_process: 40,
      offer: 80,
      hired: 100,
      rejected: 0,
    };
    return statusMap[status.toLowerCase()] || 0;
  };

  return (
    <ProtectedRoute requiredUserType="candidate">
      <div className="container mx-auto px-6 py-8">
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />

        <div className="mb-8">
          <Link href="/dashboard/recruitment" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Recruitment
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">Track the status of your job applications</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">You haven't submitted any applications yet.</p>
              <Link href="/dashboard/recruitment">
                <button className="text-blue-600 hover:underline">Browse available jobs</button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {application.requisition?.template?.title || "Job Application"}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {application.requisition?.template?.department || "Department"}
                        {application.requisition?.location && ` • ${application.requisition.location}`}
                      </p>
                    </div>
                    <StatusBadge status={application.status} type="application" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Application Progress</span>
                        <span className="text-sm text-gray-500">
                          {getProgressPercentage(application.status, application.stage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${getProgressPercentage(application.status, application.stage)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Applied:</span>
                        <span className="ml-2 text-gray-900">
                          {application.createdAt
                            ? new Date(application.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      {application.stage && (
                        <div>
                          <span className="text-gray-500">Current Stage:</span>
                          <span className="ml-2 text-gray-900 capitalize">
                            {application.stage.replace("_", " ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

