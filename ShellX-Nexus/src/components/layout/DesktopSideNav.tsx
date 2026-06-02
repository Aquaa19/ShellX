import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Cpu, 
  ShieldAlert 
} from 'lucide-react';
import { MonoText, LabelCapsText } from '../atoms';

export const DesktopSideNav: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    width: '256px',
    height: 'calc(100vh - 64px)',
    backgroundColor: 'var(--color-background-elevated)',
    borderRight: '1px solid var(--color-border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--spacing-md) 0',
  };

  const profileCardStyle: React.CSSProperties = {
    padding: '0 var(--spacing-md) var(--spacing-md) var(--spacing-md)',
    borderBottom: '1px solid var(--color-border-subtle)',
    marginBottom: 'var(--spacing-md)',
  };

  const linksContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '0 var(--spacing-sm)',
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Students', path: '/students', icon: <Users size={16} /> },
    { label: 'Curriculum', path: '/curriculum', icon: <BookOpen size={16} /> },
    { label: 'Gateways', path: '/gateways', icon: <Cpu size={16} /> },
    { label: 'Audits', path: '/audits', icon: <ShieldAlert size={16} /> },
  ];

  const getLinkStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: '12px var(--spacing-md)',
    borderRadius: 'var(--radius-default)',
    color: isActive ? 'var(--color-semantic-success)' : 'var(--color-text-secondary)',
    backgroundColor: isActive ? 'rgba(79, 223, 148, 0.05)' : 'transparent',
    borderLeft: isActive ? '3px solid var(--color-semantic-success)' : '3px solid transparent',
    textDecoration: 'none',
    transition: 'all 0.2s',
  });

  return (
    <aside style={containerStyle}>
      {/* Profile Header */}
      <div style={profileCardStyle}>
        <MonoText size="14px" weight="bold" color="var(--color-primary-default)">
          root@shellx
        </MonoText>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-semantic-success)',
          }} />
          <LabelCapsText size="9px" color="var(--color-text-tertiary)">
            Admin Session
          </LabelCapsText>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={linksContainerStyle}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => getLinkStyle(isActive)}
          >
            {item.icon}
            <MonoText size="13px" weight="500" color="inherit">
              {item.label}
            </MonoText>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
