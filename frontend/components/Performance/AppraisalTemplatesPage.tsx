"use client";

import React, { useEffect, useState } from "react";
import {
  AppraisalTemplate,
  CreateAppraisalTemplateInput,
  UpdateAppraisalTemplateInput,
} from "./performanceTemplates";
import {
  fetchAppraisalTemplates,
  createAppraisalTemplate,
  updateAppraisalTemplate,
  deleteAppraisalTemplate,
} from "../../lib/api/performance/Api/performanceTemplatesApi";
import { AppraisalTemplateForm } from "./AppraisalTemplateForm";

type FormMode = "none" | "create" | "edit";

export const AppraisalTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<AppraisalTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<FormMode>("none");
  const [selectedTemplate, setSelectedTemplate] =
    useState<AppraisalTemplate | null>(null);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAppraisalTemplates();
      setTemplates(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTemplates();
  }, []);

  const openCreateForm = () => {
    setSelectedTemplate(null);
    setFormMode("create");
  };

  const openEditForm = (template: AppraisalTemplate) => {
    setSelectedTemplate(template);
    setFormMode("edit");
  };

  const closeForm = () => {
    setSelectedTemplate(null);
    setFormMode("none");
  };

  const handleCreate = async (input: CreateAppraisalTemplateInput) => {
    try {
      setSaving(true);
      setError(null);
      const created = await createAppraisalTemplate(input);
      setTemplates((prev) => [...prev, created]);
      setFormMode("none");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to create template");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (input: UpdateAppraisalTemplateInput) => {
    if (!selectedTemplate) return;

    const id = selectedTemplate.id ?? selectedTemplate._id;
    if (!id) {
      console.error("Selected template has no id/_id");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const updated = await updateAppraisalTemplate(id, input);
      const updatedId = updated.id ?? updated._id;

      setTemplates((prev) =>
        prev.map((t) =>
          (t.id ?? t._id) === updatedId ? updated : t,
        ),
      );
      setSelectedTemplate(null);
      setFormMode("none");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to update template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (template: AppraisalTemplate) => {
    const id = template.id ?? template._id;
    if (!id) {
      console.error("Template has no id/_id");
      return;
    }

    const confirmDelete = window.confirm(
      `Delete template "${template.name}"? This cannot be undone.`,
    );
    if (!confirmDelete) return;

    try {
      setSaving(true);
      setError(null);
      await deleteAppraisalTemplate(id);
      setTemplates((prev) =>
        prev.filter((t) => (t.id ?? t._id) !== id),
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to delete template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
            Appraisal Templates
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.9rem",
              maxWidth: "40rem",
            }}
          >
            Configure standardized appraisal templates, rating scales, and
            criteria so managers evaluate employees consistently.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          + New Template
        </button>
      </header>

      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            background: "#fee2e2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading templates...</p>
      ) : templates.length === 0 ? (
        <p>No templates found. Click “New Template” to create one.</p>
      ) : (
        <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Type</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>
                  Rating Scale
                </th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>
                  Criteria
                </th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t, index) => {
                const key = t.id ?? t._id ?? `${t.name}-${index}`;
                return (
                  <tr
                    key={key}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                  >
                    <td style={{ padding: "0.5rem" }}>{t.name}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {t.templateType}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {t.ratingScale.min} – {t.ratingScale.max}{" "}
                      {t.ratingScale.type &&
                        t.ratingScale.labels &&
                        `(${t.ratingScale.labels.join(", ")})`}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {t.criteria.length} criterion
                      {t.criteria.length !== 1 ? "s" : ""}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => openEditForm(t)}
                        style={{
                          marginRight: "0.5rem",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #d1d5db",
                          background: "#f9fafb",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #fecaca",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {formMode !== "none" && (
        <AppraisalTemplateForm
          mode={formMode === "create" ? "create" : "edit"}
          initialValue={
            formMode === "edit" && selectedTemplate
              ? selectedTemplate
              : undefined
          }
          onCreate={formMode === "create" ? handleCreate : undefined}
          onUpdate={formMode === "edit" ? handleUpdate : undefined}
          onCancel={closeForm}
          isSubmitting={saving}
        />
      )}
    </div>
  );
};
