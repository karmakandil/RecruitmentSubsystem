"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import {
  Offer,
  CreateOfferDto,
  FinalizeOfferDto,
  OfferFinalStatus,
  CreateEmployeeFromContractDto,
} from "@/types/recruitment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/leaves/Select";
import { Textarea } from "@/components/leaves/Textarea";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";
import { StatusBadge } from "@/components/recruitment/StatusBadge";

export default function HROffersPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [createForm, setCreateForm] = useState<CreateOfferDto>({
    applicationId: "",
    candidateId: "",
    grossSalary: 0,
    signingBonus: 0,
    benefits: [],
    deadline: "",
  });
  const [finalizeForm, setFinalizeForm] = useState<FinalizeOfferDto>({
    finalStatus: OfferFinalStatus.PENDING,
  });
  const [employeeForm, setEmployeeForm] = useState<CreateEmployeeFromContractDto>({
    startDate: "",
    workEmail: "",
    employeeNumber: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const apps = await recruitmentApi.getApplications();
      setApplications(apps.filter((app) => app.status === "offer" || app.status === "in_process"));
      // In a real implementation, you would fetch offers from an endpoint
    } catch (error: any) {
      showToast(error.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = (application: any) => {
    setCreateForm({
      applicationId: application._id,
      candidateId: application.candidateId,
      grossSalary: 0,
      signingBonus: 0,
      benefits: [],
      deadline: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recruitmentApi.createOffer(createForm);
      showToast("Offer created successfully", "success");
      setIsCreateModalOpen(false);
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to create offer", "error");
    }
  };

  const handleOpenFinalize = (offer: Offer) => {
    setSelectedOffer(offer);
    setFinalizeForm({ finalStatus: offer.finalStatus || OfferFinalStatus.PENDING });
    setIsFinalizeModalOpen(true);
  };

  const handleFinalizeOffer = async () => {
    if (!selectedOffer) return;
    try {
      await recruitmentApi.finalizeOffer(selectedOffer._id, finalizeForm);
      showToast("Offer finalized successfully", "success");
      setIsFinalizeModalOpen(false);
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to finalize offer", "error");
    }
  };

  const handleOpenCreateEmployee = (offer: Offer) => {
    setSelectedOffer(offer);
    setEmployeeForm({
      startDate: "",
      workEmail: "",
      employeeNumber: "",
    });
    setIsEmployeeModalOpen(true);
  };

  const handleCreateEmployee = async () => {
    if (!selectedOffer) return;
    try {
      await recruitmentApi.createEmployeeFromContract(selectedOffer._id, employeeForm);
      showToast("Employee created successfully", "success");
      setIsEmployeeModalOpen(false);
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to create employee", "error");
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-gray-600 mt-1">Create and manage job offers</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {application.requisition?.template?.title || "Job Opening"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Candidate: {application.candidate?.fullName || application.candidateId}
                      </p>
                      <StatusBadge status={application.status} type="application" />
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenCreate(application)}
                      >
                        Create Offer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Offer Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Job Offer"
        >
          <form onSubmit={handleCreateOffer}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gross Salary *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={createForm.grossSalary}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, grossSalary: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Signing Bonus
                </label>
                <Input
                  type="number"
                  min="0"
                  value={createForm.signingBonus || 0}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, signingBonus: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Deadline *
                </label>
                <Input
                  type="datetime-local"
                  value={createForm.deadline ? new Date(createForm.deadline).toISOString().slice(0, 16) : ""}
                  onChange={(e) => {
                    // Convert local datetime to ISO string for backend
                    const localDate = e.target.value;
                    if (localDate) {
                      const date = new Date(localDate);
                      setCreateForm({ ...createForm, deadline: date.toISOString() });
                    } else {
                      setCreateForm({ ...createForm, deadline: "" });
                    }
                  }}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Offer</Button>
            </div>
          </form>
        </Modal>

        {/* Finalize Offer Modal */}
        <Modal
          isOpen={isFinalizeModalOpen}
          onClose={() => setIsFinalizeModalOpen(false)}
          title="Finalize Offer"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Final Status *
              </label>
              <Select
                value={finalizeForm.finalStatus}
                onChange={(e) =>
                  setFinalizeForm({ ...finalizeForm, finalStatus: e.target.value as OfferFinalStatus })
                }
                options={[
                  { value: OfferFinalStatus.APPROVED, label: "Approved" },
                  { value: OfferFinalStatus.REJECTED, label: "Rejected" },
                  { value: OfferFinalStatus.PENDING, label: "Pending" },
                ]}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFinalizeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleFinalizeOffer}>Finalize</Button>
            </div>
          </div>
        </Modal>

        {/* Create Employee Modal */}
        <Modal
          isOpen={isEmployeeModalOpen}
          onClose={() => setIsEmployeeModalOpen(false)}
          title="Create Employee from Contract"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <Input
                type="date"
                value={employeeForm.startDate}
                onChange={(e) => setEmployeeForm({ ...employeeForm, startDate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Email
              </label>
              <Input
                type="email"
                value={employeeForm.workEmail || ""}
                onChange={(e) => setEmployeeForm({ ...employeeForm, workEmail: e.target.value })}
                placeholder="employee@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Number
              </label>
              <Input
                value={employeeForm.employeeNumber || ""}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, employeeNumber: e.target.value })
                }
                placeholder="EMP001"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEmployeeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateEmployee}>Create Employee</Button>
            </div>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

