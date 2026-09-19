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

    const input = page.getByTestId('problem-input');
    await expect(input).toBeVisible();
    await input.fill(SAFE_REFLECTION);
    await page.getByTestId('submit-guidance-button').click();

    await expect(page.getByTestId('guidance-category-card')).toBeVisible();
    await expect(page.getByTestId('category-badge')).toContainText('CATEGORY #1');
    await expect(page.getByTestId('grounded-affirmation-card')).toBeVisible();
    await expect(page.getByTestId('grounded-synthesis-card')).toBeVisible();

    await page.getByText('Bookmark Reflection').click();
    await expect(page.getByText('✓ Saved in Journal')).toBeVisible();

    await expect.poll(async () => {
      return page.evaluate(() => localStorage.getItem('inner_compass_saved_reflections_v1') || '');
    }).toContain('REDACTED_PRIVACY_RULE_7');

    const persisted = await page.evaluate(
      () => localStorage.getItem('inner_compass_saved_reflections_v1') || ''
    );
    expect(persisted).not.toContain(SAFE_REFLECTION);

    await page.getByText(/^Journal/).click();
    await expect(page.getByText('Bookmarked Wisdom & Affirmations')).toBeVisible();
    await expect(page.getByText('CATEGORY #1')).toBeVisible();

    await page.getByText('Taxonomy').click();
    await expect(page.getByText('All 25 Categories')).toBeVisible();

    await page.getByText('Lifelines 24/7').click();
    await expect(page.getByTestId('crisis-alert-banner')).toBeVisible();
    await expect(page.getByTestId('crisis-title')).toContainText('24/7 Immediate Human Lifelines');

    await page.getByText('Return to Safe Reflection').click();
    await expect(page.getByTestId('guidance-category-card')).toBeVisible();

    await page.getByText('← Back to Input').click();
    await expect(page.getByTestId('problem-input')).toBeVisible();

    expect(pageErrors, `Uncaught page errors: ${pageErrors.join(' | ')}`).toEqual([]);
    expect(consoleErrors, `Console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
  });
});
