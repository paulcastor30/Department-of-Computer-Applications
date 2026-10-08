const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

function resolveAPIUrl(url: string) {
  if (/^https?:\/\//.test(url)) {
    return url;
  }

  if (API_BASE_URL.endsWith("/api") && url.startsWith("/api/")) {
    return `${API_BASE_URL}${url.slice(4)}`;
  }

  return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(resolveAPIUrl(url), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export class FormDownloadError extends Error {
  constructor(message: string, public fields: Record<string, string> = {}) {
    super(message);
  }
}

export async function prepareFormPDF(url: string, values: Record<string, string>): Promise<Blob> {
  const response = await fetch(resolveAPIUrl(url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    cache: "no-store",
    credentials: "omit",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new FormDownloadError(error.detail || "The PDF could not be prepared. Please try again.", error.fields || {});
  }
  if (!response.headers.get("Content-Type")?.startsWith("application/pdf")) {
    throw new FormDownloadError("The PDF could not be prepared. Please try again.");
  }
  return response.blob();
}
