export type MetricDefinition = {
  id: string;
  name: string;
  description: string | null;
  measure: string | null;
  createdAt: string;
}

export type MetricValue = {
  id: string;
  metricId: string;
  value: number;
  timestamp: string;
}

export type MetricGroup = {
  metric: MetricDefinition;
  values: MetricValue[];
}

export type MetricValuesByRangeResponse = {
  data: MetricGroup[];
}

export type MetricByIdValuesResponse = {
  metric: MetricDefinition;
  values: MetricValue[];
}
