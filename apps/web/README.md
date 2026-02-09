# Web — Factorial Metrics Dashboard

React frontend: metrics list with combined/per-metric charts, metric detail page with time-range filters (24h, 7d, 30d).

## Key features

- **Metrics list** — Form to add metrics and values; combined chart and per-metric charts.
- **Metric detail** — Single-metric view with back navigation and time-range toggle.
- **Charts** — Mantine Charts with numeric time axis; Factorial-themed palette (teal, blue, amber).

## Stack

React 19, Vite, Mantine (core, form, charts), TanStack Query, TanStack Router, date-fns, CSS modules.

## Run

From **project root:** `npm run web` (dev server on 5173).

From this dir: `npm install` then `npm run dev`.

**Build:** `npm run build` → output in `dist/`.

## Structure

- `src/App.tsx` — TanStack Router: `/` (metrics list), `/metrics/:metricId` (metric detail).
- `src/components/` — MetricForm, TimeRangeToggle, MetricsChart, SingleMetricChart.
- `src/pages/` — MetricsPage, MetricDetailPage.
- `src/lib/` — API client, query hooks, date helpers, `cn` util.
- `src/types/` — Metric and chart types. Theme (Factorial palette) in `main.tsx` and `src/styles/`.
