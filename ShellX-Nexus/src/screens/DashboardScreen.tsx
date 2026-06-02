import React from 'react';
import { MetricsGrid } from '../components/dashboard/MetricsGrid';
import { ServerResourceGraph } from '../components/dashboard/ServerResourceGraph';
import { PTYCommandLogFeed } from '../components/dashboard/PTYCommandLogFeed';
import { HeadlineText } from '../components/atoms';

export const DashboardScreen: React.FC = () => {
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-lg)',
  };

  const chartSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-md)',
  };

  return (
    <div style={contentStyle}>
      <div>
        <HeadlineText level={1} style={{ marginBottom: '4px' }}>
          Overview
        </HeadlineText>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          Real-time diagnostics and student workspace monitoring.
        </p>
      </div>

      {/* Metrics Row */}
      <MetricsGrid />

      {/* Resource monitoring section */}
      <div style={chartSectionStyle}>
        <ServerResourceGraph />
        <PTYCommandLogFeed />
      </div>
    </div>
  );
};
