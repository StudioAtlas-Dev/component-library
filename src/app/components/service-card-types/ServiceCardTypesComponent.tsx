'use client';

import { useState } from 'react';
import { FiGlobe, FiClock, FiAward, FiTarget, FiUsers, FiTrendingUp, FiShield, FiHeart } from 'react-icons/fi';
import { CardGrid } from '@/components/ui/ServiceCard/CardGrid';
import { ServiceCardData, ServiceCardProps } from '@/components/ui/ServiceCard/types';

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
  cardAnimation: string;
  iconAnimation: string;
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
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // Convert selected options to space-separated string
    const selectedValues = Array.from(event.target.selectedOptions).map((option: HTMLOptionElement) => option.value);
    const value = selectedValues.length ? selectedValues.join(' ') : 'none';

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
        <p className="mr-4">Number of Cards:</p>
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
                value={variantAnimations[variant].cardAnimation.split(' ')}
                onChange={(e) => updateAnimation(variant, 'cardAnimation', e)}
                multiple
                size={3}
              >
                <option value="thicken-border">Thicken Border</option>
                <option value="link-indicator">Link Indicator</option>
              </select>
              <select
                className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900"
                value={variantAnimations[variant].iconAnimation.split(' ')}
                onChange={(e) => updateAnimation(variant, 'iconAnimation', e)}
                multiple
                size={3}
              >
                <option value="icon-360">360° Rotation</option>
                <option value="lighten">Lighten Icon</option>
              </select>
            </div>
          </div>
          <CardGrid
            cards={demoCards}
            variant={variant}
            cardAnimation={variantAnimations[variant].cardAnimation}
            iconAnimation={variantAnimations[variant].iconAnimation}
            popColor="#007acc"
            darkColor="#00497a"
          />
        </div>
      ))}
    </section>
  );
} 