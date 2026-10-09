import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
export function PublicInfoPage({ title, description, links = [] }: { title: string; description: string; information: string; links?: [string, string][] }) {
 return <><Seo title={title} description={description}/><PageHero title={title} subtitle={description}/><div className="container max-w-4xl space-y-8 py-12"><section className="notice"><p className="leading-7">Contact the department for enquiries about {title.toLowerCase()}.</p><Link className="outline-link mt-5" to="/about/contact">Ask the department</Link></section>{links.length > 0 && <nav aria-label="Related information"><h2 className="mb-4 text-xl font-semibold">You may also need</h2><ul className="grid gap-3 sm:grid-cols-2">{links.map(([label,href]) => <li key={href}><Link className="outline-link w-full" to={href}>{label}</Link></li>)}</ul></nav>}</div></>;
}
