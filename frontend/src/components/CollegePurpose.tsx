import { collegePurpose } from "@/content/collegePurpose";

export function CollegePurpose({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const CommitmentHeading = headingLevel === 2 ? "h3" : "h4";

  return (
    <div className="max-w-4xl space-y-7">
      <p className="leading-8">The Department of Computer Applications is part of the College of Computer Studies (CCS). These are the college's vision and mission. Separate university-approved department mission and vision statements are not available.</p>
      <section>
        <Heading className="mb-3 text-xl font-semibold text-primary">CCS vision</Heading>
        <blockquote className="border-l-4 border-secondary pl-5 leading-8">{collegePurpose.vision}</blockquote>
      </section>
      <section>
        <Heading className="mb-3 text-xl font-semibold text-primary">CCS mission</Heading>
        <blockquote className="border-l-4 border-secondary pl-5 leading-8">{collegePurpose.mission}</blockquote>
        <CommitmentHeading className="mt-6 font-semibold">College of Computer Studies is committed to</CommitmentHeading>
        <ul className="mt-3 list-disc space-y-3 pl-6 leading-7">
          {collegePurpose.commitments.map(commitment => <li key={commitment}>{commitment}</li>)}
        </ul>
      </section>
    </div>
  );
}
