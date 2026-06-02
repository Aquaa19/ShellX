import React from 'react';

interface SafeTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  size?: string;
}

export const SafeText: React.FC<SafeTextProps> = ({ children, color, size, className = '', style, ...props }) => {
  const customStyle: React.CSSProperties = {
    color: color ? color : 'var(--color-text-primary)',
    fontSize: size ? size : '14px',
    ...style,
  };

  return (
    <span className={`safe-text ${className}`} style={customStyle} {...props}>
      {children}
    </span>
  );
};
