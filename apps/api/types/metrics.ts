/**
 * Domain DTOs used by repository and service (no Prisma types).
 */
export type MetricDefinitionDto = {
  id: string;
  name: string;
  description: string | null;
  measure: string | null;
  createdAt: Date;
};

export type MetricValueDto = {
  id: string;
  metricId: string;
  value: number;
  timestamp: Date;
};

export type MetricGroupDto = {
  metric: MetricDefinitionDto;
  values: MetricValueDto[];
};
