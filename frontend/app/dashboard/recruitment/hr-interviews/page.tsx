"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import { employeeProfileApi } from "@/lib/api/employee-profile/profile";
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
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isPanelViewModalOpen, setIsPanelViewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [selectedInterviewForPanel, setSelectedInterviewForPanel] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [panelFeedback, setPanelFeedback] = useState<any[]>([]);

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
    loadEmployees();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const apps = await recruitmentApi.getApplications();
      const filteredApps = apps.filter((app) => app.status === "in_process" || app.status === "submitted");
      setApplications(filteredApps);
      
      // Extract interviews from applications if they exist
      // Note: Backend may populate interviews in application data
      const allInterviews: any[] = [];
      filteredApps.forEach((app) => {
        if (app.interviews && Array.isArray(app.interviews)) {
          app.interviews.forEach((int: any) => {
            allInterviews.push({ ...int, applicationId: app._id });
          });
        }
      });
      if (allInterviews.length > 0) {
        setInterviews(allInterviews);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await employeeProfileApi.getAllEmployees({ limit: 100 });
      const employeeList = response?.data || [];
      setEmployees(employeeList);
    } catch (error: any) {
      console.error("Failed to load employees:", error);
      showToast("Failed to load employees for panel selection", "error");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const loadPanelFeedback = async (interviewId: string) => {
    try {
      const feedback = await recruitmentApi.getInterviewFeedback(interviewId);
      setPanelFeedback(Array.isArray(feedback) ? feedback : []);
    } catch (error: any) {
      console.error("Failed to load panel feedback:", error);
      setPanelFeedback([]);
    }
  };

  const handleOpenSchedule = (application: any) => {
    setSelectedApplication(application);
    const currentUserId = user?.id || user?.userId || user?._id;
    setScheduleForm({
      applicationId: application._id,
      stage: ApplicationStage.SCREENING,
      scheduledDate: "",
      method: InterviewMethod.VIDEO,
      panel: currentUserId ? [currentUserId] : [],
      videoLink: "",
    });
    // CHANGED - Reset date and time fields
    setScheduleDate("");
    setScheduleTime("");
    setIsScheduleModalOpen(true);
  };

  const handleOpenPanelView = async (application: any, interview: any) => {
    setSelectedApplication(application);
    setSelectedInterviewForPanel(interview);
    if (interview?._id) {
      await loadPanelFeedback(interview._id);
    }
    setIsPanelViewModalOpen(true);
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
        // Add to interviews list
        setInterviews([...interviews, interview]);
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
                      {/* Show scheduled interviews if any */}
                      {(interviews.filter((int) => int.applicationId === application._id).length > 0) && (
                        <div className="mt-3 space-y-2">
                          {interviews
                            .filter((int) => int.applicationId === application._id)
                            .map((interview) => (
                          <div key={interview._id} className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {interview.stage?.replace("_", " ").toUpperCase()} Interview
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Scheduled: {new Date(interview.scheduledDate).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Method: {interview.method?.toUpperCase() || "N/A"}
                                </p>
                                {interview.panel && interview.panel.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium text-gray-700">
                                      Panel Members ({interview.panel.length}):
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {interview.panel.slice(0, 3).map((panelId: string, idx: number) => {
                                        const panelMember = employees.find(
                                          (emp) => (emp._id || emp.id || emp.userId) === panelId
                                        );
                                        const name = panelMember
                                          ? panelMember.fullName || 
                                            `${panelMember.firstName || ''} ${panelMember.lastName || ''}`.trim() || 
                                            panelMember.email || 
                                            'Unknown'
                                          : 'Loading...';
                                        return (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                          >
                                            {name}
                                          </span>
                                        );
                                      })}
                                      {interview.panel.length > 3 && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                          +{interview.panel.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenPanelView(application, interview)}
                                >
                                  View Panel
                                </Button>
                                {canSubmitFeedback && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedInterview(interview);
                                      handleOpenFeedback(application);
                                    }}
                                  >
                                    Submit Feedback
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                            ))}
                        </div>
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

              {/* Panel Members Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Panel Members *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Select interview panel members. You are automatically included.
                </p>
                {loadingEmployees ? (
                  <p className="text-sm text-gray-500">Loading employees...</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {employees.length === 0 ? (
                      <p className="text-sm text-gray-500">No employees available</p>
                    ) : (
                      employees.map((employee) => {
                        const employeeId = employee._id || employee.id || employee.userId;
                        const employeeName = employee.fullName || 
                          `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 
                          employee.email || 
                          'Unknown';
                        const isSelected = scheduleForm.panel?.includes(employeeId);
                        const isCurrentUser = employeeId === (user?.id || user?.userId || user?._id);
                        
                        return (
                          <label
                            key={employeeId}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected || isCurrentUser}
                              disabled={isCurrentUser}
                              onChange={(e) => {
                                const currentPanel = scheduleForm.panel || [];
                                if (e.target.checked) {
                                  if (!currentPanel.includes(employeeId)) {
                                    setScheduleForm({
                                      ...scheduleForm,
                                      panel: [...currentPanel, employeeId],
                                    });
                                  }
                                } else {
                                  if (!isCurrentUser) {
                                    setScheduleForm({
                                      ...scheduleForm,
                                      panel: currentPanel.filter((id) => id !== employeeId),
                                    });
                                  }
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 flex-1">
                              {employeeName}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-blue-600">(You)</span>
                              )}
                            </span>
                            {employee.department && (
                              <span className="text-xs text-gray-500">
                                {typeof employee.department === 'object' 
                                  ? employee.department.name 
                                  : employee.department}
                              </span>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
                {scheduleForm.panel && scheduleForm.panel.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {scheduleForm.panel.length} panel member(s) selected
                  </p>
                )}
              </div>
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

        {/* Panel Coordination View Modal */}
        <Modal
          isOpen={isPanelViewModalOpen}
          onClose={() => setIsPanelViewModalOpen(false)}
          title="Interview Panel Coordination"
        >
          <div className="space-y-4">
            {selectedInterviewForPanel && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Interview Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Stage:</span>
                      <span className="ml-2 font-medium">
                        {selectedInterviewForPanel.stage?.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <StatusBadge 
                        status={selectedInterviewForPanel.status} 
                        type="interview" 
                        className="ml-2"
                      />
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">
                        {new Date(selectedInterviewForPanel.scheduledDate).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Method:</span>
                      <span className="ml-2 font-medium">
                        {selectedInterviewForPanel.method?.toUpperCase() || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Panel Members</h3>
                  {selectedInterviewForPanel.panel && selectedInterviewForPanel.panel.length > 0 ? (
                    <div className="space-y-3">
                      {selectedInterviewForPanel.panel.map((panelId: string) => {
                        const panelMember = employees.find(
                          (emp) => (emp._id || emp.id || emp.userId) === panelId
                        );
                        const memberFeedback = panelFeedback.find(
                          (fb) => fb.interviewerId === panelId
                        );
                        const memberName = panelMember
                          ? panelMember.fullName || 
                            `${panelMember.firstName || ''} ${panelMember.lastName || ''}`.trim() || 
                            panelMember.email || 
                            'Unknown'
                          : 'Loading...';
                        const isCurrentUser = panelId === (user?.id || user?.userId || user?._id);

                        return (
                          <div
                            key={panelId}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-gray-900">{memberName}</h4>
                                  {isCurrentUser && (
                                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                                      You
                                    </span>
                                  )}
                                  {memberFeedback ? (
                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                                      Feedback Submitted
                                    </span>
                                  ) : (
                                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                                      Pending
                                    </span>
                                  )}
                                </div>
                                {panelMember?.department && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {typeof panelMember.department === 'object' 
                                      ? panelMember.department.name 
                                      : panelMember.department}
                                  </p>
                                )}
                                {memberFeedback && (
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <div className="flex items-center gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-600">Score:</span>
                                        <span className="ml-2 font-semibold text-gray-900">
                                          {memberFeedback.score}/100
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Submitted:</span>
                                        <span className="ml-2 text-gray-700">
                                          {new Date(memberFeedback.createdAt || memberFeedback.submittedAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                    {memberFeedback.comments && (
                                      <p className="text-sm text-gray-700 mt-2">
                                        <span className="font-medium">Comments:</span> {memberFeedback.comments}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No panel members assigned</p>
                  )}
                </div>

                {/* Average Score */}
                {panelFeedback.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Average Score:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {(
                          panelFeedback.reduce((sum, fb) => sum + (fb.score || 0), 0) /
                          panelFeedback.length
                        ).toFixed(1)}
                        /100
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Based on {panelFeedback.length} of {selectedInterviewForPanel.panel?.length || 0} panel members
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPanelViewModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

