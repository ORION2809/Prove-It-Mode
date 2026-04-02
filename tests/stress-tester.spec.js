import { test, expect } from '@playwright/test';

// ──────────────────────────────────────────────────────────────
// Test Suite: Mental Model Stress Tester — Full E2E Validation
// Tests every screen, transition, and feature:
//   Landing → Input → Framing (beat 1 + 2) → Trap (fallback)
//   → Confession → Mirror (mocked) → Start Over cycle
// ──────────────────────────────────────────────────────────────

test.describe('Landing Screen', () => {
  test('renders hero and CTA correctly', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('understand it');
    await expect(page.getByText('Find out exactly where your understanding breaks')).toBeVisible();
    await expect(page.getByText('Not a quiz. Not a challenge.')).toBeVisible();

    const ctaButton = page.getByRole('button', { name: /Stress test my understanding/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();

    await expect(page.getByText(/No signup/i)).toBeVisible();
  });

  test('navigates to input screen on CTA click', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Stress test my understanding/i }).click();
    await expect(page.getByText('What did you just learn?')).toBeVisible();
  });
});

test.describe('Topic Input Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Stress test my understanding/i }).click();
  });

  test('shows input field with placeholder and examples', async ({ page }) => {
    const input = page.getByLabel('Topic you just learned');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();

    await expect(page.getByText('React useEffect hook')).toBeVisible();
    await expect(page.getByText('Python list comprehensions')).toBeVisible();
    await expect(page.getByText('SQL JOINs')).toBeVisible();
    await expect(page.getByText('CSS Flexbox')).toBeVisible();
    await expect(page.getByText('async/await in JavaScript')).toBeVisible();
  });

  test('submit button disabled when input is empty or too short', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /Stress Test It/i });
    await expect(submitBtn).toBeDisabled();

    await page.getByLabel('Topic you just learned').fill('a');
    await expect(submitBtn).toBeDisabled();
  });

  test('submit button enabled with valid input', async ({ page }) => {
    await page.getByLabel('Topic you just learned').fill('React hooks');
    const submitBtn = page.getByRole('button', { name: /Stress Test It/i });
    await expect(submitBtn).toBeEnabled();
  });

  test('example chips populate the input', async ({ page }) => {
    await page.getByText('SQL JOINs').click();
    const input = page.getByLabel('Topic you just learned');
    await expect(input).toHaveValue('SQL JOINs');
  });

  test('shows character counter when typing', async ({ page }) => {
    await page.getByLabel('Topic you just learned').fill('React useEffect');
    await expect(page.getByText('15/200')).toBeVisible();
  });
});

test.describe('Framing Screens', () => {
  test('shows beat 1 then beat 2 with correct copy', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Stress test my understanding/i }).click();
    await page.getByLabel('Topic you just learned').fill('React useEffect hook');
    await page.getByRole('button', { name: /Stress Test It/i }).click();

    // Beat 1: New copy
    await expect(page.getByText('You just studied')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('React useEffect hook')).toBeVisible();
    await expect(page.getByText('You think you understand it.')).toBeVisible();
    await expect(page.getByText("Let's find out where you actually do.")).toBeVisible();

    // Beat 2: Unchanged
    await expect(page.getByText("You won't feel ready.")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Start anyway.')).toBeVisible();
  });
});

test.describe('Trap Display (Fallback Path)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Stress test my understanding/i }).click();
  });

  test('shows fallback trap snippets for React topic', async ({ page }) => {
    await page.getByLabel('Topic you just learned').fill('React useEffect hook');
    await page.getByRole('button', { name: /Stress Test It/i }).click();

    // Wait through framing + loading → trap screen
    await expect(page.getByText("Something's wrong with each of these")).toBeVisible({ timeout: 15000 });

    // Snippet tabs
    await expect(page.getByText('Snippet 1')).toBeVisible();
    await expect(page.getByText('Snippet 2')).toBeVisible();
    await expect(page.getByText('Snippet 3')).toBeVisible();

    // Code snippet card present
    await expect(page.locator('pre')).toBeVisible();

    // Confession textarea
    const textarea = page.getByLabel('Your explanation for snippet 1');
    await expect(textarea).toBeVisible();

    // Submit disabled until all 3 answered
    await expect(page.getByText('0/3 answered')).toBeVisible();
  });

  test('can switch between snippets and answer each', async ({ page }) => {
    await page.getByLabel('Topic you just learned').fill('React useEffect hook');
    await page.getByRole('button', { name: /Stress Test It/i }).click();

    await expect(page.getByText("Something's wrong with each of these")).toBeVisible({ timeout: 15000 });

    // Answer snippet 1
    await page.getByLabel('Your explanation for snippet 1').fill('The closure captures stale state');
    await expect(page.getByText('1/3 answered')).toBeVisible();

    // Navigate to snippet 2
    await page.getByText('Snippet 2').click();
    await page.getByLabel('Your explanation for snippet 2').fill('Cannot use await directly in useEffect');
    await expect(page.getByText('2/3 answered')).toBeVisible();

    // Navigate to snippet 3
    await page.getByText('Snippet 3').click();
    await page.getByLabel('Your explanation for snippet 3').fill('Mutating array directly');

    // Submit should now be available
    await expect(page.getByRole('button', { name: /Show me what I missed/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Show me what I missed/i })).toBeEnabled();
  });
});

test.describe('Mirror Display (With Mocked API)', () => {
  test('shows diagnosis after submitting confessions', async ({ page }) => {
    // Mock the trap endpoint
    await page.route('**/api/generate-trap', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          snippets: [
            'useEffect(() => { setCount(count + 1); }, []);',
            'useEffect(async () => { const data = await fetch("/api"); }, []);',
            'const [items, setItems] = useState([]);\nitems.push(newItem);\nsetItems(items);',
          ],
          wrongBecause: [
            'Stale closure — count is captured at render time',
            'useEffect cannot be async directly',
            'Mutating existing array reference means React won\'t re-render',
          ],
        }),
      });
    });

    // Mock the mirror endpoint
    await page.route('**/api/generate-mirror', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          solid: 'You correctly identified that cleanup functions prevent memory leaks — your own words showed you understand the lifecycle.',
          broken: 'Your mental model of the dependency array is incomplete. You described what it does but not why stale closures happen.',
          oneFix: 'Understand what a closure captures at the time of render — then the dependency array will make sense.',
        }),
      });
    });

    // Navigate through full flow
    await page.goto('/');
    await page.getByRole('button', { name: /Stress test my understanding/i }).click();
    await page.getByLabel('Topic you just learned').fill('React useEffect hook');
    await page.getByRole('button', { name: /Stress Test It/i }).click();

    // Wait for trap screen (mocked — fast)
    await expect(page.getByText("Something's wrong with each of these")).toBeVisible({ timeout: 10000 });

    // Fill in all 3 confessions
    await page.getByLabel('Your explanation for snippet 1').fill('Something about closures capturing the initial value');
    await page.getByText('Snippet 2').click();
    await page.getByLabel('Your explanation for snippet 2').fill('useEffect cannot be async');
    await page.getByText('Snippet 3').click();
    await page.getByLabel('Your explanation for snippet 3').fill('Array mutation does not trigger re-render');

    // Submit
    await page.getByRole('button', { name: /Show me what I missed/i }).click();

    // Mirror screen — diagnosis sections with staggered reveal
    await expect(page.getByText('Your mental model', { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('React useEffect hook')).toBeVisible();

    // SOLID section
    await expect(page.getByText("What's solid")).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/cleanup functions prevent memory leaks/)).toBeVisible();

    // BROKEN section
    await expect(page.getByText('Where it breaks')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/dependency array is incomplete/)).toBeVisible();

    // ONE FIX section
    await expect(page.getByText('One thing to fix before you build')).toBeVisible({ timeout: 7000 });
    await expect(page.getByText(/closure captures at the time of render/)).toBeVisible();

    // CTA — stress test another topic
    await expect(page.getByRole('button', { name: /Stress test another topic/i })).toBeVisible();

    // No score, no history link, no save button
    await expect(page.getByText(/No score. No history. Just clarity./)).toBeVisible();
  });
});

test.describe('Mirror Error Handling', () => {
  test('shows graceful error when mirror API fails, preserves confessions', async ({ page }) => {
    // Trap succeeds, mirror fails
    await page.route('**/api/generate-trap', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          snippets: ['snippet 1 code', 'snippet 2 code', 'snippet 3 code'],
          wrongBecause: ['reason 1', 'reason 2', 'reason 3'],
        }),
      });
    });

    await page.route('**/api/generate-mirror', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/');
    await page.getByRole('button', { name: /Stress test my understanding/i }).click();
    await page.getByLabel('Topic you just learned').fill('CSS Flexbox');
    await page.getByRole('button', { name: /Stress Test It/i }).click();
    await expect(page.getByText("Something's wrong with each of these")).toBeVisible({ timeout: 10000 });

    // Fill confessions
    await page.getByLabel('Your explanation for snippet 1').fill('My answer for snippet 1');
    await page.getByText('Snippet 2').click();
    await page.getByLabel('Your explanation for snippet 2').fill('My answer for snippet 2');
    await page.getByText('Snippet 3').click();
    await page.getByLabel('Your explanation for snippet 3').fill('My answer for snippet 3');

    await page.getByRole('button', { name: /Show me what I missed/i }).click();

    // Error redirects back to trap screen with confessions preserved
    await expect(page.getByText(/Couldn't generate your diagnosis/i)).toBeVisible({ timeout: 20000 });

    // Confessions should still be there
    await expect(page.getByLabel('Your explanation for snippet 1')).toHaveValue('My answer for snippet 1');
  });
});

test.describe('Start Over Flow', () => {
  test('can start over with a new topic after seeing mirror', async ({ page }) => {
    // Mock APIs
    await page.route('**/api/generate-trap', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          snippets: ['code 1', 'code 2', 'code 3'],
          wrongBecause: ['wrong 1', 'wrong 2', 'wrong 3'],
        }),
      });
    });

    await page.route('**/api/generate-mirror', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          solid: 'Your understanding of basic syntax is correct.',
          broken: 'You confused scope with closure.',
          oneFix: 'Study how closures capture variables.',
        }),
      });
    });

    await page.goto('/');
    await page.getByRole('button', { name: /Stress test my understanding/i }).click();
    await page.getByLabel('Topic you just learned').fill('JavaScript closures');
    await page.getByRole('button', { name: /Stress Test It/i }).click();
    await expect(page.getByText("Something's wrong with each of these")).toBeVisible({ timeout: 10000 });

    // Fill & submit
    await page.getByLabel('Your explanation for snippet 1').fill('answer 1');
    await page.getByText('Snippet 2').click();
    await page.getByLabel('Your explanation for snippet 2').fill('answer 2');
    await page.getByText('Snippet 3').click();
    await page.getByLabel('Your explanation for snippet 3').fill('answer 3');
    await page.getByRole('button', { name: /Show me what I missed/i }).click();

    // Mirror screen
    await expect(page.getByText('Your mental model')).toBeVisible({ timeout: 10000 });

    // Start over
    await page.getByRole('button', { name: /Stress test another topic/i }).click();

    // Should be back at input
    await expect(page.getByText('What did you just learn?')).toBeVisible();
  });
});
