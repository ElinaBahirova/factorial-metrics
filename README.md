# Factorial Metrics Dashboard

Full-stack metrics dashboard: add time-series metrics, view aggregated or per-metric charts, and filter by 24h / 7d / 30d.

**Demo:** [factorial-metrics.onrender.com](https://factorial-metrics.onrender.com/)

## Key features

- **Metrics list** — Create metrics and add values; see all metrics in one combined chart or per-metric charts.
- **Metric detail** — Drill into a single metric with a dedicated chart and time-range toggle (24h, 7d, 30d).
- **Time-series charts** — Numeric time axis so point spacing reflects real elapsed time (not category spacing).
- **Factorial-style UI** — Custom Mantine theme (teal/blue/amber palette, focus states) aligned with Factorial’s design.

## Tech stack

| Layer     | Stack |
|----------|--------|
| Frontend | React, Vite, Mantine UI + Charts, TanStack Query, TanStack Router, date-fns |
| Backend  | Express, TypeScript, Prisma |
| Database | PostgreSQL (Neon) |

Monorepo: `apps/web` (React), `apps/api` (Express + Prisma).

## Run locally

1. **Install:** `npm install`
2. **Env:** In `apps/api`, add `.env` with `DATABASE_URL` (Postgres, e.g. Neon). Optional: `apps/web/.env` with `VITE_API_URL` if API is not on `http://localhost:3001`.
3. **DB:** `cd apps/api && npx prisma db push`
4. **Start:** From root, `npm run dev` (API on 3001, web on 5173). Or `npm run api` / `npm run web` separately.

**Scripts:** `npm run build` — build all; `npm run lint` — lint.
