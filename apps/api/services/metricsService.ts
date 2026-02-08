import type { IMetricsRepository } from '../repositories/metricsRepository';
import type { MetricGroupDto } from '../types/metrics';
import { getRangeBounds, type RangeParam } from '../lib/dateRange';
import { aggregateValues } from '../lib/aggregateMetrics';
import type { CreateDefinitionInput, CreateValueInput } from '../schemas/metrics';

const DEFAULT_RANGE: RangeParam = '30d';

/**
 * Application service: orchestrates repository, date range, and aggregation (SRP).
 * Depends on IMetricsRepository (DIP).
 */
export class MetricsService {
  constructor(private readonly repo: IMetricsRepository) {}

  async listDefinitions() {
    return this.repo.findAllDefinitions();
  }

  async getDefinitionById(id: string) {
    return this.repo.findDefinitionById(id);
  }

  async getValuesByRange(rangeParam: RangeParam | null): Promise<{ data: MetricGroupDto[] }> {
    const range = rangeParam ?? DEFAULT_RANGE;
    const { from, to } = getRangeBounds(range);
    const rows = await this.repo.findValuesInRange(from, to);

    const byMetricId = new Map<string, { metric: MetricGroupDto['metric']; values: MetricGroupDto['values'] }>();
    for (const v of rows) {
      const existing = byMetricId.get(v.metricId);
      const valueDto = { id: v.id, metricId: v.metricId, value: v.value, timestamp: v.timestamp };
      if (!existing) {
        byMetricId.set(v.metricId, { metric: v.metric, values: [valueDto] });
      } else {
        existing.values.push(valueDto);
      }
    }

    const data: MetricGroupDto[] = Array.from(byMetricId.values()).map(({ metric, values: vs }) => {
      const aggregated = aggregateValues(
        vs.map((v) => ({ ...v, timestamp: v.timestamp })),
        range
      );
      return { metric, values: aggregated };
    });

    return { data };
  }

  async getDefinitionWithValues(id: string, rangeParam: RangeParam | null) {
    const range = rangeParam ?? DEFAULT_RANGE;
    const { from, to } = getRangeBounds(range);
    const result = await this.repo.findDefinitionWithValues(id, from, to);
    return result;
  }

  async createDefinition(input: CreateDefinitionInput) {
    const existing = await this.repo.findDefinitionByName(input.name);
    if (existing) {
      return { success: false as const, error: 'METRIC_ALREADY_EXISTS', field: 'name' };
    }
    const definition = await this.repo.createDefinition({
      name: input.name,
      description: input.description,
      measure: input.measure,
    });
    return { success: true as const, definition };
  }

  async createValue(input: CreateValueInput) {
    const definition = await this.repo.findDefinitionById(input.metricId);
    if (!definition) {
      return { success: false as const, error: 'NOT_FOUND' };
    }
    const value = await this.repo.createValue({
      metricId: input.metricId,
      value: input.value,
      timestamp: input.timestamp ? new Date(input.timestamp) : undefined,
    });
    return { success: true as const, value };
  }
}
