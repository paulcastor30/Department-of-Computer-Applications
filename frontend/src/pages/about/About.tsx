import { Link } from "react-router-dom";
import { Users, Award, BookOpen, Building, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import { Button } from "@/components/ui/button";

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
  return (
    <>
      <PageHero
        title="About the Department"
        subtitle="Learn about our commitment to excellence in computer applications education, research, and community service."
      />

      <Section>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-muted-foreground">
            The Department of Computer Applications is a premier academic unit dedicated to producing 
            globally competitive IT professionals. With over 25 years of excellence, we continue to 
            innovate in teaching, research, and community engagement.
          </p>
        </div>

        <CardGrid columns={3}>
          {aboutSections.map((section, index) => (
            <ContentCard key={index} {...section} />
          ))}
        </CardGrid>
      </Section>

      <Section variant="muted">
        <div className="text-center">
          <h2 className="section-title mb-4">Visit Our Campus</h2>
          <p className="section-subtitle mb-8">
            Experience our state-of-the-art facilities and welcoming community.
          </p>
          <Button size="lg" asChild>
            <Link to="/about/location">
              Get Directions <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
