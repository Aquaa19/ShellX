import React from 'react';
import { LogOut, Terminal } from 'lucide-react';
import { MonoText, PrimaryButton, LabelCapsText } from '../atoms';

interface AppHeaderProps {
  onLogout: () => void;
  userEmail?: string | null;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onLogout, userEmail }) => {
  const headerStyle: React.CSSProperties = {
    height: '64px',
    width: '100%',
    backgroundColor: 'var(--color-background-elevated)',
    borderBottom: '1px solid var(--color-border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 var(--spacing-lg)',
    zIndex: 100,
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  };

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <Terminal size={20} color="var(--color-semantic-success)" />
        <MonoText size="16px" weight="bold" color="var(--color-semantic-success)">
          ShellX_Nexus
        </MonoText>
      </div>

      <div style={rightSectionStyle}>
        {userEmail && (
          <LabelCapsText size="11px" color="var(--color-text-secondary)">
            Active Session: {userEmail}
          </LabelCapsText>
        )}
        <PrimaryButton 
          onClick={onLogout}
          style={{ 
            minHeight: '36px', 
            backgroundColor: 'transparent',
            border: '1px solid var(--color-semantic-error)', 
            color: 'var(--color-semantic-error)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px'
          }}
        >
          <LogOut size={14} />
          <span>SIGN OUT</span>
        </PrimaryButton>
      </div>
    </header>
  );
};
