"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import { TerminationRequest, SubmitResignationDto } from "@/types/recruitment";
import { StatusBadge } from "@/components/recruitment/StatusBadge";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";

export default function EmployeeResignationPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [resignations, setResignations] = useState<TerminationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<SubmitResignationDto>({
    effectiveDate: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadResignations();
  }, []);

  const loadResignations = async () => {
    try {
      setLoading(true);
      const data = await recruitmentApi.getMyResignationRequests();
      setResignations(data);
    } catch (error: any) {
      showToast(error.message || "Failed to load resignation requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.effectiveDate) {
      newErrors.effectiveDate = "Effective date is required";
    } else {
      const selectedDate = new Date(formData.effectiveDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.effectiveDate = "Effective date cannot be in the past";
      }
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await recruitmentApi.submitResignation(formData);
      showToast("Resignation request submitted successfully", "success");
      setIsModalOpen(false);
      setFormData({ effectiveDate: "", reason: "" });
      setErrors({});
      loadResignations();
    } catch (error: any) {
      showToast(error.message || "Failed to submit resignation request", "error");
    } finally {
      setSubmitting(false);
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
            <h1 className="text-3xl font-bold text-gray-900">Resignation Requests</h1>
            <p className="text-gray-600 mt-1">Submit and track your resignation requests</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Submit Resignation</Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading resignation requests...</p>
        </div>
      ) : resignations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No resignation requests submitted.</p>
            <Button onClick={() => setIsModalOpen(true)}>Submit Resignation Request</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {resignations.map((resignation) => (
            <Card key={resignation._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">Resignation Request</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted: {resignation.createdAt ? formatDate(resignation.createdAt) : "N/A"}
                    </p>
                  </div>
                  <StatusBadge status={resignation.status} type="application" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Effective Date:</span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(resignation.effectiveDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 text-gray-900 capitalize">{resignation.status}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Reason:</span>
                    <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded">{resignation.reason}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Submit Resignation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({ effectiveDate: "", reason: "" });
          setErrors({});
        }}
        title="Submit Resignation Request"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setFormData({ effectiveDate: "", reason: "" });
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Resignation"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Effective Date *"
            type="date"
            value={formData.effectiveDate ? new Date(formData.effectiveDate).toISOString().split("T")[0] : ""}
            onChange={(e) => {
              // Convert date to ISO string for backend
              const date = e.target.value;
              if (date) {
                setFormData({ ...formData, effectiveDate: new Date(date).toISOString() });
              } else {
                setFormData({ ...formData, effectiveDate: "" });
              }
            }}
            error={errors.effectiveDate}
            min={new Date().toISOString().split("T")[0]}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Resignation *
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Please provide a reason for your resignation..."
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

