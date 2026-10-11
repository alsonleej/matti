export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatTimeValue(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatReadyLabel(date: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function defaultReadyAt(now = new Date()) {
  const next = new Date(now.getTime() + 20 * 60 * 1000);
  next.setSeconds(0, 0);
  next.setMilliseconds(0);
  const remainder = next.getMinutes() % 5;
  if (remainder !== 0) {
    next.setMinutes(next.getMinutes() + (5 - remainder));
  }
  return next;
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function parseTimeValue(value: string, now = new Date()) {
  const trimmed = value.trim().replace(".", ":");
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours > 23 ||
    minutes > 59
  ) {
    return null;
  }

  const date = new Date(now);
  date.setHours(hours, minutes, 0, 0);
  if (date.getTime() < now.getTime() - 60 * 1000) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

export function formatReadyBy(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
