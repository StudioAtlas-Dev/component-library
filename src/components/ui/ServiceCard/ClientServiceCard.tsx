'use client';

import { useRef, useEffect } from 'react';
import type { AnimeInstance } from 'animejs';
import { cardAnimations, iconAnimations } from './animations/registry';
import { renderCard } from '.';
import { ServiceCardProps } from './types';

interface ClientServiceCardProps extends Omit<ServiceCardProps, 'icon'> {
  iconComponent: React.ReactNode;
  activeDarkColor: string;
  animationImage?: string;
}

export default function ClientServiceCard({ 
  iconComponent, 
  cardAnimation = 'none',
  iconAnimation = 'none',
  activeDarkColor,
  animationImage,
  ...props 
}: ClientServiceCardProps) {
  // Refs for animation targets
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  // Track active animations for cleanup
  const activeAnimations = useRef<AnimeInstance[]>([]);

  useEffect(() => {
    // Clean up function that cancels all active animations
    return () => {
      activeAnimations.current.forEach(animation => animation.pause());
      activeAnimations.current = [];
    };
  }, []);

  // Set up hover animations
  useEffect(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    const border = borderRef.current;
    if (!card || !icon || !border) return;

    function handleMouseEnter() {
      // Clean up any existing animations
      activeAnimations.current.forEach(animation => animation.pause());
      activeAnimations.current = [];

      // Start new animations
      if (cardAnimation !== 'none') {
        cardAnimation.split(' ').forEach(animationType => {
          const cardAnim = cardAnimations[animationType];
          if (cardAnim && border) {
            const animation = cardAnim.enter(border);
            if (animation) activeAnimations.current.push(animation);
          }
        });
      }

      if (iconAnimation !== 'none') {
        iconAnimation.split(' ').forEach(animationType => {
          const iconAnim = iconAnimations[animationType];
          if (iconAnim && icon) {
            const animation = iconAnim.enter(icon);
            if (animation) activeAnimations.current.push(animation);
          }
        });
      }
    }

    function handleMouseLeave() {
      // Clean up any existing animations
      activeAnimations.current.forEach(animation => animation.pause());
      activeAnimations.current = [];

      // Start new animations
      if (cardAnimation !== 'none') {
        cardAnimation.split(' ').forEach(animationType => {
          const cardAnim = cardAnimations[animationType];
          if (cardAnim && border) {
            const animation = cardAnim.leave(border);
            if (animation) activeAnimations.current.push(animation);
          }
        });
      }

      if (iconAnimation !== 'none') {
        iconAnimation.split(' ').forEach(animationType => {
          const iconAnim = iconAnimations[animationType];
          if (iconAnim && icon) {
            const animation = iconAnim.leave(icon);
            if (animation) activeAnimations.current.push(animation);
          }
        });
      }
    }

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cardAnimation, iconAnimation]);

  return renderCard({
    ...props,
    iconContent: iconComponent,
    refs: { cardRef, iconRef, borderRef },
    cardAnimation,
    activeDarkColor,
    animationImage
  });
} 