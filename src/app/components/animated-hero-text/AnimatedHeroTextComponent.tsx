'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { animateTyping, calculateTextWidth } from './animations/typing';
import { animateBlurAway } from './animations/blur-away';
import { animateFallingLetters } from './animations/falling-letters';

interface AnimatedHeroTextProps {
  words: string[];
  duration?: number;
  className?: string;
  animationType?: 'blur-away' | 'falling-letters' | 'typing';
  wordLifespan?: number;
}

export default function AnimatedHeroTextComponent({
  words,
  duration = 2000,
  className,
  animationType = 'blur-away',
  wordLifespan = 1000,
}: AnimatedHeroTextProps) {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [hasStartedFirstAnimation, setHasStartedFirstAnimation] = useState(false);

  // Cursor style - now completely hidden until first animation
  const cursorStyle = {
    width: '1px',
    left: 0,
    opacity: 0,
    transform: hasStartedFirstAnimation ? undefined : `translateX(${textRef.current ? calculateTextWidth(textRef.current, currentWord) : 0}px)`
  };

  // Main animation trigger
  const animateTransition = useCallback(() => {
    if (!containerRef.current || !textRef.current || isAnimating) return;

    setIsAnimating(true);
    const nextWord = words[words.indexOf(currentWord) + 1] || words[0];

    const onComplete = () => {
      setCurrentWord(nextWord);
      setIsAnimating(false);
    };

    switch (animationType) {
      case 'typing':
        animateTyping({
          textRef,
          containerRef,
          cursorRef,
          currentWord,
          nextWord,
          duration,
          onBegin: () => setHasStartedFirstAnimation(true),
          onComplete
        });
        break;
      case 'falling-letters':
      case 'blur-away':
        if (!hasStartedFirstAnimation) {
          setHasStartedFirstAnimation(true);
          // Call the same animation function but with currentWord as both params
          if (animationType === 'falling-letters') {
            animateFallingLetters({
              textRef,
              currentWord,
              nextWord: currentWord, // Same word for entrance
              duration: duration * 0.5,
              onComplete
            });
          } else {
            animateBlurAway({
              textRef,
              currentWord,
              nextWord: currentWord, // Same word for entrance
              duration: duration * 0.5,
              onComplete
            });
          }
        } else {
          if (animationType === 'falling-letters') {
            animateFallingLetters({
              textRef,
              currentWord,
              nextWord,
              duration,
              onComplete
            });
          } else {
            animateBlurAway({
              textRef,
              currentWord,
              nextWord,
              duration,
              onComplete
            });
          }
        }
        break;
      default:
        break;
    }
  }, [animationType, currentWord, duration, words, isAnimating, hasStartedFirstAnimation]);

  // Initialize text content on mount
  useEffect(() => {
    if (textRef.current && !textRef.current.textContent) {
      textRef.current.textContent = currentWord;
    }
  }, [currentWord]);

  useEffect(() => {
    if (!isAnimating && words.length > 1) {
      const timer = setTimeout(() => {
        animateTransition();
      }, hasStartedFirstAnimation ? wordLifespan : 0);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, words, wordLifespan, duration, animateTransition, hasStartedFirstAnimation]);

  return (
    <div className={twMerge(
      "inline-block relative text-neutral-900 dark:text-neutral-100 px-2",
      className
    )}>
      <style jsx>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      <div ref={containerRef} className="relative inline-flex items-center">
        <div
          ref={textRef}
          className="inline-block whitespace-nowrap overflow-hidden"
        >
          {currentWord}
        </div>
        {animationType === 'typing' && (
          <span
            ref={cursorRef}
            className="absolute top-0 h-full border border-gray-900 dark:border-neutral-100 bg-transparent"
            style={cursorStyle}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}