import { useId } from "react";

export function FormSearch({ label, hint, query, onChange, count }: { label: string; hint: string; query: string; onChange: (value: string) => void; count: number }) {
  const id = useId();
  return <div className="my-5 max-w-3xl">
    <label htmlFor={`${id}-search`} className="block font-semibold text-primary">{label}</label>
    <p id={`${id}-help`} className="mt-2 text-sm leading-6 text-muted-foreground">{hint} Searching keeps your open form entries.</p>
    <div className="mt-3 flex flex-wrap gap-3">
      <input id={`${id}-search`} type="search" value={query} onChange={event => onChange(event.target.value)} aria-describedby={`${id}-help`} className="min-h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-base" />
      {query && <button type="button" className="outline-link" onClick={() => { onChange(""); document.getElementById(`${id}-search`)?.focus(); }}>Clear search</button>}
    </div>
    {query && <p role="status" className="mt-3 leading-7">{count ? `${count} matching ${count === 1 ? "form" : "forms"}.` : "No matching forms. Try a shorter word or the form number, or clear the search to see all forms."}</p>}
  </div>;
}
