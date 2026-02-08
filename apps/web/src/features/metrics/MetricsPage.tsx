import { useState } from 'react';
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
            <div className={styles.loader}>
              <span style={{ color: 'var(--color-primary)' }}>
                {error instanceof Error ? error.message : 'Failed to load metrics'}
              </span>
            </div>
          )}
          {!isLoading && !isError && (
            <div className={styles.chartContainer}>
              <MetricsChart groups={groups} timeRange={timeRange} />
              <div className={styles.singleMetricChartContainer}>
                {groups.map((group) => (
                  <SingleMetricChart
                    key={group.metric.id}
                    metric={group}
                    timeRange={timeRange}
                    withViewDetails={true}
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
