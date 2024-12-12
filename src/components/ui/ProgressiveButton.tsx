'use client';

import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from './button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import type { LinkProps } from 'next/link';

/**
 * A progressively enhanced button component that gracefully upgrades from a basic link to an
 * interactive button with animations based on client-side capabilities.
 * 
 * Progressive Enhancement Strategy:
 * 1. Server-Side (Initial Load):
 *    - Renders as a basic <Link> with styling for maximum compatibility
 *    - Ensures SEO-friendly markup and functionality without JS
 * 
 * 2. Client-Side (After Hydration):
 *    - Upgrades to full Button component with hover effects
 *    - Adds interactive animations and enhanced styling
 *    - Maintains the same core functionality if JS fails
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ProgressiveButton href="/about">About Us</ProgressiveButton>
 * 
 * // With hover effects and custom styling
 * <ProgressiveButton 
 *   href="/contact"
 *   hoverEffect="fill-in"
 *   variant="outline"
 * >
 *   Contact Us
 * </ProgressiveButton>
 * ```
 */

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>
export type ButtonHoverEffect = 'none' | 'fill-in' | 'fill-up' | 'pulse' | 'slide' | 'reveal-arrow' | 'reveal-icon';

interface ProgressiveButtonProps extends Omit<LinkProps, 'href'> {
  /** URL the button links to */
  href: string;
  /** Button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button size preset */
  size?: ButtonSize;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles (use sparingly, prefer className) */
  style?: React.CSSProperties;
  /** Animation effect on hover (only active after hydration) */
  hoverEffect?: ButtonHoverEffect;
  /** Color for hover animation overlay */
  hoverColor?: string;
  /** HTML target attribute */
  target?: string;
  /** HTML rel attribute - automatically set when target="_blank" */
  rel?: string;
}

export function ProgressiveButton({
  href,
  variant = 'default',
  size = 'default',
  className,
  style,
  children,
  hoverEffect = 'none',
  hoverColor = 'black',
  target,
  rel,
  ...props
}: ProgressiveButtonProps) {
  // Track hydration state for progressive enhancement
  const [hydrated, setHydrated] = React.useState(false);

  // Effect runs once on client to signal hydration is complete
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  // Set rel="noopener noreferrer" when target="_blank" for security
  const linkRel = target === '_blank' ? 'noopener noreferrer' : rel;

  if (!hydrated) {
    // SSR/Initial Load: Render basic link with button styling
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size, hoverEffect }), className)}
        style={style}
        target={target}
        rel={linkRel}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Client-side: Enhanced version with full interactivity
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
      style={style}
      hoverEffect={hoverEffect}
      hoverColor={hoverColor}
    >
      <Link 
        href={href}
        target={target}
        rel={linkRel}
        {...props}
      >
        {children}
      </Link>
    </Button>
  );
}
