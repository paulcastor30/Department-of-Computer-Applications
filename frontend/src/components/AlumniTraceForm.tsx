import { useState } from "react";
import { alumniRequest } from "@/lib/api";
import type { AlumniConfiguration, AlumniProfile } from "@/hooks/useAlumni";

const control = "min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";
const statuses = [["EMPLOYED", "Employed"], ["SELF_EMPLOYED", "Self-employed"], ["FURTHER_STUDY", "Further study"], ["SEEKING_WORK", "Seeking work"], ["OTHER", "Other activities"], ["PREFER_NOT_TO_SAY", "Prefer not to say"]];
export type AlumniSaved = { detail: string; access_key?: string; email?: string };
const contactFields = [["family_name", "Family name"], ["first_name", "First name"], ["middle_name", "Middle name"], ["student_id", "Former student ID"], ["bsca_period", "BSCA graduation semester"], ["msca_period", "MSCA graduation semester"], ["residence_city", "Current city or province"], ["residence_country", "Current country"], ["permanent_address", "Permanent address", "textarea"], ["landline", "Landline number", "tel"]];
const workFields = [["industry", "Industry or sector"], ["work_city", "Work city or province"], ["work_country", "Work country"], ["duties", "What work do you actually do?", "textarea"], ["skills_used", "Skills and tools used", "textarea"], ["alignment_explanation", "How does your work relate to your degree?", "textarea"], ["career_start", "Role or activity start date", "date"], ["career_end", "End date (leave blank if ongoing)", "date"]];
const studyFields = [["study_program", "Further-study program"], ["study_institution", "Institution or university"], ["exam_details", "Exam name, eligibility, and details"], ["program_feedback", "What prepared you well, and what should BSCA or MSCA improve?", "textarea"]];
const networkFields = [["network_interests", "Ways you would like to connect", "textarea"], ["professional_url", "Professional profile or portfolio", "url"]];
const extraFields = [...contactFields, ...workFields, ...studyFields, ...networkFields, ["sex"], ["work_alignment"], ["work_arrangement"], ["exam_status"]];
const limits: Record<string, number> = { family_name: 150, first_name: 150, middle_name: 150, student_id: 40, bsca_period: 100, msca_period: 100, residence_city: 150, residence_country: 100, permanent_address: 1500, landline: 40, industry: 150, work_city: 150, work_country: 100, duties: 3000, skills_used: 1000, alignment_explanation: 1500, study_program: 200, study_institution: 200, exam_details: 500, program_feedback: 3000, network_interests: 1000, professional_url: 500 };

function ExtraControls({ fields, values, onChange }: { fields: string[][]; values: Record<string, string>; onChange: (key: string, value: string) => void }) {
  return <div className="grid gap-4 sm:grid-cols-2">{fields.map(([key, label, type = "text"]) => <div key={key} className={type === "textarea" ? "sm:col-span-2" : ""}><label className="mb-2 block" htmlFor={`trace-${key}`}>{label} (optional)</label>{type === "textarea" ? <textarea id={`trace-${key}`} rows={3} maxLength={limits[key]} className={control} value={values[key]} onChange={event => onChange(key, event.target.value)} /> : <input id={`trace-${key}`} type={type} max={type === "date" ? new Date().toLocaleDateString("en-CA") : undefined} maxLength={limits[key]} className={control} value={values[key]} onChange={event => onChange(key, event.target.value)} />}</div>)}</div>;
}

function ExtraSelect({ field, label, values, choices, onChange }: { field: string; label: string; values: Record<string, string>; choices: string[][]; onChange: (key: string, value: string) => void }) {
  return <div><label className="mb-2 block" htmlFor={`trace-${field}`}>{label} (optional)</label><select id={`trace-${field}`} className={control} value={values[field]} onChange={event => onChange(field, event.target.value)}><option value="">Not provided</option>{choices.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></div>;
}
export function AlumniTraceForm({ config, email, profile, session, registration = false, onSaved }: { config: AlumniConfiguration; email: string; profile: AlumniProfile | null; session: string; registration?: boolean; onSaved: (result: AlumniSaved) => void }) {
  const [accountEmail, setAccountEmail] = useState(email);
  const [mode, setMode] = useState(profile ? "NO_CHANGE" : "CURRENT");
  const [furtherStudy, setFurtherStudy] = useState(profile?.further_study || false);
  const [extra, setExtra] = useState<Record<string, string>>(() => Object.fromEntries(extraFields.map(([key]) => {
    const value = profile?.[key as keyof AlumniProfile];
    return [key, typeof value === "string" ? value : ""];
  })));
  function changeExtra(key: string, value: string) { setExtra(previous => ({ ...previous, [key]: value })); }
  function changeMode(next: string) {
    setMode(next);
    if (next !== "NO_CHANGE") {
      setStatus(""); setEmployer(""); setJob(""); setFurtherStudy(false);
      setExtra(previous => ({ ...previous, ...Object.fromEntries([...workFields, ...studyFields, ["work_alignment"], ["work_arrangement"], ["exam_status"]].map(([key]) => [key, ""])) }));
    }
  }
  const [name, setName] = useState(profile?.full_name || "");
  const [bsca, setBsca] = useState(Boolean(profile?.bsca_year));
  const [msca, setMsca] = useState(Boolean(profile?.msca_year));
  const [bscaYear, setBscaYear] = useState(String(profile?.bsca_year || ""));
  const [mscaYear, setMscaYear] = useState(String(profile?.msca_year || ""));
  const [status, setStatus] = useState(profile?.career_status || "");
  const [employer, setEmployer] = useState(profile?.employer || "");
  const [job, setJob] = useState(profile?.job_title || "");
  const [interests, setInterests] = useState(profile?.interests || "");
  const [contact, setContact] = useState(profile?.preferred_contact || "EMAIL");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [updates, setUpdates] = useState(profile?.receive_updates || false);
  const [mentor, setMentor] = useState(profile?.willing_to_mentor || false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const employed = status === "EMPLOYED" || status === "SELF_EMPLOYED";
  const studying = status === "FURTHER_STUDY" || furtherStudy;

  async function save(event: React.FormEvent) {
    event.preventDefault(); setError("");
    if (!bsca && !msca) { setError("Choose BSCA, MSCA, or both, and enter your graduation year."); return; }
    if (mode !== "NO_CHANGE" && !status) { setError("Choose your activity, or select Prefer not to say."); return; }
    setBusy(true);
    try {
      const result = await alumniRequest<AlumniSaved>(registration ? "register" : "profile", {
        ...(registration ? { email: accountEmail } : {}),
        ...extra, career_start: extra.career_start || null, career_end: extra.career_end || null, further_study: studying, career_entry_mode: mode,
        full_name: name, bsca_year: bsca ? Number(bscaYear) : null, msca_year: msca ? Number(mscaYear) : null,
        career_status: status, employer: employed ? employer : "", job_title: employed ? job : "", interests,
        preferred_contact: contact, phone, receive_updates: updates, willing_to_mentor: mentor,
        consent, notice_version: config.notice_version,
      }, session);
      onSaved(result);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Your details could not be saved."); }
    finally { setBusy(false); }
  }

  return <form className="mt-6 space-y-5" onInvalidCapture={event => {
    let parent = (event.target as HTMLElement).parentElement;
    while (parent) { if (parent instanceof HTMLDetailsElement) parent.open = true; parent = parent.parentElement; }
  }} onSubmit={event => void save(event)}>
    <h3 className="text-lg font-semibold">1. Your details</h3>
    {registration ? <div><label className="mb-2 block font-medium" htmlFor="registration-email">Your email address</label><input id="registration-email" type="email" autoComplete="email" required maxLength={254} className={control} value={accountEmail} onChange={event => setAccountEmail(event.target.value)} /><p className="mt-2 text-sm leading-6">After saving, download your private access key so you can update your details later.</p></div> : <p className="break-all leading-7"><strong>Account email:</strong> {email}</p>}
    <p className="text-sm leading-6 text-muted-foreground">Start with your name, email, program and graduation year. Career questions are optional; every response helps us understand graduate outcomes.</p>
    {error && <p className="notice" role="alert">{error}</p>}
    <div><label className="mb-2 block font-medium" htmlFor="alumni-name">Full name</label><input id="alumni-name" autoComplete="name" required maxLength={150} className={control} value={name} onChange={event => setName(event.target.value)} /></div>
    <fieldset className="rounded-md border border-border p-4">
      <legend className="px-2 font-semibold">Graduated program — choose one or both</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="flex min-h-11 items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-primary" checked={bsca} onChange={event => setBsca(event.target.checked)} />BSCA graduate</label>{bsca && <><label className="mb-2 block" htmlFor="bsca-year">BSCA graduation year</label><input id="bsca-year" type="number" min={1900} max={new Date().getFullYear()} required className={control} value={bscaYear} onChange={event => setBscaYear(event.target.value)} /></>}</div>
        <div><label className="flex min-h-11 items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-primary" checked={msca} onChange={event => setMsca(event.target.checked)} />MSCA graduate</label>{msca && <><label className="mb-2 block" htmlFor="msca-year">MSCA graduation year</label><input id="msca-year" type="number" min={1900} max={new Date().getFullYear()} required className={control} value={mscaYear} onChange={event => setMscaYear(event.target.value)} /></>}</div>
      </div>
    </fieldset>
    <h3 className="text-lg font-semibold">2. How we can reach you</h3>
    <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-2 block font-medium" htmlFor="alumni-contact">Preferred contact method</label><select id="alumni-contact" className={control} value={contact} onChange={event => setContact(event.target.value)}><option value="EMAIL">Email</option><option value="PHONE">Phone</option></select></div><div><label className="mb-2 block font-medium" htmlFor="alumni-phone">Phone number ({contact === "PHONE" ? "required for phone contact" : "optional"})</label><input id="alumni-phone" type="tel" autoComplete="tel" required={contact === "PHONE"} className={control} maxLength={40} value={phone} onChange={event => setPhone(event.target.value)} /></div></div>
    <ExtraControls fields={contactFields.filter(([key]) => ["residence_city", "residence_country"].includes(key))} values={extra} onChange={changeExtra} />
    {profile?.career_history?.length ? <details className="rounded-md border border-border p-4"><summary className="cursor-pointer font-semibold">My retained career history ({profile.career_history.length})</summary><p className="my-4 text-sm leading-6">Earlier entries are retained as reported. Reporting dates do not imply employment end dates. Contact the chairperson to correct an earlier entry.</p><ol className="space-y-4">{profile.career_history.map(entry => <li key={entry.id} className="rounded-md bg-muted p-4"><h3 className="font-semibold">{entry.job_title || statuses.find(([key]) => key === entry.career_status)?.[1] || entry.career_status}{entry.employer && ` · ${entry.employer}`}</h3><p className="mt-2 text-sm">{entry.entry_kind === "HISTORICAL" ? "Previous role" : "Activity update"} · Reported {new Date(entry.reported_at).toLocaleDateString()}</p><p className="mt-2">{[entry.work_city, entry.work_country].filter(Boolean).join(", ")}</p>{entry.duties && <p className="mt-2 whitespace-pre-line leading-7">{entry.duties}</p>}{(entry.career_start || entry.career_end) && <p className="mt-2 text-sm">Dates: {entry.career_start || "Not provided"} to {entry.career_end || "No end date provided"}</p>}</li>)}</ol></details> : null}
    {profile && <div><label className="mb-2 block font-medium" htmlFor="career-entry-mode">Career history update</label><select id="career-entry-mode" className={control} value={mode} onChange={event => changeMode(event.target.value)}><option value="NO_CHANGE">Keep my current activity; update contact or network details</option><option value="CURRENT">Add my new current role or activity</option><option value="HISTORICAL">Add a previous role without changing my current activity</option></select><p className="mt-2 text-sm leading-6">New entries are added to your history. Earlier roles are kept.</p></div>}
    {mode !== "NO_CHANGE" && <fieldset className="space-y-5 rounded-md border border-border p-4"><legend className="px-2 font-semibold">{mode === "HISTORICAL" ? "Previous role or activity" : "3. What you are doing now"}</legend>
    <div><label className="mb-2 block font-medium" htmlFor="career-status">{mode === "HISTORICAL" ? "Activity for this previous entry" : "Main current activity"}</label><select id="career-status" aria-describedby="activity-help" required className={control} value={status} onChange={event => setStatus(event.target.value)}><option value="" disabled>Choose your activity</option>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><p id="activity-help" className="mt-2 text-sm leading-6">Choose an activity, or choose “Prefer not to say”. Details about your work or study are optional.</p></div>
    {employed && <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-2 block" htmlFor="alumni-employer">Employer or business (optional)</label><input id="alumni-employer" className={control} maxLength={150} value={employer} onChange={event => setEmployer(event.target.value)} /></div><div><label className="mb-2 block" htmlFor="alumni-job">Job title or role (optional)</label><input id="alumni-job" className={control} maxLength={150} value={job} onChange={event => setJob(event.target.value)} /></div></div>}
    {employed && <ExtraSelect field="work_alignment" label="Does your work relate to your degree?" values={extra} onChange={changeExtra} choices={[["ALIGNED", "Yes"], ["PARTLY", "Partly"], ["NOT_ALIGNED", "No"], ["UNSURE", "Unsure / not applicable"]]} />}
    {status && status !== "PREFER_NOT_TO_SAY" && status !== "FURTHER_STUDY" && <label className="flex items-start gap-3 leading-6"><input type="checkbox" className="mt-1 h-5 w-5" checked={furtherStudy} onChange={event => setFurtherStudy(event.target.checked)} />I am also pursuing further study.</label>}
    {studying && <ExtraControls fields={studyFields.filter(([key]) => ["study_program", "study_institution"].includes(key))} values={extra} onChange={changeExtra} />}
    {employed && <details className="rounded-md border border-border p-4"><summary className="cursor-pointer font-semibold">More about this role (optional)</summary><div className="mt-4 space-y-4"><ExtraControls fields={workFields} values={extra} onChange={changeExtra} /><ExtraSelect field="work_arrangement" label="Work arrangement" values={extra} onChange={changeExtra} choices={[["ONSITE", "On-site"], ["REMOTE", "Remote"], ["HYBRID", "Hybrid"]]} /></div></details>}
    <details className="rounded-md border border-border p-4"><summary className="cursor-pointer font-semibold">Program feedback and exams (optional)</summary><div className="mt-4 space-y-4"><ExtraControls fields={studyFields.filter(([key]) => ["exam_details", "program_feedback"].includes(key))} values={extra} onChange={changeExtra} /><ExtraSelect field="exam_status" label="Licensure or eligibility exam status" values={extra} onChange={changeExtra} choices={[["PASSED", "Passed"], ["NOT_PASSED", "Not passed"], ["NOT_TAKEN", "Not taken / not applicable"]]} /></div></details>
    </fieldset>}
    <details className="rounded-md border border-border p-4"><summary className="cursor-pointer font-semibold">More graduate details (optional)</summary><p className="my-4 text-sm leading-6">Add these only if you wish; your full name and graduation year are enough for the basic update.</p><ExtraControls fields={contactFields.filter(([key]) => !["residence_city", "residence_country"].includes(key))} values={extra} onChange={changeExtra} /><div className="mt-4"><ExtraSelect field="sex" label="Sex (for the graduate tracing form)" values={extra} onChange={changeExtra} choices={[["M", "Male"], ["F", "Female"], ["OTHER", "Another description"], ["UNDISCLOSED", "Prefer not to say"]]} /></div></details>
    <fieldset className="space-y-3 rounded-md border border-border p-4"><legend className="px-2 font-semibold">Stay connected — optional choices</legend>

      <label className="flex items-start gap-3 leading-6"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-primary" checked={updates} onChange={event => setUpdates(event.target.checked)} />The department may contact me about alumni opportunities, events, and occasional career updates.</label>
      <label className="flex items-start gap-3 leading-6"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-primary" checked={mentor} onChange={event => setMentor(event.target.checked)} />I am willing to be contacted about mentoring or supporting students.</label>
      <details><summary className="cursor-pointer font-semibold">Learning interests and ways to connect (optional)</summary><div className="mt-4 space-y-4"><div><label className="mb-2 block" htmlFor="alumni-interests">Learning interests (optional)</label><textarea id="alumni-interests" className={control} rows={3} maxLength={500} value={interests} onChange={event => setInterests(event.target.value)} /></div><ExtraControls fields={networkFields} values={extra} onChange={changeExtra} /></div></details>
    </fieldset>
    <details id="alumni-privacy-notice" className="rounded-md border border-border p-4"><summary className="cursor-pointer font-semibold">Privacy notice — read before saving</summary><p className="mt-2 whitespace-pre-line leading-7">{config.privacy_notice}</p><p className="mt-2 text-sm">Notice version: {config.notice_version} · {config.retain_indefinitely ? "Records and career history have no automatic expiry." : `Retention: ${config.retention_days} days after your last update.`}</p><p className="mt-3 text-sm">For corrections, account recovery or deletion requests, contact {config.contact_label}{config.contact_email && <> at <a className="text-link break-all" href={`mailto:${config.contact_email}`}>{config.contact_email}</a></>}.</p></details>
    <label className="flex items-start gap-3 leading-6"><input type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-primary" checked={consent} onChange={event => setConsent(event.target.checked)} />I have read the privacy notice, agree to the department processing these details for the stated purposes, and confirm that my details are accurate.</label>
    <button type="submit" className="action-link disabled:opacity-50" disabled={busy || !consent || !config.accepting_updates}>{busy ? "Saving your update…" : registration ? "Create my private alumni account" : "Save my private alumni update"}</button>
  </form>;
}
