"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { SystemRole } from "@/types";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { recruitmentApi } from "@/lib/api/recruitment/recruitment";
import { JobTemplate } from "@/types/recruitment";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/shared/ui/Card";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Modal } from "@/components/leaves/Modal";
import { Toast, useToast } from "@/components/leaves/Toast";

export default function JobTemplatesPage() {
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    qualifications: [] as string[],
    skills: [] as string[],
  });
  const [qualificationInput, setQualificationInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const templates = await recruitmentApi.getJobTemplates();
      setJobTemplates(templates);
    } catch (error: any) {
      showToast(error.message || "Failed to load job templates", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({
      title: "",
      department: "",
      description: "",
      qualifications: [],
      skills: [],
    });
    setQualificationInput("");
    setSkillInput("");
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (template: JobTemplate) => {
    setIsEditMode(true);
    setEditingId(template._id);
    setFormData({
      title: template.title || "",
      department: template.department || "",
      description: template.description || "",
      qualifications: template.qualifications || [],
      skills: template.skills || [],
    });
    setQualificationInput("");
    setSkillInput("");
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = "Title is required";
    }
    if (!formData.department || formData.department.trim().length === 0) {
      newErrors.department = "Department is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditMode && editingId) {
        await recruitmentApi.updateJobTemplate(editingId, formData);
        showToast("Job template updated successfully", "success");
      } else {
        await recruitmentApi.createJobTemplate(formData);
        showToast("Job template created successfully", "success");
      }
      setIsModalOpen(false);
      loadTemplates();
    } catch (error: any) {
      showToast(error.message || `Failed to ${isEditMode ? "update" : "create"} job template`, "error");
    }
  };

  const addQualification = () => {
    if (qualificationInput.trim()) {
      setFormData({
        ...formData,
        qualifications: [...formData.qualifications, qualificationInput.trim()],
      });
      setQualificationInput("");
    }
  };

  const removeQualification = (index: number) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter((_, i) => i !== index),
    });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
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

        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard/recruitment" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Back to Recruitment
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Job Templates</h1>
            <p className="text-gray-600 mt-1">Create and manage standardized job description templates</p>
          </div>
          <Button onClick={handleOpenCreate}>Create Job Template</Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : jobTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No job templates found.</p>
              <Button onClick={handleOpenCreate}>Create Job Template</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobTemplates.map((template) => (
              <Card key={template._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{template.title}</CardTitle>
                      <CardDescription className="mt-1">{template.department}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {template.description || "No description available"}
                  </p>
                  
                  {template.qualifications && template.qualifications.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Qualifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.qualifications.slice(0, 3).map((q, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {q}
                          </span>
                        ))}
                        {template.qualifications.length > 3 && (
                          <span className="text-xs text-gray-500">+{template.qualifications.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {template.skills && template.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.skills.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {s}
                          </span>
                        ))}
                        {template.skills.length > 3 && (
                          <span className="text-xs text-gray-500">+{template.skills.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleOpenEdit(template)}
                  >
                    Edit Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isEditMode ? "Edit Job Template" : "Create Job Template"}
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Engineering, Sales, Marketing"
                />
                {errors.department && (
                  <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Job description and responsibilities..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualifications
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={qualificationInput}
                    onChange={(e) => setQualificationInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addQualification();
                      }
                    }}
                    placeholder="Add qualification (e.g., Bachelor's degree)"
                  />
                  <Button type="button" onClick={addQualification} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.qualifications.map((q, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {q}
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add skill (e.g., JavaScript, React)"
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((s, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
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
              <Button type="submit">
                {isEditMode ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
