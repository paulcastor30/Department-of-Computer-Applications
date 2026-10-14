import { Link } from "react-router-dom";
import { PageHero } from "@/components/ui/hero-section";
import { Seo } from "@/components/Seo";
export function ProgramContentState({ isLoading = false, isError = false }: { isLoading?: boolean; isError?: boolean }) {
  return <><Seo title="Academic programs" description="Academic program information and department contacts." /><PageHero title="Academic programs" />
    <div className="container py-10">{isLoading ? <p role="status">Loading program information…</p> : <>
      {isError && <p role="status" className="mb-4">Program information could not be loaded.</p>}
      <Link className="text-link" to="/about/contact">Contact the department about academic programs</Link>
    </>}</div></>;
}
