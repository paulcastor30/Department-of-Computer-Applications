import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { Calendar } from "lucide-react";

export default function News() {
  return (
    <>
      <PageHero title="News & Events" subtitle="Stay updated with the latest from the department." />
      <Section><FilterBar searchPlaceholder="Search news..." filters={[{ name: "Category", options: [{ label: "Announcements", value: "ann" }, { label: "Research", value: "research" }, { label: "Events", value: "events" }] }]} className="mb-8" /><CardGrid columns={3}><ContentCard title="AACCUP Level III Achieved" description="The department successfully achieves Level III accreditation." badge="Announcement" /><ContentCard title="Faculty Research Published in IEEE" description="Dr. Santos' paper accepted in IEEE Transactions." badge="Research" /><ContentCard title="Annual Research Colloquium" description="Join us for presentations of student and faculty research." badge="Event" /></CardGrid></Section>
      <Section variant="muted"><SectionHeader title="Upcoming Events" /><div className="grid gap-4 md:grid-cols-2">{["Research Colloquium - March 15", "Industry Day - March 22", "BSCA Orientation - April 5", "Thesis Defense Week - April 15-19"].map((e, i) => <div key={i} className="card-elevated p-4 flex items-center gap-3"><Calendar className="h-5 w-5 text-secondary" /><span>{e}</span></div>)}</div></Section>
    </>
  );
}
