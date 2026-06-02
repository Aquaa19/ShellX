import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  className = '', 
  style, 
  ...props 
}) => {
  const btnStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-default)',
    border: 'none',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.4 : 1,
    transition: 'background-color 0.2s, color 0.2s',
    color: 'var(--color-text-primary)',
    outline: 'none',
    padding: 0,
    ...style,
  };

  return (
    <button 
      className={`icon-btn ${className}`} 
      style={btnStyle}
      {...props}
    >
      {icon}
    </button>
  );
};
