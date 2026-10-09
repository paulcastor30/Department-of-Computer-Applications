import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { useDepartmentOrganization } from "@/hooks/usePeople";

export default function Organization() {
  const { data, isPending, isError, refetch } = useDepartmentOrganization();
  return <>
    <Seo title="Department organization" description="Meet the department chairperson, administrative aide, and laboratory technicians, and find their contact details." />
    <PageHero title="Department organization" subtitle="Meet the people who lead and support the Department of Computer Applications." />
    <div className="container max-w-5xl space-y-10 py-12">
      <section aria-labelledby="organization-heading">
        <h2 id="organization-heading" className="section-title">Leadership and support staff</h2>
        <p className="mt-4 leading-7">Contact the chairperson for department matters, the administrative aide for office assistance, or the laboratory technicians for laboratory support.</p>
        {isPending ? <p className="mt-6" role="status">Loading department contacts…</p> : isError ? <div className="notice mt-6" role="status"><p>Department contacts could not be loaded.</p><button className="outline-link mt-3" onClick={() => void refetch()}>Try again</button></div> : !data?.length ? <p className="notice mt-6">Contact the department for current leadership and staff enquiries.</p> : <ul className="mt-7 grid gap-5 sm:grid-cols-2">
          {data.map(person => <li key={person.id} className={`rounded-xl border bg-card p-6 ${person.role === "chairperson" ? "sm:col-span-2" : ""}`}>
            <p className="text-sm font-semibold text-primary">{person.role_display}</p>
            <h3 className="mt-2 text-xl font-semibold">{person.name}</h3>
            {person.email && <a className="text-link mt-4 inline-flex min-h-11 items-center break-all" href={`mailto:${person.email}`}>{person.email}</a>}
            {person.phone && <p className="mt-2">Telephone: {person.phone}</p>}
            {person.office && <p className="mt-2">Office: {person.office}</p>}
            {person.role === "chairperson" && <Link className="text-link mt-3 flex min-h-11 items-center" to={`/faculty/${person.slug}`}>View faculty profile<span className="sr-only"> of {person.name}</span></Link>}
          </li>)}
        </ul>}
      </section>
      <nav aria-label="Department information" className="flex flex-wrap gap-3"><Link className="outline-link" to="/faculty">Faculty and staff directory</Link><Link className="outline-link" to="/about/contact">Contact & visit</Link><Link className="outline-link" to="/alumni">Alumni connections</Link></nav>
    </div>
  </>;
}
