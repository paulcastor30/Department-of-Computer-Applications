import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/ui/hero-section";
import { TaskList } from "@/components/ui/task-list";

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
    <div className="container student-services">
      <div className="service-width">
        <section aria-labelledby="student-tasks-heading">
          <h2 id="student-tasks-heading" className="section-title">Forms, guides and assistance</h2>
          <TaskList tasks={tasks} />
          <nav aria-label="Thesis guides by degree" className="related-links"><Link className="text-link" to="/thesis-guide?program=BSCA">BSCA Thesis Process Guide</Link><Link className="text-link" to="/thesis-guide?program=MSCA">MSCA Thesis Process Guide</Link></nav>
        </section>
        <div className="student-support-grid">
          <section aria-labelledby="student-dates-heading"><h2 id="student-dates-heading" className="section-title">Dates and department contacts</h2><nav aria-label="Student dates and contacts" className="mt-4 flex flex-col items-start gap-2"><Link className="action-link" to="/news/events">Upcoming events and deadlines</Link><Link className="text-link inline-flex min-h-11 items-center" to="/news">Department announcements</Link><Link className="text-link inline-flex min-h-11 items-center" to="/faculty">Faculty and staff contacts</Link><Link className="text-link inline-flex min-h-11 items-center" to="/about/contact">Department office</Link></nav></section>
          <section aria-labelledby="student-learning-heading"><h2 id="student-learning-heading" className="section-title">Learning resources</h2><p className="mt-3 reading-width">Explore materials for embedded systems, IoT and related study areas.</p><Link className="text-link mt-3 inline-flex min-h-11 items-center" to="/resources#learning-resources">Browse learning resources</Link></section>
        </div>
      </div>
    </div>
  </>;
}
