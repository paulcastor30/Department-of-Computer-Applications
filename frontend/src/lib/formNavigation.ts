// Form references link to an existing guide step; this does not mark progress.
const steps: Record<string, string> = {
  "017": "panel-formation", "018": "panel-formation", "019": "proposal-hearing",
  "020": "proposal-approval", "021": "defense-preparation", "022": "defense-preparation",
  "023": "final-defense", "024": "final-defense", "025": "binding", "025-submission": "final-submission",
};
export function thesisStepForForm(formId: string) { return steps[formId]; }
