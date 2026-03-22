import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { FacultyGrid } from "@/components/ui/faculty-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { useFaculty } from "@/hooks/usePeople";


const faculty = [
  { id: "1", name: "Dr. Juan Dela Cruz", position: "Professor / Chair", specializations: ["AI/ML", "Data Science"], publications: 45 },
  { id: "2", name: "Dr. Maria Santos", position: "Associate Professor", specializations: ["Software Engineering"], publications: 32 },
  { id: "3", name: "Dr. Ana Reyes", position: "Associate Professor", specializations: ["Cybersecurity"], publications: 28 },
  { id: "4", name: "Prof. Carlos Garcia", position: "Assistant Professor", specializations: ["Web Development"], publications: 15 },
  { id: "5", name: "Prof. Roberto Cruz", position: "Assistant Professor", specializations: ["IoT"], publications: 12 },
  { id: "6", name: "Prof. Lisa Mendoza", position: "Instructor", specializations: ["Programming"], publications: 8 },
];

export default function Faculty() {
  const { data: faculty = [], isLoading, isError, error } = useFaculty();

  if (isLoading) return <div className="p-6">Loading faculty directory...</div>;
  if (isError) return <div className="p-6">Error: {(error as Error).message}</div>;

  return (
    <main className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Faculty Directory</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {faculty.map((member) => (
            <article key={member.id} className="border p-4">
              {member.photo && (
                <img
                  src={member.photo}
                  alt={member.title}
                  className="mb-4 h-48 w-full object-cover"
                />
              )}

              <h2 className="text-xl font-semibold">{member.title}</h2>
              <p className="mb-2">{member.position}</p>

              {member.research_interests && (
                <p className="text-sm text-gray-700">{member.research_interests}</p>
              )}

              <a href={`/faculty/${member.slug}`} className="mt-4 inline-block underline">
                View profile
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
