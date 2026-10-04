import { Link } from "react-router-dom";
import { PageHero } from "@/components/ui/hero-section";
import { Seo } from "@/components/Seo";
import { departmentIdentity, placeholder } from "@/content/siteContent";
import { useSiteSettings } from "@/hooks/useCore";
export default function Location() {
 const { data } = useSiteSettings();
 const address = data?.address || departmentIdentity.address;
 return <><Seo title="Location & directions" description="Campus location and information to confirm before visiting."/><PageHero title="Location & directions" subtitle="Find the department on the first floor of the College of Computer Studies."/><div className="container max-w-4xl space-y-8 py-12"><section><h2 className="section-title">Department address</h2><address className="my-5 whitespace-pre-line not-italic leading-8">{address}</address><a className="outline-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}>Find the campus on Google Maps <span className="text-sm">(external website)</span></a></section><section><h2 className="section-title">Office hours</h2><p className="mt-4">{departmentIdentity.officeHours}</p></section><section className="notice"><h2 className="mb-3 text-xl font-semibold">Before you travel</h2><p className="leading-7">Exact office room, step-free entrances, campus entry arrangements, and transport directions are {placeholder.toLowerCase()}. Contact the department to confirm these details and request any assistance you need.</p><Link className="text-link mt-4 inline-flex" to="/about/contact">Contact the department</Link></section></div></>;
}
