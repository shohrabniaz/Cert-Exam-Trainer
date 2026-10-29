# Cert Exam Trainer

Duolingo-style daily practice for **top certification exams** — with streaks, stats, freemium practice limits, and local backups.

Built by **Shohrab Hossen Niaz** ([@shohrabniaz](https://github.com/shohrabniaz)), a CKA-certified DevOps engineer.

## Top exam trainings

| Exam | Provider | Focus |
| --- | --- | --- |
| **CKA** | CNCF / Linux Foundation | Kubernetes administration |
| **AWS SAA-C03** | Amazon Web Services | Solutions Architect Associate |
| **AWS CLF-C02** | Amazon Web Services | Cloud Practitioner |
| **AZ-104** | Microsoft | Azure Administrator |
| **Security+** | CompTIA | Core cybersecurity |

## Features (v1.0)

- Next.js 14 + TypeScript + Tailwind PWA
- ~30 original questions per cert (not exam dumps)
- Daily quiz (7 questions, deterministic per cert + date)
- Extra practice mode with freemium daily limit
- Answer feedback with explanations
- Streaks + per-cert / per-domain stats
- Onboarding tip, Pro preview unlock, settings with export/import
- Local-first `localStorage` (no account required yet)

## Free vs Pro

| | Free | Pro (preview / coming soon) |
| --- | --- | --- |
| Daily quiz per cert | Unlimited | Unlimited |
| Extra practice sets / day | 1 | Unlimited |
| Streaks & stats | Yes | Yes |
| Cloud sync / Stripe | — | Roadmap |

Use **Pro → Unlock Pro preview (local)** to demo unlimited practice on a device before payments ship.

## Setup

Requirements: Node.js 18+ and npm.

```bash
git clone https://github.com/shohrabniaz/Cert-Exam-Trainer.git
cd Cert-Exam-Trainer
npm install
```

## Run

```bash
npm run dev
# http://localhost:3000

npm run build && npm start
npm run lint
```

## Deploy (Vercel)

1. Import `https://github.com/shohrabniaz/Cert-Exam-Trainer` in Vercel
2. Framework preset: Next.js (see `vercel.json`)
3. Deploy — no env vars required for v1

Or:

```bash
npx vercel
```

## Question bank format

Files: `src/data/questions/{cka,aws-saa,aws-clf,az104,securityplus}.json`

```json
{
  "id": "cka-001",
  "cert": "cka",
  "domain": "Cluster Architecture",
  "difficulty": "easy",
  "type": "single",
  "prompt": "…",
  "options": [{ "id": "a", "text": "…" }],
  "correct": ["b"],
  "explanation": "…"
}
```

Original study aids only — not affiliated with CNCF, AWS, Microsoft, or CompTIA.

## Roadmap

1. ~~PWA + banks + daily quiz + streaks~~
2. ~~Stats, practice mode, freemium gate, settings/backup~~
3. Accounts + cross-device sync (Supabase / Auth.js)
4. Stripe billing for Pro
5. Spaced repetition + email reminders + more AWS associate banks

## Copyright

Copyright (c) 2026 Shohrab Hossen Niaz. All rights reserved.

See [`LICENSE`](./LICENSE). `package.json` license is `UNLICENSED`. No permission is granted to copy, modify, distribute, or use this code without written permission from the copyright holder.
