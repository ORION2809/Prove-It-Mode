const FALLBACK_CHALLENGES = [
  {
    keywords: ['react', 'hook', 'useeffect', 'effect', 'usestate', 'state'],
    challenge:
      'Build a real-time character counter that tracks text input and warns the user visually when they approach a character limit. The counter should change color at 80% capacity and disable input at 100%.',
    mustUse: 'useState and useEffect hooks',
    cannotUse: 'Any external form library or CSS framework',
    mustHandle: 'Empty input state and paste events that exceed the limit',
    deliverable:
      'A working character counter component that responds in real-time',
    hint: 'useEffect can watch the input length and trigger side effects like color changes',
  },
  {
    keywords: ['python', 'list', 'comprehension', 'dict', 'dictionary'],
    challenge:
      'Build a CSV data transformer that reads a multi-line CSV string, filters rows based on a condition, and outputs a new formatted string. No libraries — just raw Python string manipulation and list comprehensions.',
    mustUse: 'List comprehensions for all data transformations',
    cannotUse: 'csv module, pandas, or any import',
    mustHandle: 'Rows with missing fields and extra whitespace',
    deliverable: 'A function that takes a CSV string and returns a cleaned, filtered CSV string',
    hint: 'Split by newline first, then split each line by comma — but watch for edge cases in the data',
  },
  {
    keywords: ['sql', 'join', 'query', 'database', 'select'],
    challenge:
      'Write a set of SQL queries for a small library system: find all books that have never been borrowed, find the most active borrower this month, and find overdue books with borrower contact info.',
    mustUse: 'LEFT JOIN and subqueries',
    cannotUse: 'Window functions or CTEs',
    mustHandle: 'Books with no borrow records and borrowers with NULL contact info',
    deliverable: 'Three working SQL queries with comments explaining the join logic',
    hint: 'A LEFT JOIN with a WHERE NULL check is how you find records with no matches',
  },
  {
    keywords: ['css', 'flex', 'grid', 'layout', 'responsive'],
    challenge:
      'Build a responsive pricing card layout that shows 3 cards on desktop, 2 on tablet, and 1 on mobile. The middle card should be visually elevated as the "recommended" option with a badge.',
    mustUse: 'CSS Grid with named areas or Flexbox with wrapping',
    cannotUse: 'Any CSS framework (Bootstrap, Tailwind, etc.)',
    mustHandle: 'Cards with varying content lengths aligning consistently',
    deliverable: 'An HTML file with embedded CSS showing the responsive pricing layout',
    hint: 'CSS Grid template columns with minmax() handles the responsive behavior without media queries',
  },
  {
    keywords: ['async', 'await', 'promise', 'fetch', 'api', 'javascript', 'js'],
    challenge:
      'Build a retry-capable data fetcher that attempts to load data from an API endpoint up to 3 times with exponential backoff. It should show the user which attempt is in progress and handle all failure modes.',
    mustUse: 'async/await with a manual retry loop',
    cannotUse: 'axios, fetch-retry, or any retry library',
    mustHandle: 'Network errors, non-200 status codes, and timeout after 5 seconds per attempt',
    deliverable: 'A reusable fetchWithRetry function and a small demo that displays status',
    hint: 'Use a for loop with await and setTimeout wrapped in a Promise for the backoff delay',
  },
];

export function getFallbackChallenge(topic) {
  const lower = topic.toLowerCase();

  // Find best matching fallback by keyword overlap
  let bestMatch = null;
  let bestScore = 0;

  for (const fallback of FALLBACK_CHALLENGES) {
    const score = fallback.keywords.reduce(
      (total, kw) => total + (lower.includes(kw) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      bestMatch = fallback;
    }
  }

  // If no keyword match, return a random challenge
  if (!bestMatch || bestScore === 0) {
    const idx = Math.floor(Math.random() * FALLBACK_CHALLENGES.length);
    bestMatch = FALLBACK_CHALLENGES[idx];
  }

  return {
    challenge: bestMatch.challenge,
    mustUse: bestMatch.mustUse,
    cannotUse: bestMatch.cannotUse,
    mustHandle: bestMatch.mustHandle,
    deliverable: bestMatch.deliverable,
    hint: bestMatch.hint,
  };
}
