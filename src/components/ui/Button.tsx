import React, { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'small' | 'large';
  as?: React.ElementType;
};

export const Button = ({ variant = 'primary', size = 'default', className = '', ...props }: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200 border border-gray-300',
  };

  const sizes = {
    default: 'text-base',
    small: 'text-sm',
    large: 'text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
};