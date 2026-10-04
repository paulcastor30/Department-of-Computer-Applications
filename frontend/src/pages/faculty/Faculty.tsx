import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FlaskConical, GraduationCap, Search, Users } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { useFaculty } from "@/hooks/usePeople";
import type { FacultyDirectoryMember, FacultyServiceClassification, FacultyStatus } from "@/types/api";

const TO_BE_PROVIDED = "To be provided by the Department";

const classificationSections: Array<{ key: FacultyServiceClassification; title: string; intro: string }> = [
  {
    key: "active_dca_faculty",
    title: "Active DCA Faculty Members",
    intro: "Regular faculty members officially under the Department of Computer Applications.",
  },
  {
    key: "affiliated_msca_faculty",
    title: "Affiliated Faculty for MSCA Instruction and Supervision",
    intro: "Faculty members from other units who support graduate instruction, supervision, panels, mentoring, or research collaboration.",
  },
  {
    key: "retired_dca_faculty",
    title: "Retired DCA Faculty Members",
    intro: "Retired Department faculty are listed separately from active faculty appointments.",
  },
  {
    key: "academic_staff",
    title: "Academic Support Staff",
    intro: "Academic support personnel are kept separate from faculty records.",
  },
  {
    key: "laboratory_personnel",
    title: "Laboratory Personnel",
    intro: "Laboratory personnel are listed separately when published Department records are available.",
  },
];

const statusLabels: Record<"all" | FacultyStatus, string> = {
  all: "All statuses",
  "": "No status recorded",
  active: "Active",
  active_full_time: "Active Full-Time",
  study_leave: "Study Leave",
  sabbatical_leave: "Sabbatical Leave",
  retired: "Retired",
  inactive_affiliation: "Inactive Affiliation",
};

function valueOrPlaceholder(value?: string) {
  return value?.trim() || TO_BE_PROVIDED;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function includesText(value: string | undefined, query: string) {
  return value?.toLowerCase().includes(query) ?? false;
}

function splitValues(value: string) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ClassificationBadge({ member }: { member: FacultyDirectoryMember }) {
  return (
    <span className="inline-flex rounded-sm border border-border bg-muted/40 px-2 py-1 text-xs font-medium text-primary">
      {member.service_classification_display}
    </span>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      <span>
        {value} {label}
      </span>
    </div>
  );
}

function FacultyDirectoryCard({ member }: { member: FacultyDirectoryMember }) {
  const expertise = member.specialization_areas || member.research_interests || member.teaching_areas;

  return (
    <article className="grid gap-4 border-b border-border p-4 last:border-b-0 sm:grid-cols-[4.5rem_1fr] lg:grid-cols-[4.5rem_1fr_auto]">
      <div className="h-18 w-18 h-[4.5rem] w-[4.5rem] overflow-hidden rounded-md border border-border bg-muted">
        {member.photo ? (
          <img src={member.photo} alt={`${member.title} profile photo`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
            {initials(member.title)}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold leading-snug text-primary">{member.title}</h3>
          <ClassificationBadge member={member} />
        </div>
        <p className="mt-1 text-sm font-medium text-foreground">{valueOrPlaceholder(member.position)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{valueOrPlaceholder(member.highest_degree)}</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{valueOrPlaceholder(expertise)}</p>

        {member.service_classification === "affiliated_msca_faculty" && (
          <dl className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <div>
              <dt className="font-semibold text-foreground">Home Unit</dt>
              <dd>{valueOrPlaceholder(member.home_unit)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">MSCA Role</dt>
              <dd>{valueOrPlaceholder(member.msca_roles)}</dd>
            </div>
          </dl>
        )}

        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={GraduationCap} label="supervised works" value={member.supervised_works_count} />
          <Metric icon={BookOpen} label="publications" value={member.publications_count} />
          <Metric icon={FlaskConical} label="research projects" value={member.research_projects_count} />
          <Metric icon={Users} label="extension projects" value={member.extension_projects_count} />
        </div>
      </div>

      <div className="flex items-start lg:justify-end">
        <Link to={`/faculty/${member.slug}`} className="text-sm font-semibold text-accent hover:text-secondary">
          View Profile
        </Link>
      </div>
    </article>
  );
}

export default function Faculty() {
  const { data: people = [], isLoading, isError } = useFaculty();
  const [query, setQuery] = useState("");
  const [classification, setClassification] = useState<"all" | FacultyServiceClassification>("all");
  const [status, setStatus] = useState<"all" | FacultyStatus>("all");
  const [rank, setRank] = useState("all");
  const [expertise, setExpertise] = useState("");

  const [graduateRole, setGraduateRole] = useState("all");

  const rankOptions = useMemo(() => Array.from(new Set(people.map((member) => member.position).filter(Boolean))).sort(), [people]);
  const graduateRoleOptions = useMemo(
    () => Array.from(new Set(people.flatMap((member) => splitValues(member.msca_roles)))).sort(),
    [people],
  );

  const filteredPeople = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedExpertise = expertise.trim().toLowerCase();

    return people.filter((member) => {
      const matchesClassification = classification === "all" || member.service_classification === classification;
      const matchesStatus = status === "all" || member.faculty_status === status;
      const matchesRank = rank === "all" || member.position === rank;
      const matchesExpertise =
        !normalizedExpertise ||
        includesText(member.specialization_areas, normalizedExpertise) ||
        includesText(member.research_interests, normalizedExpertise) ||
        includesText(member.teaching_areas, normalizedExpertise);
      const matchesGraduateRole = graduateRole === "all" || member.msca_roles.toLowerCase().includes(graduateRole.toLowerCase());
      const matchesSearch =
        !normalizedQuery ||
        includesText(member.title, normalizedQuery) ||
        includesText(member.position, normalizedQuery) ||
        includesText(member.highest_degree, normalizedQuery) ||
        includesText(member.home_unit, normalizedQuery) ||
        includesText(member.msca_roles, normalizedQuery) ||
        includesText(member.specialization_areas, normalizedQuery) ||
        includesText(member.research_interests, normalizedQuery) ||
        includesText(member.teaching_areas, normalizedQuery);

      return matchesClassification && matchesStatus && matchesRank && matchesExpertise && matchesGraduateRole && matchesSearch;
    });
  }, [classification, expertise, graduateRole, people, query, rank, status]);

  return (
    <>
      <Seo
        title="Faculty Directory"
        description="Faculty directory and academic profiles for the Department of Computer Applications, College of Computer Studies, MSU-IIT."
      />

      <Section>
        <SectionHeader as="h1"
          title="Faculty Directory"
          subtitle="Meet the department's teachers and staff. Search by name or use the filters below."
          align="left"
        />

        <section aria-labelledby="faculty-overview" className="mb-10 max-w-4xl">
          <h2 id="faculty-overview" className="mb-3 text-xl font-semibold text-primary">
            Faculty Overview
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            The Department's faculty support instruction, BSCA and MSCA thesis supervision, applied computing research,
            extension, academic service, and graduate education. Official faculty overview text is {TO_BE_PROVIDED}.
          </p>
        </section>

        <div className="mb-8 grid gap-3 rounded-md border border-border bg-muted/20 p-4 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <label className="relative block lg:col-span-2">
            <span className="sr-only">Search faculty directory</span>
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
              placeholder="Search by name, rank, home unit, role, or expertise"
            />
          </label>

          <select aria-label="Filter by classification" value={classification} onChange={(event) => setClassification(event.target.value as typeof classification)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="all">All classifications</option>
            {classificationSections.map((section) => (
              <option key={section.key} value={section.key}>
                {section.title}
              </option>
            ))}
          </select>

          <select aria-label="Filter by active or retired status" value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select aria-label="Filter by rank" value={rank} onChange={(event) => setRank(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="all">All ranks</option>
            {rankOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            aria-label="Filter by expertise"
            value={expertise}
            onChange={(event) => setExpertise(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            placeholder="Expertise keyword"
          />



          <select aria-label="Filter by graduate teaching role" value={graduateRole} onChange={(event) => setGraduateRole(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="all">All graduate roles</option>
            {graduateRoleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading faculty directory...</p>}
        {isError && (
          <p className="rounded-md border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            Faculty profile data could not be loaded. Complete profile information is {TO_BE_PROVIDED}.
          </p>
        )}
        {!isLoading && !isError && people.length === 0 && (
          <p className="rounded-md border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            Complete faculty profile information is {TO_BE_PROVIDED}.
          </p>
        )}

        {!isLoading &&
          !isError &&
          classificationSections.map((section) => {
            const members = filteredPeople.filter((member) => member.service_classification === section.key);
            if (members.length === 0) {
              return null;
            }

            return (
              <section key={section.key} className="mb-10" aria-labelledby={section.key}>
                <div className="mb-4">
                  <h2 id={section.key} className="text-xl font-semibold text-primary">
                    {section.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{section.intro}</p>
                </div>
                <div className="overflow-hidden rounded-md border border-border bg-background">
                  {members.map((member) => (
                    <FacultyDirectoryCard key={member.id} member={member} />
                  ))}
                </div>
              </section>
            );
          })}

        {!isLoading && !isError && people.length > 0 && filteredPeople.length === 0 && (
          <p className="rounded-md border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            No published faculty or staff record matches the selected filters.
          </p>
        )}
      </Section>
    </>
  );
}
