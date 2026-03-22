import { Link } from "react-router-dom";
import { Users, Award, BookOpen, Building, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import { Button } from "@/components/ui/button";
import { useDepartmentProfile } from "@/hooks/useCore";

const aboutSections = [
  {
    title: "Vision, Mission, Goals & Objectives",
    description: "Our guiding principles that shape our commitment to excellence in computing education.",
    href: "/about/vmgo",
    icon: <Award className="h-6 w-6" />,
  },
  {
    title: "History & Milestones",
    description: "Tracing our journey of growth and achievement in computer applications education.",
    href: "/about/history",
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    title: "Chair's Message",
    description: "A welcome message from the Department Chair on our vision and commitment.",
    href: "/about/chair-message",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Organizational Structure",
    description: "Understanding our departmental organization and leadership.",
    href: "/about/organization",
    icon: <Building className="h-6 w-6" />,
  },
  {
    title: "Faculty & Staff Directory",
    description: "Meet our dedicated team of educators and administrative personnel.",
    href: "/about/faculty-staff",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Contact Us",
    description: "Get in touch with us for inquiries and more information.",
    href: "/about/contact",
    icon: <Building className="h-6 w-6" />,
  },
];

export default function About() {
  const { data, isLoading, isError, error } = useDepartmentProfile();

  if (isLoading) return <div className="p-6">Loading department profile...</div>;
  if (isError) return <div className="p-6">Error: {(error as Error).message}</div>;

  return (
    <main className="px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">{data?.title || "About the Department"}</h1>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Overview</h2>
          <p>{data?.overview}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Vision</h2>
          <p>{data?.vision}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Mission</h2>
          <p>{data?.mission}</p>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Goals</h2>
          <p>{data?.goals}</p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">Outcomes Mapping</h2>
          <p>{data?.outcomes_mapping_note}</p>
        </section>
      </div>
    </main>
  );
}
