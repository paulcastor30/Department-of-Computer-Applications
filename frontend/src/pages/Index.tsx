import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useDepartmentProfile } from "@/hooks/useCore";
import { departmentIdentity, placeholder } from "@/content/siteContent";
import { NewsList } from "./News";

const questions = [
  ["Who we are", "Meet the department and its faculty.", "/about", "01"],
  ["What you can study", "Explore the bachelor's and master's programs.", "/programs", "02"],
  ["When things happen", "Read dated news and announcements.", "/news", "03"],
  ["Where to find us", "Find the campus address and visiting information.", "/about/location", "04"],
  ["Why our work matters", "Learn about the department's mission and work.", "/about#purpose", "05"],
  ["How to get started", "Ask a question or find out how to apply.", "/admissions", "06"],
];
export default function Index() {
  const { data } = useDepartmentProfile();
  return <>
    <Seo title="Home" description="Meet the Department of Computer Applications at MSU-IIT. Find programs, people, news, directions, and help."/>
    <section className="home-intro"><div className="container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr] md:py-20">
      <div><p className="mb-4 text-sm font-semibold text-secondary">WELCOME TO THE DEPARTMENT</p><h1 className="max-w-3xl text-4xl font-semibold leading-tight text-primary md:text-5xl">Computer Applications</h1><p className="mt-5 max-w-2xl text-lg leading-8">{data?.overview || `The Department of Computer Applications is part of the ${departmentIdentity.college} at MSU–Iligan Institute of Technology.`}</p><p className="mt-4 max-w-2xl text-muted-foreground">Find information about our degree programs, people, and work. You do not need a technical background to explore this website.</p><div className="mt-7 flex flex-wrap gap-3"><Link className="action-link" to="/programs">Explore our programs <ArrowRight size={18} aria-hidden="true"/></Link><Link className="outline-link" to="/about/contact">Ask a question</Link></div></div>
      <aside className="self-center rounded-xl border border-border bg-white p-6"><h2 className="mb-4 text-lg font-semibold text-primary">Start here</h2><p className="mb-5 leading-7">Looking for a degree? We offer two programs:</p><ul className="space-y-5"><li><Link className="text-link font-semibold" to="/programs/bsca">Bachelor of Science in Computer Applications</Link><p className="mt-1 text-sm text-muted-foreground">Undergraduate program · BSCA</p></li><li><Link className="text-link font-semibold" to="/programs/msca">Master of Science in Computer Applications</Link><p className="mt-1 text-sm text-muted-foreground">Graduate program · MSCA</p></li></ul></aside>
    </div></section>
    <section className="container py-12 md:py-16" aria-labelledby="find-information"><h2 id="find-information" className="mb-3 text-2xl font-semibold text-primary">What would you like to know?</h2><p className="mb-8 text-muted-foreground">Choose a question to find the right information.</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{questions.map(([title,description,href,number]) => <Link key={href} to={href} className="question-card"><span aria-hidden="true" className="mb-5 block text-sm font-semibold text-secondary">{number}</span><h3 className="mb-2 text-xl font-semibold text-primary">{title}</h3><p className="leading-7 text-muted-foreground">{description}</p><ArrowRight className="mt-5 text-secondary" size={20} aria-hidden="true"/></Link>)}</div></section>
    <section className="border-t border-border bg-muted/30"><div className="container py-12 md:py-16"><div className="mb-8 flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-semibold text-primary">Latest news</h2><Link className="text-link" to="/news">All news and events</Link></div><NewsList limit={3}/></div></section>
    <section className="container py-12"><h2 className="mb-3 text-2xl font-semibold text-primary">Not sure where to begin?</h2><p className="mb-5 max-w-2xl leading-7">Tell the department what you need help with: studying here, visiting, research, or a community project.</p><Link className="outline-link" to="/about/contact">Contact the department</Link></section>
  </>;
}
