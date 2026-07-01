import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Section, SectionHeader } from "@/components/ui/section";
import { placeholder } from "@/content/siteContent";
import { useFaculty } from "@/hooks/usePeople";

export default function Faculty() {
  const { data: faculty = [], isLoading, isError } = useFaculty();

  return (
    <>
      <Seo title="Faculty" description="Faculty directory and academic staff information." />

      <Section>
        <SectionHeader
          title="Faculty"
          subtitle="Faculty information should be maintained using verified academic ranks, degrees, specialization areas, research interests, and official contact details."
          align="left"
        />

        {isLoading && <p className="text-sm text-muted-foreground">Loading faculty directory...</p>}
        {isError && <p className="text-sm text-muted-foreground">Faculty data could not be loaded.</p>}

        {faculty.length ? (
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/60 text-primary">
                <tr>
                  <th className="border-b border-border p-4 font-semibold">Name</th>
                  <th className="border-b border-border p-4 font-semibold">Rank / Position</th>
                  <th className="border-b border-border p-4 font-semibold">Research Interests</th>
                  <th className="border-b border-border p-4 font-semibold">Profile</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((member) => (
                  <tr key={member.id} className="align-top">
                    <td className="border-b border-border p-4 font-semibold text-primary">{member.title}</td>
                    <td className="border-b border-border p-4 text-muted-foreground">{member.position || placeholder}</td>
                    <td className="border-b border-border p-4 text-muted-foreground">{member.research_interests || placeholder}</td>
                    <td className="border-b border-border p-4">
                      <Link to={`/faculty/${member.slug}`} className="font-semibold text-accent hover:text-secondary">
                        View profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !isLoading && (
            <div className="rounded-md border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
              Complete faculty directory information is {placeholder.toLowerCase()}.
            </div>
          )
        )}
      </Section>
    </>
  );
}
