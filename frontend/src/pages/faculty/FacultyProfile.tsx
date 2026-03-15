import { useParams } from "react-router-dom";
import { PageHero } from "@/components/ui/hero-section";
import { Section } from "@/components/ui/section";

export default function FacultyProfile() {
  const { id } = useParams();
  return (
    <>
      <PageHero title="Faculty Profile" subtitle="Detailed information about our faculty member." />
      <Section>
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
          <div className="aspect-square rounded-xl bg-muted flex items-center justify-center text-4xl font-bold text-primary">DR</div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-2">Dr. Sample Faculty</h2>
            <p className="text-secondary font-medium mb-4">Professor</p>
            <div className="space-y-4 text-muted-foreground">
              <div><strong>Education:</strong> Ph.D. Computer Science</div>
              <div><strong>Research Interests:</strong> AI, Machine Learning, Data Science</div>
              <div><strong>Publications:</strong> 45 peer-reviewed papers</div>
              <div><strong>Email:</strong> faculty@university.edu.ph</div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
