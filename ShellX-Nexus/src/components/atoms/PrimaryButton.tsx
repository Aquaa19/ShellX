import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  children, 
  loading, 
  className = '', 
  style, 
  ...props 
}) => {
  const buttonStyle: React.CSSProperties = {
    minHeight: '44px',
    padding: '10px 20px',
    backgroundColor: 'var(--color-primary-default)',
    color: '#000000',
    border: 'none',
    borderRadius: 'var(--radius-default)',
    fontWeight: '600',
    fontSize: '13px',
    cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
    opacity: props.disabled || loading ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s, transform 0.1s',
    outline: 'none',
    letterSpacing: '0.02em',
    ...style,
  };

  return (
    <button 
      className={`primary-btn ${className}`} 
      style={buttonStyle}
      {...props}
    >
      {loading ? 'LOADING...' : children}
    </button>
  );
};
