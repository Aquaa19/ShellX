import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MonoText, PrimaryButton } from '../components/atoms';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  // If already logged in, redirect to dashboard immediately
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Simulate terminal boot sequence on mount
  useEffect(() => {
    const logs = [
      'INIT: Booting ShellX Nexus Gatekeeper v2.0...',
      'SYSTEM: Authenticating node connection to live VM [18.232.76.157]... OK',
      'SECURE: Keyring decrypted successfully.',
      'READY: Click authorize button to sign in.'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        const nextLog = logs[currentLogIndex];
        setBootLogs((prev) => [...prev, nextLog]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setBootLogs((prev) => [
      ...prev,
      'SYSTEM: Requesting Google Sign-In pop-up authorization...'
    ]);

    try {
      const success = await loginWithGoogle();
      if (success) {
        setBootLogs((prev) => [
          ...prev,
          'SYSTEM: Google OAuth validated.',
          'SYSTEM: Fetching admin profile document...',
          'SYSTEM: Admin clearance VERIFIED.',
          'READY: Access granted. Loading Nexus Workspace...'
        ]);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Google sign-in error.';
      setErrorMsg(errMsg);
      setBootLogs((prev) => [
        ...prev,
        `[ ERROR ] AUTH FAILED: ${errMsg}`
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--color-background-floor)',
    padding: 'var(--spacing-md)',
  };

  const terminalFrameStyle: React.CSSProperties = {
    width: '450px',
    maxWidth: '100%',
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.8)',
  };

  const terminalHeaderStyle: React.CSSProperties = {
    height: '36px',
    backgroundColor: '#111111',
    borderBottom: '1px solid var(--color-border-subtle)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    justifyContent: 'space-between',
  };

  const windowControlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '6px',
  };

  const windowDotStyle = (color: string): React.CSSProperties => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
  });

  const terminalBodyStyle: React.CSSProperties = {
    padding: 'var(--spacing-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
  };

  const logConsoleStyle: React.CSSProperties = {
    backgroundColor: '#000000',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-default)',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minHeight: '120px',
  };

  return (
    <div style={pageContainerStyle}>
      <div style={terminalFrameStyle}>
        {/* Terminal Header */}
        <div style={terminalHeaderStyle}>
          <div style={windowControlsStyle}>
            <div style={windowDotStyle('var(--color-semantic-error)')} />
            <div style={windowDotStyle('var(--color-semantic-warning)')} />
            <div style={windowDotStyle('var(--color-semantic-success)')} />
          </div>
          <MonoText size="11px" color="var(--color-text-secondary)" weight="bold">
            nexus_auth_session.sh
          </MonoText>
          <div style={{ width: '42px' }} /> {/* Spacer */}
        </div>

        {/* Terminal Body */}
        <div style={terminalBodyStyle}>
          {/* Boot Logs */}
          <div style={logConsoleStyle}>
            {bootLogs.map((log, index) => {
              const isError = log && log.includes('[ ERROR ]');
              return (
                <MonoText 
                  key={index} 
                  size="12px" 
                  color={isError ? 'var(--color-semantic-error)' : 'var(--color-text-secondary)'}
                >
                  {log && log.startsWith('[ ERROR ]') ? '✖' : '➜'} {log}
                </MonoText>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {errorMsg && (
              <div style={{
                border: '1px solid var(--color-semantic-error)',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                padding: '10px',
                borderRadius: 'var(--radius-default)',
              }}>
                <MonoText size="12px" color="var(--color-semantic-error)">
                  {errorMsg}
                </MonoText>
              </div>
            )}
            
            <PrimaryButton 
              onClick={handleGoogleSignIn}
              loading={isLoading}
              style={{ 
                marginTop: 'var(--spacing-sm)',
                gap: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            >
              {!isLoading && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              AUTHORIZE WITH GOOGLE
            </PrimaryButton>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xs)' }}>
            <MonoText size="11px" color="var(--color-text-tertiary)">
              ShellX Admin portal access is restricted.
            </MonoText>
          </div>
        </div>
      </div>
    </div>
  );
};
