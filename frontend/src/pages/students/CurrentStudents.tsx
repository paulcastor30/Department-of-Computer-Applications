import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";

const tasks = [
  {title:"Fill or download thesis and program forms", description:"Select BSCA or MSCA and the form you need.", href:"/resources#student-forms"},
  {title:"Find registrar forms", description:"Academic records, enrolment changes and other student requests.", href:"/resources#registrar-forms"},
  {title:"Follow the thesis process", description:"Preparation, proposal, defense and manuscript guidance.", href:"/thesis-guide"},
  {title:"Arrange your BSCA internship", description:"SOJT preparation, placement, monitoring and clearance.", href:"/sojt-guide"},
  {title:"Find program documents", description:"Prospectuses, handbooks and other study documents.", href:"/resources#program-documents"},
  {title:"Ask for academic or learning support", description:"Find the appropriate program contact.", href:"/resources#learning-support"},
];
export default function CurrentStudents() {
  return <>
    <Seo title="Current student services" description="Find BSCA and MSCA forms, thesis and internship guides, program documents, academic contacts and department dates." />
    <PageHero title="Current student services" subtitle="Choose the task you need to complete." />
    <section className="container max-w-5xl py-10" aria-labelledby="student-tasks-heading">
      <h2 id="student-tasks-heading" className="text-2xl font-semibold">Forms, guides and assistance</h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">{tasks.map(task => <li key={task.href}><Link className="block h-full rounded-md border border-border p-5 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" to={task.href}><h3 className="text-lg font-semibold text-primary underline underline-offset-4">{task.title}</h3><p className="mt-2 leading-7 text-muted-foreground">{task.description}</p></Link></li>)}</ul>
      <nav aria-label="Thesis guides by degree" className="mt-6 flex flex-wrap gap-3"><Link className="outline-link" to="/thesis-guide?program=BSCA">BSCA Thesis Process Guide</Link><Link className="outline-link" to="/thesis-guide?program=MSCA">MSCA Thesis Process Guide</Link></nav>
      <section className="mt-10 border-t border-border pt-8" aria-labelledby="student-dates-heading"><h2 id="student-dates-heading" className="text-2xl font-semibold">Dates and department contacts</h2><nav aria-label="Student dates and contacts" className="mt-4 flex flex-wrap gap-3"><Link className="outline-link" to="/news/events">Upcoming events and deadlines</Link><Link className="outline-link" to="/news">Department announcements</Link><Link className="outline-link" to="/faculty">Faculty and staff contacts</Link><Link className="outline-link" to="/about/contact">Department office</Link></nav></section>
      <section className="mt-8" aria-labelledby="student-learning-heading"><h2 id="student-learning-heading" className="text-xl font-semibold">Learning resources</h2><p className="mt-3 leading-7">Explore materials for embedded systems, IoT and related study areas.</p><Link className="text-link mt-3 inline-flex min-h-11 items-center" to="/resources#learning-resources">Browse learning resources</Link></section>
    </section>
  </>;
}
