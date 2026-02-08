import { useMemo } from "react";
import { LineChart } from "@mantine/charts";
import type { MetricGroup } from "../../types/metric";
import { cn } from "../../lib/utils";
import styles from "./SingleMetricChart.module.css";
import { formatTickDate } from "../../lib/date";
import type { ChartTimeRange } from "../../types/chart";
import { format, isValid } from "date-fns";
import { Button, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";

type DataRow = {
  date: number;
  [key: string]: number;
};

type Props = {
  metric: MetricGroup;
  timeRange: ChartTimeRange;
  withViewDetails?: boolean;
  className?: string;
};

export function SingleMetricChart({ metric, timeRange, withViewDetails = false, className }: Props) {
  if (metric.values.length === 0) {
    return (
      <div className={cn(styles.empty, className)}>
        No values in this range. Add a value above to see the chart.
      </div>
    );
  }

  const data = useMemo(() => {
    const pointMap = new Map<number, DataRow>();
    metric.values.forEach((value) => {
      const key = new Date(value.timestamp).getTime();
      pointMap.set(key, {
        date: key,
        [metric.metric.name]: value.value,
      });
    });

    return Array.from(pointMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [metric, timeRange]);

  return (
    <div className={cn(styles.chart, className)}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Title order={3} c="factorial-grey.9" className={styles.title}>
            {metric.metric.name}
          </Title>
          {metric.metric.description && (
            <span className={styles.description}>
              {metric.metric.description}
              {metric.metric.measure && ` (${metric.metric.measure})`}
            </span>
          )}
        </div>

        {withViewDetails && (
          <Button
            component={Link}
            to={`/metrics/${metric.metric.id}`}
            variant="light"
            size="xs"
            className={styles.viewLink}
          >
            View details
          </Button>
        )}
      </div>
      <div className={styles.chartContainer}>
        <LineChart
          h={280}
          data={data}
          dataKey="date"
          curveType="linear"
          series={[{ name: metric.metric.name, color: 'factorial-red.4' }]}
          dotProps={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
          activeDotProps={{ r: 6, strokeWidth: 0 }}
          gridProps={{ stroke: 'var(--f-border-light)', strokeDasharray: '5 5' }}
          xAxisProps={{
            type: 'number',
            domain: ['dataMin', 'dataMax'],
            tickFormatter: (value) => formatTickDate(timeRange, value),
            interval: 'preserveStartEnd',
            minTickGap: 30,
          }}
          valueFormatter={(value) => value.toFixed(2)}
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
    </div>
  );
}
