import { test, expect } from '@playwright/test';

// ──────────────────────────────────────────────────────────────
// Test Suite: Prove It Mode — Full E2E Validation
// Tests every screen, transition, and feature from the plan:
//   Landing → Input → Framing (beat 1 + 2) → Challenge (fallback)
//   → Attempt → Feedback (mocked) → Try Again → Save Artifact
//   → Artifact Saved → History → New Challenge cycle
// ──────────────────────────────────────────────────────────────

test.describe('Landing Screen', () => {
  test('renders hero and CTA correctly', async ({ page }) => {
    await page.goto('/');

    // "Prove It Mode" branding — plan requirement §14
    await expect(page.locator('h1')).toContainText('Prove It');
    await expect(page.locator('h1')).toContainText('Mode');

    // Value proposition copy
    await expect(page.getByText('You just learned something.')).toBeVisible();
    await expect(page.getByText('Now prove you can build with it.')).toBeVisible();

    // Primary CTA
    const ctaButton = page.getByRole('button', { name: /Enter Prove It Mode/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();

    // Secondary CTA
    await expect(page.getByRole('button', { name: /View Build History/i })).toBeVisible();

    // No-signup copy
    await expect(page.getByText(/No signup required/i)).toBeVisible();
  });

  test('navigates to input screen on CTA click', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();

    // Input screen should appear
    await expect(page.getByText('What did you just learn?')).toBeVisible();
  });

  test('navigates to history from landing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /View Build History/i }).click();

    // History screen — empty state
    await expect(page.getByText(/No builds yet/i)).toBeVisible();
  });
});

test.describe('Topic Input Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();
  });

  test('shows input field with placeholder and examples', async ({ page }) => {
    const input = page.getByLabel('Topic you just learned');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();

    // Example chips - plan §9 shows 5 topics
    await expect(page.getByText('React useEffect hook')).toBeVisible();
    await expect(page.getByText('Python list comprehensions')).toBeVisible();
    await expect(page.getByText('SQL JOINs')).toBeVisible();
    await expect(page.getByText('CSS Flexbox')).toBeVisible();
    await expect(page.getByText('async/await in JavaScript')).toBeVisible();
  });

  test('submit button disabled when input is empty or too short', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /Prove It/i });
    await expect(submitBtn).toBeDisabled();

    // Single character — still too short
    await page.getByLabel('Topic you just learned').fill('a');
    await expect(submitBtn).toBeDisabled();
  });

  test('submit button enabled with valid input', async ({ page }) => {
    await page.getByLabel('Topic you just learned').fill('React hooks');
    const submitBtn = page.getByRole('button', { name: /Prove It/i });
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
    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();
    await page.getByLabel('Topic you just learned').fill('React useEffect hook');
    await page.getByRole('button', { name: /Prove It/i }).click();

    // Beat 1: Identity statement — plan §7 Prompt 1
    await expect(page.getByText('You just studied')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('React useEffect hook')).toBeVisible();
    await expect(page.getByText('You know it. Now prove it.')).toBeVisible();

    // Beat 2: Friction line — auto-advances after ~2s
    await expect(page.getByText("You won't feel ready.")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Start anyway.')).toBeVisible();
  });
});

test.describe('Challenge Display (Fallback Path)', () => {
  // Without a running API backend, the frontend falls back to pre-cached challenges.
  // This tests the fallback logic — plan §11

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();
  });

  test('shows fallback challenge for React topic', async ({ page }) => {
    await page.getByLabel('Topic you just learned').fill('React useEffect hook');
    await page.getByRole('button', { name: /Prove It/i }).click();

    // Wait through framing beats + loading → challenge screen
    // Fallback triggers because no API server is running
    await expect(page.getByText('Your Challenge')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Constraints')).toBeVisible();

    // Constraint cards — plan §3 constraint types
    await expect(page.getByText('Must Use')).toBeVisible();
    await expect(page.getByText('Cannot Use')).toBeVisible();
    await expect(page.getByText('Must Handle')).toBeVisible();
    await expect(page.getByText('Deliverable')).toBeVisible();

    // Hint is collapsible
    await expect(page.getByText(/Show hint/i)).toBeVisible();

    // Start Building button
    await expect(page.getByRole('button', { name: /Start Building/i })).toBeVisible();
  });

  test('shows fallback banner when API unavailable', async ({ page }) => {
    await page.getByLabel('Topic you just learned').fill('Python list comprehensions');
    await page.getByRole('button', { name: /Prove It/i }).click();

    // Wait for challenge screen
    await expect(page.getByText('Your Challenge')).toBeVisible({ timeout: 15000 });

    // Fallback banner — plan §11
    await expect(page.getByText(/pre-cached challenge/i)).toBeVisible();
  });
});

test.describe('Attempt Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();
    await page.getByLabel('Topic you just learned').fill('CSS Flexbox');
    await page.getByRole('button', { name: /Prove It/i }).click();
    await expect(page.getByText('Your Challenge')).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /Start Building/i }).click();
  });

  test('shows editor with constraint reminders and timer', async ({ page }) => {
    // Section label
    await expect(page.getByText('Your Attempt')).toBeVisible();

    // Textarea
    const editor = page.getByLabel('Code attempt editor');
    await expect(editor).toBeVisible();
    await expect(editor).toBeFocused();

    // Timer running — plan §9
    await expect(page.getByText(/\d{2}:\d{2}/)).toBeVisible();

    // Constraint badges — plan §9 attempt screen
    await expect(page.getByText(/Use:/)).toBeVisible();
    await expect(page.getByText(/No:/)).toBeVisible();

    // Line and char count
    await expect(page.getByText('1 lines')).toBeVisible();
    await expect(page.getByText('0 chars')).toBeVisible();
  });

  test('submit button disabled until 10+ characters', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /Submit for Review/i });
    await expect(submitBtn).toBeDisabled();
    await expect(page.getByText('Write at least 10 characters')).toBeVisible();

    // Type 9 chars — still disabled
    await page.getByLabel('Code attempt editor').fill('123456789');
    await expect(submitBtn).toBeDisabled();

    // Type 10+ chars — enabled
    await page.getByLabel('Code attempt editor').fill('1234567890');
    await expect(submitBtn).toBeEnabled();
    await expect(page.getByText('Ready to submit')).toBeVisible();
  });

  test('tracks line and character count', async ({ page }) => {
    await page.getByLabel('Code attempt editor').fill('line1\nline2\nline3');
    await expect(page.getByText('3 lines')).toBeVisible();
    await expect(page.getByText('17 chars')).toBeVisible();
  });
});

test.describe('Feedback Display (With Mocked API)', () => {
  // Mock the feedback API to test the full loop without a real backend

  test('shows feedback sections on successful submit', async ({ page }) => {
    // Mock the feedback endpoint
    await page.route('**/api/generate-feedback', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          whatWorks: 'Good use of flexbox properties and proper container setup.',
          whatsMissing: 'Missing responsive breakpoint handling for mobile widths.',
          constraintCheck: 'Partial — flexbox used correctly but no wrap fallback.',
          nextStep: 'Add flex-wrap: wrap and test at 320px viewport width.',
        }),
      });
    });

    // Also mock challenge API to get predictable challenge
    await page.route('**/api/generate-challenge', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          challenge: 'Build a responsive pricing card layout using only CSS Flexbox.',
          mustUse: 'CSS Flexbox with flex-wrap',
          cannotUse: 'CSS Grid or any CSS framework',
          mustHandle: 'Cards with varying content lengths',
          deliverable: 'An HTML file with 3 responsive pricing cards',
          hint: 'Use flex-wrap: wrap on the container.',
        }),
      });
    });

    // Navigate to challenge
    await page.goto('/');
    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();
    await page.getByLabel('Topic you just learned').fill('CSS Flexbox');
    await page.getByRole('button', { name: /Prove It/i }).click();

    // Wait for challenge (now mocked — fast)
    await expect(page.getByText('Your Challenge')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Build a responsive pricing card')).toBeVisible();

    // Start building
    await page.getByRole('button', { name: /Start Building/i }).click();

    // Write code
    await page.getByLabel('Code attempt editor').fill(
      '.container {\n  display: flex;\n  gap: 1rem;\n}\n.card {\n  flex: 1;\n  padding: 2rem;\n}'
    );

    // Submit
    await page.getByRole('button', { name: /Submit for Review/i }).click();

    // Feedback screen — plan §7 Prompt 3 format, plan §9 screen table
    await expect(page.getByText('Code Review')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Iteration 1')).toBeVisible();
    await expect(page.getByText('What Works')).toBeVisible();
    await expect(page.getByText("What's Missing or Broken")).toBeVisible();
    await expect(page.getByText('Constraint Check')).toBeVisible();
    await expect(page.getByText('One Thing to Try Next')).toBeVisible();

    // Actual feedback content
    await expect(page.getByText(/Good use of flexbox/)).toBeVisible();
    await expect(page.getByText(/Missing responsive breakpoint/)).toBeVisible();
    await expect(page.getByText(/Partial/)).toBeVisible();
    await expect(page.getByText(/flex-wrap: wrap/)).toBeVisible();

    // Action buttons — plan §2 core loop
    await expect(page.getByRole('button', { name: /Try Again/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Save & Finish/i })).toBeVisible();
  });
});

test.describe('Try Again Loop', () => {
  test('returns to editor with previous feedback context', async ({ page }) => {
    // Mock APIs
    let feedbackCallCount = 0;
    await page.route('**/api/generate-feedback', async (route) => {
      feedbackCallCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          whatWorks: feedbackCallCount === 1 ? 'Basic structure is correct.' : 'Great improvement — wrap added.',
          whatsMissing: feedbackCallCount === 1 ? 'No flex-wrap handling.' : 'Could add min-width for cards.',
          constraintCheck: feedbackCallCount === 1 ? 'Partial — missing wrap.' : 'Yes — all constraints met.',
          nextStep: feedbackCallCount === 1 ? 'Add flex-wrap: wrap.' : 'Consider adding a min-width to prevent overly narrow cards.',
        }),
      });
    });

    await page.route('**/api/generate-challenge', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          challenge: 'Build a responsive card layout.',
          mustUse: 'Flexbox',
          cannotUse: 'Grid',
          mustHandle: 'Varying content',
          deliverable: 'HTML file',
          hint: 'Use flex-wrap.',
        }),
      });
    });

    // Full flow to feedback
    await page.goto('/');
    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();
    await page.getByLabel('Topic you just learned').fill('CSS Flexbox');
    await page.getByRole('button', { name: /Prove It/i }).click();
    await expect(page.getByText('Your Challenge')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Start Building/i }).click();
    await page.getByLabel('Code attempt editor').fill('.container { display: flex; }');
    await page.getByRole('button', { name: /Submit for Review/i }).click();
    await expect(page.getByText('Iteration 1')).toBeVisible({ timeout: 10000 });

    // Click Try Again — plan §2 core loop
    await page.getByRole('button', { name: /Try Again/i }).click();

    // Should be back on attempt editor with previous feedback visible
    await expect(page.getByLabel('Code attempt editor')).toBeVisible();
    await expect(page.getByText(/Previous Feedback/i)).toBeVisible();

    // Code should be preserved
    await expect(page.getByLabel('Code attempt editor')).toHaveValue('.container { display: flex; }');

    // Make improvement and submit again
    await page.getByLabel('Code attempt editor').fill('.container { display: flex; flex-wrap: wrap; }');
    await page.getByRole('button', { name: /Submit for Review/i }).click();

    // Should show iteration 2
    await expect(page.getByText('Iteration 2')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Great improvement/)).toBeVisible();
  });
});

test.describe('Artifact Save & Display', () => {
  test('saves artifact and shows confirmation with outcome', async ({ page }) => {
    // Mock all APIs
    await page.route('**/api/generate-challenge', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          challenge: 'Build a responsive card layout.',
          mustUse: 'Flexbox',
          cannotUse: 'Grid',
          mustHandle: 'Varying content',
          deliverable: 'HTML file',
          hint: 'Use flex-wrap.',
        }),
      });
    });

    await page.route('**/api/generate-feedback', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          whatWorks: 'Solid flexbox usage.',
          whatsMissing: 'Minor wrap issue.',
          constraintCheck: 'Yes — all met.',
          nextStep: 'Polish responsiveness.',
        }),
      });
    });

    await page.route('**/api/generate-outcome', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          outcome: 'responsive flexbox pricing cards',
        }),
      });
    });

    // Full flow
    await page.goto('/');
    // Clear any previous localStorage
    await page.evaluate(() => localStorage.clear());

    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();
    await page.getByLabel('Topic you just learned').fill('CSS Flexbox');
    await page.getByRole('button', { name: /Prove It/i }).click();
    await expect(page.getByText('Your Challenge')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Start Building/i }).click();
    await page.getByLabel('Code attempt editor').fill('.card { display: flex; flex-wrap: wrap; }');
    await page.getByRole('button', { name: /Submit for Review/i }).click();
    await expect(page.getByText('Code Review')).toBeVisible({ timeout: 10000 });

    // Click Save & Finish
    await page.getByRole('button', { name: /Save & Finish/i }).click();

    // Artifact saved screen — plan §8 v4 display
    await expect(page.getByText('You built')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('responsive flexbox pricing cards')).toBeVisible();
    await expect(page.getByText('(CSS Flexbox)')).toBeVisible();
    await expect(page.getByText(/1 iteration/)).toBeVisible();

    // Proof quote — plan §8
    await expect(page.getByText(/No tutorial. No copying./)).toBeVisible();

    // Action buttons
    await expect(page.getByRole('button', { name: /New Challenge/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /View Build History/i })).toBeVisible();
  });
});

test.describe('History Screen', () => {
  test('shows artifacts with "You built these" header', async ({ page }) => {
    // Pre-seed localStorage with an artifact
    await page.goto('/');
    await page.evaluate(() => {
      const artifact = {
        id: 'test-id-1',
        date: '2026-04-02',
        topic: 'React useEffect hook',
        challenge: 'Build a character counter.',
        constraints: {
          mustUse: 'useState and useEffect',
          cannotUse: 'External libraries',
          mustHandle: 'Empty input',
        },
        attempt: 'const [count, setCount] = useState(0);',
        feedback: {
          whatWorks: 'Good structure.',
          whatsMissing: 'Missing effect.',
          constraintCheck: 'Partial.',
          nextStep: 'Add useEffect.',
        },
        outcome: 'real-time character counter component',
        iterations: 2,
        status: 'completed',
      };
      localStorage.setItem('prove-it-mode-artifacts', JSON.stringify([artifact]));
    });

    await page.getByRole('button', { name: /View Build History/i }).click();

    // Header — plan §8 v4 display
    await expect(page.getByText("You didn't just learn.")).toBeVisible();
    await expect(page.getByText('You built these.')).toBeVisible();
    await expect(page.getByText(/1 challenge.* completed/)).toBeVisible();

    // Artifact entry — shows outcome, topic, date
    await expect(page.getByText(/Built: real-time character counter/)).toBeVisible();
    await expect(page.getByText(/React useEffect hook/)).toBeVisible();
    await expect(page.getByText('2026-04-02')).toBeVisible();
    await expect(page.getByText(/2 iterations/)).toBeVisible();
  });

  test('can expand artifact to see details', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const artifact = {
        id: 'test-id-2',
        date: '2026-04-02',
        topic: 'SQL JOINs',
        challenge: 'Write queries for a library system.',
        constraints: {
          mustUse: 'LEFT JOIN',
          cannotUse: 'Window functions',
          mustHandle: 'NULL contacts',
        },
        attempt: 'SELECT * FROM books LEFT JOIN borrows...',
        feedback: { whatWorks: 'Good.', whatsMissing: 'None.', constraintCheck: 'Yes.', nextStep: 'Refine.' },
        outcome: 'library query system with joins',
        iterations: 1,
        status: 'completed',
      };
      localStorage.setItem('prove-it-mode-artifacts', JSON.stringify([artifact]));
    });

    await page.getByRole('button', { name: /View Build History/i }).click();
    
    // Click to expand
    await page.getByText(/Built: library query system/).click();

    // Expanded content
    await expect(page.getByText('Challenge', { exact: true })).toBeVisible();
    await expect(page.getByText('Write queries for a library system.')).toBeVisible();
    await expect(page.getByText('Your Code')).toBeVisible();
    await expect(page.getByText(/SELECT \* FROM books/)).toBeVisible();
  });

  test('empty history shows correct message and CTA', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.getByRole('button', { name: /View Build History/i }).click();

    await expect(page.getByText('No builds yet')).toBeVisible();
    await expect(page.getByText('Complete your first challenge')).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Your First Challenge/i })).toBeVisible();
  });
});

test.describe('Feedback Error Handling', () => {
  test('shows graceful error when feedback API fails', async ({ page }) => {
    // Challenge succeeds, feedback fails — plan §11
    await page.route('**/api/generate-challenge', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          challenge: 'Build something.',
          mustUse: 'Flexbox',
          cannotUse: 'Grid',
          mustHandle: 'Edge case',
          deliverable: 'HTML file',
          hint: 'Start with container.',
        }),
      });
    });

    await page.route('**/api/generate-feedback', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/');
    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();
    await page.getByLabel('Topic you just learned').fill('CSS Flexbox');
    await page.getByRole('button', { name: /Prove It/i }).click();
    await expect(page.getByText('Your Challenge')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Start Building/i }).click();
    await page.getByLabel('Code attempt editor').fill('some code that is long enough to submit');
    await page.getByRole('button', { name: /Submit for Review/i }).click();

    // Error message — plan §11
    await expect(page.getByText(/Couldn't generate feedback/i)).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/Your attempt has been saved/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Try Submitting Again/i })).toBeVisible();
  });
});

test.describe('Full Loop — New Challenge After Save', () => {
  test('can start a new challenge after completing one', async ({ page }) => {
    // Mock all APIs
    await page.route('**/api/generate-challenge', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          challenge: 'Test challenge.',
          mustUse: 'Something',
          cannotUse: 'Something else',
          mustHandle: 'Edge case',
          deliverable: 'Output',
          hint: 'Hint.',
        }),
      });
    });
    await page.route('**/api/generate-feedback', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          whatWorks: 'Good.',
          whatsMissing: 'Nothing.',
          constraintCheck: 'Yes.',
          nextStep: 'Refine.',
        }),
      });
    });
    await page.route('**/api/generate-outcome', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ outcome: 'test build output' }),
      });
    });

    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Complete first challenge
    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();
    await page.getByLabel('Topic you just learned').fill('async/await');
    await page.getByRole('button', { name: /Prove It/i }).click();
    await expect(page.getByText('Your Challenge')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Start Building/i }).click();
    await page.getByLabel('Code attempt editor').fill('async function fetchData() { await fetch(); }');
    await page.getByRole('button', { name: /Submit for Review/i }).click();
    await expect(page.getByText('Code Review')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Save & Finish/i }).click();
    await expect(page.getByText('You built')).toBeVisible({ timeout: 10000 });

    // Start new challenge — plan §2 core loop
    await page.getByRole('button', { name: /New Challenge/i }).click();

    // Back to input screen
    await expect(page.getByText('What did you just learn?')).toBeVisible();
  });
});

test.describe('localStorage Persistence', () => {
  test('artifacts persist across page reloads', async ({ page }) => {
    // Mock APIs
    await page.route('**/api/generate-challenge', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          challenge: 'Persistent test.',
          mustUse: 'X',
          cannotUse: 'Y',
          mustHandle: 'Z',
          deliverable: 'Output',
          hint: 'Hint.',
        }),
      });
    });
    await page.route('**/api/generate-feedback', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          whatWorks: 'OK.',
          whatsMissing: 'Nothing.',
          constraintCheck: 'Yes.',
          nextStep: 'Done.',
        }),
      });
    });
    await page.route('**/api/generate-outcome', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ outcome: 'persistent test artifact' }),
      });
    });

    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Complete challenge
    await page.getByRole('button', { name: /Enter Prove It Mode/i }).click();
    await page.getByLabel('Topic you just learned').fill('persistence test');
    await page.getByRole('button', { name: /Prove It/i }).click();
    await expect(page.getByText('Your Challenge')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Start Building/i }).click();
    await page.getByLabel('Code attempt editor').fill('localStorage.setItem("key", "value");');
    await page.getByRole('button', { name: /Submit for Review/i }).click();
    await expect(page.getByText('Code Review')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Save & Finish/i }).click();
    await expect(page.getByText('You built')).toBeVisible({ timeout: 10000 });

    // Reload page
    await page.reload();

    // Navigate to history
    await page.getByRole('button', { name: /View Build History/i }).click();

    // Artifact should still be there
    await expect(page.getByText(/persistent test artifact/)).toBeVisible();
  });
});
