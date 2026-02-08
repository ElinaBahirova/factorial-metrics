import { useState } from 'react';
import { Paper, Loader, Text, Button } from '@mantine/core';
import { Link, useParams } from '@tanstack/react-router';
import { useMetricById } from '../../lib/metrics';
import type { ChartTimeRange } from '../../types/chart';
import { TimeRangeToggle } from '../../components/TimeRangeToggle/TimeRangeToggle';
import { SingleMetricChart } from '../../components/SingleMetricChart/SingleMetricChart';
import { cn } from '../../lib/utils';
import styles from './MetricDetailPage.module.css';
import { ArrowLeft } from 'lucide-react';

export function MetricDetailPage() {
  const { metricId } = useParams({ strict: false });
  const [timeRange, setTimeRange] = useState<ChartTimeRange>('7d');
  const { data, isLoading, isError, error } = useMetricById(metricId ?? '', timeRange);

  if (!metricId) {
    return (
      <main className={styles.page}>
        <Button component={Link} to="/" variant="subtle" className={styles.backButton}>
          <ArrowLeft size={16} />
          Back to metrics
        </Button>
        <Text c="dimmed">Metric not found.</Text>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Button
        component={Link}
        to="/"
        variant="subtle"
        className={styles.backButton}
      >
        <ArrowLeft size={16} />
        Back to metrics
      </Button>
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
              <Text c="red" size="sm">
                {error instanceof Error ? error.message : 'Failed to load metric'}
              </Text>
              <Button component={Link} to="/" variant="light" mt="md">
                Back to metrics
              </Button>
            </div>
          )}

          {!isLoading && !isError && data && (
            <div className={styles.chartWrapper}>
              <SingleMetricChart
                metric={{ metric: data.metric, values: data.values }}
                timeRange={timeRange}
              />
            </div>
          )}
        </Paper>
      </section>
    </main>
  );
}
