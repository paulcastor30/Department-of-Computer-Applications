import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { useDepartmentOrganization, useFaculty } from "@/hooks/usePeople";

export default function Organization() {
  const organization = useDepartmentOrganization();
  const directory = useFaculty();
  const chairs = organization.data?.filter(person => person.role === "chairperson") || [];
  const chairSlugs = new Set(chairs.map(person => person.slug));
  const people = (directory.data || []).filter(person => person.active_affiliation && !person.transferred_from_dca && !chairSlugs.has(person.slug));
  const groups = [
    { title: "Staff", members: people.filter(person => ["academic_staff", "laboratory_personnel"].includes(person.service_classification)) },
    { title: "Lecturers", members: people.filter(person => person.service_classification === "active_dca_faculty" && person.faculty_category === "Lecturer") },
    { title: "Faculty", members: people.filter(person => person.service_classification === "active_dca_faculty" && person.faculty_category !== "Lecturer") },
  ].filter(group => group.members.length);
  const loading = organization.isPending || directory.isPending;
  const failed = organization.isError || directory.isError;
  return <>
    <Seo title="Department organization" description="Organizational chart of the Department of Computer Applications: department chairperson, staff, lecturers and faculty." />
    <PageHero title="Department organization" subtitle="Department of Computer Applications" />
    <div className="container max-w-6xl py-10">
      <section aria-labelledby="organization-heading">
        <h2 id="organization-heading" className="section-title">Organizational chart</h2>
        {loading ? <p className="mt-6" role="status">Loading department organization…</p> : failed ? <div className="notice mt-6" role="status"><p>Department organization could not be loaded.</p><button type="button" className="outline-link mt-3" onClick={() => { void organization.refetch(); void directory.refetch(); }}>Try again</button></div> : !chairs.length && !groups.length ? <p className="notice mt-6">Contact the department for current personnel enquiries.</p> : <div className="mt-8">
          {chairs.length > 0 && <section aria-label="Department chairperson" className="mx-auto max-w-md">
            <h3 className="rounded-t-md bg-primary px-5 py-3 text-center font-semibold text-primary-foreground">Department chairperson</h3>
            <ul className="rounded-b-md border border-border bg-card px-5 py-4 text-center">{chairs.map(person => <li key={person.slug}>
              <Link className="text-link text-lg font-semibold" to={`/faculty/${person.slug}`}>{person.name}</Link>
              {person.email && <a className="text-link mt-2 flex min-h-11 items-center justify-center break-all text-sm" href={`mailto:${person.email}`}>{person.email}</a>}
            </li>)}</ul>
          </section>}
          {groups.length > 0 && <>
            {chairs.length > 0 && <div aria-hidden="true" className="mx-auto h-8 w-px bg-border" />}
            <div className={`relative grid gap-6 ${groups.length === 3 ? "md:grid-cols-3" : groups.length === 2 ? "md:grid-cols-2" : "mx-auto max-w-md"}`}>
              {chairs.length > 0 && groups.length > 1 && <div aria-hidden="true" className={`absolute -top-4 hidden border-t border-border md:block ${groups.length === 3 ? "left-[16%] right-[16%]" : "left-[24%] right-[24%]"}`} />}
              {groups.map(group => <section key={group.title} aria-label={group.title} className="relative min-w-0">
                {chairs.length > 0 && groups.length > 1 && <div aria-hidden="true" className="absolute -top-4 left-1/2 hidden h-4 border-l border-border md:block" />}
                <h3 className="rounded-t-md border border-border bg-muted px-5 py-3 text-center text-lg font-semibold text-primary">{group.title}</h3>
                <ul className="divide-y divide-border rounded-b-md border border-t-0 border-border bg-card px-5">
                  {group.members.map(person => <li key={person.slug} className="py-4">
                    <Link className="text-link font-semibold leading-6" to={`/faculty/${person.slug}`}>{person.title}</Link>
                    {person.position && <p className="mt-1 text-sm leading-6 text-muted-foreground">{person.position}</p>}
                  </li>)}
                </ul>
              </section>)}
            </div>
          </>}
        </div>}
      </section>
      <nav aria-label="Department information" className="mt-10 flex flex-wrap gap-3"><Link className="outline-link" to="/faculty">Faculty and staff directory</Link><Link className="outline-link" to="/about/contact">Contact & visit</Link></nav>
    </div>
  </>;
}
