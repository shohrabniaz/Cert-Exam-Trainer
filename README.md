# Cert Exam Trainer

Duolingo-style daily practice for cloud and security certifications — **CKA**, **AZ-104**, and **Security+** — with streaks and simple progress stats.

Built as a freemium product foundation by **Shohrab Hossen Niaz** ([@shohrabniaz](https://github.com/shohrabniaz)), a CKA-certified DevOps engineer.

## Week 1 features

- Next.js 14 + TypeScript + Tailwind CSS progressive web app (PWA)
- Original JSON question banks (~30 questions per cert) — not copied from exam dumps
- Daily quiz flow (7 questions/day, deterministic per cert + date)
- Immediate answer feedback with explanations
- Streak counter and per-cert progress (seen count, accuracy, recent history)
- Local-first persistence via `localStorage` (no backend or account required)

## Stack (free / low-cost)

| Layer | Choice | Why |
| --- | --- | --- |
| App | Next.js (App Router) + TypeScript | Fast to ship, great DX, easy Vercel free hosting |
| UI | Tailwind CSS | Utility styling without a design-system tax |
| Data | Static JSON question banks | Zero DB cost for week 1 |
| Progress | Browser `localStorage` | No auth/backend yet |
| Offline | Minimal service worker + web manifest | Installable PWA |

## Setup

Requirements: Node.js 18+ and npm.

```bash
git clone <this-repo-url>
cd Cert-Exam-Trainer
npm install
```

## Run

```bash
# development
npm run dev
# open http://localhost:3000

# production build
npm run build
npm start
```

Lint:

```bash
npm run lint
```

## Question bank format

Questions live in `src/data/questions/{cka,az104,securityplus}.json`.

```json
{
  "id": "cka-001",
  "cert": "cka",
  "domain": "Cluster Architecture",
  "difficulty": "easy",
  "type": "single",
  "prompt": "…",
  "options": [
    { "id": "a", "text": "…" },
    { "id": "b", "text": "…" }
  ],
  "correct": ["b"],
  "explanation": "…"
}
```

- `type`: `single` (one answer) or `multiple` (select all that apply)
- `correct`: array of option ids
- All sample items are **original study aids** written for this project. They are not affiliated with CNCF, Microsoft, or CompTIA exam content.

## Product roadmap

1. **Week 1 (this release)** — PWA shell, original banks, daily quiz, streaks, local stats
2. **Week 2** — Accounts (e.g. Supabase/Auth.js free tier), sync progress across devices
3. **Week 3** — Freemium gate: free daily set + paid expanded banks / weak-area drills
4. **Week 4** — Spaced repetition, domain performance charts, email reminders
5. **Later** — Payments (Stripe), admin question editor, mobile store wrappers if demand warrants

## Project layout

```
src/
  app/                 # Next.js routes
  components/          # UI
  data/questions/      # JSON banks
  hooks/               # client state
  lib/                 # types, storage, quiz selection
public/                # PWA manifest, icons, service worker
```

## Copyright

Copyright (c) 2026 Shohrab Hossen Niaz. All rights reserved.

This project is proprietary software. See [`LICENSE`](./LICENSE). The `package.json` license field is set to `UNLICENSED`. No permission is granted to copy, modify, distribute, or use this code without written permission from the copyright holder.
