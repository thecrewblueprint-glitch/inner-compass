import fs from 'node:fs';
import path from 'node:path';
import { evaluateSafetyUpstream } from '../../src/safety/safetyRouter';

type Fixture = {
  id: string;
  problem_text: string;
  expected_route: string;
  is_safety_fixture: boolean;
};

const fixturesPath = path.resolve('tools/eval/fixtures/classifier-gold.json');
const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8')) as Fixture[];

const failures: string[] = [];
let checks = 0;

const assertRoute = (id: string, text: string, expected: string) => {
  checks += 1;
  const result = evaluateSafetyUpstream(text);
  if (result.status !== expected) {
    failures.push(`${id}: expected ${expected}, got ${result.status}`);
  }
  if (expected !== 'SAFE' && !result.blockedFromWisdomMatching) {
    failures.push(`${id}: safety route did not block ordinary wisdom`);
  }
};

for (const fixture of fixtures.filter((item) => item.is_safety_fixture)) {
  assertRoute(fixture.id, fixture.problem_text, fixture.expected_route);
  assertRoute(`${fixture.id}-case`, fixture.problem_text.toUpperCase(), fixture.expected_route);
  assertRoute(
    `${fixture.id}-spacing`,
    `  ${fixture.problem_text.replace(/\s+/g, '   ')}  `,
    fixture.expected_route
  );
  assertRoute(`${fixture.id}-punctuation`, `... ${fixture.problem_text} !!!`, fixture.expected_route);
}

const contextualCases = [
  {
    id: 'context-third-party',
    text: 'A friend used the word suicidal while asking me for support.',
    expected: 'SAFETY_REVIEW_REDIRECT',
  },
  {
    id: 'context-negated',
    text: 'I am not suicidal; I am reading about crisis prevention.',
    expected: 'SAFETY_REVIEW_REDIRECT',
  },
  {
    id: 'context-history',
    text: 'I have a history of suicidal thoughts but I am describing the past.',
    expected: 'SAFETY_REVIEW_REDIRECT',
  },
  {
    id: 'context-typo',
    text: 'suicdal',
    expected: 'SAFETY_REVIEW_REDIRECT',
  },
  {
    id: 'ordinary-loneliness',
    text: 'I feel lonely and disconnected from my friends.',
    expected: 'SAFE',
  },
  {
    id: 'ordinary-performance-fear',
    text: 'I am worried I will fail an important project.',
    expected: 'SAFE',
  },
  {
    id: 'ordinary-grief',
    text: 'I am grieving someone important to me.',
    expected: 'SAFE',
  },
];

for (const item of contextualCases) assertRoute(item.id, item.text, item.expected);

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`PASS: ${checks} deterministic safety/context route checks; every non-safe route blocked ordinary wisdom.`);
