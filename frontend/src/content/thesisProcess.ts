// STAFF: Edit workflow wording, checklists, deadlines and approvals here, not in the page.
// University requirements come from uploaded official forms. Department requirements
// are recorded separately from explicit departmental instructions, not inferred from examples.
export type ThesisProgram = "BSCA" | "MSCA";
export interface FormSource {
  code: string; revision: string; effectiveDate: string; file: string; downloadUrl?: string;
  program: ThesisProgram; status: string; verificationNote?: string;
}
export const thesisFormSources: Record<string, FormSource> = {
  "BSCA017": {
    "code": "FM-MSU-IIT-ACAD-017",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "bsca/FM-MSU-IIT-ACAD-017 - NOMINATION OF MEMBERS OF ADVISORY PANEL.docx",
    "program": "BSCA",
    "status": "Source reviewed"
  },
  "BSCA018": {
    "code": "FM-MSU-IIT-ACAD-018",
    "revision": "00",
    "effectiveDate": "02.20.2020",
    "file": "bsca/FM-MSU-IIT-ACAD-018  - REQUEST OF ADVISER PANEL MEMBER.docx",
    "program": "BSCA",
    "status": "Source reviewed"
  },
  "BSCA019": {
    "code": "FM-MSU-IIT-ACAD-019",
    "revision": "00",
    "effectiveDate": "02.20.2020",
    "file": "bsca/FM-MSU-IIT-ACAD-019 - APPROVAL FOR PROPOSAL HEARING.docx",
    "program": "BSCA",
    "status": "Source reviewed"
  },
  "BSCA020": {
    "code": "FM-MSU-IIT-ACAD-020",
    "revision": "00",
    "effectiveDate": "02.20.2020",
    "file": "bsca/FM-MSU-IIT-ACAD-020 - APPROVAL OF PROPOSAL.docx",
    "program": "BSCA",
    "status": "Source reviewed"
  },
  "BSCA021": {
    "code": "FM-MSU-IIT-ACAD-021",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "bsca/FM-MSU-IIT-ACAD-021 - NOMINATION OF MEMBERS OF ORAL EXAMINATION PANEL.docx",
    "program": "BSCA",
    "status": "Source reviewed"
  },
  "BSCA022": {
    "code": "FM-MSU-IIT-ACAD-022",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "bsca/FM-MSU-IIT-ACAD-022 - APPROVAL FOR FINAL DEFENSE.docx",
    "program": "BSCA",
    "status": "Source reviewed"
  },
  "BSCA023": {
    "code": "FM-MSU-IIT-ACAD-023",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "bsca/FM-MSU-IIT-ACAD-023 - ORAL EXAMINATION REPORT IN FINAL DEFENSE.docx",
    "program": "BSCA",
    "status": "Source reviewed"
  },
  "BSCA024": {
    "code": "FM-MSU-IIT-ACAD-024",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "bsca/FM-MSU-IIT-ACAD-024 - PANEL ORAL EXAMINATION REPORT.docx",
    "program": "BSCA",
    "status": "Source reviewed"
  },
  "BSCA025": {
    "code": "FM-MSU-IIT-ACAD-025",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "bsca/FM-MSU-IIT-ACAD-025 - APPROVAL FOR BINDING.docx",
    "program": "BSCA",
    "status": "Source reviewed"
  },
  "MSCA017": {
    "code": "FM-MSU-IIT-ACAD-017",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "msca/FORM 017 Nomination of Members of Advisory Panel.docx",
    "program": "MSCA",
    "status": "Source reviewed"
  },
  "MSCA018": {
    "code": "FM-MSU-IIT-ACAD-018",
    "revision": "00",
    "effectiveDate": "02.20.2020",
    "file": "msca/FORM 018 Request for Change of Adviser Panel Member.docx",
    "program": "MSCA",
    "status": "Source reviewed"
  },
  "MSCA019": {
    "code": "FM-MSU-IIT-ACAD-019",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "msca/FORM 019 Approval for Proposal Hearing.docx",
    "program": "MSCA",
    "status": "Source reviewed"
  },
  "MSCA020": {
    "code": "FM-MSU-IIT-ACAD-020",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "msca/FORM 020 Approval of Proposal.docx",
    "program": "MSCA",
    "status": "Source reviewed"
  },
  "MSCA021": {
    "code": "FM-MSU-IIT-ACAD-021",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "msca/FORM 021-Nomination-of-Members-of-Oral-Exam-Panel.docx",
    "program": "MSCA",
    "status": "Source reviewed"
  },
  "MSCA022": {
    "code": "FM-MSU-IIT-ACAD-022",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "msca/FORM 022-Approval-for-Final-Defense.docx",
    "program": "MSCA",
    "status": "Source reviewed"
  },
  "MSCA023": {
    "code": "FM-MSU-IIT-ACAD-023",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "msca/FORM 023-Oral-Exam-Report-on-Final-Defense.docx",
    "program": "MSCA",
    "status": "Source reviewed"
  },
  "MSCA024": {
    "code": "FM-MSU-IIT-ACAD-024",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "msca/FORM 024-Panel-Oral-Exam-Report.docx",
    "program": "MSCA",
    "status": "Source reviewed"
  },
  "MSCA025": {
    "code": "FM-MSU-IIT-ACAD-025",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "msca/FORM 025-Approval-for-Binding.docx",
    "program": "MSCA",
    "status": "Source reviewed"
  },
  "MSCA027": {
    "code": "FM-MSU-IIT-ACAD-027",
    "revision": "00",
    "effectiveDate": "02.20.2020",
    "file": "msca/Form 027 Nomination of Written  Exam.docx",
    "program": "MSCA",
    "status": "Source reviewed"
  },
  "BSCAsubmission": {
    "code": "FM-MSU-IIT-ACAD-025",
    "revision": "00",
    "effectiveDate": "01.20.2020",
    "file": "bsca/FM-MSU-IIT-ACAD-025 - REQUIREMENTS SUBMISSION.docx",
    "program": "BSCA",
    "status": "Document code requires verification",
    "verificationNote": "Verify official document code with the department before publication."
  }
};
export const formUrl = (source: FormSource) => source.downloadUrl || "/thesis-forms/" + source.file.split("/").map(encodeURIComponent).join("/");
export interface ThesisForm {
  id: string; title: string; purpose: string; when: string; requirements: string[];
  approvals: Partial<Record<ThesisProgram, string[]>>; notes?: string[];
  roomBooking?: { title: string; items: string[]; notes: string[]; source: string; url: string; deadline: string };
  departmentRequirements?: { title: string; items: string[]; notes: string[]; source: string };
}
const undergraduateApprovals = ["Department Chairperson — recommending approval", "Research Instructor / Research Adviser — recommending approval", "College Dean — approval"];
const graduateApprovals = ["Department Chairperson — recommending approval", "Department Graduate Program Coordinator — recommending approval", "College Graduate Coordinator — recommending approval", "College Dean — approval"];
const standardApprovals = { BSCA: undergraduateApprovals, MSCA: graduateApprovals };
const panelSignatures = { BSCA: ["Advisory Panel: Chairperson/Adviser, Co-Adviser and Members"], MSCA: ["Advisory Panel: Chairperson/Adviser and Members"] };
// Confirmed by the department on 2026-10-06 for both BSCA and MSCA.
// This is an additional booking requirement, not a requirement printed in Forms 019/022.
// CCS Office Memorandum No. 002-EBBP, series of 2025, dated 4 August 2025.
// Room requests and Google Calendar reminders are separate; neither replaces hearing approval.
const roomBookingRequirements = {
  title: "Required · Book and confirm the hearing room",
  url: "https://one.msuiit.edu.ph/ccs/facility/",
  deadline: "Submit the room request at least two working days before the event. This does not replace the one-week thesis-form deadline.",
  items: ["Submit the official online CCS facility request for your proposal hearing or final defense. Submit a separate request for each event.", "Obtain confirmation of the room booking for the hearing date and time before the hearing takes place. A submitted request is not an approved booking.", "Keep the confirmed room, date and time consistent in the thesis approval form, public announcement and faculty Google Calendar entry."],
  notes: ["An approved room booking is required for both BSCA and MSCA proposal hearings and final defenses. Without a confirmed room booking, the hearing cannot proceed.", "Approval depends on facility availability and the Dean’s final approval. Scheduled CCS lectures and laboratory classes take priority. Request the room early while coordinating the hearing schedule.", "Personnel services outside Monday–Friday, 8:00 AM–5:00 PM are subject to overtime charges borne by the requester. Contact the CCS Dean’s Office for booking enquiries."],
  source: "CCS Office Memorandum No. 002-EBBP, series of 2025 · 4 August 2025. The department confirms room booking is mandatory for thesis hearings.",
};
const hearingBookingRequirements = {
  title: "Department booking requirements · Announcement and calendar",
  items: ["Submit a personal photo of each student to the department with the hearing booking and approval materials. The photos will be used in the department’s public Facebook announcement.", "Arrange for the approved hearing date, start and end times, and room to be entered in Google Calendar.", "Include the participating faculty in the calendar invitation and arrange reminders for the hearing."],
  notes: ["This applies to both proposal hearings and final defenses, in addition to the official forms and their accompanying requirements.", "Confirm the photo format and submission method with the department. Ask about photo use before submitting if you have any concerns.", "The department prepares the public announcement using the approved hearing schedule. Submitting a photo does not itself approve the booking.", "Confirm with the department which Google Calendar to use, who creates the event and the reminder timing. Keep the calendar entry consistent with the approved schedule and update it if the date, time or room changes."],
  source: "Department instruction confirmed on 6 October 2026; not stated in Forms 019 or 022.",
};
// Additional final-submission requirement confirmed by the department, separate from source-form text.
export const hardboundSubmissionRequirements = {
  title: "Required for clearance · Three hardbound thesis copies",
  items: [
    "Prepare a printed hardbound thesis copy for the Department of Computer Applications.",
    "Prepare a printed hardbound thesis copy for the College Dean’s Office.",
    "Prepare a printed hardbound thesis copy for the University Library.",
    "Ensure the fully signed Certificate of Panel Approval is bound inside each of the three hardbound thesis copies, not submitted separately.",
  ],
  notes: ["These are three complete hardbound thesis copies, in addition to the abstract copies, research-article copies, poster and electronic files listed above.", "Confirm the submission handoff and receipt of the copies with the department or graduate coordinator. Preparing the copies alone does not establish clearance."],
  source: "Department-confirmed final-submission and clearance requirement for BSCA and MSCA. This additional requirement is not attributed to the uploaded Requirements Submission form.",
};
export const thesisForms: Record<string, ThesisForm> = {
  "017": { id: "017", title: "Nomination of Members of Advisory Panel", purpose: "Establish your thesis Advisory Panel.", when: "When forming your panel, before applying for a proposal hearing.", requirements: ["Complete student details, degree and thesis title.", "Enter the panel members’ names and obtain the signatures indicated on the form."], approvals: standardApprovals, notes: ["The BSCA form has Chairperson/Adviser, Co-Adviser and Member slots. The MSCA form has Chairperson/Adviser and Member slots."] },
  "018": { id: "018", title: "Request for Change of Adviser / Panel Member", purpose: "Request a replacement only when your Adviser or a Panel Member needs to change.", when: "Only if a change is needed; this is not a required stage for everyone.", requirements: ["Complete student and degree details.", "Explain the reasons for replacement.", "Obtain concurrence from the outgoing Adviser/Panel Member and the proposed Adviser/Panel Member.", "Sign the request as the student (MSCA) or student-group representative (BSCA)."], approvals: standardApprovals },
  "019": { id: "019", title: "Approval for Proposal Hearing", purpose: "Request approval of your proposal hearing and its schedule.", when: "At least one week before the scheduled hearing.", requirements: ["Complete Form 019, including the hearing date, time and place.", "Submit the form and a copy of the manuscript to the College Dean at least one week before the hearing.", "Prepare a copy of the manuscript for each panel member.", "Arrange a proposal hearing that is open to the public.", "Attach the official receipt of the proposal fee."], roomBooking: roomBookingRequirements, departmentRequirements: hearingBookingRequirements, approvals: { BSCA: [...panelSignatures.BSCA, ...undergraduateApprovals], MSCA: [...panelSignatures.MSCA, ...graduateApprovals] } },
  "020": { id: "020", title: "Approval of Proposal", purpose: "Record the examiner’s recommendations and the Advisory Panel’s approval after the hearing.", when: "After the proposal hearing and any required changes.", requirements: ["Have the examiner complete and sign the Proposal Hearing recommendation page.", "Address the changes required in the recommendations.", "Obtain the Advisory Panel’s dated signatures on the approval sheet.", "Submit the approval sheet, proposal and examiner recommendations to the College Dean."], approvals: panelSignatures },
  "021": { id: "021", title: "Nomination of Members of Oral Examination Panel", purpose: "Establish the panel for your final oral examination.", when: "While preparing for the final defense, before requesting its approval.", requirements: ["Complete student details, degree and thesis title.", "Enter the Oral Examination Panel members and obtain the signatures indicated on the form."], approvals: standardApprovals },
  "022": { id: "022", title: "Approval for Final Defense", purpose: "Secure approval for the public final defense after the panel has examined the manuscript.", when: "Apply at least one week before defense; hold the defense at least one month before grade locking.", requirements: ["Have the Oral Examination Panel examine the manuscript and sign its recommendation on Form 022.", "Complete the defense date, time and place.", "Submit the form and manuscript to the College Dean at least one week before the scheduled defense.", "Prepare a manuscript copy for each panel member.", "Prepare an A4 summary poster: Abstract; Introduction; Research Design and Methodology; Results and Discussion; Conclusions and Recommendations.", "Arrange a public oral examination at least one month before the day of locking of grades.", "Attach the official receipt of the defense fee."], roomBooking: roomBookingRequirements, departmentRequirements: hearingBookingRequirements, approvals: { BSCA: ["Oral Examination Panel — recommendation", "Department Chairperson — recommending approval", "College Dean — approval"], MSCA: ["Oral Examination Panel — recommendation", ...graduateApprovals] }, notes: ["The A4 poster for defense is different from the final-submission poster size listed in the BSCA submission form. Ask your coordinator for the actual grade-locking date; the form does not supply a calendar date."] },
  "023": { id: "023", title: "Oral Examination Report in Final Defense", purpose: "Individual examiner evaluation — each examiner records their assessment and recommendations.", when: "During / following the final defense.", requirements: ["The examiner records organization, presentation, content, mastery of subject matter, ability to defend ideas and receptiveness to suggestions.", "The examiner records an overall evaluation: Passed, Failed or Conditional.", "The examiner completes the recommendation page, signature and date."], approvals: { BSCA: ["Individual Examiner — evaluation and signature"], MSCA: ["Individual Examiner — evaluation and signature"] } },
  "024": { id: "024", title: "Panel Oral Examination Report", purpose: "Official panel result — records the panel’s decision, rather than one examiner’s assessment.", when: "Following the final oral examination.", requirements: ["Record the panel result and remarks.", "Attach the list of required suggestions / changes when the result requires manuscript modification.", "Obtain the Oral Examination Panel’s signatures."], approvals: { BSCA: ["Oral Examination Panel: Chairperson/Adviser, Co-Adviser and Members"], MSCA: ["Oral Examination Panel: Chairperson/Adviser and Members"] }, notes: ["Results: Passed without manuscript modification; Passed provided the attached suggestions/changes are reflected; or Failed. If the result is Failed or requires clarification, ask your adviser or coordinator what to do before proceeding."] },
  "025": { id: "025", title: "Approval for Binding", purpose: "Confirm that all Oral Examination Panel comments and recommendations are reflected in the manuscript.", when: "After the panel verifies the final manuscript, before final binding.", requirements: ["Incorporate all comments and recommendations from the final defense.", "Have the Oral Examination Panel examine the manuscript and sign its certification.", "Obtain the recommending and approval signatures indicated on the form before proceeding to final binding."], approvals: standardApprovals },
  "submission": { id: "submission", departmentRequirements: hardboundSubmissionRequirements, title: "Final requirements submission", purpose: "Submit the final materials and request signing of the approval sheet.", when: "After approval for binding, when completing final submission.", requirements: ["USB flash drive: manuscript in MS Word format.", "USB flash drive: abstract in MS Word format.", "USB flash drive: research article.", "USB flash drive: thesis documentation — presentation video, codes and application/program.", "Three hard copies of the abstract.", "Two hard copies of the research article / journal-type paper.", "One printed research poster: 33 × 48.5 cm or 13 × 19 inches."], approvals: { BSCA: ["Researchers — request signatures", "Thesis Adviser — recommending approval", "Department Chairperson — approval; letter addressed to the College Dean for signing of the approval sheet"] }, notes: ["The department has confirmed that the USB, printed-copy and poster checklist applies to both BSCA and MSCA. Complete the applicable current form; the BSCA form includes a publication-intention choice, which does not establish a requirement to publish an article."] },
  "027": { id: "027", title: "Nomination of Members of Written Examination Committee", purpose: "Nominate the committee for a graduate written examination.", when: "Only when instructed to prepare for a Comprehensive Exam or Preliminary Exam (SDS).", requirements: ["Select the applicable examination, complete student details and enter the examination date, time and place.", "Enter the committee Chairperson/Adviser and Members and obtain the required signatures."], approvals: { MSCA: graduateApprovals }, notes: ["This is a separate graduate academic process. It is not a required step between thesis proposal and final defense. The additional Form 027 uploaded in the BSCA folder is headed Office of Graduate Studies and has a different coordinator signature layout; confirm the applicable version with the graduate coordinator."] },
};
// STAFF: Differences between the uploaded program forms belong here.
// Never substitute a document from the other program when a source is missing.
const programFormOverrides: Record<ThesisProgram, Record<string, Partial<ThesisForm>>> = {
  BSCA: {
    "017": { notes: ["Use the BSCA form for the undergraduate thesis group. Its panel slots are Chairperson/Adviser, Co-Adviser and Members."] },
    "018": { requirements: ["Complete student and degree details.", "Explain the reasons for replacement.", "Obtain concurrence from the outgoing Adviser/Panel Member and the proposed Adviser/Panel Member.", "Have the Student Group Representative sign the request."] },
    "021": { notes: ["Use the BSCA form for the undergraduate thesis group. Its Oral Examination Panel slots are Chairperson/Adviser, Co-Adviser and Members."] },
    "022": { notes: ["The BSCA form includes the undergraduate thesis group and Chairperson/Adviser, Co-Adviser and Member signatures.", "The A4 defense poster differs from the final-submission poster. Ask your coordinator for the actual grade-locking date."] },
    "025": { approvals: { BSCA: ["Oral Examination Panel: Chairperson/Adviser, Co-Adviser and Members — manuscript certification", ...undergraduateApprovals] } },
    "submission": { notes: ["Use the BSCA Requirements Submission form from the BSCA folder. Its publication-intention choice does not establish a requirement to publish an article."] },
  },
  MSCA: {
    "017": { notes: ["Use the MSCA form for the individual graduate student. Its panel slots are Chairperson/Adviser and Members."] },
    "018": { requirements: ["Complete student and degree details.", "Explain the reasons for replacement.", "Obtain concurrence from the outgoing Adviser/Panel Member and the proposed Adviser/Panel Member.", "Sign the request as the student."] },
    "021": { notes: ["Use the MSCA form for the individual graduate student. Its Oral Examination Panel slots are Chairperson/Adviser and Members."] },
    "022": { notes: ["The MSCA form includes the individual graduate student and Chairperson/Adviser and Member signatures, followed by the graduate recommending authorities.", "The A4 defense poster differs from the department-confirmed final-submission poster. Ask your graduate coordinator for the actual grade-locking date."] },
    "025": { approvals: { MSCA: ["Oral Examination Panel: Chairperson/Adviser and Members — manuscript certification", ...graduateApprovals] } },
    "submission": { notes: ["The department confirmed the USB, printed-copy and poster checklist for MSCA. Obtain the current MSCA submission form from the graduate coordinator; do not use a BSCA form as a substitute."] },
  },
};
export function getThesisForm(program: ThesisProgram, id: string): ThesisForm {
  return { ...thesisForms[id], ...programFormOverrides[program][id] };
}
export function getThesisFormSource(program: ThesisProgram, id: string): FormSource | undefined {
  const source = thesisFormSources[program + id];
  // Fail closed: a missing/misclassified source must never become a cross-program download.
  return source?.program === program && source.file.startsWith(program.toLowerCase() + "/") ? source : undefined;
}
export function getThesisSourceNotes(program: ThesisProgram): string[] {
  return thesisSourceNotes.filter(note => program === "BSCA" ? !note.startsWith("The supplied MSCA") : !note.startsWith("The BSCA Form") && !note.startsWith("BSCA Requirements"));
}
// Department-confirmed clearance consequence; do not attribute this statement to the uploaded forms.
// Exact registrar documents affected and hold-removal procedure remain subject to official instructions.
export const thesisClearance = {
  title: "Required for clearance",
  message: "Complete and submit the final thesis requirements, including three printed hardbound thesis copies with a fully signed Certificate of Panel Approval bound inside each copy. Incomplete or unsubmitted requirements will result in an outstanding thesis liability, which may prevent the release of your Transcript of Records (TOR) and other registrar certifications until the liability is cleared.",
  action: "Confirm with the department or graduate coordinator that your submission has been accepted and your thesis liability has been cleared. Submitting documents alone does not confirm clearance.",
  source: "Department-confirmed requirement. Follow the applicable university clearance and registrar instructions.",
  completion: "Submission accepted and thesis liability cleared",
};
export interface ThesisStage { id: string; title: string; description: string; forms: string[]; deadline?: string; next: string; notes?: string[]; conditional?: string; clearance?: typeof thesisClearance; }
export const thesisStages: ThesisStage[] = [
  { id: "panel-formation", title: "Panel formation", description: "Establish who will advise and review your thesis.", forms: ["017"], next: "Prepare the proposal manuscript and apply for a proposal hearing.", conditional: "018" },
  { id: "proposal-hearing", title: "Proposal hearing application", description: "Request and confirm the hearing room; prepare the manuscript, copies, receipt and announcement photos, secure hearing approval and arrange the faculty calendar entry.", forms: ["019"], deadline: "Submit the form and manuscript to the Dean at least one week before the hearing.", next: "Attend the public proposal hearing only after both hearing approval and the room booking are confirmed." },
  { id: "proposal-approval", title: "Proposal hearing and approval", description: "Hearing → examiner recommendations → required changes → panel approval → submission to the Dean.", forms: ["020"], next: "Proceed with the approved thesis, then prepare for the final defense." },
  { id: "defense-preparation", title: "Preparation for final defense", description: "Confirm the defense room, nominate the panel and prepare the manuscript, A4 poster and announcement photos; secure defense approval and arrange the faculty calendar entry.", forms: ["021", "022"], deadline: "Apply at least one week before defense. Hold the defense at least one month before grade locking.", next: "Attend the public final defense only after both defense approval and the room booking are confirmed." },
  { id: "final-defense", title: "Final defense", description: "Form 023 is an individual examiner’s evaluation. Form 024 is the official panel result.", forms: ["023", "024"], next: "Follow the panel’s result: complete required revisions, or proceed to binding verification if no changes are required." },
  { id: "revisions", title: "Post-defense revisions", description: "If changes are required: panel comments → revise manuscript → adviser/panel verification.", forms: [], notes: ["This stage applies when the panel requires changes. No separate numbered revision form is supplied. Form 025 certifies that all comments and recommendations have been reflected."], next: "Request approval for binding after the panel verifies the manuscript." },
  { id: "binding", title: "Approval for binding", description: "Reach the manuscript milestone: panel recommendations incorporated and approval for binding secured.", forms: ["025"], next: "Bind the approved manuscript and prepare the applicable final-submission materials." },
  { id: "final-submission", title: "Final requirements submission", description: "Prepare the final materials for your program and submit them through the applicable office.", forms: ["submission"], clearance: thesisClearance, next: thesisClearance.action },
];
export const thesisStartingPoints = [
  ["Starting my thesis", "panel-formation"], ["Preparing for proposal hearing", "proposal-hearing"],
  ["Proposal already defended", "proposal-approval"], ["Preparing for final defense", "defense-preparation"],
  ["Final defense completed", "final-defense"], ["Completing revisions", "revisions"],
  ["Preparing final submission", "binding"], ["Approval for binding already secured", "final-submission"],
] as const;
export const thesisSourceNotes = [
  "The BSCA Form 017 title says Advisory Panel, while its body says Oral Examination Panel. The guide follows the document title for panel formation; confirm the intended wording with the department.",
  "BSCA Requirements Submission and Approval for Binding both carry FM-MSU-IIT-ACAD-025. They are distinguished by title; neither has been renumbered.",
  "The supplied MSCA Requirements Submission is a March 2018 OGS Form 14. It mentions a CD-ROM, three abstracts and four research articles, and names a different college in its address. The department confirms that the BSCA USB, printed-copy and poster checklist now applies to MSCA too. The current MSCA submission document and signatories still need graduate-coordinator verification.",
  "The department confirms that a fully signed Certificate of Panel Approval is bound inside each of the three hardbound thesis copies. Legacy CCS Forms 13–14 and the Certificate of Authentic Authorship remain outside the main checklist until their current applicability is confirmed. Uploaded reference templates alone do not establish current requirements.",
];
export const thesisDisclaimer = "This guide is intended to assist students in navigating the thesis process. Official university and college policies, approved forms, and instructions issued by the College, Department, and Office of Graduate Studies shall prevail in case of any discrepancy.";
