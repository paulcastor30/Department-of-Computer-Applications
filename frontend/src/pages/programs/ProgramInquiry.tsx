import { Link } from "react-router-dom";
import { departmentIdentity } from "@/content/siteContent";
import { useSiteSettings } from "@/hooks/useCore";

export function ProgramInquiry({ code }: { code?: string }) {
  const { data } = useSiteSettings();
  const email = data?.primary_email || departmentIdentity.email;
  const subject = code ? `${code} program enquiry` : "Academic program enquiry";
  return <div className="max-w-3xl space-y-5">
    <p className="leading-7">Ask about the curriculum, entry requirements, fees, application dates, or support you may need. Include {code ? `“${code}”` : "the program name"} and your question in your email.</p>
    <section>
      <h3 className="mb-3 text-xl font-semibold text-primary">Advising and learning support</h3>
      <p className="leading-7">For questions about subject choices, bridging courses, or your study plan, email the department and ask who can advise you.</p>
      <p className="mt-3 leading-7">If you need disability-related learning support, tell the department what assistance you would like to discuss, such as accessible course materials or support during classes and assessments. Ask about available arrangements and the university process.</p>
    </section>
    <div className="flex flex-wrap gap-3">
      <a className="action-link" href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}>Email about {code || "our programs"}</a>
      <Link className="outline-link" to="/about/contact">Contact and visiting details</Link>
    </div>
    <p className="break-all text-sm text-muted-foreground">Email opens your email app. You can also copy this address: {email}</p>
  </div>;
}
