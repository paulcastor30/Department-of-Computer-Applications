"""Internal summaries of selected self-reports and selected roster records."""
from collections import Counter

OUTCOME_HEADERS = ("program", "graduation_year", "current_activity", "work_degree_alignment", "responses", "affiliation_verified", "email_verified", "opportunities_opt_in", "mentoring_opt_in")


def outcome_rows(profiles):
    counts = {}
    for profile in profiles:
        activity = profile.get_career_status_display() if profile.career_status else "Not answered"
        alignment = profile.get_work_alignment_display() if profile.work_alignment else "Not answered"
        # Work alignment is interpreted only for working respondents.
        if profile.career_status not in {"EMPLOYED", "SELF_EMPLOYED"}:
            alignment = "Not applicable"
        for program, year in (("BSCA", profile.bsca_year), ("MSCA", profile.msca_year)):
            if year is None:
                continue
            key = (program, year, activity, alignment)
            values = counts.setdefault(key, [0] * 5)
            for index, value in enumerate((1, profile.verification_status == "VERIFIED", profile.email_verified_at is not None, profile.receive_updates, profile.willing_to_mentor)):
                values[index] += int(value)
    return [(*key, *values) for key, values in sorted(counts.items())]


COVERAGE_HEADERS = ("program", "graduation_year", "selected_roster_graduates", "linked_responses", "unlinked_graduates", "linked_program_year_mismatch", "linked_response_percent", "affiliation_verified", "email_verified", "activity_not_answered", "prefer_not_to_say")


def coverage_rows(graduates):
    cohorts = {}
    for graduate in graduates.select_related("alumni_profile"):
        counts = cohorts.setdefault((graduate.program, graduate.graduation_year), Counter())
        counts["total"] += 1
        profile = graduate.alumni_profile
        if profile is None:
            counts["unlinked"] += 1
            continue
        year = profile.bsca_year if graduate.program == "BSCA" else profile.msca_year
        if year != graduate.graduation_year:
            counts["mismatch"] += 1
            continue
        counts["linked"] += 1
        counts["verified"] += profile.verification_status == "VERIFIED"
        counts["email_verified"] += profile.email_verified_at is not None
        counts["missing"] += not profile.career_status
        counts["withheld"] += profile.career_status == "PREFER_NOT_TO_SAY"
    return [(*key, c["total"], c["linked"], c["unlinked"], c["mismatch"], round(c["linked"] * 100 / c["total"], 1), c["verified"], c["email_verified"], c["missing"], c["withheld"]) for key, c in sorted(cohorts.items())]
