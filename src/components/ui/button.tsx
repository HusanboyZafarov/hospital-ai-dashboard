import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  children,
  ...props 
}) => {
  const baseStyles = 'px-4 py-3 rounded-[10px] transition-colors cursor-pointer border-none';
  
  const variants = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]',
    secondary: 'bg-[#0EA5E9] text-white hover:bg-[#0284c7]',
    outline: 'bg-white text-[#2563EB] border border-[#2563EB] hover:bg-[#EFF6FF]',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
