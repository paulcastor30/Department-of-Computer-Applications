export function calendarDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila"}).format(new Date(`${value}T00:00:00+08:00`));
}
