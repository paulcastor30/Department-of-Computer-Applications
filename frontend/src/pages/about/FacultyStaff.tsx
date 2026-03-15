import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { FacultyGrid } from "@/components/ui/faculty-card";
import { FilterBar } from "@/components/ui/filter-bar";

const facultyData = [
  { id: "1", name: "Dr. Juan Dela Cruz", position: "Department Chair / Professor", education: "Ph.D. Computer Science, UP Diliman", specializations: ["AI/ML", "Data Science"] },
  { id: "2", name: "Dr. Maria Santos", position: "Associate Professor", education: "Ph.D. Information Technology, DLSU", specializations: ["Software Engineering", "HCI"] },
  { id: "3", name: "Dr. Ana Reyes", position: "Associate Professor", education: "Ph.D. Computer Science, Ateneo", specializations: ["Cybersecurity", "Networks"] },
  { id: "4", name: "Prof. Carlos Garcia", position: "Assistant Professor", education: "M.Sc. Computer Science, UP Diliman", specializations: ["Web Development", "Databases"] },
  { id: "5", name: "Prof. Roberto Cruz", position: "Assistant Professor", education: "M.Sc. Information Technology, UST", specializations: ["IoT", "Embedded Systems"] },
  { id: "6", name: "Prof. Lisa Mendoza", position: "Instructor", education: "M.Sc. Computer Applications", specializations: ["Programming", "Mobile Dev"] },
];

const staffData = [
  { id: "s1", name: "Mr. Pedro Ramos", position: "Laboratory Administrator", education: "B.Sc. Computer Science" },
  { id: "s2", name: "Ms. Elena Torres", position: "Department Secretary", education: "B.Sc. Office Administration" },
  { id: "s3", name: "Mr. Jose Santos", position: "Technical Support", education: "B.Sc. Information Technology" },
];

export default function FacultyStaff() {
  return (
    <>
      <PageHero
        title="Faculty & Staff Directory"
        subtitle="Meet our dedicated team of educators and support personnel."
      />

      <Section>
        <SectionHeader title="Faculty Members" subtitle="Our faculty combines academic excellence with industry experience" />
        <FilterBar
          searchPlaceholder="Search faculty..."
          filters={[
            { name: "Specialization", options: [
              { label: "AI/ML", value: "ai" },
              { label: "Software Engineering", value: "se" },
              { label: "Cybersecurity", value: "cyber" },
            ]},
            { name: "Rank", options: [
              { label: "Professor", value: "prof" },
              { label: "Associate Professor", value: "assoc" },
              { label: "Assistant Professor", value: "asst" },
            ]},
          ]}
          className="mb-8"
        />
        <FacultyGrid faculty={facultyData.map(f => ({ ...f, href: `/faculty/${f.id}` }))} variant="detailed" />
      </Section>

      <Section variant="muted">
        <SectionHeader title="Administrative Staff" subtitle="Supporting excellence in education and operations" />
        <FacultyGrid faculty={staffData} />
      </Section>
    </>
  );
}
