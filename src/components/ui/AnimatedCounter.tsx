'use client';

import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

interface AnimatedCounterProps {
  /** The final number to count up to */
  endNumber: number;
  /** The suffix to append (e.g., 'K', 'M+') */
  suffix?: string;
  /** Duration of the animation in milliseconds */
  duration?: number;
  /** Whether the animation has played */
  onAnimationComplete?: () => void;
}

export function AnimatedCounter({
  endNumber,
  suffix = '',
  duration = 1000,
  onAnimationComplete
}: AnimatedCounterProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  // Get decimal places for consistent formatting
  const getDecimalPlaces = (num: number): number => {
    return num.toString().split('.')[1]?.length || 0;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (numberRef.current) {
      observer.observe(numberRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && !hasAnimated && numberRef.current) {
      const decimalPlaces = getDecimalPlaces(endNumber);
      
      const animation = anime({
        targets: { value: 0 },
        value: endNumber,
        easing: 'easeInOutExpo',
        duration: duration,
        round: 100, // Update less frequently for performance
        update: (anim) => {
          if (numberRef.current) {
            const value = Number(anim.animations[0].currentValue);
            numberRef.current.textContent = `${value.toFixed(decimalPlaces)}${suffix}`;
          }
        },
        complete: () => {
          if (numberRef.current) {
            numberRef.current.textContent = `${endNumber.toFixed(decimalPlaces)}${suffix}`;
          }
          setHasAnimated(true);
          onAnimationComplete?.();
        }
      });

      return () => animation.pause();
    }
  }, [isInView, hasAnimated, endNumber, duration, onAnimationComplete, suffix]);

  const initialValue = `${(0).toFixed(getDecimalPlaces(endNumber))}${suffix}`;

  return (
    <span ref={numberRef} className="tabular-nums">
      {!hasAnimated ? initialValue : `${endNumber.toFixed(getDecimalPlaces(endNumber))}${suffix}`}
    </span>
  );
} 