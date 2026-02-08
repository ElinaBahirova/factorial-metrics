import { isValid } from "date-fns";
import type { ChartTimeRange } from "../types/chart";

export const formatTickDate = (range: ChartTimeRange, tickItem: number) => {
  const date = new Date(tickItem);

  if (!isValid(date)) {
    return '';
  }

  switch (range) {
    case '24h':
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short',
      });
    case '30d':
    case '7d':
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    default:
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
  }
}