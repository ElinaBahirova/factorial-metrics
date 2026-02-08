import { useMemo, useState } from "react";
import { LineChart } from "@mantine/charts";
import type { MetricGroup } from "../../types/metric";
import { cn } from "../../lib/utils";
import styles from "./MetricsChart.module.css";
import { formatTickDate } from "../../lib/date";
import type { ChartTimeRange } from "../../types/chart";
import { format, isValid } from "date-fns";
import { MultiSelect, Title } from "@mantine/core";

const SERIES_COLORS = [
  "factorial-red.4",
  "factorial-teal.4",
  "factorial-blue.4",
  "factorial-amber.4",
  "factorial-red.5",
  "factorial-teal.5",
  "factorial-blue.5",
  "factorial-amber.5",
  "factorial-red.6",
  "factorial-teal.6",
  "factorial-blue.6",
  "factorial-amber.6",
];

type DataRow = {
  date: number;
  [key: string]: number;
};

type Props = {
  groups: MetricGroup[];
  timeRange: ChartTimeRange;
  className?: string;
};

export function MetricsChart({ groups, timeRange, className }: Props) {
  if (groups.length === 0) {
    return (
      <div className={cn(styles.empty, className)}>
        No metrics in this range. Add a metric above to see the chart.
      </div>
    );
  }
  const [selectedMetrics, setSelectedMetrics] = useState(groups.map((g) => g.metric.id));

  const series = useMemo(() => {
    const metrics = groups.filter((g) => selectedMetrics.includes(g.metric.id)).map((g) => g.metric);
    return metrics.map((m, i) => ({
      name: m.name,
      color: SERIES_COLORS[i % SERIES_COLORS.length],
    }));
  }, [groups, selectedMetrics]);

  const data = useMemo(() => {
    const pointMap = new Map<number, DataRow>();
    groups.forEach((g) => {
      g.values.forEach((value) => {
        const key = new Date(value.timestamp).getTime();
        const row = pointMap.get(key);
        if (row !== undefined) {
          row[g.metric.name] = value.value;
        } else {
          pointMap.set(key, {
            date: key,
            [g.metric.name]: value.value,
          });
        }
      });
    });

    return Array.from(pointMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [groups, timeRange]);

  const handleSelectMetrics = (value: string[]) => {
    setSelectedMetrics(value);
  };

  return (
    <div className={cn(styles.chart, className)}>
      <div className={styles.chartHeader}>
        <Title order={3} c="factorial-grey.9" className={styles.title}>
          Combined metrics
        </Title>
      </div>
      <MultiSelect
        placeholder="Select combined metrics"
        value={selectedMetrics}
        onChange={handleSelectMetrics}
        data={groups.map((g) => ({ value: g.metric.id, label: g.metric.name }))}
        multiple
        clearable
        searchable
        classNames={{ option: styles.selectOption, pill: styles.pill }}
      />
      <LineChart
        h={280}
        data={data}
        dataKey="date"
        series={series}
        curveType="linear"
        withLegend
        dotProps={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
        activeDotProps={{ r: 6, strokeWidth: 0 }}
        gridProps={{ stroke: 'var(--f-border-light)', strokeDasharray: '5 5' }}
        valueFormatter={(value) => value.toFixed(2)}
        xAxisProps={{
          type: 'number',
          domain: ['dataMin', 'dataMax'],
          tickFormatter: (value) => formatTickDate(timeRange, value),
          interval: 'preserveStartEnd',
          minTickGap: 30,
        }}
        tooltipProps={{
          labelFormatter: (label) => {
            const date = new Date(label);
            return isValid(date)
              ? format(date, 'MMM d, hh:mm a')
              : label;
          }
        }}
      />
    </div>
  );
}
