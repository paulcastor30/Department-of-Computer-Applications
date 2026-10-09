import { useState } from "react";
import type { LearningResource } from "@/hooks/useAcademics";

const PAGE_SIZE = 24;
const topics = [
  ["PROGRAMMING", "Programming", "Build confidence with C, Python, algorithms, and state machines."],
  ["IOT", "IoT & connectivity", "Explore messaging, wireless networks, and connected applications."],
  ["EMBEDDED", "Devices & embedded systems", "Work with microcontrollers, sensors, and device interfaces."],
  ["FOUNDATIONS", "Foundations", "Revisit electronics, mathematics, and computer architecture."],
  ["DATA", "Data, signals & AI", "Explore signal processing, control, and machine learning on devices."],
  ["SOFTWARE", "Software tools, testing & security", "Develop reliable software with debugging, version control, and security."],
  ["EXPLORE", "Projects & learning support", "Find project ideas, learning platforms, and further references."],
  ["ADVANCED", "Optional specialist topics", "Explore FPGA, automotive systems, and other specialist interests when ready."],
] as const;

export function LearningResourceCatalogue({ data }: { data: LearningResource[] }) {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("");
  const [beginners, setBeginners] = useState(false);
  const [page, setPage] = useState(0);
  const query = search.trim().toLowerCase();
  const resources = data.filter(resource =>
    (!topic || resource.topic === topic) && (!format || resource.resource_type === format) &&
    (!beginners || resource.level_label === "Beginner") &&
    `${resource.title} ${resource.provider} ${resource.description} ${resource.topic_label} ${resource.source_section}`.toLowerCase().includes(query)
  ).sort((a, b) => topics.findIndex(([value]) => value === a.topic) - topics.findIndex(([value]) => value === b.topic));
  const formats = [...new Set(data.map(resource => resource.resource_type))].sort();
  const lastPage = Math.max(0, Math.ceil(resources.length / PAGE_SIZE) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = resources.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  function resetFilters() {
    setSearch(""); setTopic(""); setFormat(""); setBeginners(false); setPage(0);
  }

  return <div id="resource-catalogue" className="mt-10 scroll-mt-24">
    <h3 className="text-2xl font-semibold">Browse the complete collection</h3>
    <p className="mt-2 max-w-prose leading-7 text-muted-foreground">Choose what helps your current learning goal. These topics are suggestions for independent study, not a required sequence or a list of BSCA courses.</p>
    <div className="my-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {topics.map(([value, label, description]) => <button key={value} type="button" aria-pressed={topic === value} onClick={() => { setTopic(topic === value ? "" : value); setPage(0); }} className={`rounded-md border p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring ${topic === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"}`}>
        <span className="block font-semibold">{label}</span>
        <span className="mt-2 block text-sm leading-6">{description}</span>
      </button>)}
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label className="mb-2 block font-medium" htmlFor="resource-search">Search learning resources</label>
        <input id="resource-search" type="search" value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} placeholder="Try Python, MQTT, or sensors" className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" />
      </div>
      <div>
        <label className="mb-2 block font-medium" htmlFor="resource-topic">Browse by topic</label>
        <select id="resource-topic" value={topic} onChange={event => { setTopic(event.target.value); setPage(0); }} className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
          <option value="">All topics</option>
          {topics.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-2 block font-medium" htmlFor="resource-format">Resource format</label>
        <select id="resource-format" value={format} onChange={event => { setFormat(event.target.value); setPage(0); }} className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
          <option value="">All formats</option>
          {formats.map(value => <option key={value}>{value}</option>)}
        </select>
      </div>
    </div>
    <div className="my-4 flex flex-wrap items-center gap-x-6 gap-y-2">
      <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={beginners} onChange={event => { setBeginners(event.target.checked); setPage(0); }} className="h-5 w-5 accent-primary" />Show beginner resources</label>
      <button type="button" className="outline-link" onClick={resetFilters}>Clear filters</button>
    </div>
    <p className="mb-4 text-sm text-muted-foreground" role="status">{resources.length} {resources.length === 1 ? "resource" : "resources"} found{resources.length > 0 && ` · Showing ${currentPage * PAGE_SIZE + 1}–${Math.min((currentPage + 1) * PAGE_SIZE, resources.length)}`}</p>
    {!resources.length && <p className="rounded-md border border-border p-5">No matching resources. Try a broader search or clear the filters.</p>}
    <ul className="grid gap-3 md:grid-cols-2">
      {visible.map(resource => <li key={resource.slug} className="min-w-0 rounded-md border border-border bg-background p-5">
        <div className="mb-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{resource.topic_label}</span><span>· {resource.resource_type}</span>
          {resource.level_label === "Beginner" && <span className="font-semibold text-primary">· Beginner</span>}
        </div>
        <h4 className="font-semibold leading-6"><a className="text-link inline-flex min-h-11 items-center break-words [overflow-wrap:anywhere]" href={resource.url}>{resource.title}<span className="sr-only"> (external resource)</span></a></h4>
        <p className="mt-1 break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">{resource.provider}</p>
        {resource.source_section && <p className="mt-2 text-sm leading-6 text-muted-foreground">Source topic: {resource.source_section}</p>}
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{resource.source_collection === "ROADMAP" ? "From the credited roadmap · CC BY-SA 4.0" : "Additional learning resource"}</p>
      </li>)}
    </ul>
    {resources.length > PAGE_SIZE && <nav aria-label="Learning resource pages" className="mt-5 flex flex-wrap items-center gap-4">
      <button type="button" className="outline-link disabled:cursor-not-allowed disabled:opacity-50" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</button>
      <span>Page {currentPage + 1} of {lastPage + 1}</span>
      <button type="button" className="outline-link disabled:cursor-not-allowed disabled:opacity-50" disabled={currentPage === lastPage} onClick={() => setPage(currentPage + 1)}>Next</button>
      <a href="#resource-catalogue" className="text-link inline-flex min-h-11 items-center">Back to filters</a>
    </nav>}
    <p className="mt-4 max-w-prose text-sm leading-6 text-muted-foreground">Beginner labels for imported entries come from the original curator. The collection includes free and paid materials; check access, prerequisites, and equipment needs with each provider. Imported links have not all been individually revalidated.</p>
  </div>;
}
