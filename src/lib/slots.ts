export type ReadySlot = {
  iso: string;
  label: string;
  dayLabel: string;
  timeLabel: string;
};

const SLOT_TIMES = [
  { hour: 11, minute: 30 },
  { hour: 12, minute: 0 },
  { hour: 12, minute: 30 },
  { hour: 13, minute: 0 },
  { hour: 15, minute: 0 },
  { hour: 16, minute: 30 },
] as const;

const LEAD_MINUTES = 15;

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function dayLabelFor(date: Date, now: Date) {
  const today = startOfDay(now).getTime();
  const that = startOfDay(date).getTime();
  const diffDays = Math.round((that - today) / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

export function getReadySlots(now = new Date()): ReadySlot[] {
  const leadMs = LEAD_MINUTES * 60 * 1000;
  const slots: ReadySlot[] = [];

  for (let dayOffset = 0; dayOffset < 2; dayOffset += 1) {
    for (const { hour, minute } of SLOT_TIMES) {
      const date = new Date(now);
      date.setDate(now.getDate() + dayOffset);
      date.setHours(hour, minute, 0, 0);

      if (date.getTime() - now.getTime() < leadMs) continue;

      const dayLabel = dayLabelFor(date, now);
      const timeLabel = formatTime(date);

      slots.push({
        iso: date.toISOString(),
        dayLabel,
        timeLabel,
        label: `${dayLabel} · ${timeLabel}`,
      });
    }
  }

  return slots.slice(0, 8);
}

export function formatReadyBy(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
