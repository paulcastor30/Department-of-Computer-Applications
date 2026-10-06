"""Public guide schema: curated policy content only, never student/complaint records."""
from django.core.exceptions import ValidationError
from urllib.parse import urlparse

STEP_IDS = ["eligibility", "orientation", "hte-approval", "internship-plan", "pre-deployment", "deployment", "monitoring", "completion", "exit-review", "clearance"]


def validate_guide(content):
    def fail(message):
        raise ValidationError(message)

    def shape(value, keys):
        if not isinstance(value, dict) or set(value) != set(keys):
            fail("Guide contains missing or unsupported fields; only public policy content is allowed.")

    def text(value):
        if not isinstance(value, str) or not value.strip() or len(value) > 4000:
            fail("Guide text must be non-empty and at most 4000 characters.")

    def sequence(value):
        if not isinstance(value, list):
            fail("Guide sections must be lists.")
        return value

    shape(content, ["version", "coordinator", "intro", "warning", "warningSources", "steps", "checklist", "sources", "risks", "confirmations"])
    if content["version"] != 1:
        fail("Unsupported guide schema version.")
    for key in ["coordinator", "intro", "warning"]:
        text(content[key])
    source_ids = set()
    for source in sequence(content["sources"]):
        shape(source, ["id", "title", "level", "status", "url", "note"])
        for key in ["id", "title", "level", "note"]:
            text(source[key])
        if source["id"] in source_ids or source["status"] not in ["verified", "pending", "proposed"]:
            fail("Source IDs must be unique and status must be verified, pending or proposed.")
        source_ids.add(source["id"])
        url = source["url"]
        if not isinstance(url, str) or (url and not (url.startswith("/") and not url.startswith("//") or urlparse(url).scheme == "https" and urlparse(url).netloc)):
            fail("Source links must be HTTPS or local paths.")

    def refs(value):
        if not sequence(value) or any(not isinstance(x, str) or x not in source_ids for x in value):
            fail("Every requirement must reference an existing source.")

    def requirement(value):
        shape(value, ["text", "sources"])
        text(value["text"])
        refs(value["sources"])

    refs(content["warningSources"])
    steps = sequence(content["steps"])
    if [step.get("id") if isinstance(step, dict) else None for step in steps] != STEP_IDS:
        fail("All ten SOJT stages must appear in the required order.")
    for step in steps:
        shape(step, ["id", "title", "purpose", "groups", "documents", "gate", "risks", "sources"])
        text(step["title"])
        requirement(step["purpose"])
        requirement(step["gate"])
        refs(step["sources"])
        for group in sequence(step["groups"]):
            shape(group, ["title", "items"])
            text(group["title"])
            for value in sequence(group["items"]):
                requirement(value)
        for value in sequence(step["documents"]):
            requirement(value)
        for value in sequence(step["risks"]):
            text(value)
    if not sequence(content["checklist"]):
        fail("A pre-deployment checklist is required.")
    for value in content["checklist"]:
        requirement(value)
    for risk in sequence(content["risks"]):
        shape(risk, ["step", "title", "severity", "control", "sources"])
        if type(risk["step"]) is not int or risk["step"] not in range(1, 11) or risk["severity"] not in ["High", "Moderate", "Low"]:
            fail("Risk steps and severity must use the documented scale.")
        text(risk["title"])
        text(risk["control"])
        refs(risk["sources"])
    for value in sequence(content["confirmations"]):
        text(value)
