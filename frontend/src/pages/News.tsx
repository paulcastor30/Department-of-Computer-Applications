import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { ContentCard, CardGrid } from "@/components/ui/content-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { Calendar } from "lucide-react";
import { useNews } from "@/hooks/useCommunications";

export default function News() {
  const { data: news = [], isLoading, isError, error } = useNews();

  if (isLoading) return <div className="p-6">Loading news...</div>;
  if (isError) return <div className="p-6">Error: {(error as Error).message}</div>;

  return (
    <main className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">News & Announcements</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {news.map((item) => (
            <article key={item.id} className="border p-4">
              <p className="mb-2 text-sm">{item.category}</p>
              <h2 className="mb-2 text-xl font-semibold">{item.title}</h2>
              <p className="mb-4 text-sm text-gray-700">{item.summary}</p>
              <a href={`/news/${item.slug}`} className="underline">
                Read more
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
