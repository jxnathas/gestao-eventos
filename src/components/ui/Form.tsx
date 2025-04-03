import React, { FormHTMLAttributes } from 'react';

export const Form = ({ className = '', ...props }: FormHTMLAttributes<HTMLFormElement>) => {
  return (
    <form
      className={`space-y-4 ${className}`}
      {...props}
    />
  );
};