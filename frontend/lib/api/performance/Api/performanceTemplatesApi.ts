import api from "@/lib/api/client";
import {
  AppraisalTemplate,
  CreateAppraisalTemplateInput,
  UpdateAppraisalTemplateInput,
} from "@/components/Performance/performanceTemplates";

// Matches NestJS controller: /api/v1/performance/templates
const TEMPLATES_BASE_PATH = "/performance/templates";

export async function fetchAppraisalTemplates(): Promise<AppraisalTemplate[]> {
  const raw = await api.get(TEMPLATES_BASE_PATH);
  return raw as unknown as AppraisalTemplate[];
}

export async function createAppraisalTemplate(
  input: CreateAppraisalTemplateInput,
): Promise<AppraisalTemplate> {
  const raw = await api.post(TEMPLATES_BASE_PATH, input);
  return raw as unknown as AppraisalTemplate;
}

export async function updateAppraisalTemplate(
  id: string,
  input: UpdateAppraisalTemplateInput,
): Promise<AppraisalTemplate> {
  const raw = await api.patch(`${TEMPLATES_BASE_PATH}/${id}`, input);
  return raw as unknown as AppraisalTemplate;
}

export async function deleteAppraisalTemplate(id: string): Promise<void> {
  await api.delete(`${TEMPLATES_BASE_PATH}/${id}`);
}
