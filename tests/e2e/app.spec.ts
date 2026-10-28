import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const SAFE_REFLECTION =
  'I feel deeply lonely and disconnected even when surrounded by friends and coworkers.';

const navigateFromHeader = async (page: import('@playwright/test').Page, label: string) => {
  await page.getByLabel('Open navigation menu').click();
  await page.getByLabel(`Navigate to ${label}`).click();
};

const assertNoHorizontalScroller = async (page: import('@playwright/test').Page) => {
  const offenders = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('*'))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const overflowX = style.overflowX;
        return (
          (overflowX === 'auto' || overflowX === 'scroll') &&
          element.scrollWidth > element.clientWidth + 1
        );
      })
      .map((element) => ({
        tag: element.tagName,
        text: (element.textContent || '').trim().slice(0, 80),
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
      }))
  );

  expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
};

test.describe('Inner Compass web app core flow', () => {
  test('optional calendar preview downloads original private-data-free ICS without a provider write', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (req) => {
      if (req.method() !== 'GET' && req.method() !== 'HEAD') requests.push(req.url());
    });
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Download an optional 30-day reflection calendar preview' });
    await expect(button).toBeVisible();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      button.click(),
    ]);
    expect(download.suggestedFilename()).toBe('inner-compass-reflections-preview.ics');
    const location = await download.path();
    expect(location).toBeTruthy();
    const text = await readFile(location!, 'utf8');
    expect((text.match(/BEGIN:VEVENT/g) || []).length).toBe(30);
    expect(text).toContain('METHOD:PUBLISH');
    expect(text).not.toMatch(/saved_reflections|birth|raw reflection|email/i);
    expect(requests).toEqual([]);
    await expect(page.getByText(/deleting the downloaded file does not remove imported events/i)).toBeVisible();
  });

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
    await expect(page.getByText('BETA PREVIEW')).toBeVisible();
    await expect(page.getByText('What is weighing on your heart?')).toBeVisible();
    await expect(page.getByText('Daily Wisdom & Reflection')).toBeVisible();
    await expect(page.getByText("TODAY'S REFLECTION")).toBeVisible();

    const input = page.getByRole('textbox', { name: 'Problem Input' });
    await input.fill(SAFE_REFLECTION);
    await page.getByLabel('Submit Reflection').click();

    await expect(page.getByText('REFLECTION THEME', { exact: true })).toBeVisible();
    await expect(page.getByText('POSITIVE AFFIRMATION', { exact: true })).toBeVisible();
    await expect(page.getByText('RESEARCH-INFORMED REFLECTION')).toBeVisible();
    expect(guidanceRequests).toEqual([]);

    await page.getByText('Bookmark Reflection').click();
    await expect(page.getByText('✓ Saved in Journal')).toBeVisible();

    const persisted = await page.evaluate(
      () => localStorage.getItem('inner_compass_saved_reflections_v1') || ''
    );
    expect(persisted).toContain('REDACTED_PRIVACY_RULE_7');
    expect(persisted).not.toContain(SAFE_REFLECTION);

    await navigateFromHeader(page, 'Journal (1)');
    await expect(page.getByText('Bookmarked Wisdom & Affirmations')).toBeVisible();
    await page.getByLabel(/Explore wisdom related to/).click();
    await expect(page.getByText('SEARCHABLE REFLECTION ARCHIVE')).toBeVisible();
    await expect(page.getByText('Showing wisdom connected to your current selection.')).toBeVisible();
    await expect(page.getByText('SOURCE PASSAGE SUMMARY', { exact: true }).first()).toBeVisible();

    await navigateFromHeader(page, 'Wisdom');
    await expect(page.getByText('25 reflection themes', { exact: true })).toBeVisible();

    await navigateFromHeader(page, 'Suggested Reads');
    await expect(page.getByText('CURATED DIGITAL LIBRARY')).toBeVisible();
    await expect(page.getByText('View details').first()).toBeVisible();

    await navigateFromHeader(page, 'Privacy');
    await expect(page.getByText('PRIVACY & LOCAL DATA')).toBeVisible();
    await expect(page.getByText('Your reflection stays on this device')).toBeVisible();

    await navigateFromHeader(page, 'Categories');
    await expect(page.getByText('All 25 Categories')).toBeVisible();

    await navigateFromHeader(page, 'Lifelines 24/7');
    await expect(page.getByText('SAFETY & SUPPORT')).toBeVisible();
    await expect(page.getByText(/United States resources/)).toBeVisible();

    expect(pageErrors, `Uncaught page errors: ${pageErrors.join(' | ')}`).toEqual([]);
    expect(failedAppResponses, `Same-origin HTTP failures: ${failedAppResponses.join(' | ')}`).toEqual([]);
    expect(consoleErrors, `Console errors: ${consoleErrors.join(' | ')}`).toEqual([]);
  });

  test('site sharing contains only the public URL, never a private reflection', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: async (data: { title: string; text: string; url: string }) => {
          (window as unknown as { __testShare?: typeof data }).__testShare = data;
        },
      });
    });
    await page.goto('/');
    const privateDraft = 'My private reflection for the share regression test';
    await page.getByRole('textbox', { name: 'Problem Input' }).fill(privateDraft);
    await page.getByRole('button', { name: 'Share Inner Compass' }).click();
    const payload = await page.evaluate(
      () => (window as unknown as { __testShare?: { title: string; text: string; url: string } }).__testShare
    );
    expect(payload?.url).toBe('https://thecrewblueprint-glitch.github.io/inner-compass/');
    expect(payload?.title).toBe('Inner Compass Beta');
    expect(JSON.stringify(payload)).not.toContain(privateDraft);
    await expect(page.getByText('Site link shared.')).toBeVisible();
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /six volumes/i);
  });

  test('site sharing offers a clipboard fallback on browsers without native Share', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            (window as unknown as { __copiedSite?: string }).__copiedSite = value;
          },
        },
      });
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Share Inner Compass' }).click();
    const copied = await page.evaluate(() => (window as unknown as { __copiedSite?: string }).__copiedSite);
    expect(copied).toBe('https://thecrewblueprint-glitch.github.io/inner-compass/');
    await expect(page.getByText('Site link copied to clipboard.')).toBeVisible();
  });

  test('wellness volume has independent pages, private progress, source links and a return route', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Open navigation menu').click();
    await page.getByLabel('Navigate to Health & Wellness').click();
    await expect(page.getByText('THE WHOLE LIFE FIELD GUIDE', { exact: false })).toBeVisible();
    await expect(page.getByText('Mind. Body. Soul.')).toBeVisible();

    await page.getByLabel('Wellness page: Traditions').click();
    await expect(page.getByText('Wisdom traditions', { exact: true })).toBeVisible();
    await page.getByLabel('Search wellness traditions').fill('Stoicism');
    await expect(page.getByText('Stoicism', { exact: true })).toBeVisible();
    await expect(page.getByText('Buddhism', { exact: true })).toHaveCount(0);
    await expect(page.getByLabel('View source P2')).toBeVisible();

    await page.getByLabel('Wellness page: Practices').click();
    await page.getByLabel('Filter Body wellness practices').click();
    await expect(page.getByText('Comfortable everyday movement', { exact: true })).toBeVisible();
    await expect(page.getByText('Fact / interpretation / choice', { exact: true })).toHaveCount(0);

    await page.getByLabel('Wellness page: 21-Day Journey').click();
    await page.getByRole('checkbox', { name: 'Day 1: Choose one value' }).click();
    await expect(page.getByText('1 of 21 explored', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('inner_compass_wellness_journey_v1'))).toBe('[0]');

    await page.getByLabel('Wellness page: Sources').click();
    await expect(page.getByText('Sources & further reading')).toBeVisible();
    await expect(page.getByRole('link', { name: /Stoicism/ })).toBeVisible();

    await page.getByLabel('Back to Inner Compass home').click();
    await expect(page.getByText('What is weighing on your heart?')).toBeVisible();
    await expect(page.getByLabel('Open Health & Wellness Library')).toBeVisible();
    await page.getByLabel('Open Health & Wellness Library').click();
    await expect(page.getByText('Mind. Body. Soul.')).toBeVisible();
    await page.getByLabel('Wellness page: 21-Day Journey').click();
    await expect(page.getByText('1 of 21 explored', { exact: true })).toBeVisible();
  });

  test('all six published wellness volumes offer chapter pages and route back to Inner Compass', async ({ page }) => {
    await page.goto('/');
    await navigateFromHeader(page, 'Health & Wellness');
    for (const [roman, title] of [
      ['II', 'Eastern Wisdom'], ['III', 'Western Philosophy'],
      ['IV', 'Spiritual Growth'], ['V', 'The Mind–Body Connection'],
      ['VI', 'Living the Philosophy'], ['I', 'Foundations of Wellness']
    ] as const) {
      await page.getByRole('button', { name: 'Open Volume ' + roman + ': ' + title }).click();
      if (roman !== 'I') {
        await expect(page.getByText(title, { exact: true }).first()).toBeVisible();
        await page.getByLabel('Chapters page for Volume ' + ({'II':2,'III':3,'IV':4,'V':5,'VI':6} as const)[roman]).click();
        await page.getByRole('button', { name: /Read chapter 1:/ }).click();
        await expect(page.getByText('Going deeper')).toBeVisible();
        await expect(page.getByText('Practice in ordinary life')).toBeVisible();
        await page.getByLabel('Next wellness chapter').click();
        await expect(page.getByText('Going deeper')).toBeVisible();
        await page.getByLabel('Back to volume chapter list').click();
      } else {
        await expect(page.getByText('Mind. Body. Soul.')).toBeVisible();
      }
    }
    await page.getByLabel('Back to Inner Compass home').click();
    await expect(page.getByText('What is weighing on your heart?')).toBeVisible();
  });

  test('Volume V and VI navigation stays tappable at narrow widths and resets chapters', async ({ page }) => {
    for (const width of [320, 375, 414]) {
      await page.setViewportSize({ width, height: 780 });
      await page.goto('/');
      await navigateFromHeader(page, 'Health & Wellness');

      const volumeFive = page.getByRole('button', { name: 'Open Volume V: The Mind–Body Connection' });
      const volumeSix = page.getByRole('button', { name: 'Open Volume VI: Living the Philosophy' });

      for (const button of [volumeFive, volumeSix]) {
        await expect(button).toBeVisible();
        const rectangle = await button.boundingBox();
        expect(rectangle).not.toBeNull();
        expect(rectangle!.width).toBeGreaterThan(100);
        expect(rectangle!.x).toBeGreaterThanOrEqual(0);
        expect(rectangle!.x + rectangle!.width).toBeLessThanOrEqual(width + 1);
      }

      await volumeFive.click();
      await expect(page.getByText('A field guide to the mind–body connection')).toBeVisible();
      await page.getByLabel('Chapters page for Volume 5').click();
      await page.getByRole('button', { name: /Read chapter 2:/ }).click();
      await expect(page.getByText('Sleep as a basic form of care')).toBeVisible();

      await volumeSix.click();
      await expect(page.getByText('A field guide to living the philosophy')).toBeVisible();
      await expect(page.getByText('Inside this volume')).toBeVisible();
      await expect(page.getByText('Sleep as a basic form of care')).toHaveCount(0);

      await page.getByLabel('Chapters page for Volume 6').click();
      await page.getByRole('button', { name: /Read chapter 1:/ }).click();
      await expect(page.getByText('Let values guide a real decision')).toBeVisible();

      await volumeFive.click();
      await expect(page.getByText('A field guide to the mind–body connection')).toBeVisible();
      await expect(page.getByText('Let values guide a real decision')).toHaveCount(0);

      await page.getByRole('button', { name: 'Open Volume I: Foundations of Wellness' }).click();
      await expect(page.getByText('A guide to whole-person wellness')).toBeVisible();
    }
  });

  test('new wellness pages pass automated serious and critical accessibility checks', async ({ page }) => {
    await page.goto('/');
    await navigateFromHeader(page, 'Health & Wellness');
    const assertAccessible = async (surface: string) => {
      const result = await new AxeBuilder({ page }).analyze();
      const blocking = result.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact || '')
      );
      expect(blocking, surface + ': ' + JSON.stringify(blocking, null, 2)).toEqual([]);
    };

    await assertAccessible('Volume I overview');
    await page.getByRole('button', { name: 'Open Volume V: The Mind–Body Connection' }).click();
    await assertAccessible('Volume V overview');
    await page.getByLabel('Chapters page for Volume 5').click();
    await page.getByRole('button', { name: /Read chapter 1:/ }).click();
    await assertAccessible('Volume V chapter detail');
    await page.getByRole('button', { name: 'Open Volume VI: Living the Philosophy' }).click();
    await assertAccessible('Volume VI overview');
    await page.getByLabel('Exercises page for Volume 6').click();
    await assertAccessible('Volume VI exercises');
  });

  test('header navigation stays compact and works on a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const menuButton = page.getByLabel('Open navigation menu');
    const themeButton = page.getByLabel('Open Colors');
    await expect(menuButton).toBeVisible();
    await expect(themeButton).toBeVisible();

    const menuBox = await menuButton.boundingBox();
    const themeBox = await themeButton.boundingBox();
    expect(menuBox).not.toBeNull();
    expect(themeBox).not.toBeNull();
    expect(themeBox!.x).toBeLessThanOrEqual(20);
    expect(menuBox!.x).toBeGreaterThan(themeBox!.x);
    expect(375 - (menuBox!.x + menuBox!.width)).toBeLessThanOrEqual(20);
    await expect(themeButton).toContainText('Colors');

    await expect(page.getByLabel('Navigate to Categories')).toHaveCount(0);

    await menuButton.click();
    await expect(page.getByLabel('Close navigation menu')).toBeVisible();
    await expect(page.getByLabel('Navigate to Reflect')).toBeVisible();
    await expect(page.getByLabel('Navigate to Lifelines 24/7')).toBeVisible();

    await page.getByLabel('Navigate to Categories').click();
    await expect(page.getByText('All 25 Categories')).toBeVisible();
    await expect(page.getByLabel('Open navigation menu')).toBeVisible();
    await expect(page.getByLabel('Navigate to Categories')).toHaveCount(0);
  });

  test('public shell has clean share metadata', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Inner Compass Beta');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://thecrewblueprint-glitch.github.io/inner-compass/'
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://thecrewblueprint-glitch.github.io/inner-compass/'
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Inner Compass Beta'
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');
  });

  test('page navigation and filter controls never require horizontal scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await navigateFromHeader(page, 'Categories');
    await expect(page.getByText('All 25 Categories', { exact: true })).toBeVisible();
    await assertNoHorizontalScroller(page);

    await navigateFromHeader(page, 'Wisdom');
    await expect(page.getByText('SEARCHABLE REFLECTION ARCHIVE')).toBeVisible();
    await assertNoHorizontalScroller(page);

    await navigateFromHeader(page, 'Suggested Reads');
    await expect(page.getByText('Explore everything', { exact: true })).toBeVisible();
    await page.getByText('More filters', { exact: true }).click();
    await expect(page.getByText('Free / open access', { exact: true })).toBeVisible();
    await assertNoHorizontalScroller(page);

    await navigateFromHeader(page, 'Legal & Safety');
    await expect(page.getByText('LEGAL & SAFETY CENTER')).toBeVisible();
    await assertNoHorizontalScroller(page);

    await page.getByLabel('Open Colors').click();
    await expect(page.getByText('Color:', { exact: true })).toBeVisible();
    await expect(page.getByText('🌈 All', { exact: true })).toBeVisible();
    await assertNoHorizontalScroller(page);
  });

  test('Wisdom is independently searchable and matches reflection output', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: 'Problem Input' });
    await input.fill(SAFE_REFLECTION);
    await page.getByLabel('Submit Reflection').click();

    await expect(page.getByText('REFLECTION THEME', { exact: true })).toBeVisible();
    const reflectionAffirmation = (await page.getByLabel('Reflection affirmation').textContent())?.trim();
    expect(reflectionAffirmation).toBeTruthy();

    await page.getByLabel('Open wisdom for category 1').click();
    await expect(page.getByText('SEARCHABLE REFLECTION ARCHIVE')).toBeVisible();
    await expect(page.getByText(reflectionAffirmation!, { exact: true })).toBeVisible();

    await page.getByText('Search the full archive').click();
    const search = page.getByRole('textbox', { name: 'Search Wisdom Archive' });
    await search.fill('anger');
    await expect(page.getByText(/reflection theme/i).first()).toBeVisible();
    await expect(page.getByText(/anger/i).first()).toBeVisible();

    await search.fill('');
    await expect(page.getByText('25 reflection themes', { exact: true })).toBeVisible();
  });

  test('internal links connect guidance, reads, wisdom, and categories', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: 'Problem Input' });
    await input.fill(SAFE_REFLECTION);
    await page.getByLabel('Submit Reflection').click();
    await expect(page.getByText('REFLECTION THEME', { exact: true })).toBeVisible();

    await page.getByLabel('Open wisdom for category 1').click();
    await expect(page.getByText('Showing wisdom connected to your current selection.')).toBeVisible();

    await navigateFromHeader(page, 'Reflect');
    await page.getByLabel('Open suggested reads for category 1').click();
    await expect(page.getByText('Showing reads connected to your current selection.')).toBeVisible();

    await navigateFromHeader(page, 'Suggested Reads');
    await expect(page.getByText('CURATED DIGITAL LIBRARY')).toBeVisible();

    await page.getByText('View details').first().click();
    await page.getByLabel(/Open wisdom:/).first().click();
    await expect(page.getByText('Showing wisdom connected to your current selection.')).toBeVisible();

    await page.getByLabel(/Suggested reads related to/).first().click();
    await expect(page.getByText('Showing reads connected to your current selection.')).toBeVisible();
    await expect(page.getByText('View details').first()).toBeVisible();
  });

  test('public screens avoid internal implementation labels', async ({ page }) => {
    await page.goto('/');

    const bannedVisiblePhrases = [
      'CATEGORY #',
      'GROUNDED AFFIRMATION',
      "TODAY'S CANONICAL REFLECTION",
      'SOURCE-LINKED REFLECTION',
      'Quote-display rights gate',
      'HARD SAFETY CEILING',
      'UPSTREAM SAFETY ROUTING NOTICE',
      'Edition recorded in research corpus',
      'PREVIEW MODE ACTIVE',
      'zero runtime AI providers',
      'Local Diagnostics',
      'Taxonomy',
      'raw reflection',
      'deterministic safety',
      'deterministic content',
    ];

    const assertCleanCopy = async () => {
      const text = await page.locator('body').innerText();
      for (const phrase of bannedVisiblePhrases) {
        expect(text).not.toContain(phrase);
      }
      expect(text).not.toMatch(/Fit\s+\d+%/);
      expect(text).not.toMatch(/wisdom record\s+WIS-/i);
    };

    await assertCleanCopy();
    await navigateFromHeader(page, 'Wisdom');
    await assertCleanCopy();
    await navigateFromHeader(page, 'Suggested Reads');
    await assertCleanCopy();
    await navigateFromHeader(page, 'Legal & Safety');
    await assertCleanCopy();
    await navigateFromHeader(page, 'Lifelines 24/7');
    await assertCleanCopy();
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

    await expect(page.getByText('POSITIVE AFFIRMATION', { exact: true })).toHaveCount(0);

    await input.fill(
      'I feel like everything is changing and slipping away from my hands. I am grieving because someone close to me passed away.'
    );
    await page.getByLabel('Submit Reflection').click();

    await expect(page.getByText('REFLECTION THEME', { exact: true })).toBeVisible();
    await expect(page.getByText('POSITIVE AFFIRMATION', { exact: true })).toBeVisible();
  });

  test('direct taxonomy navigation cannot bypass Category 10 hard ceiling', async ({ page }) => {
    await page.goto('/');
    await navigateFromHeader(page, 'Categories');
    await page.getByText('Substance use', { exact: true }).click();
    await page.getByText('Reflect on this Category →').click();
    await expect(page.getByText('SAFETY & SUPPORT')).toBeVisible();
  });

  test('privacy controls clear local journal and personalization metadata', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('inner_compass_saved_reflections_v1', JSON.stringify([{ categoryId: 1 }]));
      localStorage.setItem('inner_compass_category_interactions_v1', JSON.stringify({ 1: { count: 1 } }));
    });
    await page.reload();
    await navigateFromHeader(page, 'Privacy');
    await page.getByText('Clear journal', { exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem('inner_compass_saved_reflections_v1'))).toBe('[]');
    await page.getByText('Clear personalization history', { exact: true }).click();
    expect(await page.evaluate(() => localStorage.getItem('inner_compass_category_interactions_v1'))).toBeNull();
  });

  test('back navigation returns exactly one page at a time', async ({ page }) => {
    await page.goto('/');

    await navigateFromHeader(page, 'Categories');
    await page.getByText('Loneliness / feeling isolated even around people', { exact: true }).click();
    await page.getByText('Reflect on this Category →', { exact: true }).click();
    await expect(page.getByText('REFLECTION THEME', { exact: true })).toBeVisible();
    await page.getByLabel('Open wisdom for category 1').click();
    await expect(page.getByText('Showing wisdom connected to your current selection.')).toBeVisible();

    await page.getByLabel('Go back one page').click();
    await expect(page.getByText('REFLECTION THEME', { exact: true })).toBeVisible();

    await page.getByLabel('Go back one page').click();
    await expect(page.getByText('All 25 Categories')).toBeVisible();

    await page.getByLabel('Go back one page').click();
    await expect(page.getByText('What is weighing on your heart?')).toBeVisible();
  });


  test('Suggested Reads exposes branch-complete browsing', async ({ page }) => {
    await page.goto('/');
    await navigateFromHeader(page, 'Suggested Reads');
    await expect(page.getByText('CURATED DIGITAL LIBRARY')).toBeVisible();

    await page.getByLabel('Choose a school of thought or tradition').click();
    await page.getByText('Mahayana Buddhism', { exact: true }).last().click();
    await page.getByLabel('Choose a school or branch within Mahayana Buddhism').click();
    await page.getByText('Madhyamaka', { exact: true }).last().click();
    await expect(page.getByText('The Fundamental Wisdom of the Middle Way', { exact: true })).toBeVisible();

    await page.getByLabel('Choose a school of thought or tradition').click();
    await page.getByText('Japanese Buddhist traditions', { exact: true }).last().click();
    await page.getByLabel('Choose a school or branch within Japanese Buddhist traditions').click();
    await page.getByText('Shingon / esoteric Buddhism', { exact: true }).last().click();
    await expect(page.getByText('Kukai: Major Works', { exact: true })).toBeVisible();

    await page.getByLabel('Choose a school of thought or tradition').click();
    await page.getByText('Sikh philosophy and theology', { exact: true }).last().click();
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
    await expect(page.getByText('REFLECTION THEME', { exact: true })).toBeVisible();

    await navigateFromHeader(page, 'Local Diagnostics');
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

    await navigateFromHeader(page, 'Legal & Safety');
    const legalResults = await new AxeBuilder({ page }).analyze();
    const legalBlocking = legalResults.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact || '')
    );
    expect(legalBlocking, JSON.stringify(legalBlocking, null, 2)).toEqual([]);

    await navigateFromHeader(page, 'Lifelines 24/7');
    const safetyResults = await new AxeBuilder({ page }).analyze();
    const safetyBlocking = safetyResults.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact || '')
    );
    expect(safetyBlocking, JSON.stringify(safetyBlocking, null, 2)).toEqual([]);
  });

});
