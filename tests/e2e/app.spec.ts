import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SAFE_REFLECTION =
  'I feel deeply lonely and disconnected even when surrounded by friends and coworkers.';

test.describe('Inner Compass web app core flow', () => {
  test('loads, reflects locally, saves privately, and navigates core surfaces', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const guidanceRequests: string[] = [];
    const failedAppResponses: string[] = [];

    page.on('console', (msg) => {
      if (
        msg.type() === 'error' &&
        !msg.text().includes('Failed to load resource: the server responded with a status of 404')
      ) {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('request', (request) => {
      if (request.url().includes('/api/guidance')) guidanceRequests.push(request.url());
    });
    page.on('response', (response) => {
      if (
        response.status() >= 400 &&
        response.url().startsWith('http://127.0.0.1:3000')
      ) {
        failedAppResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');
    await expect(page.getByText('INNER COMPASS', { exact: true })).toBeVisible();
    await expect(page.getByText('PREVIEW MODE ACTIVE')).toBeVisible();
    await expect(page.getByText('What is weighing on your heart?')).toBeVisible();
    await expect(page.getByText('Daily Wisdom & Reflection')).toBeVisible();
    await expect(page.getByText("TODAY'S CANONICAL REFLECTION")).toBeVisible();

    const input = page.getByRole('textbox', { name: 'Problem Input' });
    await input.fill(SAFE_REFLECTION);
    await page.getByLabel('Submit Reflection').click();

    await expect(page.getByText('CATEGORY #1')).toBeVisible();
    await expect(page.getByText('GROUNDED AFFIRMATION')).toBeVisible();
    await expect(page.getByText('SOURCE-LINKED REFLECTION')).toBeVisible();
    expect(guidanceRequests).toEqual([]);

    await page.getByText('Bookmark Reflection').click();
    await expect(page.getByText('✓ Saved in Journal')).toBeVisible();

    const persisted = await page.evaluate(
      () => localStorage.getItem('inner_compass_saved_reflections_v1') || ''
    );
    expect(persisted).toContain('REDACTED_PRIVACY_RULE_7');
    expect(persisted).not.toContain(SAFE_REFLECTION);

    await page.getByText(/^Journal(?: \(\d+\))?$/).click();
    await expect(page.getByText('Bookmarked Wisdom & Affirmations')).toBeVisible();
    await page.getByLabel('Open wisdom for category 1').click();
    await expect(page.getByText('SOURCE-LINKED WISDOM LIBRARY')).toBeVisible();
    await expect(page.getByText('Showing wisdom linked to Category #1.')).toBeVisible();
    await expect(page.getByText(/Exact quotation intentionally withheld/).first()).toBeVisible();

    await page.getByText('Wisdom', { exact: true }).click();
    await expect(page.getByText(/71 records/)).toBeVisible();

    await page.getByText('Suggested Reads', { exact: true }).first().click();
    await expect(page.getByText('CURATED DIGITAL LIBRARY')).toBeVisible();
    await expect(page.getByText('Meditations', { exact: true }).first()).toBeVisible();

    await page.getByText('Privacy', { exact: true }).first().click();
    await expect(page.getByText('PRIVACY & LOCAL DATA')).toBeVisible();
    await expect(page.getByText('Your reflection stays on this device')).toBeVisible();

    await page.getByText('Taxonomy', { exact: true }).click();
    await expect(page.getByText('All 25 Categories')).toBeVisible();

    await page.getByText('Lifelines 24/7', { exact: true }).click();
    await expect(page.getByText('DEDICATED SAFETY & CRISIS ROUTING')).toBeVisible();
    await expect(page.getByText(/United States resources/)).toBeVisible();

    expect(pageErrors, `Uncaught page errors: ${pageErrors.join(' | ')}`).toEqual([]);
    expect(failedAppResponses, `Same-origin HTTP failures: ${failedAppResponses.join(' | ')}`).toEqual([]);
    expect(consoleErrors, `Console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
  });

  test('internal links connect guidance, reads, wisdom, and categories', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: 'Problem Input' });
    await input.fill(SAFE_REFLECTION);
    await page.getByLabel('Submit Reflection').click();
    await expect(page.getByText('CATEGORY #1')).toBeVisible();

    await page.getByLabel('Open wisdom for category 1').click();
    await expect(page.getByText('Showing wisdom linked to Category #1.')).toBeVisible();

    await page.getByText('Reflect', { exact: true }).click();
    await page.getByLabel('Open suggested reads for category 1').click();
    await expect(page.getByText('Showing reads linked to Category #1.')).toBeVisible();

    await page.getByText('Suggested Reads', { exact: true }).first().click();
    await expect(page.getByText('CURATED DIGITAL LIBRARY')).toBeVisible();

    await page.getByText('View details').first().click();
    await page.getByLabel('Open wisdom WIS-STOIC-MA-6-6').click();
    await expect(page.getByText('Showing wisdom linked to WIS-STOIC-MA-6-6.')).toBeVisible();

    await page.getByLabel('Suggested reads for WIS-STOIC-MA-6-6').click();
    await expect(page.getByText('Showing reads linked to wisdom record WIS-STOIC-MA-6-6.')).toBeVisible();
    await expect(page.getByText('Meditations', { exact: true }).first()).toBeVisible();
  });

  test('asks for clarification before showing guidance on ambiguous input', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: 'Problem Input' });
    await input.fill('I feel like everything is changing and slipping away from my hands.');
    await page.getByLabel('Submit Reflection').click();

    await expect(page.getByText('ONE DETAIL WOULD HELP')).toBeVisible();
    await expect(
      page.getByText(
        'Is this mainly about grieving something you have already lost, or fear and uncertainty about what may happen next?'
      )
    ).toBeVisible();

    await expect(page.getByText('GROUNDED AFFIRMATION')).toHaveCount(0);

    await input.fill(
      'I feel like everything is changing and slipping away from my hands. I am grieving because someone close to me passed away.'
    );
    await page.getByLabel('Submit Reflection').click();

    await expect(page.getByText('CATEGORY #2')).toBeVisible();
    await expect(page.getByText('GROUNDED AFFIRMATION')).toBeVisible();
  });

  test('direct taxonomy navigation cannot bypass Category 10 hard ceiling', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Taxonomy', { exact: true }).click();
    await page.getByText('Substance use', { exact: true }).click();
    await page.getByText('Reflect on this Category →').click();
    await expect(page.getByText('DEDICATED SAFETY & CRISIS ROUTING')).toBeVisible();
  });

  test('privacy controls clear local journal and personalization metadata', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('inner_compass_saved_reflections_v1', JSON.stringify([{ categoryId: 1 }]));
      localStorage.setItem('inner_compass_category_interactions_v1', JSON.stringify({ 1: { count: 1 } }));
    });
    await page.reload();
    await page.getByText('Privacy', { exact: true }).first().click();
    await page.getByText('Clear journal', { exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem('inner_compass_saved_reflections_v1'))).toBe('[]');
    await page.getByText('Clear personalization history', { exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem('inner_compass_category_interactions_v1'))).toBeNull();
  });

  test('back navigation returns exactly one page at a time', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Taxonomy', { exact: true }).click();
    await page.getByText('Loneliness / feeling isolated even around people', { exact: true }).click();
    await page.getByText('Reflect on this Category →', { exact: true }).click();
    await expect(page.getByText('CATEGORY #1')).toBeVisible();
    await page.getByLabel('Open wisdom for category 1').click();
    await expect(page.getByText('Showing wisdom linked to Category #1.')).toBeVisible();

    await page.getByLabel('Go back one page').click();
    await expect(page.getByText('CATEGORY #1')).toBeVisible();

    await page.getByLabel('Go back one page').click();
    await expect(page.getByText('All 25 Categories')).toBeVisible();

    await page.getByLabel('Go back one page').click();
    await expect(page.getByText('What is weighing on your heart?')).toBeVisible();
  });


  test('Suggested Reads exposes branch-complete deterministic browsing', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Suggested Reads', { exact: true }).first().click();
    await expect(page.getByText('CURATED DIGITAL LIBRARY')).toBeVisible();

    await page.getByText('Madhyamaka', { exact: true }).click();
    await expect(page.getByText('The Fundamental Wisdom of the Middle Way', { exact: true })).toBeVisible();

    await page.getByText('Madhyamaka', { exact: true }).click();
    await page.getByText('All branches', { exact: true }).click();
    await page.getByText('Shingon / esoteric Buddhism', { exact: true }).click();
    await expect(page.getByText('Kukai: Major Works', { exact: true })).toBeVisible();

    await page.getByText('Shingon / esoteric Buddhism', { exact: true }).click();
    await page.getByText('All branches', { exact: true }).click();
    await page.getByText('Sikh philosophy / theology', { exact: true }).click();
    await expect(page.getByText('Sikhism: A Very Short Introduction', { exact: true })).toBeVisible();
  });


  test('legal center is prominent and exposes the separate consumer health data policy', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText(/18\+ · United States · English only/).first()).toBeVisible();

    await page.getByText('Consumer Health Data Policy', { exact: true }).first().click();
    await expect(page.getByText('LEGAL & SAFETY CENTER')).toBeVisible();
    await expect(page.getByText('Consumer Health Data Privacy Policy', { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/Collection by the operator/)).toBeVisible();

    await page.getByText('Terms of Use', { exact: true }).first().click();
    await expect(page.getByText('Not professional care', { exact: true })).toBeVisible();

    await page.getByText('Safety & Crisis Notice', { exact: true }).first().click();
    await expect(page.getByText('Detection limits', { exact: true })).toBeVisible();

    await page.getByText('Accessibility Statement', { exact: true }).first().click();
    await expect(page.getByText(/WCAG 2.2 Level AA/)).toBeVisible();
  });

  test('local diagnostics records route metadata without retaining raw reflection text', async ({ page }) => {
    await page.goto('/?debug=1');

    const input = page.getByRole('textbox', { name: 'Problem Input' });
    await input.fill(SAFE_REFLECTION);
    await page.getByLabel('Submit Reflection').click();
    await expect(page.getByText('CATEGORY #1')).toBeVisible();

    await page.getByText('Local Diagnostics', { exact: true }).click();
    await expect(page.getByText('Debug & Release Data Hub')).toBeVisible();

    const rawDebug = await page.evaluate(
      () => localStorage.getItem('inner_compass_debug_events_v1') || ''
    );
    expect(rawDebug).not.toContain(SAFE_REFLECTION);
    expect(rawDebug).toContain('reflection_submit');
    expect(rawDebug).toContain('guidance');

    await page.getByLabel('Clear local diagnostics').click();
    expect(await page.evaluate(() => localStorage.getItem('inner_compass_debug_events_v1'))).toBeNull();
  });

  test('critical user-facing surfaces have no serious or critical automated accessibility violations', async ({ page }) => {
    await page.goto('/');

    const homeResults = await new AxeBuilder({ page }).analyze();
    const homeBlocking = homeResults.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact || '')
    );
    expect(homeBlocking, JSON.stringify(homeBlocking, null, 2)).toEqual([]);

    await page.getByText('Legal & Safety', { exact: true }).first().click();
    const legalResults = await new AxeBuilder({ page }).analyze();
    const legalBlocking = legalResults.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact || '')
    );
    expect(legalBlocking, JSON.stringify(legalBlocking, null, 2)).toEqual([]);

    await page.getByText('Lifelines 24/7', { exact: true }).click();
    const safetyResults = await new AxeBuilder({ page }).analyze();
    const safetyBlocking = safetyResults.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact || '')
    );
    expect(safetyBlocking, JSON.stringify(safetyBlocking, null, 2)).toEqual([]);
  });

});
