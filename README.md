# AgentHub — Productivity Agents Hub

A modern SaaS platform where business owners run a hub of focused AI productivity
agents — Morning Briefing, Inbox Triage, Weekly Business Review, Decision Journal,
and 23 more (the 27 "Daily Routines & Rituals" workflows).

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind
- **Backend:** FastAPI + SQLAlchemy 2.0 + JWT auth
- **AI:** OpenAI (chat completions) — generic run engine, any agent runnable
- **Billing:** Stripe subscription checkout (optional in dev)
- **DB:** SQLite by default (zero-config), Postgres-ready via `DATABASE_URL`

The flagship feature, **PRO-1 Morning Briefing**, is wired end-to-end: sign up →
pick the agent → paste your calendar/priorities/overnight messages → get an AI digest.
The same run flow powers all 27 agents.

```
agenthub/
├── backend/    # FastAPI app
│   └── app/
│       ├── agents_catalog.py   # the 27 agent templates + prompts
│       ├── routers/            # auth, agents, billing
│       ├── services/           # openai run engine
│       ├── models.py  schemas.py  deps.py
│       └── main.py
└── frontend/   # Next.js app
    ├── app/                    # landing, login, register, dashboard, agents/[key]
    ├── components/             # AuthForm, AppShell
    └── lib/                    # api client, auth context
```

## 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows  (source .venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
copy .env.example .env          # cp on macOS/Linux — then set OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs · Health: http://localhost:8000/api/health

> Agents run against OpenAI, so set `OPENAI_API_KEY` in `backend/.env`. Without it,
> the app still runs and a run returns a clear "OpenAI not configured" message.

## 2. Frontend

```bash
cd frontend
npm install
copy .env.local.example .env.local   # cp on macOS/Linux (defaults to localhost:8000)
npm run dev
```

App: http://localhost:3000

## 3. Try it

1. Open http://localhost:3000 → **Get started** → create an account.
2. On the dashboard, open **Morning Briefing Agent**.
3. Click **Load sample input**, then **Run agent** to see the digest.

## Stripe (optional)

Set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, and `STRIPE_WEBHOOK_SECRET` in
`backend/.env`. `POST /api/billing/checkout` returns a Checkout URL; the webhook
upgrades the user's `plan` to `pro` on completion.

## Production notes

- Swap SQLite for Postgres via `DATABASE_URL` and add Alembic migrations
  (tables are auto-created on startup for dev convenience only).
- Set a strong `SECRET_KEY` and restrict `FRONTEND_ORIGIN`.
