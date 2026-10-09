import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Section } from "@/components/ui/section";
import { PageHero } from "@/components/ui/hero-section";
import { useFacultyMember } from "@/hooks/usePeople";
import type {
  DepartmentContribution,
  FacultyAchievement,
  FacultyConference,
  FacultyCreativeWork,
  FacultyExtensionProject,
  FacultyPublication,
  FacultyResearchProject,
  FacultySupervisedWork,
  FacultyTrainingSeminar,
} from "@/types/api";

const TO_BE_PROVIDED = "To be provided by the Department";

function valueOrPlaceholder(value?: string | null | number) {
  return value === 0 || value ? String(value) : TO_BE_PROVIDED;
}

function dateLabel(date?: string | null, year?: number | null) {
  return date || year || "";
}


function FacultyProfileSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-7">
      <h2 className="mb-4 text-xl font-semibold text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (!value || /^to be (provided|validated)/i.test(String(value))) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{valueOrPlaceholder(value)}</dd>
    </div>
  );
}

function RecordList<T>({ records, render }: { records: T[]; render: (record: T) => ReactNode }) {
  if (records.length === 0) {
    return null;
  }

  return <div className="space-y-4">{records.map(render)}</div>;
}

function TimelineItem({ title, meta, children, evidenceUrl }: { title: string; meta?: ReactNode; children?: ReactNode; evidenceUrl?: string }) {
  return (
    <article className="rounded-md border border-border bg-background p-4">
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      {meta && <div className="mt-1 text-sm text-muted-foreground">{meta}</div>}
      {children && <div className="mt-3 text-sm leading-7 text-muted-foreground">{children}</div>}
      {evidenceUrl && (
        <a href={evidenceUrl} className="mt-3 inline-block text-sm font-semibold text-accent hover:text-secondary">
          Evidence link
        </a>
      )}
    </article>
  );
}

const navItems = [
  ["overview", "Overview"],
  ["education", "Education"],
  ["contact", "Contact"],
  ["expertise", "Expertise"],
  ["supervised-work", "Supervised Work"],
  ["publications", "Publications"],
  ["conferences", "Conferences"],
  ["research", "Research"],
  ["extension", "Extension"],
  ["creative-works", "Creative Works"],
  ["training", "Training"],
  ["achievements", "Achievements"],
] as const;

export default function FacultyProfile() {
  const { slug } = useParams();
  const { data: member, isLoading, isError } = useFacultyMember(slug);

  if (isLoading) {
    return (
      <>
        <Seo title="Faculty Profile" description="Faculty profile information." />
        <PageHero title="Faculty profile" subtitle="Loading the department directory." />
        <Section>
          <p role="status" className="text-sm text-muted-foreground">Loading faculty profile...</p>
        </Section>
      </>
    );
  }

  if (isError || !member) {
    return (
      <>
        <Seo title="Faculty Profile Unavailable" description="Faculty profile information could not be loaded." />
        <PageHero title="Faculty Profile Unavailable" subtitle="The requested faculty profile could not be loaded from the Department directory." />
        <Section>
          <p className="rounded-md border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            Complete individual faculty profile information is {TO_BE_PROVIDED}.
          </p>
          <Link to="/faculty" className="mt-6 inline-block text-sm font-semibold text-accent hover:text-secondary">
            Back to Faculty Directory
          </Link>
        </Section>
      </>
    );
  }

  const seoTitle = member.seo_title || `${member.title} | Faculty Profile`;
  const seoDescription =
    member.seo_description ||
    `${member.title}${member.position ? `, ${member.position}` : ""}, Department of Computer Applications faculty profile.`;
  const credits = member.department_contributions || [];
  const shared = (kind: DepartmentContribution["kind"]) => credits.filter(record => record.kind === kind);
  const sectionAvailable: Record<string, boolean> = {
    contact: true,
    overview: Boolean(member.profile_summary || member.highest_degree || member.appointment_or_assignment_note),
    education: Boolean(member.education_records.length || member.educational_background),
    expertise: Boolean(member.expertise_records.length || member.specialization_areas || member.research_interests || member.teaching_areas),
    "supervised-work": Boolean(member.supervised_works.length), publications: Boolean(member.publications.length || shared("publication").length),
    conferences: Boolean(member.conferences.length || shared("conference").length), research: Boolean(member.research_projects.length || shared("research").length),
    extension: Boolean(member.extension_projects.length || shared("extension").length), "creative-works": Boolean(member.creative_works.length),
    training: Boolean(member.training_seminars.length), achievements: Boolean(member.achievements.length),
  };
  const educationGroups = [
    { title: "Completed qualifications", records: member.education_records.filter(record => record.degree_level !== "other" && (record.year_completed != null || /Completed qualification; year not supplied/i.test(record.notes)) && !/ongoing|on-going|not yet completed|completion status/i.test(record.notes)) },
    { title: "Ongoing", records: member.education_records.filter(record => record.degree_level !== "other" && /ongoing|on-going|not yet completed/i.test(record.notes)) },
    { title: "Study records awaiting confirmation", records: member.education_records.filter(record => record.degree_level !== "other" && !/Completed qualification; year not supplied/i.test(record.notes) && !/ongoing|on-going|not yet completed/i.test(record.notes) && (record.year_completed == null || /completion status/i.test(record.notes))) },
  ];
  educationGroups.push({ title: "Fellowships and other academic experience", records: member.education_records.filter(record => record.degree_level === "other") });
  const internalResearch = member.research_projects.filter((record) => record.funding_type === "internal");
  const externalResearch = member.research_projects.filter((record) => record.funding_type === "external");

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} ogTitle={member.og_title || seoTitle} ogDescription={member.og_description || seoDescription} />
      <PageHero title={member.title} subtitle={[member.position ? `${member.faculty_status === "resigned" ? "Former position: " : ""}${member.position}` : "", member.service_classification_display].filter(Boolean).join(" | ")} />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {member.photo && <div className="aspect-square w-full overflow-hidden rounded-md border border-border bg-muted">
              <img src={member.photo} alt="" className="h-full w-full object-cover" />
            </div>}

            <div className="space-y-4 rounded-md border border-border p-4">
              <dl className="space-y-3">
                <Field label="Rank / Position" value={member.position} />
                {member.transferred_from_dca && <Field label="Department relationship" value="Transferred from DCA" />}
                <Field label="Classification" value={member.service_classification_display} />
                <Field label="Status" value={member.service_classification === "retired_dca_faculty" ? "Retired" : member.faculty_status_display} />
                <Field label="Home Unit" value={member.home_unit} />
                <Field label="PRC license number (as supplied)" value={member.prc_license_number} />
                <Field label="Supporting Program" value={member.supporting_programs} />
                <Field label="MSCA Role" value={member.msca_roles} />
              </dl>

              <div className="space-y-2 border-t border-border pt-4 text-sm">
                {member.email && (
                  <a className="text-link flex min-h-11 items-center gap-2 break-all" href={`mailto:${member.email}`}>
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {member.phone}
                  </p>
                )}
                {member.office && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {member.office}
                  </p>
                )}
                {!member.email && !member.phone && !member.office && (
                  <Link to="/about/contact" className="font-semibold text-accent hover:text-secondary">
                    Department contact inquiry
                  </Link>
                )}
              </div>
            </div>

          </aside>

          <div>
            <nav aria-label="Faculty profile sections" className="mb-8 flex flex-wrap gap-2">
              {navItems.filter(([id]) => sectionAvailable[id]).map(([id, label]) => (
                <a key={id} href={`#${id}`} className="outline-link">
                  {label}
                </a>
              ))}
            </nav>

            {credits.length > 0 && <p className="mb-8 max-w-3xl text-sm leading-7 text-muted-foreground">The work below shows credited contributions in the department’s shared records, including historical work. These credits do not establish a current appointment or project status.</p>}
            <div className="space-y-8">
              {sectionAvailable["overview"] && <FacultyProfileSection id="overview" title="Profile Overview">
                {member.profile_summary && <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{member.profile_summary}</p>}
                <dl className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Highest completed qualification" value={member.highest_degree} />
                  <Field label="Appointment / Assignment Note" value={member.appointment_or_assignment_note} />
                </dl>
              </FacultyProfileSection>}

              {sectionAvailable["education"] && <FacultyProfileSection id="education" title="Educational Attainment">
                {!member.education_records.length && <p className="whitespace-pre-line leading-7 text-muted-foreground">{member.educational_background}</p>}
                {educationGroups.filter(group => group.records.length).map(group => <section key={group.title} className="mt-6">
                  <h3 className="mb-4 text-lg font-semibold text-primary">{group.title}</h3>
                  <div className="space-y-4">{group.records.map(record => <article key={record.id} className="rounded-md border border-border p-4">
                    <h4 className="font-semibold text-primary">{record.degree_name || record.degree_level_display}</h4>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{[record.field_or_specialization, record.institution, record.year_completed].filter(Boolean).join(" · ")}</p>
                    {record.notes && <p className="mt-3 leading-7 text-muted-foreground">{record.notes}</p>}
                  </article>)}</div>
                </section>)}
              </FacultyProfileSection>}

              <FacultyProfileSection id="contact" title="Contact and consultation enquiries">
                <p className="max-w-3xl leading-7 text-muted-foreground">For academic questions or to request a consultation, contact the faculty member. Include your name, the subject of your enquiry, and any proposed meeting times. Ask them to confirm availability and the meeting location before visiting.</p>
                {member.email ? <>
                  <a className="action-link mt-5" href={`mailto:${member.email}?subject=${encodeURIComponent(`Academic enquiry for ${member.title}`)}`}>Email {member.title}</a>
                  <p className="mt-3 break-all text-sm leading-6 text-muted-foreground">This opens your email app. You can also copy the address: {member.email}</p>
                </> : <p className="mt-4 leading-7 text-muted-foreground">Faculty contact details: To be provided by the Department. Contact the department for help reaching this person.</p>}
                <p className="mt-5 leading-7 text-muted-foreground">If you need an accessible meeting arrangement, include the assistance you would like to discuss.</p>
                <Link className="outline-link mt-5" to="/about/contact">Department contact and visiting details</Link>
              </FacultyProfileSection>

              {sectionAvailable["expertise"] && <FacultyProfileSection id="expertise" title="Expertise">
                {!member.expertise_records.length && <p className="whitespace-pre-line leading-7 text-muted-foreground">{[member.specialization_areas, member.research_interests, member.teaching_areas].filter(Boolean).join("\n")}</p>}
                <RecordList
                  records={member.expertise_records}
                  render={(record) => (
                    <TimelineItem key={record.id} title={record.title} meta={record.expertise_type_display}>
                      {record.description || null}
                    </TimelineItem>
                  )}
                />
              </FacultyProfileSection>}

              {sectionAvailable["supervised-work"] && <FacultyProfileSection id="supervised-work" title="Supervised Work">
                <RecordList
                  records={member.supervised_works}
                  render={(record: FacultySupervisedWork) => (
                    <TimelineItem
                      key={record.id}
                      title={record.title}
                      meta={[record.program_level_display, record.academic_year || record.completion_year, record.faculty_role].filter(Boolean).join(" | ")}
                      evidenceUrl={record.evidence_url}
                    >
                      <dl className="grid gap-3 md:grid-cols-2">
                        <Field label="Researchers" value={record.researchers} />
                        <Field label="Adviser" value={record.adviser} />
                        <Field label="Co-Adviser" value={record.co_adviser} />
                        <Field label="Award" value={record.award} />
                      </dl>
                      {record.abstract && <p className="mt-3">{record.abstract}</p>}
                    </TimelineItem>
                  )}
                />
              </FacultyProfileSection>}

              {sectionAvailable["publications"] && <FacultyProfileSection id="publications" title="Publications">
                <SharedContributions records={shared("publication")} />
                <RecordList
                  records={member.publications}
                  render={(record: FacultyPublication) => (
                    <TimelineItem
                      key={record.id}
                      title={record.title}
                      meta={[record.authors, record.venue, record.publication_type, dateLabel(record.publication_date, record.year)].filter(Boolean).join(" | ")}
                      evidenceUrl={record.url}
                    >
                      <dl className="grid gap-3 md:grid-cols-2">
                        <Field label="DOI" value={record.doi} />
                        <Field label="Indexing Note" value={record.indexing_note} />
                      </dl>
                      {record.citation_text && <p className="mt-3">{record.citation_text}</p>}
                    </TimelineItem>
                  )}
                />
              </FacultyProfileSection>}

              {sectionAvailable["conferences"] && <FacultyProfileSection id="conferences" title="Conference Contributions">
                <SharedContributions records={shared("conference")} />
                <RecordList
                  records={member.conferences}
                  render={(record: FacultyConference) => (
                    <TimelineItem
                      key={record.id}
                      title={record.title}
                      meta={[record.conference_name, record.location, dateLabel(record.event_date, record.year), record.role].filter(Boolean).join(" | ")}
                      evidenceUrl={record.evidence_url}
                    />
                  )}
                />
              </FacultyProfileSection>}

              {sectionAvailable["research"] && <FacultyProfileSection id="research" title="Research Projects">
                <SharedContributions records={shared("research")} />
                <div className="grid gap-6">
                  {internalResearch.length > 0 && <section>
                    <h3 className="mb-3 text-base font-semibold text-foreground">Internally-Funded Research</h3>
                    <ResearchRecords records={internalResearch} />
                  </section>}
                  {externalResearch.length > 0 && <section>
                    <h3 className="mb-3 text-base font-semibold text-foreground">Externally-Funded Research</h3>
                    <ResearchRecords records={externalResearch} />
                  </section>}
                </div>
              </FacultyProfileSection>}

              {sectionAvailable["extension"] && <FacultyProfileSection id="extension" title="Extension Projects">
                <SharedContributions records={shared("extension")} />
                <RecordList
                  records={member.extension_projects}
                  render={(record: FacultyExtensionProject) => (
                    <TimelineItem key={record.id} title={record.title} meta={[record.implementation_period, record.role, record.status].filter(Boolean).join(" | ")} evidenceUrl={record.evidence_url}>
                      <dl className="grid gap-3 md:grid-cols-2">
                        <Field label="Funding Source / Office" value={record.funding_source} />
                        <Field label="Partner / Community" value={record.partner_community} />
                      </dl>
                    </TimelineItem>
                  )}
                />
              </FacultyProfileSection>}

              {sectionAvailable["creative-works"] && <FacultyProfileSection id="creative-works" title="Creative Works">
                <RecordList
                  records={member.creative_works}
                  render={(record: FacultyCreativeWork) => (
                    <TimelineItem key={record.id} title={record.title} meta={[record.category, dateLabel(record.work_date, record.year), record.role].filter(Boolean).join(" | ")} evidenceUrl={record.evidence_url}>
                      {record.description || null}
                    </TimelineItem>
                  )}
                />
              </FacultyProfileSection>}

              {sectionAvailable["training"] && <FacultyProfileSection id="training" title="Training and Seminars">
                <RecordList
                  records={member.training_seminars}
                  render={(record: FacultyTrainingSeminar) => (
                    <TimelineItem key={record.id} title={record.title} meta={[record.organizer, record.venue, dateLabel(record.event_date, record.year), record.role].filter(Boolean).join(" | ")} evidenceUrl={record.evidence_url} />
                  )}
                />
              </FacultyProfileSection>}

              {sectionAvailable["achievements"] && <FacultyProfileSection id="achievements" title="Achievements">
                <RecordList
                  records={member.achievements}
                  render={(record: FacultyAchievement) => (
                    <TimelineItem key={record.id} title={record.title} meta={[record.awarding_body, record.level, dateLabel(record.achievement_date, record.year)].filter(Boolean).join(" | ")} evidenceUrl={record.evidence_url}>
                      {record.description || null}
                    </TimelineItem>
                  )}
                />
              </FacultyProfileSection>}
            </div>

            {member.last_updated_note && <p className="mt-8 text-sm leading-6 text-muted-foreground">{member.last_updated_note}</p>}
            <p className="mt-5 text-sm leading-6 text-muted-foreground">This page contains available professional information. For further details, contact the faculty member or department.</p>
            <Link to="/faculty" className="mt-8 inline-block text-sm font-semibold text-accent hover:text-secondary">
              Back to Faculty Directory
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

function ResearchRecords({ records }: { records: FacultyResearchProject[] }) {
  return (
    <RecordList
      records={records}
      render={(record: FacultyResearchProject) => (
        <TimelineItem key={record.id} title={record.title} meta={[record.implementation_period, record.role, record.status].filter(Boolean).join(" | ")} evidenceUrl={record.evidence_url}>
          <dl className="grid gap-3 md:grid-cols-2">
            <Field label="Funding Source / Office" value={record.funding_source} />
            <Field label="Amount" value={record.amount} />
          </dl>
          {record.outputs_or_evidence && <p className="mt-3">{record.outputs_or_evidence}</p>}
        </TimelineItem>
      )}
    />
  );
}


function SharedContributions({ records }: { records: DepartmentContribution[] }) {
  if (!records.length) return null;
  const render = (record: DepartmentContribution) => <article key={record.id} className="rounded-md border border-border p-4">
    <h3 className="font-semibold text-primary">{record.title}</h3>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{record.kind === "research" || record.kind === "extension" ? `Reporting year: ${record.year}` : record.year}{record.role ? ` · ${record.role}` : ""}{record.withdrawn ? " · Withdrawn" : ""}</p>
    <Link className="text-link mt-2 inline-flex min-h-11 items-center" to={record.href}>View full record<span className="sr-only"> for {record.title}</span></Link>
  </article>;
  return <div className="mb-6 space-y-4">
    {records.slice(0, 3).map(render)}
    {records.length > 3 && <details className="rounded-md border border-border p-4"><summary className="min-h-11 cursor-pointer font-semibold">View all {records.length} records</summary><div className="mt-4 space-y-4">{records.slice(3).map(render)}</div></details>}
  </div>;
}
