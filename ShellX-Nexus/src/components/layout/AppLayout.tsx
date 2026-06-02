import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { DesktopSideNav } from './DesktopSideNav';
import { useAuth } from '../../context/AuthContext';

export const AppLayout: React.FC = () => {
  const { user, logout, isAuthLoading } = useAuth();

  // If loading authentication state, show a clean, simple spinner
  if (isAuthLoading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--color-background-floor)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        color: 'var(--color-semantic-success)'
      }}>
        [ INITIALIZING SESSION... ]
      </div>
    );
  }

  // If user is not authenticated, redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const layoutContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: 'var(--color-background-floor)',
  };

  const bodyContainerStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    height: 'calc(100vh - 64px)',
    width: '100%',
    overflow: 'hidden',
  };

  const mainViewportStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    overflowY: 'auto',
    backgroundColor: 'var(--color-background-floor)',
    padding: 'var(--spacing-lg)',
  };

  return (
    <div style={layoutContainerStyle}>
      <AppHeader onLogout={logout} userEmail={user.email} />
      
      <div style={bodyContainerStyle}>
        <DesktopSideNav />
        <main style={mainViewportStyle}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
