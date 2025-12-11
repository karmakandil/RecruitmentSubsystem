"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import { Application, ApplicationStatus, UpdateApplicationStatusDto } from "@/types/recruitment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Select } from "@/components/leaves/Select";
// CHANGED - Added Textarea for rejection reason
import { Textarea } from "@/components/leaves/Textarea";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";
import { StatusBadge } from "@/components/recruitment/StatusBadge";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [jobRequisitions, setJobRequisitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequisitionId, setSelectedRequisitionId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<ApplicationStatus>(ApplicationStatus.SUBMITTED);
  // CHANGED - Added rejection reason state for REC-022
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  // CHANGED - Only HR Manager can update status, HR Employee can only track/view
  const canUpdateStatus = user?.roles?.some(
    (role) => String(role).toLowerCase() === "hr manager" || String(role).toLowerCase() === "system admin"
  );

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [selectedRequisitionId, selectedStatus, applications]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apps, jobs] = await Promise.all([
        recruitmentApi.getApplications(),
        recruitmentApi.getJobRequisitions(),
      ]);
      setApplications(apps);
      setFilteredApplications(apps);
      setJobRequisitions(jobs);
    } catch (error: any) {
      showToast(error.message || "Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by requisition
    if (selectedRequisitionId) {
      filtered = filtered.filter((app) => app.requisitionId === selectedRequisitionId);
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((app) => app.status === selectedStatus);
    }

    setFilteredApplications(filtered);
  };

  const handleOpenStatusUpdate = (application: Application) => {
    setSelectedApplication(application);
    setStatusUpdate(application.status);
    // CHANGED - Reset rejection reason when opening modal
    setRejectionReason("");
    setIsStatusModalOpen(true);
  };

  // CHANGED - Updated to include rejection reason for REC-022
  const handleUpdateStatus = async () => {
    if (!selectedApplication) return;

    // CHANGED - Validate rejection reason is provided when rejecting
    if (statusUpdate === ApplicationStatus.REJECTED && !rejectionReason.trim()) {
      showToast("Please provide a rejection reason", "error");
      return;
    }

    try {
      setUpdating(true);
      // CHANGED - Include rejection reason in the update
      const updateData: UpdateApplicationStatusDto = {
        status: statusUpdate,
      };
      
      // CHANGED - REC-022: Add rejection reason if rejecting
      if (statusUpdate === ApplicationStatus.REJECTED && rejectionReason.trim()) {
        updateData.rejectionReason = rejectionReason.trim();
      }

      await recruitmentApi.updateApplicationStatus(selectedApplication._id, updateData);
      
      // CHANGED - Show appropriate message based on status
      if (statusUpdate === ApplicationStatus.REJECTED) {
        showToast("Application rejected. Candidate will be notified automatically.", "success");
      } else {
        showToast("Application status updated successfully", "success");
      }
      
      setIsStatusModalOpen(false);
      setSelectedApplication(null);
      setRejectionReason("");
      await loadData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          "Failed to update status";
      showToast(errorMessage, "error");
    } finally {
      setUpdating(false);
    }
  };

  const getProgressPercentage = (status: ApplicationStatus): number => {
    switch (status) {
      case ApplicationStatus.SUBMITTED:
        return 20;
      case ApplicationStatus.IN_PROCESS:
        return 40;
      case ApplicationStatus.OFFER:
        return 80;
      case ApplicationStatus.HIRED:
        return 100;
      case ApplicationStatus.REJECTED:
        return 0;
      default:
        return 0;
    }
  };

  return (
    <ProtectedRoute
      allowedRoles={[SystemRole.HR_EMPLOYEE, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN]}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
              <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedRequisitionId}
                onChange={(e) => setSelectedRequisitionId(e.target.value)}
                className="w-64"
                options={[
                  { value: "", label: "All Job Requisitions" },
                  ...jobRequisitions.map((job) => ({
                    value: job._id,
                    label: job.template?.title || "Job Opening",
                  })),
                ]}
              />
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-48"
                options={[
                  { value: "", label: "All Statuses" },
                  { value: ApplicationStatus.SUBMITTED, label: "Submitted" },
                  { value: ApplicationStatus.IN_PROCESS, label: "In Process" },
                  { value: ApplicationStatus.OFFER, label: "Offer" },
                  { value: ApplicationStatus.HIRED, label: "Hired" },
                  { value: ApplicationStatus.REJECTED, label: "Rejected" },
                ]}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No applications found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const candidate = application.candidate || (typeof application.candidateId === 'object' ? application.candidateId : null);
              const candidateName = candidate?.fullName || candidate?.firstName || candidate?.lastName 
                ? `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim() || candidate?.fullName
                : typeof application.candidateId === 'string' ? application.candidateId : 'Unknown Candidate';
              const candidateEmail = candidate?.personalEmail || candidate?.email || 'N/A';
              const candidatePhone = candidate?.phoneNumber || candidate?.phone || 'N/A';
              
              return (
                <Card key={application._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.requisition?.template?.title || "Job Opening"}
                          </h3>
                          <StatusBadge status={application.status} type="application" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Candidate Information</p>
                            <p className="text-sm text-gray-900 font-medium">{candidateName}</p>
                            <p className="text-xs text-gray-600">{candidateEmail}</p>
                            <p className="text-xs text-gray-600">{candidatePhone}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Job Details</p>
                            <p className="text-sm text-gray-900">
                              {application.requisition?.template?.department || "N/A"}
                            </p>
                            <p className="text-xs text-gray-600">
                              Location: {application.requisition?.location || "N/A"}
                            </p>
                            {application.requisition?.openings && (
                              <p className="text-xs text-gray-600">
                                Openings: {application.requisition.openings}
                              </p>
                            )}
                          </div>
                        </div>

                        {(application.stage || application.currentStage) && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Current Stage</p>
                            <p className="text-sm text-gray-700">
                              {(application.stage || application.currentStage || '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                          </div>
                        )}

                        <div className="mt-3 mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span className="font-medium">Application Progress</span>
                            <span className="font-semibold">{getProgressPercentage(application.status)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full transition-all ${
                                application.status === ApplicationStatus.REJECTED
                                  ? 'bg-red-500'
                                  : application.status === ApplicationStatus.HIRED
                                  ? 'bg-green-500'
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${getProgressPercentage(application.status)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 pt-3 border-t">
                          {application.createdAt && (
                            <span>
                              Applied: {new Date(application.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          )}
                          {application.updatedAt && (
                            <span>
                              Last Updated: {new Date(application.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      {canUpdateStatus && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenStatusUpdate(application)}
                            disabled={application.status === ApplicationStatus.HIRED || application.status === ApplicationStatus.REJECTED}
                          >
                            Update Status
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Status Update Modal */}
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false);
            setRejectionReason("");
          }}
          title="Update Application Status"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <Select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value as ApplicationStatus)}
                options={[
                  { value: ApplicationStatus.SUBMITTED, label: "Submitted" },
                  { value: ApplicationStatus.IN_PROCESS, label: "In Process" },
                  { value: ApplicationStatus.OFFER, label: "Offer" },
                  { value: ApplicationStatus.HIRED, label: "Hired" },
                  { value: ApplicationStatus.REJECTED, label: "Rejected" },
                ]}
              />
            </div>

            {/* CHANGED - REC-022: Show rejection reason field when rejecting */}
            {statusUpdate === ApplicationStatus.REJECTED && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-red-800 mb-2">
                  Rejection Reason * (will be sent to candidate)
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a respectful reason for rejection. This will be included in the notification email sent to the candidate."
                  rows={4}
                  className="w-full"
                />
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ This message will be included in the automated rejection email to the candidate.
                </p>
              </div>
            )}

            {selectedApplication && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500 mb-1">Current Status</p>
                <StatusBadge status={selectedApplication.status} type="application" />
                <p className="text-xs text-gray-600 mt-2">
                  Candidate: {selectedApplication.candidate?.fullName || 
                    (typeof selectedApplication.candidateId === 'object' 
                      ? selectedApplication.candidateId?.fullName 
                      : selectedApplication.candidateId) || 
                    'Unknown'}
                </p>
                <p className="text-xs text-gray-600">
                  Position: {selectedApplication.requisition?.template?.title || 'N/A'}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setRejectionReason("");
                }}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateStatus}
                variant={statusUpdate === ApplicationStatus.REJECTED ? "danger" : "primary"}
                disabled={updating || !selectedApplication}
              >
                {updating 
                  ? "Updating..." 
                  : statusUpdate === ApplicationStatus.REJECTED 
                    ? "Reject Application" 
                    : "Update Status"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

