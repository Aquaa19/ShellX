import React, { useState, useEffect } from 'react';
import { Server, ShieldCheck, Power, RefreshCw, AlertTriangle } from 'lucide-react';
import { HeadlineText, MonoText, PrimaryButton, SecondaryButton, LabelCapsText } from '../components/atoms';
import type { GatewayNode } from '../types';

const INITIAL_NODES: GatewayNode[] = [
  { id: 'node-1', ip: '18.232.76.157', hostname: 'gateway-us-east-1', cpuUsage: 35, ramUsage: 60, maxUsers: 50, activeUsers: 14, uptime: '14d 6h 22m' },
  { id: 'node-2', ip: '54.210.12.8', hostname: 'gateway-us-east-2', cpuUsage: 12, ramUsage: 42, maxUsers: 50, activeUsers: 3, uptime: '6d 12h 45m' },
];

export const GatewaysScreen: React.FC = () => {
  const [nodes, setNodes] = useState<GatewayNode[]>(INITIAL_NODES);
  const [isLive, setIsLive] = useState(false);

  const fetchNodes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_GATEWAY_API_URL}/api/nodes`);
      if (res.ok) {
        const data = await res.json() as GatewayNode[];
        if (Array.isArray(data) && data.length > 0) {
          setNodes(data);
          setIsLive(true);
        }
      } else {
        setIsLive(false);
      }
    } catch {
      setIsLive(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNodes();
  }, []);

  // Poll server resources or run simulation
  useEffect(() => {
    const timer = setInterval(() => {
      if (isLive) {
        fetchNodes();
      } else {
        setNodes((prev) =>
          prev.map((node) => ({
            ...node,
            cpuUsage: Math.round(Math.max(5, Math.min(95, node.cpuUsage + (Math.random() > 0.5 ? 5 : -5)))),
            ramUsage: Math.round(Math.max(30, Math.min(85, node.ramUsage + (Math.random() > 0.5 ? 1 : -1)))),
          }))
        );
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [isLive]);

  const handleNodeAction = async (action: string, nodeId: string, path: string) => {
    if (!window.confirm(`Are you sure you want to run action: ${action}?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_GATEWAY_API_URL}/api/nodes/${nodeId}/${path}`, {
        method: 'POST',
      });
      if (res.ok) {
        alert(`Successfully triggered "${action}" on Node ${nodeId}`);
        fetchNodes();
      } else {
        throw new Error(`Failed with status: ${res.status}`);
      }
    } catch (error) {
      const err = error as { message?: string };
      alert(`Action failed: ${err.message || 'Connection failed'}`);
    }
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-lg)',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'var(--spacing-md)',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
  };

  const progressContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const progressOuterStyle: React.CSSProperties = {
    height: '8px',
    backgroundColor: '#000000',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    width: '100%',
  };

  const progressInnerStyle = (width: number, color: string): React.CSSProperties => ({
    width: `${width}%`,
    height: '100%',
    backgroundColor: color,
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  });

  return (
    <div style={contentStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <HeadlineText level={1} style={{ marginBottom: '4px' }}>
            VM Gateway Registry
          </HeadlineText>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Review hypervisor CPU clusters, provision node-pty bridges, and wipe environments.
          </p>
        </div>
        <div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: 'var(--radius-default)',
            border: `1px solid ${isLive ? 'var(--color-border-success)' : 'var(--color-border-subtle)'}`,
            color: isLive ? 'var(--color-semantic-success)' : 'var(--color-text-tertiary)',
            backgroundColor: isLive ? 'rgba(79, 223, 148, 0.05)' : 'rgba(255,255,255,0.02)'
          }}>
            <LabelCapsText size="9px" color={isLive ? 'var(--color-semantic-success)' : 'var(--color-text-tertiary)'}>
              {isLive ? 'Hypervisor Connection Active' : 'Offline (Simulated)'}
            </LabelCapsText>
          </span>
        </div>
      </div>

      <div style={gridStyle}>
        {nodes.map((node) => {
          // Warning threshold checks
          const isCpuHigh = node.cpuUsage > 80;
          const isRamHigh = node.ramUsage > 80;

          return (
            <div key={node.id} style={cardStyle}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--spacing-sm)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Server size={16} color="var(--color-primary-default)" />
                    <MonoText size="14px" weight="bold">
                      {node.hostname}
                    </MonoText>
                  </div>
                  <MonoText size="11px" color="var(--color-text-secondary)" style={{ marginTop: '2px' }}>
                    IP: {node.ip}
                  </MonoText>
                </div>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(79, 223, 148, 0.05)',
                  border: '1px solid var(--color-border-success)',
                  color: 'var(--color-semantic-success)'
                }}>
                  <ShieldCheck size={12} />
                  <LabelCapsText size="8px" color="var(--color-semantic-success)">ONLINE</LabelCapsText>
                </span>
              </div>

              {/* Resource Gauges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {/* CPU usage progress bar */}
                <div style={progressContainerStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <LabelCapsText size="9px" color="var(--color-text-tertiary)">CPU load</LabelCapsText>
                    <MonoText size="11px" color={isCpuHigh ? 'var(--color-semantic-error)' : 'var(--color-text-secondary)'} weight="bold">
                      {node.cpuUsage}%
                    </MonoText>
                  </div>
                  <div style={progressOuterStyle}>
                    <div style={progressInnerStyle(node.cpuUsage, isCpuHigh ? 'var(--color-semantic-error)' : 'var(--color-primary-default)')} />
                  </div>
                </div>

                {/* RAM usage progress bar */}
                <div style={progressContainerStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <LabelCapsText size="9px" color="var(--color-text-tertiary)">Virtual RAM overhead</LabelCapsText>
                    <MonoText size="11px" color={isRamHigh ? 'var(--color-semantic-error)' : 'var(--color-text-secondary)'} weight="bold">
                      {node.ramUsage}%
                    </MonoText>
                  </div>
                  <div style={progressOuterStyle}>
                    <div style={progressInnerStyle(node.ramUsage, isRamHigh ? 'var(--color-semantic-error)' : 'var(--color-semantic-success)')} />
                  </div>
                </div>

                {/* Info block */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', padding: '10px', backgroundColor: '#000000', borderRadius: 'var(--radius-default)', border: '1px solid var(--color-border-subtle)' }}>
                  <div>
                    <LabelCapsText size="8px" color="var(--color-text-tertiary)">Active users</LabelCapsText>
                    <MonoText size="13px" weight="bold" color="var(--color-syntax-orange)">
                      {node.activeUsers} / {node.maxUsers}
                    </MonoText>
                  </div>
                  <div>
                    <LabelCapsText size="8px" color="var(--color-text-tertiary)">uptime counter</LabelCapsText>
                    <MonoText size="12px" weight="bold">
                      {node.uptime}
                    </MonoText>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: '4px' }}>
                <PrimaryButton 
                  onClick={() => handleNodeAction('Provision VM cluster', node.id, 'reboot')}
                  style={{ minHeight: '36px', fontSize: '11px', flex: 1, backgroundColor: 'transparent', border: '1px solid var(--color-border-strong)', color: 'var(--color-text-primary)' }}
                >
                  <Power size={12} style={{ marginRight: '6px' }} />
                  <span>REBOOT CLUSTER</span>
                </PrimaryButton>
                <SecondaryButton 
                  onClick={() => handleNodeAction('Full Clean Wipe container images', node.id, 'wipe')}
                  style={{ minHeight: '36px', fontSize: '11px', flex: 1, borderColor: 'var(--color-semantic-error)', color: 'var(--color-semantic-error)' }}
                >
                  <RefreshCw size={12} style={{ marginRight: '6px' }} />
                  <span>WIPE CONTAINERS</span>
                </SecondaryButton>
              </div>
            </div>
          );
        })}

        {/* Provision Node Placeholder card */}
        <div style={{ ...cardStyle, borderStyle: 'dashed', borderColor: 'var(--color-border-strong)', justifyContent: 'center', alignItems: 'center', minHeight: '260px' }}>
          <AlertTriangle size={32} color="var(--color-text-tertiary)" style={{ marginBottom: '8px' }} />
          <LabelCapsText size="11px" color="var(--color-text-tertiary)" style={{ textAlign: 'center' }}>
            hypervisor cluster capacity active
          </LabelCapsText>
          <SecondaryButton 
            onClick={() => alert('[PROVISION] Provisioning a new VM node hypervisor...')}
            style={{ minHeight: '36px', fontSize: '11px', marginTop: 'var(--spacing-md)', padding: '6px 12px' }}
          >
            <span>PROVISION NEW NODE</span>
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
