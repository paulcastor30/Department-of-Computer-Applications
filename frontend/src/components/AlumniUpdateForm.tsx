import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { alumniRequest } from "@/lib/api";
import type { AlumniConfiguration, AlumniProfile } from "@/hooks/useAlumni";

const control = "min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";
const statuses = [["EMPLOYED", "Employed"], ["SELF_EMPLOYED", "Self-employed"], ["FURTHER_STUDY", "Further study"], ["SEEKING_WORK", "Seeking work"], ["OTHER", "Other activities"], ["PREFER_NOT_TO_SAY", "Prefer not to say"]];

export function AlumniUpdateForm({ config }: { config: AlumniConfiguration }) {
  const [emailToken, setEmailToken] = useState("");
  const [session, setSession] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [email, setEmail] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [profile, setProfile] = useState<AlumniProfile | null>(null);

  useEffect(() => {
    function readLink() {
      const prefix = "#alumni-token=";
      if (window.location.hash.startsWith(prefix)) {
        const token = window.location.hash.slice(prefix.length);
        window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#alumni-update`);
        setSession(""); setProfile(null); setCompleted(false); setMessage("");
        if (/^[A-Za-z0-9_-]{40,100}$/.test(token)) { setEmailToken(token); setError(""); }
        else setError("This email link is invalid. Please request a new one.");
      }
    }
    readLink();
    window.addEventListener("hashchange", readLink);
    return () => window.removeEventListener("hashchange", readLink);
  }, []);

  async function requestLink(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await alumniRequest<{ detail: string }>("request-link", { email });
      setMessage(result.detail);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Please try again later."); }
    finally { setBusy(false); }
  }

  async function verifyLink() {
    setBusy(true); setError("");
    try {
      const result = await alumniRequest<{ session_token: string; email: string; profile: AlumniProfile | null }>("verify-link", { token: emailToken });
      setSession(result.session_token); setVerifiedEmail(result.email); setProfile(result.profile); setEmailToken(""); setMessage("");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Please request a new link."); setEmailToken(""); }
    finally { setBusy(false); }
  }

  return <div id="alumni-update" className="scroll-mt-24 rounded-md border border-border bg-background p-5 sm:p-7">
    <h2 className="text-2xl font-semibold">Update my alumni details</h2>
    <p className="mt-3 max-w-prose leading-7 text-muted-foreground">For BSCA and MSCA graduates, including alumni of both programs. Use an email address you can still access. Your profile is private; your contact details and career information will not appear on the public website.</p>
    {!config.accepting_updates && <p className="notice mt-5" role="status">Online alumni updates are not open yet. For contact updates or questions, contact {config.contact_label}.</p>}
    {error && <p className="notice mt-4" role="alert">{error}</p>}
    {message && <p className="notice mt-4" role="status">{message}</p>}
    {completed ? <p className="mt-4 leading-7">Thank you for staying connected. To make another change, request a new email link. Contact the department chairperson if you need to correct your verified email address or request deletion.</p> : session ? <VerifiedAlumniForm config={config} email={verifiedEmail} profile={profile} session={session} onSaved={detail => { setMessage(detail); setCompleted(true); setSession(""); setProfile(null); }} /> : emailToken ? <div className="mt-5">
      <p className="leading-7">Your email link is ready. Continue to open your private update form. It can be used once and expires 30 minutes after it was requested.</p>
      <button className="action-link mt-4 disabled:opacity-50" disabled={busy || !config.accepting_updates} onClick={() => void verifyLink()}>{busy ? "Opening your form…" : "Verify email and continue"}</button>
    </div> : <form className="mt-5 max-w-xl" onSubmit={event => void requestLink(event)}>
      <label htmlFor="alumni-email" className="mb-2 block font-medium">Your email address</label>
      <input id="alumni-email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={event => setEmail(event.target.value)} className={control} />
      <label className="mt-4 flex items-start gap-3 leading-6"><input type="checkbox" required checked={emailConsent} onChange={event => setEmailConsent(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-primary" />I understand that my email will be used to send a secure update link. Requesting a link does not subscribe me to announcements or publish my information.</label>
      <button className="action-link mt-5 disabled:opacity-50" type="submit" disabled={busy || !emailConsent || !config.accepting_updates}>{busy ? "Requesting your link…" : "Email me a secure update link"}</button>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">No new password is needed. Never share your link. After verification, you have 30 minutes to save your update; refreshing the form requires a new link.</p>
    </form>}
    <details className="mt-6 rounded-md border border-border p-4">
      <summary className="cursor-pointer font-semibold">Privacy notice and contact</summary>
      {config.privacy_notice ? <p className="mt-3 whitespace-pre-line leading-7">{config.privacy_notice}</p> : <p className="mt-3 leading-7">The department’s alumni privacy and retention notice is being prepared. Online submissions will remain closed until it is available.</p>}
      {config.retention_days && <p className="mt-3 text-sm">Configured retention: {config.retention_days} days after your last alumni update.</p>}
      <p className="mt-3 leading-7">Contact: {config.contact_label}. {config.contact_email ? <a className="text-link break-all" href={`mailto:${config.contact_email}?subject=Alumni%20contact%20or%20privacy%20request`}>{config.contact_email}</a> : <Link className="text-link" to="/about/contact">Contact the department and ask for the chairperson</Link>}.</p>
    </details>
  </div>;
}

function VerifiedAlumniForm({ config, email, profile, session, onSaved }: { config: AlumniConfiguration; email: string; profile: AlumniProfile | null; session: string; onSaved: (detail: string) => void }) {
  const [name, setName] = useState(profile?.full_name || "");
  const [bsca, setBsca] = useState(Boolean(profile?.bsca_year));
  const [msca, setMsca] = useState(Boolean(profile?.msca_year));
  const [bscaYear, setBscaYear] = useState(String(profile?.bsca_year || ""));
  const [mscaYear, setMscaYear] = useState(String(profile?.msca_year || ""));
  const [status, setStatus] = useState(profile?.career_status || "PREFER_NOT_TO_SAY");
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

  async function save(event: React.FormEvent) {
    event.preventDefault(); setError("");
    if (!bsca && !msca) { setError("Choose BSCA, MSCA, or both, and enter your graduation year."); return; }
    setBusy(true);
    try {
      const result = await alumniRequest<{ detail: string }>("profile", {
        full_name: name, bsca_year: bsca ? Number(bscaYear) : null, msca_year: msca ? Number(mscaYear) : null,
        career_status: status, employer: employed ? employer : "", job_title: employed ? job : "", interests,
        preferred_contact: contact, phone, receive_updates: updates, willing_to_mentor: mentor,
        consent, notice_version: config.notice_version,
      }, session);
      onSaved(result.detail);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Your details could not be saved."); }
    finally { setBusy(false); }
  }

  return <form className="mt-6 space-y-5" onSubmit={event => void save(event)}>
    <p className="break-all leading-7"><strong>Verified email:</strong> {email}</p>
    <p className="text-sm leading-6 text-muted-foreground">Name and graduation year are needed for affiliation review. Career details are optional. Employment, further study, and other activities are all welcome.</p>
    {error && <p className="notice" role="alert">{error}</p>}
    <div><label className="mb-2 block font-medium" htmlFor="alumni-name">Full name</label><input id="alumni-name" autoComplete="name" required maxLength={150} className={control} value={name} onChange={event => setName(event.target.value)} /></div>
    <fieldset className="rounded-md border border-border p-4">
      <legend className="px-2 font-semibold">Graduated program — choose one or both</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="flex min-h-11 items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-primary" checked={bsca} onChange={event => setBsca(event.target.checked)} />BSCA graduate</label>{bsca && <><label className="mb-2 block" htmlFor="bsca-year">BSCA graduation year</label><input id="bsca-year" type="number" min={1900} max={new Date().getFullYear()} required className={control} value={bscaYear} onChange={event => setBscaYear(event.target.value)} /></>}</div>
        <div><label className="flex min-h-11 items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-primary" checked={msca} onChange={event => setMsca(event.target.checked)} />MSCA graduate</label>{msca && <><label className="mb-2 block" htmlFor="msca-year">MSCA graduation year</label><input id="msca-year" type="number" min={1900} max={new Date().getFullYear()} required className={control} value={mscaYear} onChange={event => setMscaYear(event.target.value)} /></>}</div>
      </div>
    </fieldset>
    <div><label className="mb-2 block font-medium" htmlFor="career-status">Main current activity (optional)</label><select id="career-status" className={control} value={status} onChange={event => setStatus(event.target.value)}>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    {employed && <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-2 block" htmlFor="alumni-employer">Employer or business (optional)</label><input id="alumni-employer" className={control} maxLength={150} value={employer} onChange={event => setEmployer(event.target.value)} /></div><div><label className="mb-2 block" htmlFor="alumni-job">Job title or role (optional)</label><input id="alumni-job" className={control} maxLength={150} value={job} onChange={event => setJob(event.target.value)} /></div></div>}
    <div><label className="mb-2 block font-medium" htmlFor="alumni-interests">Skills or learning interests (optional)</label><textarea id="alumni-interests" className={control} rows={3} maxLength={500} placeholder="For example: IoT, research, software development, or further study" value={interests} onChange={event => setInterests(event.target.value)} /></div>
    <div className="grid gap-4 sm:grid-cols-2"><div><label className="mb-2 block font-medium" htmlFor="alumni-contact">Preferred contact method</label><select id="alumni-contact" className={control} value={contact} onChange={event => setContact(event.target.value)}><option value="EMAIL">Email</option><option value="PHONE">Phone</option></select></div><div><label className="mb-2 block font-medium" htmlFor="alumni-phone">Phone number ({contact === "PHONE" ? "required for phone contact" : "optional"})</label><input id="alumni-phone" type="tel" autoComplete="tel" required={contact === "PHONE"} className={control} maxLength={40} value={phone} onChange={event => setPhone(event.target.value)} /></div></div>
    <fieldset className="space-y-3 rounded-md border border-border p-4"><legend className="px-2 font-semibold">Stay connected — optional choices</legend>
      <label className="flex items-start gap-3 leading-6"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-primary" checked={updates} onChange={event => setUpdates(event.target.checked)} />The department may contact me about alumni opportunities, events, and occasional career updates.</label>
      <label className="flex items-start gap-3 leading-6"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-primary" checked={mentor} onChange={event => setMentor(event.target.checked)} />I am willing to be contacted about mentoring or supporting students.</label>
      <p className="text-sm leading-6 text-muted-foreground">You can change these choices with a new secure update link. Public stories and profiles would require separate permission.</p>
    </fieldset>
    <div className="rounded-md border border-border p-4"><h3 className="font-semibold">Read before saving</h3><p className="mt-2 whitespace-pre-line leading-7">{config.privacy_notice}</p><p className="mt-2 text-sm">Notice version: {config.notice_version} · Retention: {config.retention_days} days after your last update.</p></div>
    <label className="flex items-start gap-3 leading-6"><input type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-primary" checked={consent} onChange={event => setConsent(event.target.checked)} />I have read the privacy notice, agree to the department processing these details for the stated purposes, and confirm that my details are accurate.</label>
    <button type="submit" className="action-link disabled:opacity-50" disabled={busy || !consent || !config.accepting_updates}>{busy ? "Saving your update…" : "Save my private alumni update"}</button>
  </form>;
}
