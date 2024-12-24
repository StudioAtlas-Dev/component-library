'use client';

import { useState } from 'react';
import { FiGlobe, FiClock, FiAward, FiTarget, FiUsers, FiTrendingUp, FiShield, FiHeart } from 'react-icons/fi';
import { CardGrid } from '@/components/ui/ServiceCard/CardGrid';
import { ServiceCardData, ServiceCardProps } from '@/components/ui/ServiceCard/types';
import { IconAnimation, CardAnimation } from '@/components/ui/ServiceCard/animations/types';
import { cn } from '@/lib/utils';

// All possible demo cards
const allDemoCards: ServiceCardData[] = [
  {
    icon: FiTarget,
    title: '100% Success Rate',
    description: 'We consistently deliver results that exceed expectations, ensuring your business goals are met with precision and excellence.'
  },
  {
    icon: FiUsers,
    title: 'Expert Services',
    description: 'Our team of seasoned professionals brings decades of combined experience to deliver top-tier consulting solutions.'
  },
  {
    icon: FiTrendingUp,
    title: 'Business Strategy',
    description: 'Develop comprehensive strategies that drive growth, optimize operations, and maximize your competitive advantage.'
  },
  {
    icon: FiShield,
    title: 'Highly Recommend',
    description: 'Join our satisfied clients who consistently rate our services as exceptional and recommend us to their network.'
  },
  {
    icon: FiAward,
    title: 'Industry Leading',
    description: 'Recognized as a leader in our field, setting the standard for excellence and innovation in business solutions.'
  },
  {
    icon: FiClock,
    title: 'Time Efficient',
    description: 'Our streamlined processes ensure quick implementation while maintaining the highest quality standards.'
  },
  {
    icon: FiGlobe,
    title: 'Global Reach',
    description: 'Serve clients worldwide with localized solutions that consider cultural and market-specific needs.'
  },
  {
    icon: FiHeart,
    title: 'Client Focused',
    description: 'Put our clients first with personalized attention and dedicated support throughout every engagement.'
  }
];

interface AnimationControls {
  cardAnimation: CardAnimation;
  iconAnimation: IconAnimation;
}

type Variant = NonNullable<ServiceCardProps['variant']>;

export default function ServiceCardTypesComponent() {
  const [cardCount, setCardCount] = useState<number>(4);
  const demoCards = allDemoCards.slice(0, cardCount);

  // Track animation settings for each variant
  const [variantAnimations, setVariantAnimations] = useState<Record<Variant, AnimationControls>>({
    grid: { cardAnimation: 'thicken-border', iconAnimation: 'none' },
    compact: { cardAnimation: 'thicken-border', iconAnimation: 'none' },
    floating: { cardAnimation: 'thicken-border', iconAnimation: 'none' }
  });

  const updateAnimation = (
    variant: Variant, 
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
      <div className="flex items-center justify-end px-4 sm:px-6 lg:px-8">
        <p className="mr-4"> Number of Cards:</p>
        <select
          className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900"
          value={cardCount}
          onChange={(e) => setCardCount(Number(e.target.value))}
        >
          <option value="" disabled>Number of Cards</option>
          {Array.from({ length: 7 }, (_, i) => i + 2).map(num => (
            <option key={num} value={num}>{num} Cards</option>
          ))}
        </select>
      </div>

      {(Object.keys(variantAnimations) as Variant[]).map(variant => (
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