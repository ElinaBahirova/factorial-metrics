# Web app — Factorial Metrics Dashboard

React frontend for the Factorial Metrics project. Add metrics and values, view a combined chart or per-metric charts, and drill into a single metric with time-range filters (24h, 7d, 30d).

## Tech stack

- **React 19** + **Vite 7**
- **Mantine** (core, form, charts) for UI and line charts
- **TanStack Query** for data fetching and caching
- **TanStack Router** for client-side routing (metrics list + metric detail page)
- **date-fns** for date formatting
- **CSS modules** for component styles

## Run

From the **project root**:

```bash
npm run web
```

Or from this directory:

```bash
npm install   # if not already done at root
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/`.

## Structure

| Path | Description |
|------|-------------|
| `src/App.tsx` | Router setup (TanStack Router): `/` → metrics list, `/metrics/:metricId` → metric detail |
| `src/components/` | MetricForm, TimeRangeToggle, MetricsChart, SingleMetricChart (CSS modules + Mantine) |
| `src/features/metrics/` | MetricsPage (list + form + charts), MetricDetailPage (back, range, info, chart) |
| `src/lib/` | API client, TanStack Query hooks (metrics), date formatting, `cn` util |
| `src/types/` | Metric and chart types (MetricDefinition, MetricValue, ChartTimeRange) |

Global styles and design tokens live in `src/index.css`. The Mantine theme is extended with a custom Factorial palette in `main.tsx`.
