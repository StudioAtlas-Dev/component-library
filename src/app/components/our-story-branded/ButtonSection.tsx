'use client';

import { Button } from '@/components/ui/button';

interface ButtonSectionProps {
  buttonText: string;
  popColor: string;
  size: 'lg' | 'custom';
  hoverEffect?: 'slide';
}

export function ButtonSection({ buttonText, popColor, size, hoverEffect = 'slide' }: ButtonSectionProps) {
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