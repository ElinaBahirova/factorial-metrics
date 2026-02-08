import { SegmentedControl } from '@mantine/core';
import type { ChartTimeRange } from '../../types/chart';
import { CHART_TIME_RANGE_OPTIONS } from '../../types/chart';
import { cn } from '../../lib/utils';
import styles from './TimeRangeToggle.module.css';

const LABELS: Record<ChartTimeRange, string> = {
  '24h': '24h',
  '7d': '7 days',
  '30d': '30 days',
  custom: 'Custom',
};

type Props = {
  value: ChartTimeRange;
  onChange: (value: ChartTimeRange) => void;
  className?: string;
};

export function TimeRangeToggle({ value, onChange, className }: Props) {
  const options = CHART_TIME_RANGE_OPTIONS.map((range) => ({
    value: range,
    label: LABELS[range],
  }));

  return (
    <div className={cn(styles.wrapper, className)}>
      <span className={styles.label}>Time range:</span>
      <SegmentedControl
        value={value}
        onChange={(v) => onChange(v as ChartTimeRange)}
        data={options}
      />
    </div>
  );
}
