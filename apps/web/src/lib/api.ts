import type {
  MetricDefinition,
  MetricValuesByRangeResponse,
  MetricByIdValuesResponse,
  MetricValue,
} from '../types/metric';
import type { ChartTimeRange } from '../types/chart';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export async function fetchMetricDefinitions(): Promise<MetricDefinition[]> {
  const res = await fetch(`${API_BASE}/metrics/definitions`);
  if (!res.ok) throw new Error('Failed to fetch metric definitions');
  return res.json();
}

export async function fetchMetricValuesByRange(
  range: ChartTimeRange,
): Promise<MetricValuesByRangeResponse> {
  const res = await fetch(`${API_BASE}/metrics/values?range=${range}`);
  if (!res.ok) throw new Error('Failed to fetch metric values');
  return res.json();
}

export async function fetchMetricById(
  id: string,
  range?: ChartTimeRange,
): Promise<MetricByIdValuesResponse> {
  const url = range
    ? `${API_BASE}/metrics/definitions/${id}/values?range=${range}`
    : `${API_BASE}/metrics/definitions/${id}/values`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch metric values');
  return res.json();
}

export async function createMetricDefinition(body: {
  name: string;
  description?: string;
  measure?: string;
}): Promise<MetricDefinition> {
  const res = await fetch(`${API_BASE}/metrics/definitions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 409) {
      throw new Error(data.error ?? 'Metric with this name already exists');
    }
    throw new Error(data.error ?? 'Failed to create metric definition');
  }
  return res.json();
}

export async function createMetricValue(body: {
  metricId: string;
  value: number;
  timestamp?: string;
}): Promise<MetricValue> {
  const res = await fetch(`${API_BASE}/metrics/values`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? 'Failed to create metric value');
  }
  return res.json();
}
