import { Mail, MapPin, Phone } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { departmentIdentity, placeholder } from "@/content/siteContent";

export default function Contact() {
  return (
    <>
      <Seo title="Contact" description="Official contact information for the Department of Computer Applications." />

      <Section>
        <SectionHeader title="Contact" subtitle="Official inquiry routes and office information." align="left" />
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-md border border-border p-5">
            <Mail className="mb-4 h-6 w-6 text-secondary" />
            <h2 className="mb-2 text-lg font-semibold text-primary">Email</h2>
            <a href={`mailto:${departmentIdentity.email}`} className="text-sm font-semibold text-accent hover:text-secondary">
              {departmentIdentity.email}
            </a>
          </div>
          <div className="rounded-md border border-border p-5">
            <Phone className="mb-4 h-6 w-6 text-secondary" />
            <h2 className="mb-2 text-lg font-semibold text-primary">Telephone</h2>
            <p className="text-sm text-muted-foreground">{departmentIdentity.phone}</p>
          </div>
          <div className="rounded-md border border-border p-5">
            <MapPin className="mb-4 h-6 w-6 text-secondary" />
            <h2 className="mb-2 text-lg font-semibold text-primary">Office Address</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {departmentIdentity.college}, {departmentIdentity.institution}, {departmentIdentity.address}
            </p>
          </div>
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Inquiry Routing" align="left" />
        <div className="rounded-md border border-border bg-background p-5 text-sm leading-6 text-muted-foreground">
          Official inquiry categories, responsible offices, office hours, and response procedures are {placeholder.toLowerCase()}.
        </div>
      </Section>
    </>
  );
}
