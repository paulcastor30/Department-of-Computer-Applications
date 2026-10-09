import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { useFaculty } from "@/hooks/usePeople";
import type { FacultyDirectoryMember } from "@/types/api";

function FacultyCard({ member, former = false }: { member: FacultyDirectoryMember; former?: boolean }) {
  const expertise = (member.specialization_areas || member.research_interests || "").split(/\n|;/).map(value => value.trim().replace(/,\s*/g, ", ")).filter(Boolean);
  return <article className="flex gap-4 border-b border-border py-5">
    {member.photo && <img src={member.photo} alt="" className="h-20 w-20 shrink-0 rounded-sm object-cover" loading="lazy" />}
    <div className="min-w-0 flex-1">
      <h3 className="text-lg font-semibold leading-snug text-primary"><Link className="text-link" to={`/faculty/${member.slug}`}>{member.title}</Link></h3>
      {member.position && <p className="mt-1 text-sm leading-6">{former ? "Former appointment: " : ""}{member.position}</p>}
      {!former && member.home_unit && member.service_classification === "affiliated_msca_faculty" && <p className="mt-1 text-sm leading-6 text-muted-foreground">{member.home_unit}</p>}
      {!former && expertise.length > 0 && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{expertise.join("; ")}</p>}
      {!former && member.email && <a className="mt-2 inline-flex min-h-11 max-w-full items-center break-all text-sm text-link" href={`mailto:${member.email}`} aria-label={`Email ${member.title}`}>{member.email}</a>}
    </div>
  </article>;
}

function directoryGroup(member: FacultyDirectoryMember) {
  if (["resigned_dca_faculty", "retired_dca_faculty"].includes(member.service_classification)) return "Former faculty";
  if (["academic_staff", "laboratory_personnel"].includes(member.service_classification)) return "Department staff";
  if (member.service_classification === "affiliated_msca_faculty" && member.active_affiliation) return "Graduate affiliates";
  if (member.transferred_from_dca) return "Former faculty";
  if (member.service_classification === "active_dca_faculty") return member.faculty_category === "Lecturer" ? "Lecturers" : "Department faculty";
  return member.service_classification === "affiliated_msca_faculty" ? "Former faculty" : "Other personnel";
}

export default function Faculty() {
  const { data: people = [], isLoading, isError, refetch } = useFaculty();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => people.filter(member =>
    [member.title, member.position, member.specialization_areas, member.research_interests, member.email, member.home_unit, member.supporting_programs].some(value => value?.toLowerCase().includes(query.trim().toLowerCase()))), [people, query]);
  const groups = ["Department faculty", "Lecturers", "Department staff", "Graduate affiliates", "Former faculty", "Other personnel"].map(title => ({
    title, members: filtered.filter(member => directoryGroup(member) === title),
  }));
  return <>
    <Seo title="Faculty & Staff" description="Meet the faculty and staff of the Department of Computer Applications, MSU-IIT. Explore their qualifications, specialization areas and institutional contact details." />
    <Section className="!py-8">
      <SectionHeader as="h1" title="Faculty & Staff" className="!mb-6" />
      <div className="mb-8 max-w-xl"><label htmlFor="faculty-search" className="mb-2 block font-semibold">Search faculty and staff</label>
        <input id="faculty-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Name, role or expertise" className="min-h-12 w-full rounded-md border border-border bg-background px-4 text-base" />
        {query && <button className="text-link mt-2 min-h-11" onClick={() => setQuery("")}>Clear search</button>}
      </div>
      {isLoading ? <p role="status">Loading directory…</p> : isError ? <div role="status"><p>The directory could not be loaded. Please try again or contact the department.</p><button className="outline-link mt-4" onClick={() => refetch()}>Try again</button></div> : <>
        <p role="status" className="mb-6 text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "profile" : "profiles"}{query ? " match your search." : " available."}</p>
        {!filtered.length && <p className="mb-8">{query ? "Try another name or a broader specialization." : "No profiles are currently available. Contact the department for assistance."}</p>}
        <div className="space-y-8">{groups.filter(g => g.members.length).map(group => <section key={group.title}><h2 className="mb-2 text-xl font-semibold text-primary">{group.title}</h2>{group.title === "Graduate affiliates" && <p className="text-sm leading-6 text-muted-foreground">Faculty from other units affiliated with the graduate program.</p>}<div className="grid gap-x-8 lg:grid-cols-2">{group.members.map(member => <FacultyCard key={member.id} member={member} former={group.title === "Former faculty"} />)}</div></section>)}</div>
      </>}
      <div className="mt-12 border-t border-border pt-8"><p className="mb-4 leading-7">For general enquiries, contact the department.</p><Link className="outline-link" to="/about/contact">Department contact details</Link></div>
    </Section>
  </>;
}
