import { Link } from "react-router-dom";
import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import studentsLab from "@/assets/students-lab.jpg";
import researchLab from "@/assets/research-lab.jpg";
import { usePrograms } from "@/hooks/useAcademics";

export default function Programs() {
  const { data: programs = [], isLoading, isError, error } = usePrograms();

  if (isLoading) return <div className="p-6">Loading programs...</div>;
  if (isError) return <div className="p-6">Error: {(error as Error).message}</div>;

  return (
    <main className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Programs</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((program) => (
            <article key={program.id} className="border p-6">
              <p className="mb-2 text-sm">{program.code}</p>
              <h2 className="mb-3 text-2xl font-semibold">{program.title}</h2>
              <p className="mb-4 text-sm">{program.degree_level}</p>
              <p className="mb-4">{program.overview}</p>
              <a href={`/programs/${program.slug}`} className="underline">
                View program
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
