import { test, expect } from '@playwright/test';

const SAFE_REFLECTION =
  'I feel deeply lonely and disconnected even when surrounded by friends and coworkers.';

test.describe('Inner Compass web app core flow', () => {
  test('loads, reflects locally, saves privately, and navigates core surfaces', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const guidanceRequests: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('request', (request) => {
      if (request.url().includes('/api/guidance')) guidanceRequests.push(request.url());
    });

    await page.goto('/');
    await expect(page.getByText('INNER COMPASS')).toBeVisible();
    await expect(page.getByText('PREVIEW MODE ACTIVE')).toBeVisible();
    await expect(page.getByText('What is weighing on your heart?')).toBeVisible();
    await expect(page.getByText('Daily Wisdom & Reflection')).toBeVisible();
    await expect(page.getByText("TODAY'S CANONICAL REFLECTION")).toBeVisible();

    const input = page.getByRole('textbox', { name: 'Problem Input' });
    await input.fill(SAFE_REFLECTION);
    await page.getByLabel('Submit Reflection').click();

    await expect(page.getByText('CATEGORY #1')).toBeVisible();
    await expect(page.getByText('GROUNDED AFFIRMATION')).toBeVisible();
    await expect(page.getByText('VERIFIED CANONICAL GROUNDING · DETERMINISTIC')).toBeVisible();
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
    await expect(page.getByText('AUDITED RESEARCH LIBRARY')).toBeVisible();
    await expect(page.getByText('Showing wisdom linked to Category #1.')).toBeVisible();
    await expect(page.getByText(/Exact quotation intentionally withheld/).first()).toBeVisible();

    await page.getByText('Wisdom', { exact: true }).click();
    await expect(page.getByText(/71 records/)).toBeVisible();

    await page.getByText('Suggested Reads', { exact: true }).first().click();
    await expect(page.getByText('CURATED DIGITAL LIBRARY')).toBeVisible();
    await expect(page.getByText('Meditations', { exact: true }).first()).toBeVisible();

    await page.getByText('Privacy', { exact: true }).click();
    await expect(page.getByText('PRIVACY & LOCAL DATA')).toBeVisible();
    await expect(page.getByText('Your reflection stays on this device')).toBeVisible();

    await page.getByText('Taxonomy', { exact: true }).click();
    await expect(page.getByText('All 25 Categories')).toBeVisible();

    await page.getByText('Lifelines 24/7', { exact: true }).click();
    await expect(page.getByText('DEDICATED SAFETY & CRISIS ROUTING')).toBeVisible();
    await expect(page.getByText(/United States launch resources/)).toBeVisible();

    expect(pageErrors, `Uncaught page errors: ${pageErrors.join(' | ')}`).toEqual([]);
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
    await page.getByText('Privacy', { exact: true }).click();
    await page.getByText('Clear journal', { exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem('inner_compass_saved_reflections_v1'))).toBe('[]');
    await page.getByText('Clear personalization history', { exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem('inner_compass_category_interactions_v1'))).toBeNull();
  });
});
