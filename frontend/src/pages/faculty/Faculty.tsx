import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { useFaculty } from "@/hooks/usePeople";
import type { FacultyDirectoryMember } from "@/types/api";

function FacultyCard({ member }: { member: FacultyDirectoryMember }) {
  return <article className="flex flex-col rounded-md border border-border p-6">
    <div className="mb-5 flex items-start gap-4">
      {member.photo && <img src={member.photo} alt="" className="h-20 w-20 shrink-0 rounded-md object-cover" loading="lazy" />}
      <div className="min-w-0"><h3 className="text-xl font-semibold leading-snug text-primary"><Link className="text-link" to={`/faculty/${member.slug}`}>{member.title}</Link></h3>
      {member.position && <p className="mt-2 leading-6">{member.position}</p>}
      {["study_leave", "sabbatical_leave", "inactive_affiliation"].includes(member.faculty_status) && <p className="mt-1 text-sm text-muted-foreground">{member.faculty_status_display}</p>}
      {member.highest_degree && <p className="mt-1 text-sm text-muted-foreground">Highest completed qualification: {member.highest_degree}</p>}</div>
    </div>
    {member.transferred_from_dca && <p className="mb-4 leading-7 text-muted-foreground">Transferred from DCA{member.home_unit ? ` to ${member.home_unit}` : ""}.{member.service_classification === "affiliated_msca_faculty" && member.active_affiliation ? " Also affiliated with MSCA." : ""}</p>}
    {(member.specialization_areas || member.research_interests) && <p className="mb-6 leading-7 text-muted-foreground"><span className="font-semibold text-foreground">Specialization: </span>{member.specialization_areas || member.research_interests}</p>}
    <div className="mt-auto flex flex-wrap gap-3"><Link className="outline-link" to={`/faculty/${member.slug}`}>View profile<span className="sr-only"> of {member.title}</span></Link>
      {member.email && <a className="outline-link" href={`mailto:${member.email}`}>Email<span className="sr-only"> {member.title}</span></a>}
    </div>
  </article>;
}

export default function Faculty() {
  const { data: people = [], isLoading, isError, refetch } = useFaculty();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => people.filter(member =>
    [member.title, member.position, member.specialization_areas, member.research_interests, member.email, member.home_unit, member.supporting_programs].some(value => value?.toLowerCase().includes(query.trim().toLowerCase()))), [people, query]);
  const groups = [
    { title: "Core faculty", members: filtered.filter(p => p.service_classification === "active_dca_faculty" && !p.transferred_from_dca && p.faculty_category !== "Lecturer") },
    { title: "Lecturers", members: filtered.filter(p => p.service_classification === "active_dca_faculty" && !p.transferred_from_dca && p.faculty_category === "Lecturer") },
    { title: "Affiliated graduate faculty", members: filtered.filter(p => p.service_classification === "affiliated_msca_faculty") },
    { title: "Transferred faculty", intro: "Faculty who have transferred to another unit. Those with a current graduate affiliation also appear under Affiliated graduate faculty.", members: filtered.filter(p => p.transferred_from_dca) },
    { title: "Retired faculty", members: filtered.filter(p => p.service_classification === "retired_dca_faculty") },
    { title: "Department staff", members: filtered.filter(p => ["academic_staff", "laboratory_personnel"].includes(p.service_classification)) },
  ];
  return <>
    <Seo title="Faculty" description="Meet the faculty of the Department of Computer Applications, MSU-IIT. Explore their qualifications, specialization areas and institutional contact details." />
    <Section>
      <SectionHeader as="h1" title="Meet our faculty" subtitle="Find a teacher, explore their specialization, or ask about their academic work." />
      <p className="mb-8 max-w-3xl leading-7 text-muted-foreground">The profiles introduce the people behind Computer Applications. Open a profile for educational background and available professional information.</p>
      <div className="mb-8 max-w-xl"><label htmlFor="faculty-search" className="mb-2 block font-semibold">Search faculty</label>
        <input id="faculty-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Name or specialization, such as embedded systems" className="min-h-12 w-full rounded-md border border-border bg-background px-4 text-base" />
        {query && <button className="text-link mt-2 min-h-11" onClick={() => setQuery("")}>Clear search</button>}
      </div>
      {isLoading ? <p role="status">Loading faculty profiles…</p> : isError ? <div role="status"><p>Faculty profiles could not be loaded. Please try again or contact the department.</p><button className="outline-link mt-4" onClick={() => refetch()}>Try again</button></div> : <>
        <p role="status" className="mb-6 text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "profile" : "profiles"}{query ? " match your search." : " available."}</p>
        {!filtered.length && <p className="mb-8">{query ? "Try another name or a broader specialization." : "Faculty profiles: To be provided by the Department."}</p>}
        <div className="space-y-12">{groups.filter(g => g.members.length).map(group => <section key={group.title}><h2 className="mb-6 text-2xl font-semibold text-primary">{group.title}</h2>{group.intro && <p className="mb-6 max-w-3xl leading-7 text-muted-foreground">{group.intro}</p>}<div className="grid gap-6 lg:grid-cols-2">{group.members.map(member => <FacultyCard key={member.id} member={member} />)}</div></section>)}</div>
      </>}
      <div className="mt-12 border-t border-border pt-8"><p className="mb-4 leading-7">For general enquiries or help reaching a faculty member, contact the department.</p><Link className="outline-link" to="/about/contact">Department contact details</Link></div>
    </Section>
  </>;
}
