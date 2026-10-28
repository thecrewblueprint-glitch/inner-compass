/**
 * Offline calendar export of generic, original Inner Compass reflection prompts.
 *
 * A pure function: no remote requests, personal journal/categories, birth data,
 * telemetry or implicit writes to Google/Apple/Outlook. The existing app's
 * age/launch gate remains authoritative; this file registers NO public endpoint.
 */
const ORIGINAL_PROMPTS = [
  'Notice one small thing you can approach with patience today.',
  'Consider what is within your influence and what is not.',
  'Give a moment of attention to a useful habit.',
  'Reflect on a question without requiring an immediate answer.',
  'Name one practical choice that aligns with your values.',
  'Allow room for uncertainty while staying curious.',
  'Consider a helpful way to treat others with respect.',
] as const;

function dateOnly(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function validateStart(date: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Expected YYYY-MM-DD');
  const parsed = new Date(date + 'T00:00:00.000Z');
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error('Invalid calendar date');
  }
  return parsed;
}

function escapeIcs(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n')
    .replace(/,/g, '\\,').replace(/;/g, '\\;');
}

export interface ReflectionCalendarOptions {
  startDate: string; // ISO Gregorian date, explicit and time-zone-independent
  days?: number; // 1 to 365, finite; no recurrence or auto-renewal
}

export function buildReflectionCalendar({ startDate, days = 30 }: ReflectionCalendarOptions): string {
  const start = validateStart(startDate);
  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new Error('Calendar day count must be an integer from 1 to 365');
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Inner Compass//Original Reflection Calendar 1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Inner Compass - Daily Reflection (Optional)',
    'X-WR-CALDESC:General educational reflection prompts; no personal data.',
  ];

  for (let i = 0; i < days; i += 1) {
    // UTC noon math followed by a date-only entry: DST and travel cannot shift a day.
    const day = new Date(start.getTime() + i * 86400000);
    const next = new Date(day.getTime() + 86400000);
    const calendarDay = dateOnly(day);
    lines.push(
      'BEGIN:VEVENT',
      `UID:ic-reflection-v1-${calendarDay}@inner-compass.invalid`,
      'DTSTAMP:20261028T000000Z',
      `DTSTART;VALUE=DATE:${calendarDay}`,
      `DTEND;VALUE=DATE:${dateOnly(next)}`,
      'SUMMARY:Inner Compass - Daily Reflection',
      `DESCRIPTION:${escapeIcs(ORIGINAL_PROMPTS[i % ORIGINAL_PROMPTS.length])}`,
      'TRANSP:TRANSPARENT',
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
