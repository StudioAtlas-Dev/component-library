'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { twMerge } from 'tailwind-merge';

interface AnimatedHeroTextProps {
  words: string[];
  duration?: number;
  className?: string;
  animationType?: 'blur-away';
}

const animations = {
  'blur-away': {
    exit: {
      opacity: [1, 0],
      translateY: [0, -40],
      translateX: [0, 40],
      scale: [1, 2],
      filter: ['blur(0px)', 'blur(8px)'],
      duration: 600,
    },
    entrance: {
      opacity: [0, 1],
      filter: ['blur(8px)', 'blur(0px)'],
      duration: 400,
    }
  }
};

export default function AnimatedHeroTextComponent({
  words,
  duration = 3000,
  className,
  animationType = 'blur-away'
}: AnimatedHeroTextProps) {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextWordRef = useRef<HTMLDivElement>(null);

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const animateTransition = useCallback(() => {
    if (!containerRef.current || !nextWordRef.current || isAnimating) return;

    setIsAnimating(true);
    const nextWord = words[words.indexOf(currentWord) + 1] || words[0];
    
    // Create and position the next word element
    nextWordRef.current.textContent = nextWord;
    nextWordRef.current.style.opacity = '0';
    nextWordRef.current.style.filter = 'blur(8px)';

    const animation = animations[animationType];
    
    // Timeline for current word exit and next word entrance
    const timeline = anime.timeline({
      easing: 'easeInOutSine',
      complete: () => {
        setCurrentWord(nextWord);
        setIsAnimating(false);
      }
    });

    // Exit animation for current word
    timeline.add({
      targets: containerRef.current.firstElementChild,
      ...animation.exit
    })
    // Entrance animation for next word
    .add({
      targets: nextWordRef.current,
      ...animation.entrance
    }, '-=200');

  }, [currentWord, words, isAnimating, animationType]);

  useEffect(() => {
    if (!isAnimating && isClient) {
      const timer = setTimeout(animateTransition, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, animateTransition, isClient]);

  // Server-side and initial client render
  if (!isClient) {
    return (
      <span className={twMerge(
        "inline-block text-neutral-900 dark:text-neutral-100 px-2",
        className
      )}>
        {words[0]}
      </span>
    );
  }

  // Client-side interactive render
  return (
    <div className={twMerge(
      "inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2",
      className
    )}>
      <div ref={containerRef} className="relative">
        <div className="inline-block">{currentWord}</div>
        <div 
          ref={nextWordRef}
          className="absolute top-0 left-0 inline-block"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
} 