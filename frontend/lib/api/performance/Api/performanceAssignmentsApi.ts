// frontend/lib/api/performance/Api/performanceAssignmentsApi.ts

import api from "@/lib/api/client";
import { AppraisalAssignment } from "@/components/Performance/performanceAssignments";

const ASSIGNMENTS_BASE_PATH = "/performance/assignments";

// Line Manager / Head of Department view
export async function fetchManagerAssignments(
  managerProfileId: string,
  cycleId?: string,
): Promise<AppraisalAssignment[]> {
  const params: Record<string, string> = {};
  if (cycleId) params.cycleId = cycleId;

  const raw = await api.get(
    `${ASSIGNMENTS_BASE_PATH}/manager/${managerProfileId}`,
    { params },
  );

  return raw as unknown as AppraisalAssignment[];
}

// Employee view (for later steps, 5 / 6)
export async function fetchEmployeeAssignments(
  employeeProfileId: string,
  cycleId?: string,
): Promise<AppraisalAssignment[]> {
  const params: Record<string, string> = {};
  if (cycleId) params.cycleId = cycleId;

  const raw = await api.get(
    `${ASSIGNMENTS_BASE_PATH}/employee/${employeeProfileId}`,
    { params },
  );

  return raw as unknown as AppraisalAssignment[];
}
