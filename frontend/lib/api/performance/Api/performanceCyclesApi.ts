// frontend/lib/api/performance/Api/performanceCyclesApi.ts

import api from "@/lib/api/client";
import {
  AppraisalCycle,
  CreateAppraisalCycleInput,
} from "@/components/Performance/performanceCycles";

const CYCLES_BASE_PATH = "/performance/cycles";

export async function fetchAppraisalCycles(): Promise<AppraisalCycle[]> {
  const raw = await api.get(CYCLES_BASE_PATH);
  return raw as unknown as AppraisalCycle[];
}

export async function createAppraisalCycle(
  input: CreateAppraisalCycleInput,
): Promise<AppraisalCycle> {
  const raw = await api.post(CYCLES_BASE_PATH, input);
  return raw as unknown as AppraisalCycle;
}

// Status transitions

export async function activateAppraisalCycle(
  id: string,
): Promise<AppraisalCycle> {
  const raw = await api.patch(`${CYCLES_BASE_PATH}/${id}/activate`, {});
  return raw as unknown as AppraisalCycle;
}

export async function publishAppraisalCycle(
  id: string,
): Promise<AppraisalCycle> {
  const raw = await api.patch(`${CYCLES_BASE_PATH}/${id}/publish`, {});
  return raw as unknown as AppraisalCycle;
}

export async function closeAppraisalCycle(
  id: string,
): Promise<AppraisalCycle> {
  const raw = await api.patch(`${CYCLES_BASE_PATH}/${id}/close`, {});
  return raw as unknown as AppraisalCycle;
}

export async function archiveAppraisalCycle(
  id: string,
): Promise<AppraisalCycle> {
  const raw = await api.patch(`${CYCLES_BASE_PATH}/${id}/archive`, {});
  return raw as unknown as AppraisalCycle;
}
