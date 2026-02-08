# Metrics Dashboard

A full-stack application to **post and visualize metrics** (timestamp, name, value) with a line chart. Metrics are persisted in a PostgreSQL database (Neon); the frontend lets you add new metrics and view them over configurable time ranges (24h, 7 days, 30 days).

## Requirements (problem statement)

- Each metric has at least: **timestamp**, **name**, and **value**.
- Metrics are **persisted in a database**.
- The page allows users to **post new metrics**.
- The page contains a **line chart** in which the metrics are displayed.

This project also adds a **time range toggle** (24h, 7 days, 30 days) for the chart and is structured for clarity and maintainability.

## Tech stack

- **Frontend**: React 19, Vite 7, Mantine (core, form, charts), TanStack Query, CSS modules, TypeScript.
- **Backend**: Node.js, Express, Prisma 7, PostgreSQL (Neon). API runs on port 3001.

## Project structure

- **Monorepo** (npm workspaces):
  - `apps/api` – Express API, Prisma, Neon Postgres.
  - `apps/web` – React SPA (Vite).
- **apps/web/src**:
  - `components/` – Reusable UI (MetricForm, TimeRangeToggle, MetricsChart).
  - `features/metrics/` – Metrics page that composes form, chart, and time range state.
  - `lib/` – API client, TanStack Query hooks, filter helper, utils.
  - `types/` – Shared TypeScript types (Metric, ChartTimeRange).

## Prerequisites

- **Node.js** 20+ and **npm** (or pnpm).
- A **Neon** (or other Postgres) database for the API. Sign up at [neon.tech](https://neon.tech) and create a project to get a connection string.

## Setup and run

### 1. Install dependencies

From the **project root**:

```bash
npm install
```

### 2. API (backend)

1. Go to the API app and configure the database:

   ```bash
   cd apps/api
   ```

2. Create a `.env` file (copy from `.env.example` if present) with:

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
   ```

   Use the connection string from your Neon project.

3. Sync the database schema:

   ```bash
   npx prisma db push
   ```

4. Start the API:

   ```bash
   npm run dev
   ```

   Or from the **project root**: `npm run api`. The API runs at **http://localhost:3001**.

### 3. Web (frontend)

From the **project root**:

```bash
npm run web
```

Or:

```bash
cd apps/web && npm run dev
```

The app is served at **http://localhost:5173** (or the port Vite shows). It talks to the API at `http://localhost:3001` by default.

### 4. Optional: point frontend to another API

Create `apps/web/.env` and set:

```
VITE_API_URL=http://localhost:3001
```

Change the URL if your API runs elsewhere.

## Environment variables

| App   | Variable       | Required | Description                          |
| ----- | -------------- | -------- | ------------------------------------ |
| API   | `DATABASE_URL` | Yes      | PostgreSQL connection string (Neon). |
| Web   | `VITE_API_URL`| No       | API base URL (default: localhost:3001). |

## What to expect

- **Metrics** page: heading, form (name + value), time range toggle (24h / 7 days / 30 days), and a line chart.
- **Add a metric**: fill name and value, click “Add metric”. The chart and data update; metrics are stored in the database.
- **Change time range**: use the toggle to filter the chart to the last 24 hours, 7 days, or 30 days.
- **Empty state**: if there are no metrics in the selected range, the chart area shows a short message.

## Scripts (root)

- `npm run dev` – run dev for all workspaces (api + web) if they define `dev`.
- `npm run api` – run the API dev server (`apps/api`).
- `npm run web` – run the web dev server (`apps/web`).
- `npm run build` – build all apps.
- `npm run lint` – lint the project.
