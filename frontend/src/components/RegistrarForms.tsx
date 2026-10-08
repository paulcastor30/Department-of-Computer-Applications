import { FormSearch } from "@/components/FormSearch";
import { matchesFormQuery } from "@/lib/formSearch";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRegistrarForms } from "@/hooks/useAcademics";
import { DocumentFormFill } from "@/components/ThesisFormFill";

export function RegistrarForms() {
  const [query, setQuery] = useState("");
  const { data, isPending, isError, refetch } = useRegistrarForms();
  const { hash } = useLocation();
  useEffect(() => {
    if (data && hash === "#registrar-forms") document.getElementById("registrar-forms")?.scrollIntoView();
  }, [data, hash]);
  return <>
    <p className="max-w-prose leading-7 text-muted-foreground">Download the original Word form, or enter your details online to prepare a filled PDF. Confirm the applicable form and submission requirements with the Registrar. Downloading a form does not submit a request.</p>
    {isPending && <p role="status" className="mt-5">Loading registrar forms…</p>}
    {isError && <div className="notice mt-5"><p role="alert">Registrar forms could not be loaded. Please try again.</p><button type="button" className="outline-link mt-3" onClick={() => void refetch()}>Retry loading registrar forms</button></div>}
    {data?.length === 0 && <p role="status" className="mt-5">Registrar forms are currently unavailable. Contact the department for assistance.</p>}
    {Boolean(data?.length) && <FormSearch label="Find a registrar form" hint="Search by task or form number, such as leave, shifters, transcript or 006." query={query} onChange={setQuery} count={data?.filter(form => matchesFormQuery(`RGTR ${form.form_id} ${form.title}`, query)).length || 0} />}
    <ul className="mt-6 space-y-5">{data?.map(form => <li key={form.form_id} hidden={!matchesFormQuery(`RGTR ${form.form_id} ${form.title}`, query)} className="rounded-md border border-border bg-background p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-primary">{form.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">Registrar · RGTR-{form.form_id}</p>
      {form.note && <p className="mt-3 text-sm leading-6 text-muted-foreground">{form.note}</p>}
      {form.href && <a className="text-link mt-3 inline-flex min-h-11 items-center" href={form.href} download>Download blank Word form<span className="sr-only"> — {form.title}</span></a>}
      {form.fillable_form_id && <DocumentFormFill key={`REGISTRAR-${form.fillable_form_id}`} programCode="REGISTRAR" formId={form.fillable_form_id} label={form.title} />}
    </li>)}</ul>
  </>;
}
