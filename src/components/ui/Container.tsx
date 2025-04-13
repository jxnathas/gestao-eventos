import React, { HTMLAttributes } from 'react';

export const Container = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`max-w-full mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    />
  );
};