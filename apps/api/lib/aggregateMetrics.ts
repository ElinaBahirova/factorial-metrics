import type { RangeParam } from './dateRange';

export type ValueRow = { id: string; metricId: string; value: number; timestamp: Date };

/**
 * Truncate date to start of hour (UTC).
 */
function hourBucket(d: Date): Date {
  const out = new Date(d);
  out.setUTCMinutes(0, 0, 0);
  return out;
}

/**
 * Truncate date to start of day (UTC).
 */
function dayBucket(d: Date): Date {
  const out = new Date(d);
  out.setUTCHours(0, 0, 0, 0);
  return out;
}

const bucketKey = (ts: Date, range: RangeParam) =>
  range === '7d' ? hourBucket(ts).getTime() : dayBucket(ts).getTime();

/**
 * Aggregate metric values by time bucket for cleaner charts:
 * - 24h: raw data (no aggregation).
 * - 7d: average value per hour.
 * - 30d: average value per day.
 */
export function aggregateValues(values: ValueRow[], range: RangeParam): ValueRow[] {
  if (range === '24h' || values.length === 0) return values;

  const buckets = new Map<string, { sum: number; count: number; metricId: string; ts: Date }>();

  for (const v of values) {
    const key = `${v.metricId}-${bucketKey(v.timestamp, range)}`;
    const bucketTs = range === '7d' ? hourBucket(v.timestamp) : dayBucket(v.timestamp);
    const existing = buckets.get(key);
    if (!existing) {
      buckets.set(key, { sum: v.value, count: 1, metricId: v.metricId, ts: bucketTs });
    } else {
      existing.sum += v.value;
      existing.count += 1;
    }
  }

  return Array.from(buckets.entries())
    .map(([key, { sum, count, metricId, ts }]) => ({
      id: key,
      metricId,
      value: sum / count,
      timestamp: ts,
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}
