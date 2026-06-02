import React, { useEffect, useState } from 'react';
import { MonoText, LabelCapsText } from '../atoms';

export const ServerResourceGraph: React.FC = () => {
  // Generate mock CPU and RAM histories
  const [cpuHistory, setCpuHistory] = useState<number[]>([32, 28, 45, 55, 60, 52, 40, 38, 45, 48]);
  const [ramHistory, setRamHistory] = useState<number[]>([55, 56, 56, 57, 58, 58, 57, 58, 59, 60]);

  // Simulate updates every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuHistory((prev) => {
        const next = [...prev.slice(1)];
        const newVal = Math.max(10, Math.min(95, prev[prev.length - 1] + (Math.random() > 0.5 ? 8 : -8)));
        next.push(Math.round(newVal));
        return next;
      });

      setRamHistory((prev) => {
        const next = [...prev.slice(1)];
        const newVal = Math.max(40, Math.min(80, prev[prev.length - 1] + (Math.random() > 0.5 ? 1 : -1)));
        next.push(Math.round(newVal));
        return next;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    flex: 1,
    minWidth: '300px',
  };

  const chartAreaStyle: React.CSSProperties = {
    display: 'flex',
    height: '140px',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 'var(--spacing-md)',
    borderBottom: '1px solid var(--color-border-subtle)',
    position: 'relative',
    gap: '4px',
  };

  const barWrapperStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '2px',
    position: 'relative',
  };

  const barStyle = (height: number, color: string): React.CSSProperties => ({
    width: '45%',
    height: `${height}%`,
    backgroundColor: color,
    borderRadius: '2px 2px 0 0',
    transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  });

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LabelCapsText size="11px" color="var(--color-text-secondary)">
          VM Server Health (Host: 18.232.76.157)
        </LabelCapsText>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-primary-default)', borderRadius: '50%' }} />
            <MonoText size="11px" color="var(--color-text-secondary)">CPU ({cpuHistory[cpuHistory.length - 1]}%)</MonoText>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-semantic-success)', borderRadius: '50%' }} />
            <MonoText size="11px" color="var(--color-text-secondary)">RAM ({ramHistory[ramHistory.length - 1]}%)</MonoText>
          </div>
        </div>
      </div>

      {/* Resource Columns */}
      <div style={chartAreaStyle}>
        {/* Y-axis grid marks */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ width: '100%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />
          <div style={{ width: '100%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />
          <div style={{ width: '100%', borderTop: '1px dashed rgba(255,255,255,0.03)' }} />
        </div>

        {cpuHistory.map((cpuVal, idx) => (
          <div key={idx} style={barWrapperStyle}>
            {/* CPU Bar */}
            <div style={barStyle(cpuVal, 'var(--color-primary-default)')} title={`CPU: ${cpuVal}%`} />
            {/* RAM Bar */}
            <div style={barStyle(ramHistory[idx], 'var(--color-semantic-success)')} title={`RAM: ${ramHistory[idx]}%`} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-4px' }}>
        <LabelCapsText size="8px" color="var(--color-text-tertiary)">10m ago</LabelCapsText>
        <LabelCapsText size="8px" color="var(--color-text-tertiary)">Timeline (Live)</LabelCapsText>
        <LabelCapsText size="8px" color="var(--color-text-tertiary)">now</LabelCapsText>
      </div>
    </div>
  );
};
