import { Button, ButtonProps } from './Button';
import Link from 'next/link';
import { forwardRef } from 'react';


type ButtonLinkProps = ButtonProps & {
  href: string;
  prefetch?: boolean;
  scroll?: boolean;
};

export const ButtonLink = forwardRef<HTMLAnchorElement,  ButtonLinkProps>(
  ({ 
    href,
    variant = 'primary',
    size = 'default',
    className = '',
    prefetch = true,
    scroll = true,
    children,
    ...props
  }, ref) => {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        scroll={scroll}
        passHref
        legacyBehavior
      >
        <Button
          as="a"
          variant={variant}
          size={size}
          className={className}
          ref={ref}
          {...props}
        >
          {children}
        </Button>
      </Link>
    );
  }
);

ButtonLink.displayName = 'ButtonLink';