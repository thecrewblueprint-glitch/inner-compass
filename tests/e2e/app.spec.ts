import { test, expect, Page } from '@playwright/test';

const SAFE_REFLECTION =
  'I feel deeply lonely and disconnected even when surrounded by friends and coworkers.';

async function acceptLaunchGate(page: Page) {
  await expect(page.getByText('Before you continue')).toBeVisible();
  await page.getByLabel('Confirm adult United States launch eligibility').click();
  await expect(page.getByText('INNER COMPASS')).toBeVisible();
}

test.describe('Inner Compass privacy-first web flow', () => {
  test('gates launch, reflects locally, saves without raw text, and uses no app API', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const appApiRequests: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.pathname.startsWith('/api/')) appApiRequests.push(url.pathname);
    });

    await page.goto('/');
    await acceptLaunchGate(page);

    await expect(page.getByText('PREVIEW MODE ACTIVE')).toBeVisible();
    await expect(page.getByText('What is weighing on your heart?')).toBeVisible();
    await expect(page.getByText('Daily Wisdom & Reflection')).toBeVisible();
    await expect(page.getByText("TODAY'S CANONICAL REFLECTION")).toBeVisible();
    await expect(page.getByText(/raw reflection text is processed locally on this device/i)).toBeVisible();

    const input = page.getByRole('textbox', { name: 'Problem Input' });
    await input.fill(SAFE_REFLECTION);
    await page.getByLabel('Submit Reflection').click();

    await expect(page.getByText('CATEGORY #1')).toBeVisible();
    await expect(page.getByText('DETERMINISTIC REFLECTION MATCH · NOT A DIAGNOSIS')).toBeVisible();
    await expect(page.getByText('GROUNDED AFFIRMATION')).toBeVisible();
    await expect(page.getByText('SYNTHESIS OF THE THREE PILLARS')).toBeVisible();
    await expect(page.getByText(/SOURCE-LINKED TEACHING SUMMARY · NOT A DIRECT QUOTE/).first()).toBeVisible();

    await page.getByText('Bookmark Reflection').click();
    await expect(page.getByText('✓ Saved in Journal')).toBeVisible();

    await expect.poll(async () => {
      return page.evaluate(() => localStorage.getItem('inner_compass_saved_reflections_v1') || '');
    }).toContain('REDACTED_PRIVACY_RULE_7');

    const persisted = await page.evaluate(
      () => localStorage.getItem('inner_compass_saved_reflections_v1') || ''
    );
    expect(persisted).not.toContain(SAFE_REFLECTION);

    await page.getByText(/^Journal(?: \(\d+\))?$/).click();
    await expect(page.getByText('Bookmarked Wisdom & Affirmations')).toBeVisible();

    await page.getByText('Taxonomy', { exact: true }).click();
    await expect(page.getByText('All 25 Categories')).toBeVisible();

    await page.getByText('Lifelines 24/7', { exact: true }).click();
    await expect(page.getByText('OUTSIDE ORDINARY REFLECTION SCOPE')).toBeVisible();
    await expect(page.getByText('24/7 Immediate Human Lifelines')).toBeVisible();

    await page.getByText('Return to Reflection').click();
    await page.getByText('← Back to Input').click();
    await expect(page.getByRole('textbox', { name: 'Problem Input' })).toBeVisible();
    await expect(page.getByText(/Personalized \(1 Theme\)/)).toBeVisible();

    const interactions = await page.evaluate(
      () => localStorage.getItem('inner_compass_category_interactions_v1') || ''
    );
    expect(interactions).toContain('"1"');
    expect(interactions).toContain('reflection');
    expect(interactions).toContain('saved');

    expect(appApiRequests, 'Production UI made an /api request').toEqual([]);
    expect(pageErrors, `Uncaught page errors: ${pageErrors.join(' | ')}`).toEqual([]);
    expect(consoleErrors, `Console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
  });

  test('asks for clarification locally before showing guidance on ambiguous input', async ({ page }) => {
    const appApiRequests: string[] = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.pathname.startsWith('/api/')) appApiRequests.push(url.pathname);
    });

    await page.goto('/');
    await acceptLaunchGate(page);

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
      'I feel like everything is changing and slipping away from my hands. I am grieving because I experienced a meaningful loss.'
    );
    await page.getByLabel('Submit Reflection').click();

    await expect(page.getByText('CATEGORY #2')).toBeVisible();
    await expect(page.getByText('GROUNDED AFFIRMATION')).toBeVisible();
    expect(appApiRequests).toEqual([]);
  });

  test('shows privacy terms and clears all Inner Compass local data', async ({ page }) => {
    await page.goto('/');
    await acceptLaunchGate(page);

    await page.getByText('About & Privacy', { exact: true }).click();
    await expect(page.getByText('What this product is')).toBeVisible();
    await expect(page.getByText('Privacy', { exact: true })).toBeVisible();
    await expect(page.getByText('Terms of use')).toBeVisible();
    await expect(page.getByText('Clear All Local Data')).toBeVisible();

    await page.evaluate(() => {
      localStorage.setItem('inner_compass_saved_reflections_v1', '[{"categoryId":1}]');
      localStorage.setItem('inner_compass_category_interactions_v1', '{"1":{"count":1}}');
    });

    await page.getByLabel('Clear all Inner Compass local data').click();

    await expect(page.getByText('Before you continue')).toBeVisible();
    const remainingKeys = await page.evaluate(() =>
      Object.keys(localStorage).filter((key) => key.startsWith('inner_compass_'))
    );
    expect(remainingKeys).toEqual([]);
  });
});
