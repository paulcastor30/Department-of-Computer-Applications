import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { useSiteSettings } from "@/hooks/useCore";
import { visitGuidance } from "@/content/visitGuidance";
import { departmentIdentity } from "@/content/siteContent";
import { useDepartmentOrganization } from "@/hooks/usePeople";
export default function Contact() {
  const { data, isError } = useSiteSettings();
  const organization = useDepartmentOrganization();
  const email = data?.primary_email || departmentIdentity.email;
  const phone = data?.primary_phone || `${departmentIdentity.phone}, local ${departmentIdentity.phoneExtension}`;
  return <><Seo title="Contact & visit" description="Email the department, find the campus address, and plan your visit."/><PageHero title="Contact & visit" subtitle="Ask a question. Find us on campus. Get help choosing your next step."/><div className="container grid gap-10 py-12 lg:grid-cols-2"><section><h2 className="section-title">How can we help?</h2>
<nav aria-label="Choose an enquiry topic" className="my-5 flex flex-wrap gap-3">{[
  ["Study or application question", "Study or application enquiry"],
  ["Research or community enquiry", "Research or community enquiry"],
  ["Visit or access assistance", "Visit or access assistance enquiry"],
].map(([label, subject]) => <a className="outline-link" key={subject} href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}>{label}</a>)}</nav>
<p className="mb-4 text-sm text-muted-foreground">Each option opens your email app with a subject line. You can also use the address below.</p>
<section aria-labelledby="staff-contacts-heading" className="my-7 rounded-xl border p-5"><h3 id="staff-contacts-heading" className="text-xl font-semibold">Chairperson and office assistance</h3>{organization.data?.filter(person => person.role !== "lab_technician").map(person => <div className="mt-4" key={person.id}><p className="font-semibold">{person.name}</p><p className="mt-1 text-sm text-muted-foreground">{person.role_display}</p>{person.email && <a className="text-link inline-flex min-h-11 items-center break-all" href={`mailto:${person.email}`}>{person.email}</a>}</div>)}<Link className="text-link mt-4 inline-flex min-h-11 items-center" to="/about/organization">All leadership and laboratory staff contacts</Link></section>
<h3 className="text-xl font-semibold">Email the department</h3><p className="mb-5 mt-4 leading-7">Use email for questions about programs, admissions, visiting, research, or community work.</p><a className="action-link break-all" href={`mailto:${email}`}>{email}</a><p className="mt-4 text-sm text-muted-foreground">This link opens your email app. You can also copy the address into your email service.</p><h3 className="mt-8 text-lg font-semibold">What to include</h3><ul className="mt-3 list-disc space-y-2 pl-5 leading-7"><li>What you would like to know.</li><li>The program or activity you are asking about.</li><li>If you plan to visit, your preferred date and any access assistance you need.</li></ul></section><section id="visit"><h2 className="section-title">Plan your visit</h2><address className="mt-4 whitespace-pre-line not-italic leading-8">{data?.address || departmentIdentity.address}</address><Link className="text-link mt-5 inline-flex" to="/about/location">Location & directions</Link><dl className="mt-7 space-y-5"><div><dt className="font-semibold">Telephone</dt><dd className="mt-1">{phone}</dd></div><div><dt className="font-semibold">Office hours</dt><dd className="mt-1">{departmentIdentity.officeHours}. Please contact us before travelling to confirm availability.</dd></div><div><dt className="font-semibold">Step-free access and assistance</dt><dd className="mt-1 leading-7">{visitGuidance.summary}</dd></div></dl><Link className="text-link mt-4 inline-flex min-h-11 items-center" to="/about/location#access">Directions and access assistance</Link><Link className="text-link mt-4 inline-flex min-h-11 items-center" to="/accessibility">Accessibility Help</Link></section>{isError && <p className="notice lg:col-span-2">Updated contact information could not be loaded. The contact details shown are the website's existing reference details.</p>}</div></>;
}
