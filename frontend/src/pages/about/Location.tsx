import { Link } from "react-router-dom";
import { PageHero } from "@/components/ui/hero-section";
import { Seo } from "@/components/Seo";
import { departmentIdentity } from "@/content/siteContent";
import { visitGuidance } from "@/content/visitGuidance";
import { useSiteSettings } from "@/hooks/useCore";

export default function Location() {
  const { data } = useSiteSettings();
  const address = data?.address || departmentIdentity.address;
  const email = data?.primary_email || departmentIdentity.email;
  const phone = data?.primary_phone || `${departmentIdentity.phone} local ${departmentIdentity.phoneExtension}`;
  const location = data?.address ? `The Department of Computer Applications office is located at: ${data.address}` : visitGuidance.location;

  return (
    <>
      <Seo title="Location & directions" description="Find the department address and office hours, and ask about directions or access assistance before your visit." />
      <PageHero title="Location & directions" subtitle="Find the department on the first floor of the College of Computer Studies." />
      <div className="container max-w-4xl py-12">
        <section id="access" aria-labelledby="access-title">
          <h2 id="access-title" className="section-title">{visitGuidance.title}</h2>
          <p className="mt-4 whitespace-pre-line leading-8">{location}</p>
          <p className="mt-4 leading-8">{visitGuidance.directions}</p>
          <p className="mt-4 leading-8">{visitGuidance.summary} {visitGuidance.details} {visitGuidance.status}</p>
          <dl className="mt-6 space-y-3">
            <div><dt className="font-semibold">Office hours</dt><dd>{departmentIdentity.officeHours}</dd></div>
            <div><dt className="font-semibold">Email</dt><dd><a className="text-link inline-flex min-h-11 items-center" href={`mailto:${email}`}>{email}</a></dd></div>
            <div><dt className="font-semibold">Telephone</dt><dd>{phone}</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="outline-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}>Find the campus on Google Maps <span className="text-sm">(external website)</span></a>
            <Link className="outline-link" to="/about/contact">All contact information</Link>
          </div>
        </section>
      </div>
    </>
  );
}
