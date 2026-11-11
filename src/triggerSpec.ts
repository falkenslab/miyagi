/** When an automatic action runs (action-triggers #108): its `trigger:` and when a schedule is due. */

export type Trigger = { kind: "daily"; hour: number; minute: number } | { kind: "weekly"; day: number; hour: number; minute: number } | { kind: "event"; event: TriggerEvent };
export const TRIGGER_EVENTS = ["draft.published", "submission.new", "post.new"] as const;
export type TriggerEvent = (typeof TRIGGER_EVENTS)[number];
const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** `daily 07:30`, `weekly mon 08:00`, `on draft.published`; an error's text otherwise. */
export function parseTrigger(text: string): Trigger | string {
  const value = text.trim().toLowerCase();
  const time = (hh: string, mm: string) => (Number(hh) < 24 && Number(mm) < 60 ? { hour: Number(hh), minute: Number(mm) } : null);
  let match = /^daily (\d{1,2}):(\d{2})$/.exec(value);
  if (match) return time(match[1]!, match[2]!) ? { kind: "daily", ...time(match[1]!, match[2]!)! } : "the time is HH:MM";
  match = /^weekly ([a-z]{3}) (\d{1,2}):(\d{2})$/.exec(value);
  if (match) {
    const day = DAYS.indexOf(match[1]!);
    if (day < 0) return `the day is one of ${DAYS.join(", ")}`;
    return time(match[2]!, match[3]!) ? { kind: "weekly", day, ...time(match[2]!, match[3]!)! } : "the time is HH:MM";
  }
  match = /^on ([a-z]+\.[a-z]+)$/.exec(value);
  if (match && (TRIGGER_EVENTS as readonly string[]).includes(match[1]!)) return { kind: "event", event: match[1] as TriggerEvent };
  return `"${text}": use "daily HH:MM", "weekly mon HH:MM" or "on ${TRIGGER_EVENTS.join(" | ")}"`;
}

/** The last time a schedule was due, at or before `now`. */
export function lastDue(trigger: Trigger, now: Date): Date | null {
  if (trigger.kind === "event") return null;
  const at = new Date(now);
  at.setHours(trigger.hour, trigger.minute, 0, 0);
  if (trigger.kind === "weekly") at.setDate(at.getDate() - ((at.getDay() - trigger.day + 7) % 7));
  if (at > now) at.setDate(at.getDate() - (trigger.kind === "weekly" ? 7 : 1));
  return at;
}

