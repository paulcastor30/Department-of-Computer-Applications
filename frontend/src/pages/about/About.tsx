import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { departmentIdentity, placeholder } from "@/content/siteContent";
import { useDepartmentProfile } from "@/hooks/useCore";

export default function About() {
  const { data } = useDepartmentProfile();

  return (
    <>
      <Seo title="About" description="Department profile, mandate, academic domains, and institutional role." />

      <Section>
        <SectionHeader title="About the Department" align="left" />
        <div className="max-w-4xl space-y-5 text-base leading-7 text-muted-foreground">
          <p>
            {data?.overview ||
              `The ${departmentIdentity.name} is an academic department under the ${departmentIdentity.college}, ${departmentIdentity.institution}. Its official mandate, history, and current department profile are ${placeholder.toLowerCase()}.`}
          </p>
          <p>
            The Department provides academic programs and related scholarly work in computer applications, applied
            computing, embedded systems, Internet of Things, and allied areas. Specific statements on mandate,
            leadership, and institutional responsibilities should be taken from approved department and college records.
          </p>
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Institutional Information" align="left" />
        <dl className="grid gap-4 md:grid-cols-2">
          {[
            ["Department", departmentIdentity.name],
            ["College", departmentIdentity.college],
            ["University", departmentIdentity.institution],
            ["Department Mandate", placeholder],
            ["Current Department Chair", placeholder],
            ["Administrative Office", placeholder],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-border bg-background p-4">
              <dt className="text-sm font-semibold text-primary">{label}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <SectionHeader title="Related Information" align="left" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Vision, Mission, Goals", "/about/vmgo"],
            ["History", "/about/history"],
            ["Organization", "/about/organization"],
            ["Faculty", "/faculty"],
            ["Contact", "/about/contact"],
            ["Location", "/about/location"],
          ].map(([label, href]) => (
            <Link key={href} to={href} className="rounded-md border border-border p-4 text-sm font-semibold text-accent hover:border-secondary">
              {label}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
