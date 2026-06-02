import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ 
  children, 
  loading, 
  className = '', 
  style, 
  ...props 
}) => {
  const buttonStyle: React.CSSProperties = {
    minHeight: '44px',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-default)',
    fontWeight: '600',
    fontSize: '13px',
    cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
    opacity: props.disabled || loading ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'border-color 0.2s, background-color 0.2s',
    outline: 'none',
    letterSpacing: '0.02em',
    ...style,
  };

  return (
    <button 
      className={`secondary-btn ${className}`} 
      style={buttonStyle}
      {...props}
    >
      {loading ? 'LOADING...' : children}
    </button>
  );
};
