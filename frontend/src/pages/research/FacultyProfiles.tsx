import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { FacultyGrid } from "@/components/ui/faculty-card";
import { FilterBar } from "@/components/ui/filter-bar";

const faculty = [
  { id: "1", name: "Dr. Juan Dela Cruz", position: "Professor", specializations: ["AI/ML", "Data Science"], publications: 45 },
  { id: "2", name: "Dr. Maria Santos", position: "Associate Professor", specializations: ["Software Engineering"], publications: 32 },
  { id: "3", name: "Dr. Ana Reyes", position: "Associate Professor", specializations: ["Cybersecurity"], publications: 28 },
];

export default function FacultyProfiles() {
  return (
    <>
      <PageHero title="Research Faculty Profiles" subtitle="Meet our research-active faculty members." />
      <Section>
        <FilterBar searchPlaceholder="Search by name or research area..." className="mb-8" />
        <FacultyGrid faculty={faculty.map(f => ({ ...f, href: `/faculty/${f.id}` }))} variant="detailed" />
      </Section>
    </>
  );
}
