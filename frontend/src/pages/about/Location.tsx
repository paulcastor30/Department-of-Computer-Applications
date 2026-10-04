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
  const phone = data?.primary_phone || `${departmentIdentity.phone}, local ${departmentIdentity.phoneExtension}`;

  return (
    <>
      <Seo title="Location & directions" description="Find the department address and office hours, and plan a visit with any access assistance you need." />
      <PageHero title="Location & directions" subtitle="Find the department on the first floor of the College of Computer Studies." />
      <div className="container max-w-4xl space-y-10 py-12">
        <section aria-labelledby="department-address">
          <h2 id="department-address" className="section-title">Department address</h2>
          <address className="my-5 whitespace-pre-line not-italic leading-8">{address}</address>
          <a className="outline-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}>Find the campus on Google Maps <span className="text-sm">(external website)</span></a>
          <p className="mt-3 text-sm text-muted-foreground">The map helps you locate the campus. Confirm the campus entrance and route to the office with the department.</p>
        </section>
        <section aria-labelledby="office-hours">
          <h2 id="office-hours" className="section-title">Office hours</h2>
          <p className="mt-4">{departmentIdentity.officeHours}</p>
          <p className="mt-3">Contact us to confirm availability on your planned visit date.</p>
        </section>
        <section id="access" aria-labelledby="access-title">
          <h2 id="access-title" className="section-title">Plan an accessible visit</h2>
          <p className="mt-4">{visitGuidance.summary}</p>
          <ol className="mt-5 list-decimal space-y-4 pl-6">
            <li><strong>Tell us when you plan to visit.</strong> Include the date, approximate time, and reason for your visit.</li>
            <li><strong>Ask for directions that work for you.</strong> Confirm the campus entrance, office room, and route to the first floor. If needed, ask about a route without stairs, accessible toilets, and parking or drop-off.</li>
            <li><strong>Confirm arrangements before travelling.</strong> Ask whether someone can meet you and where to meet them. Wait for confirmation of any assistance you request.</li>
          </ol>
          <p className="mt-5">{visitGuidance.request}</p>
          <div className="notice mt-5"><p>{visitGuidance.status}</p><p className="mt-3">The first-floor address alone does not confirm a route without stairs.</p></div>
          <a className="action-link mt-5" href={`mailto:${email}?subject=${encodeURIComponent("Visit or access assistance enquiry")}`}>Ask about visit or access assistance</a>
          <p className="mt-3">This opens your email app. You can also email <a className="text-link inline-flex min-h-11 items-center" href={`mailto:${email}`}>{email}</a>.</p>
          <p className="mt-2">Telephone: {phone}</p>
          <Link className="text-link mt-4 inline-flex min-h-11 items-center" to="/about/contact">All contact information</Link>
        </section>
      </div>
    </>
  );
}
