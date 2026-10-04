/** Suppress the keyboard test values currently present in the department profile. */
export function departmentProfileText(value?: string | null): string | undefined {
  const text = value?.trim();
  if (!text || /^[asdf]{6,}$/i.test(text)) return undefined;
  return text;
}
