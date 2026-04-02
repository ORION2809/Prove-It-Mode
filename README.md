# Prove It Mode

> A system that forces learners to prove they can build — under constraints.

Most people finish tutorials and still can't build anything.

This creates a 60-minute, constraint-loaded challenge from what you just learned — forces you to attempt it — and gives you real feedback.

No tutorials. No hints. Just proof.

## Live Demo

**https://assignment-ruby-kappa.vercel.app**

## What to Try (30 seconds)

1. Type: `React useEffect`
2. Enter Prove It Mode
3. Read the constraints
4. Attempt the challenge
5. Submit → see feedback
6. Check "What You've Built"

That's the entire product.

## Why This Exists

After finishing tutorials, most learners hit the same moment: they open an editor — and nothing starts.

The problem is not lack of knowledge. It is lack of forced application.

Prove It Mode exists to create that moment — and remove the escape.

## How It Works

1. You enter what you just learned
2. The system generates a constraint-based challenge (what you must use, what you can't use, what you must handle)
3. You attempt it in a blank editor — without help
4. You get direct, structured feedback from a senior-dev-style code review
5. You improve, iterate, and save proof of what you built

## What Makes This Different

ChatGPT gives ideas.

Prove It Mode gives constraints, forces an attempt, and tracks proof.

That difference changes behavior.

## Output (Artifacts)

Each session creates a saved artifact:

> "Built: localStorage book tracker (React useEffect)"

This turns learning into visible proof — not just consumption. Every challenge you complete is saved to your build history with the challenge, your code, and the feedback you received.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Note:** Without an NVIDIA API key, the app uses pre-cached fallback challenges. To enable AI-generated challenges and feedback, set up the API key (see below).

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
│   ├── Landing       # Hero + CTA
│   ├── TopicInput    # "What did you learn?"
│   ├── Framing       # Emotional beat sequence
│   ├── ChallengeDisplay  # Challenge + constraints
│   ├── AttemptEditor     # Code textarea + timer
│   ├── FeedbackDisplay   # Senior dev code review
│   ├── ArtifactSaved     # "You built this" confirmation
│   └── History           # Build history panel
├── hooks/
│   └── useAppState   # State machine (useReducer)
├── lib/
│   ├── api           # API calls with timeout + fallback
│   ├── storage       # localStorage CRUD
│   └── fallbacks     # Pre-cached challenges
└── App.jsx           # Screen orchestrator

api/
├── _nvidia.js              # Shared NVIDIA API client
├── generate-challenge.js   # Constraint engine (Llama 3.1 70B)
├── generate-feedback.js    # Code review (Llama 3.1 70B)
└── generate-outcome.js     # Outcome phrase (Llama 3.1 70B)
```

## Core Loop

```
INPUT → FRAMING → CHALLENGE → ATTEMPT → FEEDBACK → ARTIFACT
                                 ↑          ↓
                                 └── TRY AGAIN
```

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| AI | NVIDIA API (Llama 3.1 70B Instruct) |
| Hosting | Vercel |
| Persistence | localStorage |
| State | useReducer |

## Fallback Logic

- **Challenge generation fails:** Serves pre-cached challenges matching the topic
- **Feedback generation fails:** Shows error message, preserves attempt
- **All API calls:** Timeout after 15s, catch block, user-visible error state

---

*Built for Entrext 72-Hour Assignment. Problem #4: The Silent Learning Gap.*
