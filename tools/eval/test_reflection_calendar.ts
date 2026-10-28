/**
 * Offline assertion harness; run with npx tsx tools/eval/test_reflection_calendar.ts.
 * No network, calendar providers, personal storage or direct user writes.
 */
import assert from 'node:assert/strict';
import { buildReflectionCalendar } from '../../src/services/reflectionCalendar';

const first = buildReflectionCalendar({ startDate: '2026-10-28', days: 30 });
assert.equal(first, buildReflectionCalendar({ startDate: '2026-10-28', days: 30 }));
assert.equal((first.match(/BEGIN:VEVENT/g) || []).length, 30);
assert.equal((first.match(/END:VEVENT/g) || []).length, 30);
assert.match(first, /DTSTART;VALUE=DATE:20261028/);
assert.match(first, /DTEND;VALUE=DATE:20261127/);
assert.match(first, /UID:ic-reflection-v1-20261028@inner-compass\.invalid/);
assert.ok(!/(saved_reflections|birth|email|personalized|localStorage)/i.test(first));
assert.ok(!first.includes('http://') && !first.includes('https://'));
assert.ok(first.endsWith('END:VCALENDAR\r\n'));
const dst = buildReflectionCalendar({ startDate: '2026-10-31', days: 5 });
assert.match(dst, /DTSTART;VALUE=DATE:20261101/); // DST fallback cannot shift a date
assert.equal((dst.match(/BEGIN:VEVENT/g) || []).length, 5);
for (const bad of [
  { startDate: '2026-02-30', days: 5 },
  { startDate: '2026-01-01', days: 0 },
  { startDate: '2026-01-01', days: 366 },
  { startDate: 'bad-date', days: 5 },
]) {
  assert.throws(() => buildReflectionCalendar(bad));
}
console.log('Original reflection calendar: deterministic, 30 events, stable UIDs, DST-safe dates, invalid-input guards PASS');
