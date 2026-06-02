import React from 'react';
import { Users, Wifi, Cpu, Award } from 'lucide-react';
import { MonoText, LabelCapsText } from '../atoms';

export const MetricsGrid: React.FC = () => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-lg)',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-md)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
  };

  const iconWrapperStyle = (color: string): React.CSSProperties => ({
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-default)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--color-border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color,
  });

  const metrics = [
    {
      label: 'Active Sandbox Nodes',
      value: '14 / 50',
      icon: <Users size={20} />,
      color: 'var(--color-syntax-blue)',
    },
    {
      label: 'Network Latency',
      value: '42 ms',
      icon: <Wifi size={20} />,
      color: 'var(--color-semantic-success)',
    },
    {
      label: 'Virtual Memory Usage',
      value: '4.8 GB / 8 GB',
      icon: <Cpu size={20} />,
      color: 'var(--color-syntax-purple)',
    },
    {
      label: 'Lesson Submissions (24h)',
      value: '348 runs',
      icon: <Award size={20} />,
      color: 'var(--color-syntax-orange)',
    },
  ];

  return (
    <div style={gridStyle}>
      {metrics.map((m, idx) => (
        <div key={idx} style={cardStyle}>
          <div style={iconWrapperStyle(m.color)}>{m.icon}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <LabelCapsText size="9px" color="var(--color-text-tertiary)">
              {m.label}
            </LabelCapsText>
            <MonoText size="18px" weight="bold" color={m.color}>
              {m.value}
            </MonoText>
          </div>
        </div>
      ))}
    </div>
  );
};
