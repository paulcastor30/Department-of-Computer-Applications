import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlumniTraceForm, type AlumniSaved } from "@/components/AlumniTraceForm";
import { alumniRequest } from "@/lib/api";
import type { AlumniConfiguration, AlumniProfile } from "@/hooks/useAlumni";

const control = "min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";


export function AlumniUpdateForm({ config }: { config: AlumniConfiguration }) {
  const [accessMode, setAccessMode] = useState<"register" | "access" | "email">("register");
  const [accessKey, setAccessKey] = useState("");
  const [issuedKey, setIssuedKey] = useState<{ key: string; email: string } | null>(null);
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
        setSession(""); setProfile(null); setCompleted(false); setMessage(""); setIssuedKey(null);
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

  function saved(result: AlumniSaved) {
    setMessage(result.detail); setCompleted(true); setSession(""); setProfile(null);
    if (result.access_key && result.email) setIssuedKey({ key: result.access_key, email: result.email });
  }

  async function accessAccount(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await alumniRequest<{ session_token: string; email: string; profile: AlumniProfile }>("access", { email, access_key: accessKey });
      setSession(result.session_token); setVerifiedEmail(result.email); setProfile(result.profile); setAccessKey("");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Account access failed."); }
    finally { setBusy(false); }
  }

  function downloadKey() {
    if (!issuedKey) return;
    const blob = new Blob([`DCA private alumni account\nEmail: ${issuedKey.email}\nAccess key: ${issuedKey.key}\nReturn to: ${window.location.origin}/alumni\nKeep this file private. Contact the department chairperson for recovery.\n`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "my-private-alumni-access-key.txt"; anchor.click();
    URL.revokeObjectURL(url);
  }

  return <div id="alumni-update" className="scroll-mt-24 rounded-md border border-border bg-background p-5 sm:p-7">
    <h2 className="text-2xl font-semibold">Update my alumni details</h2>
    <p className="mt-3 max-w-prose leading-7 text-muted-foreground">For BSCA and MSCA graduates, including alumni of both programs. Use an email address you can still access. Your profile is private; your contact details and career information will not appear on the public website.</p>
    {!config.accepting_updates && <p className="notice mt-5" role="status">Online alumni updates are not open yet. For contact updates or questions, contact {config.contact_label}.</p>}
    {error && <p className="notice mt-4" role="alert">{error}</p>}
    {message && <p className="notice mt-4" role="status">{message}</p>}
    {completed ? <div className="mt-5 space-y-4">
      {issuedKey && <div className="rounded-md border-2 border-primary p-5"><h3 className="text-xl font-semibold">Save your private access key now</h3><p className="mt-3 leading-7">It is shown only once. Keep it in a password manager or download the private file. Anyone with your email and key can access your record.</p><code className="mt-4 block break-all rounded-md bg-muted p-4">{issuedKey.key}</code><button className="outline-link mt-4" onClick={downloadKey}>Download my access key</button></div>}
      <p className="leading-7">Your account and earlier career entries are retained without automatic expiry under the department's selected policy. Contact the chairperson for corrections, recovery, or deletion requests.</p>
      <button className="outline-link" onClick={() => { setCompleted(false); setIssuedKey(null); setMessage(""); setAccessMode("access"); }}>Return to my account</button>
    </div> : session ? <AlumniTraceForm config={config} email={verifiedEmail} profile={profile} session={session} onSaved={saved} /> : emailToken ? <div className="mt-5">
      <p className="leading-7">Your email link is ready. Continue to open your private update form. It can be used once and expires 30 minutes after it was requested.</p>
      <button className="action-link mt-4 disabled:opacity-50" disabled={busy || !config.accepting_updates} onClick={() => void verifyLink()}>{busy ? "Opening your form…" : "Verify email and continue"}</button>
    </div> : config.access_keys_enabled && config.accepting_updates && accessMode !== "email" ? <div className="mt-6">
      <div className="flex flex-wrap gap-3" aria-label="Alumni account options"><button className="outline-link" aria-pressed={accessMode === "register"} onClick={() => { setAccessMode("register"); setError(""); }}>New alumni account</button><button className="outline-link" aria-pressed={accessMode === "access"} onClick={() => { setAccessMode("access"); setError(""); }}>Return to my account</button>{config.email_links_available && <button className="outline-link" onClick={() => setAccessMode("email")}>Use an email link</button>}</div>
      {accessMode === "register" ? <AlumniTraceForm config={config} email="" profile={null} session="" registration onSaved={saved} /> : <form className="mt-5 max-w-xl space-y-4" onSubmit={event => void accessAccount(event)}>
        <div><label htmlFor="access-email" className="mb-2 block font-medium">Registered email address</label><input id="access-email" className={control} type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} /></div>
        <div><label htmlFor="access-key" className="mb-2 block font-medium">Private access key</label><input id="access-key" className={control} type="password" autoComplete="current-password" required minLength={40} maxLength={100} value={accessKey} onChange={event => setAccessKey(event.target.value)} /></div>
        <button className="action-link disabled:opacity-50" disabled={busy}>{busy ? "Opening your account…" : "Open my private account"}</button>
        <p className="text-sm leading-6">Your editing session lasts 30 minutes. If you lost your key, contact the chairperson; staff must confirm your identity before issuing a replacement.</p>
      </form>}
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
      {!config.retain_indefinitely && config.retention_days && <p className="mt-3 text-sm">Configured retention: {config.retention_days} days after your last alumni update.</p>}
      {config.retain_indefinitely && <p className="mt-3 leading-7">Accounts and career history are retained with no automatic expiry. You may contact the chairperson about correction or deletion.</p>}
      <p className="mt-3 leading-7">Contact: {config.contact_label}. {config.contact_email ? <a className="text-link break-all" href={`mailto:${config.contact_email}?subject=Alumni%20contact%20or%20privacy%20request`}>{config.contact_email}</a> : <Link className="text-link" to="/about/contact">Contact the department and ask for the chairperson</Link>}.</p>
    </details>
  </div>;
}
