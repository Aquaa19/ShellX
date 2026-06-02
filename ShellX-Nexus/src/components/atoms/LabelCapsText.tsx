import React from 'react';

interface LabelCapsTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  size?: string;
}

export const LabelCapsText: React.FC<LabelCapsTextProps> = ({ 
  children, 
  color = 'var(--color-text-secondary)', 
  size = '11px', 
  className = '', 
  style, 
  ...props 
}) => {
  const customStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontSize: size,
    fontWeight: '600',
    color,
    ...style,
  };

  return (
    <span className={`label-caps-text ${className}`} style={customStyle} {...props}>
      {children}
    </span>
  );
};
