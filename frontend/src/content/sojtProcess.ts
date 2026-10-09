export type Requirement = { text: string; sources: string[] };
export type SOJTSource = { id: string; title: string; level: string; url: string };
export type SOJTStep = { id: string; title: string; purpose: Requirement; groups: { title: string; items: Requirement[] }[]; documents: Requirement[]; gate: Requirement; risks: string[]; sources: string[] };
export type SOJTContent = { version: number; coordinator: string; intro: string; warning: string; warningSources: string[]; steps: SOJTStep[]; checklist: Requirement[]; sources: SOJTSource[] };
export type SOJTResponse = { slug: string; content: SOJTContent; reviewed_on: string; updated_at: string };
export const sojtStepIds = ["eligibility", "orientation", "hte-approval", "internship-plan", "pre-deployment", "deployment", "monitoring", "completion", "exit-review", "clearance"];
// Informational statuses only; selecting one never records approval or completion.
export const sojtStatuses = [
  ["Not yet assessed", "eligibility"], ["Eligible", "orientation"], ["Oriented", "hte-approval"],
  ["HTE under review", "hte-approval"], ["HTE approved", "internship-plan"], ["Internship Plan approved", "pre-deployment"],
  ["Pre-deployment requirements complete", "deployment"], ["Deployed", "monitoring"], ["In progress", "monitoring"],
  ["Completed", "exit-review"], ["Under exit review", "exit-review"], ["Cleared", "clearance"],
] as const;

export function isSOJTContent(value: unknown): value is SOJTContent {
  if (!value || typeof value !== "object") return false;
  const c = value as SOJTContent;
  const strings = (x: unknown): x is string[] => Array.isArray(x) && x.every(v => typeof v === "string");
  const requirement = (x: Requirement) => x && typeof x.text === "string" && strings(x.sources);
  return c.version === 1 && [c.coordinator, c.intro, c.warning].every(x => typeof x === "string") && strings(c.warningSources)
    && Array.isArray(c.steps) && c.steps.length === 10 && c.steps.every((s, i) => s.id === sojtStepIds[i] && typeof s.title === "string" && requirement(s.purpose) && requirement(s.gate) && strings(s.risks) && strings(s.sources) && Array.isArray(s.documents) && s.documents.every(requirement) && Array.isArray(s.groups) && s.groups.every(g => typeof g.title === "string" && Array.isArray(g.items) && g.items.every(requirement)))
    && Array.isArray(c.checklist) && c.checklist.length > 0 && c.checklist.every(requirement)
    && Array.isArray(c.sources) && c.sources.every(s => (!("status" in s) || s.status === "verified") && [s.id, s.title, s.level, s.url].every(x => typeof x === "string") && (!s.url || /^https:\/\//.test(s.url) || /^\/(?!\/)/.test(s.url)));
}
