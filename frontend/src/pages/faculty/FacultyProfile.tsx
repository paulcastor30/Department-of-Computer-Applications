import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { BookOpen, FlaskConical, GraduationCap, Mail, MapPin, Phone, Users } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Section } from "@/components/ui/section";
import { PageHero } from "@/components/ui/hero-section";
import { useFacultyMember } from "@/hooks/usePeople";
import type {
  FacultyAchievement,
  FacultyConference,
  FacultyCreativeWork,
  FacultyEducation,
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

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function dateLabel(date?: string | null, year?: number | null) {
  return date || year || "";
}

function EmptyProfileSection() {
  return <p className="text-sm leading-7 text-muted-foreground">{TO_BE_PROVIDED}.</p>;
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
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{valueOrPlaceholder(value)}</dd>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <Icon className="mb-2 h-4 w-4 text-primary" aria-hidden="true" />
      <p className="text-lg font-semibold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function RecordList<T>({ records, render }: { records: T[]; render: (record: T) => ReactNode }) {
  if (records.length === 0) {
    return <EmptyProfileSection />;
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
  const internalResearch = member.research_projects.filter((record) => record.funding_type === "internal");
  const externalResearch = member.research_projects.filter((record) => record.funding_type === "external");

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} ogTitle={member.og_title || seoTitle} ogDescription={member.og_description || seoDescription} />
      <PageHero title={member.title} subtitle={`${member.position || TO_BE_PROVIDED} | ${member.service_classification_display}`} />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-square w-full overflow-hidden rounded-md border border-border bg-muted">
              {member.photo ? (
                <img src={member.photo} alt={`${member.title} profile photo`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-primary">
                  {initials(member.title)}
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-md border border-border p-4">
              <dl className="space-y-3">
                <Field label="Rank / Position" value={member.position} />
                <Field label="Classification" value={member.service_classification_display} />
                <Field label="Status" value={member.faculty_status_display} />
                <Field label="Home Unit" value={member.home_unit} />
                <Field label="Supporting Program" value={member.supporting_programs} />
                <Field label="MSCA Role" value={member.msca_roles} />
              </dl>

              <div className="space-y-2 border-t border-border pt-4 text-sm">
                {member.email && (
                  <a className="flex items-center gap-2 text-accent hover:text-secondary" href={`mailto:${member.email}`}>
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

            <div className="grid grid-cols-2 gap-3">
              <MetricCard icon={GraduationCap} label="Supervised Works" value={member.supervised_works_count} />
              <MetricCard icon={BookOpen} label="Publications" value={member.publications_count} />
              <MetricCard icon={FlaskConical} label="Research Projects" value={member.research_projects_count} />
              <MetricCard icon={Users} label="Extension Projects" value={member.extension_projects_count} />
            </div>
          </aside>

          <div>
            <nav aria-label="Faculty profile sections" className="mb-8 flex flex-wrap gap-2">
              {navItems.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="rounded-sm border border-border px-3 py-2 text-xs font-medium text-primary hover:bg-muted">
                  {label}
                </a>
              ))}
            </nav>

            <div className="space-y-8">
              <FacultyProfileSection id="overview" title="Profile Overview">
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{valueOrPlaceholder(member.profile_summary)}</p>
                <dl className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Highest Degree" value={member.highest_degree} />
                  <Field label="Appointment / Assignment Note" value={member.appointment_or_assignment_note} />
                </dl>
              </FacultyProfileSection>

              <FacultyProfileSection id="education" title="Educational Attainment">
                <RecordList
                  records={member.education_records}
                  render={(record: FacultyEducation) => (
                    <TimelineItem
                      key={record.id}
                      title={record.degree_name || record.degree_level_display}
                      meta={[record.degree_level_display, record.field_or_specialization, record.institution, record.year_completed].filter(Boolean).join(" | ")}
                    >
                      {record.notes || null}
                    </TimelineItem>
                  )}
                />
              </FacultyProfileSection>

              <FacultyProfileSection id="expertise" title="Expertise">
                <RecordList
                  records={member.expertise_records}
                  render={(record) => (
                    <TimelineItem key={record.id} title={record.title} meta={record.expertise_type_display}>
                      {record.description || null}
                    </TimelineItem>
                  )}
                />
              </FacultyProfileSection>

              <FacultyProfileSection id="supervised-work" title="Supervised Work">
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
              </FacultyProfileSection>

              <FacultyProfileSection id="publications" title="Publications">
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
              </FacultyProfileSection>

              <FacultyProfileSection id="conferences" title="Conferences">
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
              </FacultyProfileSection>

              <FacultyProfileSection id="research" title="Research Projects">
                <div className="grid gap-6">
                  <section>
                    <h3 className="mb-3 text-base font-semibold text-foreground">Internally-Funded Research</h3>
                    <ResearchRecords records={internalResearch} />
                  </section>
                  <section>
                    <h3 className="mb-3 text-base font-semibold text-foreground">Externally-Funded Research</h3>
                    <ResearchRecords records={externalResearch} />
                  </section>
                </div>
              </FacultyProfileSection>

              <FacultyProfileSection id="extension" title="Extension Projects">
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
              </FacultyProfileSection>

              <FacultyProfileSection id="creative-works" title="Creative Works">
                <RecordList
                  records={member.creative_works}
                  render={(record: FacultyCreativeWork) => (
                    <TimelineItem key={record.id} title={record.title} meta={[record.category, dateLabel(record.work_date, record.year), record.role].filter(Boolean).join(" | ")} evidenceUrl={record.evidence_url}>
                      {record.description || null}
                    </TimelineItem>
                  )}
                />
              </FacultyProfileSection>

              <FacultyProfileSection id="training" title="Training and Seminars">
                <RecordList
                  records={member.training_seminars}
                  render={(record: FacultyTrainingSeminar) => (
                    <TimelineItem key={record.id} title={record.title} meta={[record.organizer, record.venue, dateLabel(record.event_date, record.year), record.role].filter(Boolean).join(" | ")} evidenceUrl={record.evidence_url} />
                  )}
                />
              </FacultyProfileSection>

              <FacultyProfileSection id="achievements" title="Achievements">
                <RecordList
                  records={member.achievements}
                  render={(record: FacultyAchievement) => (
                    <TimelineItem key={record.id} title={record.title} meta={[record.awarding_body, record.level, dateLabel(record.achievement_date, record.year)].filter(Boolean).join(" | ")} evidenceUrl={record.evidence_url}>
                      {record.description || null}
                    </TimelineItem>
                  )}
                />
              </FacultyProfileSection>
            </div>

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
