import React, { ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'none' | 'danger';
  size?: 'default' | 'small' | 'large';
  as?: React.ElementType;
};

export const Button = ({ variant = 'primary', size = 'default', className = '', ...props }: ButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none cursor-pointer focus:ring-2';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 hover:text-purple-800 focus:ring-primary/50',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200 border border-gray-300',
    link: 'bg-transparent text-purple-500 hover:bg-purple-50 focus:ring-purple-200 underline',
    none: 'bg-transparent text-gray-800 active:border-transparent active:bg-transparent focus:ring-transparent ',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-200',
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