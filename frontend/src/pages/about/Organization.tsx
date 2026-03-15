import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Users } from "lucide-react";

export default function Organization() {
  return (
    <>
      <PageHero
        title="Organizational Structure"
        subtitle="Understanding our departmental leadership and organizational framework."
      />

      <Section>
        <SectionHeader title="Department Leadership" />
        <div className="max-w-4xl mx-auto">
          {/* Org Chart */}
          <div className="flex flex-col items-center gap-8">
            {/* Chair */}
            <div className="card-elevated p-6 text-center w-64">
              <div className="w-16 h-16 rounded-full bg-secondary/20 mx-auto mb-3 flex items-center justify-center">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-bold">Dr. Juan Dela Cruz</h3>
              <p className="text-sm text-secondary font-medium">Department Chair</p>
            </div>
            
            {/* Line */}
            <div className="w-px h-8 bg-border" />
            
            {/* Coordinators */}
            <div className="grid gap-6 md:grid-cols-3 w-full">
              <div className="card-elevated p-5 text-center">
                <h3 className="font-semibold">Dr. Maria Santos</h3>
                <p className="text-sm text-secondary">Graduate Program Coordinator</p>
              </div>
              <div className="card-elevated p-5 text-center">
                <h3 className="font-semibold">Prof. Carlos Garcia</h3>
                <p className="text-sm text-secondary">Undergraduate Program Coordinator</p>
              </div>
              <div className="card-elevated p-5 text-center">
                <h3 className="font-semibold">Dr. Ana Reyes</h3>
                <p className="text-sm text-secondary">Research Coordinator</p>
              </div>
            </div>
            
            {/* Line */}
            <div className="w-px h-8 bg-border" />
            
            {/* Other positions */}
            <div className="grid gap-6 md:grid-cols-4 w-full">
              <div className="card-elevated p-4 text-center">
                <h4 className="font-medium text-sm">Prof. Roberto Cruz</h4>
                <p className="text-xs text-muted-foreground">OJT Coordinator</p>
              </div>
              <div className="card-elevated p-4 text-center">
                <h4 className="font-medium text-sm">Prof. Lisa Mendoza</h4>
                <p className="text-xs text-muted-foreground">Extension Coordinator</p>
              </div>
              <div className="card-elevated p-4 text-center">
                <h4 className="font-medium text-sm">Mr. Pedro Ramos</h4>
                <p className="text-xs text-muted-foreground">Lab Administrator</p>
              </div>
              <div className="card-elevated p-4 text-center">
                <h4 className="font-medium text-sm">Ms. Elena Torres</h4>
                <p className="text-xs text-muted-foreground">Department Secretary</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section variant="muted">
        <SectionHeader title="Committees" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {[
            { name: "Curriculum Committee", desc: "Reviews and develops curriculum aligned with industry standards" },
            { name: "Research Committee", desc: "Oversees research activities and publication efforts" },
            { name: "Quality Assurance Committee", desc: "Ensures compliance with accreditation requirements" },
            { name: "Student Affairs Committee", desc: "Addresses student concerns and welfare" },
            { name: "Extension Committee", desc: "Plans and implements community outreach programs" },
            { name: "Scholarship Committee", desc: "Manages scholarship programs and awards" },
          ].map((committee, i) => (
            <div key={i} className="card-elevated p-5">
              <h3 className="font-semibold mb-2">{committee.name}</h3>
              <p className="text-sm text-muted-foreground">{committee.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
