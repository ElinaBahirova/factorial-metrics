/**
 * Time range options for the metrics chart.
 * 'custom' reserved for future date-range picker.
 */
export type ChartTimeRange = '24h' | '7d' | '30d' | 'custom';

export const CHART_TIME_RANGE_OPTIONS: ChartTimeRange[] = ['24h', '7d', '30d'];
