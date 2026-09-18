import { validateKnowledgeBase, CANONICAL_CATEGORIES, KB_METADATA } from '../src/knowledgeBase/kbLoader';

export function runKbIntegrityTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  // Test 1: Full validation check
  const report = validateKnowledgeBase();
  results.push({
    name: 'KB Validation Report isValid === true',
    passed: report.isValid && report.errors.length === 0,
    error: report.errors.join('; '),
  });

  // Test 2: Exactly 25 categories
  results.push({
    name: 'Category Count is exactly 25',
    passed: CANONICAL_CATEGORIES.length === 25,
    error: `Found ${CANONICAL_CATEGORIES.length} categories`,
  });

  // Test 3: Exactly 75 total entries (3 per category)
  let totalEntries = 0;
  for (const cat of CANONICAL_CATEGORIES) {
    totalEntries += cat.entries.length;
  }
  results.push({
    name: 'Total entries count is exactly 75',
    passed: totalEntries === 75,
    error: `Found ${totalEntries} entries`,
  });

  // Test 4: All 3 pillars present in every category
  let allPillarsPresent = true;
  for (const cat of CANONICAL_CATEGORIES) {
    const pillars = new Set(cat.entries.map((e) => e.pillar));
    if (
      !pillars.has('eastern_philosophy') ||
      !pillars.has('shadow_work') ||
      !pillars.has('psychology_methodology')
    ) {
      allPillarsPresent = false;
    }
  }
  results.push({
    name: 'Every category contains all 3 distinct canonical pillars',
    passed: allPillarsPresent,
  });

  // Test 5: Metadata hard ceiling & escalation arrays match index.json
  const hasHardCeiling = KB_METADATA.hard_ceiling_categories.includes(10);
  const hasEscalations =
    KB_METADATA.escalation_candidate_categories.includes(21) &&
    KB_METADATA.escalation_candidate_categories.includes(24);
  results.push({
    name: 'Metadata registers Category 10 as Hard Ceiling and Categories 21 & 24 as Escalation Candidates',
    passed: hasHardCeiling && hasEscalations,
  });

  return results;
}
