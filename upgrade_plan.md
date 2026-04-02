# Pivot Plan — Prove It Mode → Mental Model Stress Tester
### Problem #4: The Silent Learning Gap (Re-Conceptualized)

---

## Why We're Pivoting

The original plan built the obvious solution. Given "learner can't build after a course," the instinct was: give them a project. Constrain it. Review it. Save it.

That's a project planner. Disha was right.

The non-obvious insight we missed: **the blank canvas problem isn't a motivation problem or a project-ideas problem. It's a diagnostic problem.** Learners can't build because they have hidden holes in their mental model. They don't know where exactly their understanding breaks. So when they sit down to build, the holes surface mid-implementation with no map to find them.

Every tool in the learning space is additive — courses add knowledge, notes apps add content, challenge generators add tasks. The Mental Model Stress Tester is **subtractive**. It doesn't give you anything. It removes false confidence and replaces it with a precise diagnosis. That's the conceptual inversion that makes it genuinely different.

**One-line pitch:** *"You don't need another project idea. You need to know exactly where your understanding breaks."*

---

## What Gets Thrown Away From v4

| v4 Component | Status | Reason |
|---|---|---|
| Constraint engine | ❌ Removed | Challenges are the wrong intervention |
| Attempt editor | ❌ Removed | Users explain, they don't build |
| Try Again loop | ❌ Removed | Replaced by the Mirror (one session, one diagnosis) |
| Artifact save system | ❌ Removed | No persistent state needed — this is a mirror, not a tracker |
| History panel | ❌ Removed | Nothing to track |
| Framing beat 1 & 2 | ✅ Kept | Emotional hook is still valid, copy changes |
| State machine pattern | ✅ Kept | Same architecture, different screens |
| API layer (lib/api.js) | ✅ Kept | Two new endpoints replace the old two |
| Fallback logic pattern | ✅ Kept | Pre-cached traps for API failure |
| Vercel deployment | ✅ Kept | No changes needed |
| React + Vite stack | ✅ Kept | No changes needed |

**What this means in practice:** same repo, same infrastructure, same deployment pipeline. Rip out 4 components, rewrite 2 API endpoints, replace 2 components, update the state machine. This is a 12–16 hour rebuild, not a 72-hour restart.

---

## 1. Who Is the User (Reframed)

Same person. Different problem being solved for them.

**Primary User:** Self-taught learner, 18–32. Just finished a course section. Feels like they understood it. Opens VS Code. Nothing comes. The real reason — which they can't articulate — is that their mental model has specific holes they can't see. They know the syntax but not the *why*. They can follow along but can't initiate because initiating requires a complete mental model, not a partial one.

**The Worst Moment (Reframed):** It's not the blank canvas. It's the moment two hours into trying to build something when they realize they don't know why their useEffect is running infinitely. They thought they understood it. They didn't know what they didn't know. If they had known *before* opening VS Code, they'd have fixed the gap first. That's what this tool does.

**What They've Already Tried:**
- Re-watching the course section — doesn't reveal what's wrong, just repeats what they heard
- Googling the error — treats the symptom, not the broken mental model
- Asking ChatGPT — gets an answer, not a diagnosis
- Flashcards / quizzes — tests recall, not understanding

**Why It's Different Now:** The user doesn't need a challenge. They need a mirror held up to their mental model before they start building. That changes everything about what the product does.

---

## 2. The Feature: **Mental Model Stress Tester**

### The Core Insight (New)

Understanding and the *illusion* of understanding feel identical from the inside. The only way to tell them apart is to stress-test the model — present it with something subtly wrong and see if it catches it, and more importantly, see if it can explain *why* it's wrong.

Explaining why requires a complete mental model. Most learners after a course have an incomplete one. This tool reveals exactly which parts are incomplete.

### Core Loop (New)
```
TOPIC INPUT → FRAMING → THE TRAP (3 wrong snippets) → CONFESSION (free-text explanations) → THE MIRROR (diagnosis)
```

Five stages. Nothing outside this loop ships.

### Three Acts

**Act 1 — The Trap**
User types their topic. App generates 3 short code snippets or conceptual statements. Each one looks plausible. Each one is subtly, specifically wrong in a different way. The wrongness is never syntax errors — always conceptual. The kind of mistake someone makes when they half-understood something from a tutorial. No instructions beyond: *"What's wrong with each of these?"*

**Act 2 — The Confession**
User types their explanation for each snippet in a free-text box. No multiple choice. No hints. No word minimum. They have to articulate what's wrong in their own words. This is where the holes show up — not in what they write, but in what they can't write. Vague explanations reveal vague understanding.

**Act 3 — The Mirror**
AI doesn't grade them. It reflects. It analyzes what they wrote — or failed to write — and produces a structured diagnosis:
- What their mental model has solid (with evidence from their own words)
- Where their mental model has a specific gap (named precisely)
- The one concept to fix before they try to build anything

No score. No badge. No task list. Just a precise diagnosis in plain language.

### What It Does NOT Do
- No challenges or projects to complete
- No tracking, history, or artifact system
- No login required — ever (no persistent state needed)
- No multiple choice or quiz format (that tests recall, not understanding)
- No "correct answer" shown (diagnostic only, not instructional)
- No streaks, scores, or gamification

### What Changes After One Session
The user knows exactly one thing they didn't know before: where their mental model breaks and what to fix. That's the entire value. Delivered in under 5 minutes. No tutorial required.

---

## 3. Why This Isn't a Project Planner

| Dimension | Prove It Mode (old) | Mental Model Stress Tester (new) |
|---|---|---|
| Core action | Build something | Explain something |
| Output | Code artifact | Diagnosis |
| Persistent state | Yes — history panel | No — session only |
| Success metric | Task completed | Gap identified |
| Return hook | "Add to my build list" | None needed — one session has full value |
| Category | Project planner | Diagnostic tool |

There is no list. No task. No artifact. No tracker. The product delivers its entire value in a single session and disappears. That's the structural difference.

---

## 4. Competitor Analysis (Updated)

| Competitor | What They Do | What They Miss |
|---|---|---|
| Codecademy quizzes | Multiple choice recall tests | Tests memory, not mental model completeness |
| Anki / flashcards | Spaced repetition recall | Same — recall ≠ understanding |
| LeetCode | Algorithmic problem solving | Tests implementation skill, not conceptual clarity |
| ChatGPT | Answers questions on demand | Gives answers, not diagnoses |
| Feynman technique (DIY) | Explain it to yourself | No structured stress-test, no AI feedback |

**Our differentiation:**
1. **Wrong-answer injection** — showing plausible-but-wrong code is something no tool does systematically
2. **Free-text confession** — forces articulation, which is the only reliable test of understanding
3. **Non-graded reflection** — the Mirror doesn't score, it diagnoses. Completely different relationship with the user
4. **Zero persistent state** — no tracker, no history, no list. Passes the "not a planner" test structurally

---

## 5. New Component Map

### Components to Delete
- `AttemptEditor.jsx` — replaced by `ConfessionEditor.jsx`
- `ChallengeDisplay.jsx` — replaced by `TrapDisplay.jsx`
- `FeedbackDisplay.jsx` — replaced by `MirrorDisplay.jsx`
- `ArtifactSaved.jsx` — removed entirely
- `History.jsx` — removed entirely
- `Timer.jsx` — removed entirely

### Components to Keep (with copy changes only)
- `Landing.jsx` — new headline, new CTA copy
- `TopicInput.jsx` — no changes
- `Framing.jsx` — beat 1 copy changes, beat 2 stays identical
- `LoadingScreen.jsx` — new messages

### Components to Write
- `TrapDisplay.jsx` — shows 3 snippets with free-text boxes, one at a time or all three
- `ConfessionEditor.jsx` — textarea per snippet, submit when all three answered
- `MirrorDisplay.jsx` — three-section diagnosis: SOLID / BROKEN / ONE FIX

### State Machine Changes
Remove: `CHALLENGE`, `ATTEMPT`, `LOADING_FEEDBACK`, `FEEDBACK`, `SAVING_ARTIFACT`, `ARTIFACT_SAVED`, `HISTORY`

Add: `TRAP`, `CONFESSION`, `LOADING_MIRROR`, `MIRROR`

New machine:
```
LANDING → INPUT → FRAMING_BEAT1 → FRAMING_BEAT2 → LOADING_TRAP → TRAP → LOADING_MIRROR → MIRROR
```

---

## 6. New API Endpoints

### Replace `generate-challenge.js` → `generate-trap.js`

```
You are a senior software educator who specializes in revealing misconceptions.

A learner just studied: "{TOPIC}".

Generate exactly 3 code snippets or conceptual statements about {TOPIC}.

Rules for each:
- Each must look plausible at first glance — a learner who half-understood would accept it
- Each must be subtly, specifically WRONG in a conceptually meaningful way
- The wrongness must NOT be a syntax error — it must be a conceptual misunderstanding
- Each must test a different aspect of {TOPIC}
- Each wrong should represent a different common misconception beginners have

Format EXACTLY as:
SNIPPET_1: [the code or statement]
WRONG_BECAUSE_1: [internal note — what the actual error is, used for Mirror generation only]
SNIPPET_2: [the code or statement]
WRONG_BECAUSE_2: [internal note]
SNIPPET_3: [the code or statement]
WRONG_BECAUSE_3: [internal note]

Do not label them as wrong. Do not add any explanation. Just the snippets.
```

The `WRONG_BECAUSE` fields are never shown to the user — they're passed to the Mirror endpoint as ground truth for generating the diagnosis.

---

### Replace `generate-feedback.js` → `generate-mirror.js`

```
You are a diagnostic tool for mental models. You do not teach. You reflect.

TOPIC: "{TOPIC}"

THE THREE TRAPS (what was actually wrong with each):
Trap 1 was wrong because: {WRONG_BECAUSE_1}
Trap 2 was wrong because: {WRONG_BECAUSE_2}
Trap 3 was wrong because: {WRONG_BECAUSE_3}

WHAT THE LEARNER SAID:
About Trap 1: "{CONFESSION_1}"
About Trap 2: "{CONFESSION_2}"
About Trap 3: "{CONFESSION_3}"

Analyze their explanations. A vague explanation reveals a vague mental model.
A confident wrong explanation reveals a specific misconception.
Silence or "I don't know" reveals a gap.

Respond in EXACTLY this format:
SOLID: [1–2 things their mental model has right — cite their actual words as evidence]
BROKEN: [The single most important gap, named precisely — not a list, one thing]
ONE FIX: [The exact concept they need to understand before building anything with {TOPIC} — one sentence, an action not a lesson]

Tone: Like a diagnostic report. Not encouraging, not harsh. Precise.
Under 120 words total. No code samples. No suggestions to re-watch anything.
```

---

### Remove `generate-outcome.js` entirely
No artifact system. No outcome needed.

---

## 7. New Framing Copy

### Beat 1 (updated)
```
You just studied: [TOPIC].
You think you understand it.
Let's find out where you actually do.
```

### Beat 2 (unchanged — still perfect)
```
You won't feel ready.
Start anyway.
```

The beat 2 copy works even better here. The user is about to be confronted with something that might expose gaps. The hesitation is more real. The line hits harder.

---

## 8. The Mirror Display — UX Spec

Three sections. Clean. No score anywhere.

```
┌─────────────────────────────────────────┐
│  YOUR MENTAL MODEL                      │
│  React useEffect                        │
├─────────────────────────────────────────┤
│  ✓  WHAT'S SOLID                        │
│  You correctly identified that cleanup  │
│  functions prevent memory leaks — your  │
│  own words showed you understand why.   │
├─────────────────────────────────────────┤
│  ✗  WHERE IT BREAKS                     │
│  Your mental model of the dependency    │
│  array is incomplete. You know what it  │
│  does but not why stale closures happen.│
├─────────────────────────────────────────┤
│  →  ONE THING TO FIX                    │
│  Understand what a closure captures     │
│  at the time of render — then the       │
│  dependency array will make sense.      │
└─────────────────────────────────────────┤
│  [ Stress Test Another Topic ]          │
└─────────────────────────────────────────┘
```

No save button. No history link. No score. The CTA is to do it again with a different topic — the only form of return hook that doesn't make this a tracker.

---

## 9. Fallback System (Updated)

### If `generate-trap` fails
Pre-cache 5 trap sets for common topics (React hooks, Python lists, async/await, SQL JOINs, CSS flexbox). Same keyword-matching logic from `fallbacks.js`. User never sees an error — they see traps.

### If `generate-mirror` fails
Show:
```
Couldn't generate your diagnosis right now.
Try submitting again — your explanations are still here.
```
Critically: the confession textareas stay populated. The user doesn't lose their work.

---

## 10. New Demo Script — 90 Seconds

This demo is more visceral than the old one because the user is being exposed, not completing a task.

1. **(0:00–0:08)** "I just finished learning React useEffect. I feel like I get it." Open the app. Type it. Hit enter.
2. **(0:08–0:14)** Framing screens. Pause on "You won't feel ready. Start anyway." Let it land.
3. **(0:14–0:30)** Three snippets appear. Read the first one aloud. Say: "This looks fine to me." Type an explanation that's slightly vague — realistic.
4. **(0:30–0:45)** Second snippet. Pause. Type something less confident. Third snippet — type "I'm not sure."
5. **(0:45–0:55)** Submit. Loading. Mirror appears.
6. **(0:55–1:15)** Read SOLID section. Then BROKEN: "Your mental model of the dependency array is incomplete." Pause. Say: *"That's exactly why I couldn't build anything. I didn't know I had this gap."*
7. **(1:15–1:25)** Read ONE FIX. Say: "Now I know exactly what to fix before I open VS Code."
8. **(1:25–1:30)** Close: **"This is what learning looks like when you finally know what you don't know."**

The emotional arc is: confidence → exposure → diagnosis → clarity. That's a story nobody else is telling.

---

## 11. Reflection (Updated for New Concept)

### Why This Concept Over the Original?
The original Prove It Mode solved the right problem with the wrong model. Giving someone a constrained project assumes their mental model is complete enough to execute — it just adds pressure. But if the mental model has holes, pressure doesn't fix it. Diagnosis does.

The Mental Model Stress Tester solves the problem one step earlier: before the blank canvas, before the attempt, before the frustration. It answers the question the learner is actually asking: *"Do I actually understand this, or do I just think I do?"*

### What This Is Not
It's not a quiz. Quizzes test recall — whether you remember the right answer. This tests understanding — whether you can identify what's wrong with a plausible-looking wrong answer and explain why. Those are completely different cognitive operations.

It's not a notes tool. Nothing is saved. Nothing is organized. Nothing is summarized.

It's not a project planner. There's no task, no deliverable, no checklist, no history.

It's a mirror. Mirrors don't store anything.

### Biggest Risk
That users find the confession step too uncomfortable and abandon before submitting. The free-text explanation asks them to be wrong in public — even if only to themselves. Mitigation: the framing ("Let's find out where you actually do") positions this as discovery, not a test. No score, no judgment, no wrong answer shown.

### Path to a Product
**Consumer:** Free, no login. One session, one diagnosis. Return hook is: "I want to stress-test my understanding of X before I start building." This is a pre-build ritual, not a tracker.

**B2B wedge:** Every online course has a completion problem — students finish videos without understanding. This tool, embedded as a checkpoint before module unlock, gives course platforms verifiable comprehension signals. Not "did you watch" but "do you understand." License to Udemy, Coursera, bootcamps. The trap generation becomes the proprietary IP.

---

## 12. Ruthless Scope — What Ships

### Must Ship
- [ ] New landing copy ("Know exactly where your understanding breaks")
- [ ] Topic input (unchanged)
- [ ] Framing beat 1 (updated copy) + beat 2 (unchanged)
- [ ] `generate-trap` API endpoint
- [ ] `TrapDisplay.jsx` — 3 snippets with free-text boxes
- [ ] `generate-mirror` API endpoint  
- [ ] `MirrorDisplay.jsx` — SOLID / BROKEN / ONE FIX
- [ ] Fallback trap sets (5 topics, pre-cached)
- [ ] Graceful mirror error state (confessions preserved)
- [ ] Deployed to Vercel

### Delete Before Shipping
- [ ] `AttemptEditor.jsx`
- [ ] `ChallengeDisplay.jsx`
- [ ] `FeedbackDisplay.jsx`
- [ ] `ArtifactSaved.jsx`
- [ ] `History.jsx`
- [ ] `Timer.jsx`
- [ ] `generate-challenge.js`
- [ ] `generate-feedback.js`
- [ ] `generate-outcome.js`
- [ ] All artifact/storage logic from `storage.js`
- [ ] All artifact state from `useAppState.js`

### Does Not Ship
- History or artifact system of any kind
- User accounts or login
- Score or grade output
- "Correct answer" reveal
- Mobile-specific optimizations

---

## 13. The One-Line Summary for the Submission

> *"Every learning tool adds something. This one removes something — your false confidence — and replaces it with a precise diagnosis of where your mental model breaks. No project. No tracker. Just a mirror."*

---

*Pivot from Prove It Mode. Same problem. Non-obvious solution. Genuinely different category.*
*"This is what learning looks like when you finally know what you don't know."*