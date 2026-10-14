export type CalendarEntry = { id: string; kind: "events" | "deadlines" | "conferences"; label: string; title: string; summary: string; href: string; starts_on: string; ends_on: string; starts_at: string; location: string; status: string };
export type CalendarResponse = { today: string; timezone: string; results: CalendarEntry[] };
