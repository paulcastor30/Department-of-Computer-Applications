import { Link } from "react-router-dom";
import { CollegePurpose } from "@/components/CollegePurpose";
import { PageHero } from "@/components/ui/hero-section";
import { Seo } from "@/components/Seo";

export default function VMGO() {
  return (
    <>
      <Seo title="College vision and mission" description="The College of Computer Studies vision, mission, and commitments, with the department's relationship to the college clearly identified." />
      <PageHero title="College vision and mission" subtitle="College of Computer Studies · MSU–Iligan Institute of Technology" />
      <div className="container max-w-5xl space-y-8 py-12">
        <CollegePurpose headingLevel={2} />
        <Link className="text-link inline-flex min-h-11 items-center" to="/about">About the department</Link>
      </div>
    </>
  );
}
