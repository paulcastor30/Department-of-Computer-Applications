import { Link } from "react-router-dom";
import { departmentIdentity } from "@/content/siteContent";
import { useSiteSettings } from "@/hooks/useCore";

export function ProgramInquiry({ code }: { code?: string }) {
  const { data } = useSiteSettings();
  const email = data?.primary_email || departmentIdentity.email;
  const subject = code ? `${code} program enquiry` : "Academic program enquiry";
  const supportSubject = `${code || "Program"} learning-support enquiry`;
  return <div className="max-w-3xl space-y-5">
    <p className="leading-7">Ask about the curriculum, entry requirements, fees, application dates, or support you may need. Include {code ? `“${code}”` : "the program name"} and your question in your email.</p>
    <section>
      <h3 className="mb-3 text-xl font-semibold text-primary">Academic advising</h3>
      <p className="leading-7">For questions about subject choices, bridging courses, or your study plan, email the department and ask who can advise you.</p>
    </section>
    <section>
      <h3 className="mb-3 text-xl font-semibold text-primary">Request information about learning support</h3>
      <p className="leading-7">If you need disability-related assistance with course materials, classes or assessments, start by emailing the department. Ask which office handles your request, what arrangements are available and how to apply.</p>
      <p className="mt-3 leading-7">Include your program, the learning activity you need help with and any relevant date. You can ask about the process before sharing medical documents.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a className="action-link" href={`mailto:${email}?subject=${encodeURIComponent(supportSubject)}`}>Ask about learning support</a>
        <a className="outline-link" href="https://www.msuiit.edu.ph/offices/ovcss/index.php">University student services</a>
      </div>
    </section>
    <div className="flex flex-wrap gap-3">
      <a className="action-link" href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}>Email about {code || "our programs"}</a>
      <Link className="outline-link" to="/about/contact">Campus directions and physical access</Link>
    </div>
    <p className="break-all text-sm text-muted-foreground">Email opens your email app. You can also copy this address: {email}</p>
  </div>;
}
