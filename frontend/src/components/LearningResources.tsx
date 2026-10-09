import { useLearningResources } from "@/hooks/useAcademics";
import { Section, SectionHeader } from "@/components/ui/section";
import { LearningResourceCatalogue } from "./LearningResourceCatalogue";
import { LearningResourceCredits } from "./LearningResourceCredits";

export function LearningResources() {
  const { data = [], isPending, isError, refetch } = useLearningResources();
  const starters = data.filter(resource => resource.start_here).slice(0, 4);

  return <Section id="learning-resources" variant="muted">
    <SectionHeader title="Embedded Systems & IoT Learning Resources" subtitle="Explore readings, tutorials, and practical guides to support your BSCA studies." className="mb-6" />
    <div className="rounded-md border border-border bg-background p-5">
      <h3 className="text-xl font-semibold">Start with one reading</h3>
      <p className="mt-2 max-w-prose leading-7 text-muted-foreground">Choose a starting point below, read one section, then try its small activity. You can learn to program a device, connect sensors, exchange data, or test an application. You do not need to finish every resource.</p>
      <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">These resources support independent learning alongside your BSCA studies. They are not course requirements or a checklist for becoming an engineer. Practical tutorials may need hardware; check the provider’s requirements before starting.</p>
      <a className="text-link mt-3 inline-flex min-h-11 items-center" href="#resource-catalogue">Browse all learning topics on this page</a>
    </div>
    {isPending ? <p className="mt-6" role="status">Loading learning resources…</p> : isError ? <div className="mt-6" role="status"><p>Learning resources could not be loaded.</p><button className="outline-link mt-3" onClick={() => void refetch()}>Try again</button></div> : <>
      {starters.length > 0 && <div className="mt-6">
        <h3 className="mb-4 text-xl font-semibold">A few starting points</h3>
        <div className="grid gap-5 md:grid-cols-3">
          {starters.map(resource => <article key={resource.slug} className="min-w-0 rounded-md border border-border bg-background p-5">
            <p className="mb-2 text-sm font-medium text-primary">{resource.topic_label} · Start here</p>
            <h4 className="text-lg font-semibold">{resource.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{resource.provider} · {resource.resource_type}</p>
            <p className="mt-3 leading-7">{resource.description}</p>
            {resource.activity && <p className="mt-4 rounded bg-muted/50 p-3 leading-6"><strong>Try this:</strong> {resource.activity}</p>}
            <a className="text-link mt-4 inline-flex min-h-11 items-center" href={resource.url}>Explore {resource.title}<span className="sr-only"> (external website)</span></a>
          </article>)}
        </div>
      </div>}
      <LearningResourceCatalogue data={data} />
    </>}
    <LearningResourceCredits />
  </Section>;
}
