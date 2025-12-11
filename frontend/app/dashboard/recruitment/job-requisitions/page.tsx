"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import { JobRequisition, JobTemplate, CreateJobRequisitionDto } from "@/types/recruitment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/leaves/Select";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";
import { StatusBadge } from "@/components/recruitment/StatusBadge";

export default function JobRequisitionsPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [jobRequisitions, setJobRequisitions] = useState<JobRequisition[]>([]);
  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateJobRequisitionDto>({
    templateId: "",
    openings: 1,
    location: "",
    hiringManagerId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // CHANGED - Only HR Manager and System Admin can create jobs (HR Employee can only preview/publish)
  const canCreateJobs = user?.roles?.some(
    (role) => String(role).toLowerCase() === "hr manager" || String(role).toLowerCase() === "system admin"
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobs, templates] = await Promise.all([
        recruitmentApi.getJobRequisitions(),
        recruitmentApi.getJobTemplates(),
      ]);
      setJobRequisitions(jobs);
      setJobTemplates(templates);
    } catch (error: any) {
      showToast(error.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      templateId: "",
      openings: 1,
      location: "",
      hiringManagerId: "",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.templateId) newErrors.templateId = "Job template is required";
    if (!formData.openings || formData.openings < 1) newErrors.openings = "Openings must be at least 1";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await recruitmentApi.createJobRequisition(formData);
      showToast("Job requisition created successfully", "success");
      setIsModalOpen(false);
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to create job requisition", "error");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await recruitmentApi.publishJobRequisition(id);
      showToast("Job requisition published successfully", "success");
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to publish job requisition", "error");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await recruitmentApi.updateJobRequisitionStatus(id, status);
      showToast("Status updated successfully", "success");
      loadData();
    } catch (error: any) {
      showToast(error.message || "Failed to update status", "error");
    }
  };

  return (
    // CHANGED - REC-023: HR Employee can also preview and publish jobs
    <ProtectedRoute allowedRoles={[SystemRole.HR_MANAGER, SystemRole.HR_EMPLOYEE, SystemRole.SYSTEM_ADMIN]}>
      <div className="container mx-auto px-6 py-8">
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />

        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard/recruitment" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Back to Recruitment
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Job Requisitions</h1>
            <p className="text-gray-600 mt-1">Preview and publish job postings</p>
          </div>
          {/* CHANGED - Only show Create button for HR Manager/System Admin */}
          {canCreateJobs && (
            <Button onClick={handleOpenCreate}>Create Job Requisition</Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : jobRequisitions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No job requisitions found.</p>
              {/* CHANGED - Only show Create button for HR Manager/System Admin */}
              {canCreateJobs && (
                <Button onClick={handleOpenCreate}>Create Job Requisition</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobRequisitions.map((job) => (
              <Card key={job._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {job.template?.title || "Job Opening"}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {job.template?.department || "Department"} • {job.location || "Location TBD"}
                      </CardDescription>
                    </div>
                    <StatusBadge status={job.status} type="application" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {job.template?.description || "No description available"}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Openings:</span>
                      {/* CHANGED - Added text-gray-900 for visibility */}
                      <span className="font-medium text-gray-900">{job.openings}</span>
                    </div>
                    {/* CHANGED - Using publishStatus instead of published boolean */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      {/* CHANGED - Check publishStatus instead of published */}
                      <span className={job.publishStatus === 'published' ? "text-green-600" : job.publishStatus === 'closed' ? "text-red-600" : "text-gray-400"}>
                        {job.publishStatus === 'published' ? "Published" : job.publishStatus === 'closed' ? "Closed" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/recruitment/jobs/${job._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">View</Button>
                    </Link>
                    {/* CHANGED - Check publishStatus === 'draft' instead of !job.published */}
                    {job.publishStatus === 'draft' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePublish(job._id)}
                      >
                        Publish
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Job Requisition"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Template *
                </label>
                <Select
                  value={formData.templateId}
                  onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                  placeholder="Select a template"
                  options={[
                    { value: "", label: "Select a template" },
                    ...jobTemplates.map((template) => ({
                      value: template._id,
                      label: `${template.title} - ${template.department}`,
                    })),
                  ]}
                />
                {errors.templateId && (
                  <p className="text-red-500 text-xs mt-1">{errors.templateId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Openings *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.openings}
                  onChange={(e) => setFormData({ ...formData, openings: parseInt(e.target.value) || 1 })}
                />
                {errors.openings && (
                  <p className="text-red-500 text-xs mt-1">{errors.openings}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., New York, Remote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hiring Manager ID (Optional)
                </label>
                <Input
                  value={formData.hiringManagerId || ""}
                  onChange={(e) => setFormData({ ...formData, hiringManagerId: e.target.value })}
                  placeholder="Employee ID"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}

