import React, { InputHTMLAttributes } from 'react';

type InputProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ label, className = '', ...props }: InputProps) => {
  return (
    <label className="block">
      <span className="text-gray-700">{label}</span>
      <input
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent ${className}`}
        {...props}
      />
    </label>
  );
};