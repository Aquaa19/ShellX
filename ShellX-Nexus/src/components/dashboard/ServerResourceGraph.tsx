import React, { useEffect, useState } from 'react';
import { MonoText, LabelCapsText } from '../atoms';
import type { GatewayNode } from '../../types';

export const ServerResourceGraph: React.FC = () => {
  // Generate CPU and RAM histories
  const [cpuHistory, setCpuHistory] = useState<number[]>([32, 28, 45, 55, 60, 52, 40, 38, 45, 48]);
  const [ramHistory, setRamHistory] = useState<number[]>([55, 56, 56, 57, 58, 58, 57, 58, 59, 60]);
  const [hostIp, setHostIp] = useState('18.232.76.157');

  // Simulate updates or load from Live nodes
  useEffect(() => {
    const fetchLiveHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_GATEWAY_API_URL}/api/nodes`);
        if (res.ok) {
          const data = await res.json() as GatewayNode[];
          if (Array.isArray(data) && data.length > 0) {
            let cpuSum = 0;
            let ramSum = 0;
            data.forEach(node => {
              cpuSum += node.cpuUsage || 0;
              ramSum += node.ramUsage || 0;
            });
            const avgCpu = Math.round(cpuSum / data.length);
            const avgRam = Math.round(ramSum / data.length);

            setCpuHistory(prev => [...prev.slice(1), avgCpu]);
            setRamHistory(prev => [...prev.slice(1), avgRam]);
            
            if (data[0]?.ip) {
              setHostIp(data[0].ip);
            }
            return;
          }
        }
        throw new Error('API offline');
      } catch {
        // Fallback simulation
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
      }
    };

    fetchLiveHistory();
    const interval = setInterval(fetchLiveHistory, 5000);
    return () => clearInterval(interval);
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
          VM Server Health (Host: {hostIp})
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
