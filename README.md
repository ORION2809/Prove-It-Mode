# Mental Model Stress Tester

> You don't need another project idea. You need to know exactly where your understanding breaks.

Most people finish tutorials and feel like they understood everything. They open VS Code — and nothing comes. The real problem isn't motivation or ideas. It's hidden holes in their mental model they can't see.

This exposes where your understanding breaks — before you try to build anything.

Most people don't fail because they lack knowledge.
They fail because they don't know where they're wrong.

## What This Is Not

This is intentionally not a project generator or planner.

The initial instinct for this problem is to give users something to build.
That approach already exists — and was explicitly avoided here.

This focuses only on diagnosing gaps before any building begins.

## Live Demo

**https://assignment-ruby-kappa.vercel.app**

## What to Try (90 seconds)

You'll think you understand it.
This will show you where you don't.

1. Click "Stress test my understanding"
2. Type: `React useEffect hook`
3. Read the 3 code snippets — each one looks correct but is subtly wrong
4. Explain what's wrong with each in your own words
5. Submit — see your mental model diagnosis

That's the entire product. One session. Full value.

## Why This Exists

Understanding and the illusion of understanding feel identical from the inside. A learner who just finished a tutorial can't tell the difference. So they sit down to build and the gaps surface mid-implementation — with no map to find them.

Every tool in the learning space is additive. This one is **subtractive**. It doesn't give you knowledge. It removes false confidence and replaces it with a precise diagnosis.

## How It Works

1. You type what you just studied
2. Three code snippets appear — each looks plausible, each is subtly wrong
3. You explain what's wrong with each in your own words
4. The Mirror reflects back: what's solid, where it breaks, and the one thing to fix

If you tried to build now, this is where you would fail.

No correct answer is shown. No score. No tracking. Just clarity.

## Why This Doesn't Exist Yet

| Tool | What it does | What it misses |
|------|-------------|----------------|
| Quizzes | Test recall (did you remember?) | Recall ≠ understanding |
| Flashcards | Spaced repetition | Same — memory, not comprehension |
| LeetCode | Tests implementation skill | Not conceptual clarity |
| ChatGPT | Answers questions | Gives answers, not diagnoses |
| **This** | **Exposes gaps in your mental model** | — |

The key mechanisms:
- **Wrong-answer injection** — showing plausible-but-wrong code is something no tool does systematically
- **Free-text confession** — forces articulation, the only reliable test of understanding
- **Non-graded reflection** — the Mirror diagnoses, it doesn't score

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Note:** Without an NVIDIA API key, the app uses pre-cached fallback traps for 5 common topics. To enable AI-generated traps and diagnosis, set up the API key (see below).

## Full Stack (with AI)

1. Copy `.env.example` to `.env` and add your [NVIDIA API key](https://build.nvidia.com/)
2. Install the [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
3. Run `vercel dev` to start both frontend and API

## Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add `NVIDIA_API_KEY` as an environment variable
4. Deploy

Vercel auto-detects Vite and sets up the serverless functions in `/api`.

## Architecture

```
src/
├── components/       # One component per screen
│   ├── Landing       # "You think you understand it"
│   ├── TopicInput    # "What did you learn?"
│   ├── Framing       # Emotional beat sequence
│   ├── TrapDisplay   # 3 snippets + free-text confession boxes
│   └── MirrorDisplay # SOLID / BROKEN / ONE FIX diagnosis
├── hooks/
│   └── useAppState   # State machine (useReducer)
├── lib/
│   ├── api           # API calls with timeout + fallback
│   └── fallbacks     # Pre-cached trap sets (5 topics)
└── App.jsx           # Screen orchestrator

api/
├── _nvidia.js        # Shared NVIDIA API client
├── generate-trap.js  # Misconception trap generator (Llama 3.1 70B)
└── generate-mirror.js # Mental model diagnosis (Llama 3.1 70B)
```

## Core Loop

```
LANDING → INPUT → FRAMING → TRAP → MIRROR
                                      ↓
                              [Stress Test Another Topic]
```

No history. No artifacts. No persistent state. Mirrors don't store anything.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| AI | NVIDIA API (Llama 3.1 70B Instruct) |
| Hosting | Vercel |
| Persistence | None — session only |
| State | useReducer |

## Fallback Logic

- **Trap generation fails:** Serves pre-cached trap sets for 5 common topics (React hooks, Python lists, SQL JOINs, CSS layout, async/await)
- **Mirror generation fails:** Shows error message, confessions stay populated — user doesn't lose their work
- **All API calls:** Timeout after 15s with graceful fallback

---

## The User

Self-taught learner, 18–32. Just finished a course section on something like React hooks or Python data structures. Feels like they understood it. Opens VS Code. Nothing comes.

**When the problem feels worst:** Two hours into trying to build something, when they realize they don't understand why their useEffect runs infinitely. They thought they understood. They didn't know what they didn't know. If they had known *before* opening the editor, they would have fixed the gap first.

**What they've already tried:**
- Re-watching the course section — doesn't reveal what's broken, just repeats what they heard
- Googling the error — treats the symptom, not the broken mental model
- Asking ChatGPT — gets an answer, not a diagnosis of why they were wrong
- Flashcards / quizzes — tests whether they remember the right answer, not whether they understand why

**Why it's frustrating:** They can't tell the difference between understanding something and *thinking* they understand it. Both feel identical from the inside. So they keep hitting the same wall without knowing why.

---

## Why Problem #4

The other problems are real, but Problem #4 has a non-obvious insight that makes for a genuinely different product.

The obvious solution to "I finished courses but can't build" is: give them a project. Constrain it. Review it. That's a project planner — and the assignment explicitly says not to build one.

The non-obvious insight: **the blank canvas isn't a motivation problem. It's a diagnostic problem.** Learners can't build because they have hidden holes in their mental model. They don't know where their understanding breaks. Every existing tool adds something (more courses, more content, more challenges). This one *removes* something — false confidence — and replaces it with a precise map of what to fix.

That conceptual inversion is what makes it genuinely different from anything in the market.

## Competitor Analysis

| Competitor | What They Do | What They Miss |
|---|---|---|
| Codecademy quizzes | Multiple choice recall tests | Tests memory, not understanding |
| Anki / flashcards | Spaced repetition | Recall ≠ comprehension |
| LeetCode | Algorithmic problem solving | Tests implementation, not conceptual clarity |
| ChatGPT / Copilot | Answers questions on demand | Gives answers, not diagnoses |
| Feynman technique (DIY) | "Explain it to yourself" | No structured stress-test, no AI-powered feedback |

**Our differentiation:** Wrong-answer injection (no tool shows you plausible-but-wrong code systematically), free-text confession (forces articulation — the only real test of understanding), and non-graded reflection (diagnoses, doesn't score).

## Reflection

**Assumption I'm most unsure about:** That users will be comfortable writing free-text explanations that expose their gaps — even to themselves. The confession step is the product's core value, but it's also the biggest friction point. Mitigation: the framing positions it as discovery ("Let's find out"), not a test. No score, no judgment.

**What surprised me while building:** How much richer the fallback trap sets are than I expected. Writing plausible-but-wrong code that tests conceptual understanding — not syntax — is genuinely hard. The quality of those traps *is* the product. If they're too obvious, it feels like a quiz. If they're too obscure, it feels unfair.

**Would I use this personally?** Yes — specifically before starting a project with a technology I just learned. Five minutes of stress-testing is cheaper than two hours of debugging a gap I didn't know existed.

**Path to a paid product:**
- **Consumer:** Free, no login. One session, one diagnosis. The return hook is "stress test before I build" — a pre-build ritual that earns trust for a future paid tier with deeper diagnostics.
- **B2B wedge:** Every online course platform has a completion problem — students finish videos without understanding. This tool, embedded as a checkpoint before module unlock, gives course platforms a verifiable comprehension signal. Not "did you watch" but "do you understand." License to Udemy, Coursera, bootcamps. The trap generation engine becomes proprietary IP.

---

*Built for Entrext 72-Hour Assignment. Problem #4: The Silent Learning Gap.*
