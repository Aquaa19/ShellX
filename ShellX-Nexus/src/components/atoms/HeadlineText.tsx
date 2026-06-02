import React from 'react';

interface HeadlineTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  weight?: 'normal' | 'bold' | '600' | '700';
  color?: string;
}

export const HeadlineText: React.FC<HeadlineTextProps> = ({ 
  children, 
  level = 2, 
  weight = 'bold', 
  color, 
  className = '', 
  style, 
  ...props 
}) => {
  const Tag = `h${level}` as const;
  
  const getFontSize = () => {
    switch (level) {
      case 1: return '28px';
      case 2: return '22px';
      case 3: return '18px';
      case 4: return '15px';
      default: return '20px';
    }
  };

  const customStyle: React.CSSProperties = {
    margin: 0,
    fontSize: getFontSize(),
    fontWeight: weight,
    color: color ? color : 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
    lineHeight: '1.25',
    ...style,
  };

  return (
    <Tag className={`headline-text ${className}`} style={customStyle} {...props}>
      {children}
    </Tag>
  );
};
