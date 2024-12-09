'use client';

import { Button, ButtonHoverEffect } from '@/components/ui/button';

interface ButtonSectionProps {
  buttonText: string;
  popColor: string;
  hoverEffect: ButtonHoverEffect;
  size: 'lg' | 'custom';
}

export function ButtonSection({ buttonText, popColor, hoverEffect, size }: ButtonSectionProps) {
  return (
    <Button 
      size={size}
      bgColor={popColor}
      hoverEffect={hoverEffect}
    >
      {buttonText}
    </Button>
  );
} 