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

export default function InterviewsPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const isCandidate = user?.userType === "candidate" || user?.roles?.includes(SystemRole.JOB_CANDIDATE);
  const isDepartmentHead = user?.roles?.includes(SystemRole.DEPARTMENT_HEAD);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allApplications = await recruitmentApi.getApplications();
      
      if (isCandidate) {
        // For candidates: show their applications in interview stages
        const candidateApplications = allApplications.filter(
          (app) => app.candidateId === user?.id || app.candidateId === user?.userId
        );
        setApplications(candidateApplications);
      } else if (isDepartmentHead) {
        // For department heads: show department interviews
        const interviewApplications = allApplications.filter(
          (app) =>
            app.stage?.includes("interview") &&
            (app.stage === "department_interview" || app.status === "in_process")
        );
        setApplications(interviewApplications);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to load interviews", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
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
          <h1 className="text-3xl font-bold text-gray-900">
            {isCandidate ? "My Interviews" : "Department Interviews"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isCandidate
              ? "View your scheduled interviews and feedback"
              : "View and manage interviews for your department"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading interviews...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">
                {isCandidate
                  ? "No interviews scheduled at this time."
                  : "No interviews scheduled for your department."}
              </p>
              <Link href="/dashboard/recruitment">
                <button className="text-blue-600 hover:underline">
                  {isCandidate ? "Browse available jobs" : "Back to Recruitment"}
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications
              .filter((app) => app.stage?.includes("interview") || app.status === "in_process")
              .map((application) => (
                <Card key={application._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">
                          {application.requisition?.template?.title || "Interview"}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {isCandidate
                            ? application.stage
                              ? application.stage.replace("_", " ").toUpperCase()
                              : "Interview Stage"
                            : `Candidate: ${application.candidate?.fullName || "N/A"}`}
                        </p>
                      </div>
                      <StatusBadge status={application.status} type="application" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Position:</span>
                          <span className="ml-2 text-gray-900">
                            {application.requisition?.template?.title || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Department:</span>
                          <span className="ml-2 text-gray-900">
                            {application.requisition?.template?.department || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        {isCandidate ? (
                          <>
                            <p className="text-sm text-gray-600 mb-2">
                              Interview details will be shared by the hiring team. Please check your email for
                              interview invitations and updates.
                            </p>
                            <Link href={`/dashboard/recruitment/my-applications`}>
                              <button className="text-blue-600 hover:underline text-sm font-medium">
                                View Application Details →
                              </button>
                            </Link>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600 mb-2">
                              Interview details and feedback submission will be available once the interview is scheduled.
                            </p>
                            <p className="text-xs text-gray-400">
                              Note: To submit interview feedback, the backend needs to support DEPARTMENT_HEAD role for the feedback endpoint.
                            </p>
                          </>
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

