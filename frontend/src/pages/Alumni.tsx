import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { AlumniUpdateForm } from "@/components/AlumniUpdateForm";
import { useAlumniConfiguration, useAlumniOpportunities } from "@/hooks/useAlumni";

export default function Alumni() {
  const config = useAlumniConfiguration();
  const opportunities = useAlumniOpportunities();
  return <>
    <Seo title="Alumni Connections & Career Updates" canonicalUrl="https://msuiit-comapps.vercel.app/alumni" description="Stay connected as a BSCA or MSCA alumnus, explore opportunities, and privately update your contact and career information." />
    <PageHero title="Alumni Connections & Career Updates" subtitle="For BSCA and MSCA graduates: stay connected, keep learning, and help the next generation." />
    <Section>
      <nav aria-label="Alumni tasks" className="flex flex-wrap gap-3"><a className="outline-link" href="#alumni-update">Update my details</a><a className="outline-link" href="#alumni-opportunities">Explore opportunities</a><Link className="outline-link" to="/resources#learning-resources">Keep learning</Link><Link className="outline-link" to="/about/contact">Contact the chairperson</Link></nav>
      <div className="mt-7 grid gap-5 md:grid-cols-3">{[
        ["Stay connected", "Keep an email or phone contact current so the department can reach you according to your preferences."],
        ["Share your next step", "Employment, self-employment, further study, and other activities all help the department understand alumni experiences."],
        ["Support future graduates", "Choose whether you would like to hear about opportunities to mentor or support students."],
      ].map(([title, description]) => <article key={title} className="rounded-md border border-border p-5"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-muted-foreground">{description}</p></article>)}</div>
      <p className="mt-5 max-w-prose leading-7 text-muted-foreground">Your update helps the department maintain alumni connections and understand career and study experiences. Participation is voluntary. Your personal details are available only to authorized staff, and will not be published as an alumni directory.</p>
    </Section>
    <Section variant="muted">
      {config.isPending ? <p role="status">Loading alumni update information…</p> : config.isError ? <div role="status"><p>Alumni update information could not be loaded.</p><button className="outline-link mt-3" onClick={() => void config.refetch()}>Try again</button><Link className="text-link ml-4" to="/about/contact">Contact the department chairperson</Link></div> : config.data && <AlumniUpdateForm config={config.data} />}
    </Section>
    <Section id="alumni-opportunities">
      <SectionHeader title="Opportunities & ways to reconnect" subtitle="Explore department-listed opportunities for alumni of both programs." className="mb-6" />
      {opportunities.isPending ? <p role="status">Loading opportunities…</p> : opportunities.isError ? <p role="status">Opportunities could not be loaded. Check department announcements or try again later.</p> : opportunities.data?.length ? <div className="grid gap-5 md:grid-cols-2">{opportunities.data.map(item => <article key={item.slug} className="rounded-md border border-border p-5"><p className="text-sm text-muted-foreground">{item.kind_label} · {item.provider}</p><h3 className="mt-2 text-xl font-semibold">{item.title}</h3><p className="mt-3 whitespace-pre-line leading-7">{item.description}</p>{item.closes_on && <p className="mt-3 text-sm">Closes: {item.closes_on}</p>}<a className="text-link mt-3 inline-flex min-h-11 items-center" href={item.url}>View {item.title}<span className="sr-only"> (external website)</span></a></article>)}</div> : <p className="max-w-prose leading-7 text-muted-foreground">No alumni opportunities are currently listed. You can still explore department announcements and learning resources below.</p>}
      <nav aria-label="More alumni resources" className="mt-6 flex flex-wrap gap-3"><Link className="outline-link" to="/news">Department announcements</Link><Link className="outline-link" to="/resources#learning-resources">Embedded Systems & IoT learning resources</Link><Link className="outline-link" to="/programs/msca">Explore MSCA study</Link><Link className="outline-link" to="/about/contact">Ask about alumni participation</Link></nav>
    </Section>
  </>;
}
