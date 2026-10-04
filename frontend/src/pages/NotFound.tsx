import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";

export default function NotFound() {
  return <><Seo title="Page not found" description="Find department information or contact us for help." />
    <PageHero title="Page not found" subtitle="This link may have changed, or the page may no longer be available." />
    <div className="container max-w-4xl py-12"><p className="mb-6">Use the menu or search to find a topic, or choose an option below.</p>
      <div className="flex flex-wrap gap-4"><Link className="action-link" to="/">Go to the homepage</Link><Link className="action-link secondary" to="/about/contact">Contact the department</Link></div>
    </div></>;
}
