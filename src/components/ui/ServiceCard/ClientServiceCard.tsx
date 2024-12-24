'use client';

import { twMerge } from 'tailwind-merge';
import React, { useRef } from 'react';
import { AnimeInstance } from 'animejs';
import * as iconAnimations from './animations/iconAnimations';
import * as cardAnimations from './animations/cardAnimations';
import { cardVariants } from './types';

interface ClientServiceCardProps {
  title: string;
  description: string;
  className?: string;
  iconComponent: React.ReactNode;
  iconAnimation?: string;
  cardAnimation?: string;
  variant?: 'grid' | 'compact';
  children?: React.ReactNode;
}

function ClientServiceCard({
  title,
  description,
  className,
  iconComponent,
  iconAnimation = 'none',
  cardAnimation = 'none',
  variant = 'grid',
  children
}: ClientServiceCardProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const iconAnimationRef = useRef<AnimeInstance | null>(null);
  const cardAnimationRef = useRef<AnimeInstance | null>(null);
  const isIconAnimatingRef = useRef(false);
  const isCardAnimatingRef = useRef(false);

  React.useEffect(() => {
    if (!iconRef.current || !cardRef.current || !borderRef.current) return;

    const iconElement = iconRef.current;
    const cardElement = cardRef.current;
    const borderElement = borderRef.current;

    const mouseEnter = () => {
      // Handle icon animation
      if (iconAnimation !== 'none') {
        if (isIconAnimatingRef.current) {
          iconAnimationRef.current?.pause();
        }
        if (iconAnimation === 'icon-360' && iconAnimations.icon360) {
          iconAnimationRef.current = iconAnimations.icon360.enter(iconElement);
          iconAnimationRef.current.finished.then(() => {
            isIconAnimatingRef.current = false;
          });
          isIconAnimatingRef.current = true;
        }
      }

      // Handle card animation
      if (cardAnimation !== 'none') {
        if (isCardAnimatingRef.current) {
          cardAnimationRef.current?.pause();
        }
        if (cardAnimation === 'thicken-border' && cardAnimations.thickenBorder) {
          cardAnimationRef.current = cardAnimations.thickenBorder.enter(borderElement);
          cardAnimationRef.current.finished.then(() => {
            isCardAnimatingRef.current = false;
          });
          isCardAnimatingRef.current = true;
        }
      }
    };

    const mouseLeave = () => {
      // Handle icon animation
      if (iconAnimation !== 'none') {
        if (isIconAnimatingRef.current) {
          iconAnimationRef.current?.pause();
        }
        if (iconAnimation === 'icon-360' && iconAnimations.icon360) {
          iconAnimationRef.current = iconAnimations.icon360.leave(iconElement);
          iconAnimationRef.current.finished.then(() => {
            isIconAnimatingRef.current = false;
          });
          isIconAnimatingRef.current = true;
        }
      }

      // Handle card animation
      if (cardAnimation !== 'none') {
        if (isCardAnimatingRef.current) {
          cardAnimationRef.current?.pause();
        }
        if (cardAnimation === 'thicken-border' && cardAnimations.thickenBorder) {
          cardAnimationRef.current = cardAnimations.thickenBorder.leave(borderElement);
          cardAnimationRef.current.finished.then(() => {
            isCardAnimatingRef.current = false;
          });
          isCardAnimatingRef.current = true;
        }
      }
    };

    cardElement.addEventListener('mouseenter', mouseEnter);
    cardElement.addEventListener('mouseleave', mouseLeave);

    return () => {
      cardElement.removeEventListener('mouseenter', mouseEnter);
      cardElement.removeEventListener('mouseleave', mouseLeave);
      iconAnimationRef.current?.pause();
      cardAnimationRef.current?.pause();
    };
  }, [iconAnimation, cardAnimation]);

  const cardId = `card-title-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="relative h-full" role="article">
      <div 
        ref={cardRef}
        className={className}
        aria-labelledby={cardId}
      >
        <div 
          ref={iconRef}
          className="w-8 h-8 mb-4"
          aria-hidden="true"
        >
          {iconComponent}
        </div>
        <h3 
          id={cardId}
          className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3"
        >
          {title}
        </h3>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
      {/* Animated border overlay */}
      <div 
        ref={borderRef}
        className="absolute inset-0 pointer-events-none border-0 border-current"
        style={{ borderStyle: 'solid' }}
        aria-hidden="true"
      />
    </div>
  );
}

export default ClientServiceCard; 