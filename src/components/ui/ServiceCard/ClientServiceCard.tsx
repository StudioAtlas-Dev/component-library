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

    const mouseEnter = () => {
      // Handle icon animations - now supports multiple animations separated by spaces
      if (iconAnimation !== 'none') {
        if (isIconAnimatingRef.current) {
          iconAnimationRef.current?.pause();
        }
        // Split animations by spaces and run each one
        const iconAnimations = iconAnimation.split(' ').filter(Boolean);
        iconAnimations.forEach(animName => {
          const iconAnim = getAnimation('icon', animName);
          if (iconAnim) {
            const animation = iconAnim.enter(iconElement);
            // Store the last animation for cleanup
            if (animName === iconAnimations[iconAnimations.length - 1]) {
              iconAnimationRef.current = animation;
              animation.finished.then(() => {
                isIconAnimatingRef.current = false;
              });
            }
          }
        });
        isIconAnimatingRef.current = true;
      }

      // Handle card animations - now supports multiple animations separated by spaces
      if (cardAnimation !== 'none') {
        if (isCardAnimatingRef.current) {
          cardAnimationRef.current?.pause();
        }
        // Split animations by spaces and run each one
        const cardAnimations = cardAnimation.split(' ').filter(Boolean);
        cardAnimations.forEach(animName => {
          const cardAnim = getAnimation('card', animName);
          if (cardAnim) {
            const animation = cardAnim.enter(borderElement);
            // Store the last animation for cleanup
            if (animName === cardAnimations[cardAnimations.length - 1]) {
              cardAnimationRef.current = animation;
              animation.finished.then(() => {
                isCardAnimatingRef.current = false;
              });
            }
          }
        });
        isCardAnimatingRef.current = true;
      }
    };

    const mouseLeave = () => {
      // Handle icon animations - now supports multiple animations separated by spaces
      if (iconAnimation !== 'none') {
        if (isIconAnimatingRef.current) {
          iconAnimationRef.current?.pause();
        }
        // Split animations by spaces and run each one
        const iconAnimations = iconAnimation.split(' ').filter(Boolean);
        iconAnimations.forEach(animName => {
          const iconAnim = getAnimation('icon', animName);
          if (iconAnim) {
            const animation = iconAnim.leave(iconElement);
            // Store the last animation for cleanup
            if (animName === iconAnimations[iconAnimations.length - 1]) {
              iconAnimationRef.current = animation;
              animation.finished.then(() => {
                isIconAnimatingRef.current = false;
              });
            }
          }
        });
        isIconAnimatingRef.current = true;
      }

      // Handle card animations - now supports multiple animations separated by spaces
      if (cardAnimation !== 'none') {
        if (isCardAnimatingRef.current) {
          cardAnimationRef.current?.pause();
        }
        // Split animations by spaces and run each one
        const cardAnimations = cardAnimation.split(' ').filter(Boolean);
        cardAnimations.forEach(animName => {
          const cardAnim = getAnimation('card', animName);
          if (cardAnim) {
            const animation = cardAnim.leave(borderElement);
            // Store the last animation for cleanup
            if (animName === cardAnimations[cardAnimations.length - 1]) {
              cardAnimationRef.current = animation;
              animation.finished.then(() => {
                isCardAnimatingRef.current = false;
              });
            }
          }
        });
        isCardAnimatingRef.current = true;
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