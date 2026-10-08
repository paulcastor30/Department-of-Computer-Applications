import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { fetchJSON, FormDownloadError, prepareFormPDF } from "@/lib/api";
import { Input } from "@/components/ui/input";

type FormField = { key: string; label: string; max_length: number; multiline: boolean; choices?: { value: string; label: string }[] };
type FormSchema = { id: string; title: string; paper_size: string; filename: string; note?: string; fields: FormField[] };

export function ThesisFormFill({ programCode, formId, label }: { programCode: "BSCA" | "MSCA"; formId: string; label: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [schema, setSchema] = useState<FormSchema>();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);
  const endpoint = `/api/academics/forms/${programCode.toLowerCase()}/${formId}/`;

  useEffect(() => {
    if (!open || schema) return;
    let ignore = false;
    setLoading(true);
    setError("");
    fetchJSON<FormSchema>(endpoint).then(data => { if (!ignore) setSchema(data); })
      .catch(() => { if (!ignore) setError("This form could not be loaded. Close and reopen this section to try again, or download the blank Word form above."); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [endpoint, open, schema]);

  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setPdfUrl("");
    setBusy(true);
    try {
      const pdf = await prepareFormPDF(endpoint, values);
      setPdfUrl(URL.createObjectURL(pdf));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The PDF could not be prepared. Please try again.");
      if (cause instanceof FormDownloadError) setFieldErrors(cause.fields);
    } finally {
      setBusy(false);
    }
  }

  function change(key: string, value: string) {
    setValues(current => ({ ...current, [key]: value }));
    setPdfUrl("");
    setFieldErrors(current => { const next = { ...current }; delete next[key]; return next; });
  }

  return <div className="mt-3">
    <button type="button" className="outline-link text-left" aria-expanded={open} aria-controls={`${id}-editor`} onClick={() => setOpen(current => !current)}>
      {open ? "Close online form" : "Fill out online"}<span className="sr-only"> — {label}</span>
    </button>
    {open && <section id={`${id}-editor`} aria-labelledby={`${id}-title`} className="mt-4 rounded-md border border-border bg-background p-4 sm:p-6">
      <h4 id={`${id}-title`} className="text-lg font-semibold text-primary">Fill out {schema?.title || label}</h4>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Enter the details you know, then review and download a filled PDF. Entries are placed in the original blanks; the wording and page layout stay fixed. Signatures, approvals and assessments must be completed by the responsible people.</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Your entries are sent to the website only to prepare this download and are not saved. Downloading does not submit the form. {schema ? `Print on ${schema.paper_size} at actual size (100%).` : "Use the paper size specified once the form loads."} Existing images retain the quality of the original file.</p>
      {schema?.note && <p className="notice mt-4">{schema.note}</p>}
      {loading && <p className="mt-4" role="status">Loading form fields…</p>}
      {error && <p ref={errorRef} tabIndex={-1} role="alert" className="notice mt-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{error}{fieldErrors._form && ` ${fieldErrors._form}`}</p>}
      {schema && <form onSubmit={prepare} className="mt-5" aria-busy={busy}>
        <p className="mb-4 text-sm text-muted-foreground">All fields are optional. Leave unknown details blank. Long entries must fit the space provided in the original form.</p>
        <fieldset disabled={busy} className="space-y-5">
          <legend className="sr-only">Student details for {schema.title}</legend>
          {schema.fields.map(field => {
            const fieldId = `${id}-${field.key}`;
            const props = {
              id: fieldId, name: field.key, value: values[field.key] || "", maxLength: field.max_length,
              "aria-invalid": Boolean(fieldErrors[field.key]), "aria-describedby": `${fieldId}-help`,
              onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => change(field.key, event.target.value),
            };
            return <div key={field.key}>
              <label className="mb-2 block text-sm font-semibold text-primary" htmlFor={fieldId}>{field.label}</label>
              {field.choices ? <select {...props} className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{field.choices.map(choice => <option key={choice.value} value={choice.value}>{choice.label}</option>)}</select> : field.multiline ? <textarea {...props} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" /> : <Input {...props} />}
              <p id={`${fieldId}-help`} className={`mt-1 text-sm leading-6 ${fieldErrors[field.key] ? "font-semibold text-destructive" : "text-muted-foreground"}`}>{fieldErrors[field.key] || (field.choices ? "Select an option or leave the original box unmarked." : `Up to ${field.max_length} characters; the available printed space may require a shorter entry.`)}</p>
            </div>;
          })}
        </fieldset>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="action-link" type="submit" disabled={busy || !Object.values(values).some(value => value.trim())}>{busy ? "Preparing PDF…" : "Prepare filled PDF"}</button>
          <button className="outline-link" type="button" disabled={busy} onClick={() => { setValues({}); setFieldErrors({}); setError(""); setPdfUrl(""); }}>Clear entries</button>
        </div>
        {pdfUrl && <div className="mt-5 border-t border-border pt-5">
          <p role="status" className="leading-7">Your filled PDF is ready. Review every page, check any remaining selections and obtain the required signatures before submitting.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a className="outline-link" href={pdfUrl} target="_blank" rel="noopener noreferrer">Review filled PDF<span className="sr-only"> (opens in a new tab)</span></a>
            <a className="action-link" href={pdfUrl} download={schema.filename}>Download filled PDF</a>
          </div>
        </div>}
      </form>}
    </section>}
  </div>;
}
