"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import {
  Application,
  ApplicationStatus,
  UpdateApplicationStatusDto,
  Offer,
  OfferFinalStatus,
  OfferResponseStatus,
  FinalizeOfferDto,
  CreateOfferDto,
} from "@/types/recruitment";
import { Textarea } from "@/components/leaves/Textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";
import { StatusBadge } from "@/components/recruitment/StatusBadge";

export default function JobOffersApprovalsPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [offers, setOffers] = useState<Record<string, Offer>>({});
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [candidateAssessments, setCandidateAssessments] = useState<{
    interviewScores: Record<string, number>;
    interviewFeedback: Record<string, any[]>;
    rankedData?: any;
  }>({
    interviewScores: {},
    interviewFeedback: {},
  });
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectApplicationModalOpen, setIsRejectApplicationModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [creatingOffer, setCreatingOffer] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const hasInterviewFeedback = (application: Application): boolean => {
    const interviews = (application as any).interviews || [];
    return interviews.some((int: any) => {
      // Check if interview has feedback submitted
      return int.status === 'scheduled' || int.status === 'completed';
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      // Get all applications
      const allApps = await recruitmentApi.getApplications();
      
      // Filter applications that need HR Manager review:
      // 1. Applications with status "offer" - these already have offers and need approval
      // 2. Applications with status "in_process" that have interview feedback - these need offer creation
      const offerApps = allApps.filter((app) => {
        if (app.status === "offer") return true;
        if (app.status === ApplicationStatus.IN_PROCESS && hasInterviewFeedback(app)) return true;
        return false;
      });
      setApplications(offerApps);

      // Load offers for these applications
      const offerMap: Record<string, Offer> = {};
      for (const app of offerApps) {
        try {
          const offer = await recruitmentApi.getOfferByApplicationId(app._id);
          if (offer && offer._id) {
            offerMap[app._id] = offer;
          }
        } catch (error: any) {
          // 404 is expected if offer doesn't exist yet
          if (error?.response?.status !== 404) {
            console.error(`Error loading offer for application ${app._id}:`, error);
          }
        }
      }
      setOffers(offerMap);
    } catch (error: any) {
      showToast(error.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadCandidateAssessments = async (application: Application) => {
    try {
      setLoadingAssessments(true);
      
      // Get ranked applications for this requisition
      let rankedData = null;
      if (application.requisitionId) {
        try {
          const ranked = await recruitmentApi.getRankedApplications(application.requisitionId);
          rankedData = ranked.find((app: any) => app._id === application._id);
        } catch (error) {
          console.log("Could not load ranked applications:", error);
        }
      }
      
      // Get interviews for this application
      const interviews = (application as any).interviews || [];
      const scores: Record<string, number> = {};
      const feedback: Record<string, any[]> = {};
      
      for (const interview of interviews) {
        const interviewId = interview._id;
        try {
          const avgScore = await recruitmentApi.getInterviewAverageScore(interviewId);
          scores[interviewId] = avgScore;
          
          const interviewFeedback = await recruitmentApi.getInterviewFeedback(interviewId);
          feedback[interviewId] = Array.isArray(interviewFeedback) ? interviewFeedback : [];
        } catch (error) {
          console.log(`Could not load data for interview ${interviewId}:`, error);
        }
      }
      
      setCandidateAssessments({
        interviewScores: scores,
        interviewFeedback: feedback,
        rankedData,
      });
    } catch (error) {
      console.error("Error loading candidate assessments:", error);
    } finally {
      setLoadingAssessments(false);
    }
  };

  const handleViewOffer = async (application: Application) => {
    setSelectedApplication(application);
    const offer = offers[application._id];
    setSelectedOffer(offer || null);
    await loadCandidateAssessments(application);
    setIsViewModalOpen(true);
  };

  const handleApprove = (application: Application) => {
    const offer = offers[application._id];
    if (!offer) {
      showToast("Offer not found for this application", "error");
      return;
    }
    
    // Check if candidate has responded
    if (offer.applicantResponse === OfferResponseStatus.PENDING) {
      showToast("Cannot approve: Candidate has not responded to the offer yet", "error");
      return;
    }
    
    setSelectedApplication(application);
    setSelectedOffer(offer);
    setIsApproveModalOpen(true);
  };

  const handleReject = (application: Application) => {
    const offer = offers[application._id];
    if (offer) {
      // Reject existing offer
      setSelectedApplication(application);
      setSelectedOffer(offer);
      setIsRejectModalOpen(true);
    } else {
      // Reject application directly (before offer creation)
      setSelectedApplication(application);
      setRejectionReason("");
      setIsRejectApplicationModalOpen(true);
    }
  };

  const handleAcceptApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsAcceptModalOpen(true);
  };

  const confirmAcceptApplication = async () => {
    if (!selectedApplication) return;

    try {
      setCreatingOffer(true);
      
      const candidateId = typeof selectedApplication.candidateId === 'object' 
        ? selectedApplication.candidateId?._id 
        : selectedApplication.candidateId;

      if (!candidateId) {
        showToast("Candidate ID not found", "error");
        return;
      }

      // Create a basic offer
      const offerData: CreateOfferDto = {
        applicationId: selectedApplication._id,
        candidateId: candidateId as string,
        grossSalary: 0, // HR Manager will need to set this - or we could add a form
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };

      const createdOffer = await recruitmentApi.createOffer(offerData);

      // Update application status to "offer"
      await recruitmentApi.updateApplicationStatus(selectedApplication._id, {
        status: ApplicationStatus.OFFER,
      });

      showToast("Application approved and offer created successfully. Please update offer details.", "success");
      setIsAcceptModalOpen(false);
      setSelectedApplication(null);
      await loadData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          "Failed to create offer";
      showToast(errorMessage, "error");
    } finally {
      setCreatingOffer(false);
    }
  };

  const confirmRejectApplication = async () => {
    if (!selectedApplication) return;

    if (!rejectionReason.trim()) {
      showToast("Please provide a rejection reason", "error");
      return;
    }

    try {
      setProcessing(true);
      
      await recruitmentApi.updateApplicationStatus(selectedApplication._id, {
        status: ApplicationStatus.REJECTED,
        rejectionReason: rejectionReason.trim(),
      });

      showToast("Application rejected successfully", "success");
      setIsRejectApplicationModalOpen(false);
      setSelectedApplication(null);
      setRejectionReason("");
      await loadData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          "Failed to reject application";
      showToast(errorMessage, "error");
    } finally {
      setProcessing(false);
    }
  };

  const confirmApprove = async () => {
    if (!selectedOffer) return;

    try {
      setProcessing(true);
      const finalizeData: FinalizeOfferDto = {
        finalStatus: OfferFinalStatus.APPROVED,
      };
      
      await recruitmentApi.finalizeOffer(selectedOffer._id, finalizeData);
      showToast("Offer approved successfully", "success");
      setIsApproveModalOpen(false);
      setSelectedApplication(null);
      setSelectedOffer(null);
      await loadData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          "Failed to approve offer";
      showToast(errorMessage, "error");
    } finally {
      setProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedOffer) return;

    try {
      setProcessing(true);
      const finalizeData: FinalizeOfferDto = {
        finalStatus: OfferFinalStatus.REJECTED,
      };
      
      await recruitmentApi.finalizeOffer(selectedOffer._id, finalizeData);
      showToast("Offer rejected successfully", "success");
      setIsRejectModalOpen(false);
      setSelectedApplication(null);
      setSelectedOffer(null);
      await loadData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          error?.message || 
                          "Failed to reject offer";
      showToast(errorMessage, "error");
    } finally {
      setProcessing(false);
    }
  };

  const getCandidateName = (application: Application): string => {
    const candidate = application.candidate || 
                     (typeof application.candidateId === 'object' ? application.candidateId : null);
    if (candidate) {
      return candidate.firstName && candidate.lastName
        ? `${candidate.firstName} ${candidate.lastName}`
        : candidate.fullName || candidate.name || "Unknown Candidate";
    }
    return "Unknown Candidate";
  };

  const getJobTitle = (application: Application): string => {
    return application.requisition?.template?.title || 
           (typeof application.requisition === 'object' && application.requisition?.template?.title) ||
           "Unknown Position";
  };

  return (
    <ProtectedRoute allowedRoles={[SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN]}>
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
          <h1 className="text-3xl font-bold text-gray-900">Job Offers and Approvals</h1>
          <p className="text-gray-600 mt-1">
            Review interview feedback and approve/reject applications. Create offers for approved candidates.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading offers...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No applications pending review.</p>
              <p className="text-sm text-gray-400">
                Applications with interview feedback or status "offer" will appear here for your review.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => {
              const offer = offers[application._id];
              const candidateName = getCandidateName(application);
              const jobTitle = getJobTitle(application);
              const needsReview = hasInterviewFeedback(application) && application.status === ApplicationStatus.IN_PROCESS;
              
              return (
                <Card key={application._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{candidateName}</CardTitle>
                        <CardDescription className="mt-1">{jobTitle}</CardDescription>
                        {needsReview && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                            Interview Feedback Available
                          </span>
                        )}
                      </div>
                      <StatusBadge status={application.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {offer ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Offer Status:</span>
                          <span className={`font-medium ${
                            offer.finalStatus === OfferFinalStatus.APPROVED ? "text-green-600" :
                            offer.finalStatus === OfferFinalStatus.REJECTED ? "text-red-600" :
                            "text-yellow-600"
                          }`}>
                            {offer.finalStatus === OfferFinalStatus.APPROVED ? "Approved" :
                             offer.finalStatus === OfferFinalStatus.REJECTED ? "Rejected" :
                             "Pending Approval"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Candidate Response:</span>
                          <span className={`font-medium ${
                            offer.applicantResponse === OfferResponseStatus.ACCEPTED ? "text-green-600" :
                            offer.applicantResponse === OfferResponseStatus.REJECTED ? "text-red-600" :
                            "text-yellow-600"
                          }`}>
                            {offer.applicantResponse === OfferResponseStatus.ACCEPTED ? "Accepted" :
                             offer.applicantResponse === OfferResponseStatus.REJECTED ? "Rejected" :
                             "Pending"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Salary:</span>
                          <span className="font-medium">${offer.grossSalary?.toLocaleString() || "N/A"}</span>
                        </div>
                        {offer.signingBonus && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Signing Bonus:</span>
                            <span className="font-medium">${offer.signingBonus.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    ) : needsReview ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800 font-medium">
                          Ready for Review - Interview feedback has been submitted
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Offer details not available</p>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOffer(application)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      {needsReview && !offer && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptApplication(application)}
                            className="flex-1 text-green-600 hover:text-green-700"
                            disabled={creatingOffer}
                          >
                            {creatingOffer ? "Creating..." : "Approve & Create Offer"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(application)}
                            className="flex-1 text-red-600 hover:text-red-700"
                            disabled={processing}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {offer && offer.finalStatus === OfferFinalStatus.PENDING && (
                        <>
                          {offer.applicantResponse !== OfferResponseStatus.PENDING && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(application)}
                                className="flex-1 text-green-600 hover:text-green-700"
                                disabled={processing}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(application)}
                                className="flex-1 text-red-600 hover:text-red-700"
                                disabled={processing}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* View Offer Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedApplication(null);
            setSelectedOffer(null);
          }}
          title={selectedOffer ? "Offer Details" : "Application Details"}
          size="lg"
        >
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Candidate</label>
                  <p className="text-gray-900">{getCandidateName(selectedApplication)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Position</label>
                  <p className="text-gray-900">{getJobTitle(selectedApplication)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Application Status</label>
                  <StatusBadge status={selectedApplication.status} />
                </div>
              </div>

              {selectedOffer && (
                <>
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Offer Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Gross Salary</label>
                        <p className="text-gray-900">${selectedOffer.grossSalary?.toLocaleString() || "N/A"}</p>
                      </div>
                      {selectedOffer.signingBonus && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Signing Bonus</label>
                          <p className="text-gray-900">${selectedOffer.signingBonus.toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-700">Candidate Response</label>
                        <p className={`font-medium ${
                          selectedOffer.applicantResponse === OfferResponseStatus.ACCEPTED ? "text-green-600" :
                          selectedOffer.applicantResponse === OfferResponseStatus.REJECTED ? "text-red-600" :
                          "text-yellow-600"
                        }`}>
                          {selectedOffer.applicantResponse === OfferResponseStatus.ACCEPTED ? "Accepted" :
                           selectedOffer.applicantResponse === OfferResponseStatus.REJECTED ? "Rejected" :
                           "Pending"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Final Status</label>
                        <p className={`font-medium ${
                          selectedOffer.finalStatus === OfferFinalStatus.APPROVED ? "text-green-600" :
                          selectedOffer.finalStatus === OfferFinalStatus.REJECTED ? "text-red-600" :
                          "text-yellow-600"
                        }`}>
                          {selectedOffer.finalStatus === OfferFinalStatus.APPROVED ? "Approved" :
                           selectedOffer.finalStatus === OfferFinalStatus.REJECTED ? "Rejected" :
                           "Pending"}
                        </p>
                      </div>
                    </div>

                    {selectedOffer.benefits && selectedOffer.benefits.length > 0 && (
                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700">Benefits</label>
                        <ul className="list-disc list-inside text-gray-900">
                          {selectedOffer.benefits.map((benefit, idx) => (
                            <li key={idx}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedOffer.content && (
                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700">Offer Content</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedOffer.content}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {loadingAssessments ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading candidate assessments...</p>
                </div>
              ) : (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Interview Feedback</h3>
                  {candidateAssessments.rankedData && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Ranking Score: <span className="font-medium">{candidateAssessments.rankedData.rankingScore || "N/A"}</span>
                      </p>
                    </div>
                  )}
                  {Object.keys(candidateAssessments.interviewScores).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(candidateAssessments.interviewScores).map(([interviewId, score]) => {
                        const feedbackList = candidateAssessments.interviewFeedback[interviewId] || [];
                        const interview = selectedApplication && (selectedApplication as any).interviews?.find((int: any) => int._id === interviewId);
                        
                        return (
                          <div key={interviewId} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">
                                {interview?.stage?.replace("_", " ").toUpperCase() || "Interview"}
                              </h4>
                              <div className="bg-blue-50 px-3 py-1 rounded-lg">
                                <span className="text-sm font-bold text-blue-600">
                                  Average Score: {score.toFixed(1)}/100
                                </span>
                              </div>
                            </div>
                            {feedbackList.length > 0 ? (
                              <div className="space-y-2 mt-3">
                                <p className="text-sm font-medium text-gray-700">Panel Feedback:</p>
                                {feedbackList.map((fb: any, idx: number) => (
                                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-900">
                                        Interviewer {idx + 1}
                                      </span>
                                      <span className="text-sm font-semibold text-gray-700">
                                        Score: {fb.score || 0}/100
                                      </span>
                                    </div>
                                    {fb.comments && (
                                      <p className="text-sm text-gray-700 mt-2">
                                        <span className="font-medium">Comments:</span> {fb.comments}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 mt-2">No detailed feedback available</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">No interview scores available</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Action buttons for applications without offers */}
              {!selectedOffer && hasInterviewFeedback(selectedApplication) && (
                <div className="border-t pt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleAcceptApplication(selectedApplication);
                    }}
                    disabled={creatingOffer}
                    className="text-green-600 hover:text-green-700"
                  >
                    {creatingOffer ? "Creating..." : "Approve & Create Offer"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleReject(selectedApplication);
                    }}
                    disabled={processing}
                    className="text-red-600 hover:text-red-700"
                  >
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Approve Confirmation Modal */}
        <Modal
          isOpen={isApproveModalOpen}
          onClose={() => {
            setIsApproveModalOpen(false);
            setSelectedApplication(null);
            setSelectedOffer(null);
          }}
          title="Approve Offer"
        >
          {selectedOffer && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to approve this offer? This will finalize the offer and 
                the candidate will be marked as hired if they have accepted the offer.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsApproveModalOpen(false);
                    setSelectedApplication(null);
                    setSelectedOffer(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmApprove}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing ? "Approving..." : "Approve Offer"}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Accept Application Modal (Create Offer) */}
        <Modal
          isOpen={isAcceptModalOpen}
          onClose={() => {
            setIsAcceptModalOpen(false);
            setSelectedApplication(null);
          }}
          title="Approve Application & Create Offer"
        >
          {selectedApplication && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to approve this application and create an offer? This will:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                <li>Create a new offer for the candidate</li>
                <li>Update the application status to "offer"</li>
                <li>Make the offer visible to the candidate</li>
              </ul>
              <p className="text-sm text-amber-600 font-medium">
                Note: You will need to update the offer details (salary, benefits, etc.) after creation.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAcceptModalOpen(false);
                    setSelectedApplication(null);
                  }}
                  disabled={creatingOffer}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAcceptApplication}
                  disabled={creatingOffer}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {creatingOffer ? "Creating Offer..." : "Approve & Create Offer"}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Reject Offer Modal */}
        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => {
            setIsRejectModalOpen(false);
            setSelectedApplication(null);
            setSelectedOffer(null);
          }}
          title="Reject Offer"
        >
          {selectedOffer && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to reject this offer? The application status will be updated 
                and the candidate will be notified. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setSelectedApplication(null);
                    setSelectedOffer(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmReject}
                  disabled={processing}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {processing ? "Rejecting..." : "Reject Offer"}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Reject Application Modal */}
        <Modal
          isOpen={isRejectApplicationModalOpen}
          onClose={() => {
            setIsRejectApplicationModalOpen(false);
            setSelectedApplication(null);
            setRejectionReason("");
          }}
          title="Reject Application"
        >
          {selectedApplication && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to reject this application? The candidate will be notified 
                with the reason you provide below. This action cannot be undone.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason * (will be sent to candidate)
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a respectful reason for rejection. This will be included in the notification email sent to the candidate."
                  rows={4}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This message will be included in the automated rejection email to the candidate.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRejectApplicationModalOpen(false);
                    setSelectedApplication(null);
                    setRejectionReason("");
                  }}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmRejectApplication}
                  disabled={processing || !rejectionReason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {processing ? "Rejecting..." : "Reject Application"}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

