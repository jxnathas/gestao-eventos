import React, { HTMLAttributes } from 'react';
import { Container } from './Container';

type SectionProps = HTMLAttributes<HTMLDivElement> & {
  fullWidth?: boolean;
  containerClassName?: string;
};

export const Section = ({
  fullWidth = false,
  className = '',
  containerClassName = '',
  children,
  ...props
}: SectionProps) => {

  if (fullWidth) {
    return (
      <section className={`w-full ${className}`} {...props}>
        {children}
      </section>
    );
  }

  return (
    <section className={`w-full ${className}`} {...props}>
      <Container className={containerClassName}>
        {children}
      </Container>
    </section>
  );
};