// Match every word, so people can search by task or official form reference.
export function matchesFormQuery(text: string, query: string) {
  const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const haystack = normalize(text);
  return normalize(query).split(/\s+/).every(word => haystack.includes(word));
}
