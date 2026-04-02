const FALLBACK_TRAPS = [
  {
    keywords: ['react', 'hook', 'useeffect', 'effect', 'usestate', 'state'],
    snippets: [
      `useEffect(() => {
  setCount(count + 1);
}, []);
// "This runs once and increments count by 1"`,
      `useEffect(() => {
  const data = await fetch('/api/user');
  setUser(data);
}, [userId]);`,
      `const [items, setItems] = useState([]);
items.push(newItem);
setItems(items);`,
    ],
    wrongBecause: [
      'The empty dependency array means this captures the initial value of count via closure. It will always use 0, not the current count. The functional updater setCount(c => c + 1) is needed.',
      'useEffect callbacks cannot be async directly — await inside a non-async function is a syntax error. You need to define an async function inside the effect and call it.',
      'Mutating the existing array reference (push) and passing the same reference to setItems means React sees no change and won\'t re-render. You need setItems([...items, newItem]).',
    ],
  },
  {
    keywords: ['python', 'list', 'comprehension', 'dict', 'dictionary'],
    snippets: [
      `defaults = {"theme": "dark", "lang": "en"}
user_settings = defaults
user_settings["theme"] = "light"
# defaults is still {"theme": "dark", "lang": "en"}`,
      `matrix = [[0] * 3] * 3
matrix[0][0] = 1
# Only matrix[0][0] is 1`,
      `squares = [x**2 for x in range(10) if x**2 > 20 else 0]`,
    ],
    wrongBecause: [
      'Assignment in Python creates a reference, not a copy. user_settings and defaults point to the same dict. Changing one changes both. Need defaults.copy() or dict(defaults).',
      'Multiplying a list of lists creates references to the SAME inner list. matrix[0][0] = 1 actually changes all three rows. Need [[0]*3 for _ in range(3)].',
      'You cannot use if/else (ternary) in the filter clause of a list comprehension. The filter clause only takes if, not if/else. The ternary goes before the for: [x**2 if x**2 > 20 else 0 for x in range(10)].',
    ],
  },
  {
    keywords: ['sql', 'join', 'query', 'database', 'select'],
    snippets: [
      `SELECT * FROM orders
LEFT JOIN customers ON orders.customer_id = customers.id
WHERE customers.country = 'US';`,
      `SELECT department, employee_name, MAX(salary)
FROM employees
GROUP BY department;`,
      `SELECT * FROM products
WHERE price > AVG(price);`,
    ],
    wrongBecause: [
      'The WHERE clause on customers.country filters out NULL rows from the LEFT JOIN, effectively converting it to an INNER JOIN. The filter should be in the ON clause or use a subquery to preserve all orders.',
      'employee_name is not in the GROUP BY clause and not aggregated. Most SQL engines will error. The query implies getting the highest-paid employee per department, which requires a subquery or window function.',
      'You cannot use aggregate functions like AVG() directly in a WHERE clause. WHERE filters rows before aggregation. Need a subquery: WHERE price > (SELECT AVG(price) FROM products).',
    ],
  },
  {
    keywords: ['css', 'flex', 'grid', 'layout', 'responsive'],
    snippets: [
      `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
/* This perfectly centers the child vertically */`,
      `.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}
/* On a 900px screen, each column is exactly 300px */`,
      `.parent { position: relative; }
.child { position: absolute; top: 50%; left: 50%; }
/* This centers the child element */`,
    ],
    wrongBecause: [
      'height: 100% only works if the parent has a defined height. If the parent is body or a div with no explicit height, 100% resolves to 0. Need min-height: 100vh or a parent with explicit height.',
      'The gap property takes space away from the available area before distributing 1fr. Each column is (900px - 2*20px) / 3 = ~287px, not 300px. The gap is gutters between columns.',
      'top: 50% and left: 50% positions the top-left corner of the child at the center, not the child itself. The child is offset right and down. Need transform: translate(-50%, -50%) to shift it back by half its own size.',
    ],
  },
  {
    keywords: ['async', 'await', 'promise', 'fetch', 'api', 'javascript', 'js'],
    snippets: [
      `async function getData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Network error');
  }
}
// This catches all errors from the API`,
      `const results = urls.map(async (url) => {
  return await fetch(url);
});
// results is an array of responses`,
      `const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done'), 1000);
});
promise.then(console.log);
promise.then(console.log);
// 'done' prints once`,
    ],
    wrongBecause: [
      'fetch() only rejects on network errors. A 404 or 500 response does NOT throw — it resolves with response.ok === false. This code silently treats server errors as success. Need to check response.ok before parsing.',
      'Array.map with an async callback returns an array of Promises, not resolved values. results is Promise[] not Response[]. Need await Promise.all(results) to get actual responses.',
      'Each .then() registers an independent handler. The promise resolves once, but both handlers fire. "done" prints twice, not once. Promises multicast to all registered handlers.',
    ],
  },
];

export function getFallbackTrap(topic) {
  const lower = topic.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const fallback of FALLBACK_TRAPS) {
    const score = fallback.keywords.reduce(
      (total, kw) => total + (lower.includes(kw) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      bestMatch = fallback;
    }
  }

  if (!bestMatch || bestScore === 0) {
    const idx = Math.floor(Math.random() * FALLBACK_TRAPS.length);
    bestMatch = FALLBACK_TRAPS[idx];
  }

  return {
    snippets: bestMatch.snippets,
    wrongBecause: bestMatch.wrongBecause,
  };
}
