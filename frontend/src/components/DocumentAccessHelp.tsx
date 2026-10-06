import { departmentIdentity } from "@/content/siteContent";

export function DocumentAccessHelp({ context = "a website document or form" }: { context?: string }) {
  const subject = encodeURIComponent("Help accessing " + context);
  const body = encodeURIComponent("Document or form name:\nProgram (BSCA or MSCA, if applicable):\nInformation or task I need help with:\nPreferred format:\nRelevant date (if any):\n");
  return <div className="mt-6 max-w-3xl rounded-md border border-border p-5">
    <p className="font-semibold text-primary">Need help with a document?</p>
    <p className="mt-2 leading-7">Some supplied PDFs, Word templates and image forms may be difficult to read or complete with assistive technology. If a download does not work for you, ask the department for the information or assistance in a format you can use. Include the document name, your program and the task you need to complete.</p>
    <a className="text-link mt-3 inline-flex min-h-11 items-center" href={`mailto:${departmentIdentity.email}?subject=${subject}&body=${body}`}>Request document access assistance</a>
    <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">Email opens your email app. You can also write to {departmentIdentity.email}.</p>
  </div>;
}
