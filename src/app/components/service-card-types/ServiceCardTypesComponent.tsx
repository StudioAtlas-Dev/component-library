'use client';

import { useState } from 'react';
import { FiGlobe, FiClock, FiAward } from 'react-icons/fi';
import { CardGrid } from '@/components/ui/ServiceCard/CardGrid';
import { ServiceCardData } from '@/components/ui/ServiceCard/types';
import { IconAnimation, CardAnimation } from '@/components/ui/ServiceCard/animations/types';
import { cn } from '@/lib/utils';

// Default cards for demonstration
const demoCards: ServiceCardData[] = [
  {
    icon: FiGlobe,
    title: 'Global Reach',
    description: 'Serve clients worldwide with localized solutions that consider cultural and market-specific needs.'
  },
  {
    icon: FiClock,
    title: 'Time Efficient',
    description: 'Our streamlined processes ensure quick implementation while maintaining the highest quality standards.'
  },
  {
    icon: FiAward,
    title: 'Industry Leading',
    description: 'Recognized as a leader in our field, setting the standard for excellence and innovation in business solutions.'
  }
];

// Import variants from types
const variants = ['grid', 'compact'] as const;

interface AnimationControls {
  cardAnimation: CardAnimation;
  iconAnimation: IconAnimation;
}

export default function ServiceCardTypesComponent() {
  // Track animation settings for each variant
  const [variantAnimations, setVariantAnimations] = useState<Record<typeof variants[number], AnimationControls>>({
    grid: { cardAnimation: 'thicken-border', iconAnimation: 'none' },
    compact: { cardAnimation: 'thicken-border', iconAnimation: 'none' }
  });

  const updateAnimation = (
    variant: typeof variants[number], 
    type: 'cardAnimation' | 'iconAnimation', 
    value: CardAnimation | IconAnimation
  ) => {
    setVariantAnimations(prev => ({
      ...prev,
      [variant]: {
        ...prev[variant],
        [type]: value
      }
    }));
  };

  return (
    <section className="w-full py-12 space-y-12">
      {variants.map(variant => (
        <div key={variant} className="space-y-4">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold capitalize">{variant} Variant</h2>
            <div className="flex gap-4">
              <select
                className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900"
                value={variantAnimations[variant].cardAnimation}
                onChange={(e) => updateAnimation(variant, 'cardAnimation', e.target.value as CardAnimation)}
              >
                <option value="" disabled>Card Animation</option>
                <option value="none">No Card Animation</option>
                <option value="thicken-border">Thicken Border</option>
              </select>
              <select
                className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900"
                value={variantAnimations[variant].iconAnimation}
                onChange={(e) => updateAnimation(variant, 'iconAnimation', e.target.value as IconAnimation)}
              >
                <option value="" disabled>Icon Animation</option>
                <option value="none">No Icon Animation</option>
                <option value="icon-360">360° Rotation</option>
              </select>
            </div>
          </div>
          <CardGrid
            cards={demoCards}
            variant={variant}
            cardAnimation={variantAnimations[variant].cardAnimation}
            iconAnimation={variantAnimations[variant].iconAnimation}
            popColor="#007acc"
          />
        </div>
      ))}
    </section>
  );
} 