import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { FacultyGrid } from "@/components/ui/faculty-card";
import { FilterBar } from "@/components/ui/filter-bar";

const faculty = [
  { id: "1", name: "Dr. Juan Dela Cruz", position: "Professor / Chair", specializations: ["AI/ML", "Data Science"], publications: 45 },
  { id: "2", name: "Dr. Maria Santos", position: "Associate Professor", specializations: ["Software Engineering"], publications: 32 },
  { id: "3", name: "Dr. Ana Reyes", position: "Associate Professor", specializations: ["Cybersecurity"], publications: 28 },
  { id: "4", name: "Prof. Carlos Garcia", position: "Assistant Professor", specializations: ["Web Development"], publications: 15 },
  { id: "5", name: "Prof. Roberto Cruz", position: "Assistant Professor", specializations: ["IoT"], publications: 12 },
  { id: "6", name: "Prof. Lisa Mendoza", position: "Instructor", specializations: ["Programming"], publications: 8 },
];

export default function Faculty() {
  return (
    <>
      <PageHero title="Faculty Directory" subtitle="Meet our dedicated educators and researchers." />
      <Section><FilterBar searchPlaceholder="Search faculty..." className="mb-8" /><FacultyGrid faculty={faculty.map(f => ({ ...f, href: `/faculty/${f.id}` }))} variant="detailed" /></Section>
    </>
  );
}
