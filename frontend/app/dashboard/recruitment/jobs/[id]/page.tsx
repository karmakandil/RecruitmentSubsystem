"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import { JobRequisition, CreateApplicationDto } from "@/types/recruitment";
import { StatusBadge } from "@/components/recruitment/StatusBadge";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [job, setJob] = useState<JobRequisition | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadJob();
    }
  }, [params.id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const jobData = await recruitmentApi.getJobRequisitionById(params.id as string);
      setJob(jobData);
    } catch (error: any) {
      showToast(error.message || "Failed to load job details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!consentGiven) {
      showToast("You must give consent for data processing to apply", "error");
      return;
    }

    if (!user?.id && !user?.userId) {
      showToast("User information not available", "error");
      return;
    }

    try {
      setApplying(true);
      // Backend expects consentGiven in the body along with CreateApplicationDto
      const applicationData: CreateApplicationDto & { consentGiven: boolean } = {
        candidateId: user.id || user.userId || "",
        requisitionId: job!._id,
        consentGiven: true,
      };

      await recruitmentApi.createApplication(applicationData);
      showToast("Application submitted successfully!", "success");
      setIsApplyModalOpen(false);
      setTimeout(() => {
        router.push("/dashboard/recruitment/my-applications");
      }, 1500);
    } catch (error: any) {
      showToast(error.message || "Failed to submit application", "error");
    } finally {
      setApplying(false);
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

        <div className="mb-6 flex gap-4">
          {/* CHANGED - Added back button to job requisitions */}
          <Link href="/dashboard/recruitment/job-requisitions" className="text-blue-600 hover:underline inline-block">
            ← Back to Job Requisitions
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/dashboard/recruitment" className="text-blue-600 hover:underline inline-block">
            Back to Recruitment
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading job details...</p>
          </div>
        ) : !job ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Job not found.</p>
              <Link href="/dashboard/recruitment">
                <Button className="mt-4">Back to Recruitment</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl">
                      {job.template?.title || "Job Opening"}
                    </CardTitle>
                    <div className="mt-2 flex items-center gap-4 text-gray-600">
                      <span>{job.template?.department || "Department"}</span>
                      {job.location && <span>• {job.location}</span>}
                      <span>• {job.openings} {job.openings === 1 ? "opening" : "openings"}</span>
                    </div>
                  </div>
                  <StatusBadge status={job.status} type="application" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {job.template?.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{job.template.description}</p>
                    </div>
                  )}

                  {job.template?.responsibilities && job.template.responsibilities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsibilities</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {job.template.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.template?.requirements && job.template.requirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {job.template.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.template?.qualifications && job.template.qualifications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualifications</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {job.template.qualifications.map((qual, idx) => (
                          <li key={idx}>{qual}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.template?.experienceLevel && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience Level</h3>
                      <p className="text-gray-700">{job.template.experienceLevel}</p>
                    </div>
                  )}

                  {job.template?.employmentType && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Employment Type</h3>
                      <p className="text-gray-700">{job.template.employmentType}</p>
                    </div>
                  )}

                  {/* CHANGED - Using publishStatus instead of published boolean */}
                  <div className="pt-6 border-t">
                    {/* CHANGED - Check publishStatus === 'published' instead of job.published */}
                    {job.publishStatus === 'published' && user?.userType === "candidate" ? (
                      <Button onClick={() => setIsApplyModalOpen(true)} size="lg" className="w-full md:w-auto">
                        Apply for this Position
                      </Button>
                    ) : job.publishStatus !== 'published' ? (
                      <p className="text-gray-500">This job is not currently accepting applications.</p>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Apply Modal */}
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setConsentGiven(false);
          }}
          title="Apply for Position"
          size="md"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setConsentGiven(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleApply} disabled={!consentGiven || applying}>
                {applying ? "Submitting..." : "Submit Application"}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              You are about to apply for: <strong>{job?.template?.title}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  I give my consent for personal data processing and background checks as required
                  for this application. I understand that my data will be processed in accordance
                  with privacy laws and regulations.
                </label>
              </div>
            </div>
            {!consentGiven && (
              <p className="text-sm text-red-600">
                You must give consent to proceed with the application.
              </p>
            )}
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

