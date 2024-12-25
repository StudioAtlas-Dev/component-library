'use client';

import React, { useRef } from 'react';
import { AnimeInstance } from 'animejs';
import { getAnimation } from './animations/registry';
import { renderCard } from './index';

interface ClientServiceCardProps {
  title: string;
  description: string;
  className?: string;
  iconComponent: React.ReactNode;
  iconAnimation?: string;
  cardAnimation?: string;
  variant?: 'grid' | 'compact' | 'floating';
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

    // Track all active animations for cleanup
    const activeAnimations: AnimeInstance[] = [];

    const mouseEnter = () => {
      // Clean up any existing animations
      activeAnimations.forEach(anim => anim.pause());
      activeAnimations.length = 0;

      // Handle icon animations
      if (iconAnimation !== 'none') {
        const iconAnimations = iconAnimation.split(' ').filter(Boolean);
        iconAnimations.forEach(animName => {
          const iconAnim = getAnimation('icon', animName);
          if (iconAnim) {
            const animation = iconAnim.enter(iconElement);
            activeAnimations.push(animation);
            if (animName === iconAnimations[iconAnimations.length - 1]) {
              animation.finished.then(() => {
                const index = activeAnimations.indexOf(animation);
                if (index > -1) activeAnimations.splice(index, 1);
              });
            }
          }
        });
      }

      // Handle card animations
      if (cardAnimation !== 'none') {
        const cardAnimations = cardAnimation.split(' ').filter(Boolean);
        cardAnimations.forEach(animName => {
          const cardAnim = getAnimation('card', animName);
          if (cardAnim) {
            const animation = cardAnim.enter(borderElement);
            activeAnimations.push(animation);
            if (animName === cardAnimations[cardAnimations.length - 1]) {
              animation.finished.then(() => {
                const index = activeAnimations.indexOf(animation);
                if (index > -1) activeAnimations.splice(index, 1);
              });
            }
          }
        });
      }
    };

    const mouseLeave = () => {
      // Clean up any existing animations
      activeAnimations.forEach(anim => anim.pause());
      activeAnimations.length = 0;

      // Handle icon animations
      if (iconAnimation !== 'none') {
        const iconAnimations = iconAnimation.split(' ').filter(Boolean);
        iconAnimations.forEach(animName => {
          const iconAnim = getAnimation('icon', animName);
          if (iconAnim) {
            const animation = iconAnim.leave(iconElement);
            activeAnimations.push(animation);
            if (animName === iconAnimations[iconAnimations.length - 1]) {
              animation.finished.then(() => {
                const index = activeAnimations.indexOf(animation);
                if (index > -1) activeAnimations.splice(index, 1);
              });
            }
          }
        });
      }

      // Handle card animations
      if (cardAnimation !== 'none') {
        const cardAnimations = cardAnimation.split(' ').filter(Boolean);
        cardAnimations.forEach(animName => {
          const cardAnim = getAnimation('card', animName);
          if (cardAnim) {
            const animation = cardAnim.leave(borderElement);
            activeAnimations.push(animation);
            if (animName === cardAnimations[cardAnimations.length - 1]) {
              animation.finished.then(() => {
                const index = activeAnimations.indexOf(animation);
                if (index > -1) activeAnimations.splice(index, 1);
              });
            }
          }
        });
      }
    };

    cardElement.addEventListener('mouseenter', mouseEnter);
    cardElement.addEventListener('mouseleave', mouseLeave);

    return () => {
      cardElement.removeEventListener('mouseenter', mouseEnter);
      cardElement.removeEventListener('mouseleave', mouseLeave);
      // Clean up any remaining animations
      activeAnimations.forEach(anim => {
        anim.pause();
        // Ensure animation is at its starting state
        if (anim.progress) {
          anim.seek(0);
        }
      });
      activeAnimations.length = 0;
    };
  }, [iconAnimation, cardAnimation]);

  return renderCard({
    title,
    description,
    className,
    variant,
    children,
    iconContent: iconComponent,
    refs: { cardRef, iconRef, borderRef },
    cardAnimation
  });
}

export default ClientServiceCard; 