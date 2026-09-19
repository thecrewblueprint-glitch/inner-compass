import { test, expect } from '@playwright/test';

const SAFE_REFLECTION =
  'I feel deeply lonely and disconnected even when surrounded by friends and coworkers.';

test.describe('Inner Compass web app core flow', () => {
  test('loads, reflects, saves privately, and navigates core surfaces', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/');
    await expect(page.getByText('INNER COMPASS')).toBeVisible();
    await expect(page.getByText('PREVIEW MODE ACTIVE')).toBeVisible();
    await expect(page.getByText('What is weighing on your heart?')).toBeVisible();

    const input = page.getByRole('textbox', { name: 'Problem Input' });
    await expect(input).toBeVisible();
    await input.fill(SAFE_REFLECTION);
    await page.getByLabel('Submit Reflection').click();

    await expect(page.getByText('CATEGORY #1')).toBeVisible();
    await expect(page.getByText('GROUNDED AFFIRMATION')).toBeVisible();
    await expect(page.getByText('SYNTHESIS OF THE THREE PILLARS')).toBeVisible();

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
    await expect(page.getByText('CATEGORY #1')).toBeVisible();

    await page.getByRole('button', { name: 'Taxonomy' }).click();
    await expect(page.getByText('All 25 Categories')).toBeVisible();

    await page.getByRole('button', { name: 'Lifelines 24/7' }).click();
    await expect(page.getByText('DEDICATED SAFETY & CRISIS ROUTING')).toBeVisible();
    await expect(page.getByText('24/7 Immediate Human Lifelines')).toBeVisible();

    await page.getByText('Return to Safe Reflection').click();
    await expect(page.getByText('CATEGORY #1')).toBeVisible();

    await page.getByText('← Back to Input').click();
    await expect(page.getByRole('textbox', { name: 'Problem Input' })).toBeVisible();

    expect(pageErrors, `Uncaught page errors: ${pageErrors.join(' | ')}`).toEqual([]);
    expect(consoleErrors, `Console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
  });
});
