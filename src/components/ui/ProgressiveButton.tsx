'use client';

import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from './button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>
type ButtonHoverEffect = 'none' | 'fill-in' | 'fill-up' | 'pulse' | 'slide' | 'reveal-arrow';

interface ProgressiveButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  style?: React.CSSProperties;
  hoverEffect?: ButtonHoverEffect;
}

export function ProgressiveButton({
  href,
  variant = 'default',
  size = 'default',
  className,
  style,
  children,
  hoverEffect = 'none',
}: ProgressiveButtonProps) {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // SSR fallback: a simple, SEO-friendly link
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size }), className)}
        style={style}
      >
        {children}
      </Link>
    );
  }

  // After hydration: enhanced button
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn(className)}
      style={style}
      hoverEffect={hoverEffect}
    >
      <Link href={href}>
        {children}
      </Link>
    </Button>
  );
}
