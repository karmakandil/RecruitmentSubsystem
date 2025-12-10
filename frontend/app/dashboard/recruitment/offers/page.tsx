"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import { Offer, OfferResponseStatus, DocumentType } from "@/types/recruitment";
import { StatusBadge } from "@/components/recruitment/StatusBadge";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";

export default function OffersPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"contract" | "form">("contract");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const applications = await recruitmentApi.getApplications();
      const candidateApplications = applications.filter(
        (app) => app.candidateId === user?.id || app.candidateId === user?.userId
      );
      
      const offerApplications = candidateApplications.filter(
        (app) => app.status === "offer"
      );

      const offerData: Offer[] = offerApplications.map((app) => ({
        _id: `offer-${app._id}`,
        applicationId: app._id,
        application: app,
        candidateId: app.candidateId,
        grossSalary: 0,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        applicantResponse: OfferResponseStatus.PENDING,
      }));

      setOffers(offerData);
    } catch (error: any) {
      showToast(error.message || "Failed to load offers", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToOffer = async (offer: Offer, response: OfferResponseStatus) => {
    try {
      await recruitmentApi.respondToOffer(offer._id, {
        applicantResponse: response,
      });
      showToast(
        response === OfferResponseStatus.ACCEPTED
          ? "Offer accepted successfully"
          : "Offer declined",
        "success"
      );
      setIsResponseModalOpen(false);
      loadOffers();
    } catch (error: any) {
      showToast(error.message || "Failed to respond to offer", "error");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedOffer || !selectedFile) {
      showToast("Please select a file", "error");
      return;
    }

    try {
      setUploading(true);
      if (uploadType === "contract") {
        await recruitmentApi.uploadContractDocument(
          selectedOffer._id,
          selectedFile,
          DocumentType.CONTRACT
        );
        showToast("Contract uploaded successfully", "success");
      } else {
        await recruitmentApi.uploadCandidateForm(
          selectedOffer._id,
          selectedFile,
          DocumentType.ID
        );
        showToast("Form uploaded successfully", "success");
      }
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      loadOffers();
    } catch (error: any) {
      showToast(error.message || "Failed to upload document", "error");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Job Offers</h1>
          <p className="text-gray-600 mt-1">Review and respond to job offers</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No job offers at this time.</p>
              <Link href="/dashboard/recruitment">
                <button className="text-blue-600 hover:underline">View your applications</button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {offers.map((offer) => (
              <Card key={offer._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {offer.application?.requisition?.template?.title || "Job Offer"}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {offer.application?.requisition?.template?.department || "Department"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge
                        status={offer.applicantResponse || "pending"}
                        type="application"
                      />
                      {offer.deadline && (
                        <span className="text-xs text-gray-500">
                          Deadline: {formatDate(offer.deadline)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {offer.grossSalary > 0 && (
                      <div>
                        <span className="text-sm text-gray-500">Gross Salary:</span>
                        <span className="ml-2 text-lg font-semibold text-gray-900">
                          ${offer.grossSalary.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {offer.benefits && offer.benefits.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500">Benefits:</span>
                        <ul className="mt-1 list-disc list-inside text-sm text-gray-700">
                          {offer.benefits.map((benefit, idx) => (
                            <li key={idx}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {offer.content && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{offer.content}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t flex gap-3">
                      {offer.applicantResponse === OfferResponseStatus.PENDING && (
                        <>
                          <Button
                            onClick={() => {
                              setSelectedOffer(offer);
                              setIsResponseModalOpen(true);
                            }}
                          >
                            Respond to Offer
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedOffer(offer);
                              setUploadType("contract");
                              setIsUploadModalOpen(true);
                            }}
                          >
                            Upload Contract
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedOffer(offer);
                              setUploadType("form");
                              setIsUploadModalOpen(true);
                            }}
                          >
                            Upload Forms
                          </Button>
                        </>
                      )}
                      {offer.applicantResponse === OfferResponseStatus.ACCEPTED && (
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedOffer(offer);
                              setUploadType("contract");
                              setIsUploadModalOpen(true);
                            }}
                          >
                            Upload Contract
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedOffer(offer);
                              setUploadType("form");
                              setIsUploadModalOpen(true);
                            }}
                          >
                            Upload Forms
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Response Modal */}
        <Modal
          isOpen={isResponseModalOpen}
          onClose={() => setIsResponseModalOpen(false)}
          title="Respond to Offer"
          size="md"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsResponseModalOpen(false)}>
                Cancel
              </Button>
              {selectedOffer && (
                <>
                  <Button
                    onClick={() =>
                      handleRespondToOffer(selectedOffer, OfferResponseStatus.ACCEPTED)
                    }
                  >
                    Accept Offer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleRespondToOffer(selectedOffer, OfferResponseStatus.REJECTED)
                    }
                  >
                    Decline Offer
                  </Button>
                </>
              )}
            </>
          }
        >
          <p className="text-gray-700">
            Are you sure you want to{" "}
            {selectedOffer?.applicantResponse === OfferResponseStatus.ACCEPTED
              ? "accept"
              : "respond to"}{" "}
            this offer?
          </p>
        </Modal>

        {/* Upload Modal */}
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => {
            setIsUploadModalOpen(false);
            setSelectedFile(null);
          }}
          title={uploadType === "contract" ? "Upload Contract" : "Upload Candidate Form"}
          size="md"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Select File"
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
            )}
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

