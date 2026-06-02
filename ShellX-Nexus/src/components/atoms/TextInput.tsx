import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  label,
  error, 
  className = '', 
  style, 
  ...props 
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xs)',
    width: '100%',
  };

  const inputStyle: React.CSSProperties = {
    minHeight: '44px',
    backgroundColor: 'var(--color-background-input)',
    border: `1px solid ${error ? 'var(--color-border-error)' : 'var(--color-border-subtle)'}`,
    borderRadius: 'var(--radius-default)',
    color: 'var(--color-text-primary)',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontSize: '13px',
    padding: '0 12px',
    outline: 'none',
    transition: 'border-color 0.2s',
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-text-secondary)',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: '11px',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    color: 'var(--color-semantic-error)',
    marginTop: '2px',
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <input 
        className={`text-input ${className}`} 
        style={inputStyle}
        {...props}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};
