import React, { InputHTMLAttributes } from 'react';

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent ${className}`}
      {...props}
    />
  );
};