/** Content and provenance integrity checks for the six-volume public wellness library. */
import {
  WELLNESS_JOURNEY, WELLNESS_PRACTICES, WELLNESS_SOURCES, WELLNESS_TRADITIONS,
} from '../../src/data/wellnessGuide';
import { VOLUME_DIRECTORY, WELLNESS_VOLUMES } from '../../src/data/wellnessVolumes';
import { readFileSync } from 'node:fs';

const failures: string[] = [];
const check = (ok: boolean, why: string) => { if (!ok) failures.push(why); };
const sourceIds = new Set(WELLNESS_SOURCES.map((s) => s.id));
const seenIds = new Set<string>();

check(WELLNESS_SOURCES.length === 24, 'Volume I reference count must remain 24 or be deliberately revised');
check(sourceIds.size === WELLNESS_SOURCES.length, 'Source IDs must be unique');
for (const source of WELLNESS_SOURCES) {
  check(/^https:\/\//.test(source.url), `Invalid research URL: ${source.id}`);
  check(Boolean(source.publisher && source.title), `Incomplete reference: ${source.id}`);
}
check(WELLNESS_TRADITIONS.length === 12, 'Expected 12 distinct introductory traditions');
check(WELLNESS_PRACTICES.length === 18, 'Expected 18 introductory practices');
check(WELLNESS_JOURNEY.length === 21, 'Expected 21 optional days');
for (const item of [...WELLNESS_TRADITIONS, ...WELLNESS_PRACTICES]) {
  check(sourceIds.has(item.source), `Introductory content references missing source ${item.source}`);
}

check(VOLUME_DIRECTORY.length === 6, 'All six volumes must be represented in navigation');
check(WELLNESS_VOLUMES.length === 5, 'Expected five advanced volumes');
let chapters = 0;
let exercises = 0;
for (const v of WELLNESS_VOLUMES) {
  const directory = VOLUME_DIRECTORY.find((d) => d.id === v.id);
  check(Boolean(directory && directory.title === v.title), `Volume ${v.id} has no matching directory entry`);
  check(v.chapters.length >= 4, `Volume ${v.id} has too few authored chapters`);
  check(v.exercises.length >= 4, `Volume ${v.id} has too few optional exercises`);
  check(Boolean(v.introduction && v.editorialNote), `Volume ${v.id} missing framing or caution`);
  for (const chapter of v.chapters) {
    chapters++;
    check(!seenIds.has(chapter.id), `Repeated chapter ID ${chapter.id}`);
    seenIds.add(chapter.id);
    check(Boolean(chapter.title && chapter.discussion && chapter.furtherReading && chapter.reflection && chapter.caution),
      `Missing complete content in chapter ${chapter.id}`);
    check(chapter.sources.length > 0, `Missing chapter references: ${chapter.id}`);
    for (const id of chapter.sources) check(sourceIds.has(id), `Chapter ${chapter.id} cites unknown ${id}`);
  }
  for (const exercise of v.exercises) {
    exercises++;
    check(Boolean(exercise.name && exercise.instructions && exercise.context), `Incomplete exercise in ${v.id}`);
    check(exercise.sources.length > 0, `Unreferenced exercise ${exercise.name}`);
    for (const id of exercise.sources) check(sourceIds.has(id), `Exercise ${exercise.name} cites unknown ${id}`);
  }
}
check(chapters === 28, `Expected 28 complete extended chapters, received ${chapters}`);
check(exercises === 22, `Expected 22 extended exercises, received ${exercises}`);

const sourceText = [
  readFileSync('src/data/wellnessGuide.ts','utf-8'),
  readFileSync('src/data/wellnessVolumes.ts','utf-8'),
];
check(!sourceText.some((s) => /github\.com\/[^'\s]*\/Personality(?:\/|\b)/i.test(s)),
  'Private Personality GitHub repository URL found in public data');
check(!sourceText.some((s) => /api\.(?:openai|anthropic)\.com|fetch\s*\(/i.test(s)),
  'Unexpected remote model/API code in wellness content');

if (failures.length) {
  for (const failure of failures) console.error('FAIL: ' + failure);
  process.exit(1);
}
console.log(`PASS: 6 volumes, ${chapters} extended chapters, ${exercises} extended exercises, 24 cited public sources; no private-repository URL or provider API.`);
