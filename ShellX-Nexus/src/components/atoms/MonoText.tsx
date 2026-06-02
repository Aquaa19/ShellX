import React from 'react';

interface MonoTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  size?: string | number;
  weight?: 'normal' | 'bold' | '600' | '500';
}

export const MonoText: React.FC<MonoTextProps> = ({ children, color, size, weight, className = '', style, ...props }) => {
  const customStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    color: color ? color : 'var(--color-text-primary)',
    fontSize: size ? (typeof size === 'number' ? `${size}px` : size) : '13px',
    fontWeight: weight ? weight : 'normal',
    letterSpacing: '-0.02em',
    ...style,
  };

  return (
    <span className={`mono-text ${className}`} style={customStyle} {...props}>
      {children}
    </span>
  );
};
