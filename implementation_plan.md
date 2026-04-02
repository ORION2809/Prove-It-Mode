# Implementation Plan v4 — Entrext 72-Hour Build Assignment
### Problem #4: The Silent Learning Gap

---

## Hard Truths First (Why Each Version Needed Rebuilding)

**v1 → v2:** Five structural flaws fixed:
1. **One-and-done experience** — no compounding value, no return hook
2. **ChatGPT-replaceable** — better prompts aren't a moat
3. **Passive feedback loop** — evaluation without iteration isn't learning
4. **Emotional mismatch** — the narrative was existential, the UI was sterile
5. **Overengineering risk** — syntax highlighting + multi-domain + rate limiting in 72 hours is a death sentence

**v2 → v3:** Five surgical fixes:
1. **Constraint engine felt generated, not designed** — implicit difficulty tiers, no UI change needed
2. **Artifact system missing outcome clarity** — logs vs. achievements is a product-level distinction
3. **Emotional hook needed 10% more push** — one friction line before the challenge appears
4. **Demo story not weaponized** — scripted 90-second narrative arc added
5. **Cognitive overload irony** — solving the problem while creating a version of it; one-thing-per-screen rule enforced

**v3 → v4:** The final 5% — what separates selected from shortlisted:
1. **External name was generic** — "Blank Canvas Challenger" is internal; "Prove It Mode" is the product
2. **Constraint prompt missing one signal** — real-world context injection ensures no toy problems
3. **Artifact header underselling** — identity reinforcement copy that sticks with reviewers
4. **Demo close was soft** — one final line rewritten for maximum recall
5. **No fallback logic** — pre-cached challenges + graceful error states signal production thinking

Every decision in v4 traces back to one of these fifteen problems across all three iterations.

---

## 1. Who Is the User?

**Primary User:** Self-taught learner, 18–32, actively investing time in online courses (Udemy, YouTube, freeCodeCamp, Coursera). Motivated. Completes modules. Takes notes. Feels productive — until they close the course and open a blank editor.

**The Worst Moment:** Sunday afternoon. Just finished a 4-hour section on React hooks. Feels confident. Closes the tab. Opens VS Code. The cursor blinks. Nothing comes. They Google "beginner React projects" and get a to-do app for the 11th time. They build it by following another tutorial. Two weeks later, they still feel like they can't build anything *real*.

**What They've Already Tried:**
- "Project ideas for [skill]" searches — too vague, no scaffolding, no accountability
- Build-along tutorials — they can follow, they can't initiate
- Asking ChatGPT for projects — a list, not a challenge, no pressure
- Discord servers — unstructured, rarely delivers

**Why It's Existentially Frustrating:** They don't lack knowledge. They lack the *ignition moment* — a specific, time-boxed, real-enough challenge that forces retrieval without a tutorial holding their hand. The internal question haunting them: *"Am I even learning anything?"*

---

## 2. The Feature: **Prove It Mode**

> Internal name: Blank Canvas Challenger. External name, every surface the user touches: **Prove It Mode.**

"Enter Prove It Mode." "You just learned X. Prove it." This naming aligns precisely with the emotional hook, makes the demo punch harder, and feels like a feature — not a tool. The internal name stays in code and docs. The external name is what users see, share, and remember.

### Core Loop (Non-Negotiable)
```
INPUT → CONSTRAINT-LOADED CHALLENGE → ATTEMPT → FEEDBACK → REWRITE → SAVE ARTIFACT
```

This is the entire product. Six stages. Nothing outside this loop ships in 72 hours.

### What It Does (v2 additions in **bold**)

1. User types what they just learned (e.g., *"React useEffect hook"*, *"Python list comprehensions"*)
2. **Pre-challenge framing moment:** "You just learned X. Now prove it." — one sentence, full stop
3. Gets a **constraint-loaded challenge** — not just a task, but a set of enforced thinking boundaries
4. Writes or pastes their attempt in a lightweight editor (no syntax highlighting, that's fine)
5. Receives AI-powered feedback — senior dev code review style: what works, what's broken, one next step
6. **"Try Again" button** — guided improvement loop, not just evaluation
7. **Artifact saved:** "Day 1 — Built X with Y constraint" — stored, visible, shareable

### What It Does NOT Do
- No curriculum, no courses, no streaks
- No login required to try (login only to save artifact history)
- No project idea lists
- No auto-complete or hints during attempt phase
- No leaderboards or social features (v1)
- No syntax highlighting (cut for speed, add post-72h)
- No non-code domain support (cut for scope)

### The Core Insight
The product doesn't teach. It **triggers**. But v1 forgot that triggers need return hooks. v2 creates both: the ignition moment AND the evidence of it.

### What Changes After One Use
The user experiences: *"I just built something from scratch, without a tutorial."*  
**AND:** They have proof. A saved artifact. A record of the moment it happened.  
That's the identity shift AND the return hook — both delivered in one session.

---

## 3. The Constraint Engine — Your Moat Against ChatGPT

This is the single most important addition in v2, and the most important refinement in v3.

ChatGPT can generate challenges. It cannot enforce that *you* think within specific constraints without you asking it to — and most users won't.

**Every challenge generated by Blank Canvas Challenger includes:**

| Constraint Type | Example |
|---|---|
| Must use | `useEffect` hook |
| Cannot use | External libraries |
| Must handle | One edge case (e.g., empty state) |
| Must persist | Data survives page refresh |
| Deliverable | One specific, showable thing |

### v3 Addition: Implicit Difficulty Tiers (No UI Needed)

The constraint engine infers difficulty from topic phrasing — no dropdown, no toggle, no extra user step. This is done entirely inside the prompt. The output feels designed, not generated.

| Signal in Topic | Inferred Tier | Constraint Style |
|---|---|---|
| "I just started learning X" / basic topic name | Beginner | Soft constraints — one clear restriction, forgiving edge case |
| Topic + method name (e.g., "React useEffect") | Intermediate | Stricter tradeoffs — meaningful cannot-use, real edge case |
| Topic + specific pattern (e.g., "React custom hooks with context") | Advanced | Conflicting constraints — two rules that create tension |

**Why implicit tiers beat a UI toggle:**
- Zero added friction for the user
- Output quality improves invisibly
- System feels intelligent, not mechanical
- You can tune the inference logic in the prompt without touching the UI

**Why this matters:**
- Users won't manually craft this in ChatGPT
- Constraints make it a *thinking exercise*, not just another task
- Implicit tiers create a natural difficulty gradient without exposing complexity
- This is something you can tune, improve, and own as a product feature

---

## 4. Competitor Research & Differentiation

| Competitor | What They Do | What They Miss |
|---|---|---|
| Codecademy | Guided exercises with hints | Still hand-holding, not blank-canvas |
| LeetCode / HackerRank | Algorithmic challenges | Feels like a test, not real building |
| Frontend Mentor | Real project briefs | No AI feedback, no constraints, design-only |
| ChatGPT | Generates project ideas on demand | No constraints, no feedback loop, no artifact |
| Exercism | Practice exercises with mentors | Slow feedback, no time-boxing |

**v2 Differentiation Stack:**
1. **Constraint engine** — enforced thinking boundaries (not replicable with a casual ChatGPT prompt)
2. **Iteration loop** — feedback → rewrite → improvement, not just evaluation
3. **Artifact creation** — proof of building, saved and visible
4. **Pre-challenge emotional framing** — identity-level engagement before the task
5. **Zero friction** — no signup, just type and go (save requires account)

---

## 5. Build Plan — 72-Hour Breakdown

### Ruthless Priority Rule
If time slips, cut in this order:
1. ~~Syntax highlighting~~ — plain textarea is fine
2. ~~Non-code domain support~~ — code only
3. ~~Rate limiting~~ — worry post-launch
4. ~~Mobile responsiveness~~ — desktop first
5. **Never cut:** Constraint engine, Try Again loop, Artifact save

---

### Hour 0–4: Foundation
- React + Vite project setup
- Anthropic Claude API integration (two endpoints: challenge + feedback)
- Core state machine: `INPUT → FRAMING → CHALLENGE → ATTEMPT → FEEDBACK → REWRITE → ARTIFACT`
- Basic design system: color, type, layout variables
- localStorage for artifact saving (no backend needed in v1)

### Hour 4–16: Core Feature Build
- **Challenge generation with Constraint Engine** (topic → scoped challenge + 4 constraints)
- **Pre-challenge framing screen** ("You just learned X. Now prove it.")
- Plain textarea editor (no CodeMirror — save 3 hours)
- Feedback generation (senior dev review style)
- **"Try Again" flow** — same challenge, feedback context carried forward
- **Artifact save** — localStorage, keyed by date + topic

### Hour 16–28: UI/UX
- Landing screen with sharp value proposition
- Challenge display with visual timer (non-enforced)
- Feedback display with structured sections (WHAT WORKS / WHAT'S MISSING / ONE NEXT STEP)
- **Artifact history panel** — simple list of past challenges
- Basic responsive layout

### Hour 28–40: Edge Cases + Testing
- Handle vague inputs ("I learned Python") — prompt asks for clarification or generates broad challenge
- Handle empty attempt submission — block feedback, show message
- Test 5 real challenge attempts across different skill domains
- Test the Try Again loop end-to-end

### Hour 40–60: Deployment + Real User Test
- Deploy to Vercel
- Share with 3 real learners, watch them use it (don't explain anything)
- One key observation → one targeted fix
- Final prompt tuning on constraint generation

### Hour 60–72: Reflection + Submission
- Write reflection
- Record 2-minute demo
- Finalize submission

---

## 6. Technical Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + Vite | Fast, lightweight |
| Editor | Plain `<textarea>` | Saves 2–3 hours vs CodeMirror, works fine |
| AI | Anthropic Claude API (claude-sonnet) | Best instruction-following for code feedback |
| Hosting | Vercel | Zero-config deploy |
| Styling | Vanilla CSS + CSS variables | No framework bloat |
| State | React useState/useReducer | Simple, no Redux |
| Persistence | localStorage (v1) | No backend needed, ships faster |

---

## 7. The Three Core Prompts

### Prompt 1 — Pre-Challenge Framing (UI copy, not API)

Two-beat sequence. No API call. Maximum emotional impact, zero latency.

**Beat 1 — Identity statement (shown immediately on topic submit):**
```
You just studied: [TOPIC].
You know it. Now prove it.
```

**Beat 2 — Friction line (shown for 2 seconds before challenge appears, cannot be skipped):**
```
You won't feel ready.
Start anyway.
```

This second line is doing specific work. It names the exact hesitation the user is about to feel — and pre-empts it. It converts the feeling from "I'm not ready" (stop signal) to "I'm supposed to feel this" (continue signal). Two sentences. No API call. High-impact moment.

The challenge then appears. The timer starts. Nothing else is on screen.

---

### Prompt 2 — Constraint-Loaded Challenge Generation (with Implicit Difficulty Tiers + Context Injection)
```
You are a senior software mentor. A learner just studied: "{TOPIC}".

First, silently infer their experience level from the topic phrasing:
- If the topic is a general concept or they say "just started" → BEGINNER
  → Use soft constraints: one restriction, a forgiving edge case
- If the topic includes a specific method or hook name → INTERMEDIATE  
  → Use stricter tradeoffs: a meaningful cannot-use, a real edge case
- If the topic includes a specific design pattern or architecture → ADVANCED
  → Use conflicting constraints: two rules that create genuine tension

Do NOT mention the difficulty level in your output. Just apply it.

Generate ONE brutally scoped, real-world mini-challenge. It must:
- Be attemptable in 60 minutes by someone at the inferred level
- Produce something small but genuinely useful (not a toy)
- Use {TOPIC} as the core mechanism
- Feel like a real task someone would actually need — not an exercise, not a demo

Then generate a CONSTRAINT SET calibrated to the inferred level:
- MUST USE: [specific feature/method from {TOPIC}]
- CANNOT USE: [one shortcut or library they'd naturally reach for]
- MUST HANDLE: [one real-world edge case, harder if advanced]
- DELIVERABLE: [one specific, showable output]

Format your response exactly as:
CHALLENGE: [2–3 sentences]
MUST USE: [one thing]
CANNOT USE: [one thing]
MUST HANDLE: [one edge case]
DELIVERABLE: [exactly what they produce]
HINT: [one sentence — just enough to unblock, not enough to solve]

Do not explain concepts. Do not give a tutorial. Do not suggest resources.
```

---

### Prompt 3 — Feedback + Iteration Loop
```
You are a senior developer doing a code review. Context:

CHALLENGE: "{CHALLENGE}"
CONSTRAINTS: Must use {MUST_USE}. Cannot use {CANNOT_USE}. Must handle {MUST_HANDLE}.

[If this is a rewrite, include:]
PREVIOUS FEEDBACK: "{PREVIOUS_FEEDBACK}"
IMPROVEMENT MADE: "{USER_STATED_IMPROVEMENT}"

THEIR ATTEMPT:
"{ATTEMPT}"

Respond in this exact format:
WHAT WORKS: [1–2 specific things — name the actual code/approach]
WHAT'S MISSING OR BROKEN: [1–2 concrete issues — be direct, not mean]
CONSTRAINT CHECK: [Did they meet the constraints? Yes/Partial/No + one sentence]
ONE THING TO TRY NEXT: [Single specific improvement — not a lesson, an action]

Tone: Direct and honest, like a good mentor. Not a cheerleader. Not a judge.
Under 150 words total. No code samples unless critical.
```

---

## 8. The Artifact System

Every completed attempt (attempt submitted + feedback received) creates an artifact:

```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "topic": "React useEffect",
  "challenge": "Build a...",
  "constraints": { "mustUse": "...", "cannotUse": "...", "mustHandle": "..." },
  "attempt": "user's code",
  "feedback": "AI feedback text",
  "outcome": "localStorage-backed book tracker with empty state handling",
  "iterations": 1,
  "status": "completed"
}
```

### v3 Addition: The `outcome` Field

This is the difference between a log and an achievement.

The `outcome` is auto-generated from challenge + attempt using a lightweight prompt call at save time:

```
Given this challenge: "{CHALLENGE}"
And this attempt: "{ATTEMPT}" (first 300 chars)
Write one short phrase (under 10 words) describing what was actually built.
Examples: "localStorage book tracker with empty state" / "CSV parser using list comprehensions"
Only the phrase. No punctuation. No explanation.
```

**What the user sees (before v3):**
```
📁 Your Build History
─────────────────────────
Jan 15 — React useEffect    ✓ 1 iteration
Jan 12 — Python list comprehensions    ✓ 2 iterations
```

**What the user sees (v4):**
```
You didn't just learn.
You built these.
─────────────────────────
Jan 15 — Built: localStorage book tracker  (React useEffect)    ✓
Jan 12 — Built: CSV parser from scratch  (Python list comprehensions)    ✓ 2 iter
Jan 10 — Built: live query explorer  (SQL JOINs)    ✓
```

The two-line header isn't decorative — it's identity reinforcement. It names what happened. It reframes the entire history panel from a log of activity into evidence of a shift. That's what sticks with a reviewer watching the demo.

**Why this works:**
- Creates progress identity ("I've built 3 things") — not "I've studied 3 topics"
- Return hook ("I want to add to this list")
- Portfolio-grade at a glance — showable to someone who's never seen the app
- Future monetization surface (exportable portfolio page, shareable links)

---

## 9. Screen-by-Screen UX Rules (One Thing Per Screen)

This is the cognitive overload mitigation. You're building a tool that solves the blank canvas problem — don't create a new version of it with a cluttered interface.

**Rule:** Each screen has one primary object. Everything else is suppressed.

| Screen | One Primary Object | What's Hidden |
|---|---|---|
| Input | Topic text field + submit | Everything else |
| Framing | "You won't feel ready. Start anyway." | Challenge (not shown yet) |
| Challenge | Challenge text + constraints block | Attempt area (scrolled below fold) |
| Attempt | Textarea + submit | Feedback (not shown yet) |
| Feedback | Three feedback sections | Try Again is secondary, not prominent |
| Artifact saved | "Built: [outcome]" confirmation | History panel (separate view) |
| History | List of outcomes | No challenge detail shown inline |

**Implementation note:** These aren't separate routes. They're state transitions within one page. The visual treatment (what's in view, what's greyed out, what's hidden) enforces the one-thing rule without any routing complexity.

---

## 10. Demo Script — 90-Second Narrative Arc

The plan is strong. Entrext evaluates based on how it *feels live*. Script the demo like a transformation story, not a feature walkthrough.

**Sequence:**

1. **(0:00–0:08)** Say: "I just finished learning React useEffect." Open the app. Type it. Hit enter.
2. **(0:08–0:12)** Pause on the framing screen. Let the viewer read: *"You won't feel ready. Start anyway."* Don't explain it. Let it land.
3. **(0:12–0:25)** Challenge appears. Read the constraint set aloud: "Must use useEffect. Cannot use a library. Must handle empty state." Point to it. Say: "This is what makes it a thinking exercise."
4. **(0:25–0:45)** Write 5–8 lines of real code. Don't fake it, don't hide it. The imperfection is the point.
5. **(0:45–1:00)** Submit. Show feedback sections appearing. Highlight "CONSTRAINT CHECK: Partial — empty state not handled." Say: "It caught what I missed."
6. **(1:00–1:10)** Click "Try Again." Show the challenge stays. Show feedback context carried forward. One sentence: "Same challenge, smarter now."
7. **(1:10–1:20)** Show artifact saved: "Built: useEffect-powered book tracker with empty state." Pause. Say: "That's proof."
8. **(1:20–1:30)** Show history panel with two or three entries. Close with: **"This is what learning looks like when it actually turns into building."**

**What this creates:** A mini transformation narrative. Viewer watches someone go from topic → hesitation → constraint → attempt → caught mistake → improvement → proof. That arc *is* the product. The closing line is the one sentence that reviewers will remember 20 minutes after the demo ends — keep it verbatim.

---

## 11. Fallback Logic — Production Thinking Signal

Reviewers subconsciously check one thing during any live demo: *"Will this break?"* Shipping without fallbacks signals prototype thinking. Shipping with them signals production thinking. This takes 30 minutes to implement and pays disproportionate dividends.

### Challenge Generation Fails
Pre-cache 5 high-quality challenges across common topics (React hooks, Python list comprehensions, SQL JOINs, CSS flexbox, async/await). Store in a local JSON file. If the API call fails or times out after 8 seconds, silently serve one from the cache matching the closest topic keyword.

```javascript
// Fallback trigger
const challenge = await fetchChallengeWithTimeout(topic, 8000)
  .catch(() => getLocalFallback(topic));
```

The user never sees an error. They see a challenge. Only difference: no spinner timeout.

### Feedback Generation Fails
Don't silently fail. Show:

```
Couldn't generate feedback right now.
Your attempt has been saved.
Try submitting again in a moment.
```

Three lines. Honest. Non-alarming. Preserves the attempt so nothing is lost.

### General Rule
Every API call has: a timeout, a catch block, and a user-visible state for each failure mode. No unhandled promise rejections. No blank screens. No spinner that runs forever.

This isn't extra polish — it's table stakes for a product submission to a venture studio.

---

## 12. Reflection

### Why This Problem Over the Others?
Problems 1, 2, and 5 are discovery/community problems — they need network effects to have value and can't be validated in 72 hours. Problem 3 (cognitive load) is real but fuzzy — hard to reduce to one sharp intervention.

Problem 4 is **atomic and actionable**. One clear moment of failure (blank canvas paralysis). One clear intervention (constrained, personalized challenge with a feedback loop). The entire value loop — input → generate → attempt → feedback → artifact — fits in a single session and can be felt in under 5 minutes.

### Biggest Assumption I'm Most Unsure About
That learners will *actually attempt* the challenge rather than immediately reaching for tutorials. The entire value depends on them spending time in the uncomfortable blank-canvas phase. Enforced constraints help (they can't just Google "useEffect tutorial" and copy it — they have to think within the constraints). But if users are too conditioned to reach for help, the Try Again loop also won't get used.

This needs live observation fast — watch someone use it without explaining how it works.

### What v1 Got Wrong That v2 Fixes
The framing of the challenge matters more than the challenge itself. v1 knew this about *topic specificity* but missed it about *constraint specificity*. "Build a book tracker" and "Build a book tracker using useEffect, without localStorage, that handles an empty list gracefully" produce completely different cognitive experiences. The second one is actually hard in the right way.

The other miss: one-time experiences don't build products. The artifact system isn't a feature — it's the business model's foundation. Without it, every user is a new user forever.

### Would I Personally Use This?
Yes, genuinely. The moment after finishing a tutorial where nothing starts is real and demoralizing. A challenge scoped to exactly what I just learned, with real constraints that force me to think rather than search, and feedback on my actual attempt — that's something I would have paid for.

### Path to a Paid Product

**Free tier (no login):**
- 3 challenges per day
- No artifact history saved

**Free account:**
- Unlimited challenges
- Full artifact history
- Shareable challenge links ("I built this — no tutorial, no help")

**$5–9/month:**
- Constraint difficulty settings (beginner / intermediate / hard)
- Weekly challenge streaks based on your weakest skill (inferred from history)
- Export artifact history as a portfolio page

**Bigger business:**
This feature is a wedge into a "proof of learning" platform. Employers don't care about certificates — they care about demonstrated ability to build under constraints. A portfolio of completed Blank Canvas Challenges, timestamped and constraint-verified, becomes a new kind of skills credential. Partner with bootcamps or hiring platforms as a white-label assessment tool. The constraint engine becomes the proprietary IP.

---

## 13. Success Metrics (Week 1)

| Metric | Target | Why |
|---|---|---|
| Challenges generated | 50+ | Baseline usage |
| Attempts submitted | 30%+ of challenges | Core engagement (not just browse) |
| Try Again used | 20%+ of completions | Validates iteration loop |
| Artifacts saved | 40%+ of completions | Validates return hook |
| Return visits | 20%+ | Product has legs |
| "Would use again" (informal) | 4+ / 5 | Subjective signal |

---

## 14. Ruthless 72-Hour Scope Enforcement

### Ships No Matter What
- [ ] "Prove It Mode" branding on all user-facing surfaces
- [ ] Input → Constraint challenge generation (implicit tiers + context injection)
- [ ] Pre-challenge framing: identity beat + friction line ("You won't feel ready. Start anyway.")
- [ ] Plain textarea attempt editor
- [ ] AI feedback with constraint check
- [ ] "Try Again" loop
- [ ] Artifact save to localStorage (with `outcome` field)
- [ ] Artifact history: "You didn't just learn. You built these." header
- [ ] Fallback: pre-cached challenges for API failure
- [ ] Fallback: graceful feedback error state (attempt preserved)
- [ ] Deployed to Vercel

### Ships If Time Allows
- [ ] Syntax highlighting (CodeMirror)
- [ ] Shareable artifact links
- [ ] Mobile responsive layout
- [ ] Rate limiting

### Does Not Ship in 72 Hours
- Non-code domain support
- Authentication / accounts
- Analytics
- Leaderboards or social features

---

*Built for Entrext 72-Hour Assignment. One feature. One loop. Real output.*
*"This is what learning looks like when it actually turns into building."*