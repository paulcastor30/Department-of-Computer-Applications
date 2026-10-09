import { Link } from "react-router-dom";
import type { ProgramProfile } from "@/pages/programs/programData";

export function TransferEvaluation({ program }: { program: ProgramProfile }) {
  if (program.code !== "BSCA" || !program.transferEvaluationEmail || !program.transferEvaluationInstructions) return null;
  const subject = "BSCA Shifting/Transfer Evaluation – Full Name";
  const body = "Full name: \nCurrent school: \nCurrent program: \nIntended semester of entry: \n\nPlease attach your Evaluation of Grades before sending.";
  const href = `mailto:${program.transferEvaluationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return <section className="mt-8 max-w-3xl rounded-md border border-border bg-background p-5 sm:p-6">
    <h3 className="text-xl font-semibold text-primary">Planning to shift or transfer to BSCA?</h3>
    <div className="mt-4 space-y-4 leading-7 text-muted-foreground">
      {program.transferEvaluationInstructions.split("\n").filter(Boolean).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </div>
    <Link className="action-link mt-5" to="/admissions/transfer-evaluation">Start an online evaluation</Link>
    <p className="mt-4 leading-7 text-muted-foreground">Compare completed subjects with the BSCA prospectus, submit your records, and check adviser and chairperson review progress.</p>
    <a className="text-link mt-4 inline-block" href={href}>Contact the department by email</a>
    <p className="mt-4 break-words text-sm leading-6 text-muted-foreground">Email opens your email app. Replace “Full Name” in the subject with your name and attach your Evaluation of Grades before sending. You can also copy this address: <span className="font-semibold">{program.transferEvaluationEmail}</span></p>
  </section>;
}
