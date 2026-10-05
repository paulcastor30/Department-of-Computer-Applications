from django.db import models
from apps.core.base_models import PublishableModel
from apps.core.base_models import TimeStampedModel
from apps.quality.models import EvidenceDocument

class FacultyMember(PublishableModel):
    class PersonnelType(models.TextChoices):
        FACULTY = "faculty", "Faculty"
        ACADEMIC_STAFF = "academic_staff", "Academic Staff"
        LABORATORY_TECHNICIAN = "laboratory_technician", "Laboratory Technician"

    class FacultyStatus(models.TextChoices):
        ACTIVE = "active", "Active"
        ACTIVE_FULL_TIME = "active_full_time", "Active Full-Time"
        STUDY_LEAVE = "study_leave", "Study Leave"
        SABBATICAL_LEAVE = "sabbatical_leave", "Sabbatical Leave"
        RETIRED = "retired", "Retired"
        RESIGNED = "resigned", "Resigned"
        INACTIVE_AFFILIATION = "inactive_affiliation", "Inactive Affiliation"

    class ServiceClassification(models.TextChoices):
        ACTIVE_DCA_FACULTY = "active_dca_faculty", "Active DCA Faculty"
        AFFILIATED_MSCA_FACULTY = "affiliated_msca_faculty", "Affiliated MSCA Faculty"
        RETIRED_DCA_FACULTY = "retired_dca_faculty", "Retired DCA Faculty"
        RESIGNED_DCA_FACULTY = "resigned_dca_faculty", "Resigned DCA Faculty"
        ACADEMIC_STAFF = "academic_staff", "Academic Staff"
        LABORATORY_PERSONNEL = "laboratory_personnel", "Laboratory Personnel"

    personnel_type = models.CharField(
        max_length=32,
        choices=PersonnelType.choices,
        default=PersonnelType.FACULTY,
    )
    faculty_status = models.CharField(
        max_length=32,
        choices=FacultyStatus.choices,
        default=FacultyStatus.ACTIVE,
        blank=True,
        help_text="Use only when personnel type is Faculty.",
    )
    service_classification = models.CharField(
        max_length=64,
        choices=ServiceClassification.choices,
        default=ServiceClassification.ACTIVE_DCA_FACULTY,
        help_text="Controls public directory grouping.",
    )
    transferred_from_dca = models.BooleanField(default=False, help_text="Transferred out of DCA; may also remain affiliated with MSCA. Record the destination and order in the home unit and assignment note.")
    position = models.CharField(max_length=255, blank=True)
    profile_summary = models.TextField(
        blank=True,
        help_text="Concise official academic profile overview. Use the Department placeholder when not yet provided.",
    )
    employment_classification = models.CharField(max_length=255, blank=True)
    faculty_category = models.CharField(max_length=255, blank=True)
    highest_degree = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    photo = models.ImageField(upload_to="faculty/", blank=True, null=True)
    educational_background = models.TextField(blank=True)
    specialization_areas = models.TextField(blank=True)
    research_interests = models.TextField(blank=True)
    courses_taught = models.TextField(blank=True)
    advising_areas = models.TextField(blank=True)
    teaching_areas = models.TextField(blank=True)
    home_unit = models.CharField(
        max_length=255,
        blank=True,
        help_text="Required for affiliated MSCA faculty when officially provided.",
    )
    supporting_programs = models.CharField(max_length=255, blank=True, help_text="Example: MSCA")
    msca_roles = models.CharField(
        max_length=255,
        blank=True,
        help_text="Example: course instructor, adviser, co-adviser, panel member.",
    )
    appointment_or_assignment_note = models.TextField(blank=True)
    start_year = models.PositiveIntegerField(blank=True, null=True)
    end_year = models.PositiveIntegerField(blank=True, null=True)
    active_affiliation = models.BooleanField(default=True)
    prc_license_number = models.CharField(max_length=32, blank=True, help_text="License number supplied by the Department; not verification of current license validity.")
    certifications = models.TextField(blank=True)
    awards = models.TextField(blank=True)
    office = models.CharField(max_length=255, blank=True)
    seo_title = models.CharField(max_length=255, blank=True)
    seo_description = models.TextField(blank=True)
    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.TextField(blank=True)
    
    evidence_documents = models.ManyToManyField(
        EvidenceDocument,
        blank=True,
        related_name="faculty_members"
    )

    def __str__(self):
        return self.title


class FacultyProfileRecord(TimeStampedModel):
    faculty = models.ForeignKey(FacultyMember, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True


class FacultyEducation(FacultyProfileRecord):
    class DegreeLevel(models.TextChoices):
        DOCTORATE = "doctorate", "Doctorate"
        MASTERS = "masters", "Master's Degree"
        BACHELORS = "bachelors", "Bachelor's Degree"
        OTHER = "other", "Other"

    faculty = models.ForeignKey(FacultyMember, related_name="education_records", on_delete=models.CASCADE)
    degree_level = models.CharField(max_length=32, choices=DegreeLevel.choices)
    degree_name = models.CharField(max_length=255, blank=True)
    field_or_specialization = models.CharField(max_length=255, blank=True)
    institution = models.CharField(max_length=255, blank=True)
    year_completed = models.PositiveIntegerField(blank=True, null=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "degree_level", "degree_name"]

    def __str__(self):
        return f"{self.faculty} - {self.get_degree_level_display()}"


class FacultyExpertise(FacultyProfileRecord):
    class ExpertiseType(models.TextChoices):
        EXPERTISE = "expertise", "Expertise Area"
        RESEARCH_INTEREST = "research_interest", "Research Interest"
        TEACHING_AREA = "teaching_area", "Teaching Area"
        MSCA_COURSE_SUPPORT = "msca_course_support", "MSCA Course Support"

    faculty = models.ForeignKey(FacultyMember, related_name="expertise_records", on_delete=models.CASCADE)
    expertise_type = models.CharField(max_length=32, choices=ExpertiseType.choices, default=ExpertiseType.EXPERTISE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "title"]

    def __str__(self):
        return self.title


class FacultySupervisedWork(FacultyProfileRecord):
    class ProgramLevel(models.TextChoices):
        BSCA = "BSCA", "BSCA"
        MSCA = "MSCA", "MSCA"

    faculty = models.ForeignKey(FacultyMember, related_name="supervised_works", on_delete=models.CASCADE)
    program_level = models.CharField(max_length=8, choices=ProgramLevel.choices)
    title = models.CharField(max_length=255)
    researchers = models.TextField(blank=True)
    adviser = models.CharField(max_length=255, blank=True)
    co_adviser = models.CharField(max_length=255, blank=True)
    abstract = models.TextField(blank=True)
    award = models.CharField(max_length=255, blank=True)
    academic_year = models.CharField(max_length=32, blank=True)
    completion_year = models.PositiveIntegerField(blank=True, null=True)
    faculty_role = models.CharField(max_length=255, blank=True)
    evidence_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-completion_year", "-academic_year", "sort_order", "title"]

    def __str__(self):
        return self.title


class FacultyPublication(FacultyProfileRecord):
    faculty = models.ForeignKey(FacultyMember, related_name="publications", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    authors = models.TextField(blank=True)
    venue = models.CharField(max_length=255, blank=True)
    publication_type = models.CharField(max_length=100, blank=True)
    publication_date = models.DateField(blank=True, null=True)
    year = models.PositiveIntegerField(blank=True, null=True)
    doi = models.CharField(max_length=255, blank=True)
    url = models.URLField(blank=True)
    indexing_note = models.CharField(max_length=255, blank=True)
    citation_text = models.TextField(blank=True)

    class Meta:
        ordering = ["-publication_date", "-year", "sort_order", "title"]

    def __str__(self):
        return self.title


class FacultyConference(FacultyProfileRecord):
    faculty = models.ForeignKey(FacultyMember, related_name="conferences", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    conference_name = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    event_date = models.DateField(blank=True, null=True)
    year = models.PositiveIntegerField(blank=True, null=True)
    role = models.CharField(max_length=100, blank=True)
    evidence_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-event_date", "-year", "sort_order", "title"]

    def __str__(self):
        return self.title


class FacultyResearchProject(FacultyProfileRecord):
    class FundingType(models.TextChoices):
        INTERNAL = "internal", "Internally-Funded Research"
        EXTERNAL = "external", "Externally-Funded Research"

    faculty = models.ForeignKey(FacultyMember, related_name="research_projects", on_delete=models.CASCADE)
    funding_type = models.CharField(max_length=16, choices=FundingType.choices, default=FundingType.INTERNAL)
    title = models.CharField(max_length=255)
    funding_source = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=100, blank=True)
    implementation_period = models.CharField(max_length=255, blank=True)
    start_year = models.PositiveIntegerField(blank=True, null=True)
    end_year = models.PositiveIntegerField(blank=True, null=True)
    amount = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=100, blank=True)
    outputs_or_evidence = models.TextField(blank=True)
    evidence_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-end_year", "-start_year", "sort_order", "title"]

    def __str__(self):
        return self.title


class FacultyExtensionProject(FacultyProfileRecord):
    faculty = models.ForeignKey(FacultyMember, related_name="extension_projects", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    funding_source = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=100, blank=True)
    implementation_period = models.CharField(max_length=255, blank=True)
    partner_community = models.CharField(max_length=255, blank=True)
    start_year = models.PositiveIntegerField(blank=True, null=True)
    end_year = models.PositiveIntegerField(blank=True, null=True)
    status = models.CharField(max_length=100, blank=True)
    evidence_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-end_year", "-start_year", "sort_order", "title"]

    def __str__(self):
        return self.title


class FacultyCreativeWork(FacultyProfileRecord):
    faculty = models.ForeignKey(FacultyMember, related_name="creative_works", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True)
    work_date = models.DateField(blank=True, null=True)
    year = models.PositiveIntegerField(blank=True, null=True)
    description = models.TextField(blank=True)
    role = models.CharField(max_length=100, blank=True)
    evidence_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-work_date", "-year", "sort_order", "title"]

    def __str__(self):
        return self.title


class FacultyTrainingSeminar(FacultyProfileRecord):
    faculty = models.ForeignKey(FacultyMember, related_name="training_seminars", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    organizer = models.CharField(max_length=255, blank=True)
    event_date = models.DateField(blank=True, null=True)
    year = models.PositiveIntegerField(blank=True, null=True)
    role = models.CharField(max_length=100, blank=True)
    venue = models.CharField(max_length=255, blank=True)
    evidence_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-event_date", "-year", "sort_order", "title"]

    def __str__(self):
        return self.title


class FacultyAchievement(FacultyProfileRecord):
    faculty = models.ForeignKey(FacultyMember, related_name="achievements", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    awarding_body = models.CharField(max_length=255, blank=True)
    achievement_date = models.DateField(blank=True, null=True)
    year = models.PositiveIntegerField(blank=True, null=True)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=100, blank=True)
    evidence_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-achievement_date", "-year", "sort_order", "title"]

    def __str__(self):
        return self.title


class FacultyContribution(models.Model):
    """A confirmed credit linking a faculty profile to one shared department record."""
    faculty = models.ForeignKey(FacultyMember, on_delete=models.CASCADE, related_name="department_contributions")
    research = models.ForeignKey("research.ResearchProject", null=True, blank=True, on_delete=models.CASCADE)
    publication = models.ForeignKey("research.PublicationRecord", null=True, blank=True, on_delete=models.CASCADE)
    conference = models.ForeignKey("research.ConferenceRecord", null=True, blank=True, on_delete=models.CASCADE)
    extension = models.ForeignKey("extension.ExtensionProject", null=True, blank=True, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, help_text="Use only a role established by the source; conference author does not mean presenter.")
    credited_name = models.CharField(max_length=255, blank=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.CheckConstraint(condition=(
                models.Q(research__isnull=False, publication__isnull=True, conference__isnull=True, extension__isnull=True) |
                models.Q(research__isnull=True, publication__isnull=False, conference__isnull=True, extension__isnull=True) |
                models.Q(research__isnull=True, publication__isnull=True, conference__isnull=False, extension__isnull=True) |
                models.Q(research__isnull=True, publication__isnull=True, conference__isnull=True, extension__isnull=False)
            ), name="faculty_contribution_one_source"),
            *[models.UniqueConstraint(fields=["faculty", field], name="unique_faculty_" + field + "_credit") for field in ("research", "publication", "conference", "extension")],
        ]

    def clean(self):
        from django.core.exceptions import ValidationError
        if sum(bool(getattr(self, field + "_id")) for field in ("research", "publication", "conference", "extension")) != 1:
            raise ValidationError("Select exactly one department record.")

    def __str__(self):
        return f"{self.faculty} — {self.role}"
