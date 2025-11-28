import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  padding = '24px'
}) => {
  return (
    <div 
      className={`bg-white rounded-[12px] border border-[#E2E8F0] ${className}`}
      style={{ 
        padding,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}
    >
      {children}
    </div>
  );
};
