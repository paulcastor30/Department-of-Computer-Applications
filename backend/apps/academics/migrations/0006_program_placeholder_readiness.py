from django.db import migrations


PLACEHOLDER = "To be provided by the Department."


def prepare_program_records_for_official_content(apps, schema_editor):
    Program = apps.get_model("academics", "Program")

    readiness = {
        "BSCA": {
            "overview": PLACEHOLDER,
            "formal_description": PLACEHOLDER,
            "academic_orientation": PLACEHOLDER,
            "intended_learners": PLACEHOLDER,
            "culminating_requirement": "Undergraduate Thesis",
            "duration": PLACEHOLDER,
            "curriculum_load": PLACEHOLDER,
            "recognition": "",
            "program_goals": PLACEHOLDER,
            "program_educational_objectives": "",
            "outcomes": PLACEHOLDER,
            "academic_areas": PLACEHOLDER,
            "specialization_tracks": "",
            "curriculum_structure": PLACEHOLDER,
            "thesis_information": (
                "The culminating academic requirement is the Undergraduate Thesis.\n"
                "Official thesis procedures, advising arrangements, and assessment documentation are To be provided by the Department."
            ),
            "student_support": PLACEHOLDER,
            "curriculum_evidence": "",
            "quality_evidence": "",
            "career_opportunities": PLACEHOLDER,
            "admission_requirements": PLACEHOLDER,
            "progression_requirements": PLACEHOLDER,
            "historical_notes": "",
            "faq_intro": "",
            "contact_information": PLACEHOLDER,
            "seo_title": "Bachelor of Science in Computer Applications",
            "seo_description": (
                "Formal undergraduate program information for the Bachelor of Science in Computer Applications "
                "of the Department of Computer Applications, MSU-IIT."
            ),
            "og_title": "Bachelor of Science in Computer Applications",
            "og_description": (
                "Undergraduate academic program information with official Department content to be provided."
            ),
        },
        "MSCA": {
            "overview": PLACEHOLDER,
            "formal_description": PLACEHOLDER,
            "academic_orientation": PLACEHOLDER,
            "intended_learners": PLACEHOLDER,
            "culminating_requirement": "Master’s Thesis or Graduate Thesis",
            "duration": PLACEHOLDER,
            "curriculum_load": PLACEHOLDER,
            "recognition": "",
            "program_goals": PLACEHOLDER,
            "program_educational_objectives": "",
            "outcomes": PLACEHOLDER,
            "academic_areas": PLACEHOLDER,
            "specialization_tracks": "",
            "curriculum_structure": PLACEHOLDER,
            "thesis_information": (
                "The culminating academic requirement is the Master’s Thesis or Graduate Thesis.\n"
                "Official thesis procedures, advising arrangements, and assessment documentation are To be provided by the Department."
            ),
            "student_support": PLACEHOLDER,
            "curriculum_evidence": "",
            "quality_evidence": "",
            "career_opportunities": PLACEHOLDER,
            "admission_requirements": PLACEHOLDER,
            "progression_requirements": PLACEHOLDER,
            "historical_notes": "",
            "faq_intro": "",
            "contact_information": PLACEHOLDER,
            "seo_title": "Master of Science in Computer Applications",
            "seo_description": (
                "Formal graduate program information for the Master of Science in Computer Applications "
                "of the Department of Computer Applications, MSU-IIT."
            ),
            "og_title": "Master of Science in Computer Applications",
            "og_description": (
                "Graduate academic program information with official Department content to be provided."
            ),
        },
    }

    for code, fields in readiness.items():
        Program.objects.filter(code=code).update(**fields)


class Migration(migrations.Migration):
    dependencies = [
        ("academics", "0005_program_thesis_terminology_alignment"),
    ]

    operations = [
        migrations.RunPython(prepare_program_records_for_official_content, migrations.RunPython.noop),
    ]
