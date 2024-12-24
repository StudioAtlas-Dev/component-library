'use client';

import React, { useRef } from 'react';
import { AnimeInstance } from 'animejs';
import * as iconAnimations from './animations/iconAnimations';
import * as cardAnimations from './animations/cardAnimations';
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