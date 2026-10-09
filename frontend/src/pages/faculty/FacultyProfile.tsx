import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
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
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
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
    <article className="border-b border-border py-4">
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      {meta && <div className="mt-1 text-sm text-muted-foreground">{meta}</div>}
      {children && <div className="mt-3 text-sm leading-7 text-muted-foreground">{children}</div>}
      {evidenceUrl && (
        <a href={evidenceUrl} className="mt-3 inline-block text-sm font-semibold text-accent hover:text-secondary">
          View source
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
  ["responsibilities", "Teaching and supervision"],
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
        <Seo title="Personnel Profile" description="Department personnel profile." />
        <PageHero title="Personnel profile" />
        <Section>
          <p role="status" className="text-sm text-muted-foreground">Loading profile...</p>
        </Section>
      </>
    );
  }

  if (isError || !member) {
    return (
      <>
        <Seo title="Profile Unavailable" description="Faculty profile information could not be loaded." />
        <PageHero title="Profile Unavailable" subtitle="The requested faculty profile could not be loaded from the Department directory." />
        <Section>
          <p className="rounded-md border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            This profile could not be loaded. Return to the faculty directory or contact the department.
          </p>
          <Link to="/faculty" className="mt-6 inline-block text-sm font-semibold text-accent hover:text-secondary">
            Back to Faculty & Staff
          </Link>
        </Section>
      </>
    );
  }

  const isStaff = ["academic_staff", "laboratory_personnel"].includes(member.service_classification);
  const profileLabel = isStaff ? "Staff Profile" : "Faculty Profile";
  const seoTitle = member.seo_title || `${member.title} | ${profileLabel}`;
  const seoDescription =
    member.seo_description ||
    `${member.title}${member.position ? `, ${member.position}` : ""}, Department of Computer Applications profile.`;
  const credits = member.department_contributions || [];
  const shared = (kind: DepartmentContribution["kind"]) => credits.filter(record => record.kind === kind);
  const sectionAvailable: Record<string, boolean> = {
    contact: true,
    responsibilities: Boolean(!isStaff && (member.supporting_programs || member.msca_roles)),
    overview: Boolean(member.profile_summary || member.appointment_or_assignment_note),
    education: member.education_records.some(record => ["completed", "ongoing", "experience"].includes(record.academic_status)),
    expertise: Boolean(member.expertise_records.length || member.specialization_areas || member.research_interests || member.teaching_areas),
    "supervised-work": Boolean(member.supervised_works.length), publications: Boolean(member.publications.length || shared("publication").length),
    conferences: Boolean(member.conferences.length || shared("conference").length), research: Boolean(member.research_projects.length || shared("research").length),
    extension: Boolean(member.extension_projects.length || shared("extension").length), "creative-works": Boolean(member.creative_works.length),
    training: Boolean(member.training_seminars.length), achievements: Boolean(member.achievements.length),
  };
  const educationGroups = [
    { title: "Completed qualifications", records: member.education_records.filter(record => record.academic_status === "completed").slice().sort((a, b) => (b.year_completed ?? -1) - (a.year_completed ?? -1)) },
    { title: "Ongoing", records: member.education_records.filter(record => record.academic_status === "ongoing") },
    { title: "Fellowships and other academic experience", records: member.education_records.filter(record => record.academic_status === "experience").slice().sort((a, b) => (b.year_completed ?? -1) - (a.year_completed ?? -1)) },
  ];
  const hasSidebar = Boolean(member.photo || member.transferred_from_dca || (member.home_unit && member.service_classification === "affiliated_msca_faculty") || member.service_classification === "retired_dca_faculty" || !["Active", "Active Full-Time", ""].includes(member.faculty_status_display || ""));
  const internalResearch = member.research_projects.filter((record) => record.funding_type === "internal");
  const externalResearch = member.research_projects.filter((record) => record.funding_type === "external");

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} ogTitle={member.og_title || seoTitle} ogDescription={member.og_description || seoDescription} />
      <PageHero className="!py-6" title={member.title} subtitle={member.position ? `${member.faculty_status === "resigned" ? "Former appointment: " : ""}${member.position}` : undefined} />

      <Section className="!py-6">
        <div className={hasSidebar ? "grid gap-8 lg:grid-cols-[18rem_1fr]" : "max-w-4xl"}>
          {hasSidebar && <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {member.photo && <div className="aspect-square w-full overflow-hidden rounded-md border border-border bg-muted">
              <img src={member.photo} alt="" className="h-full w-full object-cover" />
            </div>}

            {(member.transferred_from_dca || (member.home_unit && member.service_classification === "affiliated_msca_faculty") || member.service_classification === "retired_dca_faculty" || !["Active", "Active Full-Time", ""].includes(member.faculty_status_display || "")) && <div className="space-y-4 border-l border-border pl-4">
              <dl className="space-y-3">
                {member.transferred_from_dca && <Field label="Department relationship" value="Transferred from DCA" />}
                {!["Active", "Active Full-Time"].includes(member.faculty_status_display) && member.service_classification !== "retired_dca_faculty" && <Field label="Status" value={member.faculty_status_display} />}
                {member.service_classification === "retired_dca_faculty" && <Field label="Status" value="Retired" />}
                {member.service_classification === "affiliated_msca_faculty" && <Field label="Home unit" value={member.home_unit} />}

              </dl>
            </div>}
          </aside>}

          <div>
            {Object.values(sectionAvailable).filter(Boolean).length > 1 && <nav aria-label="Profile sections" className="mb-6 flex flex-wrap gap-x-5 gap-y-1 pb-3">
              {navItems.filter(([id]) => sectionAvailable[id]).map(([id, label]) => (
                <a key={id} href={`#${id}`} className="text-link inline-flex min-h-11 items-center text-sm">
                  {label}
                </a>
              ))}
            </nav>}

            <div className="space-y-8">
              {sectionAvailable["overview"] && <FacultyProfileSection id="overview" title="Overview">
                {member.profile_summary && <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{member.profile_summary}</p>}
                <dl className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Appointment" value={member.appointment_or_assignment_note} />
                </dl>
              </FacultyProfileSection>}

              {sectionAvailable["education"] && <FacultyProfileSection id="education" title="Educational Attainment">
                {educationGroups.filter(group => group.records.length).map(group => <section key={group.title} className="mt-6">
                  <h3 className="mb-4 text-lg font-semibold text-primary">{group.title}</h3>
                  <div className="divide-y divide-border">{group.records.map(record => <article key={record.id} className="py-3">
                    <h4 className="font-semibold text-primary">{record.degree_name || record.degree_level_display}</h4>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{[record.field_or_specialization, record.institution, record.year_completed].filter(Boolean).join(" · ")}</p>
                  </article>)}</div>
                </section>)}
              </FacultyProfileSection>}

              <FacultyProfileSection id="contact" title={isStaff ? "Contact" : "Contact and consultation"}>
                {!isStaff && <p className="max-w-3xl text-sm leading-6 text-muted-foreground">For consultations, confirm availability and the meeting location before visiting.</p>}
                {member.email ? <>
                  <a className="text-link mt-2 inline-flex min-h-11 max-w-full items-center break-all" href={`mailto:${member.email}?subject=${encodeURIComponent(`${isStaff ? "Department" : "Academic"} enquiry for ${member.title}`)}`} aria-label={`Email ${member.title}`}>{member.email}</a>
                </> : null}
                <p className="mt-2 text-sm leading-6 text-muted-foreground">You may request accessible meeting arrangements when contacting the department.</p>
                {member.phone && <p className="mt-3 text-sm">{member.phone}</p>}
                {member.office && <p className="mt-2 text-sm">{member.office}</p>}
                <Link className="text-link mt-3 inline-flex min-h-11 items-center text-sm" to="/about/contact">Department contact and visiting details</Link>
              </FacultyProfileSection>

              {sectionAvailable["expertise"] && <FacultyProfileSection id="expertise" title="Expertise">
                {!member.expertise_records.length && <p className="whitespace-pre-line leading-7 text-muted-foreground">{[member.specialization_areas, member.research_interests, member.teaching_areas].filter(Boolean).join("\n").split(/\n|;/).map(value => value.trim()).filter(Boolean).join("; ")}</p>}
                {member.expertise_records.length > 0 && <ul className="space-y-3">
                  {member.expertise_records.map(record => <li key={record.id}>
                    <span className="font-semibold">{record.title}</span>
                    {record.expertise_type !== "expertise" && <span className="ml-2 text-sm text-muted-foreground">{record.expertise_type_display}</span>}
                    {record.description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{record.description}</p>}
                  </li>)}
                </ul>}
              </FacultyProfileSection>}

              {sectionAvailable.responsibilities && <FacultyProfileSection id="responsibilities" title="Teaching and supervision">
                <dl className="space-y-3">
                  <Field label="Programs" value={member.supporting_programs?.split(",").map(value => value.trim()).join(", ")} />
                  <Field label="Graduate supervision" value={member.msca_roles} />
                </dl>
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

            <Link to="/faculty" className="mt-8 inline-block text-sm font-semibold text-accent hover:text-secondary">
              Back to Faculty & Staff
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
  const render = (record: DepartmentContribution) => <article key={record.id} className="border-b border-border py-4">
    <h3 className="font-semibold text-primary">{record.title}</h3>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{record.kind === "research" || record.kind === "extension" ? `Reporting year: ${record.year}` : record.year}{record.role ? ` · ${record.role}` : ""}{record.withdrawn ? " · Withdrawn" : ""}</p>
    <Link className="text-link mt-2 inline-flex min-h-11 items-center" to={record.href}>View full record<span className="sr-only"> for {record.title}</span></Link>
  </article>;
  return <div className="mb-6 space-y-4">
    {records.slice(0, 3).map(render)}
    {records.length > 3 && <details className="border-b border-border py-3"><summary className="min-h-11 cursor-pointer font-semibold">View all {records.length} records</summary><div className="mt-4 space-y-4">{records.slice(3).map(render)}</div></details>}
  </div>;
}
