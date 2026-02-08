# Web app (Metrics dashboard)

React + Vite frontend for the metrics challenge. Post metrics and view them in a line chart with time range filters (24h, 7 days, 30 days).

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

The app expects the API at **http://localhost:3001**. Set `VITE_API_URL` in a `.env` file here if your API runs elsewhere.

## Build

```bash
npm run build
```

Output is in `dist/`.

## Structure

- `src/components/` – MetricForm, TimeRangeToggle, MetricsChart (CSS modules + Mantine).
- `src/features/metrics/` – MetricsPage (composes form, chart, time range state).
- `src/lib/` – API client, useMetrics / usePostMetric, filterMetricsByTimeRange, cn util.
- `src/types/` – Metric, ChartTimeRange.

Styling: CSS modules and the `cn()` helper; global variables in `index.css`. Mantine handles form validation and chart UI.
