import React, { HTMLAttributes } from 'react';

export const Card = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${className}`}
      {...props}
    />
  );
};