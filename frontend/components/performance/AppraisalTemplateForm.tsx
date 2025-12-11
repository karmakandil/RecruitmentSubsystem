"use client";

import { useState, useEffect } from "react";
import {
  AppraisalTemplate,
  CreateAppraisalTemplateDto,
  UpdateAppraisalTemplateDto,
  AppraisalTemplateType,
  AppraisalRatingScaleType,
  EvaluationCriterion,
  RatingScaleDefinition,
  Department,
  Position,
} from "@/types/performance";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/leaves/Select";
import { Textarea } from "@/components/leaves/Textarea";
import { Button } from "@/components/shared/ui/Button";
import { organizationStructureApi } from "@/lib/api/organization-structure/organization-structure";

interface AppraisalTemplateFormProps {
  template?: AppraisalTemplate | null;
  onSubmit: (data: CreateAppraisalTemplateDto | UpdateAppraisalTemplateDto) => Promise<void>;
  onCancel: () => void;
}

export function AppraisalTemplateForm({
  template,
  onSubmit,
  onCancel,
}: AppraisalTemplateFormProps) {
  const [formData, setFormData] = useState<CreateAppraisalTemplateDto>({
    name: "",
    description: "",
    templateType: AppraisalTemplateType.ANNUAL,
    ratingScale: {
      type: AppraisalRatingScaleType.FIVE_POINT,
      min: 1,
      max: 5,
      step: 1,
    },
    criteria: [],
    instructions: "",
    applicableDepartmentIds: [],
    applicablePositionIds: [],
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizationData();
    if (template) {
      loadTemplateData();
    }
  }, [template]);

  const loadOrganizationData = async () => {
    try {
      const [depts, pos] = await Promise.all([
        organizationStructureApi.getAllDepartments(true),
        organizationStructureApi.getAllPositions(undefined, true),
      ]);
      setDepartments(depts);
      setPositions(pos);
    } catch (error: any) {
      console.error("Failed to load organization data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplateData = () => {
    if (!template) return;

    setFormData({
      name: template.name,
      description: template.description || "",
      templateType: template.templateType,
      ratingScale: template.ratingScale,
      criteria: template.criteria || [],
      instructions: template.instructions || "",
      applicableDepartmentIds: template.applicableDepartmentIds || [],
      applicablePositionIds: template.applicablePositionIds || [],
    });
    setSelectedDepartments(template.applicableDepartmentIds || []);
    setSelectedPositions(template.applicablePositionIds || []);
  };

  const handleScaleTypeChange = (type: AppraisalRatingScaleType) => {
    let min = 1;
    let max = 5;
    let step = 1;
    let labels: string[] = [];

    switch (type) {
      case AppraisalRatingScaleType.THREE_POINT:
        min = 1;
        max = 3;
        step = 1;
        labels = ["Below Expectations", "Meets Expectations", "Exceeds Expectations"];
        break;
      case AppraisalRatingScaleType.FIVE_POINT:
        min = 1;
        max = 5;
        step = 1;
        labels = [
          "Poor",
          "Below Average",
          "Average",
          "Good",
          "Excellent",
        ];
        break;
      case AppraisalRatingScaleType.TEN_POINT:
        min = 1;
        max = 10;
        step = 1;
        break;
    }

    setFormData({
      ...formData,
      ratingScale: {
        type,
        min,
        max,
        step,
        labels: labels.length > 0 ? labels : undefined,
      },
    });
  };

  const addCriterion = () => {
    const newCriterion: EvaluationCriterion = {
      key: `criterion_${Date.now()}`,
      title: "",
      details: "",
      weight: 0,
      required: true,
    };
    setFormData({
      ...formData,
      criteria: [...formData.criteria, newCriterion],
    });
  };

  const removeCriterion = (index: number) => {
    const newCriteria = formData.criteria.filter((_, i) => i !== index);
    setFormData({ ...formData, criteria: newCriteria });
  };

  const updateCriterion = (index: number, field: keyof EvaluationCriterion, value: any) => {
    const newCriteria = [...formData.criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setFormData({ ...formData, criteria: newCriteria });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
    }

    if (formData.criteria.length === 0) {
      newErrors.criteria = "At least one evaluation criterion is required";
    }

    // Validate criteria
    formData.criteria.forEach((criterion, index) => {
      if (!criterion.title.trim()) {
        newErrors[`criterion_${index}_title`] = "Criterion title is required";
      }
      if (criterion.weight !== undefined && (criterion.weight < 0 || criterion.weight > 100)) {
        newErrors[`criterion_${index}_weight`] = "Weight must be between 0 and 100";
      }
    });

    // Validate weights sum
    const totalWeight = formData.criteria
      .map((c) => c.weight || 0)
      .reduce((a, b) => a + b, 0);
    if (totalWeight > 0 && totalWeight !== 100) {
      newErrors.weights = "Sum of criterion weights must be either 0 or 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const submitData: CreateAppraisalTemplateDto = {
        ...formData,
        applicableDepartmentIds: selectedDepartments,
        applicablePositionIds: selectedPositions,
      };
      await onSubmit(submitData);
    } catch (error) {
      // Error is handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const templateTypeOptions = Object.values(AppraisalTemplateType).map((type) => ({
    value: type,
    label: type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" "),
  }));

  const scaleTypeOptions = Object.values(AppraisalRatingScaleType).map((type) => ({
    value: type,
    label: type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" "),
  }));

  const totalWeight = formData.criteria
    .map((c) => c.weight || 0)
    .reduce((a, b) => a + b, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

        <Input
          label="Template Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />

        <Select
          label="Template Type *"
          value={formData.templateType}
          onChange={(e) =>
            setFormData({
              ...formData,
              templateType: e.target.value as AppraisalTemplateType,
            })
          }
          options={templateTypeOptions}
        />
      </div>

      {/* Rating Scale */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900">Rating Scale</h3>

        <Select
          label="Scale Type *"
          value={formData.ratingScale.type}
          onChange={(e) =>
            handleScaleTypeChange(e.target.value as AppraisalRatingScaleType)
          }
          options={scaleTypeOptions}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Minimum Score"
            type="number"
            value={formData.ratingScale.min}
            onChange={(e) =>
              setFormData({
                ...formData,
                ratingScale: {
                  ...formData.ratingScale,
                  min: parseInt(e.target.value) || 0,
                },
              })
            }
          />

          <Input
            label="Maximum Score"
            type="number"
            value={formData.ratingScale.max}
            onChange={(e) =>
              setFormData({
                ...formData,
                ratingScale: {
                  ...formData.ratingScale,
                  max: parseInt(e.target.value) || 0,
                },
              })
            }
          />
        </div>

        {formData.ratingScale.labels && formData.ratingScale.labels.length > 0 && (
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Scale Labels:</p>
            <ul className="list-disc list-inside space-y-1">
              {formData.ratingScale.labels.map((label, idx) => (
                <li key={idx}>
                  {formData.ratingScale.min + idx}: {label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Evaluation Criteria */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Evaluation Criteria</h3>
          <Button type="button" variant="outline" onClick={addCriterion}>
            Add Criterion
          </Button>
        </div>

        {errors.criteria && (
          <p className="text-sm text-red-600">{errors.criteria}</p>
        )}
        {errors.weights && (
          <p className="text-sm text-red-600">{errors.weights}</p>
        )}

        {formData.criteria.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No criteria added. Click "Add Criterion" to create one.
          </p>
        ) : (
          <div className="space-y-4">
            {formData.criteria.map((criterion, index) => (
              <div
                key={criterion.key}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Criterion {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeCriterion(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>

                <Input
                  label="Title *"
                  value={criterion.title}
                  onChange={(e) =>
                    updateCriterion(index, "title", e.target.value)
                  }
                  error={errors[`criterion_${index}_title`]}
                  required
                />

                <Textarea
                  label="Details"
                  value={criterion.details || ""}
                  onChange={(e) =>
                    updateCriterion(index, "details", e.target.value)
                  }
                  rows={2}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Weight (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={criterion.weight || 0}
                    onChange={(e) =>
                      updateCriterion(
                        index,
                        "weight",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    error={errors[`criterion_${index}_weight`]}
                  />

                  <Input
                    label="Max Score"
                    type="number"
                    value={criterion.maxScore || ""}
                    onChange={(e) =>
                      updateCriterion(
                        index,
                        "maxScore",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`required_${index}`}
                    checked={criterion.required !== false}
                    onChange={(e) =>
                      updateCriterion(index, "required", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`required_${index}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    Required
                  </label>
                </div>
              </div>
            ))}

            {totalWeight > 0 && (
              <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                Total Weight: <strong>{totalWeight}%</strong>
                {totalWeight !== 100 && (
                  <span className="text-red-600 ml-2">
                    (Must be 0% or 100%)
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Applicable Departments and Positions */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900">Applicability</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Applicable Departments (Optional)
          </label>
          <select
            multiple
            value={selectedDepartments}
            onChange={(e) => {
              const values = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setSelectedDepartments(values);
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            size={4}
          >
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name} ({dept.code})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Hold Ctrl/Cmd to select multiple departments. Leave empty for all departments.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Applicable Positions (Optional)
          </label>
          <select
            multiple
            value={selectedPositions}
            onChange={(e) => {
              const values = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setSelectedPositions(values);
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            size={4}
          >
            {positions.map((pos) => (
              <option key={pos._id} value={pos._id}>
                {pos.title} ({pos.code})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Hold Ctrl/Cmd to select multiple positions. Leave empty for all positions.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4 border-t pt-4">
        <Textarea
          label="Instructions (Optional)"
          value={formData.instructions || ""}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          rows={4}
          placeholder="Provide instructions for managers on how to use this template..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : template ? "Update Template" : "Create Template"}
        </Button>
      </div>
    </form>
  );
}
