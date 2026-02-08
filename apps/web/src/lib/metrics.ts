import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ChartTimeRange } from '../types/chart';
import {
  fetchMetricDefinitions,
  fetchMetricValuesByRange,
  fetchMetricById,
  createMetricDefinition,
  createMetricValue,
} from './api';

const effectiveRange = (range: ChartTimeRange): Exclude<ChartTimeRange, 'custom'> =>
  range === 'custom' ? '30d' : range;

export const definitionsQueryKey = ['metrics', 'definitions'] as const;
export const valuesQueryKey = (range: ChartTimeRange) => ['metrics', 'values', range] as const;
export const metricByIdQueryKey = (id: string, range?: ChartTimeRange) =>
  ['metrics', 'definition', id, range] as const;

export function useMetricDefinitions() {
  return useQuery({
    queryKey: definitionsQueryKey,
    queryFn: fetchMetricDefinitions,
  });
}

export function useMetricValues(range: ChartTimeRange) {
  const rangeKey = effectiveRange(range);
  return useQuery({
    queryKey: valuesQueryKey(rangeKey),
    queryFn: () => fetchMetricValuesByRange(rangeKey),
  });
}

export function useMetricById(id: string, range?: ChartTimeRange) {
  const rangeKey = effectiveRange(range ?? '30d');
  return useQuery({
    queryKey: metricByIdQueryKey(id, rangeKey),
    queryFn: () => fetchMetricById(id, rangeKey),
    enabled: !!id,
  });
}

export function useCreateMetricDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMetricDefinition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: definitionsQueryKey });
    },
  });
}

export function useCreateMetricValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMetricValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}
