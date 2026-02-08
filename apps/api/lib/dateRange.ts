export type RangeParam = '24h' | '7d' | '30d';

export function getRangeBounds(range: RangeParam, now: Date = new Date()): { from: Date; to: Date } {
  const to = new Date(now);
  const from = new Date(now);
  const ms = now.getTime();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  switch (range) {
    case '24h':
      from.setTime(ms - 24 * oneHour);
      break;
    case '7d':
      from.setTime(ms - 7 * oneDay);
      break;
    case '30d':
      from.setTime(ms - 30 * oneDay);
      break;
    default:
      from.setTime(ms - 30 * oneDay);
  }
  return { from, to };
}

export function parseRangeQuery(value: unknown): RangeParam | null {
  if (value === '24h' || value === '7d' || value === '30d') return value;
  return null;
}
