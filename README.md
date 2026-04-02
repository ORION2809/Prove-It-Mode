# Prove It Mode

> You just learned something. Now prove it.

Constraint-loaded challenges that turn knowledge into real building. No tutorials. No hand-holding. Just you, the constraints, and a blank editor.

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
