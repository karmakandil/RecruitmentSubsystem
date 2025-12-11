"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import {
  Interview,
  ScheduleInterviewDto,
  UpdateInterviewStatusDto,
  SubmitInterviewFeedbackDto,
  ApplicationStage,
  InterviewMethod,
  InterviewStatus,
} from "@/types/recruitment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/leaves/Select";
import { Textarea } from "@/components/leaves/Textarea";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";
import { StatusBadge } from "@/components/recruitment/StatusBadge";

export default function HRInterviewsPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  // CHANGED - Recruiter can only schedule interviews, not submit feedback
  const isRecruiterOnly = user?.roles?.some(
    (role) => String(role).toLowerCase() === "recruiter"
  ) && !user?.roles?.some(
    (role) => ["hr employee", "hr manager", "system admin"].includes(String(role).toLowerCase())
  );
  
  // CHANGED - Only HR Employee, HR Manager, System Admin can submit feedback
  const canSubmitFeedback = user?.roles?.some(
    (role) => ["hr employee", "hr manager", "system admin"].includes(String(role).toLowerCase())
  );
  const [scheduleForm, setScheduleForm] = useState<ScheduleInterviewDto>({
    applicationId: "",
    stage: ApplicationStage.SCREENING,
    scheduledDate: "",
    method: InterviewMethod.VIDEO,
    panel: [],
    videoLink: "",
  });
  // CHANGED - Separate date and time state for better UX
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [feedbackForm, setFeedbackForm] = useState<SubmitInterviewFeedbackDto>({
    score: 0,
    comments: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const apps = await recruitmentApi.getApplications();
      setApplications(apps.filter((app) => app.status === "in_process" || app.status === "submitted"));
    } catch (error: any) {
      showToast(error.message || "Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSchedule = (application: any) => {
    setSelectedApplication(application);
    setScheduleForm({
      applicationId: application._id,
      stage: ApplicationStage.SCREENING,
      scheduledDate: "",
      method: InterviewMethod.VIDEO,
      panel: [],
      videoLink: "",
    });
    // CHANGED - Reset date and time fields
    setScheduleDate("");
    setScheduleTime("");
    setIsScheduleModalOpen(true);
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // CHANGED - Combine date and time into ISO format
      if (!scheduleDate || !scheduleTime) {
        showToast("Please select both date and time", "error");
        return;
      }
      
      // CHANGED - Add seconds to time for proper ISO format
      const timeWithSeconds = scheduleTime.includes(':') && scheduleTime.split(':').length === 2 
        ? `${scheduleTime}:00` 
        : scheduleTime;
      const combinedDateTime = new Date(`${scheduleDate}T${timeWithSeconds}`);
      
      // CHANGED - Validate date is valid
      if (isNaN(combinedDateTime.getTime())) {
        showToast("Invalid date or time format", "error");
        return;
      }
      
      // CHANGED - Validate date is in the future
      if (combinedDateTime <= new Date()) {
        showToast("Interview date and time must be in the future", "error");
        return;
      }
      
      const scheduledDate = combinedDateTime.toISOString();
      
      // CHANGED - Build clean data object
      const interviewData: any = {
        applicationId: scheduleForm.applicationId,
        stage: scheduleForm.stage,
        scheduledDate: scheduledDate,
        method: scheduleForm.method,
      };
      
      // CHANGED - Add current user to panel so they can submit feedback
      const currentUserId = user?.id || user?.userId || user?._id;
      if (currentUserId) {
        interviewData.panel = [currentUserId];
      }
      
      // Add any additional panel members
      if (scheduleForm.panel && scheduleForm.panel.length > 0) {
        interviewData.panel = [...(interviewData.panel || []), ...scheduleForm.panel];
      }
      if (scheduleForm.videoLink) {
        interviewData.videoLink = scheduleForm.videoLink;
      }
      
      // CHANGED - Log data for debugging
      console.log("Scheduling interview with data:", JSON.stringify(interviewData, null, 2));
      
      const interview = await recruitmentApi.scheduleInterview(interviewData);
      showToast("Interview scheduled successfully", "success");
      setIsScheduleModalOpen(false);
      // Store interview ID for feedback submission
      if (interview && interview._id) {
        setSelectedInterview(interview);
      }
      loadData();
    } catch (error: any) {
      // CHANGED - Better error handling
      const errorMessage = error.response?.data?.message || error.message || "Failed to schedule interview. Check console for details.";
      console.error("Interview scheduling error:", error);
      console.error("Error response:", error.response);
      showToast(errorMessage, "error");
    }
  };

  const handleOpenFeedback = async (application: any) => {
    setSelectedApplication(application);
    // Try to get interview feedback to find interview ID
    // Note: Backend requires interview ID, so we need to get it from the scheduled interview
    // For now, we'll show a message that interview must be scheduled first
    setFeedbackForm({ score: 0, comments: "" });
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedApplication || !selectedInterview?._id) {
      showToast("Please schedule an interview first to submit feedback", "error");
      return;
    }
    
    // Validate score (backend expects 0-100)
    if (feedbackForm.score < 0 || feedbackForm.score > 100) {
      showToast("Score must be between 0 and 100", "error");
      return;
    }

    try {
      await recruitmentApi.submitInterviewFeedback(selectedInterview._id, feedbackForm);
      showToast("Feedback submitted successfully", "success");
      setIsFeedbackModalOpen(false);
      setSelectedInterview(null);
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to submit feedback", "error");
    }
  };

  return (
    <ProtectedRoute
      allowedRoles={[
        SystemRole.HR_EMPLOYEE,
        SystemRole.HR_MANAGER,
        SystemRole.RECRUITER,
        SystemRole.SYSTEM_ADMIN,
      ]}
    >
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
          <h1 className="text-3xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-600 mt-1">Schedule and manage candidate interviews</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No applications available for interviews.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* CHANGED - Added text-gray-900 for visibility */}
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">
                        {application.requisition?.template?.title || "Job Opening"}
                      </h3>
                      {/* CHANGED - Handle candidateId as populated object or string */}
                      <p className="text-sm text-gray-600 mb-2">
                        Candidate: {
                          application.candidate?.fullName || 
                          (typeof application.candidateId === 'object' 
                            ? (application.candidateId as any)?.fullName || (application.candidateId as any)?.firstName || 'Unknown'
                            : application.candidateId || 'Unknown')
                        }
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Status: <StatusBadge status={application.status} type="application" />
                      </p>
                      {application.stage && (
                        <p className="text-sm text-gray-600">
                          Current Stage: {application.stage.replace("_", " ").toUpperCase()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenSchedule(application)}
                      >
                        Schedule Interview
                      </Button>
                      {/* CHANGED - Only HR Employee/Manager/Admin can submit feedback, not Recruiter */}
                      {canSubmitFeedback && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenFeedback(application)}
                        >
                          Submit Feedback
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Schedule Interview Modal */}
        <Modal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title="Schedule Interview"
        >
          <form onSubmit={handleScheduleInterview}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Stage *
                </label>
                <Select
                  value={scheduleForm.stage}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, stage: e.target.value as ApplicationStage })
                  }
                  options={[
                    { value: ApplicationStage.SCREENING, label: "Screening" },
                    { value: ApplicationStage.DEPARTMENT_INTERVIEW, label: "Department Interview" },
                    { value: ApplicationStage.HR_INTERVIEW, label: "HR Interview" },
                    { value: ApplicationStage.OFFER, label: "Offer" },
                  ]}
                />
              </div>

              {/* CHANGED - Separate date and time inputs for better UX */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Date *
                </label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Time *
                </label>
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Method *
                </label>
                <Select
                  value={scheduleForm.method}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, method: e.target.value as InterviewMethod })
                  }
                  options={[
                    { value: InterviewMethod.ONSITE, label: "Onsite" },
                    { value: InterviewMethod.VIDEO, label: "Video" },
                    { value: InterviewMethod.PHONE, label: "Phone" },
                  ]}
                />
              </div>

              {scheduleForm.method === InterviewMethod.VIDEO && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Link
                  </label>
                  <Input
                    value={scheduleForm.videoLink || ""}
                    onChange={(e) =>
                      setScheduleForm({ ...scheduleForm, videoLink: e.target.value })
                    }
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsScheduleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Schedule</Button>
            </div>
          </form>
        </Modal>

        {/* Feedback Modal */}
        <Modal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          title="Submit Interview Feedback"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Score (0-100) *
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={feedbackForm.score}
                onChange={(e) =>
                  setFeedbackForm({ ...feedbackForm, score: parseInt(e.target.value) || 0 })
                }
                required
              />
              <p className="text-xs text-gray-500 mt-1">Backend expects score between 0-100</p>
            </div>

            {!selectedInterview && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You need to schedule an interview first before submitting feedback. 
                  The interview ID is required to submit feedback.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <Textarea
                value={feedbackForm.comments || ""}
                onChange={(e) =>
                  setFeedbackForm({ ...feedbackForm, comments: e.target.value })
                }
                rows={4}
                placeholder="Enter your feedback..."
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFeedbackModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitFeedback}>Submit</Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

