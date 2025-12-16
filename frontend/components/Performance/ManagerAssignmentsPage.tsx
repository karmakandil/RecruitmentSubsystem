"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { AppraisalAssignment } from "./performanceAssignments";
import { fetchManagerAssignments } from "@/lib/api/performance/Api/performanceAssignmentsApi";

type LoadState = "idle" | "loading" | "loaded" | "error";

export const ManagerAssignmentsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [assignments, setAssignments] = useState<AppraisalAssignment[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  /**
   * Derive the manager's EmployeeProfile _id.
   *
   * From your screenshot, the frontend user object looks like:
   * {
   *   id: "692b63778b731e72cccc10cd",
   *   employeeNumber: "EMP-2025-0005",
   *   ...
   * }
   *
   * That `id` is the profile _id we use for managerProfileId in assignments.
   */
  const managerProfileId = useMemo(() => {
    if (!user) return null;

    const candidate =
      // 🔹 this is the one we saw in your screenshot
      (user as any).id ||
      (user as any).employeeProfileId ||
      (user as any).employeeProfile?._id ||
      (user as any).employeeProfileIdString ||
      null;

    if (typeof window !== "undefined") {
      console.log("[ManagerAssignments] user =", user);
      console.log("[ManagerAssignments] derived managerProfileId =", candidate);
    }

    return candidate as string | null;
  }, [user]);

  const loadAssignments = async (profileId: string) => {
    try {
      setLoadState("loading");
      setError(null);

      const data = await fetchManagerAssignments(profileId);
      setAssignments(data);
      setLoadState("loaded");
    } catch (err: any) {
      console.error("[ManagerAssignments] loadAssignments error:", err);
      setError(err?.message ?? "Failed to load assignments");
      setLoadState("error");
    }
  };

  useEffect(() => {
    if (!authLoading && managerProfileId) {
      void loadAssignments(managerProfileId);
    }
  }, [authLoading, managerProfileId]);

  const handleOpenAppraisal = (assignment: AppraisalAssignment) => {
    const assignmentId = (assignment as any).id ?? (assignment as any)._id;
    if (!assignmentId) return;

    router.push(`/dashboard/performance/manager/appraisals/${assignmentId}`);
  };

  const formatDate = (value?: string | Date) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString();
  };

  // ---------------- RENDER STATES ----------------

  if (authLoading) {
    return <p className="p-4">Loading your profile…</p>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">My Appraisals</h1>
        <p className="text-sm text-red-600">
          You need to be logged in to view your assigned appraisals.
        </p>
      </div>
    );
  }

  if (!managerProfileId) {
    // Much more user-friendly now
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">My Appraisals</h1>
        <p className="text-sm text-red-600 mb-3">
          We couldn’t link your account to an employee profile. Please contact
          HR or the system administrator to check your profile configuration.
        </p>

        {/* Optional: small technical details, hidden by default */}
        <details className="mt-3 text-xs text-gray-400">
          <summary className="cursor-pointer">
            Technical details (for support)
          </summary>
          <pre className="mt-2 rounded bg-gray-900 text-gray-100 p-3 overflow-x-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">My Assigned Appraisals</h1>
          <p className="text-sm text-gray-600 max-w-3xl">
            View all appraisal forms assigned to you for your direct reports.
            Use this list to track which forms are pending, in progress, or
            submitted.
          </p>
        </div>
      </header>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loadState === "loading" && assignments.length === 0 ? (
        <p>Loading assignments…</p>
      ) : assignments.length === 0 ? (
        <p>No assignments found for your profile.</p>
      ) : (
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                  Employee
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                  Cycle
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                  Template
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                  Due Date
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, index) => {
                const key = (a as any).id ?? (a as any)._id ?? index;

                const employee =
                  (a as any).employeeProfileId || (a as any).employee;
                const employeeName =
                  employee?.fullName ||
                  employee?.name ||
                  employee?.displayName ||
                  "Employee";

                const cycle = (a as any).cycleId || (a as any).cycle;
                const template = (a as any).templateId || (a as any).template;

                const cycleName =
                  typeof cycle === "string" ? cycle : cycle?.name || "Cycle";
                const templateName =
                  typeof template === "string"
                    ? template
                    : template?.name || "Template";

                return (
                  <tr
                    key={key}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-sm">{employeeName}</td>
                    <td className="px-3 py-2 text-sm">{cycleName}</td>
                    <td className="px-3 py-2 text-sm">{templateName}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {a.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {formatDate((a as any).dueDate)}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <button
                        type="button"
                        onClick={() => handleOpenAppraisal(a)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-100"
                      >
                        Open Appraisal
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
