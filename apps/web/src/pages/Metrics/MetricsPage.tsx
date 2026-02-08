import { useEffect, useState } from 'react';
import { Paper, Loader, Title } from '@mantine/core';
import { useMetricValues } from '../../lib/metrics';
import type { ChartTimeRange } from '../../types/chart';
import { MetricForm } from '../../components/MetricForm/MetricForm';
import { TimeRangeToggle } from '../../components/TimeRangeToggle/TimeRangeToggle';
import { MetricsChart } from '../../components/MetricsChart/MetricsChart';
import { cn } from '../../lib/utils';
import styles from './MetricsPage.module.css';
import { SingleMetricChart } from '../../components/SingleMetricChart/SingleMetricChart';

export function MetricsPage() {
  const [timeRange, setTimeRange] = useState<ChartTimeRange>('7d');
  const { data, isLoading, isError, error } = useMetricValues(timeRange);
  const groups = data?.data ?? [];
  const [selectedMetrics, setSelectedMetrics] = useState<string[] | null>(null);

  useEffect(() => {
    if (isLoading || isError || selectedMetrics !== null) return;
    setSelectedMetrics(groups.map((g) => g.metric.id));
  }, [isLoading, isError, selectedMetrics, groups]);

  return (
    <main className={styles.page}>
      <Title order={1} className={styles.title}>
        Metrics
      </Title>

      <section className={styles.section}>
        <MetricForm />
      </section>

      <section className={styles.section}>
        <Paper radius="md">
          <div className={styles.chartHeader}>
            <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
          </div>
          {isLoading && !isError && (
            <div className={cn(styles.loader)}>
              <Loader type="dots" />
            </div>
          )}
          {isError && !isLoading && (
            <div className={cn(styles.loader, styles.error)}>
              {error instanceof Error ? error.message : 'Failed to load metrics'}
            </div>
          )}
          {!isLoading && !isError && (
            <div className={styles.chartContainer}>
              <MetricsChart
                groups={groups}
                timeRange={timeRange}
                selectedMetrics={selectedMetrics ?? []}
                onSelectMetrics={setSelectedMetrics}
              />
              <div className={styles.singleMetricChartContainer}>
                {groups.map((group) => (
                  <SingleMetricChart
                    key={group.metric.id}
                    metric={group}
                    timeRange={timeRange}
                    withViewDetails
                  />
                ))}
              </div>
            </div>
          )}
        </Paper>
      </section>
    </main>
  );
}
